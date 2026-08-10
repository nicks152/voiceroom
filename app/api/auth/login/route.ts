import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // Look up the user's auth ID from their username
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("username", username)
      .single()

    console.log("[v0] Login attempt for username:", username)
    console.log("[v0] Profile lookup result:", { profile, profileError })

    if (profileError || !profile) {
      console.log("[v0] Profile not found or error:", profileError)
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // Get the auth user's email
    const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserById(profile.user_id)

    if (authUserError || !authUser?.user?.email) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // Return the email so the client can sign in
    return NextResponse.json({ email: authUser.user.email })
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
