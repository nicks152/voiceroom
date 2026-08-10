"use client"

import Image from "next/image"
import { useEffect, useState, useRef } from "react"

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showText, setShowText] = useState(false)
  const [transitionComplete, setTransitionComplete] = useState(false)
  const [logosLoaded, setLogosLoaded] = useState(0)
  const [showLogos, setShowLogos] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const totalLogos = 7

  useEffect(() => {
    // Trigger animation after loading screen finishes (2400ms + small buffer)
    const timer = setTimeout(() => setIsLoaded(true), 2600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Show logos together once all are loaded
    if (logosLoaded === totalLogos) {
      setShowLogos(true)
    }
  }, [logosLoaded])

  useEffect(() => {
    if (transitionComplete) return

    const handleWheel = (e: WheelEvent) => {
      // Block all scrolling until transition is complete
      if (window.scrollY === 0 && !transitionComplete) {
        e.preventDefault()
        
        // Start the transition if not already started
        if (!showText) {
          setShowText(true)
          // Allow normal scrolling after full transition completes
          setTimeout(() => setTransitionComplete(true), 2500)
        }
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [showText, transitionComplete])

  return (
    <section ref={sectionRef} className="relative pt-32 pb-6 lg:pt-40 lg:pb-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Column - Main Headline */}
          <div className="space-y-8 overflow-hidden">
            <p 
              className={`text-xs tracking-[0.3em] uppercase text-muted-foreground transition-all duration-700 ease-out ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              East Africa's voiceover roster
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tight">
              <span 
                className={`inline-block transition-all duration-700 ease-out delay-150 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              >
                Where brands
              </span>
              <br />
              <span 
                className={`inline-block transition-all duration-700 ease-out delay-300 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              >
                find their voice
              </span>
              <br />
              <em 
                className={`font-serif inline-block transition-all duration-700 ease-out delay-500 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              >
                — and own it.
              </em>
            </h1>
          </div>

          {/* Right Column - Image / Description */}
          <div className="relative lg:pb-4 h-[350px] lg:h-[450px]">
            {/* Hero Image - shows first */}
            <div 
              className={`absolute inset-0 flex items-center justify-start transition-all duration-1000 ease-in-out ${
                isLoaded && !showText ? "opacity-100 scale-100" : showText ? "opacity-0 scale-95" : "opacity-0 scale-105"
              }`}
            >
              <Image
                src="/images/hero-woman-mic.png"
                alt="African voice actor recording commercial in Nairobi studio"
                width={960}
                height={696}
                className="w-[120%] max-w-none h-auto object-contain -ml-16 lg:-ml-24"
                priority
              />
            </div>

            {/* Text Content - fades in after scroll */}
            <div 
              className={`absolute inset-0 flex flex-col justify-center space-y-8 transition-all duration-1200 ease-in-out delay-700 ${
                showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
              }`}
            >
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-md">
                A hand-picked roster of Africa focused voice artists, carefully selected for the world&apos;s most discerning productions.
              </p>
              <h2 className="sr-only">Voice Casting, Recording & Direction — Nairobi to the World</h2>
              <div className="flex items-center gap-8">
                <a 
                  href="/roster"
                  className="text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:opacity-60 transition-opacity"
                >
                  Explore Roster
                </a>
                <a 
                  href="#about"
                  className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  Our Approach
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Client Logos */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className={`text-xs tracking-[0.15em] uppercase text-muted-foreground mb-6 transition-opacity duration-700 ${showLogos ? "opacity-100" : "opacity-0"}`}>
            Trusted by brands, agencies, and production teams.
          </p>
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:flex lg:items-center lg:justify-between gap-6 lg:gap-10 transition-opacity duration-700 ${showLogos ? "opacity-100" : "opacity-0"}`}>
            <div className="flex items-center justify-center grayscale opacity-60 hover:opacity-100 transition-opacity">
              <Image
                src="/logos/safaricom.png"
                alt="Safaricom"
                width={160}
                height={48}
                className="h-6 lg:h-8 w-auto object-contain"
                onLoad={() => setLogosLoaded(prev => prev + 1)}
              />
            </div>
            <div className="flex items-center justify-center grayscale opacity-60 hover:opacity-100 transition-opacity">
              <Image
                src="/logos/ncba.png"
                alt="NCBA"
                width={312}
                height={72}
                className="h-12 lg:h-[72px] w-auto object-contain"
                onLoad={() => setLogosLoaded(prev => prev + 1)}
              />
            </div>
            <div className="flex items-center justify-center grayscale opacity-60 hover:opacity-100 transition-opacity">
              <Image
                src="/logos/mastercard.png"
                alt="Mastercard"
                width={80}
                height={56}
                className="h-10 lg:h-14 w-auto object-contain"
                onLoad={() => setLogosLoaded(prev => prev + 1)}
              />
            </div>
            <div className="flex items-center justify-center grayscale opacity-60 hover:opacity-100 transition-opacity">
              <Image
                src="/logos/google.png"
                alt="Google"
                width={218}
                height={74}
                className="h-12 lg:h-[67px] w-auto object-contain"
                onLoad={() => setLogosLoaded(prev => prev + 1)}
              />
            </div>
            <div className="flex items-center justify-center grayscale opacity-60 hover:opacity-100 transition-opacity">
              <Image
                src="/logos/bolt.png"
                alt="Bolt"
                width={90}
                height={36}
                className="h-6 lg:h-8 w-auto object-contain"
                onLoad={() => setLogosLoaded(prev => prev + 1)}
              />
            </div>
            <div className="flex items-center justify-center grayscale opacity-60 hover:opacity-100 transition-opacity">
              <Image
                src="/logos/vice.png"
                alt="Vice"
                width={130}
                height={40}
                className="h-7 lg:h-9 w-auto object-contain"
                onLoad={() => setLogosLoaded(prev => prev + 1)}
              />
            </div>
            <div className="hidden md:flex items-center justify-center grayscale opacity-60 hover:opacity-100 transition-opacity">
              <Image
                src="/logos/mrbeast.png"
                alt="Mr Beast"
                width={110}
                height={64}
                className="h-10 lg:h-14 w-auto object-contain"
                onLoad={() => setLogosLoaded(prev => prev + 1)}
              />
            </div>
          </div>
        </div>

        
      </div>
    </section>
  )
}
