"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { LogOut, Users, LayoutDashboard, UserCog, Pencil, Trash2, Play, Square, Upload, Check, X, Plus, Search, ChevronDown, Loader2, Star, Key, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { uploadAudioFile, getAudioDurationSec } from "@/lib/upload-audio"

// Sample type - matches Supabase schema
interface SampleDB {
  id: string
  title: string
  file_url: string
  duration_sec: number | null
  published: boolean
}

// Database talent type - matches Supabase schema
interface TalentDB {
  id: string
  name: string
  pseudonym: string | null
  photo_url: string | null
  bio: string | null
  description: string | null
  gender: "MALE" | "FEMALE"
  age_band: string
  languages: string[]
  tags: string[]
  featured: boolean
  email: string | null
  phone: string | null
  created_at: string
  updated_at: string
  samples?: SampleDB[]
}

// Predefined styles - matches your existing tags
const AVAILABLE_STYLES = [
  "authoritative", "warm", "documentary", "urban", 
  "announcer", "reporter", "movie", "commercial"
]

// Age range options - matches your database
const AGE_OPTIONS = ["CHILD", "TEEN", "18-25", "25-35", "35-45", "50+"]

// Voice options
const VOICE_OPTIONS = ["MALE", "FEMALE"]

// Language options - matches your database
const LANGUAGE_OPTIONS = ["English", "Swahili", "French", "Kikuyu", "Luo"]

// Chart colors
const COLORS = ["#e8ff00", "#fafaf8", "#a3a39c", "#5c5c58", "#0047ff", "#0a0a0a"]
const LANGUAGE_COLORS = ["#10b981", "#8b5cf6", "#f97316", "#06b6d4", "#ec4899", "#84cc16", "#6366f1", "#14b8a6"]
const AGE_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#f97316"]

// Profile type - matches Supabase profiles table
interface ProfileDB {
  id: string
  name: string | null
  username: string | null
  role: string | null
  created_at: string
  updated_at: string
}

type Tab = "dashboard" | "talent" | "admins"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [talents, setTalents] = useState<TalentDB[]>([])
  const [profiles, setProfiles] = useState<ProfileDB[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<TalentDB | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newTalentData, setNewTalentData] = useState<Partial<TalentDB> | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showStyleDropdown, setShowStyleDropdown] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedVoices, setSelectedVoices] = useState<string[]>([])
  const [selectedAges, setSelectedAges] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  
  // Password edit state
  const [passwordEditUserId, setPasswordEditUserId] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  
  // Audio sample replacement state
  const [replacingSampleTalentId, setReplacingSampleTalentId] = useState<string | null>(null)
  const [isUploadingSample, setIsUploadingSample] = useState(false)
  const sampleInputRef = useRef<HTMLInputElement>(null)
  
  // Add admin state
  const [isAddingAdmin, setIsAddingAdmin] = useState(false)
  const [newAdminData, setNewAdminData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "admin"
  })
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false)
  const [adminError, setAdminError] = useState<string | null>(null)
  
  // Edit admin state
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null)
  const [editAdminData, setEditAdminData] = useState({
    name: "",
    username: "",
    role: ""
  })
  const [isUpdatingAdmin, setIsUpdatingAdmin] = useState(false)
  
  // Delete admin state
  const [deletingAdmin, setDeletingAdmin] = useState<{id: string, name: string} | null>(null)
  const [isDeletingAdmin, setIsDeletingAdmin] = useState(false)
  
  // Current user state
  const [currentUserName, setCurrentUserName] = useState<string>("")
  const [currentUserRole, setCurrentUserRole] = useState<string>("")
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Fetch current user's profile
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const { createBrowserClient } = await import("@supabase/ssr")
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name, username, role")
            .eq("user_id", user.id)
            .single()
          if (profile?.name || profile?.username) {
            setCurrentUserName(profile.name || profile.username || "")
          }
          if (profile?.role) {
            setCurrentUserRole(profile.role)
          }
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err)
      }
    }
    fetchCurrentUser()
  }, [])

  // Fetch talent and profiles data from API
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const [talentRes, profilesRes] = await Promise.all([
          fetch("/api/talent"),
          fetch("/api/profiles")
        ])
        const talentData = await talentRes.json()
        const profilesData = await profilesRes.json()
        
        if (talentData.error) {
          setError(talentData.error)
        } else {
          setTalents(talentData.talent || [])
        }
        
        if (!profilesData.error) {
          setProfiles(profilesData.profiles || [])
        }
      } catch (err) {
        setError("Failed to fetch data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate stats from fetched data
  const languageCounts = talents.reduce((acc, talent) => {
    (talent.languages || []).forEach((lang) => {
      acc[lang] = (acc[lang] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const ageRangeCounts = talents.reduce((acc, talent) => {
    acc[talent.age_band] = (acc[talent.age_band] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const genderCounts = talents.reduce((acc, talent) => {
    const gender = talent.gender === "MALE" ? "Male" : "Female"
    acc[gender] = (acc[gender] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const languageChartData = Object.entries(languageCounts).map(([name, value]) => ({ name, value }))
  const ageRangeChartData = Object.entries(ageRangeCounts).map(([name, value]) => ({ name, value }))
  const genderChartData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }))

  const handleEditClick = (talent: TalentDB) => {
    setEditingId(talent.id)
    setEditData({ ...talent })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData(null)
  }

  const handleSaveEdit = async () => {
    if (!editData) return
    setIsSaving(true)
    try {
      const res = await fetch("/api/talent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      })
      const data = await res.json()
      if (data.error) {
        alert("Failed to save: " + data.error)
      } else {
        setTalents(prev => prev.map(t => t.id === editData.id ? data.talent : t))
      }
    } catch (err) {
      alert("Failed to save changes")
      console.error(err)
    } finally {
      setIsSaving(false)
      setEditingId(null)
      setEditData(null)
    }
  }

  const handleAddNewClick = () => {
    setIsAddingNew(true)
    setNewTalentData({
      name: "",
      pseudonym: "",
      gender: "FEMALE",
      age_band: "25-35",
      languages: [],
      tags: [],
      phone: "",
      email: "",
      bio: "",
      featured: false,
    })
  }

  const handleCancelNew = () => {
    setIsAddingNew(false)
    setNewTalentData(null)
  }

  const handleSaveNew = async () => {
    if (!newTalentData) return
    setIsSaving(true)
    try {
      const res = await fetch("/api/talent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTalentData),
      })
      const data = await res.json()
      if (data.error) {
        alert("Failed to add talent: " + data.error)
      } else {
        setTalents(prev => [data.talent, ...prev])
      }
    } catch (err) {
      alert("Failed to add talent")
      console.error(err)
    } finally {
      setIsSaving(false)
      setIsAddingNew(false)
      setNewTalentData(null)
    }
  }

  const handleToggleFeatured = async (talent: TalentDB) => {
    try {
      const res = await fetch("/api/talent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...talent, featured: !talent.featured }),
      })
      const data = await res.json()
      if (data.error) {
        alert("Failed to update: " + data.error)
      } else {
        setTalents(prev => prev.map(t => t.id === talent.id ? data.talent : t))
      }
    } catch (err) {
      alert("Failed to update featured status")
      console.error(err)
    }
  }

  const handleDeleteTalent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this talent?")) return
    try {
      const res = await fetch(`/api/talent?id=${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.error) {
        alert("Failed to delete: " + data.error)
      } else {
        setTalents(prev => prev.filter(t => t.id !== id))
      }
    } catch (err) {
      alert("Failed to delete talent")
      console.error(err)
    }
  }

  const handleUpdatePassword = async () => {
    if (!passwordEditUserId || !newPassword) return
    
    setIsUpdatingPassword(true)
    setPasswordError(null)
    try {
      const res = await fetch("/api/profiles/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: passwordEditUserId, newPassword }),
      })
      const data = await res.json()
      if (data.error) {
        setPasswordError(data.error)
      } else {
        setPasswordSuccess(true)
        setTimeout(() => {
          setPasswordEditUserId(null)
          setNewPassword("")
          setPasswordSuccess(false)
        }, 1500)
      }
    } catch (err) {
      setPasswordError("Failed to update password")
      console.error(err)
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleDownloadAudio = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error("Download failed:", err)
      // Fallback to opening in new tab
      window.open(url, "_blank")
    }
  }

  const handleReplaceSample = async (e: React.ChangeEvent<HTMLInputElement>, talentId: string, sampleId: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploadingSample(true)
    try {
      // Direct-to-storage upload (signed URL) — avoids Vercel 4.5MB body limit
      const uploadData = await uploadAudioFile(file, talentId)
      const durationSec = await getAudioDurationSec(file)
      
      // Update the sample record with new file URL
      const updateRes = await fetch("/api/samples", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sampleId,
          file_url: uploadData.url,
          title: file.name,
          duration_sec: durationSec,
        }),
      })
      const updateData = await updateRes.json()
      
      if (updateData.error) {
        alert("Failed to update sample: " + updateData.error)
        return
      }
      
      // Refresh talent list to get updated sample data
      const talentRes = await fetch("/api/talent")
      const talentData = await talentRes.json()
      if (!talentData.error) {
        setTalents(talentData.talent || [])
      }
      
      setReplacingSampleTalentId(null)
    } catch (err) {
      console.error(err)
      alert(
        "Failed to replace audio sample: " +
          (err instanceof Error ? err.message : "unknown error")
      )
    } finally {
      setIsUploadingSample(false)
      if (sampleInputRef.current) {
        sampleInputRef.current.value = ""
      }
    }
  }

  const handleEditAdmin = async () => {
    if (!editingAdminId) return
    
    setIsUpdatingAdmin(true)
    setAdminError(null)
    
    try {
      const res = await fetch(`/api/profiles/${editingAdminId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editAdminData),
      })
      const data = await res.json()
      
      if (data.error) {
        setAdminError(data.error)
      } else {
        // Refresh profiles list
        const profilesRes = await fetch("/api/profiles")
        const profilesData = await profilesRes.json()
        if (!profilesData.error) {
          setProfiles(profilesData.profiles || [])
        }
        setEditingAdminId(null)
      }
    } catch (err) {
      setAdminError("Failed to update admin user")
      console.error(err)
    } finally {
      setIsUpdatingAdmin(false)
    }
  }

  const handleAddAdmin = async () => {
    if (!newAdminData.email || !newAdminData.password || !newAdminData.name) {
      setAdminError("Name, email and password are required")
      return
    }
    
    setIsCreatingAdmin(true)
    setAdminError(null)
    
    try {
      const res = await fetch("/api/profiles/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdminData),
      })
      const data = await res.json()
      
      if (data.error) {
        setAdminError(data.error)
      } else {
        // Refresh profiles list
        const profilesRes = await fetch("/api/profiles")
        const profilesData = await profilesRes.json()
        if (!profilesData.error) {
          setProfiles(profilesData.profiles || [])
        }
        
        // Reset form and close modal
        setIsAddingAdmin(false)
        setNewAdminData({
          name: "",
          username: "",
          email: "",
          password: "",
          role: "admin"
        })
      }
    } catch (err) {
      setAdminError("Failed to create admin user")
      console.error(err)
    } finally {
      setIsCreatingAdmin(false)
    }
  }

  const handleNewFieldChange = (field: keyof TalentDB, value: string | string[] | boolean) => {
    if (newTalentData) {
      setNewTalentData({ ...newTalentData, [field]: value })
    }
  }

  const handleFieldChange = (field: keyof TalentDB, value: string | string[] | boolean) => {
    if (editData) {
      setEditData({ ...editData, [field]: value })
    }
  }

  const handleRemoveStyle = (styleToRemove: string) => {
    if (editData) {
      setEditData({ 
        ...editData, 
        tags: editData.tags.filter(s => s !== styleToRemove) 
      })
    }
  }

  const handleAddStyle = (styleToAdd: string) => {
    if (editData && !editData.tags.includes(styleToAdd)) {
      setEditData({ 
        ...editData, 
        tags: [...editData.tags, styleToAdd] 
      })
    }
    setShowStyleDropdown(false)
  }

  const getAvailableStyles = () => {
    if (!editData) return AVAILABLE_STYLES
    return AVAILABLE_STYLES.filter(style => !editData.tags.includes(style))
  }

  const handleAudioUpload = useCallback((file: File) => {
    if (file && file.type.startsWith("audio/")) {
      const url = URL.createObjectURL(file)
      if (editData) {
        setEditData({ ...editData, photo_url: url })
      }
    }
  }, [editData])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleAudioUpload(file)
  }, [handleAudioUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handlePlayAudio = (sampleId: string, audioUrl: string) => {
    if (playingId === sampleId) {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setPlayingId(null)
      setCurrentTime(0)
    } else {
      // Start playing new audio
      if (!audioUrl) return
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(audioUrl)
      audioRef.current.play().catch(() => {
        // Handle play failure silently
        setPlayingId(null)
      })
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
        }
      }
      audioRef.current.onended = () => {
        setPlayingId(null)
        setCurrentTime(0)
      }
      setPlayingId(sampleId)
      setCurrentTime(0)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Filter helpers
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

  // Filter talent data
  const filteredTalent = talents.filter((talent) => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        (talent.name || "").toLowerCase().includes(query) ||
        (talent.pseudonym || "").toLowerCase().includes(query)
      if (!matchesSearch) return false
    }
    
    // Voice/Sex filter
    if (selectedVoices.length > 0 && !selectedVoices.includes(talent.gender)) {
      return false
    }
    
    // Age filter
    if (selectedAges.length > 0 && !selectedAges.includes(talent.age_band)) {
      return false
    }
    
    // Language filter
    if (selectedLanguages.length > 0) {
      const hasLanguage = (talent.languages || []).some(lang => selectedLanguages.includes(lang))
      if (!hasLanguage) return false
    }
    
    // Style filter
    if (selectedStyles.length > 0) {
      const hasStyle = (talent.tags || []).some(tag => selectedStyles.includes(tag))
      if (!hasStyle) return false
    }
    
    return true
  }).sort((a, b) => (a.name || "").localeCompare(b.name || ""))

  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
    { id: "talent" as Tab, label: "Talent", icon: Users },
    // Only show Admin Users tab for admins
    ...(currentUserRole === "admin" ? [{ id: "admins" as Tab, label: "Admin Users", icon: UserCog }] : []),
  ]

  return (
    <main className="min-h-screen bg-[var(--c4-black)]">
      {/* Header */}
      <header className="border-b-2 border-white/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <Link
            href="/"
            className="display text-xl font-extrabold uppercase tracking-tight text-white"
          >
            Voice Room
          </Link>
          <div className="flex items-center gap-6">
            <span className="c4-label text-white/50">{currentUserName || "Admin"}</span>
            <button 
              onClick={async () => {
                const { createBrowserClient } = await import("@supabase/ssr")
                const supabase = createBrowserClient(
                  process.env.NEXT_PUBLIC_SUPABASE_URL!,
                  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                )
                await supabase.auth.signOut()
                window.location.href = "/auth"
              }}
              className="text-white/50 transition-colors hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="display text-3xl font-extrabold uppercase tracking-tight text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-white/55">Manage talent, users, and site content</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-1 border-b-2 border-white/15">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`-mb-[2px] flex items-center gap-2 border-b-2 px-6 py-3 text-xs tracking-[0.15em] uppercase transition-colors ${
                  activeTab === tab.id
                    ? "border-[var(--c4-yellow)] text-white"
                    : "border-transparent text-white/45 hover:text-white/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="border-2 border-white/15 p-6">
                <p className="c4-label mb-2 text-white/50">Total Talent</p>
                <p className="display text-4xl font-extrabold uppercase text-white">{talents.length}</p>
              </div>
              <div className="border-2 border-white/15 p-6">
                <p className="c4-label mb-2 text-white/50">Dashboard Users</p>
                <p className="display text-4xl font-extrabold uppercase text-white">{profiles.length}</p>
              </div>
              <div className="border-2 border-white/15 p-6">
                <p className="c4-label mb-2 text-white/50">Inquiries</p>
                <p className="display text-4xl font-extrabold uppercase text-white">0</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Talent by Sex */}
              <div className="border-2 border-white/15 p-6">
                <h2 className="display mb-6 text-xl font-extrabold uppercase text-white">Talent by Sex</h2>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {genderChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === "Male" ? "#60a5fa" : "#f472b6"} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1c1917", 
                          border: "1px solid rgba(245,245,244,0.2)",
                          color: "#f5f5f4"
                        }}
                      />
                      <Legend 
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle"
                        formatter={(value) => {
                          const item = genderChartData.find(d => d.name === value)
                          return <span style={{ color: "#f5f5f4", fontSize: "11px" }}>{value}: {item?.value || 0}</span>
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Talent by Language */}
              <div className="border-2 border-white/15 p-6">
                <h2 className="display mb-6 text-xl font-extrabold uppercase text-white">Talent by Language</h2>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={languageChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {languageChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={LANGUAGE_COLORS[index % LANGUAGE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1c1917", 
                          border: "1px solid rgba(245,245,244,0.2)",
                          color: "#f5f5f4"
                        }}
                      />
                      <Legend 
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle"
                        formatter={(value, entry) => {
                          const item = languageChartData.find(d => d.name === value)
                          return <span style={{ color: "#f5f5f4", fontSize: "11px" }}>{value}: {item?.value || 0}</span>
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Talent by Age Range */}
              <div className="border-2 border-white/15 p-6">
                <h2 className="display mb-6 text-xl font-extrabold uppercase text-white">Talent by Age Range</h2>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ageRangeChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {ageRangeChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1c1917", 
                          border: "1px solid rgba(245,245,244,0.2)",
                          color: "#f5f5f4"
                        }}
                      />
                      <Legend 
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle"
                        formatter={(value, entry) => {
                          const item = ageRangeChartData.find(d => d.name === value)
                          return <span style={{ color: "#f5f5f4", fontSize: "11px" }}>{value}: {item?.value || 0}</span>
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "talent" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-background/40" />
                <input 
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-background/30 pl-7 pb-2 text-sm text-background focus:outline-none focus:border-background transition-colors placeholder:text-background/40"
                />
              </div>

              {/* Dropdowns */}
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 text-[10px] tracking-[0.1em] uppercase text-background/60 hover:text-background transition-colors">
                    {getDisplayText(selectedVoices, "All Voices")}
                    <ChevronDown className="w-3 h-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[140px]">
                    {VOICE_OPTIONS.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option}
                        checked={selectedVoices.includes(option)}
                        onCheckedChange={() => toggleFilter(option, selectedVoices, setSelectedVoices)}
                        className="text-xs"
                      >
                        {option}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 text-[10px] tracking-[0.1em] uppercase text-background/60 hover:text-background transition-colors">
                    {getDisplayText(selectedAges, "All Ages")}
                    <ChevronDown className="w-3 h-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[140px]">
                    {AGE_OPTIONS.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option}
                        checked={selectedAges.includes(option)}
                        onCheckedChange={() => toggleFilter(option, selectedAges, setSelectedAges)}
                        className="text-xs"
                      >
                        {option}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 text-[10px] tracking-[0.1em] uppercase text-background/60 hover:text-background transition-colors">
                    {getDisplayText(selectedLanguages, "All Languages")}
                    <ChevronDown className="w-3 h-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[160px]">
                    {LANGUAGE_OPTIONS.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option}
                        checked={selectedLanguages.includes(option)}
                        onCheckedChange={() => toggleFilter(option, selectedLanguages, setSelectedLanguages)}
                        className="text-xs"
                      >
                        {option}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 text-[10px] tracking-[0.1em] uppercase text-background/60 hover:text-background transition-colors">
                    {getDisplayText(selectedStyles, "All Styles")}
                    <ChevronDown className="w-3 h-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[160px]">
                    {AVAILABLE_STYLES.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option}
                        checked={selectedStyles.includes(option)}
                        onCheckedChange={() => toggleFilter(option, selectedStyles, setSelectedStyles)}
                        className="text-xs"
                      >
                        {option}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Add Talent Button - hidden for viewers */}
              {currentUserRole !== "viewer" && (
                <button 
                  onClick={handleAddNewClick}
                  disabled={isAddingNew}
                  className="ml-auto text-[10px] tracking-[0.15em] uppercase border border-background px-4 py-2 text-background hover:bg-background hover:text-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Talent
                </button>
              )}
            </div>

            {/* Results count */}
            <p className="text-xs text-background/50">
              Showing {filteredTalent.length} of {talents.length} talent profiles
            </p>

            {/* Loading / Error states */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-background/60" />
                <span className="ml-2 text-sm text-background/60">Loading talent...</span>
              </div>
            )}

            {error && (
              <div className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                Error: {error}
              </div>
            )}

            {/* Table */}
            {!isLoading && !error && (
            <div className="border border-background/20 overflow-hidden">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-background/20 bg-background/5">
                    <th className="text-left px-2 py-2 text-[10px] tracking-[0.1em] uppercase text-background/60 font-normal w-[8%]">Name</th>
                    <th className="text-left px-2 py-2 text-[10px] tracking-[0.1em] uppercase text-background/60 font-normal w-[7%]">Pseudonym</th>
                    <th className="text-left px-2 py-2 text-[10px] tracking-[0.1em] uppercase text-background/60 font-normal w-[4%]">Gender</th>
                    <th className="text-left px-2 py-2 text-[10px] tracking-[0.1em] uppercase text-background/60 font-normal w-[4%]">Age</th>
                    <th className="text-left px-2 py-2 text-[10px] tracking-[0.1em] uppercase text-background/60 font-normal w-[14%]">Tags</th>
                    <th className="text-left px-2 py-2 text-[10px] tracking-[0.1em] uppercase text-background/60 font-normal w-[15%]">Description</th>
                    <th className="text-left px-2 py-2 text-[10px] tracking-[0.1em] uppercase text-background/60 font-normal w-[9%]">Phone</th>
                    <th className="text-left px-2 py-2 text-[10px] tracking-[0.1em] uppercase text-background/60 font-normal w-[12%]">Email</th>
                    <th className="text-left px-2 py-2 text-[10px] tracking-[0.1em] uppercase text-background/60 font-normal w-[8%]">Languages</th>
                    <th className="text-center px-2 py-2 text-[10px] tracking-[0.1em] uppercase text-background/60 font-normal w-[10%]">Samples</th>
                    <th className="text-center px-2 py-2 text-[10px] tracking-[0.1em] uppercase text-background/60 font-normal w-[7%]">Actions</th>
                  </tr>
                </thead>
                  <tbody>
                  {/* New Talent Row */}
                  {isAddingNew && newTalentData && (
                    <tr className="border-b border-background/10 bg-background/10">
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={newTalentData.name || ""}
                          onChange={(e) => handleNewFieldChange("name", e.target.value)}
                          className="w-full px-1 py-0.5 bg-background/10 border border-background/30 text-xs text-background focus:outline-none focus:border-background/60"
                          placeholder="Full name"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={newTalentData.pseudonym || ""}
                          onChange={(e) => handleNewFieldChange("pseudonym", e.target.value)}
                          className="w-full px-1 py-0.5 bg-background/10 border border-background/30 text-xs text-background font-medium focus:outline-none focus:border-background/60"
                          placeholder="Stage name"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <select
                          value={newTalentData.gender || "FEMALE"}
                          onChange={(e) => handleNewFieldChange("gender", e.target.value)}
                          className="w-full px-1 py-0.5 bg-background/10 border border-background/30 text-xs text-background focus:outline-none focus:border-background/60"
                        >
                          <option value="MALE">M</option>
                          <option value="FEMALE">F</option>
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <select
                          value={newTalentData.age_band || "25-35"}
                          onChange={(e) => handleNewFieldChange("age_band", e.target.value)}
                          className="w-full px-1 py-0.5 bg-background/10 border border-background/30 text-xs text-background focus:outline-none focus:border-background/60"
                        >
                          {AGE_OPTIONS.map((age) => (
                            <option key={age} value={age}>{age}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex flex-wrap gap-0.5 items-center">
                          {(newTalentData.tags || []).map((tag) => (
                            <span key={tag} className="text-[9px] tracking-[0.05em] uppercase px-1 py-0.5 border border-background/30 text-background/70 flex items-center gap-0.5">
                              {tag}
                              <button 
                                onClick={() => handleNewFieldChange("tags", (newTalentData.tags || []).filter(s => s !== tag))}
                                className="hover:text-red-400 transition-colors"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))}
                          <DropdownMenu>
                            <DropdownMenuTrigger className="w-5 h-5 flex items-center justify-center border border-dashed border-background/30 text-background/50 hover:text-background hover:border-background transition-colors">
                              <Plus className="w-2.5 h-2.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[140px]">
                              {AVAILABLE_STYLES.filter(s => !(newTalentData.tags || []).includes(s)).map((tag) => (
                                <DropdownMenuCheckboxItem
                                  key={tag}
                                  checked={false}
                                  onCheckedChange={() => handleNewFieldChange("tags", [...(newTalentData.tags || []), tag])}
                                  className="text-xs"
                                >
                                  {tag}
                                </DropdownMenuCheckboxItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={newTalentData.description || ""}
                          onChange={(e) => handleNewFieldChange("description", e.target.value)}
                          className="w-full px-1 py-0.5 bg-background/10 border border-background/30 text-xs text-background focus:outline-none focus:border-background/60"
                          placeholder="e.g. Award-winning narrator"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={newTalentData.phone || ""}
                          onChange={(e) => handleNewFieldChange("phone", e.target.value)}
                          className="w-full px-1 py-0.5 bg-background/10 border border-background/30 text-xs text-background focus:outline-none focus:border-background/60"
                          placeholder="+254..."
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="email"
                          value={newTalentData.email || ""}
                          onChange={(e) => handleNewFieldChange("email", e.target.value)}
                          className="w-full px-1 py-0.5 bg-background/10 border border-background/30 text-xs text-background focus:outline-none focus:border-background/60"
                          placeholder="email@example.com"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex flex-wrap gap-0.5 items-center">
                          {(newTalentData.languages || []).map((lang) => (
                            <span key={lang} className="text-[9px] px-1 py-0.5 border border-background/30 text-background/70 flex items-center gap-0.5">
                              {lang}
                              <button 
                                onClick={() => handleNewFieldChange("languages", (newTalentData.languages || []).filter(l => l !== lang))}
                                className="hover:text-red-400 transition-colors"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))}
                          <DropdownMenu>
                            <DropdownMenuTrigger className="w-5 h-5 flex items-center justify-center border border-dashed border-background/30 text-background/50 hover:text-background hover:border-background transition-colors">
                              <Plus className="w-2.5 h-2.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[120px]">
                              {LANGUAGE_OPTIONS.filter(l => !(newTalentData.languages || []).includes(l)).map((lang) => (
                                <DropdownMenuCheckboxItem
                                  key={lang}
                                  checked={false}
                                  onCheckedChange={() => handleNewFieldChange("languages", [...(newTalentData.languages || []), lang])}
                                  className="text-xs"
                                >
                                  {lang}
                                </DropdownMenuCheckboxItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span className="text-[9px] text-background/40">Save first</span>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => handleNewFieldChange("featured", !newTalentData.featured)}
                            className={`w-6 h-6 flex items-center justify-center border transition-colors ${
                              newTalentData.featured 
                                ? "border-yellow-500/50 text-yellow-400" 
                                : "border-background/30 text-background/40 hover:text-background/60 hover:border-background/50"
                            }`}
                          >
                            <Star className={`w-3 h-3 ${newTalentData.featured ? "fill-yellow-400" : ""}`} />
                          </button>
                          <button 
                            onClick={handleSaveNew}
                            disabled={isSaving}
                            className="w-6 h-6 flex items-center justify-center border border-green-500/50 text-green-400 hover:text-green-300 hover:border-green-400 transition-colors disabled:opacity-50"
                          >
                            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                          </button>
                          <button 
                            onClick={handleCancelNew}
                            disabled={isSaving}
                            className="w-6 h-6 flex items-center justify-center border border-background/30 text-background/60 hover:text-background hover:border-background transition-colors disabled:opacity-50"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {filteredTalent.map((talent) => {
                    const isEditing = editingId === talent.id
                    const data = isEditing && editData ? editData : talent
                    
                    return (
                      <tr key={talent.id} className={`border-b border-background/10 transition-colors ${isEditing ? "bg-background/10" : "hover:bg-background/5"}`}>
                        <td className="px-2 py-2">
                          {isEditing ? (
                            <input
                              type="text"
                              value={data.name || ""}
                              onChange={(e) => handleFieldChange("name", e.target.value)}
                              className="w-full px-1 py-0.5 bg-background/10 border border-background/30 text-xs text-background focus:outline-none focus:border-background/60"
                              placeholder="Full name"
                            />
                          ) : (
                            <span className="text-xs text-background">{data.name}</span>
                          )}
                        </td>
                        <td className="px-2 py-2">
                          {isEditing ? (
                            <input
                              type="text"
                              value={data.pseudonym || ""}
                              onChange={(e) => handleFieldChange("pseudonym", e.target.value)}
                              className="w-full px-1 py-0.5 bg-background/10 border border-background/30 text-xs text-background font-medium focus:outline-none focus:border-background/60"
                            />
                          ) : (
                            <span className="text-xs text-background font-medium">{data.pseudonym || "-"}</span>
                          )}
                        </td>
                        <td className="px-2 py-2">
                          {isEditing ? (
                            <select
                              value={data.gender}
                              onChange={(e) => handleFieldChange("gender", e.target.value)}
                              className="w-full px-1 py-0.5 bg-background/10 border border-background/30 text-xs text-background focus:outline-none focus:border-background/60"
                            >
                              <option value="MALE">M</option>
                              <option value="FEMALE">F</option>
                            </select>
                          ) : (
                            <span className="text-xs text-background/70">{data.gender === "MALE" ? "M" : "F"}</span>
                          )}
                        </td>
                        <td className="px-2 py-2">
                          {isEditing ? (
                            <select
                              value={data.age_band}
                              onChange={(e) => handleFieldChange("age_band", e.target.value)}
                              className="w-full px-1 py-0.5 bg-background/10 border border-background/30 text-xs text-background focus:outline-none focus:border-background/60"
                            >
                              {AGE_OPTIONS.map((age) => (
                                <option key={age} value={age}>{age}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-xs text-background/70">{data.age_band}</span>
                          )}
                        </td>
                        <td className="px-2 py-2">
                          {isEditing ? (
                            <div className="flex flex-wrap gap-0.5 items-center">
                              {(data.tags || []).map((tag) => (
                                <span key={tag} className="text-[9px] tracking-[0.05em] uppercase px-1 py-0.5 border border-background/30 text-background/70 flex items-center gap-0.5">
                                  {tag}
                                  <button 
                                    onClick={() => handleRemoveStyle(tag)}
                                    className="hover:text-red-400 transition-colors"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              ))}
                              <DropdownMenu>
                                <DropdownMenuTrigger className="w-5 h-5 flex items-center justify-center border border-dashed border-background/30 text-background/50 hover:text-background hover:border-background transition-colors">
                                  <Plus className="w-2.5 h-2.5" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-[140px]">
                                  {getAvailableStyles().map((tag) => (
                                    <DropdownMenuCheckboxItem
                                      key={tag}
                                      checked={false}
                                      onCheckedChange={() => handleAddStyle(tag)}
                                      className="text-xs"
                                    >
                                      {tag}
                                    </DropdownMenuCheckboxItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          ) : (
                          <div className="flex flex-wrap gap-0.5">
                            {(data.tags || []).map((tag) => (
                              <span key={tag} className="text-[9px] tracking-[0.05em] uppercase px-1 py-0.5 border border-background/30 text-background/70">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-2 align-middle">
                        {isEditing ? (
                          <textarea
                            value={data.description || ""}
                            onChange={(e) => handleFieldChange("description", e.target.value)}
                            className="w-full px-1 py-0.5 bg-background/10 border border-background/30 text-xs text-background focus:outline-none focus:border-background/60 resize-none"
                            placeholder="e.g. Award-winning narrator"
                            rows={3}
                          />
                        ) : (
                          <span className="text-xs text-background/70 line-clamp-3 block">{data.description || "-"}</span>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={data.phone || ""}
                            onChange={(e) => handleFieldChange("phone", e.target.value)}
                            className="w-full px-1 py-0.5 bg-background/10 border border-background/30 text-xs text-background focus:outline-none focus:border-background/60"
                          />
                        ) : (
                          <span className="text-xs text-background/70">{data.phone || "-"}</span>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        {isEditing ? (
                          <input
                            type="email"
                            value={data.email || ""}
                            onChange={(e) => handleFieldChange("email", e.target.value)}
                            className="w-full px-1 py-0.5 bg-background/10 border border-background/30 text-xs text-background focus:outline-none focus:border-background/60"
                          />
                        ) : (
                          <span className="text-xs text-background/70 break-all">{data.email || "-"}</span>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        {isEditing ? (
                          <div className="flex flex-wrap gap-0.5 items-center">
                            {(data.languages || []).map((lang) => (
                              <span key={lang} className="text-[9px] px-1 py-0.5 border border-background/30 text-background/70 flex items-center gap-0.5">
                                {lang}
                                <button 
                                  onClick={() => handleFieldChange("languages", (data.languages || []).filter(l => l !== lang))}
                                  className="hover:text-red-400 transition-colors"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            ))}
                            <DropdownMenu>
                              <DropdownMenuTrigger className="w-5 h-5 flex items-center justify-center border border-dashed border-background/30 text-background/50 hover:text-background hover:border-background transition-colors">
                                <Plus className="w-2.5 h-2.5" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-[120px]">
                                {LANGUAGE_OPTIONS.filter(l => !(data.languages || []).includes(l)).map((lang) => (
                                  <DropdownMenuCheckboxItem
                                    key={lang}
                                    checked={false}
                                    onCheckedChange={() => handleFieldChange("languages", [...(data.languages || []), lang])}
                                    className="text-xs"
                                  >
                                    {lang}
                                  </DropdownMenuCheckboxItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ) : (
                          <span className="text-xs text-background/70">{(data.languages || []).join(", ") || "-"}</span>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        {(talent.samples && talent.samples.length > 0) ? (
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => {
                                const sample = talent.samples![0]
                                handlePlayAudio(sample.id, sample.file_url)
                              }}
                              className={`w-6 h-6 flex-shrink-0 flex items-center justify-center border transition-colors ${
                                playingId === talent.samples[0].id 
                                  ? "border-background bg-background text-foreground" 
                                  : "border-background/30 text-background/60 hover:text-background hover:border-background"
                              }`}
                            >
                              {playingId === talent.samples[0].id ? (
                                <Square className="w-2.5 h-2.5" />
                              ) : (
                                <Play className="w-2.5 h-2.5 ml-0.5" />
                              )}
                            </button>
                            <button 
                              onClick={() => handleDownloadAudio(talent.samples![0].file_url, `${talent.name || talent.id}-sample.mp3`)}
                              className="w-6 h-6 flex-shrink-0 flex items-center justify-center border border-background/30 text-background/60 hover:text-background hover:border-background transition-colors"
                              title="Download audio"
                            >
                              <Download className="w-2.5 h-2.5" />
                            </button>
                            {isEditing && (
                              <>
                                <input
                                  type="file"
                                  accept="audio/*"
                                  ref={replacingSampleTalentId === talent.id ? sampleInputRef : undefined}
                                  onChange={(e) => handleReplaceSample(e, talent.id, talent.samples![0].id)}
                                  className="hidden"
                                  id={`replace-sample-${talent.id}`}
                                />
                                <label
                                  htmlFor={`replace-sample-${talent.id}`}
                                  className={`w-6 h-6 flex-shrink-0 flex items-center justify-center border border-background/30 text-background/60 hover:text-background hover:border-background transition-colors cursor-pointer ${isUploadingSample && replacingSampleTalentId === talent.id ? "opacity-50 pointer-events-none" : ""}`}
                                  title="Replace audio"
                                  onClick={() => setReplacingSampleTalentId(talent.id)}
                                >
                                  {isUploadingSample && replacingSampleTalentId === talent.id ? (
                                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                  ) : (
                                    <Upload className="w-2.5 h-2.5" />
                                  )}
                                </label>
                              </>
                            )}
                            <span className={`text-[9px] tabular-nums ${playingId === talent.samples[0].id ? "text-background/60" : "text-background/40"}`}>
                              {playingId === talent.samples[0].id ? formatTime(currentTime) : formatTime(talent.samples[0].duration_sec || 0)}
                            </span>
                            {talent.samples.length > 1 && (
                              <span className="text-[9px] text-background/40 ml-1">+{talent.samples.length - 1}</span>
                            )}
                          </div>
                        ) : isEditing ? (
                          <>
                            <input
                              type="file"
                              accept="audio/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                setIsUploadingSample(true)
                                setReplacingSampleTalentId(talent.id)
                                uploadAudioFile(file, talent.id)
                                  .then(async (uploadData) => {
                                    const durationSec = await getAudioDurationSec(file)
                                    return fetch("/api/samples", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        talent_id: talent.id,
                                        file_url: uploadData.url,
                                        title: file.name,
                                        duration_sec: durationSec,
                                        age_band: talent.age_band,
                                        gender: talent.gender,
                                        languages: talent.languages || [],
                                      }),
                                    })
                                  })
                                  .then(async (res) => {
                                    const data = await res.json()
                                    if (!res.ok || data.error) {
                                      throw new Error(data.error || "Failed to save sample record")
                                    }
                                    return fetch("/api/talent")
                                  })
                                  .then((res) => res.json())
                                  .then((talentData) => {
                                    if (!talentData.error) setTalents(talentData.talent || [])
                                  })
                                  .catch((err) => {
                                    console.error(err)
                                    alert(
                                      "Failed to add audio sample: " +
                                        (err instanceof Error ? err.message : "unknown error")
                                    )
                                  })
                                  .finally(() => {
                                    setIsUploadingSample(false)
                                    setReplacingSampleTalentId(null)
                                  })
                              }}
                              className="hidden"
                              id={`add-sample-${talent.id}`}
                            />
                            <label
                              htmlFor={`add-sample-${talent.id}`}
                              className={`flex items-center gap-1 text-[9px] text-background/50 hover:text-background cursor-pointer ${isUploadingSample && replacingSampleTalentId === talent.id ? "opacity-50 pointer-events-none" : ""}`}
                            >
                              {isUploadingSample && replacingSampleTalentId === talent.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Upload className="w-3 h-3" />
                              )}
                              Add audio
                            </label>
                          </>
                        ) : (
                          <span className="text-[9px] text-background/40">-</span>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center justify-center gap-1">
                          {isEditing ? (
                            <>
                              <button 
                                onClick={() => handleFieldChange("featured", !data.featured)}
                                className={`w-6 h-6 flex items-center justify-center border transition-colors ${
                                  data.featured 
                                    ? "border-yellow-500/50 text-yellow-400" 
                                    : "border-background/30 text-background/40 hover:text-background/60 hover:border-background/50"
                                }`}
                              >
                                <Star className={`w-3 h-3 ${data.featured ? "fill-yellow-400" : ""}`} />
                              </button>
                              <button 
                                onClick={handleSaveEdit}
                                disabled={isSaving}
                                className="w-6 h-6 flex items-center justify-center border border-green-500/50 text-green-400 hover:text-green-300 hover:border-green-400 transition-colors disabled:opacity-50"
                              >
                                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                              </button>
                              <button 
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                                className="w-6 h-6 flex items-center justify-center border border-background/30 text-background/60 hover:text-background hover:border-background transition-colors disabled:opacity-50"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <>
                              {currentUserRole !== "viewer" && (
                                <>
                                  <button 
                                    onClick={() => handleToggleFeatured(talent)}
                                    className={`w-6 h-6 flex items-center justify-center border transition-colors ${
                                      talent.featured 
                                        ? "border-yellow-500/50 text-yellow-400 hover:text-yellow-300" 
                                        : "border-background/30 text-background/40 hover:text-yellow-400 hover:border-yellow-500/50"
                                    }`}
                                    title={talent.featured ? "Remove from featured" : "Add to featured"}
                                  >
                                    <Star className={`w-3 h-3 ${talent.featured ? "fill-yellow-400" : ""}`} />
                                  </button>
                                  <button 
                                    onClick={() => handleEditClick(talent)}
                                    className="w-6 h-6 flex items-center justify-center border border-background/30 text-background/60 hover:text-background hover:border-background transition-colors"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteTalent(talent.id)}
                                    className="w-6 h-6 flex items-center justify-center border border-background/30 text-red-400 hover:text-red-300 hover:border-red-400 transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}

        {activeTab === "admins" && currentUserRole === "admin" && (
          <div className="space-y-6">
            {/* Actions */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-background/60">{profiles.length} admin users</p>
              <button 
                onClick={() => setIsAddingAdmin(true)}
                className="text-xs tracking-[0.2em] uppercase border border-background px-6 py-3 text-background hover:bg-background hover:text-foreground transition-all duration-300"
              >
                Add Admin
              </button>
            </div>

            {/* Table */}
            <div className="border border-background/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-background/20 bg-background/5">
                      <th className="text-left px-4 py-3 text-xs tracking-[0.1em] uppercase text-background/60 font-normal">Name</th>
                      <th className="text-left px-4 py-3 text-xs tracking-[0.1em] uppercase text-background/60 font-normal">Username</th>
                      <th className="text-left px-4 py-3 text-xs tracking-[0.1em] uppercase text-background/60 font-normal">Role</th>
                      <th className="text-left px-4 py-3 text-xs tracking-[0.1em] uppercase text-background/60 font-normal">Created</th>
                      <th className="text-left px-4 py-3 text-xs tracking-[0.1em] uppercase text-background/60 font-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-background/50">
                          No admin users found
                        </td>
                      </tr>
                    ) : (
                      profiles.map((profile) => (
                        <tr key={profile.id} className="border-b border-background/10 hover:bg-background/5 transition-colors">
                          <td className="px-4 py-4 text-sm text-background font-medium">{profile.name || "-"}</td>
                          <td className="px-4 py-4 text-sm text-background/70">{profile.username || "-"}</td>
                          <td className="px-4 py-4">
                            <span className="text-[10px] tracking-[0.1em] uppercase px-2 py-1 border border-background/30 text-background/70">
                              {profile.role || "User"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-background/70">
                            {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => {
                                  setPasswordEditUserId(profile.id)
                                  setNewPassword("")
                                }}
                                className="w-8 h-8 flex items-center justify-center border border-background/30 text-background/60 hover:text-background hover:border-background transition-colors"
                                title="Change password"
                              >
                                <Key className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => {
                                  setEditingAdminId(profile.id)
                                  setEditAdminData({
                                    name: profile.name || "",
                                    username: profile.username || "",
                                    role: profile.role || "editor"
                                  })
                                  setAdminError(null)
                                }}
                                className="w-8 h-8 flex items-center justify-center border border-background/30 text-background/60 hover:text-background hover:border-background transition-colors"
                                title="Edit admin"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => setDeletingAdmin({ id: profile.id, name: profile.name || profile.username || "this user" })}
                                className="w-8 h-8 flex items-center justify-center border border-background/30 text-red-400 hover:text-red-300 hover:border-red-400 transition-colors"
                                title="Delete admin"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add Admin Modal */}
        {isAddingAdmin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-full max-w-md border-2 border-white/20 bg-[var(--c4-black)] p-6">
              <h3 className="display mb-4 text-xl font-extrabold uppercase text-white">Add Admin User</h3>
              <p className="text-sm text-background/60 mb-4">
                Create a new admin user with access to the dashboard.
              </p>
              
              {adminError && (
                <div className="mb-4 p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                  {adminError}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-background/60 mb-2">Name *</label>
                  <input
                    type="text"
                    value={newAdminData.name}
                    onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full px-3 py-2 bg-background/10 border border-background/30 text-background placeholder:text-background/40 focus:outline-none focus:border-background/60"
                  />
                </div>
                
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-background/60 mb-2">Username</label>
                  <input
                    type="text"
                    value={newAdminData.username}
                    onChange={(e) => setNewAdminData({ ...newAdminData, username: e.target.value })}
                    placeholder="Username (optional)"
                    className="w-full px-3 py-2 bg-background/10 border border-background/30 text-background placeholder:text-background/40 focus:outline-none focus:border-background/60"
                  />
                </div>
                
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-background/60 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newAdminData.email}
                    onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                    placeholder="Email address"
                    className="w-full px-3 py-2 bg-background/10 border border-background/30 text-background placeholder:text-background/40 focus:outline-none focus:border-background/60"
                  />
                </div>
                
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-background/60 mb-2">Password *</label>
                  <input
                    type="password"
                    value={newAdminData.password}
                    onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                    placeholder="Password (min 6 characters)"
                    className="w-full px-3 py-2 bg-background/10 border border-background/30 text-background placeholder:text-background/40 focus:outline-none focus:border-background/60"
                  />
                </div>
                
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-background/60 mb-2">Role</label>
                  <select
                    value={newAdminData.role}
                    onChange={(e) => setNewAdminData({ ...newAdminData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-background/10 border border-background/30 text-background focus:outline-none focus:border-background/60"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsAddingAdmin(false)
                    setAdminError(null)
                    setNewAdminData({
                      name: "",
                      username: "",
                      email: "",
                      password: "",
                      role: "admin"
                    })
                  }}
                  disabled={isCreatingAdmin}
                  className="text-xs tracking-[0.2em] uppercase px-6 py-2 border border-background/30 text-background/60 hover:text-background hover:border-background transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAdmin}
                  disabled={isCreatingAdmin || !newAdminData.email || !newAdminData.password || !newAdminData.name}
                  className="text-xs tracking-[0.2em] uppercase px-6 py-2 border border-background bg-background text-foreground hover:bg-background/90 transition-colors disabled:opacity-50"
                >
                  {isCreatingAdmin ? "Creating..." : "Create Admin"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Admin Confirmation Modal */}
        {deletingAdmin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-full max-w-md border-2 border-white/20 bg-[var(--c4-black)] p-6">
              <h3 className="display mb-4 text-xl font-extrabold uppercase text-white">Delete User</h3>
              <p className="text-sm text-background/70 mb-6">
                Are you sure you want to delete <span className="text-background font-medium">{deletingAdmin.name}</span>? This action cannot be undone.
              </p>
              
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeletingAdmin(null)}
                  disabled={isDeletingAdmin}
                  className="text-xs tracking-[0.2em] uppercase px-6 py-2 border border-background/30 text-background/60 hover:text-background hover:border-background transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setIsDeletingAdmin(true)
                    try {
                      const res = await fetch(`/api/profiles/${deletingAdmin.id}`, { method: "DELETE" })
                      if (res.ok) {
                        setProfiles(profiles.filter(p => p.id !== deletingAdmin.id))
                        setDeletingAdmin(null)
                      } else {
                        setAdminError("Failed to delete user")
                      }
                    } catch (err) {
                      console.error(err)
                      setAdminError("Failed to delete user")
                    } finally {
                      setIsDeletingAdmin(false)
                    }
                  }}
                  disabled={isDeletingAdmin}
                  className="text-xs tracking-[0.2em] uppercase px-6 py-2 border border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600 transition-colors disabled:opacity-50"
                >
                  {isDeletingAdmin ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Admin Modal */}
        {editingAdminId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-full max-w-md border-2 border-white/20 bg-[var(--c4-black)] p-6">
              <h3 className="display mb-4 text-xl font-extrabold uppercase text-white">Edit Admin User</h3>
              
              {adminError && (
                <div className="mb-4 p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                  {adminError}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-background/60 mb-2">Name</label>
                  <input
                    type="text"
                    value={editAdminData.name}
                    onChange={(e) => setEditAdminData({ ...editAdminData, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full px-3 py-2 bg-background/10 border border-background/30 text-background placeholder:text-background/40 focus:outline-none focus:border-background/60"
                  />
                </div>
                
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-background/60 mb-2">Username</label>
                  <input
                    type="text"
                    value={editAdminData.username}
                    onChange={(e) => setEditAdminData({ ...editAdminData, username: e.target.value })}
                    placeholder="Username"
                    className="w-full px-3 py-2 bg-background/10 border border-background/30 text-background placeholder:text-background/40 focus:outline-none focus:border-background/60"
                  />
                </div>
                
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-background/60 mb-2">Role</label>
                  <select
                    value={editAdminData.role}
                    onChange={(e) => setEditAdminData({ ...editAdminData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-background/10 border border-background/30 text-background focus:outline-none focus:border-background/60"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setEditingAdminId(null)
                    setAdminError(null)
                  }}
                  disabled={isUpdatingAdmin}
                  className="text-xs tracking-[0.2em] uppercase px-6 py-2 border border-background/30 text-background/60 hover:text-background hover:border-background transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditAdmin}
                  disabled={isUpdatingAdmin}
                  className="text-xs tracking-[0.2em] uppercase px-6 py-2 border border-background bg-background text-foreground hover:bg-background/90 transition-colors disabled:opacity-50"
                >
                  {isUpdatingAdmin ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Edit Modal */}
        {passwordEditUserId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-full max-w-md border-2 border-white/20 bg-[var(--c4-black)] p-6">
              <h3 className="display mb-4 text-xl font-extrabold uppercase text-white">Change Password</h3>
              
              {passwordSuccess ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-background">Password updated successfully</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-background/60 mb-4">
                    Enter a new password for {profiles.find(p => p.id === passwordEditUserId)?.name || "this user"}.
                  </p>
                  
                  {passwordError && (
                    <div className="mb-4 p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                      {passwordError}
                    </div>
                  )}
                  
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 6 characters)"
                    className="w-full px-3 py-2 bg-background/10 border border-background/30 text-background placeholder:text-background/40 focus:outline-none focus:border-background/60 mb-4"
                  />
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        setPasswordEditUserId(null)
                        setNewPassword("")
                        setPasswordError(null)
                      }}
                      disabled={isUpdatingPassword}
                      className="text-xs tracking-[0.2em] uppercase px-6 py-2 border border-background/30 text-background/60 hover:text-background hover:border-background transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdatePassword}
                      disabled={isUpdatingPassword || newPassword.length < 6}
                      className="text-xs tracking-[0.2em] uppercase px-6 py-2 border border-background bg-background text-foreground hover:bg-background/90 transition-colors disabled:opacity-50"
                    >
                      {isUpdatingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
