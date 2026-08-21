"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { SiteShell } from "@/components/voice-room/site-shell"
import { VoiceRoomCard } from "@/components/voice-room/voice-card"
import { InquiryModal } from "@/components/inquiry-modal"
import { HeroLine, Reveal, Stagger, easeLuxury } from "@/components/voice-room/motion"
import type { Talent } from "@/lib/talent-types"

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

const logos = [
  { src: "/logos/safaricom.png", alt: "Safaricom", className: "h-6 md:h-8" },
  { src: "/logos/ncba.png", alt: "NCBA", className: "h-10 md:h-14" },
  { src: "/logos/mastercard.png", alt: "Mastercard", className: "h-9 md:h-12" },
  { src: "/logos/google.png", alt: "Google", className: "h-10 md:h-12" },
  { src: "/logos/bolt.png", alt: "Bolt", className: "h-6 md:h-8" },
  { src: "/logos/vice.png", alt: "Vice", className: "h-7 md:h-9" },
  { src: "/logos/mrbeast.png", alt: "Mr Beast", className: "h-9 md:h-12" },
  { src: "/logos/eabl.png", alt: "EABL", className: "h-7 md:h-9" },
]

export function HomePage() {
  const [featured, setFeatured] = useState<Talent[]>([])
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/talent/featured")
        const data = await res.json()
        if (data.talent) setFeatured(data.talent.slice(0, 4))
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  return (
    <SiteShell>
      <main>
        <section className="relative overflow-hidden border-b-2 border-[var(--c4-black)] bg-[var(--c4-yellow)]">
          <motion.div
            initial={{ opacity: 0, x: 48, scale: 1.04 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.15, delay: 0.15, ease: easeLuxury }}
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-[-8%] z-0 hidden w-[58%] md:block lg:right-[-2%] lg:w-[52%] xl:w-[48%]"
          >
            <Image
              src="/images/hero-woman-mic.png"
              alt=""
              fill
              className="object-contain object-[right_center]"
              priority
              sizes="55vw"
            />
          </motion.div>

          <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16 lg:py-20">
            <div className="min-w-0 max-w-xl lg:max-w-[34rem] xl:max-w-[38rem]">
              <motion.p
                className="c4-label text-[var(--c4-black)]/55"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: easeLuxury }}
              >
                East Africa&apos;s voiceover roster
              </motion.p>
              <h1 className="display mt-5 min-w-0 text-[clamp(1.7rem,8.4vw,4.75rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.03em]">
                <HeroLine delay={0.28}>East Africa</HeroLine>
                <HeroLine delay={0.36}>sounds</HeroLine>
                <HeroLine delay={0.44} className="relative z-20 text-[var(--c4-cobalt)]">
                  different.
                </HeroLine>
              </h1>
              <div className="mt-8">
                <p className="display text-xl font-bold uppercase leading-snug md:text-2xl">
                  <HeroLine delay={0.55}>We help the world hear it.</HeroLine>
                </p>
                <motion.p
                  className="mt-5 max-w-md text-base leading-relaxed text-[var(--c4-black)]/70"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.65, ease: easeLuxury }}
                >
                  A hand-picked roster of Africa focused voice artists, carefully selected
                  for the world&apos;s most discerning productions.
                </motion.p>
                <motion.div
                  className="mt-8 flex flex-wrap items-center gap-4"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.75, ease: easeLuxury }}
                >
                  <Link
                    href="/roster"
                    className="c4-block-black px-6 py-3.5 text-[11px] tracking-[0.2em] uppercase transition-transform hover:-translate-y-0.5"
                  >
                    Explore Roster
                  </Link>
                  <a
                    href="#about"
                    className="border-2 border-[var(--c4-black)] bg-transparent px-6 py-3.5 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-[var(--c4-black)] hover:text-[var(--c4-yellow)]"
                  >
                    Our Approach
                  </a>
                </motion.div>
              </div>
            </div>

            <motion.div
              className="relative mt-10 h-[320px] w-full md:hidden"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: easeLuxury }}
            >
              <Image
                src="/images/hero-woman-mic.png"
                alt="Voice artist with microphone"
                fill
                className="object-contain object-right"
                priority
                sizes="100vw"
              />
            </motion.div>
          </div>
        </section>

        <Reveal as="section" variant="fade" className="border-b-2 border-[var(--c4-black)] c4-block-black">
          <p className="c4-label border-b border-white/15 px-5 py-3 text-center text-white/45 md:px-10">
            Trusted by brands, agencies, and production teams.
          </p>
          <div className="overflow-hidden py-6 md:py-8">
            <div className="c4-marquee-track items-center gap-12 px-6 md:gap-16">
              {[...logos, ...logos].map((logo, i) => (
                <div key={`${logo.alt}-${i}`} className="flex shrink-0 items-center justify-center">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={180}
                    height={72}
                    className={`${logo.className} w-auto object-contain brightness-0 invert opacity-80`}
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <section className="border-b-2 border-[var(--c4-black)] px-5 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1440px]">
            <Reveal className="mb-10 flex flex-col gap-4 border-b-2 border-[var(--c4-black)] pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="c4-label text-[var(--c4-muted)]">Our Roster</p>
                <h2 className="display mt-2 text-[clamp(1.75rem,7vw,3rem)] font-extrabold uppercase md:text-5xl">
                  Featured Artists
                </h2>
              </div>
              <Link
                href="/roster"
                className="text-[11px] tracking-[0.18em] uppercase hover:text-[var(--c4-cobalt)]"
              >
                View full roster →
              </Link>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((t, i) => (
                <VoiceRoomCard key={t.id} talent={t} index={i} variant="grid" />
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="border-b-2 border-[var(--c4-black)] bg-[var(--c4-yellow)] px-5 py-16 md:px-10 md:py-24"
        >
          <div className="mx-auto max-w-[1440px]">
            <Reveal>
              <p className="c4-label mb-3">Our Process</p>
              <h2 className="display max-w-2xl text-[clamp(1.65rem,6.5vw,1.875rem)] font-extrabold uppercase md:text-5xl">
                A seamless process from brief to delivery
              </h2>
            </Reveal>
            <Stagger className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
              {processSteps.map((step) => (
                <div key={step.number} className="border-t-2 border-[var(--c4-black)] pt-5">
                  <span className="display text-4xl font-extrabold text-[var(--c4-black)]/25 md:text-5xl">
                    {step.number}
                  </span>
                  <h3 className="display mt-3 text-xl font-bold uppercase">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--c4-black)]/70">
                    {step.description}
                  </p>
                </div>
              ))}
            </Stagger>
          </div>
        </section>

        <section className="c4-block-black border-b-2 border-[var(--c4-black)] pt-16 md:pt-24">
          <div className="mx-auto mb-12 grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-2">
            <Reveal variant="left">
              <p className="c4-label text-white/50">AMP Studios</p>
              <h2 className="display mt-3 text-[clamp(1.65rem,6.5vw,1.875rem)] font-extrabold uppercase md:text-5xl">
                Recorded at AMP Studios
              </h2>
              <p className="mt-5 text-lg text-white/65">
                Professional voice recording, built for production.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://www.ampafrica.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white px-6 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-white hover:text-[var(--c4-black)]"
                >
                  Explore Studio
                </a>
                <a
                  href="https://www.ampafrica.com/book"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--c4-yellow)] px-6 py-3 text-[11px] tracking-[0.2em] uppercase text-[var(--c4-black)]"
                >
                  Book Studio
                </a>
              </div>
            </Reveal>
            <Reveal variant="right" delay={0.1}>
              <ul className="space-y-4 self-end">
                {[
                  "Dedicated recording environment",
                  "Experienced engineers",
                  "In-studio and remote sessions",
                  "Broadcast-quality output",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/80">
                    <span className="h-2 w-2 bg-[var(--c4-yellow)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Stagger className="grid grid-cols-3 border-t-2 border-white/20" stagger={0.12} variant="scale">
            {["/images/amp-studio.jpg", "/images/amp-studio-2.jpg", "/images/amp-studio-3.jpg"].map(
              (src, i) => (
                <div key={src} className="relative aspect-video overflow-hidden bg-white/10">
                  <Image
                    src={src}
                    alt={
                      [
                        "AMP Studios control room",
                        "AMP Studios mixing console",
                        "AMP Studios recording session",
                      ][i]
                    }
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                </div>
              ),
            )}
          </Stagger>
        </section>

        <section className="border-b-2 border-[var(--c4-black)] px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-2">
            <Reveal variant="left">
              <p className="c4-label text-[var(--c4-muted)]">Services</p>
              <h2 className="display mt-3 text-[clamp(1.65rem,6.5vw,1.875rem)] font-extrabold uppercase md:text-5xl">
                End-to-end voice production
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-[var(--c4-muted)]">
                Built for production teams who need reliable, high-quality voice work.
              </p>
              <Link
                href="/services"
                className="mt-8 inline-flex border-2 border-[var(--c4-black)] px-6 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-[var(--c4-black)] hover:text-white"
              >
                View All Services
              </Link>
            </Reveal>
            <Stagger className="grid grid-cols-2 gap-3" stagger={0.06} variant="scale">
              {services.map((service) => (
                <div
                  key={service}
                  className="border-2 border-[var(--c4-black)] p-5 text-sm transition-colors hover:bg-[var(--c4-yellow)]"
                >
                  {service}
                </div>
              ))}
            </Stagger>
          </div>
        </section>

        <section className="border-b-2 border-[var(--c4-black)] px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <div className="max-w-3xl">
              <Reveal>
                <p className="c4-label text-[var(--c4-muted)]">Why Us</p>
                <h2 className="display mt-3 text-[clamp(1.65rem,6.5vw,1.875rem)] font-extrabold uppercase md:text-5xl">
                  Why The Voice Room
                </h2>
              </Reveal>
              <Stagger className="mt-12 space-y-0" stagger={0.09}>
                {whyReasons.map((reason, index) => (
                  <div
                    key={reason}
                    className="flex items-start gap-6 border-b-2 border-[var(--c4-black)] py-6 last:border-0"
                  >
                    <span className="c4-label mt-1 text-[var(--c4-muted)]">0{index + 1}</span>
                    <p className="text-lg md:text-xl">{reason}</p>
                  </div>
                ))}
              </Stagger>
            </div>
          </div>
        </section>

        <Reveal as="section" variant="scale" className="c4-block-black px-5 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1440px] text-center">
            <h2 className="display text-[clamp(1.65rem,6.5vw,1.875rem)] font-extrabold uppercase md:text-5xl">
              Need a voice for your next project?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/65">
              Tell us what you&apos;re looking for — we&apos;ll handle the rest.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsInquiryOpen(true)}
                className="border-2 border-white px-8 py-4 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-white hover:text-[var(--c4-black)]"
              >
                Request Talent
              </button>
              <a
                href="https://www.ampafrica.com/book"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--c4-yellow)] px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-[var(--c4-black)]"
              >
                Book a Session
              </a>
            </div>
          </div>
        </Reveal>

        <InquiryModal isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} />
      </main>
    </SiteShell>
  )
}
