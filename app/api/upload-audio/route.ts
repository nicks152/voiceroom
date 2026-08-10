import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const formData = await request.formData()
    
    const file = formData.get("file") as File
    const talentId = formData.get("talent_id") as string
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    
    // Generate unique filename
    const timestamp = Date.now()
    const ext = file.name.split('.').pop() || 'mp3'
    const fileName = `talent-samples/${timestamp}.${ext}`
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from("audio-files")
      .upload(fileName, buffer, {
        contentType: file.type || "audio/mpeg",
        upsert: true,
      })
    
    if (error) {
      console.error("Storage upload error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from("audio-files")
      .getPublicUrl(fileName)
    
    return NextResponse.json({ 
      url: urlData.publicUrl,
      path: data.path,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload audio file" }, { status: 500 })
  }
}
