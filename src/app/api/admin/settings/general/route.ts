import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSiteConfig, saveSiteConfig } from "@/lib/configUtils"

export const dynamic = "force-dynamic"

export async function GET() {
  const config = await getSiteConfig()
  return NextResponse.json(config)
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    
    const success = await saveSiteConfig(body)

    if (success) {
      return NextResponse.json({ message: "Đã cập nhật cấu hình thành công" })
    } else {
      return NextResponse.json({ error: "Không thể lưu cấu hình" }, { status: 500 })
    }

  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 })
  }
}
