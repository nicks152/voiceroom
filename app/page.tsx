import type { Metadata } from "next"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedArtists } from "@/components/featured-artists"
import { HomepageSections } from "@/components/homepage-sections"
import { Footer } from "@/components/footer"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { FilterProvider } from "@/contexts/filter-context"
import { InquiryProvider } from "@/contexts/inquiry-context"
import { LoadingScreen } from "@/components/loading-screen"

export const metadata: Metadata = {
  title: "Voiceover Studio Africa | The Voice Room Nairobi",
  description: "Premium voiceover recording and casting studio in Nairobi. Access top African voice talent for commercials, content, ADR, and IVR.",
}

export default function Home() {
  return (
    <FavoritesProvider>
      <InquiryProvider>
        <FilterProvider>
          <LoadingScreen />
          <main className="min-h-screen bg-background">
            <Header />
            <HeroSection />
            <FeaturedArtists />
            <HomepageSections />
            <Footer />
          </main>
        </FilterProvider>
      </InquiryProvider>
    </FavoritesProvider>
  )
}
