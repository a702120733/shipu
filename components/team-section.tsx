"use client"

import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import GridContainer from "./grid-container"
import Image from "next/image"

export default function TeamSection() {
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

  // 团队成就数据
  const achievements = [
    "Champions of the ACM-ICPC World Finals",
    "TopCoder Open winners",
    "Researchers with over 4,000 academic citations",
    "Awardees of competitions such as the Chinese Mathematical Olympiad (CMO) and NOI",
  ]

  // 文字缓入动画变体
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
        staggerChildren: 0.6, // 每个子元素间隔0.6秒
        delayChildren: 0.3, // 整体延迟0.3秒开始
      },
    },
  }

  // 成就列表动画变体
  const achievementVariants = {
    hidden: {
      opacity: 0,
      y: 30, // 改为从下往上出现
    },
    visible: {
      opacity: 1,
      y: 0, // 改为y轴动画
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  // 成就列表容器动画变体
  const achievementContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2, // 成就项依次出现，间隔0.2秒
        delayChildren: 1.5, // 在标题动画完成后开始
      },
    },
  }

  return (
    <div id="team-section" ref={sectionRef} className="w-full h-screen flex flex-col justify-center bg-white">
      <GridContainer className="w-full px-12">
        <motion.div
          className="w-full max-w-6xl my-0"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* 主标题 */}
          <motion.h1
            className="font-bold text-[#3DB7EA] leading-tight mb-20 leading-4 text-6xl"
            variants={fadeInVariants}
            style={{
              fontFamily: "Poppins, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Our team comprises elite
            <br />
            professionals from top
            <br />
            universities worldwide, including :
          </motion.h1>

          {/* 成就列表 */}
          <motion.div className="space-y-8 mb-20 ml-0" variants={achievementContainerVariants}>
            {achievements.map((achievement, index) => (
              <motion.div key={index} className="flex items-start" variants={achievementVariants}>
                {/* 蓝色箭头图标 */}
                <div className="flex-shrink-0 mr-6 mt-2">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-q9hOggYv8QekzGsoLimUXdXnr8U9dh.png"
                    alt="Arrow icon"
                    width={24}
                    height={16}
                    className="object-contain"
                  />
                </div>

                {/* 成就文本 */}
                <p
                  className="font-normal leading-relaxed text-[#3C4043] text-[20px]"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    letterSpacing: "0.01em",
                    lineHeight: "1.6",
                  }}
                >
                  {achievement}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </GridContainer>
    </div>
  )
}
