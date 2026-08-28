import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const talentId = searchParams.get("talent_id")

    let query = supabase
      .from("samples")
      .select("*")
      .order("created_at", { ascending: false })

    if (talentId) {
      query = query.eq("talent_id", talentId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ samples: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch samples" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    if (!body.talent_id || !body.file_url) {
      return NextResponse.json(
        { error: "talent_id and file_url are required" },
        { status: 400 }
      )
    }

    // Fill required sample fields from the parent talent so NOT NULL cols never blow up
    const { data: talent, error: talentError } = await supabase
      .from("talent")
      .select("age_band, gender, languages, tags")
      .eq("id", body.talent_id)
      .single()

    if (talentError || !talent) {
      console.error("Talent lookup error:", talentError)
      return NextResponse.json(
        { error: talentError?.message || "Talent not found" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("samples")
      .insert({
        talent_id: body.talent_id,
        title: body.title || "Sample",
        file_url: body.file_url,
        duration_sec: body.duration_sec ?? 0,
        age_band: body.age_band || talent.age_band || "25-35",
        gender: body.gender || talent.gender || "MALE",
        languages: body.languages?.length ? body.languages : talent.languages || [],
        styles: body.styles?.length ? body.styles : talent.tags || [],
        tags: body.tags?.length ? body.tags : talent.tags || [],
        published: body.published ?? true,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ sample: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to create sample" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Sample ID required" }, { status: 400 })
    }

    const { error } = await supabase.from("samples").delete().eq("id", id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to delete sample" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: "Sample ID required" }, { status: 400 })
    }

    const updates: Record<string, unknown> = {}
    if (body.file_url !== undefined) updates.file_url = body.file_url
    if (body.title !== undefined) updates.title = body.title
    if (body.duration_sec !== undefined) updates.duration_sec = body.duration_sec ?? 0
    if (body.published !== undefined) updates.published = body.published

    const { data, error } = await supabase
      .from("samples")
      .update(updates)
      .eq("id", body.id)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ sample: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to update sample" }, { status: 500 })
  }
}
