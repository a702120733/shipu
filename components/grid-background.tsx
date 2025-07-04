"use client"

import { useEffect, useState } from "react"

interface GridBackgroundProps {
  columns?: number
  opacity?: number
  color?: string
  maxWidth?: string
}

export default function GridBackground({
  columns = 8,
  opacity = 0.08,
  color = "black",
  maxWidth = "1920px",
}: GridBackgroundProps) {
  const [windowWidth, setWindowWidth] = useState(0)

  // 监听窗口大小变化，确保响应式布局
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // 初始化窗口宽度
    setWindowWidth(window.innerWidth)

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // 生成网格的分割线
  const renderGridLines = () => {
    const lines = []

    // 创建分割线 (columns列需要columns-1条分割线)
    for (let i = 1; i < columns; i++) {
      const position = `${(i / columns) * 100}%`
      lines.push(
        <div
          key={i}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: position,
            opacity,
            backgroundColor: color,
          }}
        />,
      )
    }

    return lines
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="relative w-full h-full mx-auto" style={{ maxWidth }}>
        {renderGridLines()}
      </div>
    </div>
  )
}
