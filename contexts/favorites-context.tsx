"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface FavoritesContextType {
  favorites: string[]
  toggleFavorite: (name: string) => void
  addFavorite: (name: string) => void
  isFavorite: (name: string) => boolean
  count: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (name: string) => {
    setFavorites((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    )
  }

  const addFavorite = (name: string) => {
    setFavorites((prev) =>
      prev.includes(name) ? prev : [...prev, name]
    )
  }

  const isFavorite = (name: string) => favorites.includes(name)

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, addFavorite, isFavorite, count: favorites.length }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
