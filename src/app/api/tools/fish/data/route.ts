import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const version = searchParams.get("version");
    
    const apiUrl = version 
      ? `https://hackviet.io/api/fish?version=${version}` 
      : `https://hackviet.io/api/fish`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 600 } // Cache data for 10 minutes
    });
    
    if (!response.ok) throw new Error("API responded with error");
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Fish API Error]:", error);
    return NextResponse.json({ error: "Failed to fetch fish data" }, { status: 500 });
  }
}
