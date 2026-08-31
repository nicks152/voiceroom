const STORAGE_KEY = "vr-roster-filters-v1"
const SCROLL_KEY = "vr-roster-scroll-v1"

export type RosterFilters = {
  q: string
  lang: string
  gender: string
  style: string
}

export const ROSTER_DEFAULTS = {
  language: "Language",
  gender: "Gender",
  style: "Style",
} as const

export function filtersToSearchParams(filters: RosterFilters): string {
  const params = new URLSearchParams()
  if (filters.q.trim()) params.set("q", filters.q.trim())
  if (filters.lang && filters.lang !== ROSTER_DEFAULTS.language) {
    params.set("lang", filters.lang)
  }
  if (filters.gender && filters.gender !== ROSTER_DEFAULTS.gender) {
    params.set("gender", filters.gender)
  }
  if (filters.style && filters.style !== ROSTER_DEFAULTS.style) {
    params.set("style", filters.style)
  }
  return params.toString()
}

export function saveRosterFilters(filters: RosterFilters) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
  } catch {
    // ignore quota / private mode
  }
}

export function loadRosterFilters(): RosterFilters | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<RosterFilters>
    return {
      q: typeof parsed.q === "string" ? parsed.q : "",
      lang: typeof parsed.lang === "string" ? parsed.lang : ROSTER_DEFAULTS.language,
      gender:
        typeof parsed.gender === "string" ? parsed.gender : ROSTER_DEFAULTS.gender,
      style: typeof parsed.style === "string" ? parsed.style : ROSTER_DEFAULTS.style,
    }
  } catch {
    return null
  }
}

/** Build /roster or /roster?... from the last saved filters (for nav links). */
export function getRosterHref(): string {
  if (typeof window === "undefined") return "/roster"
  const saved = loadRosterFilters()
  if (!saved) return "/roster"
  const qs = filtersToSearchParams(saved)
  return qs ? `/roster?${qs}` : "/roster"
}

export function saveRosterScroll(
  y: number = typeof window !== "undefined" ? window.scrollY : 0,
) {
  try {
    sessionStorage.setItem(SCROLL_KEY, String(Math.max(0, Math.round(y))))
  } catch {
    // ignore
  }
}

export function loadRosterScroll(): number | null {
  try {
    const raw = sessionStorage.getItem(SCROLL_KEY)
    if (raw == null) return null
    const y = Number(raw)
    return Number.isFinite(y) && y >= 0 ? y : null
  } catch {
    return null
  }
}
