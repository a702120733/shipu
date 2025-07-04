"use client"

import { motion } from "framer-motion"

interface GlobalScrollIndicatorProps {
  show?: boolean
  className?: string
}

export default function GlobalScrollIndicator({ show = true, className = "" }: GlobalScrollIndicatorProps) {
  if (!show) return null

  return (
    <motion.div
      className={`absolute bottom-12 sm:bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 text-center z-[110] pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="cursor-pointer"
      >
        <img
          src="/images/scroll-new.png"
          alt="Scroll to continue"
          className="w-16 h-20 mx-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
        />
      </motion.div>
    </motion.div>
  )
}
