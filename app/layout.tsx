import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { StructuredData } from '@/components/structured-data'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  metadataBase: new URL('https://thevoiceroom.co.ke'),
  title: {
    default: "The Voice Room | East Africa's voiceover roster",
    template: '%s | The Voice Room'
  },
  description: 'A hand-picked roster of Africa focused voice artists, carefully selected for the world\'s most discerning productions. Voice casting, recording, and direction from Nairobi.',
  keywords: [
    'voiceover studio Africa',
    'African voice actors',
    'voice talent Kenya',
    'voiceover Nairobi',
    'East African voice artists',
    'commercial voiceover Africa',
    'ADR recording Nairobi',
    'IVR voice recording',
    'voice casting Africa',
    'Swahili voiceover',
    'Kikuyu voice actor',
    'AMP Studios'
  ],
  authors: [{ name: 'The Voice Room by AMP Studios' }],
  creator: 'AMP Studios',
  publisher: 'The Voice Room',
  generator: 'v0.app',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://thevoiceroom.co.ke',
    siteName: 'The Voice Room',
    title: "The Voice Room | East Africa's voiceover roster",
    description: 'A hand-picked roster of Africa focused voice artists, carefully selected for the world\'s most discerning productions.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "The Voice Room - East Africa's voiceover roster",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Voice Room | East Africa's voiceover roster",
    description: 'A hand-picked roster of Africa focused voice artists for global productions.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <Script 
          src="https://analytics.ahrefs.com/analytics.js" 
          data-key="5F+ujsRhh9PF78J2BjHiCQ" 
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <StructuredData />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
