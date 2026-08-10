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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-foreground/80 backdrop-blur-sm transition-opacity duration-400 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 border border-border transition-all duration-400 ease-out ${
          isVisible 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-8"
        }`}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 lg:p-12">
          <h2 className="font-serif text-3xl lg:text-4xl mb-2">Join Our Roster</h2>
          <p className="text-sm text-muted-foreground mb-10">
            We&apos;re always looking for exceptional voice talent. Submit your details and demo below.
          </p>

          {submitSuccess && (
            <div className="mb-6 p-4 border border-green-500/30 bg-green-500/10 text-green-600 text-sm text-center">
              Application submitted! We&apos;ll review your demo and be in touch.
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-4 border border-red-500/30 bg-red-500/10 text-red-500 text-sm text-center">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name & Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase mb-3">
                  Full Name <span className="text-muted-foreground">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-transparent border-b border-border pb-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase mb-3">
                  Email <span className="text-muted-foreground">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-transparent border-b border-border pb-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Phone & Location */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase mb-3">
                  Phone Number <span className="text-muted-foreground">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full bg-transparent border-b border-border pb-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase mb-3">
                  Location <span className="text-muted-foreground">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className="w-full bg-transparent border-b border-border pb-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Voice Type & Language */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase mb-3">
                  Primary Voice Type <span className="text-muted-foreground">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center justify-between border-b border-border pb-2 text-sm text-left">
                    <span className={voiceType ? "text-foreground" : "text-muted-foreground"}>
                      {voiceType || "Select voice type"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[280px] z-[200]">
                    {voiceTypes.map((type) => (
                      <DropdownMenuItem 
                        key={type} 
                        onSelect={() => setVoiceType(type)}
                        className="text-sm cursor-pointer"
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase mb-3">
                  Primary Language <span className="text-muted-foreground">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center justify-between border-b border-border pb-2 text-sm text-left">
                    <span className={language ? "text-foreground" : "text-muted-foreground"}>
                      {language || "Select language"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[280px] z-[200]">
                    {languages.map((lang) => (
                      <DropdownMenuItem 
                        key={lang} 
                        onSelect={() => setLanguage(lang)}
                        className="text-sm cursor-pointer"
                      >
                        {lang}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase mb-3">
                Tell Us About Your Experience
              </label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Share your voiceover experience, training, notable projects, and what makes your voice unique..."
                rows={4}
                className="w-full bg-transparent border border-border p-4 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground resize-none"
              />
            </div>

            {/* Demo Upload */}
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase mb-3">
                Upload Demo Reel <span className="text-muted-foreground">*</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border border-dashed p-8 text-center cursor-pointer transition-colors ${
                  isDragging 
                    ? "border-foreground bg-muted/20" 
                    : "border-border hover:border-foreground"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mp3,.wav,.m4a,.aac"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="w-6 h-6 mx-auto mb-3 text-muted-foreground" />
                {demoFile ? (
                  <p className="text-sm">{demoFile.name}</p>
                ) : (
                  <>
                    <p className="text-sm">
                      <span className="font-medium">Click to upload</span>
                      <span className="text-muted-foreground"> or drag & drop</span> your demo
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      MP3, WAV, M4A, or AAC (MAX. 20MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || submitSuccess || !demoFile}
              className="w-full bg-foreground text-background py-4 text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : submitSuccess ? "Submitted!" : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
