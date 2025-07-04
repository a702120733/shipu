import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import CustomCursor from "@/components/custom-cursor"
import PageTransition from "@/components/page-transition"

// 配置Poppins字体
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Investment Consulting Services",
  description: "Premier investment consulting firm dedicated to helping clients achieve their financial goals",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-white font-poppins">
        <CustomCursor />
        <PageTransition />
        {children}
      </body>
    </html>
  )
}
