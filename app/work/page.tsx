"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Play, X } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { FilterProvider } from "@/contexts/filter-context"
import { InquiryProvider, useInquiry } from "@/contexts/inquiry-context"

type VideoModalData = {
  youtubeId?: string
  vimeoId?: string
  vimeoHash?: string
  title: string
} | null

const featuredProject = {
  title: "MrBeast - $1 vs $1,000,000,000 Futuristic Tech!",
  client: "MrBeast",
  category: "Entertainment",
  year: "2024",
  description: "Breaking 100M+ views in just a few weeks is business as usual for MrBeast — but behind that scale is a serious level of precision. On this project, we handled full voice direction and recording, working closely to shape performance, pacing, and tone so it lands exactly as intended for a global audience. From guiding delivery to capturing clean, high-impact takes, every detail was dialled in to match the energy and clarity that this level of content demands. A small part of a massive production — but one that makes all the difference.",
  youtubeId: "pAnGwRiQ4-4",
  thumbnail: "/images/mrbeast-thumbnail.jpg",
  services: ["Voice Direction", "Recording"],
}

const caseStudies = [
  {
    title: "Tusker Light 'Unleash Your Light'",
    client: "Tusker Light",
    category: "Commercial",
    year: "2025",
    description: "Brand commercial celebrating the spirit of self-expression and authenticity.",
    youtubeId: "1pfmTvxS-fE",
    services: ["Voice Casting", "Recording"],
  },
  {
    title: "Steam Energy Drink",
    client: "Steam",
    category: "Commercial",
    year: "2025",
    description: "High-energy brand commercial capturing the bold spirit of Steam Energy Drink. Produced by Amp Films.",
    vimeoId: "1087927799",
    vimeoHash: "861ea2b7cc",
    thumbnail: "/images/steam-thumbnail.jpg",
    services: ["Voice Casting", "Recording"],
  },
  {
    title: "Absa Bank Campaign",
    client: "Absa Bank",
    category: "Commercial",
    year: "2024",
    description: "Brand commercial bringing the Absa story to life across East Africa.",
    youtubeId: "5OpWGiGD_tQ",
    services: ["Voice Casting", "Recording"],
  },
]

const stats = [
  { number: "500+", label: "Projects Delivered" },
  { number: "150+", label: "Brand Partners" },
  { number: "12", label: "Years Experience" },
  { number: "25+", label: "Languages" },
]

function WorkPageContent() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [videoModal, setVideoModal] = useState<VideoModalData>(null)
  const { openInquiry } = useInquiry()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background">
          <Header />
          
          {/* Hero Section */}
          <section className="pt-28 pb-12 lg:pt-36 lg:pb-16 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-4xl overflow-hidden">
                <p 
                  className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6 transition-all duration-700 ease-out ${
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  Our Work
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-6">
                  <span 
                    className={`block transition-all duration-700 ease-out delay-100 ${
                      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                  >
                    Our Work
                  </span>
                </h1>
                <p 
                  className={`text-lg text-muted-foreground max-w-2xl transition-all duration-700 ease-out delay-300 ${
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  From global brands to local storytelling, explore how we&apos;ve helped bring projects to life through the power of voice.
                </p>
              </div>
            </div>
          </section>

          {/* Featured Project with Video */}
          <section className="pb-16 lg:pb-24 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div 
                className={`transition-all duration-700 ease-out delay-500 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                  {/* Video Player */}
                  <div className="lg:col-span-3 lg:mt-8 relative aspect-video bg-card border border-border overflow-hidden group">
                    {!isVideoPlaying ? (
                      <>
                        <Image
                          src={featuredProject.thumbnail}
                          alt="Voice direction recording session for commercial"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="font-serif text-xl lg:text-2xl mb-1">{featuredProject.title}</p>
                          <p className="text-xs text-white/70">{featuredProject.client} / {featuredProject.category}</p>
                        </div>
                        <button 
                          onClick={() => setIsVideoPlaying(true)}
                          className="absolute inset-0 flex items-center justify-center group"
                        >
                          <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white">
                            <Play className="w-6 h-6 ml-1 text-white transition-colors group-hover:text-black" />
                          </div>
                        </button>
                      </>
                    ) : (
                      <iframe
                        src={`https://www.youtube.com/embed/${featuredProject.youtubeId}?autoplay=1&rel=0`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>

                  {/* Featured Project Info */}
                  <div className="lg:col-span-2">
                    <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                      Featured Project
                    </p>
                    <h3 className="font-serif text-2xl lg:text-3xl mb-4">
                      {featuredProject.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {featuredProject.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {featuredProject.services.map((service) => (
                        <span 
                          key={service}
                          className="text-xs tracking-[0.1em] uppercase border border-border px-4 py-2"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="py-12 lg:py-16 px-6 lg:px-12 border-t border-b border-border bg-card">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="font-serif text-4xl lg:text-5xl mb-2">{stat.number}</p>
                    <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Case Studies Grid */}
          <section className="py-16 lg:py-24 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="mb-16">
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                  Case Studies
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl">
                  Voiceover Projects for Global Brands
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {caseStudies.map((study, index) => (
                  <div 
                    key={index} 
                    className={`group ${study.youtubeId || study.vimeoId ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                      if (study.youtubeId || study.vimeoId) {
                        setVideoModal({
                          youtubeId: study.youtubeId,
                          vimeoId: study.vimeoId,
                          vimeoHash: study.vimeoHash,
                          title: study.title
                        })
                      }
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-[4/3] bg-card border border-border mb-6 overflow-hidden relative">
                      {study.youtubeId ? (
                        <Image
                          src={`https://img.youtube.com/vi/${study.youtubeId}/maxresdefault.jpg`}
                          alt={study.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : study.thumbnail ? (
                        <Image
                          src={study.thumbnail}
                          alt={study.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-foreground/5 flex items-center justify-center">
                          <span className="font-serif text-lg text-muted-foreground">{study.client}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                      {/* Play button overlay for videos */}
                      {(study.youtubeId || study.vimeoId) && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-14 h-14 rounded-full bg-foreground/90 flex items-center justify-center">
                            <Play className="w-5 h-5 ml-0.5 text-background" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground">{study.category}</span>
                        <span className="text-muted-foreground/30">|</span>
                        <span className="text-xs text-muted-foreground">{study.year}</span>
                      </div>
                      <h3 className="font-serif text-xl mb-2 group-hover:underline underline-offset-4">
                        {study.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {study.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {study.services.slice(0, 2).map((service) => (
                          <span 
                            key={service}
                            className="text-[10px] tracking-[0.1em] uppercase border border-border px-3 py-1"
                          >
                            {service}
                          </span>
                        ))}
                        {study.services.length > 2 && (
                          <span className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground px-2 py-1">
                            +{study.services.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 lg:py-20 px-6 lg:px-12 bg-foreground text-background">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div>
                  <h2 className="font-serif text-3xl lg:text-4xl mb-4">
                    Let&apos;s create something together.
                  </h2>
                  <p className="text-background/60 max-w-md">
                    Tell us about your project and we&apos;ll find the perfect voice.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={openInquiry}
                    className="text-xs tracking-[0.2em] uppercase border border-background px-8 py-4 hover:bg-background hover:text-foreground transition-all duration-300 text-center"
                  >
                    Start a Project
                  </button>
                  <a 
                    href="/roster"
                    className="text-xs tracking-[0.2em] uppercase bg-background text-foreground px-8 py-4 hover:bg-background/90 transition-all duration-300 text-center"
                  >
                    Explore Roster
                  </a>
                </div>
              </div>
            </div>
          </section>

          <Footer />
          
          {/* Video Modal Lightbox */}
          {videoModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-foreground/90 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setVideoModal(null)}
              />
              
              {/* Modal Content */}
              <div className="relative w-full max-w-5xl mx-4 animate-in zoom-in-95 fade-in duration-300">
                {/* Close Button */}
                <button 
                  onClick={() => setVideoModal(null)}
                  className="absolute -top-12 right-0 text-background/70 hover:text-background transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
                
                {/* Video Player */}
                <div className="relative aspect-video bg-black">
                  {videoModal.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoModal.youtubeId}?autoplay=1&rel=0`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : videoModal.vimeoId ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${videoModal.vimeoId}?h=${videoModal.vimeoHash || ''}&autoplay=1&title=0&byline=0&portrait=0`}
                      className="absolute inset-0 w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : null}
                </div>
                
                {/* Title */}
                <p className="text-center text-background/70 mt-4 text-sm tracking-[0.1em] uppercase">
                  {videoModal.title}
                </p>
              </div>
            </div>
          )}
        </main>
  )
}

export default function WorkPage() {
  return (
    <FavoritesProvider>
      <InquiryProvider>
        <FilterProvider>
          <WorkPageContent />
        </FilterProvider>
      </InquiryProvider>
    </FavoritesProvider>
  )
}
