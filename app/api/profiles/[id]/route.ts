import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()
    
    const { name, username, role } = body
    
    const { data, error } = await supabase
      .from("profiles")
      .update({
        name,
        username,
        role,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating profile:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ profile: data })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id)
    
    if (error) {
      console.error("Error deleting profile:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile delete error:", error)
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 })
  }
}
