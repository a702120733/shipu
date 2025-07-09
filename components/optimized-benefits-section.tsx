"use client"

import { motion } from "framer-motion"
import { useRef, useEffect, useState, useMemo } from "react"
import Image from "next/image"
import GridContainer from "./grid-container"

export default function OptimizedBenefitsSection() {
  const [isInView, setIsInView] = useState(false)
  const [iconIndices, setIconIndices] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)
  const animationTriggeredRef = useRef(false)
  const iconRotationIntervalRef = useRef<NodeJS.Timeout>()

  // 使用Intersection Observer检测元素是否在视口中
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !animationTriggeredRef.current) {
          setIsInView(true)
          animationTriggeredRef.current = true
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  // 预加载图标数据 - 使用 useMemo 缓存
  const techIcons = useMemo(
    () => [
      { src: "/images/icons/icon1.png", label: "Cross Pattern" },
      { src: "/images/icons/icon2.png", label: "Data Frame" },
      { src: "/images/icons/icon3.png", label: "Network Flow" },
      { src: "/images/icons/icon4.png", label: "Hexagonal Structure" },
      { src: "/images/icons/icon5.png", label: "Upward Growth" },
      { src: "/images/icons/icon6.png", label: "System Logic" },
      { src: "/images/icons/icon7.png", label: "Circular Process" },
      { src: "/images/icons/icon8.png", label: "Core System" },
      { src: "/images/icons/icon9.png", label: "Downward Flow" },
      { src: "/images/icons/icon10.png", label: "AI Technology" },
      { src: "/images/icons/icon11.png", label: "Data Analytics" },
      { src: "/images/icons/icon12.png", label: "Market Trends" },
    ],
    [],
  )

  // 优化洗牌算法
  const shuffleArray = useMemo(
    () =>
      (array: number[]): number[] => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
      },
    [],
  )

  const generateUniqueIconIndices = useMemo(
    () => (): number[] => {
      const allIndices = Array.from({ length: techIcons.length }, (_, i) => i)
      return shuffleArray(allIndices)
    },
    [techIcons.length, shuffleArray],
  )

  // 初始化图标索引
  useEffect(() => {
    if (isInView && iconIndices.length === 0) {
      setIconIndices(generateUniqueIconIndices())
    }
  }, [isInView, iconIndices.length, generateUniqueIconIndices])

  // 优化图标轮播效果 - 减少频率
  useEffect(() => {
    if (isInView && iconIndices.length > 0) {
      iconRotationIntervalRef.current = setInterval(() => {
        setIconIndices(generateUniqueIconIndices())
      }, 500) // 从200ms增加到500ms，减少CPU使用

      return () => {
        if (iconRotationIntervalRef.current) {
          clearInterval(iconRotationIntervalRef.current)
        }
      }
    }
  }, [isInView, iconIndices.length, generateUniqueIconIndices])

  useEffect(() => {
    return () => {
      if (iconRotationIntervalRef.current) {
        clearInterval(iconRotationIntervalRef.current)
      }
    }
  }, [])

  // 简化动画变体
  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0, delayChildren: 0.3 } },
  }

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  }

  const iconContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0, delayChildren: 0.3 } },
  }

  return (
    <div id="benefits-section" ref={sectionRef} className="w-full h-screen flex flex-col justify-center bg-white">
      <GridContainer className="w-full px-12">
        <motion.div
          className="w-full max-w-6xl my-0"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h1
            className="font-bold text-[#3DB7EA] leading-tight mb-12 text-6xl"
            variants={fadeInVariants}
            style={{
              fontFamily: "var(--font-poppins), sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Our mission is...
          </motion.h1>

          <motion.div className="mb-16" variants={fadeInVariants}>
            <p
              className="font-normal leading-relaxed text-[#3C4043] max-w-4xl text-[20px]"
              style={{
                fontFamily: "var(--font-poppins), sans-serif",
                letterSpacing: "0.01em",
                lineHeight: "1.6",
              }}
            >
              To leverage scalable, generalized automated systems to trade a comprehensive range of securities, futures,
              and other digital markets across both domestic and international platforms.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-start gap-8 mb-20"
            variants={iconContainerVariants}
          >
            {Array.from({ length: 12 }, (_, index) => {
              const iconIndex = iconIndices[index] ?? index
              const currentIcon = techIcons[iconIndex] ?? techIcons[0]

              return (
                <motion.div
                  key={index}
                  className="flex items-center justify-center group cursor-pointer"
                  variants={iconVariants}
                  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                >
                  <Image
                    src={currentIcon.src || "/placeholder.svg"}
                    alt={currentIcon.label}
                    width={32}
                    height={32}
                    className="opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ filter: "brightness(0.2)" }}
                    priority={index < 6} // 只对前6个图标设置优先级
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </GridContainer>
    </div>
  )
}
