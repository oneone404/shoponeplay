import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const services = await prisma.gameService.findMany({
      include: {
        _count: {
          select: { options: true, orders: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, thumbnail, description, type, status, fields } = body;

    const service = await prisma.gameService.create({
      data: {
        name,
        slug,
        thumbnail,
        description,
        type,
        status,
        fields: fields || []
      }
    });

    return NextResponse.json(service);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
