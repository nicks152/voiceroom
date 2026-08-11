import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("talent")
      .select(`
        id,
        name,
        pseudonym,
        description,
        photo_url,
        samples (
          id,
          title,
          file_url,
          duration_sec,
          published
        )
      `)
      .eq("featured", true)
      .order("name", { ascending: true })
      .limit(6)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const talent = (data || []).map((t) => ({
      ...t,
      samples: (t.samples || []).filter(
        (s: { published?: boolean; file_url?: string | null }) =>
          s.published !== false && s.file_url
      ),
    }))

    return NextResponse.json({ talent })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch featured talent" },
      { status: 500 }
    )
  }
}
