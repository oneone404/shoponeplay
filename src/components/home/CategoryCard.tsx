import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
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
      className="group relative bg-card border-[3px] border-border rounded-xl overflow-hidden transition-all duration-500"
    >
      <div className="aspect-[16/9] relative overflow-hidden bg-secondary shadow-none">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized={image.toLowerCase().endsWith(".gif")}
          />

          {tag && (
            <div className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm px-3 py-1 rounded-lg">
              <span className="text-[9px] font-bold text-white uppercase tracking-widest">{tag}</span>
            </div>
          )}
        </div>

      <div className="p-4 md:p-6 bg-card flex flex-col items-center">
        <div className="mb-4 flex flex-col items-center text-center">
          <h3 className="text-xs md:text-lg font-bold uppercase tracking-tight text-foreground line-clamp-1 transition-colors mb-1 group-hover:text-primary">
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-center gap-2 md:gap-3 mb-1 w-full">
          <div className="px-2 py-0.5 md:px-3 md:py-0.5 border md:border-2 border-border rounded-full flex items-center gap-1 md:gap-1.5 bg-background">
            <span className="text-[8px] md:text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase whitespace-nowrap">{t.common.sold}</span>
            <span className="text-[8px] md:text-[10px] font-black text-red-500">{sold}</span>
          </div>
          
          <div className="h-3 md:h-5 w-[1px] bg-border" />

          <div className="px-2 py-0.5 md:px-3 md:py-0.5 border md:border-2 border-border rounded-full flex items-center gap-1 md:gap-1.5 bg-background">
            <span className="text-[8px] md:text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase whitespace-nowrap">{t.common.remaining}</span>
            <span className="text-[8px] md:text-[10px] font-black text-emerald-600">{remaining}</span>
          </div>
        </div>

        <div className="mt-0 w-full max-w-[200px]">
          <Link href={ROUTES.SHOP_CATEGORY(slug)} className="block active:scale-95 transition-all">
            <img src="/images/buttons/xemtatca.png" alt="Xem Tất Cả" className="w-full h-auto object-contain mx-auto" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
