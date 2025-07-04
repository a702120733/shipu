"use client"

import { useEffect, useRef, useState } from "react"

interface RippleBackgroundProps {
  color?: string
  opacity?: number
  stripeWidth?: number
  rippleStrength?: number
}

export default function RippleBackground({
  color = "rgba(180, 180, 180, 0.5)", // 更深的灰色
  opacity = 0.3, // 增加整体不透明度
  stripeWidth = 30, // 减小条纹宽度
  rippleStrength = 50, // 增加波纹强度
}: RippleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 })
  const ripples = useRef<{ x: number; y: number; radius: number; strength: number; age: number }[]>([])
  const animationFrameId = useRef<number>()
  const isHovering = useRef(false)

  // 设置画布尺寸
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // 处理鼠标移动
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // 添加新的波纹 - 移除isHovering条件，确保总是生成波纹
      if (Math.random() < 0.3) {
        // 只在30%的移动事件中添加波纹，避免过多
        ripples.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 0,
          strength: rippleStrength,
          age: 0,
        })
      }
    }

    // 移除不需要的鼠标进入/离开事件
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [rippleStrength])

  // 绘制波纹动画
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布尺寸
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // 绘制函数
    const draw = () => {
      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 绘制斑马纹背景
      const stripeCount = Math.ceil(canvas.width / stripeWidth)
      for (let i = 0; i < stripeCount; i++) {
        ctx.fillStyle = i % 2 === 0 ? color : `rgba(240, 240, 240, ${opacity})`
        ctx.fillRect(i * stripeWidth, 0, stripeWidth, canvas.height)
      }

      // 更新和绘制波纹
      ripples.current.forEach((ripple, index) => {
        ripple.radius += 3 // 增加波纹扩散速度
        ripple.age += 1
        ripple.strength *= 0.98 // 减缓波纹强度衰减

        // 如果波纹太弱或太大，则移除
        if (ripple.strength < 0.5 || ripple.radius > 500) {
          // 增加波纹最大半径
          ripples.current.splice(index, 1)
          return
        }

        // 绘制波纹扭曲效果
        for (let i = 0; i < stripeCount; i++) {
          const stripeX = i * stripeWidth

          // 计算波纹对每个条纹的影响
          const distX = stripeX - ripple.x
          const distY = canvas.height / 2 - ripple.y
          const dist = Math.sqrt(distX * distX + distY * distY)

          // 波纹影响范围 - 增加影响范围
          if (dist < ripple.radius + 150 && dist > ripple.radius - 150) {
            const impact = (1 - Math.abs(dist - ripple.radius) / 150) * ripple.strength

            // 绘制扭曲的条纹 - 增加对比度
            ctx.fillStyle = i % 2 === 0 ? color : `rgba(250, 250, 250, ${opacity + 0.1})` // 增加亮条纹的亮度

            // 创建波浪形状 - 增加波动幅度
            const waveOffset = Math.sin((dist - ripple.radius) / 20) * impact * 15

            ctx.beginPath()
            ctx.moveTo(stripeX, 0)

            // 绘制波浪形状的条纹 - 增加扭曲效果
            for (let y = 0; y < canvas.height; y += 5) {
              const xOffset =
                Math.sin(y / 15 + ripple.age / 4) * // 增加频率
                impact *
                1.5 * // 增加幅度
                Math.exp(-Math.pow(y - ripple.y, 2) / (2 * Math.pow(150, 2))) // 增加影响范围
              ctx.lineTo(stripeX + xOffset + waveOffset, y)
            }

            ctx.lineTo(stripeX, canvas.height)
            ctx.lineTo(stripeX, 0)
            ctx.closePath()
            ctx.fill()
          }
        }
      })

      // 继续动画循环
      animationFrameId.current = requestAnimationFrame(draw)
    }

    // 开始动画
    draw()

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [dimensions, color, opacity, stripeWidth, mousePosition])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 1 }} // 确保canvas完全不透明
    />
  )
}
