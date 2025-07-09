"use client"

import { useEffect, useState } from "react"

interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  loadTime: number
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
  })
  const [showMonitor, setShowMonitor] = useState(false)

  useEffect(() => {
    // 只在开发环境显示性能监控
    if (process.env.NODE_ENV === "development") {
      setShowMonitor(true)
    }

    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))

        setMetrics((prev) => ({
          ...prev,
          fps,
          memoryUsage: (performance as any).memory?.usedJSHeapSize
            ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
            : 0,
          loadTime: Math.round(performance.now()),
        }))

        frameCount = 0
        lastTime = currentTime
      }

      animationId = requestAnimationFrame(measureFPS)
    }

    if (showMonitor) {
      measureFPS()
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [showMonitor])

  if (!showMonitor) {
    return null
  }

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-3 rounded-lg text-sm font-mono z-[9999]">
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {metrics.memoryUsage}MB</div>
      <div>Load: {metrics.loadTime}ms</div>
    </div>
  )
}
