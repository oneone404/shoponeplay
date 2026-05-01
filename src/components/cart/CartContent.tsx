"use client"

import { useCart } from "@/providers/CartProvider"
import Navbar from "@/components/layouts/Navbar"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, ChevronLeft, Check } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUI } from "@/providers/UIProvider"
import CartItemCard from "./CartItemCard"
import CartFloatingSummary from "./CartFloatingSummary"
import PageHeader from "@/components/shared/PageHeader"
import { ROUTES } from "@/lib/routes"
import { useLanguage } from "@/providers/LanguageProvider"

export default function CartContent() {
  const { 
    items, 
    removeFromCart, 
    toggleItemSelection, 
    toggleAllSelection, 
    totalAmount, 
    selectedCount,
    loading 
  } = useCart()
  const { data: session } = useSession()
  const { addMessage } = useUI()
  const { t } = useLanguage()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const formatCurrency = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const allSelected = items.length > 0 && items.every(i => i.selected)

  const handleCheckout = async () => {
    if (selectedCount === 0) return
    
    if (!session) {
      addMessage({ type: "error", text: t.cart.checkout_login })
      router.push(ROUTES.SIGNIN)
      return
    }

    setIsCheckingOut(true)
    
    const selectedIds = items
      .filter(item => item.selected && !item.sold)
      .map(item => item.id)

    try {
      const res = await fetch(ROUTES.API.CHECKOUT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: selectedIds })
      })

      const data = await res.json()

      if (res.ok) {
        addMessage({ type: "success", text: t.cart.checkout_success })
        setTimeout(() => {
          router.push(ROUTES.ORDERS)
        }, 1500)
      } else {
        addMessage({ type: "error", text: data.error || t.cart.checkout_failed })
      }
    } catch (error) {
      addMessage({ type: "error", text: t.cart.connection_error })
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-32">
        <PageHeader 
          subtitle={t.cart.header}
          title={t.cart.title}
          highlightTitle={t.cart.subtitle}
          showBackButton={true}
        >
          <div className="flex items-center space-x-2 bg-secondary/50 px-4 py-2 rounded-xl border border-border/50 shadow-sm backdrop-blur-md w-fit">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {t.cart.items_count.replace("{count}", items.length.toString())}
            </span>
          </div>
        </PageHeader>

        <div className="max-w-5xl mx-auto px-4">

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground animate-pulse">{t.cart.loading}</p>
          </div>
        ) : items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 flex flex-col items-center justify-center text-center space-y-5"
          >
            <div className="w-24 h-24 bg-secondary rounded-[1.5rem] flex items-center justify-center relative shadow-inner">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full border-4 border-background shadow-lg flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold uppercase tracking-tight">{t.cart.empty_title}</h2>
              <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed opacity-60">
                {t.cart.empty_desc}
              </p>
            </div>
            <Link 
              href={ROUTES.SHOP}
              className="px-8 py-3.5 bg-primary text-white rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all hover:bg-primary/90"
            >
              {t.cart.continue_shopping}
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItemCard 
                  key={item.id} 
                  // @ts-ignore
                  item={item} 
                  toggleSelection={toggleItemSelection} 
                  remove={removeFromCart} 
                  formatCurrency={formatCurrency}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
        </div>
      </main>

      {items.length > 0 && (
        <CartFloatingSummary 
          totalAmount={totalAmount}
          selectedCount={selectedCount}
          itemCount={items.length}
          allSelected={allSelected}
          isCheckingOut={isCheckingOut}
          toggleAll={toggleAllSelection}
          handleCheckout={handleCheckout}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  )
}
