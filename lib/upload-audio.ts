/**
 * Upload an audio file to Supabase Storage.
 * Uses a signed URL so the browser talks to storage directly (bypasses Vercel 4.5MB limit).
 */
export async function uploadAudioFile(file: File, talentId?: string) {
  const prepRes = await fetch("/api/upload-audio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type || "audio/mpeg",
      talent_id: talentId,
    }),
  })

  const prep = await prepRes.json().catch(() => ({}))
  if (!prepRes.ok || prep.error || !prep.signedUrl) {
    throw new Error(prep.error || `Failed to prepare upload (${prepRes.status})`)
  }

  // PUT straight to the signed URL — avoids upsert/token mismatches in uploadToSignedUrl
  const putRes = await fetch(prep.signedUrl as string, {
    method: "PUT",
    headers: {
      "Content-Type": (prep.contentType as string) || file.type || "audio/mpeg",
    },
    body: file,
  })

  if (!putRes.ok) {
    const detail = await putRes.text().catch(() => "")
    throw new Error(
      detail || `Storage rejected upload (${putRes.status}). Check file type/size and try again.`
    )
  }

  return {
    url: prep.publicUrl as string,
    path: prep.path as string,
  }
}
