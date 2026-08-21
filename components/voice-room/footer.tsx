"use client"

import Link from "next/link"
import { useState } from "react"
import { ApplyModal } from "@/components/apply-modal"

export function VoiceRoomFooter() {
  const [isApplyOpen, setIsApplyOpen] = useState(false)

  return (
    <>
      <ApplyModal isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} />
      <footer className="border-t border-white/15 c4-block-black px-5 py-16 md:px-10">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="display inline-block text-2xl font-extrabold uppercase tracking-tight text-white md:text-3xl"
            >
              Voice Room
            </Link>
            <p className="mt-2 text-[11px] tracking-[0.18em] uppercase text-white/40">
              By AMP Studios
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
              A hand-picked roster of Africa focused voice artists, carefully selected
              for the world&apos;s most discerning productions.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <a
                href="https://www.instagram.com/ampafrica"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-white"
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/ampstudios"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-white"
              >
                LinkedIn
              </a>
              <a
                href="https://www.vimeo.com/ampafrica"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-white"
              >
                Vimeo
              </a>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-8 sm:gap-10 md:grid-cols-3 lg:col-span-7">
            <div className="min-w-0">
              <p className="c4-label mb-5 text-white/40">Explore</p>
              <ul className="space-y-3 text-sm text-white/70">
                <li>
                  <Link href="/roster" className="hover:text-white">
                    Voice Roster
                  </Link>
                </li>
                <li>
                  <Link href="/work" className="hover:text-white">
                    Featured Work
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsApplyOpen(true)}
                    className="hover:text-white"
                  >
                    Apply to Join
                  </button>
                </li>
              </ul>
            </div>
            <div className="min-w-0">
              <p className="c4-label mb-5 text-white/40">Agency</p>
              <ul className="space-y-3 text-sm text-white/70">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-white">
                    Our Services
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:voices@ampafrica.com"
                    className="break-all hover:text-white"
                  >
                    voices@ampafrica.com
                  </a>
                </li>
              </ul>
            </div>
            <div className="min-w-0 col-span-2 md:col-span-1">
              <p className="c4-label mb-5 text-white/40">Studio</p>
              <ul className="space-y-3 text-sm text-white/70">
                <li>
                  <a
                    href="https://www.ampafrica.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    AMP Studios
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ampafrica.com/book"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    Book a Session
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-14 flex max-w-[1440px] flex-col gap-2 border-t border-white/15 pt-6 text-[10px] tracking-[0.18em] uppercase text-white/35 md:flex-row md:justify-between">
          <span className="break-words">© {new Date().getFullYear()} The Voice Room by AMP Studios</span>
          <span>Nairobi</span>
        </div>
      </footer>
    </>
  )
}
