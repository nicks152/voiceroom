"use client"

import { useCallback, useEffect, useMemo, useState, Suspense } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SiteShell } from "@/components/voice-room/site-shell"
import { VoiceRoomCard } from "@/components/voice-room/voice-card"
import { HeroLine, Reveal } from "@/components/voice-room/motion"
import type { Talent } from "@/lib/talent-types"
import {
  filtersToSearchParams,
  loadRosterFilters,
  ROSTER_DEFAULTS,
  saveRosterFilters,
} from "@/lib/roster-filters"

function RosterContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const [hydrated, setHydrated] = useState(false)

  const hasUrlFilters =
    searchParams.has("q") ||
    searchParams.has("lang") ||
    searchParams.has("gender") ||
    searchParams.has("style")

  // Restore last filters when landing on bare /roster (e.g. nav from a profile)
  useEffect(() => {
    if (hasUrlFilters) {
      setHydrated(true)
      return
    }
    const saved = loadRosterFilters()
    if (!saved) {
      setHydrated(true)
      return
    }
    const qs = filtersToSearchParams(saved)
    if (qs) {
      router.replace(`${pathname}?${qs}`, { scroll: false })
    }
    setHydrated(true)
  }, [hasUrlFilters, pathname, router])

  const query = searchParams.get("q") || ""
  const language = searchParams.get("lang") || ROSTER_DEFAULTS.language
  const gender = searchParams.get("gender") || ROSTER_DEFAULTS.gender
  const tag = searchParams.get("style") || ROSTER_DEFAULTS.style

  // Keep sessionStorage in sync whenever URL filters are active
  useEffect(() => {
    if (!hydrated) return
    saveRosterFilters({ q: query, lang: language, gender, style: tag })
  }, [hydrated, query, language, gender, tag])

  const setFilters = useCallback(
    (next: Partial<{ q: string; lang: string; gender: string; style: string }>) => {
      const q = next.q !== undefined ? next.q : query
      const lang = next.lang !== undefined ? next.lang : language
      const nextGender = next.gender !== undefined ? next.gender : gender
      const style = next.style !== undefined ? next.style : tag
      const filters = { q, lang, gender: nextGender, style }
      saveRosterFilters(filters)
      const qs = filtersToSearchParams(filters)
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [query, language, gender, tag, pathname, router],
  )

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/talent")
        const data = await res.json()
        if (data.talent) {
          const sorted = [...data.talent].sort((a: Talent, b: Talent) =>
            (a.name || "").localeCompare(b.name || ""),
          )
          setTalents(sorted)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const languages = useMemo(
    () =>
      [...new Set(talents.flatMap((t) => t.languages || []))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [talents],
  )
  const tags = useMemo(
    () =>
      [...new Set(talents.flatMap((t) => t.tags || []))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [talents],
  )

  const filtered = useMemo(() => {
    return talents.filter((t) => {
      const name = `${t.pseudonym || ""} ${t.name || ""} ${t.description || ""} ${(t.tags || []).join(" ")}`
      if (query && !name.toLowerCase().includes(query.toLowerCase())) return false
      if (
        language !== ROSTER_DEFAULTS.language &&
        !(t.languages || []).includes(language)
      ) {
        return false
      }
      if (gender !== ROSTER_DEFAULTS.gender && t.gender !== gender) return false
      if (tag !== ROSTER_DEFAULTS.style && !(t.tags || []).includes(tag)) return false
      return true
    })
  }, [talents, query, language, gender, tag])

  return (
    <SiteShell>
      <main className="mx-auto max-w-[1440px] px-5 py-14 md:px-10">
        <HeroLine>
          <span className="c4-sticker c4-block-yellow">Roster</span>
        </HeroLine>
        <h1 className="display mt-6 text-5xl font-extrabold uppercase md:text-7xl">
          <HeroLine delay={0.1}>Voice Roster</HeroLine>
        </h1>
        <Reveal delay={0.18}>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--c4-muted)] md:text-base">
            A hand-picked roster of Africa focused voice artists, carefully selected for
            the world&apos;s most discerning productions. Browse, listen, and inquire.
          </p>
        </Reveal>

        <Reveal
          delay={0.15}
          className="mt-12 border-2 border-[var(--c4-black)] bg-[var(--c4-yellow)] p-5 md:p-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <label className="block flex-1">
              <span className="c4-label">Search</span>
              <input
                value={query}
                onChange={(e) => setFilters({ q: e.target.value })}
                placeholder="Name, tone, language, style…"
                className="mt-2 w-full border-b-2 border-[var(--c4-black)] bg-transparent py-2 text-sm outline-none placeholder:text-[var(--c4-black)]/40"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <select
                value={language}
                onChange={(e) => setFilters({ lang: e.target.value })}
                className="border-2 border-[var(--c4-black)] bg-[var(--c4-white)] px-3 py-2 text-[10px] tracking-[0.14em] uppercase"
              >
                <option value={ROSTER_DEFAULTS.language}>Language</option>
                {languages.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <select
                value={gender}
                onChange={(e) => setFilters({ gender: e.target.value })}
                className="border-2 border-[var(--c4-black)] bg-[var(--c4-white)] px-3 py-2 text-[10px] tracking-[0.14em] uppercase"
              >
                <option value={ROSTER_DEFAULTS.gender}>Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              <select
                value={tag}
                onChange={(e) => setFilters({ style: e.target.value })}
                className="border-2 border-[var(--c4-black)] bg-[var(--c4-white)] px-3 py-2 text-[10px] tracking-[0.14em] uppercase"
              >
                <option value={ROSTER_DEFAULTS.style}>Style</option>
                {tags.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </Reveal>

        <p className="mt-8 c4-label">
          {loading
            ? "Loading roster…"
            : `${filtered.length} voice${filtered.length !== 1 ? "s" : ""} on roster`}
        </p>

        <div className="mt-6 grid gap-4">
          {filtered.map((t, i) => (
            <VoiceRoomCard key={t.id} talent={t} index={i % 6} variant="list" />
          ))}
        </div>

        {!loading && filtered.length === 0 ? (
          <p className="mt-12 text-sm text-[var(--c4-muted)]">
            No voices match those filters. Try broadening your search.
          </p>
        ) : null}
      </main>
    </SiteShell>
  )
}

export default function RosterPage() {
  return (
    <Suspense
      fallback={
        <SiteShell>
          <main className="mx-auto max-w-[1440px] px-5 py-14 md:px-10">
            <p className="c4-label">Loading roster…</p>
          </main>
        </SiteShell>
      }
    >
      <RosterContent />
    </Suspense>
  )
}
