"use client"

import { usePathname } from "next/navigation"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { FilterProvider } from "@/contexts/filter-context"
import { InquiryProvider } from "@/contexts/inquiry-context"
import { CustomCursor } from "./custom-cursor"
import { VoiceRoomFooter } from "./footer"
import { HomeLoader } from "./home-loader"
import { PageEnter, PageLoader, ScrollProgress } from "./motion"
import { VoiceRoomNav } from "./nav"

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <FavoritesProvider>
      <InquiryProvider>
        <FilterProvider>
          <div className="voice-room-shell min-w-0 max-w-[100vw] overflow-x-clip">
            {isHome ? <HomeLoader /> : <PageLoader />}
            <ScrollProgress />
            <CustomCursor />
            <VoiceRoomNav />
            <PageEnter>{children}</PageEnter>
            <VoiceRoomFooter />
          </div>
        </FilterProvider>
      </InquiryProvider>
    </FavoritesProvider>
  )
}
