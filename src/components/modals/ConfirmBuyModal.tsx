"use client"

import { AlertCircle, Wallet, X, ShoppingCart, Loader2, Minus, Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useUI } from "@/providers/UIProvider"
import { ROUTES } from "@/lib/routes"
import { useLanguage } from "@/providers/LanguageProvider"
import { cn } from "@/lib/utils"

interface ConfirmBuyModalProps {
  isOpen: boolean
  onClose: () => void
  product: any
  quantity: number
}

export default function ConfirmBuyModal({ isOpen, onClose, product, quantity }: ConfirmBuyModalProps) {
  const { data: session } = useSession()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [localQuantity, setLocalQuantity] = useState(quantity)
  const { addMessage, setDepositOpen } = useUI()
  const router = useRouter()

  useEffect(() => {
    setLocalQuantity(quantity)
  }, [quantity, isOpen])

  if (!isOpen) return null

  const totalAmount = product.price * localQuantity
  const currentBalance = (session?.user as any)?.balance || 0
  const isEnough = currentBalance >= totalAmount

  const handleMinus = () => {
    if (localQuantity > 1) setLocalQuantity(prev => prev - 1)
  }

  const handlePlus = () => {
    const maxStock = product.stock || 999
    if (localQuantity < maxStock) setLocalQuantity(prev => prev + 1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setLocalQuantity(0)
      return
    }
    const num = parseInt(value)
    if (!isNaN(num)) {
      const maxStock = product.stock || 999
      setLocalQuantity(Math.min(num, maxStock))
    }
  }

  const handleBlur = () => {
    if (localQuantity < 1) setLocalQuantity(1)
  }

  const handleConfirm = async () => {
    if (!session) {
      router.push(ROUTES.SIGNIN)
      onClose()
      return
    }

    if (!isEnough) {
      addMessage({ type: "error", text: t.product.insufficient_balance })
      return
    }

    setLoading(true)
    try {
      const res = await fetch(ROUTES.API.CHECKOUT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          directPurchase: {
            productId: product.id,
            quantity: localQuantity
          }
        })
      })

      const data = await res.json()

      if (res.ok) {
        addMessage({ type: "success", text: t.cart.checkout_success })
        router.push(ROUTES.ORDERS)
        onClose()
      } else {
        addMessage({ type: "error", text: data.error || t.cart.checkout_failed })
      }
    } catch (error) {
      addMessage({ type: "error", text: t.cart.connection_error })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with CSS Animation */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 animate-modal-backdrop-clean"
      />

      {/* Modal Content with CSS Animation */}
      <div
        className="relative w-full max-w-sm bg-card border border-border shadow-2xl rounded-3xl overflow-hidden animate-modal-content"
      >
        {/* Header */}
        <div className="p-5 pb-0 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-3.5 h-3.5 text-primary" />
            </div>
            <h2 className="text-[14px] font-bold uppercase tracking-tighter opacity-80">{t.product.confirm_checkout}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Info Card */}
          <div className="bg-secondary/30 rounded-2xl p-4 border border-border/50">
            <div className="flex flex-col space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{t.common.product}</span>
                <div className="flex flex-col space-y-0.5">
                  <h3 className="text-[14px] font-bold uppercase leading-tight line-clamp-2">{product.categoryName}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{t.common.quantity}:</span>
                    
                    {product.type === "RANDOM" ? (
                      <div className="flex items-center bg-background border border-border/60 rounded-xl p-1 shadow-inner">
                        <button
                          onClick={handleMinus}
                          disabled={localQuantity <= 1}
                          className="w-7 h-7 flex items-center justify-center hover:bg-secondary rounded-lg transition-colors disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={localQuantity === 0 ? "" : localQuantity}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className="w-12 bg-transparent text-center text-[13px] font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          onClick={handlePlus}
                          disabled={localQuantity >= (product.stock || 999)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-secondary rounded-lg transition-colors disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[13px] font-bold text-primary tracking-tighter">×{localQuantity.toString().padStart(2, '0')}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-border/40 w-full" />

              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{t.cart.total}</span>
                <div className="text-xl font-bold text-primary tracking-tighter">
                  {formatCurrency(totalAmount)} <span className="text-[11px] opacity-70">VNĐ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Status */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${isEnough ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
            }`}>
            <div className="flex items-center space-x-2.5">
              <Wallet className={`w-4 h-4 ${isEnough ? 'text-emerald-500' : 'text-red-500'}`} />
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">{t.product.current_balance}</p>
                <p className="text-[12px] font-bold">{formatCurrency(currentBalance)} VNĐ</p>
              </div>
            </div>
            {!isEnough && (
              <button 
                onClick={() => {
                  if (!session) {
                    router.push(ROUTES.SIGNIN)
                    onClose()
                  } else {
                    setDepositOpen(true)
                  }
                }}
                className="flex items-center space-x-1 text-red-500 hover:text-red-400 group transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase transition-colors">{t.product.insufficient_label}</span>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 bg-secondary text-muted-foreground rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-secondary/80 transition-all"
            >
              {t.common.cancel}
            </button>
            <button
              disabled={!isEnough || loading}
              onClick={handleConfirm}
              className="flex-[1.8] py-3.5 bg-primary text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{t.product.confirm_buy_now}</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
