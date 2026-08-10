"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { InquiryModal } from "./inquiry-modal"

const processSteps = [
  {
    number: "01",
    title: "Casting",
    description: "We shortlist voices based on your script, tone, and audience.",
  },
  {
    number: "02",
    title: "Direction",
    description: "We shape the performance to match your project.",
  },
  {
    number: "03",
    title: "Recording",
    description: "In-studio at AMP Studios or remotely, fully engineered.",
  },
  {
    number: "04",
    title: "Editing & Delivery",
    description: "Clean, polished, ready-to-use audio.",
  },
]

const services = [
  "Voice Casting",
  "Voice Direction",
  "Voice Recording",
  "ADR (Film Dialogue)",
  "Editing & Mixing",
  "Dubbing & Localisation",
]

const whyReasons = [
  "Curated roster of professional voice talent",
  "Built inside a working production studio",
  "Fast turnaround for production timelines",
  "One point of contact from casting to delivery",
]

export function HomepageSections() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)

  return (
    <>
      {/* Our Process Section */}
      <section className="border-t border-border bg-card py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Our Process</p>
            <h2 className="font-serif text-3xl lg:text-4xl">
              A seamless process from brief to delivery
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div key={step.number} className="group">
                <span className="text-4xl lg:text-5xl font-serif text-muted-foreground/30 block mb-4">
                  {step.number}
                </span>
                <h3 className="font-serif text-xl mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Credibility Section */}
      <section className="border-t border-border bg-foreground text-background pt-20 lg:pt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-background/60 mb-4">AMP Studios</p>
              <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl mb-6">
                Recorded at AMP Studios
              </h2>
              <p className="text-lg text-background/70 leading-relaxed mb-8">
                Professional voice recording, built for production.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://www.ampafrica.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase border border-background px-8 py-4 hover:bg-background hover:text-foreground transition-all duration-300"
                >
                  Explore Studio
                </a>
                <a 
                  href="https://www.ampafrica.com/book"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase border border-background bg-background text-foreground px-8 py-4 hover:bg-background/90 transition-all duration-300"
                >
                  Book Studio
                </a>
              </div>
            </div>
            <div>
              <ul className="space-y-4">
                {[
                  "Dedicated recording environment",
                  "Experienced engineers",
                  "In-studio and remote sessions",
                  "Broadcast-quality output",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-background/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-background/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="relative aspect-video bg-background/10 overflow-hidden">
            <Image
              src="/images/amp-studio.jpg"
              alt="AMP Studios control room"
              fill
              sizes="33vw"
              quality={75}
              className="object-cover"
            />
          </div>
          <div className="relative aspect-video bg-background/10 overflow-hidden">
            <Image
              src="/images/amp-studio-2.jpg"
              alt="AMP Studios mixing console"
              fill
              sizes="33vw"
              quality={75}
              className="object-cover"
            />
          </div>
          <div className="relative aspect-video bg-background/10 overflow-hidden">
            <Image
              src="/images/amp-studio-3.jpg"
              alt="AMP Studios recording session"
              fill
              sizes="33vw"
              quality={75}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="border-t border-border bg-background py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Services</p>
              <h2 className="font-serif text-3xl lg:text-4xl mb-6">
                End-to-end voice production
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Built for production teams who need reliable, high-quality voice work.
              </p>
              <Link 
                href="/services"
                className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase border border-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-300"
              >
                View All Services
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {services.map((service) => (
                <div 
                  key={service}
                  className="border border-border p-6 hover:border-foreground transition-colors duration-300"
                >
                  <span className="text-sm">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why The Voice Room Section */}
      <section className="border-t border-border bg-card py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Why Us</p>
            <h2 className="font-serif text-3xl lg:text-4xl mb-12">
              Why The Voice Room
            </h2>
            <div className="space-y-6">
              {whyReasons.map((reason, index) => (
                <div 
                  key={reason}
                  className="flex items-start gap-6 pb-6 border-b border-border last:border-0"
                >
                  <span className="text-xs tracking-[0.2em] text-muted-foreground mt-1">
                    0{index + 1}
                  </span>
                  <p className="text-lg">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="border-t border-border bg-foreground text-background py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl mb-6">
            Need a voice for your next project?
          </h2>
          <p className="text-lg text-background/70 mb-10 max-w-xl mx-auto">
            Tell us what you're looking for — we'll handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsInquiryOpen(true)}
              className="text-xs tracking-[0.2em] uppercase border border-background px-8 py-4 hover:bg-background hover:text-foreground transition-all duration-300"
            >
              Request Talent
            </button>
            <a 
              href="https://www.ampafrica.com/book"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.2em] uppercase bg-background text-foreground px-8 py-4 hover:bg-background/90 transition-all duration-300"
            >
              Book a Session
            </a>
          </div>
        </div>
      </section>

      <InquiryModal isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} />
    </>
  )
}
