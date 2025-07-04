"use client"

import { useEffect, useRef, useState } from "react"

interface MatrixBackgroundProps {
  density?: number
  speed?: number
  colors?: string[]
  className?: string
  warpSpeed?: boolean
}

interface Character {
  char: string
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  layer: number
  color: string
  // 星际穿梭效果相关
  centerX: number
  centerY: number
  angle: number
  distance: number
  warpSpeed: number
  trail: { x: number; y: number; opacity: number }[]
}

export default function MatrixBackground({
  density = 1.2,
  speed = 0.8,
  colors = ["#FFFFFF", "#3DB7EA", "#888888", "#00FF00"],
  className = "",
  warpSpeed = false,
}: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const charactersRef = useRef<Character[]>([])
  const animationFrameRef = useRef<number>()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isWarping, setIsWarping] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 大幅扩展的编程字符集合
  const characterSets = [
    // 基础编程符号
    ["{", "}", "[", "]", "(", ")", "<", ">", "/", "\\", "|", "-", "+", "=", "*", "&", "%", "$", "#", "@"],
    // 数字和基础符号
    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", ",", ":", ";", "!", "?"],
    // 编程操作符
    ["++", "--", "+=", "-=", "*=", "/=", "==", "!=", "<=", ">=", "&&", "||", ">>", "<<"],
    // 编程关键字符号
    ["=>", "->", "::", "...", "??", "!!", "~", "^", ">>", "<<", "<>", "!="],
    // 函数和方法符号
    ["()", "{}", "[]", "</>", "/*", "*/", "//", "<!--", "-->"],
    // 数据类型符号
    ["int", "str", "var", "let", "const", "def", "fn", "=>", "->"],
    // 特殊编程字符
    ["λ", "∑", "∏", "∆", "∇", "∞", "≠", "≤", "≥", "∈", "∉", "∪", "∩"],
    // 二进制和十六进制
    ["0x", "0b", "FF", "00", "11", "AA", "BB", "CC", "DD", "EE"],
    // 表情符号（编程相关）
    [":)", ":(", ":D", ":-)", ":-(", "o_o", "^_^", "T_T", ">_<", "=_=", ":|", ":P"],
    // 长字符串和模式
    [".........", "---------", ":::::::", "#######", "=========", "+++++++++"],
    // Git和版本控制符号
    ["git", "npm", "pip", "cd", "ls", "pwd", "mkdir", "rm", "cp", "mv"],
    // 网络和协议
    ["http", "https", "ftp", "ssh", "tcp", "udp", "ip", "dns", "api", "url"],
  ]

  // 获取随机字符
  const getRandomCharacter = () => {
    try {
      const setIndex = Math.floor(Math.random() * characterSets.length)
      const charSet = characterSets[setIndex]
      return charSet[Math.floor(Math.random() * charSet.length)]
    } catch (error) {
      console.warn("Error getting random character:", error)
      return "0"
    }
  }

  // 初始化字符
  const initializeCharacters = (width: number, height: number) => {
    try {
      const characters: Character[] = []
      const numCharacters = Math.floor((width * height * density) / 5000) // 增加密度

      const centerX = width / 2
      const centerY = height / 2

      for (let i = 0; i < numCharacters; i++) {
        // 创建4个不同的景深层
        const layer = Math.floor(Math.random() * 4) + 1
        let size: number
        let opacity: number
        let speed: number
        let color: string

        switch (layer) {
          case 1: // 最前景层 - 最大、最亮、最快
            size = 16 + Math.random() * 10
            opacity = 0.9 + Math.random() * 0.1
            speed = 2 + Math.random() * 1.5
            color = colors[0] // 白色
            break
          case 2: // 前景层 - 大、亮、快
            size = 12 + Math.random() * 6
            opacity = 0.6 + Math.random() * 0.3
            speed = 1.2 + Math.random() * 1
            color = Math.random() > 0.6 ? colors[1] : colors[0] // 主要白色，偶尔蓝色
            break
          case 3: // 中景层 - 中等
            size = 8 + Math.random() * 4
            opacity = 0.3 + Math.random() * 0.4
            speed = 0.6 + Math.random() * 0.8
            color = Math.random() > 0.5 ? colors[2] : Math.random() > 0.8 ? colors[3] : colors[0]
            break
          case 4: // 背景层 - 小、暗、慢
            size = 4 + Math.random() * 3
            opacity = 0.1 + Math.random() * 0.2
            speed = 0.2 + Math.random() * 0.4
            color = colors[2] // 灰色
            break
          default:
            size = 10
            opacity = 0.5
            speed = 1
            color = colors[0]
        }

        // 星际穿梭效果的初始位置和参数
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * Math.min(width, height) * 0.3

        characters.push({
          char: getRandomCharacter(),
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          opacity,
          speed: speed * speed,
          layer,
          color,
          centerX,
          centerY,
          angle,
          distance,
          warpSpeed: 0,
          trail: [],
        })
      }

      charactersRef.current = characters
    } catch (error) {
      console.error("Error initializing characters:", error)
      charactersRef.current = []
    }
  }

  // 星际穿梭效果
  const updateWarpEffect = (width: number, height: number) => {
    try {
      const centerX = width / 2
      const centerY = height / 2

      charactersRef.current.forEach((char) => {
        // 更新中心点
        char.centerX = centerX
        char.centerY = centerY

        // 增加穿梭速度
        char.warpSpeed += 0.5 + char.layer * 0.2

        // 计算新位置（从中心向外辐射）
        const warpDistance = char.distance + char.warpSpeed
        char.x = centerX + Math.cos(char.angle) * warpDistance
        char.y = centerY + Math.sin(char.angle) * warpDistance

        // 添加拖尾效果
        char.trail.unshift({ x: char.x, y: char.y, opacity: char.opacity })
        if (char.trail.length > 8) {
          char.trail.pop()
        }

        // 重置超出屏幕的字符
        const maxDistance = Math.max(width, height)
        if (warpDistance > maxDistance) {
          char.distance = Math.random() * 50
          char.warpSpeed = 0
          char.angle = Math.random() * Math.PI * 2
          char.char = getRandomCharacter()
          char.trail = []
        }
      })
    } catch (error) {
      console.warn("Error in warp effect:", error)
    }
  }

  // 普通矩阵效果
  const updateNormalEffect = (width: number, height: number) => {
    try {
      charactersRef.current.forEach((char) => {
        // 缓慢向下移动
        char.y += char.speed * 0.3

        // 添加轻微的水平漂移
        char.x += (Math.random() - 0.5) * 0.2

        // 重置超出屏幕的字符
        if (char.y > height + char.size) {
          char.y = -char.size
          char.x = Math.random() * width
          char.char = getRandomCharacter()
        }

        // 边界检查
        if (char.x < -char.size) char.x = width + char.size
        if (char.x > width + char.size) char.x = -char.size

        // 随机改变字符（低概率）
        if (Math.random() < 0.002) {
          char.char = getRandomCharacter()
        }

        // 清空拖尾
        char.trail = []
      })
    } catch (error) {
      console.warn("Error in normal effect:", error)
    }
  }

  // 更新字符位置
  const updateCharacters = (width: number, height: number) => {
    if (isWarping) {
      updateWarpEffect(width, height)
    } else {
      updateNormalEffect(width, height)
    }
  }

  // 渲染字符
  const renderCharacters = (ctx: CanvasRenderingContext2D) => {
    try {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      // 按层次排序渲染（背景层先渲染）
      const sortedChars = [...charactersRef.current].sort((a, b) => b.layer - a.layer)

      sortedChars.forEach((char) => {
        try {
          // 渲染拖尾效果（星际穿梭时）
          if (isWarping && char.trail.length > 0) {
            char.trail.forEach((trailPoint, index) => {
              ctx.save()
              const trailOpacity = ((trailPoint.opacity * (char.trail.length - index)) / char.trail.length) * 0.3
              ctx.font = `${char.size * 0.8}px 'Courier New', monospace`
              ctx.fillStyle = char.color
              ctx.globalAlpha = trailOpacity

              if (char.layer >= 3) {
                ctx.filter = "blur(1px)"
              }

              ctx.fillText(char.char, trailPoint.x, trailPoint.y)
              ctx.restore()
            })
          }

          // 渲染主字符
          ctx.save()

          // 设置字符样式
          ctx.font = `${char.size}px 'Courier New', monospace`
          ctx.fillStyle = char.color
          ctx.globalAlpha = char.opacity

          // 添加模糊效果给背景层
          if (char.layer === 4) {
            ctx.filter = "blur(1px)"
          } else if (char.layer === 3) {
            ctx.filter = "blur(0.5px)"
          } else if (char.layer === 2) {
            ctx.filter = "blur(0.2px)"
          } else {
            ctx.filter = "none"
          }

          // 星际穿梭时添加发光效果
          if (isWarping && char.layer <= 2) {
            ctx.shadowColor = char.color
            ctx.shadowBlur = char.size * 0.5
          }

          // 渲染字符
          ctx.fillText(char.char, char.x, char.y)

          ctx.restore()
        } catch (error) {
          console.warn("Error rendering character:", error)
        }
      })
    } catch (error) {
      console.error("Error in renderCharacters:", error)
    }
  }

  // 动画循环
  const animate = () => {
    try {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      updateCharacters(canvas.width, canvas.height)
      renderCharacters(ctx)

      animationFrameRef.current = requestAnimationFrame(animate)
    } catch (error) {
      console.error("Error in animation loop:", error)
    }
  }

  // 定期切换星际穿梭效果
  useEffect(() => {
    if (!isClient) return

    const interval = setInterval(() => {
      setIsWarping((prev) => !prev)
    }, 8000) // 每8秒切换一次

    return () => clearInterval(interval)
  }, [isClient])

  // 处理窗口大小变化
  useEffect(() => {
    if (!isClient) return

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [isClient])

  // 初始化和启动动画
  useEffect(() => {
    if (!isClient || dimensions.width === 0 || dimensions.height === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    try {
      // 设置canvas尺寸
      canvas.width = dimensions.width
      canvas.height = dimensions.height

      // 初始化字符
      initializeCharacters(dimensions.width, dimensions.height)

      // 启动动画
      animate()
    } catch (error) {
      console.error("Error initializing canvas:", error)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [dimensions, density, speed, isClient])

  // 如果不是客户端，不渲染
  if (!isClient) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        zIndex: -1,
        background: "transparent",
      }}
    />
  )
}
