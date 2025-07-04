"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import CustomCursor from "./custom-cursor"
import GridContainer from "./grid-container"
import PlanetaryMenu from "./planetary-menu"

interface NavbarProps {
  showLogo?: boolean
  onMenuToggle?: (isOpen: boolean) => void
}

export default function Navbar({ showLogo = false, onMenuToggle }: NavbarProps) {
  // 添加一个引用来存储窗口尺寸
  const windowSize = useRef({ width: 0, height: 0 })

  // 在客户端初始化窗口尺寸
  useEffect(() => {
    if (typeof window !== "undefined") {
      windowSize.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    }
  }, [])

  const [scrolled, setScrolled] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  // 处理logo悬停效果
  const handleLogoMouseEnter = () => {
    setIsHovering(true)
  }

  const handleLogoMouseLeave = () => {
    setIsHovering(false)
  }

  const toggleMenu = () => {
    const newMenuState = !menuOpen
    setMenuOpen(newMenuState)

    // 通知父组件菜单状态变化
    if (onMenuToggle) {
      onMenuToggle(newMenuState)
    }
  }

  // 添加一个新函数来处理菜单链接点击
  const handleMenuLinkClick = () => {
    // 关闭菜单
    setMenuOpen(false)
    if (onMenuToggle) {
      onMenuToggle(false)
    }
  }

  // 防止菜单打开时页面滚动
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  // 菜单链接 - 移除About选项
  const menuLinks = [
    { href: "/", label: "Home" },
    { href: "/join-us", label: "Career" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      {/* 自定义光标，传递菜单状态 */}
      <CustomCursor menuOpen={menuOpen} />

      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GridContainer>
          <div className="w-full flex items-center justify-between px-12 py-6">
            {/* Logo区域 - 根据设计稿显示 */}
            <div>
              <Link href="/" className="flex items-center">
                {showLogo && (
                  <div
                    className="flex items-center cursor-pointer transition-all duration-300"
                    onMouseEnter={handleLogoMouseEnter}
                    onMouseLeave={handleLogoMouseLeave}
                  >
                    {/* 新的PNG Logo */}
                    <img src="/images/new-logo.png" alt="FFT Logo" className="h-8 w-auto" />
                  </div>
                )}
                {/* 为了保持布局一致，即使不显示logo也保留空间 */}
                {!showLogo && <div className="h-10 w-[120px]"></div>}
              </Link>
            </div>

            {/* 导航菜单 - 根据设计稿样式 */}
            <div className="hidden md:flex items-center space-x-12">
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[16px] font-medium transition-colors duration-300 ${
                    pathname === link.href ? "text-[#3C4043]" : "text-gray-400 hover:text-[#3C4043]"
                  }`}
                  style={{
                    fontFamily: "var(--font-poppins), sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {link.label.toUpperCase()}
                </Link>
              ))}
            </div>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button
                className="w-10 h-10 flex flex-col justify-center items-center relative z-50"
                onClick={toggleMenu}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                <motion.span
                  className={`w-8 h-0.5 ${menuOpen ? "bg-[#3C4043]" : "bg-[#3C4043]"} block`}
                  initial={false}
                  animate={menuOpen ? { rotate: 45, y: 2 } : { rotate: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className={`w-8 h-0.5 ${menuOpen ? "bg-[#3C4043]" : "bg-[#3C4043]"} block`}
                  initial={false}
                  animate={menuOpen ? { rotate: -45, y: 1 } : { rotate: 0, y: 4 }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            </div>
          </div>
        </GridContainer>
      </motion.header>

      {/* 全屏菜单面板 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-40 flex flex-col overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* 行星导航系统 */}
            <PlanetaryMenu pathname={pathname} menuLinks={menuLinks} onLinkClick={handleMenuLinkClick} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
