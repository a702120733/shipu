"use client"

import { useEffect, useState } from "react"

interface SimpleMatrixBackgroundProps {
  className?: string
  speed?: number
  opacity?: number
}

export default function SimpleMatrixBackground({
  className = "",
  speed = 20, // 滚动速度，数值越小越快
  opacity = 0.6,
}: SimpleMatrixBackgroundProps) {
  const [isClient, setIsClient] = useState(false)

  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* 第一层背景图片 - 从下向上移动 */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url(/images/matrix-background-new.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: opacity,
          animation: `matrixScrollUp ${speed}s linear infinite`,
        }}
      />

      {/* 第二层背景图片，用于无缝循环 - 从下向上移动 */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url(/images/matrix-background-new.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: opacity,
          animation: `matrixScrollUpOffset ${speed}s linear infinite`,
          transform: "translateY(100vh)",
        }}
      />

      {/* 内联样式确保动画可用 */}
      <style jsx>{`
        @keyframes matrixScrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100vh); }
        }
        
        @keyframes matrixScrollUpOffset {
          0% { transform: translateY(100vh); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
