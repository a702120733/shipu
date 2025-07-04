"use client"

import React from "react"

import { type ReactNode, useRef } from "react"
import { motion, useInView } from "framer-motion"

interface ScrollAnimationWrapperProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  className?: string
  duration?: number
  once?: boolean
  margin?: string
  staggerChildren?: boolean
  staggerDelay?: number
}

export default function ScrollAnimationWrapper({
  children,
  delay = 0.2,
  direction = "up",
  className = "",
  duration = 0.8,
  once = true,
  margin = "-100px 0px -100px 0px",
  staggerChildren = false,
  staggerDelay = 0.1,
}: ScrollAnimationWrapperProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin })

  // Define animation variants based on direction
  const getVariants = () => {
    const distance = 50 // pixels to move during animation

    const variants = {
      hidden: {
        opacity: 0,
        y: direction === "up" ? distance : direction === "down" ? -distance : 0,
        x: direction === "left" ? distance : direction === "right" ? -distance : 0,
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1], // Custom ease curve for smooth animation
          staggerChildren: staggerChildren ? staggerDelay : 0,
        },
      },
    }

    return variants
  }

  // For staggered children animations
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={getVariants()}
    >
      {staggerChildren
        ? // If staggering children, wrap each child in a motion.div
          React.Children.map(children, (child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : // Otherwise, just render the children directly
          children}
    </motion.div>
  )
}
