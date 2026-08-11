"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"

export default function AuthPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
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
    <main className="flex min-h-screen items-center justify-center bg-[var(--c4-black)] px-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="display inline-block text-2xl font-extrabold uppercase tracking-tight text-white md:text-3xl"
          >
            Voice Room
          </Link>
          <p className="mt-2 text-[11px] tracking-[0.18em] uppercase text-white/40">
            By AMP Studios
          </p>
        </div>

        <div className="relative border-2 border-white/20 bg-[var(--c4-black)] p-8 lg:p-10">
          <div className="absolute top-0 left-0 h-1 w-full bg-[var(--c4-yellow)]" />

          <div className="mb-8 text-center">
            <h1 className="display text-2xl font-extrabold uppercase tracking-tight text-white lg:text-3xl">
              Admin Access
            </h1>
            <p className="mt-2 text-sm text-white/55">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 border-2 border-[var(--c4-red)] bg-[var(--c4-red)]/10 p-3 text-center text-sm text-[var(--c4-red)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="c4-label mb-2 block text-white/70"
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
                className="w-full border-2 border-white/20 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--c4-yellow)]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="c4-label mb-2 block text-white/70"
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
                className="w-full border-2 border-white/20 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--c4-yellow)]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--c4-white)] py-4 text-xs tracking-[0.2em] uppercase text-[var(--c4-black)] transition-colors hover:bg-[var(--c4-yellow)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-white/55 transition-colors hover:text-white"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
