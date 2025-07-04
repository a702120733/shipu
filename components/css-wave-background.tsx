"use client"

import { useEffect, useState } from "react"

interface CSSWaveBackgroundProps {
  color?: string
  secondaryColor?: string
}

export default function CSSWaveBackground({
  color = "rgba(100, 120, 150, 0.15)",
  secondaryColor = "rgba(120, 130, 160, 0.1)",
}: CSSWaveBackgroundProps) {
  const [mounted, setMounted] = useState(false)

  // 确保组件只在客户端渲染
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* 背景渐变 */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, rgba(255,255,255,0) 0%, ${color} 70%, ${secondaryColor} 100%)`,
        }}
      ></div>

      {/* 波纹容器 */}
      <div className="absolute inset-0 flex flex-col justify-center items-end">
        {/* 波纹1 */}
        <div className="wave wave1"></div>
        {/* 波纹2 */}
        <div className="wave wave2"></div>
        {/* 波纹3 */}
        <div className="wave wave3"></div>
        {/* 波纹4 */}
        <div className="wave wave4"></div>
      </div>

      {/* 内联样式，确保样式总是可用 */}
      <style jsx>{`
        .wave {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.3;
          left: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(200, 210, 220, 0.05) 50%,
            transparent 100%
          );
          transform-origin: center center;
        }

        .wave1 {
          animation: wave 15s infinite linear;
          opacity: 0.2;
          transform: rotate(15deg);
        }

        .wave2 {
          animation: wave 17s infinite linear;
          opacity: 0.15;
          transform: rotate(45deg);
        }

        .wave3 {
          animation: wave 20s infinite linear;
          opacity: 0.1;
          transform: rotate(75deg);
        }

        .wave4 {
          animation: wave 22s infinite linear;
          opacity: 0.05;
          transform: rotate(120deg);
        }

        @keyframes wave {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
      `}</style>
    </div>
  )
}
