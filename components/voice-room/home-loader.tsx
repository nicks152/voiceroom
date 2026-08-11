"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { easeLuxury } from "./motion"

type Phase = "boot" | "hold" | "exit" | "done"

const Y = "#e8ff00"
const C = "#0047ff"
const W = "#fafaf8"
const B = "#0a0a0a"

/** Ndebele / Kuba-inspired mosaic cells (row, col, color index) */
function buildMosaic(cols: number, rows: number) {
  const palette = [Y, C, W, B, Y, C]
  const cells: { id: string; x: number; y: number; color: string; delay: number }[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const color = palette[(r * 3 + c * 2 + (r % 2)) % palette.length]
      // Skip some black cells so the field breathes
      if (color === B && (r + c) % 5 === 0) continue
      cells.push({
        id: `${r}-${c}`,
        x: c,
        y: r,
        color,
        delay: (r + c) * 0.018 + (r % 2) * 0.02,
      })
    }
  }
  return cells
}

/**
 * Homepage intro — African mosaic field (textile / Ndebele geometry)
 * then Voice Room wordmark. No ambiguous center icon.
 */
export function HomeLoader() {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>("boot")
  const cells = useMemo(() => buildMosaic(14, 10), [])

  useEffect(() => {
    if (reduce) {
      setPhase("done")
      return
    }
    try {
      if (sessionStorage.getItem("vr-home-intro-v2") === "1") {
        setPhase("done")
        return
      }
    } catch {
      /* ignore */
    }

    document.documentElement.classList.add("vr-loading")

    const tHold = window.setTimeout(() => setPhase("hold"), 500)
    const tExit = window.setTimeout(() => setPhase("exit"), 2400)
    const tDone = window.setTimeout(() => {
      setPhase("done")
      document.documentElement.classList.remove("vr-loading")
      try {
        sessionStorage.setItem("vr-home-intro-v2", "1")
        sessionStorage.setItem("vr-intro", "1")
      } catch {
        /* ignore */
      }
    }, 3200)

    return () => {
      window.clearTimeout(tHold)
      window.clearTimeout(tExit)
      window.clearTimeout(tDone)
      document.documentElement.classList.remove("vr-loading")
    }
  }, [reduce])

  return (
    <AnimatePresence>
      {phase !== "done" && !reduce ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[var(--c4-black)]"
          initial={{ y: 0 }}
          animate={phase === "exit" ? { y: "-105%" } : { y: 0 }}
          exit={{ y: "-105%" }}
          transition={{ duration: 0.8, ease: easeLuxury }}
          aria-hidden
        >
          {/* Mosaic backdrop */}
          <div className="absolute inset-0 flex items-center justify-center opacity-90">
            <svg
              viewBox="0 0 140 100"
              className="h-[120%] w-[120%] max-w-none"
              preserveAspectRatio="xMidYMid slice"
            >
              {cells.map((cell) => {
                const size = 10
                const x = cell.x * size
                const y = cell.y * size
                // Alternating triangle pairs → mosaic / kuba rhythm
                const flip = (cell.x + cell.y) % 2 === 0
                const d = flip
                  ? `M${x} ${y} L${x + size} ${y} L${x} ${y + size} Z`
                  : `M${x + size} ${y} L${x + size} ${y + size} L${x} ${y + size} Z`
                const d2 = flip
                  ? `M${x + size} ${y} L${x + size} ${y + size} L${x} ${y + size} Z`
                  : `M${x} ${y} L${x + size} ${y} L${x} ${y + size} Z`
                const pairColor =
                  cell.color === Y ? C : cell.color === C ? Y : cell.color === W ? C : Y

                return (
                  <g key={cell.id}>
                    <motion.path
                      d={d}
                      fill={cell.color}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.08 + cell.delay,
                        ease: "easeOut",
                      }}
                    />
                    <motion.path
                      d={d2}
                      fill={pairColor}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: cell.color === B ? 0.35 : 0.92 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.12 + cell.delay,
                        ease: "easeOut",
                      }}
                    />
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Soft vignette so type stays readable */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.15)_0%,rgba(10,10,10,0.72)_55%,rgba(10,10,10,0.92)_100%)]" />

          {/* Center plate — thick border frame, mosaic badge (clear triangles, not a dish) */}
          <div className="relative z-10 flex flex-col items-center px-8">
            <motion.div
              className="border-2 border-[var(--c4-yellow)] bg-[var(--c4-black)] p-3 md:p-4"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.55, ease: easeLuxury }}
            >
              <svg viewBox="0 0 96 56" className="h-14 w-24 md:h-16 md:w-28">
                {/* Row of diamond mosaic — textile clear, readable */}
                <polygon points="16,28 28,8 40,28 28,48" fill={Y} />
                <polygon points="28,8 40,28 28,28" fill={C} />
                <polygon points="40,28 52,8 64,28 52,48" fill={C} />
                <polygon points="52,8 64,28 52,28" fill={W} />
                <polygon points="64,28 76,8 88,28 76,48" fill={Y} />
                <polygon points="76,8 88,28 76,28" fill={C} />
                {/* Inner accent diamonds */}
                <polygon points="28,28 34,18 40,28 34,38" fill={B} />
                <polygon points="52,28 58,18 64,28 58,38" fill={Y} />
                <polygon points="76,28 82,18 88,28 82,38" fill={B} />
              </svg>
            </motion.div>

            <motion.p
              className="display mt-8 text-center text-3xl font-extrabold uppercase tracking-tight text-white md:text-5xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.75, ease: easeLuxury }}
            >
              Voice Room
            </motion.p>

            <motion.p
              className="mt-3 text-[10px] tracking-[0.28em] uppercase text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 1, ease: easeLuxury }}
            >
              East Africa · Nairobi
            </motion.p>

            <motion.div
              className="mt-8 h-[3px] w-20 origin-center bg-[var(--c4-yellow)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 1.1, ease: easeLuxury }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
