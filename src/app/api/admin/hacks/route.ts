import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Lấy danh sách hack tools
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hacks = await prisma.hackTool.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(hacks);
}

// POST: Tạo hack tool mới
export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, version, description, thumbnail, downloadUrl, fileName, fileSize, features, requirements, changelog, prices, videoUrl, status, externalId } = body;

    if (!name || !slug || !version) {
      return NextResponse.json({ error: "Tên, slug và phiên bản là bắt buộc." }, { status: 400 });
    }

    // Check if slug already exists
    const existing = await prisma.hackTool.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug đã tồn tại." }, { status: 400 });
    }

    const hack = await prisma.hackTool.create({
      data: {
        name, slug, version,
        description: description || null,
        thumbnail: thumbnail || null,
        downloadUrl: downloadUrl || null,
        fileName: fileName || null,
        fileSize: fileSize || null,
        features: features || null,
        requirements: requirements || null,
        changelog: changelog || null,
        prices: prices || null,
        videoUrl: videoUrl || null,
        status: status || "ACTIVE",
        externalId: externalId ? parseInt(externalId.toString()) : null,
      },
    });

    return NextResponse.json(hack, { status: 201 });
  } catch (error) {
    console.error("Error creating hack tool:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
