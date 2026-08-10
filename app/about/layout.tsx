import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book a Voiceover Session | Nairobi Studio",
  description: "Book a professional voiceover recording session in Nairobi or remotely. Fast, high-quality production.",
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
