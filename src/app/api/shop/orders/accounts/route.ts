import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        items: {
          some: {
            typeSnapshot: {
              not: "HACK"
            }
          }
        }
      },
      include: {
        items: {
          include: {
            deliveredSecrets: {
              select: {
                username: true,
                password: true,
                extraInfo: true
              }
            },
            product: {
              select: {
                thumbnail: true,
                category: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(orders);

  } catch (error) {
    console.error("[ACCOUNT_ORDERS_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
