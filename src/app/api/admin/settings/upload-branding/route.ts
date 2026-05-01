import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { saveSiteConfig } from "@/lib/configUtils"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import fs from "fs"

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico",
}

function sanitizeFileStem(fileName: string) {
  const parsed = path.parse(fileName)
  return parsed.name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80) || "icon"
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const type = formData.get("type") as string | null

    if (!file || !type) {
      return NextResponse.json({ error: "Thiếu dữ liệu file hoặc loại upload" }, { status: 400 })
    }

    const extension = IMAGE_EXTENSIONS[file.type]

    if (!extension) {
      return NextResponse.json({ error: "File không phải là hình ảnh" }, { status: 400 })
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File qua lon. Dung luong toi da la 5MB" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Determine target path based on type
    let targetPath = ""
    let currentConfigValue = "" // Renamed to avoid any potential collision
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "branding")
    
    // Ensure directory exists
    await mkdir(uploadsDir, { recursive: true })

    if (type === "logo") {
      targetPath = path.join(uploadsDir, "logo.png")
      currentConfigValue = "/uploads/branding/logo.png"
    } else if (type === "banner") {
      targetPath = path.join(uploadsDir, "banner.png")
      currentConfigValue = "/uploads/branding/banner.png"
    } else if (type === "footer-logo") {
      targetPath = path.join(uploadsDir, "footer_logo.png")
      currentConfigValue = "/uploads/branding/footer_logo.png"
    } else if (type === "favicon") {
      if (extension !== ".ico" && extension !== ".png") {
        return NextResponse.json({ error: "Favicon chi ho tro PNG hoac ICO" }, { status: 400 })
      }

      targetPath = path.join(uploadsDir, "favicon.ico")
      currentConfigValue = "/uploads/branding/favicon.ico"
      
      const nextFaviconPath = path.join(process.cwd(), "src", "app", "favicon.ico")
      fs.writeFileSync(nextFaviconPath, Buffer.from(buffer))
    } else if (type === "link-icon") {
      const fileName = `icon_${Date.now()}_${sanitizeFileStem(file.name)}${extension}`
      targetPath = path.join(uploadsDir, fileName)
      currentConfigValue = `/uploads/branding/${fileName}`
    } else {
      return NextResponse.json({ error: "Loại hình ảnh không hợp lệ" }, { status: 400 })
    }

    // Ensure products directory exists
    const productsDir = path.join(process.cwd(), "public", "uploads", "products")
    await mkdir(productsDir, { recursive: true })

    // Write file to disk
    await writeFile(targetPath, buffer)

    // Update database only for main branding types
    if (type !== "link-icon") {
      const configKey = type === "logo" ? "siteLogo" : 
                        type === "banner" ? "siteBanner" : 
                        type === "footer-logo" ? "siteFooterLogo" : 
                        "siteFavicon"

      await saveSiteConfig({ [configKey]: currentConfigValue })
    }

    return NextResponse.json({ 
      message: "Tải ảnh lên thành công",
      url: currentConfigValue
    })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 })
  }
}
