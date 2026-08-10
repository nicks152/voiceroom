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
  "Other"
]

const territories = [
  "Kenya",
  "East Africa",
  "Africa-wide",
  "Global",
  "North America",
  "Europe",
  "Asia Pacific",
  "Other"
]

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
      // Auto-check shortlist if there are favorites when modal opens
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
        // Reset form
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
          <h2 className="font-serif text-3xl lg:text-4xl mb-2">Send us a message</h2>
          <p className="text-sm text-muted-foreground mb-10">
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>

          {submitSuccess && (
            <div className="mb-6 p-4 border border-green-500/30 bg-green-500/10 text-green-600 text-sm text-center">
              Message sent successfully! We&apos;ll be in touch soon.
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-4 border border-red-500/30 bg-red-500/10 text-red-500 text-sm text-center">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name & Company */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase mb-3">
                  Name <span className="text-muted-foreground">*</span>
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
                  Company <span className="text-muted-foreground">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company name"
                  className="w-full bg-transparent border-b border-border pb-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase mb-3">
                Email Address <span className="text-muted-foreground">*</span>
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

            {/* License & Territory */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase mb-3">
                  License Usage <span className="text-muted-foreground">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center justify-between border-b border-border pb-2 text-sm text-left">
                    <span className={licenseType ? "text-foreground" : "text-muted-foreground"}>
                      {licenseType || "Select license type"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[280px] z-[200]">
                    {licenseTypes.map((type) => (
                      <DropdownMenuItem 
                        key={type} 
                        onClick={() => setLicenseType(type)}
                        className="text-sm"
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase mb-3">
                  Territory <span className="text-muted-foreground">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center justify-between border-b border-border pb-2 text-sm text-left">
                    <span className={territory ? "text-foreground" : "text-muted-foreground"}>
                      {territory || "Select territory"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[280px] z-[200]">
                    {territories.map((t) => (
                      <DropdownMenuItem 
                        key={t} 
                        onClick={() => setTerritory(t)}
                        className="text-sm"
                      >
                        {t}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Send Shortlist */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="shortlist"
                checked={includeShortlist}
                onChange={(e) => setIncludeShortlist(e.target.checked)}
                className="mt-1 w-4 h-4 border border-border bg-transparent checked:bg-foreground"
              />
              <div>
                <label htmlFor="shortlist" className="text-sm font-medium cursor-pointer">
                  Send Shortlist ({count} artist{count !== 1 ? 's' : ''})
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {count > 0 
                    ? "Check this to include your starred voice artists with your message."
                    : "No artists currently shortlisted - star artists in the roster to add them."
                  }
                </p>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase mb-3">
                Additional Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us more about your project requirements..."
                rows={4}
                className="w-full bg-transparent border border-border p-4 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase mb-3">
                Attach Script <span className="text-muted-foreground">(Optional)</span>
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
                  accept=".pdf,.doc,.docx,.rtf,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="w-6 h-6 mx-auto mb-3 text-muted-foreground" />
                {file ? (
                  <p className="text-sm">{file.name}</p>
                ) : (
                  <>
                    <p className="text-sm">
                      <span className="font-medium">Click to upload</span>
                      <span className="text-muted-foreground"> or drag & drop</span> your script
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      PDF, DOC, DOCX, RTF, or TXT (MAX. 10MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className="w-full bg-foreground text-background py-4 text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : submitSuccess ? "Sent!" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
