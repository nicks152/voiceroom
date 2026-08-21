"use client"

import { useState, useRef, useEffect } from "react"
import { X, Upload, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ApplyModalProps {
  isOpen: boolean
  onClose: () => void
}

type AnimationState = "closed" | "opening" | "open" | "closing"

const voiceTypes = [
  "Commercial",
  "Narration",
  "Character/Animation",
  "Audiobook",
  "E-Learning",
  "Documentary",
  "IVR/Telephony",
  "Promo/Trailer",
  "Other"
]

const languages = [
  "English",
  "Swahili",
  "Kikuyu",
  "Luo",
  "French",
  "Arabic",
  "Amharic",
  "Zulu",
  "Yoruba",
  "Other"
]

export function ApplyModal({ isOpen, onClose }: ApplyModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [voiceType, setVoiceType] = useState("")
  const [language, setLanguage] = useState("")
  const [experience, setExperience] = useState("")
  const [demoFile, setDemoFile] = useState<File | null>(null)
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
    } else if (!isOpen && (animationState === "open" || animationState === "opening")) {
      setAnimationState("closing")
      setTimeout(() => setAnimationState("closed"), 400)
    }
  }, [isOpen, animationState])

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
      setDemoFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setDemoFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("email", email)
      formData.append("phone", phone)
      formData.append("location", location)
      formData.append("voiceType", voiceType)
      formData.append("language", language)
      formData.append("experience", experience)
      if (demoFile) {
        formData.append("demoFile", demoFile)
      }

      const res = await fetch("/api/apply", {
        method: "POST",
        body: formData,
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
        // Reset form
        setName("")
        setEmail("")
        setPhone("")
        setLocation("")
        setVoiceType("")
        setLanguage("")
        setExperience("")
        setDemoFile(null)
        setSubmitSuccess(false)
      }, 2000)
    } catch (err) {
      console.error("Submit error:", err)
      setSubmitError("Failed to send application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isVisible = animationState === "open"

  const fieldLabel = "c4-label mb-3 block text-[var(--c4-muted)]"
  const fieldInput =
    "w-full border-b-2 border-[var(--c4-black)] bg-transparent py-2 text-sm outline-none placeholder:text-[var(--c4-black)]/35 focus:border-[var(--c4-cobalt)]"
  const fieldTrigger =
    "flex w-full items-center justify-between border-b-2 border-[var(--c4-black)] bg-transparent py-2 text-left text-sm outline-none"

  return (
    <div className="voice-room fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-[var(--c4-black)]/75 transition-opacity duration-400 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div
        className={`relative mx-4 max-h-[90vh] w-full max-w-2xl min-w-0 overflow-x-hidden overflow-y-auto border-2 border-[var(--c4-black)] bg-[var(--c4-white)] transition-all duration-400 ease-out ${
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

        <div className="p-5 pt-10 sm:p-8 sm:pt-10 lg:p-12">
          <span className="c4-sticker c4-block-yellow">Apply</span>
          <h2 className="display mt-5 pr-12 text-[clamp(1.5rem,6.5vw,1.875rem)] font-extrabold uppercase leading-[1.05] tracking-tight md:text-5xl">
            Join Our Roster
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--c4-muted)]">
            We&apos;re always looking for exceptional voice talent. Submit your details and demo
            below.
          </p>

          {submitSuccess && (
            <div className="mt-8 border-2 border-[var(--c4-black)] bg-[var(--c4-yellow)] px-4 py-3 text-center text-sm">
              Application submitted! We&apos;ll review your demo and be in touch.
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
                  Full Name <span className="text-[var(--c4-cobalt)]">*</span>
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
                  Email <span className="text-[var(--c4-cobalt)]">*</span>
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
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className={fieldLabel}>
                  Phone Number <span className="text-[var(--c4-cobalt)]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className={fieldInput}
                />
              </div>
              <div>
                <label className={fieldLabel}>
                  Location <span className="text-[var(--c4-cobalt)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className={fieldInput}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className={fieldLabel}>
                  Primary Voice Type <span className="text-[var(--c4-cobalt)]">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className={fieldTrigger}>
                    <span
                      className={
                        voiceType ? "text-[var(--c4-black)]" : "text-[var(--c4-black)]/35"
                      }
                    >
                      {voiceType || "Select voice type"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-[var(--c4-muted)]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="z-[200] w-[280px] rounded-none border-2 border-[var(--c4-black)] bg-[var(--c4-white)] p-0"
                  >
                    {voiceTypes.map((type) => (
                      <DropdownMenuItem
                        key={type}
                        onSelect={() => setVoiceType(type)}
                        className="cursor-pointer rounded-none border-b border-[var(--c4-line)] px-4 py-3 text-sm last:border-0 focus:bg-[var(--c4-yellow)] focus:text-[var(--c4-black)]"
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <label className={fieldLabel}>
                  Primary Language <span className="text-[var(--c4-cobalt)]">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className={fieldTrigger}>
                    <span
                      className={
                        language ? "text-[var(--c4-black)]" : "text-[var(--c4-black)]/35"
                      }
                    >
                      {language || "Select language"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-[var(--c4-muted)]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="z-[200] w-[280px] rounded-none border-2 border-[var(--c4-black)] bg-[var(--c4-white)] p-0"
                  >
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang}
                        onSelect={() => setLanguage(lang)}
                        className="cursor-pointer rounded-none border-b border-[var(--c4-line)] px-4 py-3 text-sm last:border-0 focus:bg-[var(--c4-yellow)] focus:text-[var(--c4-black)]"
                      >
                        {lang}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div>
              <label className={fieldLabel}>Tell Us About Your Experience</label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Share your voiceover experience, training, notable projects, and what makes your voice unique..."
                rows={4}
                className="w-full resize-none border-2 border-[var(--c4-black)] bg-transparent p-4 text-sm outline-none placeholder:text-[var(--c4-black)]/35 focus:border-[var(--c4-cobalt)]"
              />
            </div>

            <div>
              <label className={fieldLabel}>
                Upload Demo Reel <span className="text-[var(--c4-cobalt)]">*</span>
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
                  accept=".mp3,.wav,.m4a,.aac"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="mx-auto mb-3 h-5 w-5 text-[var(--c4-muted)]" />
                {demoFile ? (
                  <p className="text-sm font-medium">{demoFile.name}</p>
                ) : (
                  <>
                    <p className="text-sm">
                      <span className="font-medium">Click to upload</span>
                      <span className="text-[var(--c4-muted)]"> or drag & drop</span> your demo
                    </p>
                    <p className="mt-2 c4-label text-[var(--c4-muted)]">
                      MP3, WAV, M4A, or AAC · Max 20MB
                    </p>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || submitSuccess || !demoFile}
              className="w-full c4-block-black py-4 text-[11px] tracking-[0.2em] uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : submitSuccess ? "Submitted!" : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
