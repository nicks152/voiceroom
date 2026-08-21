"use client"

import Link from "next/link"
import { use, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { SiteShell } from "@/components/voice-room/site-shell"
import { VoiceRoomCard } from "@/components/voice-room/voice-card"
import { ArrowUpRight, Star } from "lucide-react"
import { ConceptAudioPlayer } from "@/components/concepts/shared/audio-player"
import { useFavorites } from "@/contexts/favorites-context"
import { useInquiry } from "@/contexts/inquiry-context"
import { displayName, publishedSamples, type Talent } from "@/lib/talent-types"

export default function RosterProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return (
    <SiteShell>
      <ProfileContent id={id} />
    </SiteShell>
  )
}

function ProfileContent({ id }: { id: string }) {
  const [talent, setTalent] = useState<Talent | null>(null)
  const [similar, setSimilar] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const { openInquiry } = useInquiry()
  const { toggleFavorite, addFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/talent")
        const data = await res.json()
        const all: Talent[] = data.talent || []
        const found = all.find((t) => t.id === id) || null
        setTalent(found)
        if (found) {
          const tags = new Set(found.tags || [])
          const langs = new Set(found.languages || [])
          setSimilar(
            all
              .filter((t) => t.id !== found.id)
              .filter(
                (t) =>
                  (t.tags || []).some((x) => tags.has(x)) ||
                  (t.languages || []).some((x) => langs.has(x)),
              )
              .slice(0, 3),
          )
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <main className="px-5 py-20 md:px-10">
        <p className="c4-label">Loading…</p>
      </main>
    )
  }

  if (!talent) {
    return (
      <main className="px-5 py-20 md:px-10">
        <p className="display text-2xl font-bold uppercase">Voice not found</p>
        <Link href="/roster" className="mt-4 inline-block text-[11px] tracking-[0.18em] uppercase">
          ← Back to roster
        </Link>
      </main>
    )
  }

  const samples = publishedSamples(talent)
  const name = displayName(talent)
  const shortlisted = isFavorite(name)

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
      <Link href="/roster" className="c4-label hover:text-[var(--c4-cobalt)]">
        ← Roster
      </Link>

      <div className="mt-8 grid min-w-0 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            {talent.featured ? (
              <span className="c4-block-cobalt px-2 py-0.5 text-[9px] tracking-[0.14em] uppercase">
                Featured
              </span>
            ) : null}
            <span className="c4-label text-[var(--c4-muted)]">
              {talent.gender} · {talent.age_band}
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="display mt-5 min-w-0 text-[clamp(1.75rem,8vw,3rem)] font-extrabold uppercase leading-[1.05] md:text-7xl"
          >
            {name}
          </motion.h1>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--c4-muted)] md:text-base">
            {talent.bio || talent.description || "Available for casting and directed sessions."}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {(talent.tags || []).map((c) => (
              <span
                key={c}
                className="border-2 border-[var(--c4-black)] px-3 py-1 text-[10px] tracking-[0.14em] uppercase"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="mt-12 space-y-6 border-t-2 border-[var(--c4-black)] pt-8">
            <div className="flex items-center justify-between gap-4">
              <p className="c4-label">Samples</p>
              <div className="flex items-center gap-2">
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
            {samples.length > 0 ? (
              samples.map((s) => (
                <ConceptAudioPlayer
                  key={s.id}
                  src={s.file_url}
                  durationSec={s.duration_sec || 0}
                  variant="minimal"
                />
              ))
            ) : (
              <p className="text-sm text-[var(--c4-muted)]">No demos uploaded yet.</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              addFavorite(name)
              openInquiry()
            }}
            className="mt-10 inline-flex c4-block-black px-6 py-3.5 text-[11px] tracking-[0.2em] uppercase"
          >
            Request this voice
          </button>
        </div>

          <aside className="h-fit min-w-0 border-2 border-[var(--c4-black)] bg-[var(--c4-yellow)] p-6 md:p-8">
            <p className="c4-label">Details</p>
            <dl className="mt-6 space-y-5 text-sm">
              <div className="min-w-0">
                <dt className="c4-label text-[var(--c4-black)]/50">Languages</dt>
                <dd className="display mt-1 text-lg font-bold uppercase break-words">
                  {(talent.languages || []).join(", ") || "—"}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="c4-label text-[var(--c4-black)]/50">Voice tags</dt>
                <dd className="mt-1 break-words">{(talent.tags || []).join(" · ") || "—"}</dd>
              </div>
              <div>
                <dt className="c4-label text-[var(--c4-black)]/50">Gender</dt>
                <dd className="mt-1">{talent.gender}</dd>
              </div>
              <div>
                <dt className="c4-label text-[var(--c4-black)]/50">Age range</dt>
                <dd className="mt-1">{talent.age_band}</dd>
              </div>
            </dl>
          </aside>
        </div>

        {similar.length > 0 ? (
          <section className="mt-24 border-t-2 border-[var(--c4-black)] pt-16">
            <h2 className="display text-[clamp(1.65rem,6.5vw,1.875rem)] font-extrabold uppercase leading-[1.05] md:text-4xl">
              Similar voices
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {similar.map((t, i) => (
                <VoiceRoomCard key={t.id} talent={t} index={i} variant="grid" />
              ))}
            </div>
          </section>
        ) : null}
      </main>
  )
}
