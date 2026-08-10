"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { VoiceCard } from "./voice-card"

interface Sample {
  id: string
  title: string
  file_url: string
  duration_sec: number | null
}

interface FeaturedTalent {
  id: string
  name: string
  pseudonym: string | null
  description: string | null
  photo_url: string | null
  samples: Sample[]
}

export function FeaturedArtists() {
  const [featuredTalents, setFeaturedTalents] = useState<FeaturedTalent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/talent/featured")
        const data = await res.json()
        if (data.talent) {
          setFeaturedTalents(data.talent)
        }
      } catch (error) {
        console.error("Failed to fetch featured talent:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <section className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="py-12 border-b border-border">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Our Roster</p>
          <h2 className="font-serif text-3xl lg:text-4xl mb-4">Featured Artists</h2>
          <p className="text-sm text-muted-foreground">
            Each voice in our collection has been personally selected for their exceptional craft and distinctive character.
          </p>
        </div>

        {/* Artist List */}
        <div className="py-12 lg:py-16">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading featured artists...</div>
          ) : featuredTalents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No featured artists yet.</div>
          ) : (
            featuredTalents.map((talent) => (
              <VoiceCard 
                key={talent.id} 
                id={talent.id}
                name={talent.pseudonym || talent.name} 
                title={talent.description || "Featured Voice Artist"}
                audioUrl={talent.samples?.[0]?.file_url}
                duration={talent.samples?.[0]?.duration_sec || 0}
              />
            ))
          )}
        </div>

        {/* View Full Roster */}
        <div className="pb-16 text-center">
          <Link 
            href="/roster"
            className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase border border-foreground px-10 py-4 hover:bg-foreground hover:text-background transition-all duration-300"
          >
            View Full Roster
          </Link>
        </div>
      </div>
    </section>
  )
}
