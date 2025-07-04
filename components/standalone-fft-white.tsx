"use client"

import type React from "react"
import { useMemo, useState, useRef, useCallback } from "react"

interface FFTWhiteProps {
  scaleFactor?: number
  backgroundColor?: string
  logoLeftColor?: string
  logoRightColor?: string
  matrixLeftColor?: string
  matrixRightColor?: string
  className?: string
  enablePixelEffect?: boolean
  width?: number | string
  height?: number | string
}

// 简化的Logo SVG组件
const SimpleLogo = ({ width = "100%", height = "100%", leftColor = "#3C4043", rightColor = "#3DB7EA" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 1426 660"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width, height }}
  >
    <path
      d="M504.446 101C532.718 101 558.789 110.424 579.701 126.315L535.126 188.776C528.729 184.029 520.817 181.14 512.219 181.14C490.963 181.14 473.697 198.406 473.697 219.662V258.184H759.455V338.874H673.533V440.339C673.533 461.595 690.799 478.86 712.055 478.86C720.653 478.86 728.564 475.971 734.962 471.225L779.537 533.686C758.625 549.576 732.554 559 704.282 559C649.113 559 602.267 523.092 585.964 473.426C581.905 461.182 579.704 448.043 579.704 434.423V338.874H473.697V559H379.868V338.874H273.868V559H180.039V338.874H94.1924V258.184H180.039V225.578C180.039 211.958 182.24 198.819 186.299 186.574C202.602 136.908 249.448 101 304.617 101C332.889 101 358.96 110.424 379.872 126.315L335.297 188.776C328.899 184.029 320.988 181.14 312.39 181.14C291.134 181.14 273.868 198.406 273.868 219.662V258.184H379.868V225.578C379.868 211.958 382.069 198.819 386.128 186.574C402.431 136.908 449.277 101 504.446 101Z"
      fill={leftColor}
    />
    <path
      d="M914.151 435.807C946.829 422.271 984.292 437.789 997.827 470.467C1011.36 503.144 995.845 540.607 963.168 554.143C930.49 567.678 893.027 552.161 879.491 519.484C865.956 486.806 881.474 449.342 914.151 435.807ZM938.646 265.958C974.016 265.958 1002.69 294.631 1002.69 330.001C1002.69 365.371 974.016 394.044 938.646 394.044C903.276 394.044 874.603 365.371 874.603 330.001C874.604 294.631 903.276 265.958 938.646 265.958ZM1103.12 265.958C1138.49 265.958 1167.17 294.631 1167.17 330.001C1167.17 365.371 1138.49 394.044 1103.12 394.044C1067.75 394.044 1039.08 365.371 1039.08 330.001C1039.08 294.631 1067.75 265.958 1103.12 265.958ZM1205.15 150.33C1213.27 115.906 1247.77 94.5863 1282.19 102.711C1316.61 110.836 1337.93 145.329 1329.81 179.753C1321.68 214.177 1287.19 235.497 1252.77 227.372C1218.34 219.247 1197.02 184.754 1205.15 150.33ZM875.501 154.766C881.168 119.853 914.064 96.1445 948.977 101.812C983.89 107.479 1007.6 140.375 1001.93 175.288C996.264 210.201 963.368 233.909 928.455 228.242C893.542 222.575 869.834 189.679 875.501 154.766ZM1039.91 154.758C1045.57 119.845 1078.47 96.1367 1113.38 101.804C1148.3 107.471 1172 140.368 1166.34 175.281C1160.67 210.194 1127.77 233.902 1092.86 228.235C1057.95 222.568 1034.24 189.671 1039.91 154.758Z"
      fill={rightColor}
    />
  </svg>
)

export default function StandaloneFFTWhite({
  scaleFactor = 1.0,
  backgroundColor = "transparent",
  logoLeftColor = "#3C4043",
  logoRightColor = "#3DB7EA",
  matrixLeftColor = "#3C4043",
  matrixRightColor = "#3DB7EA",
  className = "",
  enablePixelEffect = true,
  width = "auto",
  height = "auto",
}: FFTWhiteProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // 简化版本 - 只显示基本的悬停效果
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enablePixelEffect || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMousePosition({ x, y })
    },
    [enablePixelEffect],
  )

  const handleMouseEnter = useCallback(() => {
    if (enablePixelEffect) {
      setIsHovering(true)
    }
  }, [enablePixelEffect])

  const handleMouseLeave = useCallback(() => {
    if (enablePixelEffect) {
      setIsHovering(false)
    }
  }, [enablePixelEffect])

  const logoSize = useMemo(
    () => ({
      width: 460 * scaleFactor,
      height: 460 * scaleFactor * (660 / 1426),
    }),
    [scaleFactor],
  )

  return (
    <div className={`flex items-center justify-center ${className}`} style={{ backgroundColor, width, height }}>
      <div
        ref={containerRef}
        className="relative cursor-pointer transition-transform duration-300"
        style={{
          width: `${logoSize.width}px`,
          height: `${logoSize.height}px`,
          transform: isHovering ? "scale(1.05)" : "scale(1)",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SimpleLogo width="100%" height="100%" leftColor={logoLeftColor} rightColor={logoRightColor} />

        {/* 简单的悬停效果 */}
        {enablePixelEffect && isHovering && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(61, 183, 234, 0.1) 0%, transparent 50%)`,
              borderRadius: "8px",
            }}
          />
        )}
      </div>
    </div>
  )
}
