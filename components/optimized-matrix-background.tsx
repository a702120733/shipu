"use client"

import { useEffect, useState, useRef } from "react"

interface OptimizedMatrixBackgroundProps {
  className?: string
  speed?: number
  opacity?: number
}

export default function OptimizedMatrixBackground({
  className = "",
  speed = 20,
  opacity = 0.6,
}: OptimizedMatrixBackgroundProps) {
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 使用 CSS transform 而不是 background-position 来提高性能
  useEffect(() => {
    if (!isClient || !containerRef.current) return

    const container = containerRef.current
    let animationId: number

    const animate = () => {
      const elements = container.querySelectorAll(".matrix-layer")
      elements.forEach((element, index) => {
        const el = element as HTMLElement
        const currentTransform = el.style.transform
        const currentY = currentTransform
          ? Number.parseFloat(currentTransform.match(/translateY$$([^)]+)$$/)?.[1] || "0")
          : 0

        let newY = currentY - 100 / speed // 调整速度
        if (newY <= -100) {
          newY = 100
        }

        el.style.transform = `translateY(${newY}vh)`
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isClient, speed])

  if (!isClient) {
    return null
  }

  return (
    <div ref={containerRef} className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* 使用 will-change 和 transform3d 来启用硬件加速 */}
      <div
        className="matrix-layer absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url(/images/matrix-background-latest.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          opacity: opacity,
          willChange: "transform",
          transform: "translate3d(0, 0, 0)",
        }}
      />

      <div
        className="matrix-layer absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url(/images/matrix-background-latest.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          opacity: opacity,
          willChange: "transform",
          transform: "translate3d(0, 100vh, 0)",
        }}
      />
    </div>
  )
}
