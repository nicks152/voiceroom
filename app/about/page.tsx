"use client"

import Image from "next/image"
import Link from "next/link"
import { SiteShell } from "@/components/voice-room/site-shell"
import { HeroLine, Reveal, Stagger, easeLuxury } from "@/components/voice-room/motion"
import { motion } from "framer-motion"

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

export default function Concept4AboutPage() {
  return (
    <SiteShell>
      <main>
        <section className="border-b-2 border-[var(--c4-black)] px-5 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1440px]">
            <h1 className="display min-w-0 text-[clamp(1.85rem,8vw,3rem)] font-extrabold uppercase leading-[1.05] md:text-6xl">
              <HeroLine>Find Your Voice</HeroLine>
            </h1>
            <motion.p
              className="mt-4 max-w-xl text-lg text-[var(--c4-muted)]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease: easeLuxury }}
            >
              East Africa&apos;s voiceover roster, built for global productions.
            </motion.p>
            <motion.div
              className="relative mt-10 aspect-[21/9] overflow-hidden border-2 border-[var(--c4-black)]"
              initial={{ opacity: 0, y: 28, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: easeLuxury }}
            >
              <Image
                src="/images/about-boardroom.png"
                alt="Voiceover recording session in Nairobi"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </section>

        <section className="border-b-2 border-[var(--c4-black)] px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[1440px] min-w-0 gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal variant="left">
              <p className="c4-label text-[var(--c4-muted)]">Our Story</p>
              <h2 className="display mt-4 text-[clamp(1.65rem,6.5vw,1.875rem)] font-extrabold uppercase leading-[1.05] md:text-4xl">
                Created by AMP Studios in Nairobi
              </h2>
            </Reveal>
            <Reveal variant="right" delay={0.08} className="space-y-6 text-base leading-relaxed text-[var(--c4-muted)] md:text-lg">
              <p>
                The Voice Room is a curated voiceover platform built to showcase the
                richness and diversity of talent across Kenya and the wider continent.
                From warm, relatable narration to bold, distinctive delivery, we represent
                a spectrum of African voices that resonate both locally and globally.
              </p>
              <p>
                For years, brands and agencies struggled to find authentic African voices
                that meet international production standards. The Voice Room was built to
                change that — bringing together a trusted roster of professional voice
                artists, all accessible at the click of a button.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-b-2 border-[var(--c4-black)] bg-[var(--c4-yellow)] px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <Reveal>
              <p className="c4-label">What We Offer</p>
              <h2 className="display mt-3 text-[clamp(1.65rem,6.5vw,1.875rem)] font-extrabold uppercase leading-[1.05] md:text-4xl">
                Excellence at every step
              </h2>
            </Reveal>
            <Stagger className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
              {offerings.map((offering, index) => (
                <div key={offering.title} className="border-t-2 border-[var(--c4-black)] pt-5">
                  <span className="c4-label">0{index + 1}</span>
                  <h3 className="display mt-3 text-xl font-bold uppercase">{offering.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--c4-black)]/70">
                    {offering.description}
                  </p>
                </div>
              ))}
            </Stagger>
          </div>
        </section>

        <Reveal as="section" variant="scale" className="border-b-2 border-[var(--c4-black)] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1440px]">
            <p className="mx-auto max-w-3xl text-center display text-[clamp(1.25rem,5.5vw,1.5rem)] font-bold uppercase leading-relaxed md:text-4xl">
              At The Voice Room, we don&apos;t just provide voiceovers — we create room for
              brands to find their voice, and <em className="normal-case">own it.</em>
            </p>
          </div>
        </Reveal>

        <Reveal as="section" className="c4-block-black px-5 py-16 md:px-10 md:py-20">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="display text-[clamp(1.65rem,6.5vw,1.875rem)] font-extrabold uppercase leading-[1.05] md:text-4xl">
                Ready to find your voice?
              </h2>
              <p className="mt-3 max-w-md text-white/60">
                Explore our roster of exceptional voice artists or get in touch to discuss
                your project.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/roster"
                className="border-2 border-white px-8 py-4 text-center text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-white hover:text-[var(--c4-black)]"
              >
                Explore Roster
              </Link>
              <a
                href="mailto:voices@ampafrica.com"
                className="bg-[var(--c4-yellow)] px-8 py-4 text-center text-[11px] tracking-[0.2em] uppercase text-[var(--c4-black)]"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </Reveal>
      </main>
    </SiteShell>
  )
}
