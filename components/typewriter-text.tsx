"use client"

import { useState, useEffect, useRef, type ElementType } from "react"

interface TypewriterTextProps {
  text: string
  className?: string
  speed?: number
  delay?: number
  as?: ElementType
  forceStart?: boolean
}

export default function TypewriterText({
  text,
  className = "",
  speed = 40,
  delay = 300,
  as: Component = "span",
  forceStart = false,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const typingStarted = useRef(false)
  const ref = useRef<HTMLDivElement>(null)

  // 使用Intersection Observer API检测元素是否在视口内
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }, // 当10%的元素可见时触发
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  // 打字机效果
  useEffect(() => {
    // 如果已经开始打字，不再重新开始
    if (typingStarted.current) return

    // 只有当元素可见或forceStart为true时才开始打字效果
    if (!isVisible && !forceStart) return

    console.log("Starting typing effect for:", text) // 调试信息
    typingStarted.current = true

    // 添加初始延迟
    const startDelay = setTimeout(() => {
      let currentIndex = 0
      const typingInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(typingInterval)
          setIsTypingComplete(true)
        }
      }, speed)

      return () => clearInterval(typingInterval)
    }, delay)

    return () => clearTimeout(startDelay)
  }, [isVisible, forceStart, text, speed, delay])

  return (
    <div ref={ref} className={`typewriter-container ${className}`}>
      <Component className="typewriter-text relative">
        {displayedText}
        {(isVisible || forceStart) && !isTypingComplete && (
          <span className="inline-block w-0.5 h-8 bg-current ml-0.5 animate-blink"></span>
        )}
      </Component>
    </div>
  )
}
