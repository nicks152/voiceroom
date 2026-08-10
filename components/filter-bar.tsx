"use client"

import { Search, ChevronDown, List } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFilter } from "@/contexts/filter-context"
import { useFavorites } from "@/contexts/favorites-context"

const styles = [
  "All Styles",
  "Authoritative",
  "Warm",
  "Documentary", 
  "Conversational",
  "Commercial",
  "Narrative",
  "Character",
]

const voiceOptions = ["Male", "Female"]
const ageOptions = ["Child", "Teen", "18-25", "25-35", "35-45", "50+"]
const languageOptions = ["English", "Swahili", "French", "Kikuyu", "Luo"]

interface FilterBarProps {
  hideHeader?: boolean
}

export function FilterBar({ hideHeader = false }: FilterBarProps) {
  const { 
    searchQuery, 
    setSearchQuery, 
    showFavoritesOnly, 
    setShowFavoritesOnly,
    selectedVoices,
    setSelectedVoices,
    selectedAges,
    setSelectedAges,
    selectedLanguages,
    setSelectedLanguages,
    activeStyles,
    setActiveStyles,
  } = useFilter()
  const { count } = useFavorites()

  const toggleStyle = (style: string) => {
    if (style === "All Styles") {
      setActiveStyles([])
    } else {
      setActiveStyles(prev => 
        prev.includes(style) 
          ? prev.filter(s => s !== style)
          : [...prev, style]
      )
    }
  }

  const toggleFilter = (value: string, selected: string[], setSelected: (val: string[]) => void) => {
    setSelected(
      selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value]
    )
  }

  const getDisplayText = (selected: string[], allLabel: string) => {
    if (selected.length === 0) return allLabel
    if (selected.length === 1) return selected[0]
    return `${selected.length} selected`
  }

  return (
    <section id="roster" className="border-t border-border bg-background scroll-mt-20">
      <div className={hideHeader ? "" : "max-w-7xl mx-auto px-6 lg:px-12"}>
        {/* Section Header */}
        {!hideHeader && (
          <div className="py-12 border-b border-border">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Our Roster</p>
            <h2 className="font-serif text-3xl lg:text-4xl mb-4">Featured Artists</h2>
            <p className="text-sm text-muted-foreground">
              Each voice in our collection has been personally selected for their exceptional craft and distinctive character.
            </p>
          </div>
        )}

        {/* Search and Dropdowns */}
        <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-border pl-7 pb-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
            />
          </div>

          {/* Dropdowns */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 w-[140px] text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors">
                {getDisplayText(selectedVoices, "All Voices")}
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[160px]">
                {voiceOptions.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option}
                    checked={selectedVoices.includes(option)}
                    onCheckedChange={() => toggleFilter(option, selectedVoices, setSelectedVoices)}
                    className="text-xs tracking-[0.1em] uppercase"
                  >
                    {option}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 w-[140px] text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors">
                {getDisplayText(selectedAges, "All Ages")}
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[160px]">
                {ageOptions.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option}
                    checked={selectedAges.includes(option)}
                    onCheckedChange={() => toggleFilter(option, selectedAges, setSelectedAges)}
                    className="text-xs tracking-[0.1em] uppercase"
                  >
                    {option}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 w-[160px] text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors">
                {getDisplayText(selectedLanguages, "All Languages")}
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[180px]">
                {languageOptions.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option}
                    checked={selectedLanguages.includes(option)}
                    onCheckedChange={() => toggleFilter(option, selectedLanguages, setSelectedLanguages)}
                    className="text-xs tracking-[0.1em] uppercase"
                  >
                    {option}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-3 py-2 text-xs tracking-[0.15em] uppercase transition-all border ${
                showFavoritesOnly 
                  ? "bg-foreground text-background border-foreground" 
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
              }`}
              title="Show starred artists only"
            >
              <List className="w-4 h-4" />
              {count > 0 && <span>{count}</span>}
            </button>
          </div>
        </div>

        {/* Style Tags */}
        <div className="py-5 flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => toggleStyle(style)}
              className={`px-5 py-2 text-xs tracking-[0.15em] uppercase whitespace-nowrap transition-all ${
                (style === "All Styles" && activeStyles.length === 0) || activeStyles.includes(style)
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
