const CHUNK_SIZE = 512 * 1024 // 512KB — safe for Vercel + typical nginx limits
const UPLOAD_VERSION = "tus-proxy-v1"

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  const step = 0x8000
  for (let i = 0; i < bytes.length; i += step) {
    binary += String.fromCharCode(...bytes.subarray(i, i + step))
  }
  return btoa(binary)
}

/** Read duration in seconds from an audio File (0 if unreadable). */
export function getAudioDurationSec(file: File): Promise<number> {
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file)
      const audio = new Audio()
      const done = (value: number) => {
        URL.revokeObjectURL(url)
        resolve(Number.isFinite(value) && value > 0 ? Math.round(value) : 0)
      }
      audio.preload = "metadata"
      audio.onloadedmetadata = () => done(audio.duration)
      audio.onerror = () => done(0)
      audio.src = url
    } catch {
      resolve(0)
    }
  })
}

async function postJson(url: string, body: unknown, step: string) {
  let res: Response
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch"
    throw new Error(`[${UPLOAD_VERSION}] ${step}: ${msg}`)
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.error) {
    throw new Error(
      `[${UPLOAD_VERSION}] ${step}: ${data.error || `HTTP ${res.status}`}`
    )
  }
  return data
}

/**
 * Same-origin upload that proxies TUS resumable uploads to Supabase Storage.
 * Keeps every request small (no Vercel/nginx "entity too large").
 */
export async function uploadAudioFile(file: File, talentId?: string) {
  const endpoint =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/upload-audio`
      : "/api/upload-audio"

  const init = await postJson(
    endpoint,
    {
      action: "init",
      fileName: file.name,
      contentType: file.type || "audio/mpeg",
      talent_id: talentId,
      size: file.size,
    },
    "start upload"
  )

  if (!init.uploadUrl || !init.publicUrl || !init.path) {
    throw new Error(`[${UPLOAD_VERSION}] start upload: invalid server response`)
  }

  let offset = 0
  let part = 0
  const totalParts = Math.max(1, Math.ceil(file.size / CHUNK_SIZE))

  while (offset < file.size) {
    part += 1
    const end = Math.min(file.size, offset + CHUNK_SIZE)
    const blob = file.slice(offset, end)
    const base64 = arrayBufferToBase64(await blob.arrayBuffer())

    const chunk = await postJson(
      endpoint,
      {
        action: "chunk",
        uploadUrl: init.uploadUrl,
        offset,
        data: base64,
      },
      `upload part ${part}/${totalParts}`
    )

    const nextOffset = Number(chunk.offset)
    if (!Number.isFinite(nextOffset) || nextOffset <= offset) {
      throw new Error(`[${UPLOAD_VERSION}] upload part ${part}/${totalParts}: bad offset`)
    }
    offset = nextOffset
  }

  const complete = await postJson(
    endpoint,
    {
      action: "complete",
      publicUrl: init.publicUrl,
      path: init.path,
    },
    "finalize upload"
  )

  return {
    url: (complete.url as string) || (init.publicUrl as string),
    path: (complete.path as string) || (init.path as string),
  }
}
