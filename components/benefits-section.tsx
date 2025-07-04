"use client"

import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import GridContainer from "./grid-container"

export default function BenefitsSection() {
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

  // 技术图标数据 - 完整的12个图片图标
  const techIcons = [
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
  ]

  // Fisher-Yates 洗牌算法，生成不重复的随机排列
  const shuffleArray = (array: number[]): number[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // 生成12个不重复的图标索引
  const generateUniqueIconIndices = (): number[] => {
    // 创建包含所有图标索引的数组
    const allIndices = Array.from({ length: techIcons.length }, (_, i) => i)
    // 洗牌并返回前12个（因为我们有12个图标，所以正好是全部）
    return shuffleArray(allIndices)
  }

  // 初始化图标索引
  useEffect(() => {
    if (isInView && iconIndices.length === 0) {
      setIconIndices(generateUniqueIconIndices())
    }
  }, [isInView, iconIndices.length])

  // 图标轮播效果 - 移除延迟，立即开始轮播
  useEffect(() => {
    if (isInView && iconIndices.length > 0) {
      // 立即开始轮播，不再有延迟
      iconRotationIntervalRef.current = setInterval(() => {
        setIconIndices(generateUniqueIconIndices())
      }, 200) // 每0.2秒切换一次

      return () => {
        if (iconRotationIntervalRef.current) {
          clearInterval(iconRotationIntervalRef.current)
        }
      }
    }
  }, [isInView, iconIndices.length])

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (iconRotationIntervalRef.current) {
        clearInterval(iconRotationIntervalRef.current)
      }
    }
  }, [])

  // 文字缓入动画变体 - 移除模糊效果
  const fadeInVariants = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  // 容器动画变体
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0, // 改为0，让所有子元素同时出现
        delayChildren: 0.3, // 整体延迟0.3秒开始
      },
    },
  }

  // 图标动画变体
  const iconVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  // 图标容器动画变体
  const iconContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0, // 图标同时出现
        delayChildren: 0.3, // 与其他内容同时开始
      },
    },
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
          {/* 主标题 */}
          <motion.h1
            className="font-bold text-[#3DB7EA] leading-tight mb-12 leading-4 text-6xl"
            variants={fadeInVariants}
            style={{
              fontFamily: "var(--font-poppins), sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Our mission is...
          </motion.h1>

          {/* 使命描述文字 */}
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

          {/* 技术图标行 */}
          <motion.div
            className="flex flex-wrap items-center justify-start gap-8 mb-20"
            variants={iconContainerVariants}
          >
            {Array.from({ length: 12 }, (_, index) => {
              // 获取当前位置应该显示的图标索引
              const iconIndex = iconIndices[index] ?? index
              const currentIcon = techIcons[iconIndex] ?? techIcons[0]

              return (
                <motion.div
                  key={index}
                  className="flex items-center justify-center group cursor-pointer"
                  variants={iconVariants}
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Image
                    src={currentIcon.src || "/placeholder.svg"}
                    alt={currentIcon.label}
                    width={32}
                    height={32}
                    className="opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      filter: "brightness(0.2)", // 将图标变为深色以匹配原来的颜色
                    }}
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
