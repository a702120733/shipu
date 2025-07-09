"use client"

import { useEffect, useRef, useState, useCallback } from "react"
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
import OptimizedBenefitsSection from "@/components/optimized-benefits-section"

const leagueSpartan = League_Spartan({
  weight: "600",
  subsets: ["latin"],
})

type AppState =
  | "loading"
  | "welcome"
  | "firstPage_initial"
  | "firstPage_typing1"
  | "firstPage_typed1"
  | "firstPage_complete"
  | "secondPage"
  | "thirdPage"
  | "fourthPage"
  | "fifthPage"

export default function OptimizedHome() {
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

  const scrollThreshold = 25 // 减少阈值提高响应性

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 优化加载完成处理
  const handleLoadingComplete = useCallback(() => {
    console.log("Loading animation complete, transitioning to welcome state")
    setAppState("welcome")
  }, [])

  const handleWelcomeAnimationComplete = useCallback(() => {
    console.log("Welcome animation complete, ready for interaction")
  }, [])

  const handleWelcomeToFirstPage = useCallback(() => {
    console.log("Transitioning from welcome to first page")
    window.lastTransitionTime = Date.now()
    setAppState("firstPage_typing1")
    setCurrentSection(0)

    setTimeout(() => {
      isScrolling.current = false
      wheelLock.current = false
      scrollAccumulator.current = 0
    }, 100)
  }, [])

  const handleTextPhaseComplete = useCallback((phase: "typing1" | "typing2") => {
    if (phase === "typing1") {
      setAppState("firstPage_typed1")
    } else if (phase === "typing2") {
      setAppState("firstPage_complete")
    }
  }, [])

  const handleMenuToggle = useCallback((isOpen: boolean) => {
    setMenuOpen(isOpen)
  }, [])

  // 优化滚轮事件处理 - 使用 useCallback 避免重复创建
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (appState === "loading" || appState === "welcome") return

      if (appState === "firstPage_typing1" && currentSection === 0) {
        const now = Date.now()
        if (!window.lastTransitionTime || now - window.lastTransitionTime < 1000) {
          return
        }
      }

      if (isScrolling.current || wheelLock.current) return

      scrollAccumulator.current += Math.abs(event.deltaY)
      if (scrollAccumulator.current < scrollThreshold) return

      event.preventDefault()
      scrollAccumulator.current = 0
      wheelLock.current = true
      isScrolling.current = true

      setTimeout(() => {
        wheelLock.current = false
      }, 400) // 减少锁定时间

      const isScrollingDown = event.deltaY > 0

      if (isScrollingDown && currentSection < 4) {
        const nextSection = currentSection + 1
        setCurrentSection(nextSection)

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

        setTimeout(() => {
          if (sections.current[nextSection]) {
            sections.current[nextSection].scrollIntoView({ behavior: "smooth" })
          }
        }, 50)
      } else if (!isScrollingDown && currentSection > 0) {
        const prevSection = currentSection - 1
        setCurrentSection(prevSection)

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

        setTimeout(() => {
          if (sections.current[prevSection]) {
            sections.current[prevSection].scrollIntoView({ behavior: "smooth" })
          }
        }, 50)
      }

      setTimeout(() => {
        isScrolling.current = false
      }, 500) // 减少重置时间
    },
    [appState, currentSection],
  )

  // 优化滚轮事件监听器
  useEffect(() => {
    if (!isClient) return
    if (appState === "loading" || appState === "welcome") return

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      window.removeEventListener("wheel", handleWheel)
    }
  }, [handleWheel, isClient, appState])

  const getTextPhase = useCallback(() => {
    switch (appState) {
      case "firstPage_typing1":
        return "typing1"
      case "firstPage_typed1":
      case "firstPage_complete":
        return "complete"
      default:
        return "idle"
    }
  }, [appState])

  if (!isClient) {
    return null
  }

  return (
    <main className="h-screen w-full overflow-hidden text-[#3C4043] bg-white">
      {appState === "loading" && <LoadingAnimation onComplete={handleLoadingComplete} />}

      {appState === "welcome" && (
        <>
          <CustomCursor isWelcomePage={true} />
          <WelcomeAnimation onComplete={handleWelcomeAnimationComplete} onScroll={handleWelcomeToFirstPage} />
        </>
      )}

      <div className={`h-full ${appState !== "loading" && appState !== "welcome" ? "opacity-100" : "opacity-0"}`}>
        <CustomCursor />
        <Navbar showLogo={true} onMenuToggle={handleMenuToggle} />
        <GridContainer>
          <div ref={containerRef} className="h-full overflow-hidden">
            <div className="h-full snap-y snap-mandatory overflow-y-auto scrollbar-hide">
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

              <section
                ref={(el) => {
                  if (el) sections.current[1] = el
                }}
                className="h-screen w-full snap-start flex items-center justify-center"
                id="section-1"
              >
                <ServicesSection />
              </section>

              <section
                ref={(el) => {
                  if (el) sections.current[2] = el
                }}
                className="h-screen w-full snap-start flex items-center justify-center"
                id="section-2"
              >
                <OptimizedBenefitsSection />
              </section>

              <section
                ref={(el) => {
                  if (el) sections.current[3] = el
                }}
                className="h-screen w-full snap-start flex items-center justify-center"
                id="section-3"
              >
                <TeamSection />
              </section>

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

        <GlobalScrollIndicator show={appState !== "loading" && appState !== "welcome" && currentSection < 4} />
      </div>
    </main>
  )
}
