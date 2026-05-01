"use client"

import { motion } from "framer-motion"
import { Check, ArrowRight } from "lucide-react"
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
        <div className="bg-background border-t border-b border-muted-foreground/30 shadow-sm overflow-hidden">
          <div className="max-w-5xl mx-auto px-6 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-5 relative text-foreground">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-10 w-full md:w-auto z-10">
              {/* Select All Section */}
              <button
                onClick={() => toggleAll(!allSelected)}
                className="flex items-center space-x-3 group/all border-r border-muted-foreground/30 pr-8"
              >
                <div className={cn(
                  "w-4 h-4 rounded-sm border-[1.5px] flex items-center justify-center transition-all duration-300",
                  allSelected
                    ? "bg-primary border-primary text-white"
                    : "border-border group-hover/all:border-primary/50 bg-secondary/50"
                )}>
                  {allSelected && <Check className="w-3 h-3 stroke-[5]" />}
                </div>
                <div className="flex flex-col items-start leading-none text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover/all:text-primary transition-colors">{t.cart.select_all}</span>
                  <span className="text-[8px] font-bold text-muted-foreground/30 uppercase mt-1">{itemCount} {t.common.account}</span>
                </div>
              </button>

              {/* Total Section */}
              <div className="flex flex-col items-center md:items-start leading-none">
                <div className="flex items-center space-x-1.5 mb-1.5">
                  <div className="w-1 h-1 rounded-full bg-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{t.cart.total} ({selectedCount})</span>
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-xl md:text-2xl font-bold text-accent tracking-tighter">
                    {formatCurrency(totalAmount)}
                  </span>
                  <span className="text-[10px] font-bold text-accent opacity-50 uppercase tracking-widest">VNĐ</span>
                </div>
              </div>
            </div>

            {/* Checkout Button Section */}
            <div className="w-full md:w-auto z-10 flex justify-center">
              <button
                onClick={handleCheckout}
                disabled={selectedCount === 0 || isCheckingOut}
                className={cn(
                  "w-fit px-10 md:min-w-[180px] h-12 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center space-x-3 transition-all duration-500 font-bold uppercase tracking-[0.1em] text-[10px] md:text-xs relative overflow-hidden border border-white/10",
                  selectedCount > 0
                    ? "bg-primary text-white hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-secondary text-muted-foreground cursor-not-allowed opacity-50"
                )}
              >
                {isCheckingOut ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <div className="flex flex-col items-center leading-none">
                      <span>{t.cart.checkout_btn}</span>
                      <span className="text-[7px] md:text-[9px] opacity-60 mt-1 uppercase font-medium tracking-normal">({selectedCount} {t.common.account.toLowerCase()})</span>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-md">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </>
                )}

                {/* Shine Animation */}
                {selectedCount > 0 && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite] pointer-events-none" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
