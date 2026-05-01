"use client"

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  subtitle: string
  title: string
  highlightTitle?: string
  showBackButton?: boolean
  className?: string
  children?: React.ReactNode // Right side actions
}

export default function PageHeader({
  subtitle,
  title,
  highlightTitle,
  showBackButton = false,
  className,
  children
}: PageHeaderProps) {
  const router = useRouter()

  return (
    <div className={cn("mb-8 px-4 max-w-7xl mx-auto w-full", className)}>
      {/* Small Label with Line */}
      <div className="flex items-center space-x-2 text-primary font-bold uppercase tracking-widest text-[10px] md:text-[11px] mb-2">
        <span className="w-8 h-[2px] bg-primary rounded-full"></span>
        <span className="opacity-80">{subtitle}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="p-2 md:p-2.5 bg-secondary/60 hover:bg-secondary rounded-xl transition-all active:scale-90 border border-border/40 shadow-sm"
              aria-label="Quay lại"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl md:text-3xl font-bold uppercase tracking-tighter leading-tight">
            {title} {highlightTitle && <span className="text-primary">{highlightTitle}</span>}
          </h1>
        </div>

        {/* Right side content (Filters, Badges, etc) */}
        {children && (
          <div className="w-full md:w-auto">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
