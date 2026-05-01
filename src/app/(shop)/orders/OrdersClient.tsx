"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/layouts/Navbar"
import { motion } from "framer-motion"
import { Package, CheckCircle2, Copy } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { useLanguage } from "@/providers/LanguageProvider"
import Image from "next/image"

interface Order {
  id: string
  totalAmount: number
  status: string
  createdAt: string
  items: any[]
}

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { addMessage } = useUI()
  const { t, language } = useLanguage()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/shop/orders")
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
        }
      } catch (error) {
        console.error("Lỗi tải đơn hàng:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    addMessage({ type: "success", text: t.common.copy_success })
  }

  const formatCurrency = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20 px-4 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-primary font-bold uppercase tracking-widest text-[9px] mb-2">
            <span className="w-6 h-[1.5px] bg-primary"></span>
            <span>{t.common.my_account}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter">
            {t.orders.title.split(" ")[0]} <span className="text-primary">{t.orders.title.split(" ").slice(1).join(" ")}</span>
          </h1>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground animate-pulse">{t.common.loading}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center bg-secondary/20 rounded-3xl border border-dashed border-border/50">
            <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">{t.orders.empty_desc}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/40 border border-border/60 rounded-3xl overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 md:p-6 bg-secondary/30 border-b border-border/60 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{t.orders.order_id}</div>
                      <div className="text-xs font-bold uppercase text-accent">{order.id.slice(-12)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{t.orders.purchase_date}</div>
                      <div className="text-xs font-bold">
                        {new Date(order.createdAt).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{t.orders.order_total}</div>
                      <div className="text-sm font-bold text-primary">{formatCurrency(order.totalAmount)} <span className="text-[10px]">đ</span></div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 md:p-6 space-y-6">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-6 relative rounded-lg overflow-hidden border border-border/40">
                             <Image src={item.product?.thumbnail || "/images/product.png"} fill alt="TH" className="object-cover" />
                           </div>
                           <div>
                             <h3 className="text-xs font-bold uppercase tracking-tight">{item.titleSnapshot}</h3>
                             <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">{t.common.quantity}: {item.quantity}</p>
                           </div>
                        </div>
                      </div>

                      {/* Delivered Secrets Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {item.deliveredSecrets.map((secret: any, sIdx: number) => (
                          <div key={secret.id} className="bg-secondary/40 p-3 rounded-2xl border border-border/40 hover:border-primary/30 transition-colors group">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[8px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {t.orders.account_index.replace("{n}", (sIdx + 1).toString())}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">{t.common.username}:</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-mono font-bold text-accent">{secret.username}</span>
                                  <button onClick={() => copyToClipboard(secret.username)} className="p-1 hover:bg-primary/10 rounded text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">{t.common.password}:</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-mono font-bold text-accent">{secret.password}</span>
                                  <button onClick={() => copyToClipboard(secret.password)} className="p-1 hover:bg-primary/10 rounded text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
