import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function GET() {
  try {
    const testData = {
      userName: "H***n (Test)",
      amount: 50000,
      time: new Date().toISOString()
    };

    await pusherServer.trigger("topup-channel", "new-deposit", testData);

    return NextResponse.json({
      success: true,
      message: "Đã gửi thông báo giả lập thành công!",
      data: testData
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
