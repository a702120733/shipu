"use client"

import { useState, useEffect } from "react"
import FFTWhite from "@/components/fft-white"

export default function IntegrationExamples() {
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // 模拟加载过程
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">集成使用示例</h2>

      {/* 1. 加载状态 */}
      <section className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">加载状态</h3>
        <div className="bg-gray-50 rounded p-8 text-center min-h-[200px] flex items-center justify-center">
          {isLoading ? (
            <div className="space-y-4">
              <FFTWhite scaleFactor={0.8} enablePixelEffect={false} className="animate-pulse" />
              <p className="text-gray-600">加载中...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <FFTWhite scaleFactor={1} enablePixelEffect={true} />
              <p className="text-gray-600">加载完成！</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsLoading(!isLoading)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isLoading ? "完成加载" : "重新加载"}
        </button>
      </section>

      {/* 2. 主题切换 */}
      <section className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">主题切换</h3>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setTheme("light")}
            className={`px-4 py-2 rounded ${theme === "light" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            浅色主题
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`px-4 py-2 rounded ${theme === "dark" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            深色主题
          </button>
        </div>
        <div
          className={`rounded p-8 transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
        >
          <FFTWhite
            scaleFactor={1}
            logoLeftColor={theme === "dark" ? "#FFFFFF" : "#3C4043"}
            logoRightColor={theme === "dark" ? "#60A5FA" : "#3DB7EA"}
            matrixLeftColor={theme === "dark" ? "#FFFFFF" : "#3C4043"}
            matrixRightColor={theme === "dark" ? "#60A5FA" : "#3DB7EA"}
            enablePixelEffect={true}
          />
        </div>
      </section>

      {/* 3. 条件渲染 */}
      <section className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">条件渲染</h3>
        <div className="space-y-4">
          {/* 桌面端完整版 */}
          <div className="hidden lg:block bg-gray-50 rounded p-4">
            <p className="text-sm text-gray-600 mb-2">桌面端 - 完整功能</p>
            <FFTWhite scaleFactor={1.2} enablePixelEffect={true} />
          </div>

          {/* 平板端简化版 */}
          <div className="hidden md:block lg:hidden bg-gray-50 rounded p-4">
            <p className="text-sm text-gray-600 mb-2">平板端 - 中等尺寸</p>
            <FFTWhite scaleFactor={0.9} enablePixelEffect={false} />
          </div>

          {/* 手机端最简版 */}
          <div className="block md:hidden bg-gray-50 rounded p-4">
            <p className="text-sm text-gray-600 mb-2">手机端 - 最小尺寸</p>
            <FFTWhite scaleFactor={0.6} enablePixelEffect={false} />
          </div>
        </div>
      </section>
    </div>
  )
}
