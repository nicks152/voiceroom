"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  src: string
  label?: string
  durationSec?: number
  variant?: "light" | "dark" | "accent" | "minimal"
  className?: string
}

function format(t: number) {
  if (!Number.isFinite(t) || t < 0) return "0:00"
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function ConceptAudioPlayer({
  src,
  label,
  durationSec = 0,
  variant = "light",
  className = "",
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(durationSec)

  useEffect(() => {
    const audio = new Audio(src)
    audioRef.current = audio
    const onTime = () => {
      setCurrent(audio.currentTime)
      if (audio.duration) {
        setDuration(audio.duration)
        setProgress(audio.currentTime / audio.duration)
      }
    }
    const onEnd = () => {
      setPlaying(false)
      setProgress(0)
      setCurrent(0)
    }
    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("ended", onEnd)
    return () => {
      audio.pause()
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("ended", onEnd)
      audioRef.current = null
    }
  }, [src])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * audio.duration
    setProgress(ratio)
  }

  const bars = Array.from({ length: 32 }, (_, i) => {
    const wave = Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.2))
    const h = 20 + wave * 70
    const active = progress > i / 32
    return { h, active }
  })

  const tones = {
    light: {
      btn: "border-black/80 text-black hover:bg-black hover:text-white",
      bar: "bg-black/15",
      barActive: "bg-black",
      meta: "text-black/55",
    },
    dark: {
      btn: "border-white/70 text-white hover:bg-white hover:text-black",
      bar: "bg-white/20",
      barActive: "bg-white",
      meta: "text-white/50",
    },
    accent: {
      btn: "border-current text-current hover:bg-current hover:text-white",
      bar: "bg-current/20",
      barActive: "bg-current",
      meta: "text-current/60",
    },
    minimal: {
      btn: "border-current/40 text-current hover:border-current",
      bar: "bg-current/15",
      barActive: "bg-current",
      meta: "text-current/50",
    },
  }[variant]

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[10px] tracking-[0.18em] uppercase transition-colors ${tones.btn}`}
      >
        {playing ? "II" : "▶"}
      </button>
      <div className="min-w-0 flex-1">
        {label ? (
          <div className={`mb-1 text-[10px] tracking-[0.2em] uppercase ${tones.meta}`}>
            {label}
          </div>
        ) : null}
        <div
          role="slider"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onClick={seek}
          className="flex h-8 cursor-pointer items-end gap-[2px]"
        >
          {bars.map((b, i) => (
            <span
              key={i}
              className={`w-full rounded-[1px] transition-colors ${b.active ? tones.barActive : tones.bar}`}
              style={{ height: `${b.h}%` }}
            />
          ))}
        </div>
        <div className={`mt-1 flex justify-between font-mono text-[10px] ${tones.meta}`}>
          <span>{format(current)}</span>
          <span>{format(duration)}</span>
        </div>
      </div>
    </div>
  )
}
