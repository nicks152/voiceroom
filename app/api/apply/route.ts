import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const location = formData.get("location") as string
    const voiceType = formData.get("voiceType") as string
    const language = formData.get("language") as string
    const experience = formData.get("experience") as string
    const demoFile = formData.get("demoFile") as File | null

    if (!name || !email || !phone || !location) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 })
    }

    const emailContent = `
New Voice Talent Application

APPLICANT DETAILS
-----------------
Name: ${name}
Email: ${email}
Phone: ${phone}
Location: ${location}

VOICE PROFILE
-------------
Primary Voice Type: ${voiceType || "Not specified"}
Primary Language: ${language || "Not specified"}

EXPERIENCE
----------
${experience || "No experience details provided"}

DEMO REEL
---------
${demoFile ? `Demo file attached: ${demoFile.name}` : "No demo file uploaded"}
    `.trim()

    // Prepare attachments if demo file exists
    const attachments: { filename: string; content: Buffer }[] = []
    
    if (demoFile) {
      const arrayBuffer = await demoFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      attachments.push({
        filename: demoFile.name,
        content: buffer,
      })
    }

    const { data, error } = await resend.emails.send({
      from: "The Voice Room <noreply@ampafrica.com>",
      to: ["voices@ampafrica.com"],
      replyTo: email,
      subject: `Voice Talent Application: ${name}`,
      text: emailContent,
      attachments: attachments.length > 0 ? attachments : undefined,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send application" }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ error: "Failed to process application" }, { status: 500 })
  }
}
