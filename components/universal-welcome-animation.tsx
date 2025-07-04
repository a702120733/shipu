"use client"

import type React from "react"
import { useMemo, useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import LogoSVG from "./logo-svg"
import NextImage from "next/image"

interface UniversalWelcomeAnimationProps {
  onComplete?: () => void
  onScroll?: () => void
  showScrollIndicator?: boolean
  scrollText?: string
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

const DEFAULT_CONFIG = {
  SCALE_FACTOR: 1.5,
  MOUSE_RADIUS: 120,
  EMPTY_ZONE_RATIO: 0.25,
  STAR_ZONE_RATIO: 0.35,
  SQUARE_ZONE_RATIO: 0.45,
  SQUARE_DENSITY: 0.2,
  DIGIT_DENSITY: 0.95,
  COLOR_MATCH_THRESHOLD: 30,
}

export default function UniversalWelcomeAnimation({
  onComplete,
  onScroll,
  showScrollIndicator = true,
  scrollText = "Scroll to continue",
  scaleFactor = 1.5,
  backgroundColor = "black",
  logoLeftColor = "#FFFFFF",
  logoRightColor = "#3DB7EA",
  matrixLeftColor = "#FFFFFF",
  matrixRightColor = "#3DB7EA",
  autoComplete = false,
  autoCompleteDelay = 3000,
  className = "",
}: UniversalWelcomeAnimationProps) {
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
      originalColor: { r: number; g: number; b: number; a: number }
    }>
  >([])

  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelContainerRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>()
  const randomSeedRef = useRef<number[]>([])
  const binaryDigitRef = useRef<number[]>([])
  const charDisplayRef = useRef<number[]>([])

  const responsiveScaleFactor = useMemo(() => {
    if (!isInitialized) return scaleFactor
    const { width, height } = screenSize
    const minDimension = Math.min(width, height)

    let scale = scaleFactor
    if (minDimension < 480) scale *= 0.6
    else if (minDimension < 640) scale *= 0.8
    else if (minDimension < 768) scale *= 0.9
    else if (minDimension < 1280) scale *= 1.1
    else scale *= 1.2

    return Math.min(scale, Math.min(width / 500, height / 350) * 0.9)
  }, [screenSize, scaleFactor, isInitialized])

  const config = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      SCALE_FACTOR: responsiveScaleFactor,
      PIXEL_SIZE: 6 * responsiveScaleFactor,
      PIXEL_GAP: responsiveScaleFactor,
      DIGIT_SIZE: 9 * responsiveScaleFactor,
      MOUSE_RADIUS: DEFAULT_CONFIG.MOUSE_RADIUS * responsiveScaleFactor,
    }),
    [responsiveScaleFactor],
  )

  const logoHeight = useMemo(() => 460 * config.SCALE_FACTOR, [config.SCALE_FACTOR])
  const logoWidth = useMemo(() => Math.round(460 * (1426 / 660) * config.SCALE_FACTOR), [config.SCALE_FACTOR])

  const actualLogoWidth = logoWidth * 0.8
  const actualLogoHeight = logoHeight * 0.8

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => setScreenSize({ width: window.innerWidth, height: window.innerHeight })
    handleResize()
    setIsInitialized(true)

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (autoComplete) {
      const timer = setTimeout(() => onComplete?.(), autoCompleteDelay)
      return () => clearTimeout(timer)
    }
  }, [autoComplete, autoCompleteDelay, onComplete])

  const isBlueColor = useCallback(
    (r: number, g: number, b: number): boolean => {
      const [blueR, blueG, blueB] = [61, 183, 234]
      return (
        Math.abs(r - blueR) < config.COLOR_MATCH_THRESHOLD &&
        Math.abs(g - blueG) < config.COLOR_MATCH_THRESHOLD &&
        Math.abs(b - blueB) < config.COLOR_MATCH_THRESHOLD
      )
    },
    [config.COLOR_MATCH_THRESHOLD],
  )

  useEffect(() => {
    if (!canvasRef.current || !isInitialized) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = actualLogoWidth
    canvas.height = actualLogoHeight

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, actualLogoWidth, actualLogoHeight)

      const pixelData: typeof pixels = []
      const totalPixelSize = config.PIXEL_SIZE + config.PIXEL_GAP
      const pixelsX = Math.floor(actualLogoWidth / totalPixelSize)
      const pixelsY = Math.floor(actualLogoHeight / totalPixelSize)
      const gridOffsetX = (actualLogoWidth - (pixelsX * totalPixelSize - config.PIXEL_GAP)) / 2
      const gridOffsetY = (actualLogoHeight - (pixelsY * totalPixelSize - config.PIXEL_GAP)) / 2

      for (let x = 0; x < pixelsX; x++) {
        for (let y = 0; y < pixelsY; y++) {
          const pixelX = gridOffsetX + x * totalPixelSize
          const pixelY = gridOffsetY + y * totalPixelSize
          const data = ctx.getImageData(pixelX + config.PIXEL_SIZE / 2, pixelY + config.PIXEL_SIZE / 2, 1, 1).data

          if (data[3] >= 20) {
            pixelData.push({
              x: pixelX,
              y: pixelY,
              color: `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`,
              isBlueArea: isBlueColor(data[0], data[1], data[2]),
              originalColor: { r: data[0], g: data[1], b: data[2], a: data[3] },
            })
          }
        }
      }

      randomSeedRef.current = []
      binaryDigitRef.current = []
      charDisplayRef.current = []
      setPixels(pixelData)
    }

    const svgString = `<svg width="${actualLogoWidth}" height="${actualLogoHeight}" viewBox="0 0 1426 660" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M504.446 101C532.718 101 558.789 110.424 579.701 126.315L535.126 188.776C528.729 184.029 520.817 181.14 512.219 181.14C490.963 181.14 473.697 198.406 473.697 219.662V258.184H759.455V338.874H673.533V440.339C673.533 461.595 690.799 478.86 712.055 478.86C720.653 478.86 728.564 475.971 734.962 471.225L779.537 533.686C758.625 549.576 732.554 559 704.282 559C649.113 559 602.267 523.092 585.964 473.426C581.905 461.182 579.704 448.043 579.704 434.423V338.874H473.697V559H379.868V338.874H273.868V559H180.039V338.874H94.1924V258.184H180.039V225.578C180.039 211.958 182.24 198.819 186.299 186.574C202.602 136.908 249.448 101 304.617 101C332.889 101 358.96 110.424 379.872 126.315L335.297 188.776C328.899 184.029 320.988 181.14 312.39 181.14C291.134 181.14 273.868 198.406 273.868 219.662V258.184H379.868V225578C379.868 211.958 382.069 198.819 386.128 186.574C402.431 136.908 449.277 101 504.446 101Z" fill="${logoLeftColor}"/>
      <path d="M914.151 435.807C946.829 422.271 984.292 437.789 997.827 470.467C1011.36 503.144 995.845 540.607 963.168 554.143C930.49 567.678 893.027 552.161 879.491 519.484C865.956 486.806 881.474 449.342 914.151 435.807Z" fill="${logoRightColor}"/>
      <path d="M938.646 265.958C974.016 265.958 1002.69 294.631 1002.69 330.001C1002.69 365.371 974.016 394.044 938.646 394.044C903.276 394.044 874.603 365.371 874.603 330.001C874.604 294.631 903.276 265.958 938.646 265.958Z" fill="${logoRightColor}"/>
      <path d="M1103.12 265.958C1138.49 265.958 1167.17 294.631 1167.17 330.001C1167.17 365.371 1138.49 394.044 1103.12 394.044C1067.75 394.044 1039.08 365.371 1039.08 330.001C1039.08 294.631 1067.75 265.958 1103.12 265.958Z" fill="${logoRightColor}"/>
      <path d="M1205.15 150.33C1213.27 115.906 1247.77 94.5863 1282.19 102.711C1316.61 110.836 1337.93 145.329 1329.81 179.753C1321.68 214.177 1287.19 235.497 1252.77 227.372C1218.34 219.247 1197.02 184.754 1205.15 150.33Z" fill="${logoRightColor}"/>
      <path d="M875.501 154.766C881.168 119.853 914.064 96.1445 948.977 101.812C983.89 107.479 1007.6 140.375 1001.93 175.288C996.264 210.201 963.368 233.909 928.455 228.242C893.542 222.575 869.834 189.679 875.501 154.766Z" fill="${logoRightColor}"/>
      <path d="M1039.91 154.758C1045.57 119.845 1078.47 96.1367 1113.38 101.804C1148.3 107.471 1172 140.368 1166.34 175.281C1160.67 210.194 1127.77 233.902 1092.86 228.235C1057.95 222.568 1034.24 189.671 1039.91 154.758Z" fill="${logoRightColor}"/>
    </svg>`

    const svgBlob = new Blob([svgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(svgBlob)
    img.src = url
    return () => URL.revokeObjectURL(url)
  }, [
    logoWidth,
    logoHeight,
    isBlueColor,
    config,
    logoLeftColor,
    logoRightColor,
    isInitialized,
    actualLogoWidth,
    actualLogoHeight,
  ])

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

  const pixelElements = useMemo(() => {
    if (!isHovering || !pixels.length) return null

    if (randomSeedRef.current.length !== pixels.length) {
      randomSeedRef.current = pixels.map(() => Math.random())
      binaryDigitRef.current = pixels.map(() => (Math.random() > 0.5 ? 1 : 0))
      charDisplayRef.current = pixels.map(() => Math.random())
    }

    return pixels
      .map((pixel, index) => {
        const matrixColor = pixel.isBlueArea ? matrixRightColor : matrixLeftColor
        const dx = pixel.x - mousePosition.x
        const dy = pixel.y - mousePosition.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const distanceFromCenter = Math.sqrt(
          (pixel.x - actualLogoWidth / 2) ** 2 + (pixel.y - actualLogoHeight / 2) ** 2,
        )
        const centerFactor = Math.min(1, distanceFromCenter / (actualLogoWidth * 0.4))

        let disappearProbability = 0
        if (distance < config.MOUSE_RADIUS) {
          disappearProbability = (1 - distance / config.MOUSE_RADIUS) * (0.7 + centerFactor * 0.3)
        }

        const randomValue = randomSeedRef.current[index]
        const isVisible = randomValue > disappearProbability
        const isInEffectZone = distance < config.MOUSE_RADIUS && randomValue <= disappearProbability

        if (isInEffectZone) {
          const relativeDistance = distance / config.MOUSE_RADIUS
          let displayChar = ""

          if (relativeDistance >= config.EMPTY_ZONE_RATIO) {
            if (relativeDistance < config.STAR_ZONE_RATIO) {
              displayChar = "★"
            } else if (
              relativeDistance < config.SQUARE_ZONE_RATIO &&
              charDisplayRef.current[index] < config.SQUARE_DENSITY
            ) {
              displayChar = "■"
            } else if (charDisplayRef.current[index] < config.DIGIT_DENSITY) {
              displayChar = binaryDigitRef.current[index].toString()
            }
          }

          if (displayChar) {
            return (
              <div
                key={`digit-${index}`}
                className="absolute flex items-center justify-center"
                style={{
                  width: `${config.DIGIT_SIZE}px`,
                  height: `${config.DIGIT_SIZE}px`,
                  left: `${pixel.x - (config.DIGIT_SIZE - config.PIXEL_SIZE) / 2}px`,
                  top: `${pixel.y - (config.DIGIT_SIZE - config.PIXEL_SIZE) / 2}px`,
                  color: matrixColor,
                  fontSize: `${config.DIGIT_SIZE - 1}px`,
                  fontFamily: "monospace",
                  fontWeight: "bold",
                }}
              >
                {displayChar}
              </div>
            )
          }
        } else {
          return (
            <div
              key={`pixel-${index}`}
              className="absolute"
              style={{
                width: `${config.PIXEL_SIZE}px`,
                height: `${config.PIXEL_SIZE}px`,
                backgroundColor: pixel.color,
                left: `${pixel.x}px`,
                top: `${pixel.y}px`,
                opacity: isVisible ? 1 : 0,
                transition: "opacity 0.2s ease",
              }}
            />
          )
        }
        return null
      })
      .filter(Boolean)
  }, [pixels, mousePosition, isHovering, config, matrixLeftColor, matrixRightColor, actualLogoWidth, actualLogoHeight])

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

      {/* 主容器 - 使用绝对定位确保完全居中 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={containerRef}
          className="relative"
          style={{
            width: `${actualLogoWidth}px`,
            height: `${actualLogoHeight}px`,
            maxWidth: "90vw",
            maxHeight: "60vh",
          }}
        >
          {/* 鼠标事件检测层 */}
          <div
            ref={pixelContainerRef}
            className="absolute inset-0 z-30 cursor-pointer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
          />

          {/* 原始Logo */}
          <div
            ref={logoRef}
            className="absolute inset-0 cursor-pointer flex items-center justify-center"
            style={{
              zIndex: 20,
              display: isHovering ? "none" : "flex",
            }}
          >
            <LogoSVG width="100%" height="100%" leftColor={logoLeftColor} rightColor={logoRightColor} />
          </div>

          {/* 像素化效果层 */}
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

      {/* 滚动指示器 - 绝对定位在底部中央 */}
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
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
