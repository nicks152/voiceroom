import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PUT(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { profileId, newPassword } = body

    if (!profileId || !newPassword) {
      return NextResponse.json({ error: "Profile ID and new password are required" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Get the profile to find the linked auth user_id
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("id", profileId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (!profile.user_id) {
      return NextResponse.json({ error: "No auth user linked to this profile" }, { status: 400 })
    }

    const { error } = await supabase.auth.admin.updateUserById(profile.user_id, {
      password: newPassword,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}
