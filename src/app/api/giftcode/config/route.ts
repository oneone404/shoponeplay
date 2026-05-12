import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        savedAccountIds: true,
        config: true 
      }
    });

    const savedAccounts = Array.isArray(user?.savedAccountIds) ? user.savedAccountIds : [];
    
    return NextResponse.json({
      autoGiftcode: user?.config?.autoGiftcode || false,
      savedAccounts
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { autoGiftcode } = await req.json();

    await prisma.userConfig.upsert({
      where: { userId: session.user.id },
      update: { autoGiftcode },
      create: { 
        userId: session.user.id!, 
        autoGiftcode 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
