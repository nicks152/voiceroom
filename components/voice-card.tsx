"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, ArrowUpRight, Star } from "lucide-react"
import { useFavorites } from "@/contexts/favorites-context"
import { useInquiry } from "@/contexts/inquiry-context"

interface VoiceCardProps {
  id?: string
  name: string
  title: string
  imageUrl?: string
  audioUrl?: string
  duration?: number
}

// Seeded random number generator for consistent values
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateWaveform(count: number, seed: string) {
  // Create a numeric seed from the string
  let numericSeed = 0
  for (let i = 0; i < seed.length; i++) {
    numericSeed += seed.charCodeAt(i) * (i + 1)
  }
  
  return Array.from({ length: count }, (_, i) => 
    seededRandom(numericSeed + i) * 0.7 + 0.3
  )
}

export function VoiceCard({
  id,
  name,
  title,
  audioUrl,
  duration = 45,
}: VoiceCardProps) {
  const { toggleFavorite, addFavorite, isFavorite } = useFavorites()
  const { openInquiry } = useInquiry()
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentSeconds, setCurrentSeconds] = useState(0)
  const [waveform] = useState(() => generateWaveform(40, name))
  const [isHovered, setIsHovered] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlay = () => {
    if (!audioUrl) {
      return
    }
    
    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl)
        audioRef.current.addEventListener("timeupdate", () => {
          if (audioRef.current) {
            const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100
            setProgress(pct)
            setCurrentSeconds(Math.floor(audioRef.current.currentTime))
          }
        })
        audioRef.current.addEventListener("ended", () => {
          setIsPlaying(false)
          setProgress(0)
          setCurrentSeconds(0)
        })
        audioRef.current.addEventListener("error", () => {
          console.log("[v0] Audio error - could not load:", audioUrl)
          setIsPlaying(false)
        })
      }
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch((err) => {
        console.log("[v0] Audio play failed:", err)
        setIsPlaying(false)
      })
    }
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioUrl) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    
    // Initialize audio if needed
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl)
      audioRef.current.addEventListener("timeupdate", () => {
        if (audioRef.current) {
          const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100
          setProgress(pct)
          setCurrentSeconds(Math.floor(audioRef.current.currentTime))
        }
      })
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false)
        setProgress(0)
        setCurrentSeconds(0)
      })
    }
    
    // Seek to position
    const seekTime = percentage * audioRef.current.duration
    if (isFinite(seekTime)) {
      audioRef.current.currentTime = seekTime
      setProgress(percentage * 100)
      setCurrentSeconds(Math.floor(seekTime))
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, "0")}`
  }

  const currentTime = formatTime(currentSeconds)
  const totalTime = formatTime(duration)

  return (
    <article 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div className="border-b border-border py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Play Button + Info */}
          <div className="flex items-center gap-6 lg:w-[280px] lg:flex-shrink-0">
            {/* Play Button */}
            <button
              onClick={togglePlay}
              className={`w-14 h-14 flex-shrink-0 flex items-center justify-center border transition-all duration-300 ${
                isPlaying 
                  ? "bg-foreground text-background border-foreground" 
                  : "border-border hover:border-foreground"
              }`}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            {/* Name & Title */}
            <div className="min-w-0">
              <h3 className="font-serif text-2xl lg:text-3xl mb-1 group-hover:opacity-60 transition-opacity">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{title}</p>
            </div>
          </div>

          {/* Center: Waveform (desktop) */}
          <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md">
            <div 
              className="flex-1 h-10 flex items-center gap-[2px] cursor-pointer"
              onClick={handleWaveformClick}
            >
              {waveform.map((height, i) => {
                const isActive = (i / waveform.length) * 100 <= progress
                return (
                  <div
                    key={i}
                    className={`flex-1 transition-all duration-150 ${
                      isActive ? "bg-foreground" : "bg-border"
                    }`}
                    style={{ height: `${height * 100}%` }}
                  />
                )
              })}
            </div>
            <span className="text-xs text-muted-foreground font-mono w-10">{isPlaying ? currentTime : totalTime}</span>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(name)}
              className={`w-10 h-10 flex items-center justify-center border transition-all duration-300 ${
                isFavorite(name) 
                  ? "bg-foreground text-background border-foreground" 
                  : "border-border hover:border-foreground"
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite(name) ? "fill-current" : ""}`} />
            </button>
            
            {/* Inquiry Arrow */}
            <button 
              onClick={() => {
                addFavorite(name)
                openInquiry()
              }}
              className={`w-10 h-10 flex items-center justify-center border border-border transition-all duration-300 ${
                isHovered ? "bg-foreground text-background border-foreground" : ""
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Waveform */}
        <div className="lg:hidden mt-6">
          <div className="flex items-center gap-4">
            <div 
              className="flex-1 h-8 flex items-center gap-[2px] cursor-pointer"
              onClick={handleWaveformClick}
            >
              {waveform.map((height, i) => {
                const isActive = (i / waveform.length) * 100 <= progress
                return (
                  <div
                    key={i}
                    className={`flex-1 transition-all duration-150 ${
                      isActive ? "bg-foreground" : "bg-border"
                    }`}
                    style={{ height: `${height * 100}%` }}
                  />
                )
              })}
            </div>
            <span className="text-xs text-muted-foreground font-mono">{isPlaying ? currentTime : totalTime}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
