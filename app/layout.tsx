import type { Metadata } from "next"
import Script from "next/script"
import { DM_Sans, Syne } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { StructuredData } from "@/components/structured-data"
import "./globals.css"
import "@/styles/voice-room.css"

const display = Syne({
  subsets: ["latin"],
  variable: "--font-vr-display",
  weight: ["600", "700", "800"],
})

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-vr-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://thevoiceroom.co.ke"),
  title: {
    default: "The Voice Room | East Africa's voiceover roster",
    template: "%s | The Voice Room",
  },
  description:
    "A hand-picked roster of Africa focused voice artists, carefully selected for the world's most discerning productions. Voice casting, recording, and direction from Nairobi.",
  keywords: [
    "voiceover studio Africa",
    "African voice actors",
    "voice talent Kenya",
    "voiceover Nairobi",
    "East African voice artists",
    "commercial voiceover Africa",
    "ADR recording Nairobi",
    "IVR voice recording",
    "voice casting Africa",
    "Swahili voiceover",
    "AMP Studios",
  ],
  authors: [{ name: "The Voice Room by AMP Studios" }],
  creator: "AMP Studios",
  publisher: "The Voice Room",
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://thevoiceroom.co.ke",
    siteName: "The Voice Room",
    title: "The Voice Room | East Africa's voiceover roster",
    description:
      "A hand-picked roster of Africa focused voice artists, carefully selected for the world's most discerning productions.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Voice Room - East Africa's voiceover roster",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Voice Room | East Africa's voiceover roster",
    description:
      "A hand-picked roster of Africa focused voice artists for global productions.",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="5F+ujsRhh9PF78J2BjHiCQ"
          strategy="afterInteractive"
        />
      </head>
      <body className="voice-room antialiased">
        <StructuredData />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
