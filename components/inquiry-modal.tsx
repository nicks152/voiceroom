"use client"

import { useState, useRef, useEffect } from "react"
import { X, Upload, ChevronDown } from "lucide-react"
import { useFavorites } from "@/contexts/favorites-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface InquiryModalProps {
  isOpen: boolean
  onClose: () => void
}

type AnimationState = "closed" | "opening" | "open" | "closing"

const licenseTypes = [
  "Commercial Broadcast",
  "Digital/Online",
  "Corporate/Internal",
  "Audiobook",
  "E-Learning",
  "Documentary",
  "Film/Cinema",
  "Other",
]

const territories = [
  "Kenya",
  "East Africa",
  "Africa-wide",
  "Global",
  "North America",
  "Europe",
  "Asia Pacific",
  "Other",
]

const fieldLabel = "c4-label mb-3 block text-[var(--c4-muted)]"
const fieldInput =
  "w-full border-b-2 border-[var(--c4-black)] bg-transparent py-2 text-sm outline-none placeholder:text-[var(--c4-black)]/35 focus:border-[var(--c4-cobalt)]"
const fieldTrigger =
  "flex w-full items-center justify-between border-b-2 border-[var(--c4-black)] bg-transparent py-2 text-left text-sm outline-none"

export function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  const { favorites, count } = useFavorites()
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [licenseType, setLicenseType] = useState("")
  const [territory, setTerritory] = useState("")
  const [includeShortlist, setIncludeShortlist] = useState(count > 0)
  const [message, setMessage] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [animationState, setAnimationState] = useState<AnimationState>("closed")

  useEffect(() => {
    if (isOpen && animationState === "closed") {
      setAnimationState("opening")
      setTimeout(() => setAnimationState("open"), 50)
      if (count > 0) {
        setIncludeShortlist(true)
      }
    } else if (!isOpen && (animationState === "open" || animationState === "opening")) {
      setAnimationState("closing")
      setTimeout(() => setAnimationState("closed"), 400)
    }
  }, [isOpen, animationState, count])

  const handleClose = () => {
    setAnimationState("closing")
    setTimeout(() => {
      setAnimationState("closed")
      onClose()
    }, 400)
  }

  if (animationState === "closed") return null

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          email,
          licenseType,
          territory,
          includeShortlist,
          shortlistedArtists: includeShortlist ? favorites : [],
          message,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setSubmitError(data.error)
        setIsSubmitting(false)
        return
      }

      setSubmitSuccess(true)
      setTimeout(() => {
        handleClose()
        setName("")
        setCompany("")
        setEmail("")
        setLicenseType("")
        setTerritory("")
        setMessage("")
        setFile(null)
        setSubmitSuccess(false)
      }, 2000)
    } catch (err) {
      console.error("Submit error:", err)
      setSubmitError("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isVisible = animationState === "open"

  return (
    <div className="voice-room fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-[var(--c4-black)]/75 transition-opacity duration-400 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div
        className={`relative mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto border-2 border-[var(--c4-black)] bg-[var(--c4-white)] transition-all duration-400 ease-out ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-8 scale-95 opacity-0"
        }`}
      >
        <div className="absolute top-0 left-0 h-2 w-full bg-[var(--c4-yellow)]" />

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center border-2 border-[var(--c4-black)] bg-[var(--c4-white)] text-[var(--c4-black)] transition-colors hover:bg-[var(--c4-black)] hover:text-[var(--c4-white)]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-8 pt-10 lg:p-12">
          <span className="c4-sticker c4-block-yellow">Inquire</span>
          <h2 className="display mt-5 text-3xl font-extrabold uppercase leading-none tracking-tight md:text-5xl">
            Send us a message
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--c4-muted)]">
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>

          {submitSuccess && (
            <div className="mt-8 border-2 border-[var(--c4-black)] bg-[var(--c4-yellow)] px-4 py-3 text-center text-sm">
              Message sent successfully! We&apos;ll be in touch soon.
            </div>
          )}

          {submitError && (
            <div className="mt-8 border-2 border-[var(--c4-red)] bg-[var(--c4-red)]/10 px-4 py-3 text-center text-sm text-[var(--c4-red)]">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className={fieldLabel}>
                  Name <span className="text-[var(--c4-cobalt)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className={fieldInput}
                />
              </div>
              <div>
                <label className={fieldLabel}>
                  Company <span className="text-[var(--c4-cobalt)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company name"
                  className={fieldInput}
                />
              </div>
            </div>

            <div>
              <label className={fieldLabel}>
                Email Address <span className="text-[var(--c4-cobalt)]">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={fieldInput}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className={fieldLabel}>
                  License Usage <span className="text-[var(--c4-cobalt)]">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className={fieldTrigger}>
                    <span
                      className={
                        licenseType ? "text-[var(--c4-black)]" : "text-[var(--c4-black)]/35"
                      }
                    >
                      {licenseType || "Select license type"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-[var(--c4-muted)]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="z-[200] w-[280px] rounded-none border-2 border-[var(--c4-black)] bg-[var(--c4-white)] p-0"
                  >
                    {licenseTypes.map((type) => (
                      <DropdownMenuItem
                        key={type}
                        onClick={() => setLicenseType(type)}
                        className="rounded-none border-b border-[var(--c4-line)] px-4 py-3 text-sm last:border-0 focus:bg-[var(--c4-yellow)] focus:text-[var(--c4-black)]"
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <label className={fieldLabel}>
                  Territory <span className="text-[var(--c4-cobalt)]">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className={fieldTrigger}>
                    <span
                      className={
                        territory ? "text-[var(--c4-black)]" : "text-[var(--c4-black)]/35"
                      }
                    >
                      {territory || "Select territory"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-[var(--c4-muted)]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="z-[200] w-[280px] rounded-none border-2 border-[var(--c4-black)] bg-[var(--c4-white)] p-0"
                  >
                    {territories.map((t) => (
                      <DropdownMenuItem
                        key={t}
                        onClick={() => setTerritory(t)}
                        className="rounded-none border-b border-[var(--c4-line)] px-4 py-3 text-sm last:border-0 focus:bg-[var(--c4-yellow)] focus:text-[var(--c4-black)]"
                      >
                        {t}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-start gap-3 border-2 border-[var(--c4-black)] bg-[var(--c4-yellow)]/40 p-4">
              <input
                type="checkbox"
                id="shortlist"
                checked={includeShortlist}
                onChange={(e) => setIncludeShortlist(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[var(--c4-black)]"
              />
              <div>
                <label
                  htmlFor="shortlist"
                  className="cursor-pointer text-sm font-medium text-[var(--c4-black)]"
                >
                  Send Shortlist ({count} artist{count !== 1 ? "s" : ""})
                </label>
                <p className="mt-1 text-xs text-[var(--c4-muted)]">
                  {count > 0
                    ? "Include your starred voice artists with this message."
                    : "No artists shortlisted yet — star artists in the roster to add them."}
                </p>
              </div>
            </div>

            <div>
              <label className={fieldLabel}>Additional Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us more about your project requirements..."
                rows={4}
                className="w-full resize-none border-2 border-[var(--c4-black)] bg-transparent p-4 text-sm outline-none placeholder:text-[var(--c4-black)]/35 focus:border-[var(--c4-cobalt)]"
              />
            </div>

            <div>
              <label className={fieldLabel}>
                Attach Script <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`cursor-pointer border-2 border-dashed p-8 text-center transition-colors ${
                  isDragging
                    ? "border-[var(--c4-black)] bg-[var(--c4-yellow)]"
                    : "border-[var(--c4-black)]/40 hover:border-[var(--c4-black)] hover:bg-[var(--c4-yellow)]/30"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.rtf,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="mx-auto mb-3 h-5 w-5 text-[var(--c4-muted)]" />
                {file ? (
                  <p className="text-sm font-medium">{file.name}</p>
                ) : (
                  <>
                    <p className="text-sm">
                      <span className="font-medium">Click to upload</span>
                      <span className="text-[var(--c4-muted)]"> or drag & drop</span> your script
                    </p>
                    <p className="mt-2 c4-label text-[var(--c4-muted)]">
                      PDF, DOC, DOCX, RTF, or TXT · Max 10MB
                    </p>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className="w-full c4-block-black py-4 text-[11px] tracking-[0.2em] uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : submitSuccess ? "Sent!" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
