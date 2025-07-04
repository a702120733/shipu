"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

interface PlanetarySystemProps {
  currentSection?: number
}

export default function PlanetarySystem({ currentSection = 0 }: PlanetarySystemProps) {
  const sphereSize = 576 // 球体尺寸
  const ringInnerRadius = sphereSize / 2 + 80 // 圆环内半径
  const ringOuterRadius = ringInnerRadius + 160 // 圆环外半径
  const ringCenterRadius = (ringInnerRadius + ringOuterRadius) / 2 // 圆环中心线半径

  // 四个页面的导航标题及其在圆周上的位置（百分比）
  const navigationItems = [
    { title: "About", startOffset: "0%" }, // 从顶部开始
    { title: "Services", startOffset: "25%" }, // 右侧
    { title: "Join", startOffset: "50%" }, // 底部
    { title: "Contact", startOffset: "75%" }, // 左侧
  ]

  // 生成平滑的螺旋线路径
  const generateSmoothSpiralPath = (
    centerX: number,
    centerY: number,
    maxRadius: number,
    turns: number,
    points: number,
    startAngle = 0,
  ) => {
    const coordinates: { x: number; y: number }[] = []

    // 生成所有坐标点
    for (let i = 0; i <= points; i++) {
      const progress = i / points
      const angle = startAngle + progress * turns * 2 * Math.PI
      const radius = maxRadius * (1 - progress) // 从外向内收拢

      // 移除随机变化，保持完美的圆形
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      coordinates.push({ x, y })
    }

    // 使用简化的平滑曲线连接所有点
    let path = `M ${coordinates[0].x} ${coordinates[0].y}`

    for (let i = 1; i < coordinates.length; i++) {
      const current = coordinates[i]
      const previous = coordinates[i - 1]

      if (i === 1) {
        // 第一段使用直线
        path += ` L ${current.x} ${current.y}`
      } else {
        // 使用简单的平滑曲线，保持圆形特征
        const cp1x = previous.x + (current.x - previous.x) * 0.3
        const cp1y = previous.y + (current.y - previous.y) * 0.3
        const cp2x = previous.x + (current.x - previous.x) * 0.7
        const cp2y = previous.y + (current.y - previous.y) * 0.7

        path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${current.x} ${current.y}`
      }
    }

    return path
  }

  // 生成螺旋线 - 减少数量并保证间距一致
  const spiralPaths = useMemo(() => {
    const centerX = sphereSize / 2
    const centerY = sphereSize / 2
    const maxRadius = sphereSize / 2 - 20
    const spirals = []

    // 只生成2条螺旋线，间距180度，保证完全对称
    for (let i = 0; i < 2; i++) {
      const startAngle = (i / 2) * 2 * Math.PI // 180度间距
      const path = generateSmoothSpiralPath(centerX, centerY, maxRadius, 4, 300, startAngle)
      spirals.push({
        path,
        delay: i * 0.5, // 调整延迟时间
        opacity: 0.7, // 统一透明度
        strokeWidth: 1, // 统一线宽
      })
    }

    return spirals
  }, [sphereSize])

  return (
    <div
      className="fixed right-[-900px] w-[1800px] h-[1800px] z-10"
      style={{
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      {/* 主容器 */}
      <div className="relative w-full h-full">
        {/* 螺旋线中央球体 */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div
            className="relative overflow-visible"
            style={{
              width: `${sphereSize}px`,
              height: `${sphereSize}px`,
            }}
          >
            {/* 导航圆环和弧形文字 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width={ringOuterRadius * 2}
                height={ringOuterRadius * 2}
                viewBox={`0 0 ${ringOuterRadius * 2} ${ringOuterRadius * 2}`}
                className="absolute"
                style={{
                  left: `${sphereSize / 2 - ringOuterRadius}px`,
                  top: `${sphereSize / 2 - ringOuterRadius}px`,
                }}
              >
                {/* 定义路径用于文字跟随 */}
                <defs>
                  <path
                    id="textCircle"
                    d={`M ${ringOuterRadius - ringCenterRadius} ${ringOuterRadius} A ${ringCenterRadius} ${ringCenterRadius} 0 1 1 ${ringOuterRadius + ringCenterRadius} ${ringOuterRadius}`}
                    fill="none"
                  />
                </defs>

                {/* 灰色圆环 */}
                <circle
                  cx={ringOuterRadius}
                  cy={ringOuterRadius}
                  r={ringCenterRadius}
                  fill="none"
                  stroke="rgba(156, 163, 175, 0.3)"
                  strokeWidth="160"
                  opacity="0.6"
                />

                {/* 圆环边界线 */}
                <circle
                  cx={ringOuterRadius}
                  cy={ringOuterRadius}
                  r={ringInnerRadius}
                  fill="none"
                  stroke="rgba(156, 163, 175, 0.4)"
                  strokeWidth="1"
                />
                <circle
                  cx={ringOuterRadius}
                  cy={ringOuterRadius}
                  r={ringOuterRadius}
                  fill="none"
                  stroke="rgba(156, 163, 175, 0.4)"
                  strokeWidth="1"
                />

                {/* 弧形导航文字 */}
                {navigationItems.map((item, index) => (
                  <motion.text
                    key={item.title}
                    className="cursor-pointer select-none"
                    fontSize="63"
                    fontWeight="500"
                    fill={index === currentSection ? "#3DB7EA" : "rgb(107, 114, 128)"}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 2 + index * 0.2,
                      ease: "easeOut",
                    }}
                    style={{
                      fontFamily: "var(--font-league-spartan), sans-serif",
                      transition: "fill 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (index !== currentSection) {
                        e.currentTarget.setAttribute("fill", "#3DB7EA")
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (index !== currentSection) {
                        e.currentTarget.setAttribute("fill", "rgb(107, 114, 128)")
                      }
                    }}
                  >
                    <textPath href="#textCircle" startOffset={item.startOffset}>
                      {item.title}
                    </textPath>
                  </motion.text>
                ))}
              </svg>
            </div>

            {/* SVG 螺旋线容器 */}
            <svg
              width={sphereSize}
              height={sphereSize}
              viewBox={`0 0 ${sphereSize} ${sphereSize}`}
              className="absolute inset-0"
            >
              {/* 背景圆形区域 */}
              <circle
                cx={sphereSize / 2}
                cy={sphereSize / 2}
                r={sphereSize / 2 - 10}
                fill="rgba(61, 183, 234, 0.05)"
                stroke="rgba(61, 183, 234, 0.1)"
                strokeWidth="2"
              />

              {/* 螺旋线 - 只保留2条，间距一致 */}
              {spiralPaths.map((spiral, index) => (
                <motion.path
                  key={index}
                  d={spiral.path}
                  fill="none"
                  stroke="#3DB7EA"
                  strokeWidth={spiral.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={spiral.opacity}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 8,
                    delay: spiral.delay,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    repeatDelay: 3,
                  }}
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(61, 183, 234, 0.4))",
                  }}
                />
              ))}

              {/* 中心点 */}
              <motion.circle
                cx={sphereSize / 2}
                cy={sphereSize / 2}
                r="8"
                fill="#3DB7EA"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  opacity: [0, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  delay: 1,
                  ease: "easeOut",
                }}
                style={{
                  filter: "drop-shadow(0 0 8px rgba(61, 183, 234, 0.6))",
                }}
              />
            </svg>

            {/* 脉冲效果 */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#3DB7EA]/30"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>

        {/* 第一条轨道系统 - 最外层 */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 1800 1800">
            <ellipse
              cx="900"
              cy="900"
              rx="840"
              ry="540"
              fill="none"
              stroke="rgba(60, 64, 67, 0.15)"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
          </svg>

          {/* 外轨道行星 */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            }}
            style={{ transformOrigin: "50% 50%" }}
          >
            <div className="relative w-full h-full">
              <motion.div
                className="absolute w-10 h-10 bg-[#3DB7EA] rounded-full z-30"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: "-20px",
                  marginTop: "-20px",
                }}
                animate={{
                  x: [840, 594, 0, -594, -840, -594, 0, 594, 840],
                  y: [0, -382, -540, -382, 0, 382, 540, 382, 0],
                }}
                transition={{
                  duration: 20,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              ></motion.div>
            </div>
          </motion.div>
        </div>

        {/* 第二条轨道系统 - 中层 */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 1800 1800">
            <ellipse
              cx="900"
              cy="900"
              rx="660"
              ry="420"
              fill="none"
              stroke="rgba(61, 183, 234, 0.12)"
              strokeWidth="1"
              strokeDasharray="3 6"
            />
          </svg>

          {/* 中轨道行星 - 反向旋转 */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: -360 }}
            transition={{
              duration: 15,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            }}
            style={{ transformOrigin: "50% 50%" }}
          >
            <div className="relative w-full h-full">
              <motion.div
                className="absolute w-8 h-8 bg-[#3DB7EA] rounded-full z-30"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: "-16px",
                  marginTop: "-16px",
                }}
                animate={{
                  x: [660, 468, 0, -468, -660, -468, 0, 468, 660],
                  y: [0, -298, -420, -298, 0, 298, 420, 298, 0],
                }}
                transition={{
                  duration: 15,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* 第三条轨道系统 - 内层 */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 1800 1800">
            <ellipse
              cx="900"
              cy="900"
              rx="480"
              ry="300"
              fill="none"
              stroke="rgba(60, 64, 67, 0.1)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          </svg>

          {/* 内轨道行星 */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: 10,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            }}
            style={{ transformOrigin: "50% 50%" }}
          >
            <div className="relative w-full h-full">
              <motion.div
                className="absolute w-6 h-6 bg-[#3DB7EA] rounded-full z-30"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: "-12px",
                  marginTop: "-12px",
                }}
                animate={{
                  x: [480, 340, 0, -340, -480, -340, 0, 340, 480],
                  y: [0, -212, -300, -212, 0, 212, 300, 212, 0],
                }}
                transition={{
                  duration: 10,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* 第四条轨道系统 - 最内层 */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 1800 1800">
            <ellipse
              cx="900"
              cy="900"
              rx="360"
              ry="240"
              fill="none"
              stroke="rgba(61, 183, 234, 0.08)"
              strokeWidth="1"
              strokeDasharray="1 3"
            />
          </svg>

          {/* 最内轨道行星 - 快速旋转 */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: -360 }}
            transition={{
              duration: 6,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            }}
            style={{ transformOrigin: "50% 50%" }}
          >
            <div className="relative w-full h-full">
              <motion.div
                className="absolute w-4 h-4 bg-[#3DB7EA] rounded-full z-30"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: "-8px",
                  marginTop: "-8px",
                }}
                animate={{
                  x: [360, 254, 0, -254, -360, -254, 0, 254, 360],
                  y: [0, -170, -240, -170, 0, 170, 240, 170, 0],
                }}
                transition={{
                  duration: 6,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* 装饰性星点 - 分布在不同位置 */}
        <motion.div
          className="absolute w-2 h-2 bg-[#3DB7EA] rounded-full opacity-40 z-5"
          style={{ left: "20%", top: "25%" }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
        <motion.div
          className="absolute w-2 h-2 bg-[#3C4043] rounded-full opacity-30 z-5"
          style={{ right: "25%", bottom: "20%" }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 5,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            delay: 1.5,
          }}
        />
        <motion.div
          className="absolute w-2 h-2 bg-[#3DB7EA] rounded-full opacity-50 z-5"
          style={{ left: "70%", top: "15%" }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            delay: 2,
          }}
        />
        <motion.div
          className="absolute w-2 h-2 bg-[#3C4043] rounded-full opacity-40 z-5"
          style={{ left: "15%", bottom: "30%" }}
          animate={{
            opacity: [0.4, 0.9, 0.4],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            delay: 0.5,
          }}
        />
      </div>
    </div>
  )
}
