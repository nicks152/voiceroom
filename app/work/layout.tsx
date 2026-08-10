import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Voiceover Projects & Commercial Work | The Voice Room",
  description: "Explore voiceover projects, commercial recordings, and global brand work produced at The Voice Room studio.",
}

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
