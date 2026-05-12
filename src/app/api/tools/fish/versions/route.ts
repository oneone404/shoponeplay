import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "storage/cache/fish/versions.json");
const CACHE_DIR = path.dirname(CACHE_FILE);

async function ensureDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (err) {}
}

export async function GET() {
  try {
    await ensureDir();

    // 1. Check cache freshness (e.g., 1 hour)
    try {
      const stats = await fs.stat(CACHE_FILE);
      const now = Date.now();
      const age = now - stats.mtimeMs;
      
      if (age < 3600000) { // 1 hour
        const cached = await fs.readFile(CACHE_FILE, "utf-8");
        return NextResponse.json(JSON.parse(cached));
      }
    } catch (err) {
      // Cache not found or invalid
    }

    // 2. Fetch fresh from remote
    const response = await fetch("https://hackviet.io/api/fish/versions");
    if (!response.ok) throw new Error("Failed to fetch versions");
    
    const data = await response.json();

    // 3. Save to cache
    await fs.writeFile(CACHE_FILE, JSON.stringify(data), "utf-8");

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Fish Versions Error]:", error);
    return NextResponse.json({ error: "Failed to fetch versions" }, { status: 500 });
  }
}
