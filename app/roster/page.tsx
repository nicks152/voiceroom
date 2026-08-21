"use client"

import { useEffect, useMemo, useState } from "react"
import { SiteShell } from "@/components/voice-room/site-shell"
import { VoiceRoomCard } from "@/components/voice-room/voice-card"
import { HeroLine, Reveal } from "@/components/voice-room/motion"
import type { Talent } from "@/lib/talent-types"

export default function RosterPage() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [language, setLanguage] = useState("Language")
  const [gender, setGender] = useState("Gender")
  const [tag, setTag] = useState("Style")

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
      if (language !== "Language" && !(t.languages || []).includes(language)) return false
      if (gender !== "Gender" && t.gender !== gender) return false
      if (tag !== "Style" && !(t.tags || []).includes(tag)) return false
      return true
    })
  }, [talents, query, language, gender, tag])

  return (
    <SiteShell>
      <main className="mx-auto max-w-[1440px] px-5 py-14 md:px-10">
        <HeroLine>
          <span className="c4-sticker c4-block-yellow">Roster</span>
        </HeroLine>
        <h1 className="display mt-6 min-w-0 text-[clamp(1.85rem,8.5vw,3rem)] font-extrabold uppercase md:text-7xl">
          <HeroLine delay={0.1}>Voice Roster</HeroLine>
        </h1>
        <Reveal delay={0.18}>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--c4-muted)] md:text-base">
            A hand-picked roster of Africa focused voice artists, carefully selected for
            the world&apos;s most discerning productions. Browse, listen, and inquire.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-12 border-2 border-[var(--c4-black)] bg-[var(--c4-yellow)] p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <label className="block flex-1">
              <span className="c4-label">Search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, tone, language, style…"
                className="mt-2 w-full border-b-2 border-[var(--c4-black)] bg-transparent py-2 text-sm outline-none placeholder:text-[var(--c4-black)]/40"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border-2 border-[var(--c4-black)] bg-[var(--c4-white)] px-3 py-2 text-[10px] tracking-[0.14em] uppercase"
              >
                <option value="Language">Language</option>
                {languages.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="border-2 border-[var(--c4-black)] bg-[var(--c4-white)] px-3 py-2 text-[10px] tracking-[0.14em] uppercase"
              >
                <option value="Gender">Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="border-2 border-[var(--c4-black)] bg-[var(--c4-white)] px-3 py-2 text-[10px] tracking-[0.14em] uppercase"
              >
                <option value="Style">Style</option>
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
