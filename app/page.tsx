"use client"

import { useEffect, useRef, useState } from "react"
import { League_Spartan } from "next/font/google"
import AboutSection from "@/components/about-section"
import ServicesSection from "@/components/services-section"
import TeamSection from "@/components/team-section"
import ContactSection from "@/components/contact-section"
import CustomCursor from "@/components/custom-cursor"
import GlobalScrollIndicator from "@/components/global-scroll-indicator"
import WelcomeAnimation from "@/components/welcome-animation"
import LoadingAnimation from "@/components/loading-animation"
import GridContainer from "@/components/grid-container"
import Navbar from "@/components/navbar"
import BenefitsSection from "@/components/benefits-section"
import MatrixBackground from "@/components/matrix-background"

// 导入League Spartan字体
const leagueSpartan = League_Spartan({
  weight: "600",
  subsets: ["latin"],
})

// 定义应用状态类型
type AppState =
  | "loading" // 加载中
  | "welcome" // 欢迎动画（包含矩阵背景）
  | "firstPage_initial" // 第一页初始状态
  | "firstPage_typing1" // 第一页文本打字中
  | "firstPage_typed1" // 第一页文本完成
  | "firstPage_complete" // 第一页完成
  | "secondPage" // 第二页
  | "thirdPage" // Benefits页面
  | "fourthPage" // Team页面
  | "fifthPage" // Contact页面

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [appState, setAppState] = useState<AppState>("loading")
  const [currentSection, setCurrentSection] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const sections = useRef<HTMLDivElement[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const wheelLock = useRef(false)
  const aboutSectionKey = useRef(Date.now())
  const isScrolling = useRef(false)
  const scrollAccumulator = useRef(0)

  // 调整滚轮阈值 - 使用更合理的值
  const scrollThreshold = 30 // 降低到30，提高响应性但避免过于敏感

  // 确保组件只在客户端渲染
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 处理加载动画完成
  const handleLoadingComplete = () => {
    console.log("Loading animation complete, transitioning to welcome state")
    setAppState("welcome")
  }

  // 处理欢迎动画完成
  const handleWelcomeAnimationComplete = () => {
    console.log("Welcome animation complete, ready for interaction")
  }

  // 处理从欢迎页到第一页的转换
  const handleWelcomeToFirstPage = () => {
    console.log("Transitioning from welcome to first page")
    window.lastTransitionTime = Date.now() // 记录转换时间
    setAppState("firstPage_typing1")
    setCurrentSection(0)

    setTimeout(() => {
      isScrolling.current = false
      wheelLock.current = false
      scrollAccumulator.current = 0
    }, 100)
  }

  // 处理文本动画阶段完成
  const handleTextPhaseComplete = (phase: "typing1" | "typing2") => {
    if (phase === "typing1") {
      setAppState("firstPage_typed1")
    } else if (phase === "typing2") {
      setAppState("firstPage_complete")
    }
  }

  // 处理菜单状态变化
  const handleMenuToggle = (isOpen: boolean) => {
    setMenuOpen(isOpen)
  }

  // 主页面的滚轮事件处理
  useEffect(() => {
    if (!isClient) return

    // 只在非加载和非欢迎页状态下处理滚轮事件
    if (appState === "loading" || appState === "welcome") return

    function handleWheel(event: WheelEvent) {
      // 在状态转换期间不处理滚轮事件
      if (appState === "firstPage_typing1" && currentSection === 0) {
        // 如果刚从欢迎页转换过来，给一些时间让动画开始
        const now = Date.now()
        if (!window.lastTransitionTime || now - window.lastTransitionTime < 1000) {
          return
        }
      }

      // 检查滚动锁定状态
      if (isScrolling.current || wheelLock.current) {
        return
      }

      // 累积滚轮值
      scrollAccumulator.current += Math.abs(event.deltaY)
      if (scrollAccumulator.current < scrollThreshold) return

      // 防止默认滚动行为
      event.preventDefault()

      // 重置累积值并设置锁
      scrollAccumulator.current = 0
      wheelLock.current = true
      isScrolling.current = true

      // 设置锁定时间
      setTimeout(() => {
        wheelLock.current = false
      }, 500)

      // 处理滚动逻辑 - 简化逻辑
      const isScrollingDown = event.deltaY > 0

      if (isScrollingDown) {
        // 向下滚动
        if (currentSection < 4) {
          const nextSection = currentSection + 1
          setCurrentSection(nextSection)

          // 根据目标section设置对应的状态
          switch (nextSection) {
            case 1:
              setAppState("secondPage")
              break
            case 2:
              setAppState("thirdPage")
              break
            case 3:
              setAppState("fourthPage")
              break
            case 4:
              setAppState("fifthPage")
              break
          }

          // 滚动到目标section
          setTimeout(() => {
            if (sections.current[nextSection]) {
              sections.current[nextSection].scrollIntoView({ behavior: "smooth" })
            }
          }, 50)
        }
      } else {
        // 向上滚动
        if (currentSection > 0) {
          const prevSection = currentSection - 1
          setCurrentSection(prevSection)

          // 根据目标section设置对应的状态
          switch (prevSection) {
            case 0:
              setAppState("firstPage_complete")
              break
            case 1:
              setAppState("secondPage")
              break
            case 2:
              setAppState("thirdPage")
              break
            case 3:
              setAppState("fourthPage")
              break
          }

          // 滚动到目标section
          setTimeout(() => {
            if (sections.current[prevSection]) {
              sections.current[prevSection].scrollIntoView({ behavior: "smooth" })
            }
          }, 50)
        }
      }

      // 重置滚动状态
      setTimeout(() => {
        isScrolling.current = false
      }, 600)
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      window.removeEventListener("wheel", handleWheel)
    }
  }, [appState, isClient, currentSection])

  // 获取当前文本阶段
  const getTextPhase = () => {
    switch (appState) {
      case "firstPage_typing1":
        return "typing1"
      case "firstPage_typed1":
      case "firstPage_complete":
        return "complete"
      default:
        return "idle"
    }
  }

  // 如果不是客户端，返回null而不是显示Loading
  if (!isClient) {
    return null
  }

  // 渲染主内容
  return (
    <main className="h-screen w-full overflow-hidden text-[#3C4043] bg-white">
      {/* 加载动画 */}
      {appState === "loading" && <LoadingAnimation onComplete={handleLoadingComplete} />}

      {/* 欢迎动画（包含矩阵背景和滚动功能） */}
      {appState === "welcome" && (
        <>
          <CustomCursor isWelcomePage={true} />
          <WelcomeAnimation onComplete={handleWelcomeAnimationComplete} onScroll={handleWelcomeToFirstPage} />
        </>
      )}

      {/* 主内容 - 只有在欢迎页之后才显示 */}
      <div className={`h-full ${appState !== "loading" && appState !== "welcome" ? "opacity-100" : "opacity-0"}`}>
        <CustomCursor />
        <MatrixBackground
          density={1.2}
          speed={0.8}
          colors={["#FFFFFF", "#3DB7EA", "#888888", "#00FF00"]}
          warpSpeed={false}
        />
        <Navbar showLogo={true} onMenuToggle={handleMenuToggle} />
        <GridContainer>
          <div ref={containerRef} className="h-full overflow-hidden">
            <div className="h-full snap-y snap-mandatory overflow-y-auto scrollbar-hide">
              {/* ABOUT */}
              <section
                ref={(el) => {
                  if (el) sections.current[0] = el
                }}
                className="h-screen w-full snap-start flex items-center justify-center relative"
                id="section-0"
              >
                <AboutSection
                  key={aboutSectionKey.current}
                  startTyping={appState !== "loading" && appState !== "welcome"}
                  textPhase={getTextPhase()}
                  onPhaseComplete={handleTextPhaseComplete}
                />
                {currentSection === 0 && <div className="absolute bottom-8 animate-bounce"></div>}
              </section>

              {/* SERVICES */}
              <section
                ref={(el) => {
                  if (el) sections.current[1] = el
                }}
                className="h-screen w-full snap-start flex items-center justify-center"
                id="section-1"
              >
                <ServicesSection />
              </section>

              {/* BENEFITS - Our mission is... */}
              <section
                ref={(el) => {
                  if (el) sections.current[2] = el
                }}
                className="h-screen w-full snap-start flex items-center justify-center"
                id="section-2"
              >
                <BenefitsSection />
              </section>

              {/* TEAM */}
              <section
                ref={(el) => {
                  if (el) sections.current[3] = el
                }}
                className="h-screen w-full snap-start flex items-center justify-center"
                id="section-3"
              >
                <TeamSection />
              </section>

              {/* CONTACT */}
              <section
                ref={(el) => {
                  if (el) sections.current[4] = el
                }}
                className="h-screen w-full snap-start flex items-center justify-center"
                id="section-4"
              >
                <ContactSection />
              </section>
            </div>
          </div>
        </GridContainer>

        {/* Global Scroll Indicator */}
        <GlobalScrollIndicator show={appState !== "loading" && appState !== "welcome" && currentSection < 4} />
      </div>
    </main>
  )
}
