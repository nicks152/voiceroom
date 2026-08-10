"use client"

import { useState, useEffect, useMemo } from "react"
import { VoiceCard } from "./voice-card"
import { useFilter } from "@/contexts/filter-context"
import { useFavorites } from "@/contexts/favorites-context"

interface Sample {
  id: string
  title: string
  file_url: string
  duration_sec: number | null
}

interface Talent {
  id: string
  name: string
  pseudonym: string | null
  description: string | null
  gender: "MALE" | "FEMALE"
  age_band: string
  languages: string[]
  tags: string[]
  samples: Sample[]
}

export function TalentGrid() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { 
    searchQuery, 
    showFavoritesOnly,
    selectedVoices,
    selectedAges,
    selectedLanguages,
    activeStyles,
  } = useFilter()
  const { isFavorite } = useFavorites()

  useEffect(() => {
    async function fetchTalents() {
      try {
        const res = await fetch("/api/talent")
        const data = await res.json()
        if (data.talent) {
          // Sort alphabetically by name
          const sorted = data.talent.sort((a: Talent, b: Talent) => 
            (a.name || "").localeCompare(b.name || "")
          )
          setTalents(sorted)
        }
      } catch (error) {
        console.error("Failed to fetch talent:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTalents()
  }, [])

  const filteredTalents = useMemo(() => {
    return talents.filter((talent) => {
      const displayName = talent.pseudonym || talent.name
      const displayTitle = talent.description || ""
      
      // Search filter
      const matchesSearch = searchQuery === "" || 
        displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        displayTitle.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Favorites filter
      const matchesFavorites = !showFavoritesOnly || isFavorite(displayName)
      
      // Voice/Gender filter
      const matchesVoice = selectedVoices.length === 0 || 
        selectedVoices.some(v => {
          if (v === "Male") return talent.gender === "MALE"
          if (v === "Female") return talent.gender === "FEMALE"
          return false
        })
      
      // Age filter
      const matchesAge = selectedAges.length === 0 || 
        selectedAges.some(age => talent.age_band === age)
      
      // Language filter
      const matchesLanguage = selectedLanguages.length === 0 || 
        selectedLanguages.some(lang => 
          (talent.languages || []).some(tLang => 
            tLang.toLowerCase().includes(lang.toLowerCase())
          )
        )
      
      // Style/Tags filter
      const matchesStyle = activeStyles.length === 0 || 
        activeStyles.some(style => 
          (talent.tags || []).some(tag => 
            tag.toLowerCase().includes(style.toLowerCase())
          )
        )
      
      return matchesSearch && matchesFavorites && matchesVoice && matchesAge && matchesLanguage && matchesStyle
    })
  }, [talents, searchQuery, showFavoritesOnly, isFavorite, selectedVoices, selectedAges, selectedLanguages, activeStyles])

  if (isLoading) {
    return (
      <section className="py-12 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="py-16 text-center text-muted-foreground">
            <p className="text-sm">Loading artists...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Artist List */}
        <div>
          {filteredTalents.length > 0 ? (
            filteredTalents.map((talent) => (
              <VoiceCard 
                key={talent.id} 
                id={talent.id}
                name={talent.pseudonym || talent.name} 
                title={talent.description || "Featured Voice Artist"}
                audioUrl={talent.samples?.[0]?.file_url}
                duration={talent.samples?.[0]?.duration_sec || 0}
              />
            ))
          ) : (
            <div className="py-16 text-center text-muted-foreground">
              <p className="text-sm">No artists found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
