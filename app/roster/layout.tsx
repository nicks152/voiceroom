import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "African Voice Actors & Talent | The Voice Room",
  description: "Discover professional African voice actors across accents, languages, and styles. Cast the perfect voice for your project.",
}

export default function RosterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
