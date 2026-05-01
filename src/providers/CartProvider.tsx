"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useUI } from "./UIProvider"
import { useSession } from "next-auth/react"
import { ROUTES } from "@/lib/routes"
import { useLanguage } from "./LanguageProvider"

export interface CartItem {
  id: string
  title: string
  price: number
  thumbnail?: string
  type: string
  categoryName?: string
  selected: boolean
  sold?: boolean
  quantity: number
  stock: number
  description?: string | null
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: any, quantity?: number) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  toggleItemSelection: (id: string) => Promise<void>
  toggleAllSelection: (selected: boolean) => Promise<void>
  clearCart: () => void
  totalAmount: number
  selectedCount: number
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { addMessage } = useUI()
  const { data: session, status } = useSession()
  const { t } = useLanguage()

  // 1. Fetch data based on Auth Status
  const fetchCart = useCallback(async () => {
    setLoading(true)
    if (status === "authenticated") {
      try {
        const res = await fetch(ROUTES.API.BAG)
        if (res.ok) {
          const data = await res.json()
          setItems(data)
        }
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng từ DB:", error)
      }
    } else if (status === "unauthenticated") {
      const savedCart = localStorage.getItem("shoponeplay-bag")
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (e) {
          console.error("Lỗi khi parse giỏ hàng storage:", e)
        }
      }
    }
    setLoading(false)
  }, [status])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // 2. Sync LocalStorage to DB when just logged in
  useEffect(() => {
    const syncGuestCartToDB = async () => {
      if (status === "authenticated") {
        const guestCart = localStorage.getItem("shoponeplay-bag")
        if (guestCart) {
          try {
            const guestItems = JSON.parse(guestCart) as CartItem[]
            if (guestItems.length > 0) {
              // Push each item to DB
              for (const item of guestItems) {
                await fetch(ROUTES.API.BAG, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ productId: item.id, quantity: item.quantity })
                })
              }
              // Clear guest cart
              localStorage.removeItem("shoponeplay-bag")
              // Re-fetch clean cart from DB
              fetchCart()
            }
          } catch (e) {
            console.error("Lỗi sync giỏ hàng:", e)
          }
        }
      }
    }
    syncGuestCartToDB()
  }, [status, fetchCart])

  // 3. Save to LocalStorage ONLY for guests
  useEffect(() => {
    if (status === "unauthenticated") {
      localStorage.setItem("shoponeplay-bag", JSON.stringify(items))
    }
  }, [items, status])

  const addToCart = async (product: any, quantity: number = 1) => {
    // Check if already in current state
    const existingItem = items.find((item) => item.id === product.id)
    
    if (existingItem && product.type !== "RANDOM") {
      addMessage({ type: "error", text: t.cart.already_in_cart })
      return
    }

    if (status === "authenticated") {
      try {
        const res = await fetch(ROUTES.API.BAG, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id, quantity })
        })
        const data = await res.json()
        
        if (res.ok) {
          fetchCart() 
          addMessage({ 
            type: "success", 
            text: product.type === "RANDOM" 
              ? t.cart.added_multiple_success.replace("{quantity}", quantity.toString())
              : t.cart.added_success
          })
        } else {
          addMessage({ 
            type: "error", 
            text: data.type === "limit" ? t.cart.stock_limit : t.cart.add_failed
          })
        }
      } catch (error) {
        addMessage({ type: "error", text: t.cart.connection_err })
      }
    } else {
      // Guest logic
      if (existingItem) {
        if (product.type === "RANDOM") {
          const newQty = existingItem.quantity + quantity
          const maxStock = product.stock || 999
          
          if (newQty <= maxStock) {
            setItems(prev => prev.map(item => 
              item.id === product.id ? { ...item, quantity: newQty } : item
            ))
            addMessage({ type: "success", text: t.cart.added_multiple_success.replace("{quantity}", quantity.toString()) })
          } else {
            addMessage({ type: "error", text: t.cart.stock_limit })
          }
        }
      } else {
        const newItem: CartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail || product.images?.[0],
          type: product.type,
          categoryName: product.categoryName,
          selected: true,
          quantity: quantity,
          stock: product.stock || 1,
          description: product.description
        }
        setItems(prev => [...prev, newItem])
        addMessage({ type: "success", text: product.type === "RANDOM" ? t.cart.added_multiple_success.replace("{quantity}", quantity.toString()) : t.cart.added_success })
      }
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    const item = items.find(i => i.id === id)
    if (!item || item.type !== "RANDOM") return

    if (quantity < 1 || quantity > item.stock) return

    // Optimistic update
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i))

    if (status === "authenticated") {
      try {
        const res = await fetch(ROUTES.API.BAG, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id, quantity })
        })
        if (!res.ok) {
          // Revert on error
          fetchCart()
          const data = await res.json()
          addMessage({ type: "error", text: data.error || "Không thể cập nhật số lượng" })
        }
      } catch (error) {
        fetchCart()
      }
    }
  }

  const removeFromCart = async (id: string) => {
    if (status === "authenticated") {
      try {
        const res = await fetch(`/api/shop/bag?productId=${id}`, {
          method: "DELETE"
        })
        if (res.ok) {
          setItems(prev => prev.filter(item => item.id !== id))
        }
      } catch (error) {
        console.error("Lỗi xóa giỏ hàng DB:", error)
      }
    } else {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const toggleItemSelection = async (id: string) => {
    // Optimistic update
    const currentItem = items.find(i => i.id === id)
    if (!currentItem) return

    const newSelected = !currentItem.selected
    setItems(prev => prev.map(item => item.id === id ? { ...item, selected: newSelected } : item))

    if (status === "authenticated") {
      try {
        await fetch(ROUTES.API.BAG, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id, selected: newSelected })
        })
      } catch (error) {
        console.error("Lỗi sync selection DB:", error)
      }
    }
  }

  const toggleAllSelection = async (selected: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected })))

    if (status === "authenticated") {
      try {
        await fetch(ROUTES.API.BAG, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ all: selected })
        })
      } catch (error) {
        console.error("Lỗi sync all selection DB:", error)
      }
    }
  }

  const clearCart = () => {
    setItems([])
    if (status === "unauthenticated") {
      localStorage.removeItem("shoponeplay-cart")
    }
  }

  const totalAmount = items
    .filter((item) => item.selected && !item.sold)
    .reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const selectedCount = items
    .filter((item) => item.selected && !item.sold)
    .reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleItemSelection,
        toggleAllSelection,
        clearCart,
        totalAmount,
        selectedCount,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
