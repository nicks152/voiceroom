import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const MAX_PROXY_BYTES = 4 * 1024 * 1024 // stay under Vercel's ~4.5MB body limit

/**
 * Two modes:
 * 1) JSON body → returns a signed upload URL (browser uploads directly to storage)
 * 2) multipart FormData with a small file → server uploads with the service role
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      return await handleProxyUpload(request)
    }

    return await handleSignedUrl(request)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to prepare audio upload" }, { status: 500 })
  }
}

async function handleSignedUrl(request: Request) {
  const body = await request.json()
  const originalName = (body.fileName as string) || "sample.mp3"
  const fileContentType = (body.contentType as string) || "audio/mpeg"

  const supabase = createAdminClient()
  const timestamp = Date.now()
  const ext = originalName.split(".").pop()?.toLowerCase() || "mp3"
  const path = `talent-samples/${timestamp}.${ext}`

  const { data, error } = await supabase.storage
    .from("audio-files")
    .createSignedUploadUrl(path, { upsert: true })

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
    contentType: fileContentType,
  })
}

async function handleProxyUpload(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  if (file.size > MAX_PROXY_BYTES) {
    return NextResponse.json(
      {
        error:
          "File too large for proxy upload. Refresh the page and try again (direct upload).",
      },
      { status: 413 }
    )
  }

  const supabase = createAdminClient()
  const timestamp = Date.now()
  const ext = file.name.split(".").pop()?.toLowerCase() || "mp3"
  const path = `talent-samples/${timestamp}.${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())
  const { data, error } = await supabase.storage.from("audio-files").upload(path, buffer, {
    contentType: file.type || "audio/mpeg",
    upsert: true,
  })

  if (error) {
    console.error("Storage upload error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: urlData } = supabase.storage.from("audio-files").getPublicUrl(path)

  return NextResponse.json({
    url: urlData.publicUrl,
    path: data.path,
  })
}
