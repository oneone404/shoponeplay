"use client"

import { useState, useTransition, useMemo, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Search, Gamepad2, Package, AlertCircle, Loader2, ChevronRight, Zap, ShieldCheck, Gem, Star, X, Info, Plus, User } from "lucide-react"
import { getNapGameConfig, updateUserAccountId, removeSavedAccountId } from "@/app/admin/settings/napgame/actions"
import { cn } from "@/lib/utils"
import { useUI } from "@/providers/UIProvider"
import PageHeader from "@/components/shared/PageHeader"
import Navbar from "@/components/layouts/Navbar"

interface Product {
  sellingProductID: string
  productName: string
  image: string
  description: string
  productGroup: string
  prices: {
    VND: {
      price: number
    }
  }
}

interface TopupProductConfig {
  id: string
  name: string
  vngProductId: string
  sellPrice: number
  enabled: boolean
}

interface NapGameClientProps {
  initialHotConfig: any[]
  logoUrl?: string
  topupProducts?: TopupProductConfig[]
}

export default function NapGameClient({ initialHotConfig, logoUrl, topupProducts = [] }: NapGameClientProps) {
  const { data: session, status, update } = useSession()
  const searchParams = useSearchParams()
  const { addMessage } = useUI()
  const [isPending, startTransition] = useTransition()
  const [userId, setUserId] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [character, setCharacter] = useState<{ name: string, server: string, id: string } | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("Khuyến Mãi")
  const [hotConfig, setHotConfig] = useState<any[]>(initialHotConfig)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [savedIds, setSavedIds] = useState<{ id: string, name: string }[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [switchingId, setSwitchingId] = useState<string | null>(null)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [newIdInput, setNewIdInput] = useState("")
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isGuest, setIsGuest] = useState(true)
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [bulkIdsInput, setBulkIdsInput] = useState("")
  const [confirmingProduct, setConfirmingProduct] = useState<Product | null>(null)
  const lastSearchedId = useRef<string | null>(null)
  const [topupOrderId, setTopupOrderId] = useState<string | null>(null)
  const [topupStatus, setTopupStatus] = useState<string | null>(null)

  const DEFAULT_ID = "FKAD-BUZL-LMGY"

  const groupMapping: Record<string, string> = {
    "G1": "Đá Quý",
    "G4": "Thẻ Ngày",
    "G16": "ORBIT",
    "G6": "Gói Chủ Đề",
    "G13": "Cung Hoàng Đạo",
    "G17": "Nông Trại",
    "G3": "Bốc Thăm",
    "G8": "Đặc Biệt",
    "G5": "Khuyến Mãi",
  }

  const performSearch = useCallback(async (id: string, showToast = true) => {
    if (!id) return

    startTransition(async () => {
      try {
        const response = await fetch("/api/proxy/vng-products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: id })
        })

        const result = await response.json()

        if (result.success && result.data?.products) {
          const productList = Object.values(result.data.products) as Product[]
          setProducts(productList)
          setCharacter(result.character)
          setHasSearched(true)

          const isGuestAccount = id === DEFAULT_ID
          setIsGuest(isGuestAccount)

          if (session?.user && !isGuestAccount) {
            await updateUserAccountId(id, result.character?.name)
            await update()
            setSavedIds(prev => {
              const exists = prev.find(item => item.id === id)
              if (exists) {
                return prev.map(item => item.id === id ? { ...item, name: result.character?.name } : item)
              }
              return [...prev, { id, name: result.character?.name }]
            })
            setUserId(id)
          }

          // Set default tab based on priority
          const currentGroups = productList.map(p => groupMapping[p.productGroup] || "Khác")
          if (currentGroups.includes("Khuyến Mãi")) {
            setActiveTab("Khuyến Mãi")
          } else if (currentGroups.includes("Thẻ Ngày")) {
            setActiveTab("Thẻ Ngày")
          } else if (currentGroups.includes("ORBIT")) {
            setActiveTab("ORBIT")
          } else if (currentGroups.length > 0) {
            setActiveTab(currentGroups[0])
          }

          if (showToast) {
            addMessage({ type: "success", text: `Xác nhận nhân vật: ${result.character?.name || "Thành công"}` })
          }
          setShowSearch(false)
          setSwitchingId(null)
          setNewIdInput("")
          setIsAddingNew(false)
          if (showToast) setIsAccountModalOpen(false)

          // Load hot config in background without blocking
          getNapGameConfig().then(config => {
            if (config?.hotItems) setHotConfig(config.hotItems)
          }).catch(() => {})

        } else {
          addMessage({ type: "error", text: result.message || "Không tìm thấy thông tin nhân vật" })
          setSwitchingId(null)
          if (id === DEFAULT_ID) setHasSearched(false)
        }
      } catch (error) {
        console.error("Search Error:", error)
        addMessage({ type: "error", text: "Lỗi kết nối máy chủ" })
        setSwitchingId(null)
      }
    })
  }, [addMessage, DEFAULT_ID, session, groupMapping])

  // Load saved ID on mount (Cloud)
  useEffect(() => {
    if (status === "loading") return

    const cloudId = (session?.user as any)?.accountId
    const urlId = searchParams.get("accountId")
    const sessionSavedIds = (session?.user as any)?.savedAccountIds || []
    setSavedIds(sessionSavedIds)

    // Target ID to fetch: urlId if exists (F5/External Link), then cloudId, otherwise DEFAULT_ID
    const targetId = urlId || cloudId || DEFAULT_ID

    if (targetId !== lastSearchedId.current) {
      setUserId(targetId)
      performSearch(targetId, false)
      lastSearchedId.current = targetId
    }
  }, [session, status, searchParams, performSearch])

  const handleLogout = async () => {
    if (session?.user) {
      await updateUserAccountId("") // Clear active on cloud
    }
    setUserId(DEFAULT_ID)
    performSearch(DEFAULT_ID, false)
    addMessage({ type: "success", text: "Đã đăng xuất tài khoản" })
  }

  const handleRemoveId = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!session?.user) return

    const result = await removeSavedAccountId(id)
    if (result.success) {
      await update()
      setSavedIds(prev => prev.filter(item => item.id !== id))
      if (userId === id) {
        handleLogout()
      }
      addMessage({ type: "success", text: "Đã xóa ID khỏi danh sách" })
    }
  }

  const handlePurchase = async (product: Product) => {
    if (!isBulkMode && (isGuest || !character)) {
      addMessage({ type: "error", text: "Vui lòng đăng nhập ID nhân vật trước khi nạp" })
      setIsAccountModalOpen(true)
      return
    }

    // We allow opening the modal even if bulk IDs are empty, 
    // so the user can enter them inside the modal.
    // Validation will happen in executePurchase.

    if (!session?.user) {
      addMessage({ type: "error", text: "Vui lòng đăng nhập tài khoản Shop để tiếp tục" })
      return
    }

    setSelectedProduct(null)
    setConfirmingProduct(product)
  }

  const bulkIds = useMemo(() => {
    return bulkIdsInput.split('\n').map(id => id.trim()).filter(id => id.length > 0)
  }, [bulkIdsInput])

  // Tim TopupProduct tuong ung voi san pham VNG hien tai
  const findTopupProduct = useCallback((product: Product) => {
    return topupProducts.find(tp => 
      tp.enabled && tp.vngProductId === product.sellingProductID
    )
  }, [topupProducts])

  const executePurchase = async () => {
    if (!confirmingProduct) return
    
    if (isBulkMode && bulkIds.length === 0) {
      addMessage({ type: "error", text: "Vui lòng nhập ít nhất một ID nhân vật" })
      return
    }

    const topupProduct = findTopupProduct(confirmingProduct)

    startTransition(async () => {
      try {
        if (isBulkMode) {
          // Nap nhieu ID
          for (const id of bulkIds) {
            addMessage({ type: "info", text: `Dang xu ly nap cho ID: ${id}...` })
            if (topupProduct) {
              // Nap tu dong qua API
              const res = await fetch("/api/topup/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  topupProductId: topupProduct.id,
                  roleId: id,
                  roleName: id,
                  serverId: character?.server || "2"
                })
              })
              const data = await res.json()
              if (data.success) {
                addMessage({ type: "success", text: `Da gui don nap cho ID ${id}` })
                setTopupOrderId(data.orderId)
              } else {
                addMessage({ type: "error", text: `Loi nap ID ${id}: ${data.error}` })
              }
            }
          }
        } else {
          // Nap 1 ID
          if (topupProduct && character) {
            addMessage({ type: "info", text: "Dang tao don nap tu dong..." })
            const res = await fetch("/api/topup/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                topupProductId: topupProduct.id,
                roleId: character.id,
                roleName: character.name,
                serverId: character.server
              })
            })
            const data = await res.json()
            if (data.success) {
              setTopupOrderId(data.orderId)
              setTopupStatus("PENDING")
              addMessage({ type: "success", text: "Don hang da tao! He thong dang nap tu dong..." })
            } else {
              addMessage({ type: "error", text: data.error || "Loi tao don nap" })
            }
          } else {
            addMessage({ type: "warning", text: "San pham nay chua ho tro nap tu dong" })
          }
        }
        setConfirmingProduct(null)
        setSelectedProduct(null)
      } catch (error) {
        addMessage({ type: "error", text: "Da co loi xay ra khi thuc hien nap" })
      }
    })
  }

  // Polling trang thai don nap tu dong
  useEffect(() => {
    if (!topupOrderId) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/topup/status?orderId=${topupOrderId}`)
        const data = await res.json()
        if (data.success) {
          setTopupStatus(data.order.status)
          if (data.order.status === "COMPLETED") {
            addMessage({ type: "success", text: `Nap thanh cong cho ${data.order.roleName}!` })
            setTopupOrderId(null)
            setTopupStatus(null)
          } else if (data.order.status === "ERROR" || data.order.status === "REFUNDED") {
            addMessage({ type: "error", text: data.order.errorMessage || "Loi nap tu dong" })
            setTopupOrderId(null)
            setTopupStatus(null)
          }
        }
      } catch { /* ignore polling errors */ }
    }, 10000) // Poll moi 10 giay

    return () => clearInterval(interval)
  }, [topupOrderId, addMessage])

  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {}
    products.forEach(p => {
      const groupName = groupMapping[p.productGroup] || "Khác"
      if (!groups[groupName]) groups[groupName] = []
      groups[groupName].push(p)
    })
    return groups
  }, [products])

  const hotProducts = useMemo(() => {
    if (!hotConfig.length || !products.length) return []
    return hotConfig
      .map(hot => {
        const found = products.find(p => p.productName.toLowerCase().includes(hot.name.toLowerCase()))
        return found ? { ...found, sortOrder: hot.order } : null
      })
      .filter(p => p !== null)
      .sort((a, b) => (a?.sortOrder || 0) - (b?.sortOrder || 0)) as Product[]
  }, [products, hotConfig])

  const tabs = Object.keys(groupedProducts).sort((a, b) => {
    const priority: Record<string, number> = { "Khuyến Mãi": 1, "Thẻ Ngày": 2, "ORBIT": 3 }
    const pA = priority[a] || 999
    const pB = priority[b] || 999
    return pA !== pB ? pA - pB : a.localeCompare(b)
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar logoUrl={logoUrl} />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8 space-y-8">
        <PageHeader title="Nạp Gói Game" subtitle="Hệ Thống Nạp Gói Game Chính Thức" />

      <div className="bg-card border-2 border-border rounded-2xl p-8 relative overflow-hidden group">

        <div className="relative z-10 max-w-2xl mx-auto space-y-8 text-center">
          {isPending ? (
            <div className="bg-background/80 backdrop-blur-md border-2 border-border rounded-2xl p-8 animate-in fade-in duration-500">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
                  Đang truy vấn dữ liệu...
                </p>
              </div>
            </div>
          ) : character && !isGuest ? (
            <div className="bg-background/80 backdrop-blur-md border-2 border-border rounded-2xl p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
              <div className="flex items-center space-x-3 sm:space-x-5 flex-nowrap overflow-hidden">
                <div className="relative shrink-0">
                  <img
                    src="/images/avatars/nap-goi.png"
                    alt="Avatar"
                    className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary/30 object-cover"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-green-500 border-2 border-background rounded-full" />
                </div>
                <div className="text-left space-y-0.5 min-w-0 flex-1">
                  <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-primary truncate">
                    Thông tin nhân vật
                  </p>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
                    {character.name}
                  </h2>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-[11px] font-bold text-muted-foreground whitespace-nowrap overflow-hidden">
                    <span className="px-1.5 py-0.5 bg-secondary rounded-md shrink-0 uppercase tracking-tighter">
                      <span className="sm:hidden">S.{character.server}</span>
                      <span className="hidden sm:inline">Server {character.server}</span>
                    </span>
                    <span className="opacity-50 shrink-0">|</span>
                    <span className="truncate">ID: {character.id}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Quick Add Section */}
          {isGuest && !isPending && !searchParams.get("accountId") && (
            <div className="w-full max-w-md mx-auto space-y-4 animate-in fade-in duration-700">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group">
                  <input
                    type="text"
                    placeholder="Nhập ID Tài Khoản..."
                    className="w-full h-12 pl-10 pr-4 bg-background border-2 border-border rounded-2xl focus:border-primary transition-all font-bold text-sm group-hover:border-primary/30"
                    value={newIdInput}
                    onChange={(e) => setNewIdInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && performSearch(newIdInput, true)}
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
                <button
                  onClick={() => performSearch(newIdInput, true)}
                  disabled={isPending || !newIdInput}
                  className="h-12 px-6 sm:px-8 bg-background border-2 border-border text-foreground rounded-2xl font-bold uppercase text-[11px] sm:text-xs tracking-widest hover:bg-secondary active:scale-95 transition-all shadow-sm flex items-center justify-center min-w-[100px] sm:min-w-[120px] group/login"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      <span>LOGIN</span>
                      <ChevronRight className="w-4 h-4 ml-1.5 sm:ml-2 group-hover/login:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {!isPending && (
            <div className="flex flex-col items-center">
            <button
              onClick={() => setIsAccountModalOpen(true)}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-secondary text-secondary-foreground rounded-2xl font-bold uppercase text-[11px] sm:text-xs tracking-widest hover:bg-secondary/80 transition-all flex items-center space-x-2"
            >
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Quản lý tài khoản</span>
            </button>
          </div>
          )}
        </div>
      </div>

      {/* Products Display */}
      {(hasSearched || isPending) && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 min-h-[400px]">

          {/* Hot Products Section */}
          {hotProducts.length > 0 && !isGuest && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500 animate-pulse">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">Gói Nạp Hot</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Đề xuất nhiều nhất cho bạn</p>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {isPending ? (
              Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              hotProducts.map(product => (
                  <ProductCard
                    key={`hot-${product.sellingProductID}`}
                    product={product}
                    isHot={true}
                    onSelect={() => setSelectedProduct(product)}
                    onPurchase={() => handlePurchase(product)}
                  />
                ))
            )}
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">Tất cả gói nạp</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Danh mục đầy đủ của trò chơi</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-5 py-2 rounded-xl font-bold uppercase tracking-widest text-[10px] sm:text-[11px] transition-all border",
                    activeTab === tab
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                      : "bg-card text-muted-foreground border-border hover:border-primary/30"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {isPending ? (
              Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              groupedProducts[activeTab]?.map(product => (
                <ProductCard
                  key={product.sellingProductID}
                  product={product}
                  isHot={hotProducts.some(hp => hp.sellingProductID === product.sellingProductID)}
                  onSelect={() => setSelectedProduct(product)}
                  onPurchase={() => handlePurchase(product)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-2xl bg-card border-2 border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 flex flex-col max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 p-2 hover:bg-secondary rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header: Image + Title */}
            <div className="p-6 sm:p-8 border-b border-border bg-secondary/10">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden border-2 border-border bg-muted shadow-sm">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-primary">
                    <Package className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Sản phẩm</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground leading-tight">
                    {selectedProduct.productName}
                  </h2>
                </div>
              </div>
            </div>

            {/* Content: Description */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Mô tả sản phẩm</span>
                </div>
                <div
                  className="text-sm sm:text-[15px] text-foreground leading-relaxed font-medium space-y-4"
                  dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                />
              </div>
            </div>

            {/* Footer: Price + Action */}
            <div className="p-6 sm:p-8 border-t border-border bg-secondary/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap tracking-widest">Giá thanh toán</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl sm:text-3xl font-bold text-accent">
                    {new Intl.NumberFormat('vi-VN').format(selectedProduct.prices.VND.price)}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-accent/70 uppercase tracking-widest">VND</span>
                </div>
              </div>
              <button
                onClick={() => handlePurchase(selectedProduct)}
                disabled={isPending}
                className="w-full sm:w-auto px-12 h-14 bg-background border-2 border-border text-foreground rounded-2xl font-bold uppercase tracking-widest hover:bg-secondary active:scale-95 shadow-sm transition-all flex items-center justify-center space-x-2 group/btn"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <span>Nạp Ngay</span>
                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Management Modal */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 h-[100dvh] w-full z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/50 animate-in fade-in duration-300">
          <div className="absolute inset-0 h-full w-full" onClick={() => setIsAccountModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-card border-2 border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary"><Gamepad2 className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-tight">Quản lý tài khoản</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Tra cứu hoặc chọn tài khoản đã lưu</p>
                </div>
              </div>
              <button onClick={() => setIsAccountModalOpen(false)} className="p-2 hover:bg-secondary rounded-xl transition-all"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
              <div className="space-y-4">
                {!isAddingNew ? (
                  <button onClick={() => setIsAddingNew(true)} className="w-full py-4 border-2 border-dashed border-border rounded-2xl flex items-center justify-center space-x-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all group">
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /><span className="text-sm font-bold uppercase tracking-widest">Thêm tài khoản mới</span>
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-primary"><Plus className="w-4 h-4" /><span className="text-[10px] font-bold uppercase">Nhập ID mới</span></div>
                      <button onClick={() => setIsAddingNew(false)} className="text-[10px] font-bold text-muted-foreground hover:text-rose-500 uppercase">Hủy</button>
                    </div>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <input type="text" placeholder="Nhập ID Tài Khoản..." className="w-full h-12 pl-10 pr-4 bg-background border-2 border-border rounded-xl focus:border-primary font-bold text-sm" value={newIdInput} onChange={(e) => setNewIdInput(e.target.value)} />
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                      <button
                        onClick={() => performSearch(newIdInput, true)}
                        disabled={isPending || !newIdInput}
                        className="h-12 px-4 sm:px-6 bg-background border-2 border-border text-foreground rounded-xl font-bold uppercase text-[11px] sm:text-xs tracking-widest hover:bg-secondary active:scale-95 transition-all shadow-sm flex items-center justify-center min-w-[90px] sm:min-w-[120px]"
                      >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>LOGIN</span>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {savedIds.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center space-x-2 text-muted-foreground"><Zap className="w-4 h-4" /><span className="text-[10px] font-bold uppercase tracking-[0.2em]">Đã lưu ({savedIds.length})</span></div>
                  <div className="grid grid-cols-2 gap-3">
                    {savedIds.map(account => (
                      <div key={account.id} className={cn("group relative flex flex-col items-center p-4 rounded-2xl border cursor-pointer", character?.id === account.id ? "bg-primary/10 border-primary" : "bg-background border-border hover:border-primary/50")} onClick={() => performSearch(account.id, true)}>
                        <span className={cn("text-[13px] font-bold truncate w-full text-center mb-1", character?.id === account.id ? "text-primary" : "text-foreground")}>{account.name}</span>
                        <span className="text-[10px] font-medium text-muted-foreground uppercase opacity-60">ID: {account.id}</span>
                        <button className="absolute top-2 right-2 w-6 h-6 bg-secondary text-muted-foreground rounded-lg flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all" onClick={(e) => handleRemoveId(account.id, e)}><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {confirmingProduct && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => !isPending && setConfirmingProduct(null)} />
          <div className="relative w-full max-w-md bg-card border-2 border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
            <div className="p-8 space-y-6">
              {/* Header Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                  <Zap className="w-10 h-10 text-primary fill-current" />
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Xác nhận thanh toán</h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-relaxed">
                  Bạn có chắc chắn muốn mua gói nạp này?
                </p>
              </div>

              {/* Product Info Box */}
              <div className="bg-secondary/20 border border-border rounded-2xl p-4 flex items-center space-x-4">
                <img src={confirmingProduct.image} alt="" className="w-14 h-14 rounded-xl object-cover border border-border shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate uppercase">{confirmingProduct.productName}</p>
                  <p className="text-lg font-bold text-accent">
                    {new Intl.NumberFormat('vi-VN').format(confirmingProduct.prices.VND.price * (isBulkMode ? bulkIds.length : 1))}
                    <span className="text-[10px]"> VND</span>
                  </p>
                </div>
              </div>

              {/* Selection Mode Toggle */}
              <div className="flex items-center justify-center space-x-6 py-2">
                <button
                  onClick={() => setIsBulkMode(false)}
                  className={cn("text-[10px] font-bold uppercase tracking-widest transition-all", !isBulkMode ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground")}
                >
                  Nạp ID hiện tại
                </button>
                <button
                  onClick={() => setIsBulkMode(true)}
                  className={cn("text-[10px] font-bold uppercase tracking-widest transition-all", isBulkMode ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground")}
                >
                  Nạp nhiều ID
                </button>
              </div>

              {/* Input Section */}
              {isBulkMode ? (
                <div className="space-y-3">
                  <div className="relative group">
                    <textarea
                      placeholder="Nhập Danh Sách ID, Mỗi ID 1 Dòng..."
                      className="w-full h-32 p-4 bg-background border-2 border-border rounded-2xl focus:border-primary font-bold text-sm transition-all group-hover:border-primary/30 resize-none custom-scrollbar"
                      value={bulkIdsInput}
                      onChange={(e) => setBulkIdsInput(e.target.value)}
                    />
                    <Zap className="absolute right-4 bottom-4 w-4 h-4 text-primary opacity-20" />
                  </div>
                  <div className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Số lượng: <span className="text-primary">{bulkIds.length} ID</span>
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Tự động x {bulkIds.length} giá
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2 border-y border-border/50 space-y-1">
                  <div className="flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nạp cho ID: </span>
                    <span className="text-[10px] font-bold text-foreground">{character?.id}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  disabled={isPending}
                  onClick={() => setConfirmingProduct(null)}
                  className="h-12 border-2 border-border rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-secondary active:scale-95 transition-all disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  disabled={isPending}
                  onClick={executePurchase}
                  className="h-12 bg-primary text-primary-foreground rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Xác nhận nạp"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="bg-card border-2 border-border rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-secondary/50" />
      <div className="p-3 sm:p-4 space-y-4">
        <div className="space-y-2">
          <div className="h-3 bg-secondary rounded-full w-full" />
          <div className="h-3 bg-secondary rounded-full w-2/3 mx-auto" />
        </div>
        <div className="pt-3 border-t border-border mt-auto space-y-3">
          <div className="h-5 bg-secondary rounded-full w-1/2 mx-auto" />
          <div className="h-9 bg-secondary/30 rounded-xl w-full" />
        </div>
      </div>
    </div>
  )
}

function GuidelineCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card border-2 border-border p-6 rounded-2xl space-y-4 hover:border-primary/30 transition-all group">
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">{icon}</div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold uppercase tracking-tight">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function ProductCard({ product, isHot = false, onSelect, onPurchase }: { product: Product, isHot?: boolean, onSelect?: () => void, onPurchase?: () => void }) {
  return (
    <div onClick={onSelect} className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:border-primary transition-all duration-300 flex flex-col cursor-pointer">
      <div className="aspect-[16/9] relative overflow-hidden bg-secondary">
        <img src={product.image} alt={product.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        {isHot && <div className="absolute top-0 left-0 px-2 py-1 bg-rose-500 text-white text-[8px] font-bold rounded-br-xl shadow-lg border-r border-b border-white/20 uppercase tracking-widest z-10">HOT</div>}
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1 space-y-3 text-center">
        <div className="space-y-1">
          <h3 className="font-bold text-[11px] sm:text-[12px] uppercase tracking-tight line-clamp-2 min-h-[28px] sm:min-h-[32px]">{product.productName}</h3>
        </div>
        <div className="pt-3 border-t border-border mt-auto space-y-3">
          <div className="text-accent font-bold text-sm sm:text-base tracking-tighter">{new Intl.NumberFormat('vi-VN').format(product.prices.VND.price)} <span className="text-[9px] opacity-70 font-bold">VNĐ</span></div>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onPurchase?.()
            }} 
            className="w-full py-2 bg-background border border-primary/50 text-primary hover:bg-primary/5 active:scale-95 transition-all duration-300 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 group/btn shadow-none"
          >
            <span>Nạp Ngay</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
