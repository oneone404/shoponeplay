import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ArrowRight, ShoppingCart } from "lucide-react"
import { ROUTES } from "@/lib/routes"
import { useLanguage } from "@/providers/LanguageProvider"

interface CategoryCardProps {
  title: string
  slug: string
  remaining: number
  sold: number
  minPrice: string
  image: string
  tag?: string
  variant?: "primary" | "accent" | "emerald"
}

export function CategoryCard({ title, slug, remaining, sold, minPrice, image, tag, variant = "primary" }: CategoryCardProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-500 shadow-md"
    >
      <div className="p-1.5 md:p-3 pb-0">
        <div className="aspect-[16/9] relative overflow-hidden rounded-2xl border-2 md:border-4 border-background shadow-sm">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized={image.toLowerCase().endsWith(".gif")}
          />

          {tag && (
            <div className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg">
              <span className="text-[9px] font-bold text-white uppercase tracking-widest">{tag}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6 bg-card">
        <div className="mb-4 flex flex-col items-center text-center">
          <h3 className="text-xs md:text-sm font-bold uppercase tracking-tighter text-foreground line-clamp-1 transition-colors mb-1 group-hover:text-foreground/80">
            {title}
          </h3>

        </div>

        <div className="flex items-center gap-1.5 mb-4 px-1 md:gap-2">
          <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-background/50 border border-border rounded-full shadow-sm md:py-2">
            <span className="text-[7px] md:text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{t.common.sold}:</span>
            <span className="text-[9px] md:text-[11px] font-black text-red-500 dark:text-red-400 leading-none">{sold}</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-background/50 border border-border rounded-full shadow-sm md:py-2">
            <span className="text-[7px] md:text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{t.common.remaining}:</span>
            <span className="text-[9px] md:text-[11px] font-black text-emerald-600 dark:text-emerald-400 leading-none">{remaining}</span>
          </div>
        </div>

        <div className="mt-4 md:mt-6">
          <Link href={ROUTES.SHOP_CATEGORY(slug)} className="block">
            <button className="w-full py-2.5 bg-secondary/50 border border-border text-foreground rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-secondary active:scale-95 transition-all shadow-sm flex items-center justify-center group/btn">
              <span>{t.common.view_detail}</span>
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
