"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Check, Trash2, AlertCircle, Minus, Plus, ZoomIn } from "lucide-react"
import ImageLightbox from "@/components/admin/products/ImageLightbox"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useCart } from "@/providers/CartProvider"
import { ROUTES } from "@/lib/routes"
import { useLanguage } from "@/providers/LanguageProvider"

interface CartItem {
  id: string
  title: string
  price: number
  thumbnail: string | null
  categoryName: string
  type: string
  sold: boolean
  selected: boolean
  quantity: number
  stock: number
  description: string | null
}

interface CartItemCardProps {
  item: CartItem
  toggleSelection: (id: string) => void
  remove: (id: string) => void
  formatCurrency: (amount: number) => string
}

export default function CartItemCard({
  item,
  toggleSelection,
  remove,
  formatCurrency
}: CartItemCardProps) {
  const { updateQuantity } = useCart()
  const { t } = useLanguage()
  const [previewImage, setPreviewImage] = useState<{ src: string, alt: string } | null>(null)

  const handleMinus = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1)
    }
  }

  const handlePlus = () => {
    if (item.quantity < item.stock) {
      updateQuantity(item.id, item.quantity + 1)
    }
  }

  const [localQty, setLocalQty] = useState<string | number>(item.quantity)

  useEffect(() => {
    setLocalQty(item.quantity)
  }, [item.quantity])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === "") {
      setLocalQty("")
      return
    }

    let num = parseInt(val)
    if (isNaN(num)) return

    const maxStock = item.stock || 1
    if (num > maxStock) num = maxStock
    
    setLocalQty(num)
    if (num >= 1) {
      updateQuantity(item.id, num)
    }
  }

  const handleBlur = () => {
    if (localQty === "" || (typeof localQty === "number" && localQty < 1)) {
      setLocalQty(1)
      updateQuantity(item.id, 1)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={cn(
        "group relative bg-card/60 border rounded-xl transition-all duration-300",
        item.selected 
          ? "border-primary/40 bg-primary/[0.02]" 
          : "border-border/80",
        item.sold && "grayscale opacity-50"
      )}
    >
      <div className="flex items-center p-2 md:p-3 gap-3 md:gap-4">
        {/* Multi-select Checkbox */}
        <button
          onClick={() => !item.sold && toggleSelection(item.id)}
          disabled={item.sold}
          className={cn(
            "w-4 h-4 rounded-sm border-[1.5px] flex items-center justify-center transition-all shrink-0",
            item.selected 
              ? "bg-primary border-primary text-white shadow-sm" 
              : "border-border hover:border-primary/40 bg-secondary/50"
          )}
        >
          {item.selected && <Check className="w-3 h-3 stroke-[5]" />}
        </button>

        {item.type === "PLAY" ? (
          <div className="relative group/img shrink-0">
            <Link 
              href={ROUTES.PRODUCT_DETAIL(item.id)}
              className="relative block w-16 h-10 md:w-20 md:h-12 rounded-lg overflow-hidden bg-secondary/30 border border-border/30"
            >
              <Image
                src={item.thumbnail || "/images/product.png"}
                alt={item.title}
                fill
                sizes="80px"
                className="object-cover transition-transform duration-700 group-hover/img:scale-110"
              />
              {item.sold && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="text-[7px] font-bold text-white uppercase tracking-tighter">Hết</span>
                </div>
              )}
            </Link>
            {!item.sold && (
              <button
                onClick={() => setPreviewImage({ src: item.thumbnail || "/images/product.png", alt: item.title })}
                className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center z-10"
              >
                <ZoomIn className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        ) : (
          <div className="relative group/img shrink-0">
            <div className="relative w-16 h-10 md:w-20 md:h-12 rounded-lg overflow-hidden bg-secondary/30 border border-border/30">
              <Image
                src={item.thumbnail || "/images/product.png"}
                alt={item.title}
                fill
                sizes="80px"
                className="object-cover transition-transform duration-700 group-hover/img:scale-110"
              />
              {item.sold && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="text-[7px] font-bold text-white uppercase tracking-tighter">Hết</span>
                </div>
              )}
            </div>
            {!item.sold && (
              <button
                onClick={() => setPreviewImage({ src: item.thumbnail || "/images/product.png", alt: item.title })}
                className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center z-10"
              >
                <ZoomIn className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col h-full justify-center">

            {item.type === "PLAY" ? (
              <Link 
                href={ROUTES.PRODUCT_DETAIL(item.id)}
                className="text-[10px] md:text-xs font-bold uppercase tracking-tight truncate leading-tight hover:text-primary transition-colors pr-2"
              >
                {item.title}
              </Link>
            ) : (
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-tight truncate leading-tight pr-2">
                {item.title}
              </div>
            )}

            {/* Quantity/Stock for RANDOM OR Description for PLAY */}
            {item.type === "RANDOM" ? (
              !item.sold && (
                <>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 mt-0.5 block">{t.common.stock}: {item.stock} {t.common.account}</span>
                  <div className="flex items-center mt-1.5">
                    <div className="flex items-center bg-secondary/50 rounded-lg border border-border/40 p-0.5">
                      <button 
                        onClick={handleMinus}
                        disabled={item.quantity <= 1}
                        className="p-1 hover:bg-background rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <input 
                        type="number"
                        value={localQty}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className="w-10 bg-transparent text-center text-[10px] font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:text-primary transition-colors"
                      />
                      <button 
                        onClick={handlePlus}
                        disabled={item.quantity >= item.stock}
                        className="p-1 hover:bg-background rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </>
              )
            ) : (
              item.description && (
                <p className="mt-1.5 text-[9px] text-muted-foreground italic line-clamp-2 leading-relaxed opacity-70">
                  {item.description}
                </p>
              )
            )}
          </div>
        </div>

        {/* Item Total & Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-bold text-accent tracking-tighter block">
                {formatCurrency(item.price * item.quantity)}
                <span className="text-[8px] md:text-[10px] ml-1 opacity-50 font-medium">VNĐ</span>
              </span>
              {item.quantity > 1 && (
                <span className="text-[7px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                  {formatCurrency(item.price)} / acc
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={() => remove(item.id)}
            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all active:scale-90 border border-transparent hover:border-red-500/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {previewImage && (
        <ImageLightbox
          src={previewImage.src}
          alt={previewImage.alt}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </motion.div>
  )
}
