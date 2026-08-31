"use client"

import { useCallback, useEffect, useMemo, useState, Suspense } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SiteShell } from "@/components/voice-room/site-shell"
import { VoiceRoomCard } from "@/components/voice-room/voice-card"
import { HeroLine, Reveal } from "@/components/voice-room/motion"
import type { Talent } from "@/lib/talent-types"

const DEFAULT_LANGUAGE = "Language"
const DEFAULT_GENDER = "Gender"
const DEFAULT_STYLE = "Style"

function RosterContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)

  // URL is source of truth so back/forward restores filters
  const query = searchParams.get("q") || ""
  const language = searchParams.get("lang") || DEFAULT_LANGUAGE
  const gender = searchParams.get("gender") || DEFAULT_GENDER
  const tag = searchParams.get("style") || DEFAULT_STYLE

  const setFilters = useCallback(
    (next: Partial<{ q: string; lang: string; gender: string; style: string }>) => {
      const params = new URLSearchParams(searchParams.toString())
      const q = next.q !== undefined ? next.q : query
      const lang = next.lang !== undefined ? next.lang : language
      const nextGender = next.gender !== undefined ? next.gender : gender
      const style = next.style !== undefined ? next.style : tag

      if (q.trim()) params.set("q", q.trim())
      else params.delete("q")
      if (lang !== DEFAULT_LANGUAGE) params.set("lang", lang)
      else params.delete("lang")
      if (nextGender !== DEFAULT_GENDER) params.set("gender", nextGender)
      else params.delete("gender")
      if (style !== DEFAULT_STYLE) params.set("style", style)
      else params.delete("style")

      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [searchParams, query, language, gender, tag, pathname, router],
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
      if (language !== DEFAULT_LANGUAGE && !(t.languages || []).includes(language))
        return false
      if (gender !== DEFAULT_GENDER && t.gender !== gender) return false
      if (tag !== DEFAULT_STYLE && !(t.tags || []).includes(tag)) return false
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
                <option value={DEFAULT_LANGUAGE}>Language</option>
                {languages.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <select
                value={gender}
                onChange={(e) => setFilters({ gender: e.target.value })}
                className="border-2 border-[var(--c4-black)] bg-[var(--c4-white)] px-3 py-2 text-[10px] tracking-[0.14em] uppercase"
              >
                <option value={DEFAULT_GENDER}>Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              <select
                value={tag}
                onChange={(e) => setFilters({ style: e.target.value })}
                className="border-2 border-[var(--c4-black)] bg-[var(--c4-white)] px-3 py-2 text-[10px] tracking-[0.14em] uppercase"
              >
                <option value={DEFAULT_STYLE}>Style</option>
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
