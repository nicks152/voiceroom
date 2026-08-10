"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createBrowserClient } from "@supabase/ssr"

export default function AuthPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      // First, look up the user's email from their username via API
      const lookupRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const lookupData = await lookupRes.json()

      if (lookupData.error || !lookupData.email) {
        setError("Invalid username or password")
        setIsLoading(false)
        return
      }

      // Sign in with the email
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: lookupData.email,
        password,
      })

      if (signInError) {
        setError("Invalid username or password")
        setIsLoading(false)
        return
      }

      router.push("/dash")
    } catch (err) {
      console.error("Sign in error:", err)
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo-dark.png"
              alt="The Voice Room by AMP Studios"
              width={240}
              height={60}
              className="h-14 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Card */}
        <div className="border border-background/20 bg-foreground p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl lg:text-3xl text-background mb-2">
              Admin Access
            </h1>
            <p className="text-sm text-background/60">
              Sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="username" 
                className="block text-xs tracking-[0.15em] uppercase text-background/80 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-3 bg-background/5 border border-background/20 text-background placeholder:text-background/40 focus:outline-none focus:border-background/50 transition-colors"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-xs tracking-[0.15em] uppercase text-background/80 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 bg-background/5 border border-background/20 text-background placeholder:text-background/40 focus:outline-none focus:border-background/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-background text-foreground text-xs tracking-[0.2em] uppercase hover:bg-background/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Sign In"}
            </button>
          </form>

          {/* Back Link */}
          <div className="text-center mt-8">
            <Link 
              href="/"
              className="text-sm text-background/60 hover:text-background transition-colors border-b border-background/30 pb-0.5"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
