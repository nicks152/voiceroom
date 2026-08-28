import { createClient } from "@/lib/supabase/client"

/**
 * Upload an audio file directly to Supabase Storage via a signed URL
 * from /api/upload-audio (avoids Vercel request body limits).
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

  const prep = await prepRes.json()
  if (!prepRes.ok || prep.error) {
    throw new Error(prep.error || "Failed to prepare upload")
  }

  const supabase = createClient()
  const { error } = await supabase.storage
    .from("audio-files")
    .uploadToSignedUrl(prep.path, prep.token, file, {
      contentType: prep.contentType || file.type || "audio/mpeg",
      upsert: true,
    })

  if (error) {
    throw new Error(error.message || "Failed to upload audio file")
  }

  return {
    url: prep.publicUrl as string,
    path: prep.path as string,
  }
}
