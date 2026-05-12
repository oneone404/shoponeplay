import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), "storage/cache/fish");

async function ensureDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (err) {
    // Ignore if exists
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const version = searchParams.get("version");
    
    if (!version) {
       return NextResponse.json({ error: "Version is required" }, { status: 400 });
    }

    await ensureDir();
    const cachePath = path.join(CACHE_DIR, `${version}.json`);

    // 1. Try to read from local cache
    try {
      const cachedData = await fs.readFile(cachePath, "utf-8");
      return NextResponse.json(JSON.parse(cachedData));
    } catch (err) {
      // File not found, proceed to fetch
    }

    // 2. Fetch from remote API if cache miss
    const apiUrl = `https://hackviet.io/api/fish?version=${version}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) throw new Error("API responded with error");
    
    const data = await response.json();

    // 3. Save to local cache for next time
    // Only cache if data seems valid (has items)
    if (data && data.data && data.data.length > 0) {
      await fs.writeFile(cachePath, JSON.stringify(data), "utf-8");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Fish API Error]:", error);
    return NextResponse.json({ error: "Failed to fetch fish data" }, { status: 500 });
  }
}
