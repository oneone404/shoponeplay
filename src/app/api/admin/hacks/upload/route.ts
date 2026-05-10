import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import sharp from "sharp"

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const extension = IMAGE_EXTENSIONS[file.type]
    if (!extension) {
      return NextResponse.json({ error: "Invalid image type" }, { status: 400 })
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const isGif = file.type === "image/gif";
    let finalBuffer: any = buffer;
    let finalExtension = ".webp";

    if (!isGif) {
      // Process with Sharp: Convert to WebP and compress
      finalBuffer = await sharp(buffer)
        .webp({ quality: 80 })
        .toBuffer();
    } else {
      finalExtension = ".gif";
    }
    
    // Save to public/uploads/hacks
    const uploadDir = path.join(process.cwd(), "public", "uploads", "hacks");
    await mkdir(uploadDir, { recursive: true });

    const fileName = `hack_${Date.now()}_${Math.random().toString(36).slice(2, 7)}${finalExtension}`;
    const filePath = path.join(uploadDir, fileName);
    
    await writeFile(filePath, finalBuffer);

    return NextResponse.json({ 
      url: `/uploads/hacks/${fileName}`
    })

  } catch (error) {
    console.error("[HACK_UPLOAD_ERROR]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
