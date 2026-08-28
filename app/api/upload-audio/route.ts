import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

/**
 * Returns a signed upload URL so the browser can PUT the audio file
 * straight to Supabase Storage (bypasses Vercel's ~4.5MB body limit).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const originalName = (body.fileName as string) || "sample.mp3"
    const contentType = (body.contentType as string) || "audio/mpeg"

    if (!originalName) {
      return NextResponse.json({ error: "No file name provided" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const timestamp = Date.now()
    const ext = originalName.split(".").pop()?.toLowerCase() || "mp3"
    const path = `talent-samples/${timestamp}.${ext}`

    const { data, error } = await supabase.storage
      .from("audio-files")
      .createSignedUploadUrl(path)

    if (error || !data) {
      console.error("Signed upload URL error:", error)
      return NextResponse.json(
        { error: error?.message || "Failed to create upload URL" },
        { status: 500 }
      )
    }

    const { data: urlData } = supabase.storage.from("audio-files").getPublicUrl(path)

    return NextResponse.json({
      path: data.path,
      token: data.token,
      signedUrl: data.signedUrl,
      publicUrl: urlData.publicUrl,
      contentType,
    })
  } catch (error) {
    console.error("Upload prep error:", error)
    return NextResponse.json({ error: "Failed to prepare audio upload" }, { status: 500 })
  }
}
