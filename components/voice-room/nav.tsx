"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useFavorites } from "@/contexts/favorites-context"
import { useInquiry } from "@/contexts/inquiry-context"
import { InquiryModal } from "@/components/inquiry-modal"

const LINKS = [
  { href: "/roster", label: "Roster" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
]

export function VoiceRoomNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { count } = useFavorites()
  const { isOpen: isInquiryOpen, openInquiry, closeInquiry } = useInquiry()

  return (
    <>
      <header className="sticky top-0 z-50 border-b-2 border-[var(--c4-black)] bg-[var(--c4-white)]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3 md:px-10">
          <Link
            href="/"
            className="display text-lg font-extrabold uppercase tracking-tight md:text-xl"
          >
            Voice Room
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => {
              const active =
                l.href === "/"
                  ? pathname === "/"
                  : pathname === l.href || pathname?.startsWith(`${l.href}/`)
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative px-4 py-2 text-[11px] font-medium tracking-[0.18em] uppercase transition-colors ${
                    active
                      ? "text-[var(--c4-black)]"
                      : "text-[var(--c4-muted)] hover:text-[var(--c4-black)]"
                  }`}
                >
                  {l.label}
                  {active ? (
                    <motion.span
                      layoutId="vr-nav-underline"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 bg-[var(--c4-black)]"
                    />
                  ) : null}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openInquiry}
              className="hidden items-center gap-2 border-2 border-[var(--c4-black)] px-4 py-2 text-[10px] font-medium tracking-[0.18em] uppercase transition-colors hover:bg-[var(--c4-yellow)] sm:inline-flex"
            >
              Inquire
              {count > 0 ? (
                <span className="flex h-5 w-5 items-center justify-center bg-[var(--c4-black)] text-[10px] text-[var(--c4-white)]">
                  {count}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border-2 border-[var(--c4-black)] md:hidden"
            >
              <span
                className={`h-0.5 w-5 bg-[var(--c4-black)] transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`h-0.5 w-5 bg-[var(--c4-black)] transition-opacity ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-0.5 w-5 bg-[var(--c4-black)] transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t-2 border-[var(--c4-black)] md:hidden"
            >
              <nav className="flex flex-col px-5 py-4">
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="display border-b border-[var(--c4-line)] py-4 text-2xl font-bold uppercase"
                  >
                    {l.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    openInquiry()
                  }}
                  className="mt-4 border-2 border-[var(--c4-black)] px-4 py-3 text-left text-[11px] tracking-[0.18em] uppercase"
                >
                  Inquire{count > 0 ? ` (${count})` : ""}
                </button>
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <InquiryModal isOpen={isInquiryOpen} onClose={closeInquiry} />
    </>
  )
}
