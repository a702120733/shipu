import type { ReactNode } from "react"

interface GridContainerProps {
  children: ReactNode
  className?: string
}

export default function GridContainer({ children, className = "" }: GridContainerProps) {
  return <div className={`relative w-full max-w-[1440px] mx-auto ${className}`}>{children}</div>
}
