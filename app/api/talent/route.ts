import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from("talent")
      .select(`
        *,
        samples (
          id,
          title,
          file_url,
          duration_sec,
          published
        )
      `)
      .order("created_at", { ascending: false })
    
    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ talent: data })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ error: "Failed to fetch talent" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    
    const { data, error } = await supabase
      .from("talent")
      .insert([body])
      .select()
      .single()
    
    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ talent: data })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ error: "Failed to create talent" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    // Destructure to exclude relation fields that aren't actual columns
    const { id, samples, created_at, updated_at, ...updates } = body
    
    const { data, error } = await supabase
      .from("talent")
      .update(updates)
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ talent: data })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ error: "Failed to update talent" }, { status: 500 })
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
      .from("talent")
      .delete()
      .eq("id", id)
    
    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ error: "Failed to delete talent" }, { status: 500 })
  }
}
