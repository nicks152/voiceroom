"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { FilterProvider } from "@/contexts/filter-context"
import { InquiryProvider } from "@/contexts/inquiry-context"

const offerings = [
  {
    title: "Curated Talent",
    description: "Carefully selected voices, chosen for quality, range, and authenticity.",
  },
  {
    title: "Broadcast-Ready Audio",
    description: "Recorded to world-class standards at AMP Studios in Nairobi.",
  },
  {
    title: "Seamless Access",
    description: "Browse, listen, and book effortlessly.",
  },
  {
    title: "Global Reach",
    description: "African voices, ready for productions anywhere in the world.",
  },
]

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <FavoritesProvider>
      <InquiryProvider>
        <FilterProvider>
          <main className="min-h-screen bg-background">
          <Header />
          
          {/* Hero Section */}
          <section className="pt-20 pb-4 lg:pt-24 lg:pb-6 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="overflow-hidden">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-tight">
                  <span 
                    className={`block transition-all duration-700 ease-out ${
                      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                  >
                    Find Your Voice
                  </span>
                </h1>
                <p 
                  className={`text-lg sm:text-xl text-muted-foreground mt-4 max-w-xl transition-all duration-700 ease-out delay-200 ${
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                  }`}
                >
                  East Africa's voiceover roster, built for global productions.
                </p>
              </div>
              
              {/* Hero Image */}
              <div 
                className={`mt-8 sm:mt-4 lg:-mt-10 transition-all duration-700 ease-out delay-300 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Image
                  src="/images/about-boardroom.png"
                  alt="Voiceover recording session in Nairobi"
                  width={1200}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-16 lg:py-24 px-6 lg:px-12 border-t border-border">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
                    Our Story
                  </p>
                  <h2 className="font-serif text-3xl lg:text-4xl leading-tight">
                    Created by AMP Studios in Nairobi
                  </h2>
                </div>
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    The Voice Room is a curated voiceover platform built to showcase the richness and diversity of talent across Kenya and the wider continent. From warm, relatable narration to bold, distinctive delivery, we represent a spectrum of African voices that resonate both locally and globally.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    For years, brands and agencies struggled to find authentic African voices that meet international production standards. The Voice Room was built to change that — bringing together a trusted roster of professional voice artists, all accessible at the click of a button.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What We Offer */}
          <section className="py-16 lg:py-24 px-6 lg:px-12 bg-card border-t border-border">
            <div className="max-w-7xl mx-auto">
              <div className="mb-16">
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                  What We Offer
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl">
                  Excellence at every step
                </h2>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                {offerings.map((offering, index) => (
                  <div key={index} className="group">
                    <div className="border-t border-border pt-6">
                      <span className="text-xs text-muted-foreground mb-4 block">
                        0{index + 1}
                      </span>
                      <h3 className="font-serif text-xl mb-3">
                        {offering.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {offering.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Closing Statement */}
          <section className="py-20 lg:py-32 px-6 lg:px-12 border-t border-border">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-3xl mx-auto text-center">
                <p className="font-serif text-2xl lg:text-3xl xl:text-4xl leading-relaxed text-balance">
                  At The Voice Room, we don&apos;t just provide voiceovers — we create room for brands to find their voice, and <em>own it.</em>
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 lg:py-20 px-6 lg:px-12 bg-foreground text-background">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div>
                  <h2 className="font-serif text-3xl lg:text-4xl mb-4">
                    Ready to find your voice?
                  </h2>
                  <p className="text-background/60 max-w-md">
                    Explore our roster of exceptional voice artists or get in touch to discuss your project.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="/roster"
                    className="text-xs tracking-[0.2em] uppercase border border-background px-8 py-4 hover:bg-background hover:text-foreground transition-all duration-300 text-center"
                  >
                    Explore Roster
                  </a>
                  <a 
                    href="mailto:voices@ampafrica.com"
                    className="text-xs tracking-[0.2em] uppercase bg-background text-foreground px-8 py-4 hover:bg-background/90 transition-all duration-300 text-center"
                  >
                    Get in Touch
                  </a>
                </div>
              </div>
            </div>
          </section>

          <Footer />
          </main>
        </FilterProvider>
      </InquiryProvider>
    </FavoritesProvider>
  )
}
