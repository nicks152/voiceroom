import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, company, email, licenseType, territory, includeShortlist, shortlistedArtists, message } = body

    if (!name || !company || !email || !licenseType || !territory) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Build the email content
    const shortlistSection = includeShortlist && shortlistedArtists?.length > 0
      ? `\n\nShortlisted Artists:\n${shortlistedArtists.map((artist: string) => `- ${artist}`).join("\n")}`
      : ""

    const emailContent = `
New inquiry from The Voice Room website

Name: ${name}
Company: ${company}
Email: ${email}
License Type: ${licenseType}
Territory: ${territory}
${shortlistSection}

Message:
${message || "No additional message provided."}
    `.trim()

    const { data, error } = await resend.emails.send({
      from: "The Voice Room <noreply@ampafrica.com>",
      to: ["voices@ampafrica.com"],
      replyTo: email,
      subject: `New Inquiry from ${name} - ${company}`,
      text: emailContent,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
