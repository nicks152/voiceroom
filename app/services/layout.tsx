import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Voiceover Services Africa | Recording, Casting, ADR & IVR",
  description: "Professional voiceover services including recording, casting, ADR, and IVR production. Nairobi-based studio working with global clients.",
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
