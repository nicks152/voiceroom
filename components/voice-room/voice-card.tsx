"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Star } from "lucide-react"
import { ConceptAudioPlayer } from "@/components/concepts/shared/audio-player"
import { easeLuxury } from "@/components/voice-room/motion"
import { useFavorites } from "@/contexts/favorites-context"
import { useInquiry } from "@/contexts/inquiry-context"
import { displayName, firstSample, type Talent } from "@/lib/talent-types"

type Props = {
  talent: Talent
  index?: number
  variant?: "grid" | "list"
}

export function VoiceRoomCard({ talent, index = 0, variant = "list" }: Props) {
  const sample = firstSample(talent)
  const name = displayName(talent)
  const languages = talent.languages || []
  const tags = talent.tags || []
  const isGrid = variant === "grid"
  const { toggleFavorite, addFavorite, isFavorite } = useFavorites()
  const { openInquiry } = useInquiry()
  const shortlisted = isFavorite(name)

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.75, delay: index * 0.06, ease: easeLuxury }}
      className={`group relative border-2 border-[var(--c4-black)] bg-[var(--c4-white)] transition-colors hover:bg-[var(--c4-yellow)] ${
        isGrid
          ? "flex flex-col p-5"
          : "grid gap-6 p-5 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-10 md:p-6"
      }`}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {talent.featured ? (
            <span className="c4-block-cobalt px-2 py-0.5 text-[9px] tracking-[0.14em] uppercase">
              Featured
            </span>
          ) : null}
          {talent.gender ? (
            <span className="c4-label text-[var(--c4-muted)]">{talent.gender}</span>
          ) : null}
          {talent.age_band ? (
            <>
              <span className="c4-label text-[var(--c4-muted)]">·</span>
              <span className="c4-label text-[var(--c4-muted)]">{talent.age_band}</span>
            </>
          ) : null}
        </div>

        <h3 className="display mt-3 text-2xl font-extrabold uppercase leading-none tracking-tight md:text-4xl">
          <Link href={`/roster/${talent.id}`} className="hover:text-[var(--c4-cobalt)]">
            {name}
          </Link>
        </h3>

        {languages.length > 0 ? (
          <p className="mt-3 text-sm text-[var(--c4-muted)]">{languages.join(" · ")}</p>
        ) : null}

        {tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 6).map((d) => (
              <span
                key={d}
                className="border border-[var(--c4-black)] bg-[var(--c4-white)] px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase"
              >
                {d}
              </span>
            ))}
          </div>
        ) : null}

        {talent.description ? (
          <p className="mt-3 line-clamp-2 text-sm text-[var(--c4-muted)]">{talent.description}</p>
        ) : null}
      </div>

      <div className={`flex flex-col justify-between ${isGrid ? "mt-6" : ""}`}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            {sample?.file_url ? (
              <ConceptAudioPlayer
                src={sample.file_url}
                durationSec={sample.duration_sec || 0}
                variant="minimal"
                className="text-[var(--c4-black)]"
              />
            ) : (
              <p className="c4-label text-[var(--c4-muted)]">No demo yet</p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
              aria-pressed={shortlisted}
              onClick={() => toggleFavorite(name)}
              className={`flex h-10 w-10 items-center justify-center border-2 border-[var(--c4-black)] transition-colors ${
                shortlisted
                  ? "bg-[var(--c4-black)] text-[var(--c4-white)]"
                  : "bg-[var(--c4-white)] text-[var(--c4-black)] hover:bg-[var(--c4-black)] hover:text-[var(--c4-white)]"
              }`}
            >
              <Star className={`h-4 w-4 ${shortlisted ? "fill-current" : ""}`} />
            </button>

            <button
              type="button"
              aria-label={`Inquire about ${name}`}
              onClick={() => {
                addFavorite(name)
                openInquiry()
              }}
              className="flex h-10 w-10 items-center justify-center border-2 border-[var(--c4-black)] bg-[var(--c4-white)] text-[var(--c4-black)] transition-colors hover:bg-[var(--c4-black)] hover:text-[var(--c4-white)]"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
