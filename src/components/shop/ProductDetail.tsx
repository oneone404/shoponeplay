"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft, ShoppingCart, Zap, ShieldCheck,
  Clock, Share2, Heart, CheckCircle2, ChevronRight, X, Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import Navbar from "@/components/layouts/Navbar"
import { useUI } from "@/providers/UIProvider"
import { useRouter } from "next/navigation"

import { useCart } from "@/providers/CartProvider"
import { ROUTES } from "@/lib/routes"
import { useLanguage } from "@/providers/LanguageProvider"

export default function ProductDetail({ product }: { product: any }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const { addMessage } = useUI()
  const { buyNow, addToCart } = useCart()
  const { t } = useLanguage()
  const router = useRouter()

  const formatCurrency = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const images = product.images || ["/images/product.png"]

  const handleShare = async () => {
    const shareData = {
      title: product.categoryName,
      text: t.product.view_acc.replace("{title}", product.categoryName),
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        addMessage({ type: "success", text: t.product.copy_success })
      }
    } catch (err) {
      console.log('Lỗi khi chia sẻ', err)
    }
  }

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-8">
          <Link href="/shop" className="hover:text-primary transition-colors">{t.nav.shop}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-secondary-foreground">{product.groupName}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary">{product.categoryName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Image Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-3">
              {images.map((img: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={cn(
                    "relative aspect-[4/3] bg-secondary rounded-xl overflow-hidden cursor-pointer group drop-shadow-sm",
                    // Make the first image full width if odd number of images
                    (images.length % 2 !== 0 && idx === 0) ? "col-span-2 aspect-[16/7]" : "col-span-1"
                  )}
                >
                  <Image
                    src={img}
                    alt={`${product.categoryName} - ${t.common.image} ${idx + 1}`}
                    fill
                    priority={idx < 2}
                    sizes={
                      (images.length % 2 !== 0 && idx === 0) 
                        ? "(max-width: 1024px) 100vw, 800px" 
                        : "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px"
                    }
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    unoptimized={img.toLowerCase().endsWith(".gif")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />erating.

                  {/* Subtle hover indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    {t.product.zoom}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info (Sticky Sidebar) */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-28 bg-card p-5 md:p-6 rounded-[1.5rem] border border-border shadow-xl shadow-black/5 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="flex flex-wrap gap-1.5">
                  {product.tags?.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-widest rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary px-2.5 py-1 rounded-md border border-border">
                  ID: {product.id.slice(-6)}
                </div>
              </div>

              <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tighter leading-tight mb-4">
                {product.categoryName}
              </h1>

              <div className="flex items-end gap-2 mb-6 pb-6 border-b border-border">
                <span className="text-3xl md:text-4xl font-bold text-accent tracking-tighter drop-shadow-sm">
                  {formatCurrency(product.price)} <span className="text-xs font-bold opacity-70">VNĐ</span>
                </span>
                {product.oldPrice && (
                  <span className="text-base text-muted-foreground line-through font-bold mb-1 opacity-50">
                    {formatCurrency(product.oldPrice)} VNĐ
                  </span>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {Object.entries(product.stats).map(([label, value]: [string, any]) => (
                  <div key={label} className="bg-secondary/40 border border-border p-3 rounded-xl flex flex-col transition-colors hover:bg-secondary/80">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-1">{label}</span>
                    <span className="text-sm font-bold uppercase tracking-tight">{value}</span>
                  </div>
                ))}
                {/* Fallback stats if empty */}
                {Object.keys(product.stats).length === 0 && (
                  <div className="col-span-2 p-5 bg-secondary/20 rounded-xl border border-dashed border-border flex items-center justify-center">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">{t.product.updating_info}</p>
                  </div>
                )}
              </div>

              {/* Feature Highlights (Short Descriptions) */}
              <div className="space-y-3 mb-8 bg-background/50 p-5 rounded-2xl border border-border">
                {product.description && product.description.length > 0 ? (
                  product.description.map((desc: string, idx: number) => (
                    <div key={idx} className="flex items-center space-x-3 text-[11px] font-bold text-primary">
                      <div className="p-1.5 bg-primary/10 rounded-full"><CheckCircle2 className="w-3.5 h-3.5" /></div>
                      <span className="tracking-tight uppercase">{desc}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center space-x-3 text-[10px] font-bold text-muted-foreground/50">
                    <div className="p-1.5 bg-secondary rounded-full"><Info className="w-3.5 h-3.5" /></div>
                    <span className="tracking-widest uppercase">{t.product.updating_features}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
                <button 
                  onClick={async () => {
                    await buyNow(product);
                    router.push(ROUTES.BAG);
                  }}
                  className="flex-[2] py-3.5 bg-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg shadow-accent/20 hover:scale-[1.02] hover:shadow-accent/40 active:scale-95 transition-all"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{t.common.buy_now}</span>
                </button>
                <button 
                  onClick={() => addToCart(product)}
                  className="px-5 py-3.5 bg-secondary border border-border text-foreground rounded-xl flex items-center justify-center hover:bg-secondary/80 hover:text-primary transition-all shadow-sm"
                  title={t.nav.shop}
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all border border-transparent hover:border-border"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.product.share_acc}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Fullscreen Lightbox Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[201] hover:scale-110 active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/20 rounded-full text-white transition-all z-[201] hover:scale-110 active:scale-95"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() => setLightboxIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/20 rounded-full text-white transition-all z-[201] hover:scale-110 active:scale-95"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="relative w-full max-w-6xl aspect-[16/9] px-4 md:px-20 mx-auto flex items-center justify-center">
              <Image
                src={images[lightboxIndex]}
                alt="Fullscreen View"
                fill
                sizes="100vw"
                className="object-contain drop-shadow-2xl"
                priority
                unoptimized={images[lightboxIndex].toLowerCase().endsWith(".gif")}
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-white text-[10px] font-bold tracking-widest uppercase border border-white/10 shadow-xl">
              {t.common.image} {lightboxIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
