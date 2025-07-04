"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"

interface CustomCursorProps {
  menuOpen?: boolean
  isWelcomePage?: boolean
}

export default function CustomCursor({ menuOpen = false, isWelcomePage = false }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Memoize event handlers to prevent recreation on every render
  const onMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }, [])

  const onMouseEnter = useCallback(() => {
    setIsVisible(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    setIsVisible(false)
  }, [])

  const onMouseDown = useCallback(() => {
    setIsClicking(true)
  }, [])

  const onMouseUp = useCallback(() => {
    setIsClicking(false)
  }, [])

  const onLinkMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const onLinkMouseLeave = useCallback(() => {
    setIsHovering(false)
  }, [])

  useEffect(() => {
    // 早期返回，避免服务器端渲染问题
    if (typeof window === "undefined") return

    // 隐藏原生鼠标指针
    document.body.style.cursor = "none"

    // 添加事件监听器
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseenter", onMouseEnter)
    document.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("mouseup", onMouseUp)

    // 添加链接和按钮的悬停效果
    const addHoverEffectToLinks = () => {
      const links = document.querySelectorAll("a, button, [role='button']")

      links.forEach((link) => {
        link.addEventListener("mouseenter", onLinkMouseEnter)
        link.addEventListener("mouseleave", onLinkMouseLeave)
      })

      // Return cleanup function for links
      return () => {
        links.forEach((link) => {
          link.removeEventListener("mouseenter", onLinkMouseEnter)
          link.removeEventListener("mouseleave", onLinkMouseLeave)
        })
      }
    }

    // Add hover effects after a delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const cleanupLinks = addHoverEffectToLinks()

      // Store cleanup function for later use
      return cleanupLinks
    }, 1000)

    // Cleanup function
    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseenter", onMouseEnter)
      document.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("mouseup", onMouseUp)
      document.body.style.cursor = "auto"

      // Clean up link event listeners
      const links = document.querySelectorAll("a, button, [role='button']")
      links.forEach((link) => {
        link.removeEventListener("mouseenter", onLinkMouseEnter)
        link.removeEventListener("mouseleave", onLinkMouseLeave)
      })
    }
  }, [onMouseMove, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp, onLinkMouseEnter, onLinkMouseLeave])

  // 修改 getCursorImage 函数，根据页面类型选择光标颜色
  const getCursorImage = () => {
    if (isWelcomePage) {
      // 在欢迎页使用白色光标
      return isHovering ? `/images/cursor-white.png` : `/images/cursor-white.png`
    } else if (menuOpen) {
      // 在菜单打开时使用默认光标
      return isHovering ? `/images/cursor-default.png` : `/images/cursor-hover.png`
    } else {
      // 在正常状态下使用原来的光标
      return isHovering ? `/images/cursor-default.png` : `/images/cursor-hover.png`
    }
  }

  return (
    <motion.div
      className="custom-cursor"
      style={{
        backgroundImage: `url('${getCursorImage()}')`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        width: isClicking ? "18px" : "20px",
        height: isClicking ? "18px" : "20px",
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        transform: `translate(${position.x - (isClicking ? 9 : 10)}px, ${position.y - (isClicking ? 9 : 10)}px)`,
        opacity: isVisible ? 1 : 0,
        transition: "width 0.2s, height 0.2s, background-image 0.3s",
      }}
    />
  )
}
