import { NextResponse } from "next/server"
import { auth } from "@/auth"
import os from "os"
import packageJson from "../../../../../package.json"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check DB status
    let dbStatus = "Connected"
    try {
      await prisma.$queryRaw`SELECT 1`
    } catch (e) {
      dbStatus = "Disconnected"
    }

    // Get Traffic Stats (Simulated or from DB)
    const totalUsers = await prisma.user.count()
    const todayOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })

    // Get IP Info
    const networkInterfaces = os.networkInterfaces()
    const localIp = Object.values(networkInterfaces)
      .flat()
      .find(iface => iface?.family === 'IPv4' && !iface.internal)?.address || "127.0.0.1"

    // CPU Usage (Calculated from times)
    const cpus = os.cpus()
    const cpuUsage = cpus.map(cpu => {
      const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0)
      const usage = 100 - (100 * cpu.times.idle / total)
      return usage
    })
    const avgCpuUsage = cpuUsage.reduce((a, b) => a + b, 0) / cpuUsage.length

    const systemInfo = {
      version: process.env.NEXT_PUBLIC_APP_VERSION || packageJson.version || "1.0.0",
      nextVersion: packageJson.dependencies.next.replace("^", ""),
      prismaVersion: packageJson.dependencies["@prisma/client"].replace("^", ""),
      nodeVersion: process.version,
      platform: `${os.type()} ${os.release()} (${os.arch()})`,
      uptime: formatUptime(process.uptime()),
      memory: formatMemory(process.memoryUsage().heapUsed),
      osMemory: `${formatMemory(os.freemem())} / ${formatMemory(os.totalmem())} (Free)`,
      env: process.env.NODE_ENV,
      cpuCount: os.cpus().length,
      cpuModel: os.cpus()[0].model,
      cpuUsage: `${avgCpuUsage.toFixed(1)}%`,
      dbStatus,
      localIp,
      traffic: {
        totalUsers,
        todayOrders
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      serverTime: new Date().toLocaleTimeString('vi-VN'),
      lastUpdate: new Date().toISOString()
    }

    return NextResponse.json(systemInfo)
  } catch (error) {
    console.error("System info error:", error)
    return NextResponse.json({ error: "Failed to fetch system info" }, { status: 500 })
  }
}

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  
  const parts = []
  if (d > 0) parts.push(`${d}d`)
  if (h > 0) parts.push(`${h}h`)
  if (m > 0) parts.push(`${m}m`)
  parts.push(`${s}s`)
  
  return parts.join(" ")
}

function formatMemory(bytes: number) {
  const gb = bytes / 1024 / 1024 / 1024
  if (gb >= 1) return `${gb.toFixed(2)} GB`
  const mb = bytes / 1024 / 1024
  return `${mb.toFixed(2)} MB`
}
