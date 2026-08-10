import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profiles: data })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("profiles")
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: data })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { id, created_at, updated_at, ...updates } = body

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: data })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 })
  }
}
