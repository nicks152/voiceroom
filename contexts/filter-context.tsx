"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface FilterContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  showFavoritesOnly: boolean
  setShowFavoritesOnly: (show: boolean) => void
  selectedVoices: string[]
  setSelectedVoices: (voices: string[]) => void
  selectedAges: string[]
  setSelectedAges: (ages: string[]) => void
  selectedLanguages: string[]
  setSelectedLanguages: (languages: string[]) => void
  activeStyles: string[]
  setActiveStyles: (styles: string[]) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [selectedVoices, setSelectedVoices] = useState<string[]>([])
  const [selectedAges, setSelectedAges] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [activeStyles, setActiveStyles] = useState<string[]>([])

  return (
    <FilterContext.Provider value={{ 
      searchQuery, 
      setSearchQuery, 
      showFavoritesOnly, 
      setShowFavoritesOnly,
      selectedVoices,
      setSelectedVoices,
      selectedAges,
      setSelectedAges,
      selectedLanguages,
      setSelectedLanguages,
      activeStyles,
      setActiveStyles,
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider")
  }
  return context
}
