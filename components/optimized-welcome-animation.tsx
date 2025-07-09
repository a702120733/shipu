"use client"

import type React from "react"

import { useMemo, useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import LogoSVG from "./logo-svg"
import NextImage from "next/image"

interface OptimizedWelcomeAnimationProps {
  onComplete?: () => void
  onScroll?: () => void
  showScrollIndicator?: boolean
  scaleFactor?: number
  backgroundColor?: string
  logoLeftColor?: string
  logoRightColor?: string
  matrixLeftColor?: string
  matrixRightColor?: string
  autoComplete?: boolean
  autoCompleteDelay?: number
  className?: string
}

// 减少配置复杂度
const SIMPLE_CONFIG = {
  SCALE_FACTOR: 1.5,
  MOUSE_RADIUS: 100,
  PIXEL_SIZE: 8,
  DIGIT_SIZE: 12,
}

export default function OptimizedWelcomeAnimation({
  onComplete,
  onScroll,
  showScrollIndicator = true,
  scaleFactor = 1.5,
  backgroundColor = "black",
  logoLeftColor = "#FFFFFF",
  logoRightColor = "#3DB7EA",
  matrixLeftColor = "#FFFFFF",
  matrixRightColor = "#3DB7EA",
  autoComplete = false,
  autoCompleteDelay = 3000,
  className = "",
}: OptimizedWelcomeAnimationProps) {
  const [screenSize, setScreenSize] = useState({ width: 1200, height: 800 })
  const [isInitialized, setIsInitialized] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [pixels, setPixels] = useState<
    Array<{
      x: number
      y: number
      color: string
      isBlueArea: boolean
    }>
  >([])

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelContainerRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>()

  // 简化响应式计算
  const responsiveScaleFactor = useMemo(() => {
    if (!isInitialized) return scaleFactor
    const { width } = screenSize

    if (width < 768) return scaleFactor * 0.6
    if (width < 1024) return scaleFactor * 0.8
    return scaleFactor
  }, [screenSize, scaleFactor, isInitialized])

  const logoHeight = useMemo(() => 460 * responsiveScaleFactor, [responsiveScaleFactor])
  const logoWidth = useMemo(() => Math.round(460 * (1426 / 660) * responsiveScaleFactor), [responsiveScaleFactor])

  // 防抖的窗口大小调整
  useEffect(() => {
    if (typeof window === "undefined") return

    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setScreenSize({ width: window.innerWidth, height: window.innerHeight })
      }, 150)
    }

    handleResize()
    setIsInitialized(true)

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    if (autoComplete) {
      const timer = setTimeout(() => onComplete?.(), autoCompleteDelay)
      return () => clearTimeout(timer)
    }
  }, [autoComplete, autoCompleteDelay, onComplete])

  // 简化像素生成逻辑
  useEffect(() => {
    if (!canvasRef.current || !isInitialized) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const actualWidth = logoWidth * 0.8
    const actualHeight = logoHeight * 0.8

    canvas.width = actualWidth
    canvas.height = actualHeight

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, actualWidth, actualHeight)

      const pixelData: typeof pixels = []
      const step = SIMPLE_CONFIG.PIXEL_SIZE + 2 // 减少像素密度

      for (let x = 0; x < actualWidth; x += step) {
        for (let y = 0; y < actualHeight; y += step) {
          const data = ctx.getImageData(x, y, 1, 1).data

          if (data[3] >= 20) {
            pixelData.push({
              x,
              y,
              color: `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`,
              isBlueArea: data[2] > 200 && data[1] > 150, // 简化蓝色检测
            })
          }
        }
      }

      setPixels(pixelData)
    }

    // 简化SVG字符串
    const svgString = `<svg width="${actualWidth}" height="${actualHeight}" viewBox="0 0 1426 660" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M504.446 101C532.718 101 558.789 110.424 579.701 126.315L535.126 188.776C528.729 184.029 520.817 181.14 512.219 181.14C490.963 181.14 473.697 198.406 473.697 219.662V258.184H759.455V338.874H673.533V440.339C673.533 461.595 690.799 478.86 712.055 478.86C720.653 478.86 728.564 475.971 734.962 471.225L779.537 533.686C758.625 549.576 732.554 559 704.282 559C649.113 559 602.267 523.092 585.964 473.426C581.905 461.182 579.704 448.043 579.704 434.423V338.874H473.697V559H379.868V338.874H273.868V559H180.039V338.874H94.1924V258.184H180.039V225.578C180.039 211.958 182.24 198.819 186.299 186.574C202.602 136.908 249.448 101 304.617 101C332.889 101 358.96 110.424 379.872 126.315L335.297 188.776C328.899 184.029 320.988 181.14 312.39 181.14C291.134 181.14 273.868 198.406 273.868 219.662V258.184H379.868V225.578C379.868 211.958 382.069 198.819 386.128 186.574C402.431 136.908 449.277 101 504.446 101Z" fill="${logoLeftColor}"/>
      <path d="M914.151 435.807C946.829 422.271 984.292 437.789 997.827 470.467C1011.36 503.144 995.845 540.607 963.168 554.143C930.49 567.678 893.027 552.161 879.491 519.484C865.956 486.806 881.474 449.342 914.151 435.807ZM938.646 265.958C974.016 265.958 1002.69 294.631 1002.69 330.001C1002.69 365.371 974.016 394.044 938.646 394.044C903.276 394.044 874.603 365.371 874.603 330.001C874.604 294.631 903.276 265.958 938.646 265.958ZM1103.12 265.958C1138.49 265.958 1167.17 294.631 1167.17 330.001C1167.17 365.371 1138.49 394.044 1103.12 394.044C1067.75 394.044 1039.08 365.371 1039.08 330.001C1039.08 294.631 1067.75 265.958 1103.12 265.958ZM1205.15 150.33C1213.27 115.906 1247.77 94.5863 1282.19 102.711C1316.61 110.836 1337.93 145.329 1329.81 179.753C1321.68 214.177 1287.19 235.497 1252.77 227.372C1218.34 219.247 1197.02 184.754 1205.15 150.33ZM875.501 154.766C881.168 119.853 914.064 96.1445 948.977 101.812C983.89 107.479 1007.6 140.375 1001.93 175.288C996.264 210.201 963.368 233.909 928.455 228.242C893.542 222.575 869.834 189.679 875.501 154.766ZM1039.91 154.758C1045.57 119.845 1078.47 96.1367 1113.38 101.804C1148.3 107.471 1172 140.368 1166.34 175.281C1160.67 210.194 1127.77 233.902 1092.86 228.235C1057.95 222.568 1034.24 189.671 1039.91 154.758Z" fill="${logoRightColor}"/>
    </svg>`

    const svgBlob = new Blob([svgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(svgBlob)
    img.src = url
    return () => URL.revokeObjectURL(url)
  }, [logoWidth, logoHeight, isInitialized, logoLeftColor, logoRightColor])

  // 优化鼠标移动处理
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!pixelContainerRef.current || requestRef.current) return

    requestRef.current = requestAnimationFrame(() => {
      const rect = pixelContainerRef.current?.getBoundingClientRect()
      if (rect) {
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
      requestRef.current = undefined
    })
  }, [])

  // 简化像素效果渲染
  const pixelElements = useMemo(() => {
    if (!isHovering || !pixels.length) return null

    return pixels
      .filter((_, index) => index % 3 === 0) // 只渲染1/3的像素以提高性能
      .map((pixel, index) => {
        const dx = pixel.x - mousePosition.x
        const dy = pixel.y - mousePosition.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > SIMPLE_CONFIG.MOUSE_RADIUS) {
          return (
            <div
              key={`pixel-${index}`}
              className="absolute"
              style={{
                width: `${SIMPLE_CONFIG.PIXEL_SIZE}px`,
                height: `${SIMPLE_CONFIG.PIXEL_SIZE}px`,
                backgroundColor: pixel.color,
                left: `${pixel.x}px`,
                top: `${pixel.y}px`,
                willChange: "transform",
              }}
            />
          )
        }

        // 简化矩阵效果
        const char = Math.random() > 0.5 ? "1" : "0"
        return (
          <div
            key={`matrix-${index}`}
            className="absolute flex items-center justify-center"
            style={{
              width: `${SIMPLE_CONFIG.DIGIT_SIZE}px`,
              height: `${SIMPLE_CONFIG.DIGIT_SIZE}px`,
              left: `${pixel.x}px`,
              top: `${pixel.y}px`,
              color: pixel.isBlueArea ? matrixRightColor : matrixLeftColor,
              fontSize: `${SIMPLE_CONFIG.DIGIT_SIZE}px`,
              fontFamily: "monospace",
              fontWeight: "bold",
              willChange: "transform",
            }}
          >
            {char}
          </div>
        )
      })
      .filter(Boolean)
  }, [pixels, mousePosition, isHovering, matrixLeftColor, matrixRightColor])

  if (!isInitialized) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`} style={{ backgroundColor }}>
        <LogoSVG width="450px" height="auto" leftColor={logoLeftColor} rightColor={logoRightColor} />
      </div>
    )
  }

  return (
    <div className={`w-full h-full ${className}`} style={{ backgroundColor }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={containerRef}
          className="relative"
          style={{
            width: `${logoWidth * 0.8}px`,
            height: `${logoHeight * 0.8}px`,
            maxWidth: "90vw",
            maxHeight: "60vh",
          }}
        >
          <div
            ref={pixelContainerRef}
            className="absolute inset-0 z-30 cursor-pointer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
          />

          <div
            className="absolute inset-0 cursor-pointer flex items-center justify-center"
            style={{
              zIndex: 20,
              display: isHovering ? "none" : "flex",
            }}
          >
            <LogoSVG width="100%" height="100%" leftColor={logoLeftColor} rightColor={logoRightColor} />
          </div>

          <div
            className="absolute inset-0"
            style={{
              display: isHovering ? "block" : "none",
              zIndex: 10,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            {pixelElements}
          </div>
        </div>
      </div>

      {showScrollIndicator && (
        <motion.div
          className="absolute bottom-12 sm:bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 text-center z-[110] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="cursor-pointer"
            onClick={onScroll}
          >
            <NextImage
              src="/images/scroll-new.png"
              alt="Scroll to continue"
              width={64}
              height={80}
              className="opacity-80 hover:opacity-100 transition-opacity duration-300"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
