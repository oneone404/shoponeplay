"use client"

import { useState, useEffect } from "react"
import { Save, Plus, Trash2, GripVertical, Loader2, Star, AlertCircle, Zap, Settings, ShoppingCart, RefreshCw, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUI } from "@/providers/UIProvider"
import { updateNapGameConfig, createTopupProduct, updateTopupProduct, deleteTopupProduct, updateCardGatewayConfig, checkAgentBalance } from "@/app/admin/settings/napgame/actions"
import AdminHeader from "../AdminHeader"

interface HotItem {
  name: string
  order: number
}

interface TopupProductItem {
  id: string
  name: string
  vngProductId?: string
  cardValue: number
  serviceCode: string
  sellPrice: number
  enabled: boolean
  sortOrder: number
  _count?: { orders: number }
}

interface CardGatewayConfig {
  baseUrl: string
  partnerId: string
  partnerKey: string
  walletNumber: string
  callbackUrl: string
}

interface AdminNapGameClientProps {
  initialHotConfig: HotItem[]
  initialMarkup: number
  initialRounding: boolean
  initialTopupProducts?: TopupProductItem[]
  initialCardConfig?: CardGatewayConfig
}

export default function AdminNapGameClient({ initialHotConfig, initialMarkup, initialRounding, initialTopupProducts = [], initialCardConfig }: AdminNapGameClientProps) {
  const { addMessage } = useUI()
  const [loading, setLoading] = useState(false)
  const [checkingBalance, setCheckingBalance] = useState(false)
  const [items, setItems] = useState<HotItem[]>(initialHotConfig.sort((a, b) => a.order - b.order))
  const [markup, setMarkup] = useState<number>(initialMarkup)
  const [rounding, setRounding] = useState<boolean>(initialRounding)

  const addItem = () => {
    setItems([...items, { name: "", order: items.length + 1 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, name: string) => {
    const newItems = [...items]
    newItems[index].name = name
    setItems(newItems)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const itemsToSave = items
        .filter(item => item.name.trim() !== "")
        .map((item, index) => ({ ...item, order: index + 1 }))
        
      const result = await updateNapGameConfig(itemsToSave, markup, rounding)

      if (result.success) {
        addMessage({ type: "success", text: "Cấu hình đã được lưu thành công!" })
      } else {
        addMessage({ type: "error", text: "Lỗi: " + result.error })
      }
    } catch (error) {
      addMessage({ type: "error", text: "Lỗi kết nối máy chủ" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">
      <AdminHeader
        title="Cấu Hình Nạp Gói"
        subtitle="Quản lý danh sách các gói nạp HOT hiển thị ở đầu trang napgame"
      />

      {/* HOT ITEMS & GLOBAL CONFIG */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Star className="w-4 h-4 fill-primary" />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Cấu Hình Gói HOT & Giá</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={addItem}
              className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center space-x-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm gói HOT</span>
            </button>
            <button
              disabled={loading}
              onClick={handleSave}
              className="px-3 py-1.5 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Lưu cấu hình</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Price Markup Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-border/50 border-b">
                <Zap className="w-4 h-4 text-primary" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cấu Hình Giá Bán</h4>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Phần trăm tăng giá (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={markup}
                      onChange={(e) => setMarkup(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-xs font-bold focus:border-primary outline-none transition-all"
                      placeholder="Ví dụ: 10"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</div>
                  </div>
                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                    Giá hiển thị = Giá gốc VNG + (Giá gốc * %)
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Làm tròn tiền</label>
                    <p className="text-[9px] text-muted-foreground">Tự động làm tròn lên các mốc 5k, 10k</p>
                  </div>
                  <button
                    onClick={() => setRounding(!rounding)}
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-all duration-300",
                      rounding ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                      rounding ? "left-6" : "left-1"
                    )} />
                  </button>
                </div>

                {rounding && (
                  <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg space-y-1 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Quy tắc làm tròn:</p>
                    <ul className="text-[9px] text-primary/80 space-y-1 font-medium list-disc pl-3">
                      <li>Dưới 50k: Làm tròn lên mốc 5k gần nhất (24k → 25k)</li>
                      <li>Trên 50k: Làm tròn lên mốc 10k gần nhất (72k → 80k)</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Hot Items Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-border/50 border-b">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Danh Sách Gói HOT (Hiển thị đầu trang)</h4>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl opacity-50">
                  <Star className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs font-bold uppercase tracking-widest">Chưa có gói HOT nào</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-secondary/30 border border-border rounded-xl group">
                      <div className="w-7 h-7 flex items-center justify-center bg-background rounded-lg border border-border text-[9px] font-bold text-muted-foreground shrink-0">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(index, e.target.value)}
                        placeholder="Tên gói (ví dụ: Thành viên Plus)"
                        className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-[11px] font-bold focus:border-primary outline-none transition-all"
                      />
                      <button
                        onClick={() => removeItem(index)}
                        className="w-7 h-7 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ====== TOPUP PRODUCT CONFIG ====== */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between bg-emerald-500/5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-600">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Quản Lý Sản Phẩm Nạp Tự Động</h3>
          </div>
          <button
            onClick={async () => {
              const result = await createTopupProduct({
                name: "Gói mới",
                vngProductId: "",
                cardValue: 20000,
                serviceCode: "ZING",
                sellPrice: 25000,
                enabled: false,
                sortOrder: initialTopupProducts.length
              })
              if (result.success) {
                addMessage({ type: "success", text: "Đã thêm sản phẩm mới!" })
                window.location.reload()
              } else {
                addMessage({ type: "error", text: result.error || "Lỗi" })
              }
            }}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center space-x-2 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>

        <div className="p-6">
          {initialTopupProducts.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl opacity-50">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs font-bold uppercase tracking-widest">Chưa có sản phẩm nạp tự động</p>
              <p className="text-[10px] text-muted-foreground mt-1">Thêm sản phẩm để bắt đầu sử dụng tính năng nạp tự động</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {initialTopupProducts.map((tp) => (
                <TopupProductCard 
                  key={tp.id} 
                  product={tp} 
                  onUpdate={async (data) => {
                    const result = await updateTopupProduct(tp.id, data)
                    if (result.success) {
                      addMessage({ type: "success", text: "Đã cập nhật sản phẩm!" })
                      return true
                    } else {
                      addMessage({ type: "error", text: result.error || "Lỗi" })
                      return false
                    }
                  }} 
                  onDelete={async () => {
                    if (!confirm("Xác nhận xóa sản phẩm này?")) return
                    const result = await deleteTopupProduct(tp.id)
                    if (result.success) { 
                      addMessage({ type: "success", text: "Đã xóa sản phẩm!" })
                      window.location.reload() 
                    } else {
                      addMessage({ type: "error", text: result.error || "Lỗi" })
                    }
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ====== CARD GATEWAY CONFIG ====== */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between bg-blue-500/5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Card Gateway (Kết nối NCC Thẻ)</h3>
          </div>
          <button
            disabled={checkingBalance}
            onClick={async () => {
              setCheckingBalance(true)
              const result = await checkAgentBalance()
              setCheckingBalance(false)
              if (result.success) {
                addMessage({ type: "success", text: `Số dư đại lý: ${result.balance.toLocaleString()} VND` })
              } else {
                addMessage({ type: "error", text: result.error || "Lỗi khi kiểm tra" })
              }
            }}
            className="px-3 py-1.5 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {checkingBalance ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>{checkingBalance ? "Đang kiểm tra..." : "Kiểm tra số dư NCC"}</span>
          </button>
        </div>

        <CardGatewayForm initialConfig={initialCardConfig} onSave={async (data) => {
          const result = await updateCardGatewayConfig(data)
          if (result.success) addMessage({ type: "success", text: "Đã lưu cấu hình Card Gateway!" })
          else addMessage({ type: "error", text: result.error || "Lỗi" })
        }} />
      </div>
    </div>
  )
}

// ====== SUB-COMPONENTS ======

function TopupProductCard({ product, onUpdate, onDelete }: { product: any, onUpdate: (data: any) => Promise<boolean>, onDelete: () => void }) {
  const [name, setName] = useState(product.name)
  const [vngProductId, setVngProductId] = useState(product.vngProductId || "")
  const [cardValue, setCardValue] = useState(product.cardValue)
  const [sellPrice, setSellPrice] = useState(product.sellPrice)
  const [serviceCode, setServiceCode] = useState(product.serviceCode)
  const [enabled, setEnabled] = useState(product.enabled)
  const [loading, setLoading] = useState(false)
  const [hasChanged, setHasChanged] = useState(false)

  // Track changes to show "Save" button
  useEffect(() => {
    const changed = 
      name !== product.name || 
      vngProductId !== (product.vngProductId || "") || 
      cardValue !== product.cardValue || 
      sellPrice !== product.sellPrice || 
      enabled !== product.enabled
    setHasChanged(changed)
  }, [name, vngProductId, cardValue, sellPrice, enabled, product])

  const handleSave = async () => {
    setLoading(true)
    const success = await onUpdate({ name, vngProductId, cardValue, sellPrice, enabled })
    if (success) setHasChanged(false)
    setLoading(false)
  }

  return (
    <div className={cn(
      "p-5 border rounded-2xl transition-all duration-300 relative group",
      enabled ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-secondary/10 opacity-75 grayscale-[0.5]"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex-1">
          <input 
            value={name} 
            onChange={e => setName(e.target.value)}
            className="w-full text-sm font-bold bg-transparent border-none outline-none focus:text-primary transition-colors" 
            placeholder="Tên gói nạp..." 
          />
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md border border-border">
              {serviceCode}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Đã xử lý: {product._count?.orders || 0}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => {
              const v = !enabled; 
              setEnabled(v); 
              // Save immediately for toggle
              onUpdate({ enabled: v })
            }}
            className={cn(
              "w-10 h-5 rounded-full relative transition-all duration-300 shadow-inner", 
              enabled ? "bg-emerald-500" : "bg-muted-foreground/30"
            )}
          >
            <div className={cn(
              "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 shadow-sm", 
              enabled ? "left-6" : "left-1"
            )} />
          </button>
          <button 
            onClick={onDelete} 
            className="w-8 h-8 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80">VNG Product ID</label>
          <input 
            value={vngProductId} 
            onChange={e => setVngProductId(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-[11px] font-bold focus:border-primary outline-none transition-all shadow-sm" 
            placeholder="ID (Bỏ trống = Tên)" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80">Mệnh giá thẻ (NCC)</label>
          <div className="relative">
            <input 
              type="number" 
              value={cardValue} 
              onChange={e => setCardValue(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-[11px] font-bold focus:border-primary outline-none transition-all shadow-sm pr-10" 
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-muted-foreground">VND</div>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80">Giá bán (Web)</label>
          <div className="relative">
            <input 
              type="number" 
              value={sellPrice} 
              onChange={e => setSellPrice(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-[11px] font-bold focus:border-primary outline-none transition-all shadow-sm pr-10 text-primary" 
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-muted-foreground">VND</div>
          </div>
        </div>
      </div>

      {/* Save Button (Floating style when changed) */}
      {hasChanged && (
        <div className="mt-4 animate-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-2 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            <span>Lưu thay đổi gói này</span>
          </button>
        </div>
      )}
    </div>
  )
}

function CardGatewayForm({ initialConfig, onSave }: { initialConfig?: CardGatewayConfig, onSave: (data: any) => void }) {
  const [baseUrl, setBaseUrl] = useState(initialConfig?.baseUrl || "")
  const [partnerId, setPartnerId] = useState(initialConfig?.partnerId || "")
  const [partnerKey, setPartnerKey] = useState(initialConfig?.partnerKey || "")
  const [walletNumber, setWalletNumber] = useState(initialConfig?.walletNumber || "")
  const [callbackUrl, setCallbackUrl] = useState(initialConfig?.callbackUrl || "")
  const [saving, setSaving] = useState(false)

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Base URL", value: baseUrl, set: setBaseUrl, placeholder: "https://thegiare.vn" },
          { label: "Partner ID (Mã đối tác)", value: partnerId, set: setPartnerId, placeholder: "33372596257" },
          { label: "Partner Key (Mã bí mật)", value: partnerKey, set: setPartnerKey, placeholder: "***" },
          { label: "Wallet Number (Ví)", value: walletNumber, set: setWalletNumber, placeholder: "0020189759" },
        ].map(f => (
          <div key={f.label} className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{f.label}</label>
            <input 
              value={f.value} 
              onChange={e => f.set(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs font-bold focus:border-primary outline-none transition-all shadow-sm" 
              placeholder={f.placeholder} 
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2 border-t border-border">
        <button 
          onClick={async () => {
            setSaving(true)
            await onSave({ baseUrl, partnerId, partnerKey, walletNumber, callbackUrl })
            setSaving(false)
          }} 
          disabled={saving}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center space-x-2 shadow-lg shadow-blue-500/20"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Lưu Cấu Hình Gateway</span>
        </button>
      </div>
    </div>
  )
}
