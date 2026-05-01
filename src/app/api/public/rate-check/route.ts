import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const MAX_REQUESTS = 30
const WINDOW_SECONDS = 10
const VIOLATIONS_BEFORE_BAN = 3
const INTERNAL_HEADER = "x-shoponeplay-rate-check"
const internalSecret = process.env.RATE_CHECK_SECRET || process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET

// In-memory violation tracker (resets on server restart)
const violations: Map<string, { count: number, firstAt: number }> = new Map()

// In-memory dedup cache: prevents duplicate logs from multiple middleware calls per page load
const recentLogs: Map<string, number> = new Map()
const DEDUP_WINDOW_MS = 5000 // 5 seconds

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")
  const realIp = req.headers.get("x-real-ip")
  return (forwarded?.split(",")[0] || realIp || "127.0.0.1").trim()
}

function limitText(value: unknown, fallback: string, maxLength: number) {
  return typeof value === "string" && value.length > 0
    ? value.slice(0, maxLength)
    : fallback
}

export async function POST(req: Request) {
  try {
    if (!internalSecret && process.env.NODE_ENV === "production") {
      return NextResponse.json({ allowed: false, reason: "MISCONFIGURED" }, { status: 500 })
    }

    if (internalSecret && req.headers.get(INTERNAL_HEADER) !== internalSecret) {
      return NextResponse.json({ allowed: false, reason: "FORBIDDEN" }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const ip = getClientIp(req)
    const path = limitText(body.path, "/", 512)
    const userAgent = limitText(body.userAgent, "Unknown", 512)

    // Log the visit — but deduplicate first
    if (ip && path) {
      const dedupKey = `${ip}:${path}`
      const lastLogged = recentLogs.get(dedupKey)
      const now = Date.now()

      if (!lastLogged || now - lastLogged > DEDUP_WINDOW_MS) {
        recentLogs.set(dedupKey, now)

        // Clean old entries every 100 entries to prevent memory leak
        if (recentLogs.size > 500) {
          for (const [key, time] of recentLogs) {
            if (now - time > DEDUP_WINDOW_MS) recentLogs.delete(key)
          }
        }

        await prisma.visitorLog.create({
          data: {
            ip,
            path,
            method: "GET",
            userAgent
          }
        }).catch(() => {})
      }
    }

    if (!ip || ip === "127.0.0.1" || ip === "::1") {
      return NextResponse.json({ allowed: true })
    }

    // 1. Check if IP is banned
    const banned = await prisma.bannedIP.findUnique({ where: { ip } })
    if (banned) {
      if (banned.expiresAt && new Date() > banned.expiresAt) {
        await prisma.bannedIP.delete({ where: { ip } })
      } else {
        return NextResponse.json({ allowed: false, reason: "BANNED", status: 403 })
      }
    }

    // 2. Count recent requests from this IP
    const windowStart = new Date(Date.now() - WINDOW_SECONDS * 1000)
    const recentCount = await prisma.visitorLog.count({
      where: {
        ip,
        createdAt: { gte: windowStart }
      }
    })

    if (recentCount > MAX_REQUESTS) {
      const now = Date.now()
      const record = violations.get(ip) || { count: 0, firstAt: now }

      if (now - record.firstAt > 60 * 60 * 1000) {
        record.count = 0
        record.firstAt = now
      }

      record.count++
      violations.set(ip, record)

      console.log(`[RATE LIMIT] IP: ${ip} | Requests: ${recentCount}/${MAX_REQUESTS} | Violations: ${record.count}/${VIOLATIONS_BEFORE_BAN}`)

      if (record.count >= VIOLATIONS_BEFORE_BAN) {
        await prisma.bannedIP.upsert({
          where: { ip },
          update: {
            reason: `Auto-banned: ${record.count} rate limit violations`,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
          create: {
            ip,
            reason: `Auto-banned: ${record.count} rate limit violations`,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          }
        })
        violations.delete(ip)
        return NextResponse.json({ allowed: false, reason: "BANNED", status: 403 })
      }

      return NextResponse.json({ allowed: false, reason: "RATE_LIMITED", status: 429 })
    }

    return NextResponse.json({ allowed: true })
  } catch (error) {
    return NextResponse.json({ allowed: true })
  }
}
