"use client"

import { useEffect } from "react"

/** Enables the CSS outline arrow cursor on fine-pointer devices. */
export function CustomCursor() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches
    if (!finePointer) return

    document.documentElement.classList.add("vr-cursor-on")
    return () => {
      document.documentElement.classList.remove("vr-cursor-on")
    }
  }, [])

  return null
}
