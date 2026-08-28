import { NextResponse } from "next/server"

export const maxDuration = 60
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const BUCKET = "audio-files"
/** Binary chunk size from the browser (base64 expands ~33%; stay under Vercel 4.5MB). */
const MAX_CHUNK_BYTES = 512 * 1024

function storageConfig() {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!baseUrl || !key) {
    throw new Error("Supabase storage is not configured")
  }
  return { baseUrl: baseUrl.replace(/\/$/, ""), key }
}

function b64(value: string) {
  return Buffer.from(value).toString("base64")
}

/**
 * Resumable (TUS) upload proxied through this API so:
 * - browser never hits storage CORS
 * - no single request exceeds Vercel or nginx body limits
 *
 * init     → start TUS session
 * chunk    → PATCH next bytes (base64)
 * complete → return public URL (TUS finishes when Upload-Length is reached)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const action = body.action || "init"

    if (action === "chunk") return await handleChunk(body)
    if (action === "complete") return await handleComplete(body)
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
  size?: number
}) {
  const { baseUrl, key } = storageConfig()
  const originalName = body.fileName || "sample.mp3"
  const contentType = body.contentType || "audio/mpeg"
  const size = Number(body.size || 0)

  if (!size || size < 1) {
    return NextResponse.json({ error: "Missing file size" }, { status: 400 })
  }

  const ext = originalName.split(".").pop()?.toLowerCase() || "mp3"
  const path = `talent-samples/${Date.now()}.${ext}`

  const metadata = [
    `bucketName ${b64(BUCKET)}`,
    `objectName ${b64(path)}`,
    `contentType ${b64(contentType)}`,
    `cacheControl ${b64("3600")}`,
  ].join(",")

  const createRes = await fetch(`${baseUrl}/storage/v1/upload/resumable`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Tus-Resumable": "1.0.0",
      "Upload-Length": String(size),
      "Upload-Metadata": metadata,
      "x-upsert": "true",
    },
  })

  if (!createRes.ok) {
    const detail = await createRes.text().catch(() => "")
    console.error("TUS create failed:", createRes.status, detail)
    return NextResponse.json(
      { error: detail || `Failed to start resumable upload (${createRes.status})` },
      { status: 500 }
    )
  }

  const uploadUrl = createRes.headers.get("Location")
  if (!uploadUrl) {
    return NextResponse.json(
      { error: "Storage did not return an upload URL" },
      { status: 500 }
    )
  }

  // Absolute Location preferred; some stacks return relative
  const absoluteUploadUrl = uploadUrl.startsWith("http")
    ? uploadUrl
    : `${baseUrl}${uploadUrl.startsWith("/") ? "" : "/"}${uploadUrl}`

  const publicUrl = `${baseUrl}/storage/v1/object/public/${BUCKET}/${path}`

  return NextResponse.json({
    uploadUrl: absoluteUploadUrl,
    path,
    publicUrl,
    contentType,
    chunkSize: MAX_CHUNK_BYTES,
    version: "tus-proxy-v1",
  })
}

async function handleChunk(body: {
  uploadUrl?: string
  offset?: number
  data?: string
}) {
  const { baseUrl, key } = storageConfig()
  const { uploadUrl, data } = body
  const offset = Number(body.offset)

  if (!uploadUrl || !data || Number.isNaN(offset)) {
    return NextResponse.json({ error: "Missing chunk fields" }, { status: 400 })
  }

  const buffer = Buffer.from(data, "base64")
  if (buffer.byteLength > MAX_CHUNK_BYTES + 2048) {
    return NextResponse.json({ error: "Chunk too large" }, { status: 413 })
  }

  const patchRes = await fetch(uploadUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Tus-Resumable": "1.0.0",
      "Upload-Offset": String(offset),
      "Content-Type": "application/offset+octet-stream",
      "Content-Length": String(buffer.byteLength),
    },
    body: buffer,
  })

  if (!patchRes.ok) {
    const detail = await patchRes.text().catch(() => "")
    console.error("TUS patch failed:", patchRes.status, detail)
    return NextResponse.json(
      { error: detail || `Chunk upload failed (${patchRes.status})` },
      { status: 500 }
    )
  }

  const nextOffset = Number(patchRes.headers.get("Upload-Offset") || offset + buffer.byteLength)

  return NextResponse.json({
    ok: true,
    offset: nextOffset,
  })
}

async function handleComplete(body: { publicUrl?: string; path?: string }) {
  if (!body.publicUrl || !body.path) {
    return NextResponse.json({ error: "Missing complete fields" }, { status: 400 })
  }

  // TUS marks the object complete when Upload-Length is reached.
  return NextResponse.json({
    url: body.publicUrl,
    path: body.path,
  })
}
