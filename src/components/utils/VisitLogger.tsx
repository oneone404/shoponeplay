"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function VisitLogger() {
  const pathname = usePathname()

  useEffect(() => {
    // Không log các đường dẫn API hoặc file tĩnh
    if (
      pathname.startsWith("/api") || 
      pathname.startsWith("/_next") || 
      pathname.includes(".")
    ) return

    // Dùng sessionStorage để chặn trùng lặp giữa nhiều lần mount
    const logKey = `visit_logged_${pathname}_${Math.floor(Date.now() / 3000)}`
    if (sessionStorage.getItem(logKey)) return
    sessionStorage.setItem(logKey, "1")

    fetch("/api/public/log-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        userAgent: navigator.userAgent,
        method: "GET"
      }),
    }).catch(() => {})
  }, [pathname])

  return null
}
