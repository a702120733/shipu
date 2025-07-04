"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface ConstellationNavigationProps {
  currentSection: number
  setCurrentSection: (section: number) => void
}

export default function ConstellationNavigation({ currentSection, setCurrentSection }: ConstellationNavigationProps) {
  const sections = ["About", "Services", "Join", "Contact"]
  const containerRef = useRef<HTMLDivElement>(null)
  const [dotPositions, setDotPositions] = useState<{ x: number; y: number }[]>([])
  const [rightOffset, setRightOffset] = useState("4")

  // 计算右侧偏移量，考虑GridContainer的居中效果
  useEffect(() => {
    if (typeof window === "undefined") return

    const calculateRightOffset = () => {
      const screenWidth = window.innerWidth
      const maxWidth = 1920 // GridContainer的最大宽度

      if (screenWidth <= maxWidth) {
        // 屏幕宽度小于等于最大宽度时，使用响应式边距
        if (screenWidth >= 1536) {
          // 2xl
          setRightOffset("7.5rem") // 30 * 0.25rem = 7.5rem
        } else if (screenWidth >= 1280) {
          // xl
          setRightOffset("4rem") // 16 * 0.25rem = 4rem
        } else if (screenWidth >= 1024) {
          // lg
          setRightOffset("3rem") // 12 * 0.25rem = 3rem
        } else if (screenWidth >= 768) {
          // md
          setRightOffset("2rem") // 8 * 0.25rem = 2rem
        } else if (screenWidth >= 640) {
          // sm
          setRightOffset("1rem") // 4 * 0.25rem = 1rem
        } else {
          setRightOffset("0.5rem") // 2 * 0.25rem = 0.5rem
        }
      } else {
        // 超宽屏幕时，计算居中后的边距
        const containerMargin = (screenWidth - maxWidth) / 2
        const contentPadding = 120 // 2xl:px-30 = 7.5rem = 120px
        const totalOffset = containerMargin + contentPadding
        setRightOffset(`${totalOffset}px`)
      }
    }

    calculateRightOffset()
    window.addEventListener("resize", calculateRightOffset)

    return () => {
      window.removeEventListener("resize", calculateRightOffset)
    }
  }, [])

  // 计算点的位置
  useEffect(() => {
    if (!containerRef.current) return

    const updatePositions = () => {
      const dots = containerRef.current?.querySelectorAll(".nav-dot") || []
      const container = containerRef.current?.getBoundingClientRect()

      if (!container || dots.length === 0) return

      const newPositions = Array.from(dots).map((dot) => {
        const rect = dot.getBoundingClientRect()
        return {
          x: rect.left + rect.width / 2 - container.left,
          y: rect.top + rect.height / 2 - container.top,
        }
      })

      setDotPositions(newPositions)
    }

    // 初始化位置
    updatePositions()

    // 监听窗口大小变化
    window.addEventListener("resize", updatePositions)

    return () => {
      window.removeEventListener("resize", updatePositions)
    }
  }, [currentSection, rightOffset])

  // 处理导航点击
  const handleNavClick = (index: number) => {
    if (index !== currentSection) {
      // 阻止事件冒泡，避免干扰滚动
      setCurrentSection(index)
    }
  }

  return (
    <motion.div
      ref={containerRef}
      className="fixed top-1/2 transform -translate-y-1/2 z-50 pointer-events-auto"
      style={{ right: rightOffset }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="relative w-24 h-64 flex flex-col items-center justify-center">
        {/* 星座连线 SVG - 只保留主要导航点之间的连线 */}
        <svg className="absolute top-0 left-0 w-full h-full -z-10">
          {dotPositions.length > 0 &&
            dotPositions.map((_, i) => {
              if (i < dotPositions.length - 1) {
                const startDot = dotPositions[i]
                const endDot = dotPositions[i + 1]

                return (
                  <motion.line
                    key={`line-${i}`}
                    x1={startDot.x}
                    y1={startDot.y}
                    x2={endDot.x}
                    y2={endDot.y}
                    stroke={i === currentSection || i === currentSection - 1 ? "#3C4043" : "rgba(156, 163, 175, 0.5)"}
                    strokeWidth={i === currentSection || i === currentSection - 1 ? "1.5" : "1"}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 + i * 0.2 }}
                  />
                )
              }
              return null
            })}
        </svg>

        {/* 导航点 */}
        <div className="flex flex-col items-center space-y-6">
          {sections.map((section, index) => (
            <button key={section} onClick={() => handleNavClick(index)} className="group flex items-center">
              <motion.span
                className={`nav-dot w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSection === index ? "w-3 h-3 bg-[#3C4043]" : "bg-gray-300 group-hover:bg-gray-600"
                }`}
                initial={false}
                animate={
                  currentSection === index
                    ? {
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1],
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
              ></motion.span>
              <span className={`ml-3 text-sm transition-all duration-300 opacity-0 group-hover:opacity-100`}>
                {section}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
