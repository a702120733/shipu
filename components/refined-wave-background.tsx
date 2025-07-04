"use client"

import { useEffect, useRef } from "react"
import { perlin2D } from "./perlin-noise"

interface WaveBackgroundProps {
  color?: string
  secondaryColor?: string
  speed?: number
  density?: number
  amplitude?: number
  fps?: number
}

export default function RefinedWaveBackground({
  color = "rgba(210, 215, 220, 0.3)", // 中性灰蓝色调
  secondaryColor = "rgba(220, 215, 205, 0.2)", // 淡金色调
  speed = 0.05, // 波形移动速度，较慢
  density = 20, // 波形密度
  amplitude = 20, // 波形振幅
  fps = 24, // 帧率控制，30fps以下
}: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number>()
  const lastFrameTime = useRef<number>(0)
  const offset = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const noiseScale = 0.005 // 噪声比例尺

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布尺寸并处理高分辨率屏幕
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // 计算帧率间隔（毫秒）
    const frameInterval = 1000 / fps

    // 绘制函数
    const draw = (timestamp: number) => {
      // 控制帧率
      if (timestamp - lastFrameTime.current < frameInterval) {
        animationFrameId.current = requestAnimationFrame(draw)
        return
      }

      lastFrameTime.current = timestamp

      // 清除画布
      ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1))

      // 更新偏移 - 缓慢移动，从左上到右下
      offset.current.x += speed * 0.7
      offset.current.y += speed * 0.3

      // 绘制波形
      drawWaves(
        ctx,
        offset.current,
        canvas.width / (window.devicePixelRatio || 1),
        canvas.height / (window.devicePixelRatio || 1),
      )

      // 继续动画循环
      animationFrameId.current = requestAnimationFrame(draw)
    }

    // 绘制波形函数
    const drawWaves = (
      ctx: CanvasRenderingContext2D,
      offset: { x: number; y: number },
      width: number,
      height: number,
    ) => {
      // 绘制第一层波形
      drawWaveLayer(ctx, offset.x, offset.y, width, height, color, density, amplitude)

      // 绘制第二层波形，使用不同的偏移和参数，创建更丰富的层次感
      drawWaveLayer(
        ctx,
        offset.x * 0.8 + 100,
        offset.y * 0.6 + 50,
        width,
        height,
        secondaryColor,
        density * 0.7,
        amplitude * 0.8,
      )
    }

    // 绘制单层波形
    const drawWaveLayer = (
      ctx: CanvasRenderingContext2D,
      offsetX: number,
      offsetY: number,
      width: number,
      height: number,
      strokeColor: string,
      waveDensity: number,
      waveAmplitude: number,
    ) => {
      const lineSpacing = height / waveDensity

      ctx.strokeStyle = strokeColor
      ctx.lineWidth = 1.5

      // 绘制水平波形线
      for (let y = 0; y < height; y += lineSpacing) {
        ctx.beginPath()

        // 每条线使用微妙的Y偏移，避免完全平行
        const lineOffset = perlin2D(y * 0.01, offsetY * 0.1) * 5

        for (let x = 0; x < width; x += 2) {
          // 使用Perlin噪声生成自然的波形
          const noise = perlin2D((x + offsetX) * noiseScale, (y + offsetY + lineOffset) * noiseScale)
          const yPos = y + noise * waveAmplitude

          if (x === 0) {
            ctx.moveTo(x, yPos)
          } else {
            ctx.lineTo(x, yPos)
          }
        }

        ctx.stroke()
      }
    }

    // 开始动画
    animationFrameId.current = requestAnimationFrame(draw)

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [color, secondaryColor, speed, density, amplitude, fps])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
      style={{
        zIndex: -1,
        opacity: 0.9, // 保持较低的不透明度，不喧宾夺主
      }}
    />
  )
}
