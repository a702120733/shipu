"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import LoadingAnimation from "./loading-animation"

export default function PageTransition() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // 处理路由开始变化
    const handleRouteChangeStart = (url: string) => {
      // 只有当URL与当前路径不同时才显示加载动画
      if (url !== pathname) {
        setIsLoading(true)
      }
    }

    // 处理路由变化完成
    const handleRouteChangeComplete = () => {
      setIsLoading(false)
    }

    // 监听链接点击
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")

      if (
        link &&
        link.getAttribute("href") &&
        link.getAttribute("href")?.startsWith("/") &&
        link.getAttribute("href") !== pathname &&
        !link.getAttribute("href")?.startsWith("/#") &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        setIsLoading(true)
      }
    }

    // 添加事件监听器
    document.addEventListener("click", handleLinkClick)

    return () => {
      document.removeEventListener("click", handleLinkClick)
    }
  }, [pathname, router])

  return isLoading ? <LoadingAnimation isPageTransition={true} onComplete={() => setIsLoading(false)} /> : null
}
