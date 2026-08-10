"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Start exit animation after content loads
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
    }, 1800)

    // Remove loader completely
    const removeTimer = setTimeout(() => {
      setIsLoading(false)
    }, 2400)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-foreground flex items-center justify-center transition-all duration-600 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <div
          className={`transition-all duration-700 ${
            isExiting ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          <Image
            src="/images/logo-dark.png"
            alt="The Voice Room by AMP Studios"
            width={320}
            height={80}
            className="h-20 w-auto"
            priority
          />
        </div>

        {/* Minimal line animation */}
        <div className="relative w-64 h-px bg-background/20 overflow-hidden mx-auto">
          <div 
            className={`absolute inset-y-0 left-0 bg-background transition-all ease-out ${
              isExiting ? "w-full duration-300" : "w-0 duration-[1600ms]"
            }`}
            style={{ 
              animation: isExiting ? "none" : "loadingLine 1.6s ease-out forwards" 
            }}
          />
        </div>
      </div>
    </div>
  )
}
