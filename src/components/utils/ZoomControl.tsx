"use client"

import { useEffect } from "react"

export default function ZoomControl() {
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Prevent pinch zoom (more than 1 touch point)
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const now = new Date().getTime()
      // Optional: Prevent double tap zoom (tapped twice within 300ms)
      // This is often handled by browsers now but good for extra safety
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: false })
    
    // Prevent zooming via Mouse Wheel + Ctrl (for desktop browsers)
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
      }
    }
    document.addEventListener("wheel", handleWheel, { passive: false })

    // Prevent zoom via keyboard shortcuts (Ctrl + / Ctrl -)
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "=" || e.key === "-" || e.key === "0")) {
        e.preventDefault()
      }
    }
    document.addEventListener("keydown", handleKeydown)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("wheel", handleWheel)
      document.removeEventListener("keydown", handleKeydown)
    }
  }, [])

  return null
}
