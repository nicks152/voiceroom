const CHUNK_SIZE = 3 * 1024 * 1024 // 3MB — under Vercel’s ~4.5MB limit

/**
 * Upload audio via same-origin chunked API (no browser→Supabase CORS).
 */
export async function uploadAudioFile(file: File, talentId?: string) {
  const initRes = await fetch("/api/upload-audio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "init",
      fileName: file.name,
      contentType: file.type || "audio/mpeg",
      talent_id: talentId,
      size: file.size,
    }),
  })

  const init = await initRes.json().catch(() => ({}))
  if (!initRes.ok || init.error || !init.uploadId || !init.finalPath) {
    throw new Error(init.error || `Failed to start upload (${initRes.status})`)
  }

  const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE))

  for (let i = 0; i < totalChunks; i++) {
    const blob = file.slice(i * CHUNK_SIZE, Math.min(file.size, (i + 1) * CHUNK_SIZE))
    const formData = new FormData()
    formData.append("action", "chunk")
    formData.append("uploadId", init.uploadId)
    formData.append("index", String(i))
    formData.append("chunk", blob, `chunk-${i}`)

    const chunkRes = await fetch("/api/upload-audio", {
      method: "POST",
      body: formData,
    })
    const chunkData = await chunkRes.json().catch(() => ({}))
    if (!chunkRes.ok || chunkData.error) {
      throw new Error(chunkData.error || `Failed to upload chunk ${i + 1}/${totalChunks}`)
    }
  }

  const completeRes = await fetch("/api/upload-audio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "complete",
      uploadId: init.uploadId,
      finalPath: init.finalPath,
      fileName: file.name,
      contentType: init.contentType || file.type || "audio/mpeg",
      totalChunks,
    }),
  })

  const complete = await completeRes.json().catch(() => ({}))
  if (!completeRes.ok || complete.error || !complete.url) {
    throw new Error(complete.error || `Failed to finalize upload (${completeRes.status})`)
  }

  return {
    url: complete.url as string,
    path: complete.path as string,
  }
}
