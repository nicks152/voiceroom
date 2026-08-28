import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

export const maxDuration = 60

const MAX_CHUNK_BYTES = 3.5 * 1024 * 1024 // under Vercel’s ~4.5MB body limit

/**
 * Chunked audio upload (avoids Vercel body limit AND browser→storage CORS).
 *
 * JSON:
 *   { action: "init", fileName, contentType } → { uploadId }
 *   { action: "complete", uploadId, fileName, contentType, totalChunks } → { url, path }
 *
 * multipart:
 *   action=chunk, uploadId, index, chunk=<File>
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      return await handleChunk(request)
    }

    const body = await request.json()
    if (body.action === "complete") {
      return await handleComplete(body)
    }
    return await handleInit(body)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    )
  }
}

async function handleInit(body: {
  fileName?: string
  contentType?: string
  action?: string
}) {
  const originalName = body.fileName || "sample.mp3"
  const uploadId = randomUUID()
  const ext = originalName.split(".").pop()?.toLowerCase() || "mp3"
  const finalPath = `talent-samples/${Date.now()}-${uploadId.slice(0, 8)}.${ext}`

  return NextResponse.json({
    uploadId,
    finalPath,
    contentType: body.contentType || "audio/mpeg",
    chunkSize: MAX_CHUNK_BYTES,
  })
}

async function handleChunk(request: Request) {
  const formData = await request.formData()
  const uploadId = String(formData.get("uploadId") || "")
  const index = String(formData.get("index") || "")
  const chunk = formData.get("chunk")

  if (!uploadId || index === "" || !(chunk instanceof File)) {
    return NextResponse.json({ error: "Missing chunk fields" }, { status: 400 })
  }

  if (chunk.size > MAX_CHUNK_BYTES) {
    return NextResponse.json({ error: "Chunk too large" }, { status: 413 })
  }

  const supabase = createAdminClient()
  const path = `tmp-uploads/${uploadId}/${index}`
  const buffer = Buffer.from(await chunk.arrayBuffer())

  const { error } = await supabase.storage.from("audio-files").upload(path, buffer, {
    contentType: "application/octet-stream",
    upsert: true,
  })

  if (error) {
    console.error("Chunk upload error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, index: Number(index) })
}

async function handleComplete(body: {
  uploadId?: string
  finalPath?: string
  fileName?: string
  contentType?: string
  totalChunks?: number
}) {
  const { uploadId, finalPath, totalChunks } = body
  if (!uploadId || !finalPath || !totalChunks || totalChunks < 1) {
    return NextResponse.json({ error: "Missing complete fields" }, { status: 400 })
  }

  const supabase = createAdminClient()
  const parts: Buffer[] = []

  for (let i = 0; i < totalChunks; i++) {
    const path = `tmp-uploads/${uploadId}/${i}`
    const { data, error } = await supabase.storage.from("audio-files").download(path)
    if (error || !data) {
      console.error("Chunk download error:", error)
      return NextResponse.json(
        { error: error?.message || `Missing chunk ${i}` },
        { status: 500 }
      )
    }
    parts.push(Buffer.from(await data.arrayBuffer()))
  }

  const fileBuffer = Buffer.concat(parts)
  const { error: uploadError } = await supabase.storage
    .from("audio-files")
    .upload(finalPath, fileBuffer, {
      contentType: body.contentType || "audio/mpeg",
      upsert: true,
    })

  if (uploadError) {
    console.error("Final upload error:", uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Best-effort cleanup of temp chunks
  const tmpPaths = Array.from({ length: totalChunks }, (_, i) => `tmp-uploads/${uploadId}/${i}`)
  await supabase.storage.from("audio-files").remove(tmpPaths).catch(() => null)

  const { data: urlData } = supabase.storage.from("audio-files").getPublicUrl(finalPath)

  return NextResponse.json({
    url: urlData.publicUrl,
    path: finalPath,
  })
}
