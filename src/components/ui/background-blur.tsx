"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface BackgroundBlurProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function BackgroundBlur({
  children,
  className,
  ...props
}: BackgroundBlurProps) {
  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0, 0, 0, 0) 1px, rgba(var(--background)) 1px)",
          backgroundSize: "4px 4px",
        }}
      />
      <div className="absolute -z-10 top-0 left-0 right-0 bottom-0 h-full w-full overflow-hidden">
        <div
          className="pointer-events-none absolute -top-40 -left-[10%] z-0 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[100px] animate-blob"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-40 -right-[10%] z-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[100px] animate-blob animation-delay-2000"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-40 left-[30%] z-0 h-[500px] w-[500px] rounded-full bg-pink-500/20 blur-[100px] animate-blob animation-delay-4000"
          aria-hidden="true"
        />
      </div>
      {children}
    </div>
  )
} 