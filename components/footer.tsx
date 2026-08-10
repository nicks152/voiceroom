"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ApplyModal } from "./apply-modal"

export function Footer() {
  const [isApplyOpen, setIsApplyOpen] = useState(false)

  return (
    <>
      <ApplyModal isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} />
      <footer className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-12">
            <div className="lg:col-span-5">
              <Link href="/" className="inline-block mb-8">
                <Image
                  src="/images/logo-dark.png"
                  alt="The Voice Room by AMP Studios"
                  width={280}
                  height={70}
                  className="h-16 w-auto"
                />
              </Link>
              <p className="text-background/60 leading-relaxed max-w-sm mb-8">
                A hand-picked roster of Africa focused voice artists, carefully selected for the world&apos;s most discerning productions.
              </p>
              <div className="flex items-center gap-6">
                <a href="https://www.instagram.com/ampafrica" target="_blank" rel="noopener noreferrer" className="text-xs tracking-[0.2em] uppercase text-background/60 hover:text-background transition-colors">
                  Instagram
                </a>
                <a href="https://www.linkedin.com/company/ampstudios" target="_blank" rel="noopener noreferrer" className="text-xs tracking-[0.2em] uppercase text-background/60 hover:text-background transition-colors">
                  LinkedIn
                </a>
                <a href="https://www.vimeo.com/ampafrica" target="_blank" rel="noopener noreferrer" className="text-xs tracking-[0.2em] uppercase text-background/60 hover:text-background transition-colors">
                  Vimeo
                </a>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-background/40 mb-6">Explore</p>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/roster" className="text-sm text-background/70 hover:text-background transition-colors">
                        Voice Roster
                      </Link>
                    </li>
                    <li>
                      <Link href="/work" className="text-sm text-background/70 hover:text-background transition-colors">
                        Featured Work
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => setIsApplyOpen(true)}
                        className="text-sm text-background/70 hover:text-background transition-colors cursor-pointer"
                      >
                        Apply to Join
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-background/40 mb-6">Agency</p>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/about" className="text-sm text-background/70 hover:text-background transition-colors">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/services" className="text-sm text-background/70 hover:text-background transition-colors">
                        Our Services
                      </Link>
                    </li>
                    <li>
                      <Link href="/roster" className="text-sm text-background/70 hover:text-background transition-colors">
                        Voice Talent
                      </Link>
                    </li>
                    <li>
                      <Link href="/work" className="text-sm text-background/70 hover:text-background transition-colors">
                        Our Work
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-background/40 mb-6">Contact</p>
                  <ul className="space-y-4">
                    <li>
                      <Link href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                        Inquiries
                      </Link>
                    </li>
                    <li>
                      <a href="https://www.ampafrica.com/book" target="_blank" rel="noopener noreferrer" className="text-sm text-background/70 hover:text-background transition-colors">
                        Studio Bookings
                      </a>
                    </li>
                    <li>
                      <a href="tel:+254790491934" className="text-sm text-background/70 hover:text-background transition-colors">
                        +254 (0) 790491934
                      </a>
                    </li>
                    <li>
                      <a href="mailto:voices@ampafrica.com" className="text-sm text-background/70 hover:text-background transition-colors">
                        voices@ampafrica.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-background/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/40">
              <p>© 2026 Amp Studios Limited. All rights reserved.</p>
              <div className="flex items-center gap-8">
                <Link href="#" className="hover:text-background transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-background transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
