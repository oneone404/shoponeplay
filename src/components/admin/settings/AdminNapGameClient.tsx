"use client"

import { useState } from "react"
import { Save, Plus, Trash2, GripVertical, Loader2, Star, AlertCircle, Zap, Settings, ShoppingCart, RefreshCw } from "lucide-react"
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
  initialTopupOrders?: any[]
}

export default function AdminNapGameClient({ initialHotConfig, initialMarkup, initialRounding, initialTopupProducts = [], initialCardConfig, initialTopupOrders = [] }: AdminNapGameClientProps) {
  const { addMessage } = useUI()
  const [loading, setLoading] = useState(false)
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
      // Re-assign orders based on current index
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

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Star className="w-4 h-4 fill-primary" />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Cấu Hình Nạp Gói</h3>
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
              className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Lưu cấu hình</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Price Markup Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-border/50">
              <Zap className="w-4 h-4 text-primary" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cấu Hình Giá</h4>
            </div>
            <div className="max-w-xs space-y-2">
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
            <div className="flex items-center space-x-2 pb-2 border-b border-border/50">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Danh Sách Gói HOT</h4>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-xl opacity-50">
                <Star className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs font-bold uppercase tracking-widest">Chưa có gói HOT nào được cấu hình</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-secondary/30 border border-border rounded-xl group">
                    <div className="w-8 h-8 flex items-center justify-center bg-background rounded-lg border border-border text-[10px] font-bold text-muted-foreground shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(index, e.target.value)}
                        placeholder="Nhập tên chính xác của gói nạp (ví dụ: Thành viên Plus)"
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-xs font-bold focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="w-8 h-8 flex items-center justify-center bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Lưu ý quan trọng</p>
                <p className="text-[10px] text-amber-600/80 leading-relaxed font-medium">
                  Tên gói nạp phải khớp chính xác với tên được trả về từ VNG API. 
                  Hệ thống sẽ lọc danh sách sản phẩm theo các tên này để hiển thị trong mục HOT ở đầu trang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== TOPUP PRODUCT CONFIG ====== */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-600">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">San Pham Nap Tu Dong</h3>
          </div>
          <button
            onClick={async () => {
              const result = await createTopupProduct({
                name: "Goi Moi",
                vngProductId: "",
                cardValue: 20000,
                serviceCode: "ZING",
                sellPrice: 25000,
                enabled: false,
                sortOrder: initialTopupProducts.length
              })
              if (result.success) {
                addMessage({ type: "success", text: "Da them san pham moi!" })
                window.location.reload()
              } else {
                addMessage({ type: "error", text: result.error || "Loi" })
              }
            }}
            className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center space-x-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Them san pham</span>
          </button>
        </div>

        <div className="p-6 space-y-3">
          {initialTopupProducts.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl opacity-50">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs font-bold uppercase tracking-widest">Chua co san pham nap tu dong</p>
              <p className="text-[10px] text-muted-foreground mt-1">Them san pham de bat dau su dung tinh nang nap tu dong</p>
            </div>
          ) : (
            <div className="space-y-3">
              {initialTopupProducts.map((tp) => (
                <TopupProductRow key={tp.id} product={tp} onUpdate={async (data) => {
                  const result = await updateTopupProduct(tp.id, data)
                  if (result.success) addMessage({ type: "success", text: "Da cap nhat!" })
                  else addMessage({ type: "error", text: result.error || "Loi" })
                }} onDelete={async () => {
                  if (!confirm("Xac nhan xoa san pham nay?")) return
                  const result = await deleteTopupProduct(tp.id)
                  if (result.success) { addMessage({ type: "success", text: "Da xoa!" }); window.location.reload() }
                  else addMessage({ type: "error", text: result.error || "Loi" })
                }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ====== CARD GATEWAY CONFIG ====== */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Card Gateway (NCC)</h3>
          </div>
          <button
            onClick={async () => {
              const result = await checkAgentBalance()
              if (result.success) {
                addMessage({ type: "success", text: `So du dai ly: ${result.balance.toLocaleString()} VND` })
              } else {
                addMessage({ type: "error", text: result.error || "Loi kiem tra" })
              }
            }}
            className="px-3 py-1.5 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-all flex items-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check so du</span>
          </button>
        </div>

        <CardGatewayForm initialConfig={initialCardConfig} onSave={async (data) => {
          const result = await updateCardGatewayConfig(data)
          if (result.success) addMessage({ type: "success", text: "Da luu cau hinh Card Gateway!" })
          else addMessage({ type: "error", text: result.error || "Loi" })
        }} />
      </div>

      {/* ====== TOPUP ORDER HISTORY ====== */}
      {initialTopupOrders.length > 0 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Lich Su Nap Tu Dong (50 don gan nhat)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-widest text-[9px] text-muted-foreground">Don</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-widest text-[9px] text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-widest text-[9px] text-muted-foreground">Goi</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-widest text-[9px] text-muted-foreground">Nhan vat</th>
                  <th className="px-4 py-3 text-right font-bold uppercase tracking-widest text-[9px] text-muted-foreground">So tien</th>
                  <th className="px-4 py-3 text-center font-bold uppercase tracking-widest text-[9px] text-muted-foreground">Trang thai</th>
                  <th className="px-4 py-3 text-right font-bold uppercase tracking-widest text-[9px] text-muted-foreground">Thoi gian</th>
                </tr>
              </thead>
              <tbody>
                {initialTopupOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-muted/10">
                    <td className="px-4 py-3 font-mono text-[10px]">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-3">{order.user?.name || "N/A"}</td>
                    <td className="px-4 py-3">{order.product?.name || "N/A"}</td>
                    <td className="px-4 py-3">{order.roleName} ({order.roleId})</td>
                    <td className="px-4 py-3 text-right font-bold">{order.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                        order.status === "COMPLETED" && "bg-emerald-500/10 text-emerald-600",
                        order.status === "ERROR" && "bg-rose-500/10 text-rose-500",
                        order.status === "REFUNDED" && "bg-amber-500/10 text-amber-600",
                        order.status === "PENDING" && "bg-blue-500/10 text-blue-600",
                        !["COMPLETED","ERROR","REFUNDED","PENDING"].includes(order.status) && "bg-muted text-muted-foreground"
                      )}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ====== SUB-COMPONENTS ======

function TopupProductRow({ product, onUpdate, onDelete }: { product: any, onUpdate: (data: any) => void, onDelete: () => void }) {
  const [name, setName] = useState(product.name)
  const [vngProductId, setVngProductId] = useState(product.vngProductId || "")
  const [cardValue, setCardValue] = useState(product.cardValue)
  const [sellPrice, setSellPrice] = useState(product.sellPrice)
  const [serviceCode, setServiceCode] = useState(product.serviceCode)
  const [enabled, setEnabled] = useState(product.enabled)

  return (
    <div className={cn("p-4 border rounded-xl space-y-3", enabled ? "border-emerald-500/30 bg-emerald-500/5" : "border-border bg-muted/10")}>
      <div className="flex items-center justify-between">
        <input value={name} onChange={e => setName(e.target.value)} onBlur={() => onUpdate({ name })}
          className="text-sm font-bold bg-transparent border-none outline-none flex-1" placeholder="Ten goi" />
        <div className="flex items-center gap-2">
          <button onClick={() => { const v = !enabled; setEnabled(v); onUpdate({ enabled: v }) }}
            className={cn("w-10 h-5 rounded-full relative transition-all", enabled ? "bg-emerald-500" : "bg-muted-foreground/30")}>
            <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all", enabled ? "left-6" : "left-1")} />
          </button>
          <button onClick={onDelete} className="w-7 h-7 flex items-center justify-center text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground">VNG Product ID (Khong Bat Buoc)</label>
          <input value={vngProductId} onChange={e => setVngProductId(e.target.value)} onBlur={() => onUpdate({ vngProductId })}
            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs" placeholder="Tu dong tim theo ten..." />
        </div>
        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground">Menh gia the (VND)</label>
          <input type="number" value={cardValue} onChange={e => setCardValue(Number(e.target.value))} onBlur={() => onUpdate({ cardValue })}
            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs" />
        </div>
        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground">Gia ban (VND)</label>
          <input type="number" value={sellPrice} onChange={e => setSellPrice(Number(e.target.value))} onBlur={() => onUpdate({ sellPrice })}
            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs" />
        </div>
      </div>
      <div className="flex items-center gap-4 text-[9px] text-muted-foreground">
        <span>Loai the: {serviceCode}</span>
        <span>Don da xu ly: {product._count?.orders || 0}</span>
      </div>
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
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Base URL", value: baseUrl, set: setBaseUrl, placeholder: "https://thegiare.vn" },
          { label: "Partner ID", value: partnerId, set: setPartnerId, placeholder: "33372596257" },
          { label: "Partner Key", value: partnerKey, set: setPartnerKey, placeholder: "***" },
          { label: "Wallet Number", value: walletNumber, set: setWalletNumber, placeholder: "0020189759" },
        ].map(f => (
          <div key={f.label}>
            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{f.label}</label>
            <input value={f.value} onChange={e => f.set(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-xs font-bold focus:border-primary outline-none transition-all mt-1" placeholder={f.placeholder} />
          </div>
        ))}
      </div>
      <button onClick={async () => {
        setSaving(true)
        await onSave({ baseUrl, partnerId, partnerKey, walletNumber, callbackUrl })
        setSaving(false)
      }} disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center space-x-2">
        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
        <span>Luu Card Gateway</span>
      </button>
    </div>
  )
}
