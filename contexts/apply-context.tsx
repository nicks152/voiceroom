"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface ApplyContextType {
  isOpen: boolean
  openApply: () => void
  closeApply: () => void
}

const ApplyContext = createContext<ApplyContextType | undefined>(undefined)

export function ApplyProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openApply = () => setIsOpen(true)
  const closeApply = () => setIsOpen(false)

  return (
    <ApplyContext.Provider value={{ isOpen, openApply, closeApply }}>
      {children}
    </ApplyContext.Provider>
  )
}

export function useApply() {
  const context = useContext(ApplyContext)
  if (context === undefined) {
    throw new Error("useApply must be used within an ApplyProvider")
  }
  return context
}
