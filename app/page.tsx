import type { Metadata } from "next"
import { HomePage } from "@/components/voice-room/home-page"

export const metadata: Metadata = {
  title: "Voiceover Studio Africa | The Voice Room Nairobi",
  description:
    "Premium voiceover recording and casting studio in Nairobi. Access top African voice talent for commercials, content, ADR, and IVR.",
}

export default function Home() {
  return <HomePage />
}
