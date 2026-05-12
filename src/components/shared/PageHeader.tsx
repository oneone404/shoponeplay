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
  centered?: boolean
  children?: React.ReactNode // Right side actions
}

export default function PageHeader({
  subtitle,
  title,
  highlightTitle,
  showBackButton = false,
  className,
  centered = false,
  children
}: PageHeaderProps) {
  const router = useRouter()

  return (
    <div className={cn(
      "mb-8 px-4 max-w-7xl mx-auto w-full",
      centered && "flex flex-col items-center text-center",
      className
    )}>
      {/* Small Label with Line */}
      <div className={cn(
        "flex items-center space-x-2 text-primary font-bold uppercase tracking-widest text-[10px] md:text-[11px] mb-2",
        centered && "justify-center"
      )}>
        <span className="w-8 h-[2px] bg-primary rounded-full"></span>
        <span className="opacity-80">{subtitle}</span>
        {centered && <span className="w-8 h-[2px] bg-primary rounded-full"></span>}
      </div>

      <div className={cn(
        "flex flex-col gap-6",
        centered ? "items-center" : "md:flex-row md:items-start justify-between"
      )}>
        <div className={cn(
          "flex items-center space-x-4",
          centered && "justify-center"
        )}>
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="p-2 md:p-2.5 bg-secondary/60 hover:bg-secondary rounded-xl transition-all active:scale-90 border border-border/40 shadow-sm"
              aria-label="Quay lại"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg md:text-2xl font-bold uppercase tracking-tighter leading-tight">
            {title} {highlightTitle && <span className="text-primary">{highlightTitle}</span>}
          </h1>
        </div>

        {/* Right side content (Filters, Badges, etc) */}
        {children && (
          <div className={cn(
            "w-full md:w-auto",
            centered && "flex justify-center"
          )}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
