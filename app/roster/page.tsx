"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FilterBar } from "@/components/filter-bar"
import { TalentGrid } from "@/components/talent-grid"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { FilterProvider } from "@/contexts/filter-context"
import { InquiryProvider } from "@/contexts/inquiry-context"

export default function RosterPage() {
  return (
    <FavoritesProvider>
      <InquiryProvider>
        <FilterProvider>
        <main className="min-h-screen bg-background text-foreground">
          <Header />
          
          {/* Hero Section */}
          <section className="pt-32 pb-8 lg:pt-40 lg:pb-12 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Our Talent</p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-4">
                Voice Roster
              </h1>
              <h2 className="sr-only">Professional African Voice Actors</h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                A hand-picked roster of exceptional East African voice artists, curated for productions that demand authenticity, nuance, and world-class quality.
              </p>
            </div>
          </section>

          {/* Filter and Talent Grid */}
          <section className="px-6 lg:px-12 pb-24">
            <div className="max-w-7xl mx-auto">
              <FilterBar hideHeader />
              <TalentGrid />
            </div>
          </section>

          <Footer />
        </main>
      </FilterProvider>
      </InquiryProvider>
    </FavoritesProvider>
  )
}
