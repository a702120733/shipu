"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import UniversalWelcomeAnimation from "./universal-welcome-animation"
import SimpleMatrixBackground from "./simple-matrix-background"

interface WelcomeAnimationProps {
  onComplete: () => void
  onScroll: () => void
}

export default function WelcomeAnimation({ onComplete, onScroll }: WelcomeAnimationProps) {
  const [isClient, setIsClient] = useState(false)
  const wheelLock = useRef(false)
  const scrollAccumulator = useRef(0)
  const scrollThreshold = 30

  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true)
  }, [])

  console.log("WelcomeAnimation rendered - single page mode")

  // 处理滚轮事件 - 简化为直接进入主界面
  useEffect(() => {
    if (!isClient) return

    function handleWheel(event: WheelEvent) {
      // 防止事件重复触发
      if (wheelLock.current) return

      // 累积滚轮值
      scrollAccumulator.current += Math.abs(event.deltaY)

      // 如果累积值未超过阈值，不触发动作
      if (scrollAccumulator.current < scrollThreshold) return

      // 重置累积值
      scrollAccumulator.current = 0

      // 设置滚轮锁，防止连续触发
      wheelLock.current = true
      setTimeout(() => {
        wheelLock.current = false
      }, 800)

      event.preventDefault()

      // 任何方向的滚动都直接进入主界面
      if (Math.abs(event.deltaY) > 0) {
        console.log("Scroll detected, entering main interface")
        onScroll() // 直接跳转到首页
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      window.removeEventListener("wheel", handleWheel)
    }
  }, [onScroll, isClient])

  // 如果还没有在客户端初始化，返回null而不是显示Loading
  if (!isClient) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
      {/* 简化的字符雨背景效果 - 使用图片滚动 */}
      <SimpleMatrixBackground
        speed={15} // 从30秒减少到15秒，移动更快
        opacity={0.6} // 从0.4增加到0.6，更明显
        className="opacity-60" // 调整整体透明度类
      />

      {/* 主容器 - 完全居中布局 */}
      <div className="w-full h-full flex items-center justify-center relative z-10">
        {/* 动画区域 - 响应式居中容器 */}
        <div className="flex items-center justify-center w-full h-full px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="w-full max-w-6xl flex items-center justify-center">
            <UniversalWelcomeAnimation
              onComplete={() => {}}
              onScroll={() => {}}
              showScrollIndicator={false}
              scaleFactor={1.5}
              backgroundColor="transparent" // 改为透明背景，让字符雨背景显示
              logoLeftColor="#FFFFFF" // 黑色部分改为白色
              logoRightColor="#3DB7EA" // 蓝色部分保持不变
              matrixLeftColor="#FFFFFF" // 矩阵效果的黑色部分也改为白色
              matrixRightColor="#3DB7EA" // 矩阵效果的蓝色部分保持不变
              autoComplete={false}
              className="w-full h-full flex items-center justify-center"
            />
          </div>
        </div>

        {/* 滚动提示 - 响应式底部居中，与其他页面保持一致的尺寸 */}
        <motion.div
          className="absolute bottom-12 sm:bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 text-center z-[110] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="cursor-pointer"
            onClick={onScroll}
          >
            <img
              src="/images/scroll-new.png"
              alt="Scroll to continue"
              className="w-16 h-20 mx-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
