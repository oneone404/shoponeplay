import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { status: "ok", timestamp: new Date().toISOString(), service: "ShopOnePlay Core API" },
    { status: 200 }
  );
}
