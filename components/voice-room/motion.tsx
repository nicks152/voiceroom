"use client"

import {
  type ReactNode,
  useEffect,
  useState,
  Children,
  isValidElement,
} from "react"
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"

/** Decelerating ease — soft landings, expensive feel */
export const easeLuxury: [number, number, number, number] = [0.16, 1, 0.3, 1]

const viewport = { once: true, amount: 0.18, margin: "0px 0px -8% 0px" }

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** up = rise in, fade = opacity only, left/right = lateral, scale = soft zoom */
  variant?: "up" | "fade" | "left" | "right" | "scale"
  as?: "div" | "section" | "header" | "article" | "li" | "span"
}

const variants = {
  up: { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  left: { hidden: { opacity: 0, x: -28 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 28 }, show: { opacity: 1, x: 0 } },
  scale: {
    hidden: { opacity: 0, scale: 0.96, y: 18 },
    show: { opacity: 1, scale: 1, y: 0 },
  },
}

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]
  const v = variants[variant]

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={v}
      transition={{ duration: 0.85, delay, ease: easeLuxury }}
    >
      {children}
    </MotionTag>
  )
}

type StaggerProps = {
  children: ReactNode
  className?: string
  stagger?: number
  delayChildren?: number
  variant?: RevealProps["variant"]
}

export function Stagger({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0.05,
  variant = "up",
}: StaggerProps) {
  const reduce = useReducedMotion()
  const v = variants[variant]

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child
        return (
          <motion.div
            variants={v}
            transition={{ duration: 0.8, ease: easeLuxury }}
            className="h-full"
          >
            {child}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

/** Thin yellow scroll progress along the top edge */
export function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  })

  if (reduce) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 right-0 left-0 z-[60] h-[2px] origin-left bg-[var(--c4-yellow)]"
      style={{ scaleX }}
    />
  )
}

/** One-time session intro — black wipe with yellow accent */
export function PageLoader() {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<"boot" | "exit" | "done">("boot")

  useEffect(() => {
    if (reduce) {
      setPhase("done")
      return
    }
    try {
      if (sessionStorage.getItem("vr-intro") === "1") {
        setPhase("done")
        return
      }
    } catch {
      /* ignore */
    }

    const t1 = window.setTimeout(() => setPhase("exit"), 720)
    const t2 = window.setTimeout(() => {
      setPhase("done")
      try {
        sessionStorage.setItem("vr-intro", "1")
      } catch {
        /* ignore */
      }
    }, 1280)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [reduce])

  if (phase === "done" || reduce) return null

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center bg-[var(--c4-black)]"
      initial={{ y: 0 }}
      animate={phase === "exit" ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.7, ease: easeLuxury }}
      aria-hidden
    >
      <div className="flex flex-col items-center gap-5">
        <motion.p
          className="display text-2xl font-extrabold uppercase tracking-tight text-white md:text-3xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeLuxury }}
        >
          Voice Room
        </motion.p>
        <motion.div
          className="h-[2px] origin-left bg-[var(--c4-yellow)]"
          initial={{ scaleX: 0, width: 72 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.55, delay: 0.12, ease: easeLuxury }}
        />
      </div>
    </motion.div>
  )
}

/** Soft page content entrance after loader / on mount */
export function PageEnter({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.05, ease: easeLuxury }}
    >
      {children}
    </motion.div>
  )
}

export function HeroLine({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) {
    return <span className={`block min-w-0 max-w-full ${className || ""}`}>{children}</span>
  }

  return (
    <motion.span
      className={`block min-w-0 max-w-full ${className || ""}`}
      initial={{ opacity: 0, y: "0.55em" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: easeLuxury }}
    >
      {children}
    </motion.span>
  )
}
