"use client"

import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import GridContainer from "./grid-container"

export default function ServicesSection() {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const animationTriggeredRef = useRef(false)

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

  // 文字缓入动画变体 - 移除模糊效果
  const fadeInVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.0,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  // 容器动画变体 - 用于依次显示元素
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.4, // 每个子元素间隔0.4秒
        delayChildren: 0.2, // 整体延迟0.2秒开始
      },
    },
  }

  // 引号动画变体
  const quoteVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  return (
    <div id="services-section" ref={sectionRef} className="w-full h-screen flex items-center justify-center bg-white">
      <GridContainer className="w-full px-12">
        <motion.div
          className="w-full flex flex-col max-w-7xl mx-0"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* 上方：标题（左侧对齐） */}
          <div className="mb-16">
            <motion.div className="flex flex-col items-start" variants={fadeInVariants}>
              <h2
                className="font-bold text-[#3DB7EA] leading-tight text-6xl"
                style={{
                  fontFamily: "var(--font-poppins), sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                About
                <br />
                FFT Investment
              </h2>
            </motion.div>
          </div>

          {/* 下方：正文模块（左侧对齐） */}
          <div className="mb-0">
            <motion.div className="flex flex-col items-start" variants={fadeInVariants}>
              {/* 引号图标 - 在正文上方 */}
              <motion.div className="mb-6" variants={quoteVariants}>
                <svg
                  width="80"
                  height="60"
                  viewBox="0 0 80 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-300"
                >
                  <path
                    d="M15 45C15 35.059 22.059 27 32 27V15C15.431 15 2 28.431 2 45V52C2 56.418 5.582 60 10 60H25C29.418 60 33 56.418 33 52V45C33 40.582 29.418 37 25 37H15V45Z"
                    fill="currentColor"
                  />
                  <path
                    d="M62 45C62 35.059 69.059 27 79 27V15C62.431 15 49 28.431 49 45V52C49 56.418 52.582 60 57 60H72C76.418 60 80 56.418 80 52V45C80 40.582 76.418 37 72 37H62V45Z"
                    fill="currentColor"
                  />
                </svg>
              </motion.div>

              {/* 主要文本内容 - 在引号下方 */}
              <div className="max-w-4xl">
                <p
                  className="leading-relaxed text-[#3C4043] text-[20px] font-normal"
                  style={{
                    fontFamily: "var(--font-poppins), sans-serif",
                    letterSpacing: "0.01em",
                    lineHeight: "1.6",
                  }}
                >
                  FFT Investment is a quantitative technology firm founded in 2022, committed to delivering sustainable
                  and stable returns through advanced data analysis and high-performance distributed artificial
                  intelligence.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </GridContainer>
    </div>
  )
}
