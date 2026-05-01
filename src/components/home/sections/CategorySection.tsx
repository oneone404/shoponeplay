"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CategoryCard } from "@/components/home/CategoryCard"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/routes"
import { useLanguage } from "@/providers/LanguageProvider"

interface CategorySectionProps {
  title?: string
  highlight?: string
  subtitle?: string
  categories: any[]
  variant: "primary" | "accent" | "neutral"
  viewAllLink?: string
  className?: string
  // Optional translation keys
  tKeys?: {
    title: string;
    highlight: string;
    subtitle: string;
  }
}

export function CategorySection({
  title,
  highlight,
  subtitle,
  categories,
  variant,
  viewAllLink = ROUTES.SHOP,
  className,
  tKeys
}: CategorySectionProps) {
  const { t } = useLanguage();
  
  const accentColor = variant === "primary" ? "text-primary" : variant === "accent" ? "text-accent" : "text-foreground"
  const bgColor = variant === "accent" ? "bg-secondary/10 -mx-4 md:-mx-8 px-4 md:px-8 py-0 rounded-[32px]" : ""

  // Resolve content: either from tKeys or direct props
  const rawTitle = tKeys ? (t as any).home[tKeys.title] : title;
  const rawHighlight = tKeys ? (t as any).home[tKeys.highlight] : highlight;
  const displaySubtitle = tKeys ? (t as any).home[tKeys.subtitle] : subtitle;

  // If we have a single title from DB, we might want to highlight the last word automatically
  let finalTitle = rawTitle;
  let finalHighlight = rawHighlight;

  if (rawTitle && !rawHighlight) {
    const words = rawTitle.trim().split(" ");
    if (words.length > 1) {
      finalHighlight = words.pop();
      finalTitle = words.join(" ");
    }
  }

  return (
    <section className={cn(bgColor, className)}>
      <div className="flex flex-col items-center justify-center mb-10 px-2 text-center">
        <div className="flex flex-col items-center">
          <h2 className="text-xl md:text-2xl font-bold tracking-tighter uppercase leading-tight">
            {finalTitle} <span className={accentColor}>{finalHighlight}</span>
          </h2>
          <div className={cn("h-1 w-20 mt-3 rounded-full", variant === "primary" ? "bg-primary" : variant === "accent" ? "bg-accent" : "bg-foreground")} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-6">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              title={cat.name}
              slug={cat.slug}
              remaining={cat._count?.products || 0}
              sold={cat.totalSold || 0}
              minPrice={cat.startingPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "0"}
              image={cat.image || (variant === "primary" ? "/images/cat_play.png" : variant === "accent" ? "/images/categories/cat_rand.png" : "/images/categories/cat_service.png")}
              variant={variant === "neutral" ? "primary" : variant} // Fallback card variant
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center space-y-4 opacity-50">
            <div className={cn("w-12 h-12 border-4 rounded-full animate-spin", variant === "primary" ? "border-primary/20 border-t-primary" : variant === "accent" ? "border-accent/20 border-t-accent" : "border-foreground/20 border-t-foreground")} />
            <p className="text-sm font-bold uppercase tracking-widest">{t.home.updating_data} {finalHighlight}...</p>
          </div>
        )}
      </div>
    </section>
  )
}
