import { NextResponse } from "next/server";
import { getSiteConfig } from "@/lib/configUtils";

export async function GET() {
  try {
    const config = await getSiteConfig();
    
    // Chỉ trả về các thông số an toàn cho Client
    return NextResponse.json({
      pusherKey: config.PUSHER_KEY,
      pusherCluster: config.PUSHER_CLUSTER,
      siteName: config.siteName
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });
  }
}
