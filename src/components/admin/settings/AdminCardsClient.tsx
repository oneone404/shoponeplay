"use client"

import { useState, useEffect } from "react"
import { Save, Shield, Settings2, Globe, Key, User, ChevronDown, Loader2, Copy } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { updateCardConfig } from "@/app/admin/settings/cards/actions"
import AdminHeader from "../AdminHeader"

const PARTNERS = [
  { name: "TheSieuRe", domain: "thesieure.com" },
  { name: "TheGiaRe", domain: "thegiare.vn" },
]


interface AdminCardsClientProps {
  initialPartnerId: string
  initialPartnerKey: string
  initialApiUrl: string
  initialEnabled: boolean
  initialCustomDiscountEnabled: boolean
  initialTelcoDiscounts: Record<string, number>
}

const TELCOS = [
  { id: "VIETTEL", name: "Viettel" },
  { id: "MOBIFONE", name: "Mobifone" },
  { id: "VINAPHONE", name: "Vinaphone" },
  { id: "ZING", name: "Zing" },
  { id: "GARENA", name: "Garena" },
]

export default function AdminCardsClient({
  initialPartnerId,
  initialPartnerKey,
  initialApiUrl,
  initialEnabled,
  initialCustomDiscountEnabled,
  initialTelcoDiscounts
}: AdminCardsClientProps) {
  const { addMessage } = useUI()
  const [loading, setLoading] = useState(false)
  const [partnerId, setPartnerId] = useState(initialPartnerId)
  const [partnerKey, setPartnerKey] = useState(initialPartnerKey)
  const [apiUrl, setApiUrl] = useState(initialApiUrl)
  const [enabled, setEnabled] = useState(initialEnabled)
  const [customDiscountEnabled, setCustomDiscountEnabled] = useState(initialCustomDiscountEnabled)
  const [telcoDiscounts, setTelcoDiscounts] = useState(initialTelcoDiscounts || {})
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = await updateCardConfig({
        partnerId,
        partnerKey,
        apiUrl,
        enabled,
        customDiscountEnabled,
        telcoDiscounts
      })

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
        title="Cấu Hình Nạp Thẻ"
        subtitle="Quản lý tích hợp nạp thẻ cào qua đối tác (TheSieuRe / TheGiaRe)"
      />

      <div className="w-full">
        <div className="bg-secondary/30 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-sm">
          {/* Header Card với các Nút Action ở góc phải */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Settings2 className="w-4 h-4" />
              </div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/80">Thông Tin Kết Nối</h3>
            </div>

            <div className="flex items-center space-x-4">
              {/* Status Switch */}
              <div className="flex items-center space-x-2 pr-4 border-r border-border">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {enabled ? 'Bật' : 'Tắt'}
                </span>
                <button
                  onClick={() => setEnabled(!enabled)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${enabled ? 'bg-emerald-500' : 'bg-muted'
                    }`}
                >
                  <span
                    className={`${enabled ? 'translate-x-4.5' : 'translate-x-0.5'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm`}
                  />
                </button>
              </div>

              {/* Save Button (Icon Only) */}
              <button
                disabled={loading}
                onClick={handleSave}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-foreground text-background hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                title="Lưu cấu hình"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center space-x-2">
                  <User className="w-3 h-3" />
                  <span>Partner ID</span>
                </label>
                <input
                  type="text"
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  placeholder="ID PARTNER"
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center space-x-2">
                  <Key className="w-3 h-3" />
                  <span>Partner Key</span>
                </label>
                <input
                  type="password"
                  value={partnerKey}
                  onChange={(e) => setPartnerKey(e.target.value)}
                  placeholder="API Key"
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center space-x-2">
                  <Globe className="w-3 h-3" />
                  <span>Website Đối Tác</span>
                </label>
                <div className="relative">
                  <select
                    value={PARTNERS.some(p => p.domain === apiUrl) ? apiUrl : "custom"}
                    onChange={(e) => {
                      if (e.target.value !== "custom") setApiUrl(e.target.value)
                    }}
                    className="w-full appearance-none bg-background/50 border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-primary outline-none transition-all cursor-pointer"
                  >
                    {PARTNERS.map(p => (
                      <option key={p.domain} value={p.domain}>{p.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/80">Chiết khấu tùy chỉnh</h4>
                  <p className="text-[10px] text-muted-foreground font-medium">Tự Tuỳ Chỉnh % Nạp Thẻ</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-3 bg-secondary/50 px-4 py-2 rounded-xl border border-border/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {customDiscountEnabled ? 'Đang bật' : 'Đang tắt'}
                    </span>
                    <button
                      onClick={() => setCustomDiscountEnabled(!customDiscountEnabled)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${customDiscountEnabled ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <span className={`${customDiscountEnabled ? 'translate-x-4.5' : 'translate-x-0.5'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm`} />
                    </button>
                  </div>

                  {customDiscountEnabled && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full pt-6 border-t border-border/30 animate-in fade-in slide-in-from-top-4 duration-500">
                      {TELCOS.map((telco) => (
                        <div key={telco.id} className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{telco.name}</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={telcoDiscounts?.[telco.id] ?? 20}
                              onChange={(e) => setTelcoDiscounts({ ...telcoDiscounts, [telco.id]: Number(e.target.value) })}
                              className="w-full bg-background/50 border border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:border-primary outline-none transition-all text-center"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>


            <div className="pt-6 border-t border-border/50">
              <div className="flex items-center justify-between bg-secondary/50 px-4 py-3 rounded-xl border border-border/50 group">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <code className="text-[11px] font-bold text-foreground opacity-80 truncate">
                    {origin || "https://yourdomain.com"}/api/webhooks/deposit/card
                  </code>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${origin}/api/webhooks/deposit/card`)
                    addMessage({ type: "success", text: "Đã sao chép Callback URL!" })
                  }}
                  className="p-2 hover:bg-background rounded-lg transition-all text-muted-foreground hover:text-primary active:scale-90"
                  title="Sao chép URL"
                >
                  <Copy className="w-4 h-4" />
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
