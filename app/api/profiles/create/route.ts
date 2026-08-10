import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const { name, username, email, password, role } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Create the auth user using admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
    })

    if (authError) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Create the profile linked to the auth user
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        user_id: authData.user.id,
        name,
        username: username || null,
        role: role || "admin",
      })
      .select()
      .single()

    if (profileError) {
      console.error("Profile error:", profileError)
      // If profile creation fails, we should ideally delete the auth user
      // but for now just return the error
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ profile: profileData, user: authData.user })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 })
  }
}
