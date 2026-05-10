import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const hackId = searchParams.get("hackId");

    if (!hackId) {
      return NextResponse.json({ error: "Missing hackId" }, { status: 400 });
    }

    const orders = await prisma.hackOrder.findMany({
      where: {
        userId: session.user.id,
        hackId: hackId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(orders);

  } catch (error) {
    console.error("[HACK_ORDERS_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
