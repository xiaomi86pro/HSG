import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createServerSupabase } from "@/lib/supabase/server"

type Role = "student" | "teacher" | "admin"

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase()

    // 1️⃣ Xác thực user hiện tại
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // 2️⃣ Check role từ JWT (không dùng RPC nữa)
    const currentRole = (user as any)?.role

    if (currentRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    // 3️⃣ Validate input
    const { userId, role } = await req.json()

    const allowedRoles: Role[] = ["student", "teacher", "admin"]

    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    // 4️⃣ Dùng service role để update app_metadata
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Set role error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}