import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // Verify Admin Role
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { role, balanceAdd } = body;

    // Validate input
    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    // Get current user to calculate new balance
    const currentUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newBalance = currentUser.balance + (balanceAdd || 0);

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role,
        balance: newBalance,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        balance: true,
        totalDeposited: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ message: "User updated", user: updatedUser });
  } catch (error: any) {
    console.error("Admin User Update Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // Verify Admin Role
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Don't allow deleting self
    if (session.user.id === id) {
      return NextResponse.json({ error: "You cannot delete yourself" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Admin User Delete Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
