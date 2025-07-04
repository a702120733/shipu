"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

interface OrbitalNavigationProps {
  currentSection: number
  setCurrentSection: (section: number) => void
}

export default function OrbitalNavigation({ currentSection, setCurrentSection }: OrbitalNavigationProps) {
  const sections = ["About", "Services", "Join", "Contact"]

  // 轨道配置 - 调整到更合适的位置
  const orbitConfig = useMemo(
    () => ({
      centerX: 1200, // 向右移动轨道中心
      centerY: 900,
      rx: 400, // 减小椭圆长轴
      ry: 250, // 减小椭圆短轴
    }),
    [],
  )

  // 计算每个导航球在轨道上的位置
  const getPositionOnOrbit = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2 // 从顶部开始
    const x = orbitConfig.centerX + orbitConfig.rx * Math.cos(angle)
    const y = orbitConfig.centerY + orbitConfig.ry * Math.sin(angle)
    return { x, y, angle }
  }

  // 计算当前激活球应该在的可见位置
  const getVisiblePosition = () => {
    if (typeof window === "undefined") {
      return { x: 1200, y: 400 } // 默认值
    }

    // 右侧可见区域的位置 - 调整到更合适的位置
    return {
      x: window.innerWidth - 120, // 距离右边缘120px
      y: window.innerHeight / 2, // 垂直居中
    }
  }

  // 处理导航点击
  const handleNavigationClick = (index: number) => {
    if (index !== currentSection) {
      setCurrentSection(index)
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* 轨道线 - 调整viewBox以适应新的轨道位置 */}
      <svg className="w-full h-full" viewBox="0 0 2000 1800">
        <ellipse
          cx={orbitConfig.centerX}
          cy={orbitConfig.centerY}
          rx={orbitConfig.rx}
          ry={orbitConfig.ry}
          fill="none"
          stroke="rgba(61, 183, 234, 0.2)"
          strokeWidth="2"
          strokeDasharray="6 12"
        />
      </svg>

      {/* 导航球 */}
      {sections.map((section, index) => {
        const isActive = index === currentSection
        const orbitPosition = getPositionOnOrbit(index, sections.length)
        const visiblePosition = getVisiblePosition()

        // 计算目标位置
        const targetPosition = isActive ? visiblePosition : orbitPosition

        // 计算其他球的缩放和透明度
        const scale = isActive ? 1.5 : 0.6
        const opacity = isActive ? 1 : 0.4

        return (
          <motion.div
            key={section}
            className="absolute pointer-events-auto cursor-pointer z-50"
            style={{
              width: "48px",
              height: "48px",
              marginLeft: "-24px",
              marginTop: "-24px",
            }}
            initial={false}
            animate={{
              x: targetPosition.x,
              y: targetPosition.y,
              scale,
              opacity,
            }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
              duration: 1.2,
            }}
            onClick={() => handleNavigationClick(index)}
            whileHover={{ scale: isActive ? 1.6 : 0.7 }}
            whileTap={{ scale: isActive ? 1.4 : 0.5 }}
          >
            {/* 导航球主体 */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center relative transition-all duration-500 ${
                isActive
                  ? "bg-[#3DB7EA] shadow-xl shadow-[#3DB7EA]/40 border-2 border-white"
                  : "bg-[#3C4043] hover:bg-[#3DB7EA] shadow-lg"
              }`}
            >
              {/* 球体内部光效 */}
              <div
                className={`absolute inset-1 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-br from-white/40 to-transparent"
                    : "bg-gradient-to-br from-white/20 to-transparent"
                }`}
              />

              {/* 导航点 */}
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${isActive ? "bg-white shadow-sm" : "bg-white/70"}`}
              />
            </div>

            {/* 标签 - 只在激活时显示 */}
            <motion.div
              className="absolute left-full ml-6 top-1/2 transform -translate-y-1/2 whitespace-nowrap"
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: isActive ? 1 : 0,
                x: isActive ? 0 : -20,
              }}
              transition={{ duration: 0.4, delay: isActive ? 0.3 : 0 }}
            >
              <span className="text-xl font-medium text-[#3C4043] bg-white/95 px-4 py-2 rounded-full shadow-lg border border-gray-100">
                {section}
              </span>
            </motion.div>

            {/* 激活状态的光环效果 */}
            {isActive && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#3DB7EA]/60"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-[#3DB7EA]/40"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{
                    scale: [1, 2.2, 1],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />
              </>
            )}
          </motion.div>
        )
      })}

      {/* 连接线 - 从轨道到可见位置 */}
      {sections.map((_, index) => {
        const isActive = index === currentSection
        if (!isActive) return null

        const orbitPosition = getPositionOnOrbit(index, sections.length)
        const visiblePosition = getVisiblePosition()

        return (
          <motion.svg
            key={`connection-${index}`}
            className="absolute inset-0 w-full h-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <line
              x1={orbitPosition.x}
              y1={orbitPosition.y}
              x2={visiblePosition.x}
              y2={visiblePosition.y}
              stroke="rgba(61, 183, 234, 0.5)"
              strokeWidth="2"
              strokeDasharray="8 12"
            />
          </motion.svg>
        )
      })}

      {/* 轨道上的位置指示器 */}
      {sections.map((_, index) => {
        const isActive = index === currentSection
        if (isActive) return null // 激活的球已经移到可见位置

        const position = getPositionOnOrbit(index, sections.length)

        return (
          <motion.div
            key={`indicator-${index}`}
            className="absolute w-4 h-4 rounded-full bg-[#3DB7EA]/30 border-2 border-[#3DB7EA]/50 pointer-events-none"
            style={{
              left: position.x - 8,
              top: position.y - 8,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: index * 0.6,
            }}
          />
        )
      })}
    </div>
  )
}
