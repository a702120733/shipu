"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { League_Spartan } from "next/font/google"

// 导入League Spartan字体
const leagueSpartan = League_Spartan({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-league-spartan",
})

interface AboutSectionProps {
  startTyping?: boolean
  textPhase: "idle" | "typing1" | "typed1" | "deleting" | "typing2" | "complete"
  onPhaseComplete: (phase: "typing1" | "typing2") => void
}

export default function AboutSection({ startTyping = false, textPhase, onPhaseComplete }: AboutSectionProps) {
  const [animationStarted, setAnimationStarted] = useState(false)
  const [showFirstTitle, setShowFirstTitle] = useState(false)
  const [showSecondTitle, setShowSecondTitle] = useState(false)
  const [showFirstLine, setShowFirstLine] = useState(false)
  const [showSecondLine, setShowSecondLine] = useState(false)
  const [firstTitleText, setFirstTitleText] = useState("")
  const [secondTitleText, setSecondTitleText] = useState("")
  const [firstLineText, setFirstLineText] = useState("")
  const [secondLineText, setSecondLineText] = useState("")

  const firstTitleFullText = "Hello, There!"
  const secondTitleFullText = "This is FFT Investment"
  const firstLineFullText = "Understand and promote global markets with cutting-edge technology."
  const secondLineFullText = "Elite team leads innovation through collaboration."

  const firstTitleTimerRef = useRef<NodeJS.Timeout>()
  const secondTitleTimerRef = useRef<NodeJS.Timeout>()
  const firstLineTimerRef = useRef<NodeJS.Timeout>()
  const secondLineTimerRef = useRef<NodeJS.Timeout>()

  // 清理定时器
  const clearTimers = () => {
    if (firstTitleTimerRef.current) clearTimeout(firstTitleTimerRef.current)
    if (secondTitleTimerRef.current) clearTimeout(secondTitleTimerRef.current)
    if (firstLineTimerRef.current) clearTimeout(firstLineTimerRef.current)
    if (secondLineTimerRef.current) clearTimeout(secondLineTimerRef.current)
  }

  // 打字机效果函数
  const typeText = (text: string, setText: (text: string) => void, onComplete?: () => void, speed = 50) => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= text.length) {
        setText(text.slice(0, index))
        index++
      } else {
        clearInterval(timer)
        if (onComplete) onComplete()
      }
    }, speed)
    return timer
  }

  // 当组件接收到开始信号时，启动动画
  useEffect(() => {
    if (startTyping && !animationStarted && textPhase !== "complete") {
      setAnimationStarted(true)

      // 立即开始第一个标题的打字机效果
      setTimeout(() => {
        setShowFirstTitle(true)
        setFirstTitleText("") // 确保从空开始
        firstTitleTimerRef.current = typeText(
          firstTitleFullText,
          setFirstTitleText,
          () => {
            // 第一个标题完成后，开始第二个标题
            setTimeout(() => {
              setShowSecondTitle(true)
              setSecondTitleText("") // 确保从空开始
              secondTitleTimerRef.current = typeText(
                secondTitleFullText,
                setSecondTitleText,
                () => {
                  // 第二个标题完成后，触发第一阶段完成
                  onPhaseComplete("typing1")

                  // 开始第一行描述文字
                  setTimeout(() => {
                    setShowFirstLine(true)
                    setFirstLineText("") // 确保从空开始
                    firstLineTimerRef.current = typeText(
                      firstLineFullText,
                      setFirstLineText,
                      () => {
                        // 第一行完成后，开始第二行
                        setTimeout(() => {
                          setShowSecondLine(true)
                          setSecondLineText("") // 确保从空开始
                          secondLineTimerRef.current = typeText(
                            secondLineFullText,
                            setSecondLineText,
                            () => {
                              // 动画完成
                            },
                            25,
                          )
                        }, 200)
                      },
                      30,
                    )
                  }, 500)
                },
                60,
              )
            }, 300)
          },
          80,
        )
      }, 500)
    }

    // 移除clearTimers的返回，让打字效果持续进行
  }, [startTyping, animationStarted, onPhaseComplete, textPhase])

  // 处理 complete 状态的单独 useEffect
  useEffect(() => {
    if (textPhase === "complete" && startTyping && !animationStarted) {
      // 只有在还没开始动画时才立即显示完整内容
      clearTimers()
      setShowFirstTitle(true)
      setShowSecondTitle(true)
      setShowFirstLine(true)
      setShowSecondLine(true)
      setFirstTitleText(firstTitleFullText)
      setSecondTitleText(secondTitleFullText)
      setFirstLineText(firstLineFullText)
      setSecondLineText(secondLineFullText)
      setAnimationStarted(true)
    }
  }, [textPhase, startTyping, animationStarted])

  // 添加重置功能，当用户重新进入页面时重置状态
  useEffect(() => {
    if (startTyping && textPhase === "idle") {
      // 重置所有状态
      setAnimationStarted(false)
      setShowFirstTitle(false)
      setShowSecondTitle(false)
      setShowFirstLine(false)
      setShowSecondLine(false)
      setFirstTitleText("")
      setSecondTitleText("")
      setFirstLineText("")
      setSecondLineText("")
      clearTimers()
    }
  }, [startTyping, textPhase])

  // 组件卸载时清理定时器 - 只在真正卸载时清理
  useEffect(() => {
    return () => {
      // 只在组件真正卸载时才清理定时器
      clearTimers()
    }
  }, [])

  // 打字机文本容器动画
  const typewriterContainerVariants = {
    hidden: {
      opacity: 0,
      visibility: "hidden", // 添加 visibility 确保完全隐藏
    },
    visible: {
      opacity: 1,
      visibility: "visible", // 显示时恢复 visibility
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="w-full h-screen flex items-center justify-center px-12 relative z-10">
      {/* Fixed background - 相对于整个视口定位，不受任何父容器限制 */}
      <div
        className="fixed top-0 right-0 opacity-100 pointer-events-none z-0"
        style={{
          backgroundImage: "url(/images/gradient-background.png)",
          backgroundSize: "contain",
          backgroundPosition: "top right",
          backgroundRepeat: "no-repeat",
          width: "60vw", // 增加宽度
          height: "100vh", // 使用全视口高度
        }}
      />

      <div className="w-full flex items-center justify-center">
        {/* 内容区域 - 完全居中 */}
        <div className={`text-center max-w-6xl ${leagueSpartan.variable}`}>
          {/* Hello, There! - 打字机效果 - 固定容器高度和行高 */}
          <div
            className="mb-4"
            style={{
              height: "120px", // 固定高度，与字体大小匹配
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              variants={typewriterContainerVariants}
              initial="hidden"
              animate={showFirstTitle ? "visible" : "hidden"}
              className="w-full flex items-center justify-center"
            >
              <div
                style={{
                  fontFamily: "var(--font-league-spartan), sans-serif",
                  fontSize: "120px",
                  fontWeight: "700",
                  color: "#3DB7EA",
                  letterSpacing: "-0.02em",
                  lineHeight: "120px", // 明确设置行高等于字体大小
                  display: "flex",
                  alignItems: "center", // 改为 center 确保垂直居中
                  justifyContent: "center",
                  width: "100%",
                  height: "120px", // 固定文本容器高度
                  position: "relative", // 添加相对定位
                }}
              >
                <span style={{ display: "inline-block" }}>{firstTitleText}</span>
                {/* 光标始终存在，只是透明度变化 */}
                <span
                  className={`bg-[#3DB7EA] ${
                    showFirstTitle && firstTitleText.length < firstTitleFullText.length ? "animate-blink" : ""
                  }`}
                  style={{
                    width: "4px",
                    height: "100px", // 稍微小于字体大小
                    display: "inline-block",
                    marginLeft: "8px",
                    opacity: showFirstTitle && firstTitleText.length < firstTitleFullText.length ? 1 : 0,
                    transition: "opacity 0.3s ease", // 平滑的透明度过渡
                  }}
                ></span>
              </div>
            </motion.div>
          </div>

          {/* This is FFT Investment - 打字机效果 - 固定容器高度和行高 */}
          <div
            className="mb-16"
            style={{
              height: "120px", // 固定高度，与字体大小匹配
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              variants={typewriterContainerVariants}
              initial="hidden"
              animate={showSecondTitle ? "visible" : "hidden"}
              className="w-full flex items-center justify-center"
            >
              <div
                style={{
                  fontFamily: "var(--font-league-spartan), sans-serif",
                  fontSize: "120px",
                  fontWeight: "700",
                  color: "#3DB7EA",
                  letterSpacing: "-0.02em",
                  lineHeight: "120px", // 明确设置行高等于字体大小
                  display: "flex",
                  alignItems: "center", // 改为 center 确保垂直居中
                  justifyContent: "center",
                  width: "100%",
                  height: "120px", // 固定文本容器高度
                  position: "relative", // 添加相对定位
                }}
              >
                <span style={{ display: "inline-block" }}>{secondTitleText}</span>
                {/* 光标始终存在，只是透明度变化 */}
                <span
                  className={`bg-[#3DB7EA] ${
                    showSecondTitle && secondTitleText.length < secondTitleFullText.length ? "animate-blink" : ""
                  }`}
                  style={{
                    width: "4px",
                    height: "100px", // 稍微小于字体大小
                    display: "inline-block",
                    marginLeft: "8px",
                    opacity: showSecondTitle && secondTitleText.length < secondTitleFullText.length ? 1 : 0,
                    transition: "opacity 0.3s ease", // 平滑的透明度过渡
                  }}
                ></span>
              </div>
            </motion.div>
          </div>

          {/* 第一行描述文字 - 打字机效果 - 固定容器高度和行高 */}
          <div
            className="my-0"
            style={{
              height: "24px", // 固定高度，与字体大小匹配
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showFirstLine && (
              <div
                style={{
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontSize: "20px",
                  fontWeight: "400",
                  color: "#3C4043",
                  letterSpacing: "0.01em",
                  lineHeight: "24px", // 明确设置行高
                  display: "flex",
                  alignItems: "center", // 改为 center 确保垂直居中
                  justifyContent: "center",
                  width: "100%",
                  height: "24px", // 固定文本容器高度
                  position: "relative", // 添加相对定位
                }}
              >
                <span style={{ display: "inline-block" }}>{firstLineText}</span>
                {/* 光标始终存在，只是透明度变化 */}
                <span
                  className={`bg-[#3C4043] ${firstLineText.length < firstLineFullText.length ? "animate-blink" : ""}`}
                  style={{
                    width: "2px",
                    height: "18px", // 稍微小于字体大小
                    display: "inline-block",
                    marginLeft: "4px",
                    opacity: firstLineText.length < firstLineFullText.length ? 1 : 0,
                    transition: "opacity 0.3s ease", // 平滑的透明度过渡
                  }}
                ></span>
              </div>
            )}
          </div>

          {/* 第二行描述文字 - 打字机效果 - 固定容器高度和行高 */}
          <div
            className="mb-20"
            style={{
              height: "24px", // 固定高度，与字体大小匹配
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showSecondLine && (
              <div
                style={{
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontSize: "20px",
                  fontWeight: "400",
                  color: "#3C4043",
                  letterSpacing: "0.01em",
                  lineHeight: "24px", // 明确设置行高
                  display: "flex",
                  alignItems: "center", // 改为 center 确保垂直居中
                  justifyContent: "center",
                  width: "100%",
                  height: "24px", // 固定文本容器高度
                  position: "relative", // 添加相对定位
                }}
              >
                <span style={{ display: "inline-block" }}>{secondLineText}</span>
                {/* 光标始终存在，只是透明度变化 */}
                <span
                  className={`bg-[#3C4043] ${secondLineText.length < secondLineFullText.length ? "animate-blink" : ""}`}
                  style={{
                    width: "2px",
                    height: "18px", // 稍微小于字体大小
                    display: "inline-block",
                    marginLeft: "4px",
                    opacity: secondLineText.length < secondLineFullText.length ? 1 : 0,
                    transition: "opacity 0.3s ease", // 平滑的透明度过渡
                  }}
                ></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
