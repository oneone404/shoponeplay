"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function PageLoader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Khi pathname hoặc searchParams thay đổi, ta giả lập loading nhanh
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timeout)
  }, [pathname, searchParams])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]">
      <div className="h-full bg-accent animate-progress-bar shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
      
      <style jsx>{`
        @keyframes progress-bar {
          0% { width: 0%; opacity: 1; }
          50% { width: 70%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
        .animate-progress-bar {
          animation: progress-bar 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
