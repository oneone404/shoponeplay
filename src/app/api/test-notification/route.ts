import { NextResponse } from "next/server";
import { getPusherServer } from "@/lib/pusher";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Vui lòng cung cấp userId trong query params (ví dụ: ?userId=cl...) để test thông báo cá nhân."
      }, { status: 400 });
    }

    const testData = {
      userName: "Bạn",
      amount: 50000,
      time: new Date().toISOString(),
      message: "Bạn vừa nạp thành công 50,000 VND (Giao dịch giả lập)."
    };

    const pusher = await getPusherServer();
    await pusher.trigger(`user-${userId}`, "new-deposit", testData);

    return NextResponse.json({
      success: true,
      message: `Đã gửi thông báo giả lập tới User: ${userId}`,
      data: testData
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
