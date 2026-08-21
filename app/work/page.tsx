"use client"

import Image from "next/image"
import { useState } from "react"
import { SiteShell } from "@/components/voice-room/site-shell"
import { HeroLine, Reveal, Stagger } from "@/components/voice-room/motion"
import { useInquiry } from "@/contexts/inquiry-context"

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
  description:
    "Breaking 100M+ views in just a few weeks is business as usual for MrBeast — but behind that scale is a serious level of precision. On this project, we handled full voice direction and recording, working closely to shape performance, pacing, and tone so it lands exactly as intended for a global audience. From guiding delivery to capturing clean, high-impact takes, every detail was dialled in to match the energy and clarity that this level of content demands. A small part of a massive production — but one that makes all the difference.",
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
    thumbnail: "/images/tusker-thumbnail.jpg",
    services: ["Voice Casting", "Recording"],
  },
  {
    title: "Steam Energy Drink",
    client: "Steam",
    category: "Commercial",
    year: "2025",
    description:
      "High-energy brand commercial capturing the bold spirit of Steam Energy Drink. Produced by Amp Films.",
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
    thumbnail: "/images/absa-thumbnail.jpg",
    services: ["Voice Casting", "Recording"],
  },
  {
    title: "The Promised Land Season 2",
    client: "The Promised Land",
    category: "Entertainment",
    year: "2025",
    description:
      "ADR for Season 2 of the biblical comedy series — precision dialogue replacement to keep every joke and performance landing clean.",
    youtubeId: "MN54fod_YzQ",
    thumbnail: "/images/promised-land-thumbnail.jpg",
    services: ["ADR"],
  },
  {
    title: "NBA Playoffs 2026",
    client: "NBA",
    category: "Sports",
    year: "2026",
    description:
      "Casting and recording for NBA Playoffs coverage — high-energy delivery built for broadcast pace, crowd heat, and global audiences.",
    youtubeId: "G5e2wMocITg",
    thumbnail: "/images/nba-playoffs-thumbnail.jpg",
    services: ["Voice Casting", "Recording"],
  },
  {
    title: "Airtel Kenya - Si Ni Mi Nakushow",
    client: "Airtel",
    category: "Commercial",
    year: "2025",
    description:
      "New Airtel advert featuring Nyaminde — casting and recording a voice that carries the brand with clarity and warmth.",
    youtubeId: "y7AB2BJcdiU",
    thumbnail: "/images/airtel-nyminde-thumbnail.jpg",
    services: ["Voice Casting", "Recording"],
  },
]

const stats = [
  { value: "300+", label: "Projects Delivered" },
  { value: "100+", label: "Brand Partners" },
  { value: "12", label: "Years Experience" },
  { value: "10+", label: "Languages" },
]

export default function WorkPage() {
  return (
    <SiteShell>
      <WorkContent />
    </SiteShell>
  )
}

function WorkContent() {
  const [modal, setModal] = useState<VideoModalData>(null)
  const { openInquiry } = useInquiry()

  return (
    <main>
      <section className="border-b-2 border-[var(--c4-black)] px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="c4-label text-[var(--c4-muted)]">
            <HeroLine>Work</HeroLine>
          </p>
          <h1 className="display mt-3 min-w-0 text-[clamp(1.85rem,8.5vw,3rem)] font-extrabold uppercase leading-[1.05] md:text-6xl">
            <HeroLine delay={0.1}>Featured Work</HeroLine>
          </h1>
          <Reveal delay={0.18}>
            <p className="mt-5 max-w-xl text-lg text-[var(--c4-muted)]">
              From global brands to local storytelling, explore how we&apos;ve helped bring
              projects to life through the power of voice.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured project */}
      <section className="border-b-2 border-[var(--c4-black)] px-5 py-14 md:px-10">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal variant="left">
            <button
              type="button"
              onClick={() =>
                setModal({
                  youtubeId: featuredProject.youtubeId,
                  title: featuredProject.title,
                })
              }
              className="group relative aspect-video w-full overflow-hidden border-2 border-[var(--c4-black)] text-left"
            >
              <Image
                src={featuredProject.thumbnail}
                alt={featuredProject.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="border-2 border-white bg-[var(--c4-yellow)] px-4 py-2 text-[11px] tracking-[0.2em] uppercase text-[var(--c4-black)]">
                  Play
                </span>
              </span>
            </button>
          </Reveal>
          <Reveal variant="right" delay={0.08}>
            <p className="c4-label text-[var(--c4-muted)]">
              {featuredProject.year} · {featuredProject.category} · {featuredProject.client}
            </p>
            <h2 className="display mt-3 text-[clamp(1.5rem,6vw,1.875rem)] font-extrabold uppercase leading-[1.05] md:text-4xl">
              {featuredProject.title}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--c4-muted)] md:text-base">
              {featuredProject.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {featuredProject.services.map((s) => (
                <span
                  key={s}
                  className="border-2 border-[var(--c4-black)] px-2 py-1 text-[10px] tracking-[0.14em] uppercase"
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal as="section" className="border-b-2 border-[var(--c4-black)] bg-[var(--c4-yellow)] px-5 py-14 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06} variant="scale" className="text-center">
              <p className="display text-[clamp(1.75rem,8vw,2.25rem)] font-extrabold uppercase leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                {stat.value}
              </p>
              <p className="c4-label mt-3 text-[var(--c4-black)]/60">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <section className="border-b-2 border-[var(--c4-black)] px-5 py-14 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <h2 className="display text-[clamp(1.65rem,6.5vw,1.875rem)] font-extrabold uppercase leading-[1.05]">Case Studies</h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3" stagger={0.1} variant="scale">
            {caseStudies.map((study) => {
              const hasVideo = Boolean(study.youtubeId || study.vimeoId)
              const thumb =
                study.thumbnail ||
                (study.youtubeId
                  ? `https://img.youtube.com/vi/${study.youtubeId}/hqdefault.jpg`
                  : null)
              return (
                <article key={study.title} className="border-2 border-[var(--c4-black)]">
                  {hasVideo ? (
                    <button
                      type="button"
                      onClick={() =>
                        setModal({
                          youtubeId: study.youtubeId,
                          vimeoId: study.vimeoId,
                          vimeoHash: study.vimeoHash,
                          title: study.title,
                        })
                      }
                      className="group relative aspect-video w-full overflow-hidden border-b-2 border-[var(--c4-black)] bg-[var(--c4-yellow)]"
                    >
                      {thumb ? (
                        <Image
                          src={thumb}
                          alt={study.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center display text-lg font-bold uppercase">
                          {study.client}
                        </span>
                      )}
                      <span className="absolute bottom-3 right-3 c4-block-black px-2 py-1 text-[10px] tracking-[0.14em] uppercase">
                        Play
                      </span>
                    </button>
                  ) : (
                    <div className="relative aspect-video w-full overflow-hidden border-b-2 border-[var(--c4-black)] bg-[var(--c4-yellow)]">
                      {thumb ? (
                        <Image
                          src={thumb}
                          alt={study.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center display text-lg font-bold uppercase">
                          {study.client}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-5">
                    <p className="c4-label text-[var(--c4-muted)]">
                      {study.year} · {study.category}
                    </p>
                    <h3 className="display mt-2 text-[clamp(1.05rem,4.2vw,1.25rem)] font-bold uppercase leading-[1.05]">
                      {study.title}
                    </h3>
                    <p className="mt-3 text-sm text-[var(--c4-muted)]">{study.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {study.services.map((s) => (
                        <span
                          key={s}
                          className="border-2 border-[var(--c4-black)] px-2 py-1 text-[10px] tracking-[0.14em] uppercase"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </Stagger>
        </div>
      </section>

      <Reveal as="section" className="c4-block-black px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="display text-[clamp(1.65rem,6.5vw,1.875rem)] font-extrabold uppercase leading-[1.05]">
              Have a project in mind?
            </h2>
            <p className="mt-3 text-white/60">
              Request talent or book a session at AMP Studios.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={openInquiry}
              className="border-2 border-white px-8 py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-white hover:text-[var(--c4-black)]"
            >
              Request Talent
            </button>
            <a
              href="https://www.ampafrica.com/book"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--c4-yellow)] px-8 py-4 text-center text-[11px] tracking-[0.2em] uppercase text-[var(--c4-black)]"
            >
              Book a Session
            </a>
          </div>
        </div>
      </Reveal>

      {modal ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="relative w-full max-w-4xl border-2 border-white bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModal(null)}
              className="absolute -top-10 right-0 text-[11px] tracking-[0.2em] uppercase text-white"
            >
              Close
            </button>
            <div className="aspect-video w-full">
              {modal.youtubeId ? (
                <iframe
                  title={modal.title}
                  src={`https://www.youtube.com/embed/${modal.youtubeId}?autoplay=1`}
                  className="h-full w-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : modal.vimeoId ? (
                <iframe
                  title={modal.title}
                  src={`https://player.vimeo.com/video/${modal.vimeoId}${modal.vimeoHash ? `?h=${modal.vimeoHash}&` : "?"}autoplay=1`}
                  className="h-full w-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
