"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { useFavorites } from "@/contexts/favorites-context"
import { useInquiry } from "@/contexts/inquiry-context"
import { InquiryModal } from "./inquiry-modal"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { count } = useFavorites()
  const { isOpen: isInquiryOpen, openInquiry, closeInquiry } = useInquiry()

  useEffect(() => {
    const handleScroll = () => {
      // Only turn black after actual page scroll - must be scrolled past 0
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? "bg-foreground text-background border-background/20" 
          : "bg-transparent border-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-16" : "h-20"}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={isScrolled ? "/images/logo-dark.png" : "/images/logo.png"}
              alt="The Voice Room by AMP Studios"
              width={240}
              height={60}
              className={`transition-all duration-300 ${isScrolled ? "h-10 w-auto" : "h-14 w-auto"}`}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            <Link 
              href="/roster" 
              className={`text-xs tracking-[0.2em] uppercase transition-colors ${isScrolled ? "text-background/70 hover:text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              Roster
            </Link>
            <Link 
              href="/about" 
              className={`text-xs tracking-[0.2em] uppercase transition-colors ${isScrolled ? "text-background/70 hover:text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              About
            </Link>
            <Link 
              href="/services" 
              className={`text-xs tracking-[0.2em] uppercase transition-colors ${isScrolled ? "text-background/70 hover:text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              Services
            </Link>
            <Link 
              href="/work" 
              className={`text-xs tracking-[0.2em] uppercase transition-colors ${isScrolled ? "text-background/70 hover:text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              Work
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center">
            <button 
              onClick={openInquiry}
              className={`text-xs tracking-[0.2em] uppercase border px-6 py-3 transition-all duration-300 flex items-center gap-2 ${
                isScrolled 
                  ? "border-background text-background hover:bg-background hover:text-foreground" 
                  : "border-foreground hover:bg-foreground hover:text-background"
              }`}
            >
              Inquire
              {count > 0 && (
                <span className={`w-5 h-5 flex items-center justify-center text-[10px] ${isScrolled ? "bg-background text-foreground" : "bg-foreground text-background"}`}>
                  {count}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden p-2 transition-colors ${isScrolled ? "text-background" : "text-foreground"}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border">
          <nav className="flex flex-col px-6 py-8 gap-6">
            <Link 
              href="/roster" 
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Roster
            </Link>
            <Link 
              href="/about" 
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/services" 
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/work" 
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Work
            </Link>
            <button 
              className="text-xs tracking-[0.2em] uppercase border border-foreground px-6 py-3 text-center hover:bg-foreground hover:text-background transition-all mt-4 flex items-center justify-center gap-2"
              onClick={() => {
                setIsMenuOpen(false)
                openInquiry()
              }}
            >
              Inquire
              {count > 0 && (
                <span className="bg-foreground text-background w-5 h-5 flex items-center justify-center text-[10px]">
                  {count}
                </span>
              )}
            </button>
          </nav>
        </div>
      )}
      </header>
      
      <InquiryModal isOpen={isInquiryOpen} onClose={closeInquiry} />
    </>
  )
}
