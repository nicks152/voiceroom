"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface InquiryContextType {
  isOpen: boolean
  openInquiry: () => void
  closeInquiry: () => void
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined)

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openInquiry = () => setIsOpen(true)
  const closeInquiry = () => setIsOpen(false)

  return (
    <InquiryContext.Provider value={{ isOpen, openInquiry, closeInquiry }}>
      {children}
    </InquiryContext.Provider>
  )
}

export function useInquiry() {
  const context = useContext(InquiryContext)
  if (context === undefined) {
    throw new Error("useInquiry must be used within an InquiryProvider")
  }
  return context
}
