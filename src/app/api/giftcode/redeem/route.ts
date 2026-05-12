import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { processBulkRedeem } from "@/lib/services/giftcode-processor";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roleIds, codes } = await req.json();

    if (!roleIds || !Array.isArray(roleIds) || roleIds.length === 0) {
      return NextResponse.json({ error: "Danh sách ID nhân vật không hợp lệ" }, { status: 400 });
    }

    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return NextResponse.json({ error: "Danh sách Giftcode không hợp lệ" }, { status: 400 });
    }

    const results = await processBulkRedeem(session.user.id!, roleIds, codes);

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("[API_GIFTCODE_REDEEM] Error:", error.message);
    return NextResponse.json({ error: "Có lỗi xảy ra trong quá trình xử lý" }, { status: 500 });
  }
}
