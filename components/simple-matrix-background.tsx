"use client"

import { useEffect, useState } from "react"

interface SimpleMatrixBackgroundProps {
  className?: string
  speed?: number
  opacity?: number
}

export default function SimpleMatrixBackground({
  className = "",
  speed = 15, // 滚动速度，数值越小越快
  opacity = 0.6,
}: SimpleMatrixBackgroundProps) {
  const [isClient, setIsClient] = useState(false)

  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true)

    // 动态添加CSS动画到head
    if (typeof document !== "undefined") {
      const styleId = "matrix-background-styles"
      const existingStyle = document.getElementById(styleId)

      if (!existingStyle) {
        const style = document.createElement("style")
        style.id = styleId
        style.textContent = `
          @keyframes matrix-scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100vw); }
          }
          
          @keyframes matrix-scroll-left-offset {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(0); }
          }
          
          .matrix-bg-1 {
            animation: matrix-scroll-left ${speed}s linear infinite;
          }
          
          .matrix-bg-2 {
            animation: matrix-scroll-left-offset ${speed}s linear infinite;
          }
        `
        document.head.appendChild(style)
      }
    }
  }, [speed])

  if (!isClient) {
    return null
  }

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* 第一层背景图片 - 从右向左移动 */}
      <div
        className="matrix-bg-1 absolute inset-0 w-[200vw] h-full"
        style={{
          backgroundImage: "url(/images/matrix-background.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          backgroundPosition: "0 0",
          opacity: opacity,
        }}
      />

      {/* 第二层背景图片，用于无缝循环 - 从右向左移动 */}
      <div
        className="matrix-bg-2 absolute inset-0 w-[200vw] h-full"
        style={{
          backgroundImage: "url(/images/matrix-background.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          backgroundPosition: "0 0",
          opacity: opacity,
        }}
      />
    </div>
  )
}
