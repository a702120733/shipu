"use client"

import { useEffect, useState } from "react"

interface SVGWaveBackgroundProps {
  primaryColor?: string
  secondaryColor?: string
  waveOpacity?: number
}

export default function SVGWaveBackground({
  primaryColor = "rgba(120, 130, 150, 0.15)",
  secondaryColor = "rgba(140, 150, 170, 0.1)",
  waveOpacity = 0.7,
}: SVGWaveBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  // 确保组件只在客户端渲染，并获取窗口尺寸
  useEffect(() => {
    setMounted(true)

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* 背景渐变 - 从左侧白色到右侧浅色 */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(240, 242, 245, 0.4) 50%, ${primaryColor} 100%)`,
        }}
      ></div>

      {/* SVG波纹 */}
      <svg
        className="absolute inset-0 w-full h-full"
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* 创建渐变，从左到右淡入 */}
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0" />
            <stop offset="60%" stopColor={primaryColor} stopOpacity={waveOpacity} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity={waveOpacity} />
          </linearGradient>

          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={secondaryColor} stopOpacity="0" />
            <stop offset="50%" stopColor={secondaryColor} stopOpacity={waveOpacity} />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity={waveOpacity} />
          </linearGradient>
        </defs>

        {/* 波纹1 - 慢速移动的大波浪 */}
        <path
          className="wave-path wave1"
          fill="url(#waveGradient1)"
          d={generateWavePath(dimensions.width, dimensions.height, 0.5, 30, 0.5)}
        />

        {/* 波纹2 - 中速移动的中等波浪 */}
        <path
          className="wave-path wave2"
          fill="url(#waveGradient2)"
          d={generateWavePath(dimensions.width, dimensions.height, 0.65, 25, 0.3)}
        />

        {/* 波纹3 - 快速移动的小波浪 */}
        <path
          className="wave-path wave3"
          fill="url(#waveGradient1)"
          d={generateWavePath(dimensions.width, dimensions.height, 0.8, 20, 0.2)}
        />

        {/* 波纹4 - 非常慢速移动的大波浪 */}
        <path
          className="wave-path wave4"
          fill="url(#waveGradient2)"
          d={generateWavePath(dimensions.width, dimensions.height, 0.4, 35, 0.6)}
        />
      </svg>

      {/* 内联样式，确保动画样式总是可用 */}
      <style jsx>{`
        @keyframes waveAnimation1 {
          0% {
            transform: translateX(0) translateY(0) scale(1.05);
          }
          50% {
            transform: translateX(-2%) translateY(1%) scale(1);
          }
          100% {
            transform: translateX(0) translateY(0) scale(1.05);
          }
        }

        @keyframes waveAnimation2 {
          0% {
            transform: translateX(0) translateY(0) scale(1);
          }
          50% {
            transform: translateX(2%) translateY(-1%) scale(1.03);
          }
          100% {
            transform: translateX(0) translateY(0) scale(1);
          }
        }

        @keyframes waveAnimation3 {
          0% {
            transform: translateX(0) translateY(0) scale(1.02);
          }
          33% {
            transform: translateX(-1%) translateY(1%) scale(1);
          }
          66% {
            transform: translateX(1%) translateY(-1%) scale(1.01);
          }
          100% {
            transform: translateX(0) translateY(0) scale(1.02);
          }
        }

        @keyframes waveAnimation4 {
          0% {
            transform: translateX(0) translateY(0) scale(1);
          }
          50% {
            transform: translateX(-1.5%) translateY(-0.5%) scale(1.02);
          }
          100% {
            transform: translateX(0) translateY(0) scale(1);
          }
        }

        :global(.wave-path) {
          opacity: 0.6;
          transform-origin: center;
        }

        :global(.wave1) {
          animation: waveAnimation1 15s infinite ease-in-out;
        }

        :global(.wave2) {
          animation: waveAnimation2 18s infinite ease-in-out;
        }

        :global(.wave3) {
          animation: waveAnimation3 12s infinite ease-in-out;
        }

        :global(.wave4) {
          animation: waveAnimation4 20s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}

// 生成波浪路径的辅助函数
function generateWavePath(
  width: number,
  height: number,
  verticalPosition: number, // 0-1，表示波浪在垂直方向的位置
  amplitude: number, // 波浪振幅
  frequency: number, // 波浪频率
): string {
  const y = height * verticalPosition

  // 创建波浪路径
  let path = `M0,${height} L0,${y}`

  // 生成波浪点
  const points = 10 // 控制点数量
  const segment = width / points

  for (let i = 0; i <= points; i++) {
    const x = i * segment
    // 使用正弦函数创建波浪效果，添加一些随机性使波浪不那么规则
    const waveY = y + Math.sin(i * frequency) * amplitude + (Math.random() - 0.5) * amplitude * 0.5
    path += ` L${x},${waveY}`
  }

  // 闭合路径
  path += ` L${width},${height} Z`

  return path
}
