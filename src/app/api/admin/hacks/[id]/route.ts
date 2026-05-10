import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Lấy chi tiết hack tool
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const hack = await prisma.hackTool.findUnique({ where: { id } });
  if (!hack) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(hack);
}

// PUT: Cập nhật hack tool
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, version, description, thumbnail, downloadUrl, fileName, fileSize, features, requirements, changelog, prices, videoUrl, status, externalId } = body;

    const hack = await prisma.hackTool.update({
      where: { id },
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

    return NextResponse.json(hack);
  } catch (error) {
    console.error("Error updating hack tool:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Xóa hack tool
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.hackTool.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting hack tool:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
