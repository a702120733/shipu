"use client"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"

interface NavigationProps {
  currentSection: number
  setCurrentSection: (section: number) => void
}

export default function Navigation({ currentSection, setCurrentSection }: NavigationProps) {
  const sections = ["About", "Services", "Join", "Contact"]
  const navRef = useRef<HTMLDivElement>(null)

  // 使用useEffect来绘制连接线
  useEffect(() => {
    if (!navRef.current) return

    // 获取所有导航点的位置
    const dots = navRef.current.querySelectorAll(".nav-dot")
    if (dots.length === 0) return

    // 创建或获取SVG元素
    let svg = navRef.current.querySelector("svg")
    if (!svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("class", "absolute top-0 left-0 w-full h-full -z-10")
      navRef.current.appendChild(svg)
    } else {
      // 清除现有的线条
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild)
      }
    }

    // 绘制连接线
    for (let i = 0; i < dots.length - 1; i++) {
      const dot1 = dots[i].getBoundingClientRect()
      const dot2 = dots[i + 1].getBoundingClientRect()

      // 计算相对于导航容器的位置
      const navRect = navRef.current.getBoundingClientRect()

      const x1 = dot1.left + dot1.width / 2 - navRect.left
      const y1 = dot1.top + dot1.height / 2 - navRect.top
      const x2 = dot2.left + dot2.width / 2 - navRect.left
      const y2 = dot2.top + dot2.height / 2 - navRect.top

      // 创建线条
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
      line.setAttribute("x1", x1.toString())
      line.setAttribute("y1", y1.toString())
      line.setAttribute("x2", x2.toString())
      line.setAttribute("y2", y2.toString())
      line.setAttribute("stroke", "rgba(156, 163, 175, 0.5)") // 灰色半透明
      line.setAttribute("stroke-width", "1")

      // 如果当前部分包含此线条，使其更明显
      if (i === currentSection || i === currentSection - 1) {
        line.setAttribute("stroke", "#3C4043")
        line.setAttribute("stroke-width", "1.5")
      }

      svg.appendChild(line)
    }
  }, [currentSection])

  return (
    <motion.div
      ref={navRef}
      className="fixed right-10 top-1/2 transform -translate-y-1/2 z-50 h-64 w-24 flex flex-col items-center justify-center"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="flex flex-col items-center space-y-6 relative">
        {sections.map((section, index) => (
          <button key={section} onClick={() => setCurrentSection(index)} className="group flex items-center">
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
            <span
              className={`ml-3 text-sm transition-all duration-300 ${
                currentSection === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              {section}
            </span>
          </button>
        ))}

        {/* 添加星座效果的装饰点 */}
        <motion.div
          className="absolute -left-4 top-1/4 w-1 h-1 rounded-full bg-gray-400"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [0.8, 1, 0.8],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute -right-2 bottom-1/3 w-1 h-1 rounded-full bg-gray-400"
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [0.7, 1, 0.7],
          }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
        />
      </div>
    </motion.div>
  )
}
