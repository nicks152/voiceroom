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
          {isHome ? <HomeLoader /> : <PageLoader />}
          <ScrollProgress />
          <CustomCursor />
          <VoiceRoomNav />
          <PageEnter>{children}</PageEnter>
          <VoiceRoomFooter />
        </FilterProvider>
      </InquiryProvider>
    </FavoritesProvider>
  )
}
