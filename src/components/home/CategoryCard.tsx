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
      className="group relative bg-card border border-border/60 rounded-xl overflow-hidden transition-all duration-500 shadow-md"
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />

        {tag && (
          <div className="absolute top-4 left-4 bg-accent px-3 py-1 rounded-lg shadow-lg">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{tag}</span>
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 bg-card">
        <div className="mb-4">
          <h3 className="text-xs md:text-sm font-bold uppercase tracking-tighter text-foreground line-clamp-1 transition-colors mb-1 group-hover:text-foreground/80">
            {title}
          </h3>
          <div className="flex items-center space-x-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-80">
            <div className="w-5 h-5 rounded-lg bg-accent/10 text-accent flex items-center justify-center transition-all duration-300">
              <ShoppingCart className="w-3 h-3" />
            </div>
            <span className="flex items-center gap-1">{t.common.sold}: <span className="text-foreground font-bold">{sold}</span></span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t.common.starting_from}</span>
            <span className="text-sm font-bold tracking-tighter text-primary">{minPrice} <span className="text-[10px]">VND</span></span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t.common.remaining}</span>
            <span className="text-sm font-bold tracking-tighter text-foreground">{remaining}</span>
          </div>
        </div>

        <div className="mt-4 md:mt-6">
          <Link href={ROUTES.SHOP_CATEGORY(slug)} className="block">
            <button className="w-full py-2.5 md:py-3.5 bg-secondary/20 border border-border/80 text-muted-foreground rounded-xl text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-all duration-300 active:scale-[0.95] group/btn flex items-center justify-center hover:bg-foreground hover:border-foreground hover:text-background">
              <span>{t.common.view_detail}</span>
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
