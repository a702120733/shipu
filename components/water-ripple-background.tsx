"use client"

import { useEffect, useRef } from "react"

interface WaterRippleBackgroundProps {
  color?: string
  opacity?: number
  rippleStrength?: number
}

export default function WaterRippleBackground({
  color = "rgba(230, 230, 230, 0.8)",
  opacity = 0.7,
  rippleStrength = 15,
}: WaterRippleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number>()
  const mousePosition = useRef({ x: -1000, y: -1000 })
  const ripples = useRef<{ x: number; y: number; radius: number; strength: number; age: number }[]>([])
  const time = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布尺寸
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // 处理鼠标移动
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }

      // 只在右半侧添加波纹
      if (e.clientX > window.innerWidth * 0.4 && Math.random() < 0.3) {
        ripples.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 0,
          strength: rippleStrength,
          age: 0,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    // 自动添加波纹
    const addRandomRipple = () => {
      // 只在右半侧添加随机波纹
      const x = Math.random() * (window.innerWidth * 0.6) + window.innerWidth * 0.4
      const y = Math.random() * window.innerHeight

      ripples.current.push({
        x,
        y,
        radius: 0,
        strength: rippleStrength * 0.7, // 自动波纹强度稍弱
        age: 0,
      })

      // 每2-5秒添加一个随机波纹
      setTimeout(addRandomRipple, 2000 + Math.random() * 3000)
    }

    // 开始添加随机波纹
    setTimeout(addRandomRipple, 1000)

    // 绘制函数
    const draw = () => {
      if (!canvas || !ctx) return

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 增加时间
      time.current += 0.01

      // 创建从左到右的渐变
      const gradient = ctx.createLinearGradient(canvas.width * 0.3, 0, canvas.width, 0)
      gradient.addColorStop(0, "rgba(255, 255, 255, 0)") // 左侧完全透明
      gradient.addColorStop(1, color) // 右侧使用指定颜色

      // 绘制基础水波纹
      ctx.fillStyle = gradient
      ctx.beginPath()

      // 从左到右绘制波浪
      ctx.moveTo(canvas.width * 0.3, 0)

      for (let x = canvas.width * 0.3; x <= canvas.width; x += 10) {
        // 计算基础波浪高度
        const baseWaveHeight = Math.sin(x * 0.01 + time.current) * 10 + Math.cos(x * 0.02 - time.current * 1.5) * 8

        // 计算所有波纹的影响
        let rippleEffect = 0
        ripples.current.forEach((ripple) => {
          const dx = x - ripple.x
          const dy = canvas.height / 2 - ripple.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          // 波纹影响范围
          if (dist < ripple.radius + 100 && dist > ripple.radius - 100) {
            const impact = (1 - Math.abs(dist - ripple.radius) / 100) * ripple.strength
            rippleEffect += Math.sin((dist - ripple.radius) / 20 + time.current) * impact
          }
        })

        // 绘制波浪线
        for (let y = 0; y < canvas.height; y += 20) {
          // 基础波浪
          const waveX =
            x +
            Math.sin(y * 0.02 + time.current) * 5 * (x / canvas.width) +
            Math.cos(y * 0.01 - time.current) * 3 * (x / canvas.width)

          // 添加波纹效果
          const finalX = waveX + rippleEffect * (x / canvas.width)

          if (y === 0) {
            ctx.lineTo(finalX, y)
          } else {
            ctx.lineTo(finalX, y)
          }
        }

        // 完成右侧边界
        if (x >= canvas.width - 10) {
          ctx.lineTo(canvas.width, canvas.height)
          ctx.lineTo(canvas.width, 0)
        }
      }

      ctx.fill()

      // 更新波纹
      ripples.current.forEach((ripple, index) => {
        ripple.radius += 2
        ripple.age += 1
        ripple.strength *= 0.98

        // 如果波纹太弱或太大，则移除
        if (ripple.strength < 0.5 || ripple.radius > 300) {
          ripples.current.splice(index, 1)
        }
      })

      // 继续动画循环
      animationFrameId.current = requestAnimationFrame(draw)
    }

    // 开始动画
    draw()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [color, opacity, rippleStrength])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
}
