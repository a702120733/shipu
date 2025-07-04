"use client"

import type React from "react"
import { useMemo, useState, useEffect, useRef, useCallback } from "react"
import { League_Spartan } from "next/font/google"
import LogoSVG from "./logo-svg"

// 导入League Spartan字体
const leagueSpartan = League_Spartan({
  weight: "600",
  subsets: ["latin"],
})

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

// 默认配置
const DEFAULT_CONFIG = {
  SCALE_FACTOR: 1.0,
  GRID_SIZE: 40,
  PIXEL_GAP: 1,
  GRID_EXPANSION: 1.5,
  MOUSE_RADIUS: 120,
  EMPTY_ZONE_RATIO: 0.25,
  STAR_ZONE_RATIO: 0.35,
  SQUARE_ZONE_RATIO: 0.45,
  SQUARE_DENSITY: 0.2,
  DIGIT_DENSITY: 0.95,
  COLOR_MATCH_THRESHOLD: 30,
  EDGE_WIDTH: 30,
}

export default function FFTWhite({
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
  // 简化响应式逻辑，使用固定的缩放因子
  const [screenSize, setScreenSize] = useState({ width: 1200, height: 800 })
  const [isInitialized, setIsInitialized] = useState(false)

  // 稳定的响应式缩放因子计算
  const responsiveScaleFactor = useMemo(() => {
    if (!isInitialized || typeof window === "undefined") return scaleFactor

    const baseWidth = 1200
    const currentWidth = screenSize.width

    let responsiveScale = Math.min(currentWidth / baseWidth, 1.2)

    if (currentWidth < 768) {
      responsiveScale = Math.max(responsiveScale * 0.6, 0.4)
    } else if (currentWidth < 1024) {
      responsiveScale = Math.max(responsiveScale * 0.8, 0.6)
    }

    return responsiveScale * scaleFactor
  }, [screenSize.width, scaleFactor, isInitialized])

  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [pixels, setPixels] = useState<
    {
      x: number
      y: number
      color: string
      isEmpty: boolean
      isBlueArea: boolean
      originalColor: { r: number; g: number; b: number; a: number }
    }[]
  >([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const randomSeedRef = useRef<number[]>([])
  const binaryDigitRef = useRef<number[]>([])
  const charDisplayRef = useRef<number[]>([])

  // 稳定的配置对象
  const config = useMemo(() => {
    return {
      ...DEFAULT_CONFIG,
      SCALE_FACTOR: responsiveScaleFactor,
      PIXEL_SIZE: 6 * responsiveScaleFactor,
      PIXEL_GAP: DEFAULT_CONFIG.PIXEL_GAP * responsiveScaleFactor,
      DIGIT_SIZE: 6 * responsiveScaleFactor * 1.5,
      EDGE_WIDTH: DEFAULT_CONFIG.EDGE_WIDTH * responsiveScaleFactor,
      MOUSE_RADIUS: DEFAULT_CONFIG.MOUSE_RADIUS * responsiveScaleFactor,
    }
  }, [responsiveScaleFactor])

  // Logo尺寸 - 使用稳定的缩放
  const logoHeight = useMemo(() => 460 * config.SCALE_FACTOR, [config.SCALE_FACTOR])
  const logoWidth = useMemo(() => Math.round(460 * (1426 / 660) * config.SCALE_FACTOR), [config.SCALE_FACTOR])

  // 初始化屏幕尺寸
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    setIsInitialized(true)

    // 使用防抖来避免频繁的尺寸更新
    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 150)
    }

    window.addEventListener("resize", debouncedResize)
    return () => {
      window.removeEventListener("resize", debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [])

  // 判断颜色是否接近蓝色
  const isBlueColor = useCallback(
    (r: number, g: number, b: number): boolean => {
      const blueR = 61
      const blueG = 183
      const blueB = 234

      const diffR = Math.abs(r - blueR)
      const diffG = Math.abs(g - blueG)
      const diffB = Math.abs(b - blueB)

      return (
        diffB < config.COLOR_MATCH_THRESHOLD &&
        diffG < config.COLOR_MATCH_THRESHOLD &&
        diffR < config.COLOR_MATCH_THRESHOLD
      )
    },
    [config.COLOR_MATCH_THRESHOLD],
  )

  // Generate pixel data for the logo - 只在启用像素效果时执行
  useEffect(() => {
    if (!enablePixelEffect || !canvasRef.current || !isInitialized) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 重置像素数据，避免旧数据干扰
    setPixels([])

    canvas.width = logoWidth * 0.8 * config.GRID_EXPANSION
    canvas.height = logoHeight * 0.8 * config.GRID_EXPANSION

    const logoWidth_actual = logoWidth * 0.8
    const logoHeight_actual = logoHeight * 0.8
    const offsetX = (canvas.width - logoWidth_actual) / 2
    const offsetY = (canvas.height - logoHeight_actual) / 2

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, offsetX, offsetY, logoWidth_actual, logoHeight_actual)

      const pixelData: {
        x: number
        y: number
        color: string
        isEmpty: boolean
        isBlueArea: boolean
        originalColor: { r: number; g: number; b: number; a: number }
      }[] = []

      const totalPixelSize = config.PIXEL_SIZE + config.PIXEL_GAP
      const pixelsX = Math.floor(canvas.width / totalPixelSize)
      const pixelsY = Math.floor(canvas.height / totalPixelSize)
      const gridOffsetX = (canvas.width - (pixelsX * totalPixelSize - config.PIXEL_GAP)) / 2
      const gridOffsetY = (canvas.height - (pixelsY * totalPixelSize - config.PIXEL_GAP)) / 2

      for (let x = 0; x < pixelsX; x++) {
        for (let y = 0; y < pixelsY; y++) {
          const pixelX = gridOffsetX + x * totalPixelSize
          const pixelY = gridOffsetY + y * totalPixelSize

          const data = ctx.getImageData(pixelX + config.PIXEL_SIZE / 2, pixelY + config.PIXEL_SIZE / 2, 1, 1).data
          const isEmpty = data[3] < 20

          if (!isEmpty) {
            const originalColor = {
              r: data[0],
              g: data[1],
              b: data[2],
              a: data[3],
            }

            const isBlueArea = isBlueColor(data[0], data[1], data[2])
            const color = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`

            pixelData.push({
              x: pixelX,
              y: pixelY,
              color,
              isEmpty: false,
              isBlueArea,
              originalColor,
            })
          }
        }
      }

      // 重置随机种子，确保一致性
      randomSeedRef.current = []
      binaryDigitRef.current = []
      charDisplayRef.current = []

      setPixels(pixelData)
    }

    const svgString = `
      <svg width="${logoWidth * 0.8}" height="${logoHeight * 0.8}" viewBox="0 0 1426 660" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M504.446 101C532.718 101 558.789 110.424 579.701 126.315L535.126 188.776C528.729 184.029 520.817 181.14 512.219 181.14C490.963 181.14 473.697 198.406 473.697 219.662V258.184H759.455V338.874H673.533V440.339C673.533 461.595 690.799 478.86 712.055 478.86C720.653 478.86 728.564 475.971 734.962 471.225L779.537 533.686C758.625 549.576 732.554 559 704.282 559C649.113 559 602.267 523.092 585.964 473.426C581.905 461.182 579.704 448.043 579.704 434.423V338.874H473.697V559H379.868V338.874H273.868V559H180.039V338.874H94.1924V258.184H180.039V225.578C180.039 211.958 182.24 198.819 186.299 186.574C202.602 136.908 249.448 101 304.617 101C332.889 101 358.96 110.424 379.872 126.315L335.297 188.776C328.899 184.029 320.988 181.14 312.39 181.14C291.134 181.14 273.868 198.406 273.868 219.662V258.184H379.868V225.578C379.868 211.958 382.069 198.819 386.128 186.574C402.431 136.908 449.277 101 504.446 101Z" fill="${logoLeftColor}"/>
        <path d="M914.151 435.807C946.829 422.271 984.292 437.789 997.827 470.467C1011.36 503.144 995.845 540.607 963.168 554.143C930.49 567.678 893.027 552.161 879.491 519.484C865.956 486.806 881.474 449.342 914.151 435.807Z" fill="${logoRightColor}"/>
        <path d="M938.646 265.958C974.016 265.958 1002.69 294.631 1002.69 330.001C1002.69 365.371 974.016 394.044 938.646 394.044C903.276 394.044 874.603 365.371 874.603 330.001C874.604 294.631 903.276 265.958 938.646 265.958Z" fill="${logoRightColor}"/>
        <path d="M1103.12 265.958C1138.49 265.958 1167.17 294.631 1167.17 330.001C1167.17 365.371 1138.49 394.044 1103.12 394.044C1067.75 394.044 1039.08 365.371 1039.08 330.001C1039.08 294.631 1067.75 265.958 1103.12 265.958Z" fill="${logoRightColor}"/>
        <path d="M1205.15 150.33C1213.27 115.906 1247.77 94.5863 1282.19 102.711C1316.61 110.836 1337.93 145.329 1329.81 179.753C1321.68 214.177 1287.19 235.497 1252.77 227.372C1218.34 219.247 1197.02 184.754 1205.15 150.33Z" fill="${logoRightColor}"/>
        <path d="M875.501 154.766C881.168 119.853 914.064 96.1445 948.977 101.812C983.89 107.479 1007.6 140.375 1001.93 175.288C996.264 210.201 963.368 233.909 928.455 228.242C893.542 222.575 869.834 189.679 875.501 154.766Z" fill="${logoRightColor}"/>
        <path d="M1039.91 154.758C1045.57 119.845 1078.47 96.1367 1113.38 101.804C1148.3 107.471 1172 140.368 1166.34 175.281C1160.67 210.194 1127.77 233.902 1092.86 228.235C1057.95 222.568 1034.24 189.671 1039.91 154.758Z" fill="${logoRightColor}"/>
      </svg>
    `
    const svgBlob = new Blob([svgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(svgBlob)
    img.src = url

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [logoWidth, logoHeight, isBlueColor, config, logoLeftColor, logoRightColor, isInitialized, enablePixelEffect])

  // Handle mouse movement - 只在启用像素效果时处理
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enablePixelEffect || !containerRef.current) return

      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(() => {
          const rect = containerRef.current?.getBoundingClientRect()
          if (rect) {
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            setMousePosition({ x, y })
          }
          requestRef.current = undefined
        })
      }
    },
    [enablePixelEffect],
  )

  const handleLogoMouseEnter = useCallback(() => {
    if (enablePixelEffect) {
      setIsHovering(true)
    }
  }, [enablePixelEffect])

  const handleLogoMouseLeave = useCallback(() => {
    if (enablePixelEffect) {
      setIsHovering(false)
    }
  }, [enablePixelEffect])

  // Pre-calculate pixel positions and transformations - 只在启用像素效果时计算
  const pixelElements = useMemo(() => {
    if (!enablePixelEffect || !isHovering || pixels.length === 0) {
      return null
    }

    if (randomSeedRef.current.length !== pixels.length) {
      randomSeedRef.current = Array(pixels.length)
        .fill(0)
        .map(() => Math.random())
    }

    if (binaryDigitRef.current.length !== pixels.length) {
      binaryDigitRef.current = Array(pixels.length)
        .fill(0)
        .map(() => (Math.random() > 0.5 ? 1 : 0))
    }

    if (charDisplayRef.current.length !== pixels.length) {
      charDisplayRef.current = Array(pixels.length)
        .fill(0)
        .map(() => Math.random())
    }

    const centerX = (logoWidth * 0.8 * config.GRID_EXPANSION) / 2
    const centerY = (logoHeight * 0.8 * config.GRID_EXPANSION) / 2
    const elements: React.ReactNode[] = []

    pixels.forEach((pixel, index) => {
      const matrixColor = pixel.isBlueArea ? matrixRightColor : matrixLeftColor
      const dx = pixel.x - mousePosition.x
      const dy = pixel.y - mousePosition.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const distanceFromCenter = Math.sqrt(Math.pow(pixel.x - centerX, 2) + Math.pow(pixel.y - centerY, 2))
      const centerFactor = Math.min(1, distanceFromCenter / (logoWidth * 0.4))

      let disappearProbability = 0
      if (distance < config.MOUSE_RADIUS) {
        disappearProbability = 1 - distance / config.MOUSE_RADIUS
        disappearProbability = disappearProbability * (0.7 + centerFactor * 0.3)
      }

      const randomValue = randomSeedRef.current[index]
      const isVisible = randomValue > disappearProbability
      const isInEffectZone = distance < config.MOUSE_RADIUS && randomValue <= disappearProbability
      const binaryDigit = binaryDigitRef.current[index]
      const charDisplayValue = charDisplayRef.current[index]

      let displayChar = ""
      let charSize = config.DIGIT_SIZE

      if (isInEffectZone) {
        const relativeDistance = distance / config.MOUSE_RADIUS

        if (relativeDistance < config.EMPTY_ZONE_RATIO) {
          displayChar = ""
        } else if (relativeDistance < config.STAR_ZONE_RATIO) {
          displayChar = "★"
          charSize = config.DIGIT_SIZE
        } else if (relativeDistance < config.SQUARE_ZONE_RATIO) {
          if (charDisplayValue < config.SQUARE_DENSITY) {
            displayChar = "■"
            charSize = config.DIGIT_SIZE
          }
        } else {
          if (charDisplayValue < config.DIGIT_DENSITY) {
            displayChar = binaryDigit.toString()
            charSize = config.DIGIT_SIZE * 0.9
          }
        }
      }

      if (isInEffectZone) {
        if (displayChar) {
          elements.push(
            <div
              key={`digit-${index}`}
              className="absolute flex items-center justify-center"
              style={{
                width: `${charSize}px`,
                height: `${charSize}px`,
                left: `${pixel.x - (charSize - config.PIXEL_SIZE) / 2}px`,
                top: `${pixel.y - (charSize - config.PIXEL_SIZE) / 2}px`,
                color: matrixColor,
                fontSize: `${charSize - 1}px`,
                lineHeight: 1,
                fontFamily: "monospace",
                fontWeight: "bold",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textShadow: "none",
                transition: "opacity 0.15s ease-in-out",
              }}
            >
              {displayChar}
            </div>,
          )
        }
      } else {
        elements.push(
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
          />,
        )
      }
    })

    return elements
  }, [
    pixels,
    mousePosition,
    isHovering,
    logoWidth,
    logoHeight,
    config,
    matrixLeftColor,
    matrixRightColor,
    enablePixelEffect,
  ])

  // 如果还没有初始化，显示简单的logo
  if (!isInitialized) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ backgroundColor, width, height }}>
        <div style={{ width: `${460 * scaleFactor}px`, height: `${460 * scaleFactor}px` }}>
          <LogoSVG width="100%" height="100%" leftColor={logoLeftColor} rightColor={logoRightColor} />
        </div>
      </div>
    )
  }

  // 如果不启用像素效果，直接返回简单的logo
  if (!enablePixelEffect) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ backgroundColor, width, height }}>
        <div style={{ width: `${logoWidth * 0.8}px`, height: `${logoHeight * 0.8}px` }}>
          <LogoSVG width="100%" height="100%" leftColor={logoLeftColor} rightColor={logoRightColor} />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ backgroundColor, width, height }}
      onMouseMove={handleMouseMove}
    >
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{
          width: `${logoWidth * 0.8 * config.GRID_EXPANSION}px`,
          height: `${logoHeight * 0.8 * config.GRID_EXPANSION}px`,
          maxWidth: "90vw",
          maxHeight: "90vh",
        }}
      >
        {/* 鼠标悬停检测区域 */}
        <div
          className="absolute inset-0 z-30 cursor-pointer"
          onMouseEnter={handleLogoMouseEnter}
          onMouseLeave={handleLogoMouseLeave}
        />

        {/* 原始Logo */}
        <div
          ref={logoRef}
          className="absolute cursor-pointer"
          style={{
            width: `${logoWidth * 0.8}px`,
            height: `${logoHeight * 0.8}px`,
            left: `${(logoWidth * 0.8 * (config.GRID_EXPANSION - 1)) / 2}px`,
            top: `${(logoHeight * 0.8 * (config.GRID_EXPANSION - 1)) / 2}px`,
            zIndex: 20,
            display: isHovering ? "none" : "block",
          }}
        >
          <LogoSVG width="100%" height="100%" leftColor={logoLeftColor} rightColor={logoRightColor} />
        </div>

        {/* 像素化效果 */}
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            display: isHovering ? "block" : "none",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          {pixelElements}
        </div>
      </div>
    </div>
  )
}
