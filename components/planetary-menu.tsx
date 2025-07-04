"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"

interface PlanetaryMenuProps {
  pathname: string
  menuLinks: { href: string; label: string }[]
  onLinkClick: () => void
}

export default function PlanetaryMenu({ pathname, menuLinks, onLinkClick }: PlanetaryMenuProps) {
  const [isClient, setIsClient] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState({ width: 1200, height: 800 })

  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true)

    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // 完全照搬原来的配置
  const sphereSize = 576 // 球体尺寸
  const ringInnerRadius = sphereSize / 2 + 80 // 圆环内半径
  const ringOuterRadius = ringInnerRadius + 160 // 圆环外半径
  const ringCenterRadius = (ringInnerRadius + ringOuterRadius) / 2 // 圆环中心线半径

  // 导航标题及其在圆周上的位置（百分比）- 调整为3个选项
  const navigationItems = [
    { title: "Home", startOffset: "15%" }, // 从15%开始
    { title: "Career", startOffset: "50%" }, // 中间位置
    { title: "Contact", startOffset: "85%" }, // 结束位置
  ]

  // 生成平滑的螺旋线路径 - 完全照搬
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

  // 生成螺旋线 - 完全照搬
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

  if (!isClient) {
    return null
  }

  // 找到当前激活的导航项索引
  const currentIndex = menuLinks.findIndex((link) => link.href === pathname)

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{
        width: "100vw",
        height: "100vh",
        // 将整个容器下移，只露出上半部分
        transform: "translateY(50%)",
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

                {/* 弧形导航文字 - 大幅提前出现时间 */}
                {navigationItems.map((item, index) => (
                  <motion.text
                    key={item.title}
                    className="cursor-pointer select-none pointer-events-auto"
                    fontSize="63"
                    fontWeight="500"
                    fill={index === currentIndex ? "#3DB7EA" : "#3C4043"}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.4, // 缩短动画时间
                      delay: 0.1 + index * 0.05, // 大幅减少延迟时间，从2秒减少到0.1秒
                      ease: "easeOut",
                    }}
                    style={{
                      fontFamily: "var(--font-league-spartan), sans-serif",
                      transition: "fill 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (index !== currentIndex) {
                        e.currentTarget.setAttribute("fill", "#3DB7EA")
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (index !== currentIndex) {
                        e.currentTarget.setAttribute("fill", "#3C4043")
                      }
                    }}
                    onClick={() => {
                      // 处理点击事件
                      if (menuLinks[index]) {
                        onLinkClick()
                        // 这里需要手动导航，因为SVG text不能直接包含Link
                        window.location.href = menuLinks[index].href
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

              {/* 简化的中心点 - 移除动画，只保留静态圆点 */}
              <circle cx={sphereSize / 2} cy={sphereSize / 2} r="4" fill="#3DB7EA" opacity="0.8" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
