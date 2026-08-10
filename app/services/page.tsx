"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { FilterProvider } from "@/contexts/filter-context"
import { InquiryProvider, useInquiry } from "@/contexts/inquiry-context"

const processSteps = [
  {
    number: "01",
    title: "Casting",
    description: "We shortlist and match voices based on your script, tone, and audience.",
  },
  {
    number: "02",
    title: "Direction",
    description: "We guide performance to ensure the right tone, pacing, and delivery for your project.",
  },
  {
    number: "03",
    title: "Recording",
    description: "Sessions take place at AMP Studios or remotely, fully directed and engineered.",
  },
  {
    number: "04",
    title: "Editing & Delivery",
    description: "We compile, clean, and mix recordings, delivering ready-to-use audio.",
  },
]

const services = [
  {
    title: "Voiceover Recording",
    subtitle: "Professional in-studio recording at AMP Studios.",
    description: "High-quality recording sessions with experienced engineers, built for speed, clarity, and performance.",
  },
  {
    title: "Voice Casting",
    subtitle: "Curated voice casting tailored to your project.",
    description: "Access a curated roster of African voice talent across languages, tones, and styles.",
  },
  {
    title: "Voice Direction",
    subtitle: "Get the performance right.",
    description: "We guide talent to deliver the right tone, pacing, and emotion for your brand or story.",
  },
  {
    title: "ADR Recording",
    subtitle: "Dialogue recording for film and post-production.",
    description: "Precision dialogue replacement for film, television, and digital content.",
  },
  {
    title: "IVR Production",
    subtitle: "Voice and production for phone systems and automated experiences.",
    description: "Professional voice systems for brands, banks, and telecoms — clear, consistent, on-brand.",
  },
  {
    title: "Editing & Mixing",
    subtitle: "Polished, production-ready audio.",
    description: "We compile the best takes, clean, edit, and mix your recordings to final delivery standards.",
  },
  {
    title: "Remote Sessions",
    subtitle: "Record from anywhere, with full control.",
    description: "Join live sessions remotely and direct talent in real time.",
  },
  {
    title: "Dubbing & Localisation",
    subtitle: "Voiceover adaptation for different languages and markets.",
    description: "Reach new audiences with professionally adapted voice content.",
  },
  {
    title: "AI Voice Licensing",
    subtitle: "Secure, brand-safe voice solutions for scalable content.",
    description: "We license and manage voice talent for AI-generated and synthetic voice use, giving brands access to consistent, high-quality voice at scale — with full rights and approvals in place.",
  },
]

const whyUs = [
  "Curated roster of professional voice talent",
  "In-studio and remote recording capabilities",
  "Fast turnaround for production timelines",
  "End-to-end delivery, handled in one place",
]

function ServicesPageContent() {
  const [isLoaded, setIsLoaded] = useState(false)
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
                  Our Services
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-6">
                  <span 
                    className={`block transition-all duration-700 ease-out delay-100 ${
                      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                  >
                    Voiceover Services
                  </span>
                </h1>
                <p 
                  className={`text-lg text-muted-foreground max-w-2xl transition-all duration-700 ease-out delay-300 ${
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  From casting to final delivery, we handle every stage of the voice process.
                </p>
              </div>

              {/* CTA Buttons */}
              <div 
                className={`flex flex-col sm:flex-row gap-4 mt-10 transition-all duration-700 ease-out delay-500 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <button 
                  onClick={openInquiry}
                  className="text-xs tracking-[0.2em] uppercase border border-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-300 text-center"
                >
                  Request Talent
                </button>
                <a 
                  href="https://www.ampafrica.com/book"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs tracking-[0.2em] uppercase bg-foreground text-background px-8 py-4 hover:bg-foreground/90 transition-all duration-300 text-center"
                >
                  Book a Session
                </a>
              </div>
            </div>
          </section>

          {/* Our Process Section */}
          <section className="py-16 lg:py-24 px-6 lg:px-12 border-t border-border">
            <div className="max-w-7xl mx-auto">
              <div className="mb-16">
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                  Our Process
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl mb-4">
                  A streamlined workflow from brief to final delivery.
                </h2>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                {processSteps.map((step, index) => (
                  <div key={index} className="group">
                    <div className="border-t border-border pt-6">
                      <span className="text-xs text-muted-foreground mb-4 block font-mono">
                        {step.number}
                      </span>
                      <h3 className="font-serif text-xl mb-3">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="py-16 lg:py-24 px-6 lg:px-12 bg-card border-t border-border">
            <div className="max-w-7xl mx-auto">
              <div className="mb-16">
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                  Services
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl">
                  End-to-end voice production, built for production teams.
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                {services.map((service, index) => (
                  <div key={index} className="group border-t border-border pt-8">
                    <h3 className="font-serif text-xl mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm font-medium mb-3">
                      {service.subtitle}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why The Voice Room */}
          <section className="py-16 lg:py-24 px-6 lg:px-12 border-t border-border">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                    Why The Voice Room
                  </p>
                  <h2 className="font-serif text-3xl lg:text-4xl leading-tight">
                    Built inside AMP Studios, we combine casting, recording, and production under one roof.
                  </h2>
                </div>
                <div className="space-y-4">
                  {whyUs.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 py-4 border-b border-border">
                      <span className="text-xs text-muted-foreground font-mono">0{index + 1}</span>
                      <p className="text-lg">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 lg:py-20 px-6 lg:px-12 bg-foreground text-background">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div>
                  <h2 className="font-serif text-3xl lg:text-4xl mb-4">
                    Need a voice for your next project?
                  </h2>
                  <p className="text-background/60 max-w-md">
                    Tell us what you&apos;re looking for — we&apos;ll handle the rest.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={openInquiry}
                    className="text-xs tracking-[0.2em] uppercase border border-background px-8 py-4 hover:bg-background hover:text-foreground transition-all duration-300 text-center"
                  >
                    Request Talent
                  </button>
                  <a 
                    href="https://www.ampafrica.com/book"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs tracking-[0.2em] uppercase bg-background text-foreground px-8 py-4 hover:bg-background/90 transition-all duration-300 text-center"
                  >
                    Book a Session
                  </a>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </main>
  )
}

export default function ServicesPage() {
  return (
    <FavoritesProvider>
      <InquiryProvider>
        <FilterProvider>
          <ServicesPageContent />
        </FilterProvider>
      </InquiryProvider>
    </FavoritesProvider>
  )
}
