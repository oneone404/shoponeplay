import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://hackviet.io/api/fish/versions", {
      next: { revalidate: 3600 } // Cache versions for 1 hour
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch versions" }, { status: 500 });
  }
}
