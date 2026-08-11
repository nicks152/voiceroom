export type TalentSample = {
  id: string
  title: string
  file_url: string
  duration_sec: number | null
  published?: boolean
}

export type Talent = {
  id: string
  name: string
  pseudonym: string | null
  description: string | null
  bio?: string | null
  gender: "MALE" | "FEMALE" | string
  age_band: string
  languages: string[] | null
  tags: string[] | null
  featured?: boolean | null
  photo_url?: string | null
  samples?: TalentSample[] | null
}

export function displayName(talent: Talent) {
  return talent.pseudonym || talent.name
}

export function firstSample(talent: Talent) {
  const samples = talent.samples || []
  return samples.find((s) => s.published !== false && s.file_url) || null
}

export function publishedSamples(talent: Talent) {
  return (talent.samples || []).filter((s) => s.published !== false && s.file_url)
}
