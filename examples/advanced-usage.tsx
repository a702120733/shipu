"use client"

import { useState } from "react"
import FFTWhite from "@/components/fft-white"

export default function AdvancedUsage() {
  const [theme, setTheme] = useState<"light" | "dark" | "colorful">("light")
  const [scale, setScale] = useState(1)
  const [pixelEffect, setPixelEffect] = useState(true)

  const themeConfigs = {
    light: {
      logoLeftColor: "#3C4043",
      logoRightColor: "#3DB7EA",
      matrixLeftColor: "#3C4043",
      matrixRightColor: "#3DB7EA",
      backgroundColor: "white",
    },
    dark: {
      logoLeftColor: "#FFFFFF",
      logoRightColor: "#60A5FA",
      matrixLeftColor: "#FFFFFF",
      matrixRightColor: "#60A5FA",
      backgroundColor: "#1F2937",
    },
    colorful: {
      logoLeftColor: "#DC2626",
      logoRightColor: "#7C3AED",
      matrixLeftColor: "#DC2626",
      matrixRightColor: "#7C3AED",
      backgroundColor: "#FEF3C7",
    },
  }

  return (
    <div className="p-8">
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold">交互式配置</h2>

        {/* 主题选择 */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            主题:
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="border rounded px-2 py-1"
            >
              <option value="light">浅色</option>
              <option value="dark">深色</option>
              <option value="colorful">彩色</option>
            </select>
          </label>
        </div>

        {/* 缩放控制 */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            缩放: {scale.toFixed(1)}x
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number.parseFloat(e.target.value))}
              className="w-32"
            />
          </label>
        </div>

        {/* 像素效果开关 */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={pixelEffect} onChange={(e) => setPixelEffect(e.target.checked)} />
            启用像素效果
          </label>
        </div>
      </div>

      {/* 预览区域 */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center min-h-[400px]"
        style={{ backgroundColor: themeConfigs[theme].backgroundColor }}
      >
        <FFTWhite {...themeConfigs[theme]} scaleFactor={scale} enablePixelEffect={pixelEffect} />
      </div>
    </div>
  )
}
