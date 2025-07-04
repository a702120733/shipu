"use client"

import { useEffect, useRef, useState } from "react"

interface DebugWaveBackgroundProps {
  color?: string
  density?: number
  amplitude?: number
}

export default function DebugWaveBackground({
  color = "rgba(100, 120, 150, 0.6)", // 使用更深的颜色，增加可见度
  density = 15,
  amplitude = 25,
}: DebugWaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [debugInfo, setDebugInfo] = useState<string>("初始化中...")
  const [isRendering, setIsRendering] = useState<boolean>(false)
  const animationFrameId = useRef<number>()
  const offset = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      setDebugInfo("Canvas元素未找到")
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setDebugInfo("无法获取Canvas上下文")
      return
    }

    setDebugInfo("Canvas准备就绪，开始渲染...")

    // 设置画布尺寸
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setDebugInfo(`画布尺寸已设置: ${canvas.width}x${canvas.height}`)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // 简单的正弦波动画，确保可见
    const draw = () => {
      if (!ctx) return

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 增加偏移量，使波形移动
      offset.current += 0.05
      setIsRendering(true)

      // 绘制背景，确保Canvas可见
      ctx.fillStyle = "rgba(240, 240, 240, 0.3)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 绘制多条波浪线
      for (let i = 0; i < density; i++) {
        const y = (canvas.height / density) * i + 10

        ctx.beginPath()
        ctx.strokeStyle = color
        ctx.lineWidth = 2

        // 绘制一条正弦波
        for (let x = 0; x < canvas.width; x += 5) {
          // 使用正弦函数创建波形，添加偏移使其移动
          const waveHeight = Math.sin(x * 0.01 + offset.current + i * 0.5) * amplitude
          const yPos = y + waveHeight

          if (x === 0) {
            ctx.moveTo(x, yPos)
          } else {
            ctx.lineTo(x, yPos)
          }
        }

        ctx.stroke()
      }

      // 添加一个明显的标记，确保Canvas在渲染
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
      ctx.fillRect(canvas.width - 50, 10, 40, 40)

      // 更新调试信息
      setDebugInfo(`正在渲染: 偏移=${offset.current.toFixed(2)}, 时间=${new Date().toLocaleTimeString()}`)

      // 继续动画循环
      animationFrameId.current = requestAnimationFrame(draw)
    }

    // 开始动画
    draw()

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
        setIsRendering(false)
      }
    }
  }, [color, density, amplitude])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full"
        style={{
          zIndex: -1,
          border: "1px solid red", // 添加边框以确保Canvas可见
        }}
      />

      {/* 调试信息面板 */}
      <div
        className="fixed bottom-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg z-50 text-sm"
        style={{ maxWidth: "300px" }}
      >
        <p>调试信息:</p>
        <p>{debugInfo}</p>
        <p>渲染状态: {isRendering ? "正在渲染" : "未渲染"}</p>
        <p>
          Canvas尺寸: {canvasRef.current?.width || 0}x{canvasRef.current?.height || 0}
        </p>
        <p>浏览器: {navigator.userAgent}</p>
      </div>
    </>
  )
}
