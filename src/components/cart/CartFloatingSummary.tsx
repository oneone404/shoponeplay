"use client"

import { motion } from "framer-motion"
import { Check, ArrowRight, Tag, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/providers/LanguageProvider"

interface CartFloatingSummaryProps {
  totalAmount: number
  selectedCount: number
  itemCount: number
  allSelected: boolean
  isCheckingOut: boolean
  toggleAll: (val: boolean) => void
  handleCheckout: () => void
  formatCurrency: (val: number) => string
}

export default function CartFloatingSummary({
  totalAmount,
  selectedCount,
  itemCount,
  allSelected,
  isCheckingOut,
  toggleAll,
  handleCheckout,
  formatCurrency
}: CartFloatingSummaryProps) {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 pointer-events-none">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full pointer-events-auto"
      >
        <div className="bg-background border-t border-muted-foreground/20 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-5 py-4 md:py-5 space-y-4">
            {/* Row 1: Discount Code (Placeholder) */}
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                  <Tag className="w-3 h-3 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder={t.cart.discount_placeholder || "NHẬP MÃ GIẢM GIÁ (COMMING SOON...)"} 
                  className="w-full h-9 bg-secondary/30 border border-border rounded-lg pl-9 pr-3 text-[9px] font-bold uppercase tracking-[0.1em] placeholder:opacity-30 focus:outline-none focus:border-primary/30 focus:bg-secondary/50 transition-all cursor-not-allowed"
                  disabled
                />
              </div>
              <button 
                disabled 
                className="px-5 h-9 bg-secondary border border-border text-muted-foreground/40 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all cursor-not-allowed"
              >
                {t.cart.apply_btn || "ÁP DỤNG"}
              </button>
            </div>

            {/* Row 2: Total and Action */}
            <div className="flex items-center justify-between gap-4">
              {/* Left: Select All & Total */}
              <div className="flex items-center gap-4 flex-1">
                {/* Select All Toggle */}
                <button
                  onClick={() => toggleAll(!allSelected)}
                  className="flex items-center gap-2 group/all shrink-0"
                >
                  <div className={cn(
                    "w-4.5 h-4.5 rounded-lg border-[1.5px] flex items-center justify-center transition-all duration-300",
                    allSelected
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/10"
                      : "border-border group-hover/all:border-primary/50 bg-secondary/50"
                  )}>
                    {allSelected && <Check className="w-3 h-3 stroke-[4]" />}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground group-hover/all:text-primary transition-colors h-4.5 flex items-center">TẤT CẢ</span>
                  </div>
                </button>

                <div className="h-8 w-[1px] bg-border/50" />

                {/* Total Display - Shifted right by flex-1 if needed, but here we use gap */}
                <div className="flex flex-col ml-auto sm:ml-0 mt-0.5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-accent animate-pulse" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                      {t.cart.total} ({selectedCount})
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg md:text-xl font-bold text-accent tracking-tighter">
                      {formatCurrency(totalAmount)}
                    </span>
                    <span className="text-[9px] font-bold text-accent opacity-50 uppercase tracking-widest">VNĐ</span>
                  </div>
                </div>
              </div>

              {/* Right: Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={selectedCount === 0 || isCheckingOut}
                className={cn(
                  "min-w-[110px] md:min-w-[130px] h-9 md:h-10 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 font-bold uppercase tracking-[0.1em] text-[9px] relative overflow-hidden group/btn",
                  selectedCount > 0
                    ? "bg-primary text-white hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-secondary text-muted-foreground cursor-not-allowed opacity-50 border border-border"
                )}
              >
                {isCheckingOut ? (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="relative z-10">{t.common.buy_now || "MUA NGAY"} {selectedCount > 0 && `(${selectedCount})`}</span>
                )}

                {/* Animated Background Pulse for Active Button */}
                {selectedCount > 0 && !isCheckingOut && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shine_1.5s_infinite] pointer-events-none" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
