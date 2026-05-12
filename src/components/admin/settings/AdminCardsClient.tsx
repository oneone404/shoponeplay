"use client"

import { useState, useEffect } from "react"
import { 
  Save, 
  Shield, 
  Settings2, 
  Globe, 
  Key, 
  User, 
  ChevronDown, 
  Loader2, 
  Copy, 
  Zap,
  Percent,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Monitor
} from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { updateCardConfig } from "@/app/admin/settings/cards/actions"
import AdminHeader from "../AdminHeader"
import { cn } from "@/lib/utils"

const PARTNERS = [
  { name: "TheSieuRe", domain: "thesieure.com" },
  { name: "TheGiaRe", domain: "thegiare.vn" },
]

const TELCOS = [
  { id: "VIETTEL", name: "Viettel" },
  { id: "MOBIFONE", name: "Mobifone" },
  { id: "VINAPHONE", name: "Vinaphone" },
  { id: "ZING", name: "Zing" },
  { id: "GARENA", name: "Garena" },
]

interface AdminCardsClientProps {
  initialPartnerId: string
  initialPartnerKey: string
  initialApiUrl: string
  initialEnabled: boolean
  initialCustomDiscountEnabled: boolean
  initialTelcoDiscounts: Record<string, number>
}

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
  const [savingSection, setSavingSection] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    partnerId: initialPartnerId,
    partnerKey: initialPartnerKey,
    apiUrl: initialPartnerKey ? initialApiUrl : (PARTNERS[0].domain),
    enabled: initialEnabled,
    customDiscountEnabled: initialCustomDiscountEnabled,
    telcoDiscounts: initialTelcoDiscounts || {}
  })

  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const handleSave = async (section: string) => {
    setSavingSection(section)
    setLoading(true)
    try {
      const result = await updateCardConfig({
        partnerId: formData.partnerId,
        partnerKey: formData.partnerKey,
        apiUrl: formData.apiUrl,
        enabled: formData.enabled,
        customDiscountEnabled: formData.customDiscountEnabled,
        telcoDiscounts: formData.telcoDiscounts
      })

      if (result.success) {
        addMessage({ type: "success", text: `Cập nhật ${section} thành công!` })
      } else {
        addMessage({ type: "error", text: "Lỗi: " + result.error })
      }
    } catch (error) {
      addMessage({ type: "error", text: "Lỗi kết nối máy chủ" })
    } finally {
      setLoading(false)
      setSavingSection(null)
    }
  }

  const toggleSwitch = (key: 'enabled' | 'customDiscountEnabled') => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const updateDiscount = (telcoId: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      telcoDiscounts: {
        ...prev.telcoDiscounts,
        [telcoId]: value
      }
    }))
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 w-full pb-20">
      <AdminHeader
        title="Cấu Hình Nạp Thẻ"
        subtitle="Quản lý tích hợp nạp thẻ cào tự động qua đối tác (TheSieuRe / TheGiaRe)"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* LEFT COLUMN: Main Config */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* API CONFIG CARD */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="p-5 border-b border-border bg-muted/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">API Integration</h3>
                  <p className="text-[10px] text-muted-foreground font-medium">Cấu hình kết nối với website đối tác</p>
                </div>
              </div>
              <button
                disabled={loading}
                onClick={() => handleSave("kết nối API")}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {savingSection === "kết nối API" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <User className="w-3 h-3" /> Partner ID
                  </label>
                  <input
                    type="text"
                    value={formData.partnerId}
                    onChange={(e) => setFormData({...formData, partnerId: e.target.value})}
                    placeholder="Nhập Partner ID từ đối tác"
                    className="w-full bg-secondary/30 border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary outline-none transition-all shadow-inner focus:ring-4 focus:ring-primary/5"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Partner Key
                  </label>
                  <input
                    type="password"
                    value={formData.partnerKey}
                    onChange={(e) => setFormData({...formData, partnerKey: e.target.value})}
                    placeholder="••••••••••••••••"
                    className="w-full bg-secondary/30 border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary outline-none transition-all shadow-inner focus:ring-4 focus:ring-primary/5"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Website Đối Tác
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PARTNERS.map((p) => (
                    <button
                      key={p.domain}
                      onClick={() => setFormData({...formData, apiUrl: p.domain})}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all group",
                        formData.apiUrl === p.domain 
                          ? "bg-primary/5 border-primary text-primary shadow-md" 
                          : "bg-background border-border text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                          formData.apiUrl === p.domain ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground group-hover:bg-primary/10"
                        )}>
                          <Monitor className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">{p.name}</span>
                      </div>
                      {formData.apiUrl === p.domain && <CheckCircle2 className="w-5 h-5 animate-in zoom-in duration-300" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* DISCOUNT CONFIG CARD */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="p-5 border-b border-border bg-muted/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shadow-inner">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">Custom Discounts</h3>
                  <p className="text-[10px] text-muted-foreground font-medium">Tùy chỉnh chiết khấu nạp thẻ cho từng nhà mạng</p>
                </div>
              </div>
              <button
                disabled={loading || !formData.customDiscountEnabled}
                onClick={() => handleSave("chiết khấu")}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-500 text-white hover:opacity-90 transition-all disabled:opacity-30 shadow-lg shadow-amber-500/20"
              >
                {savingSection === "chiết khấu" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                <div className="space-y-1">
                  <h4 className="text-[11px] font-black uppercase tracking-wide text-amber-600">Bật chiết khấu tùy chỉnh</h4>
                  <p className="text-[10px] text-amber-600/70 font-medium">Sử dụng % chiết khấu dưới đây thay vì mặc định của hệ thống.</p>
                </div>
                <button
                  onClick={() => toggleSwitch('customDiscountEnabled')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-[10px] tracking-widest",
                    formData.customDiscountEnabled ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-muted text-muted-foreground"
                  )}
                >
                  {formData.customDiscountEnabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  {formData.customDiscountEnabled ? "BẬT" : "TẮT"}
                </button>
              </div>

              {formData.customDiscountEnabled ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  {TELCOS.map((telco) => (
                    <div key={telco.id} className="p-4 bg-secondary/20 rounded-2xl border border-border/50 space-y-3 hover:border-primary/30 transition-all">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block text-center">{telco.name}</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.telcoDiscounts?.[telco.id] ?? 20}
                          onChange={(e) => updateDiscount(telco.id, Number(e.target.value))}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-black focus:border-primary outline-none transition-all text-center"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                  <AlertCircle className="w-10 h-10 text-muted-foreground" />
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Chiết khấu tùy chỉnh đang tắt</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar info */}
        <div className="space-y-8">
          
          {/* STATUS CARD */}
          <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Trạng Thái
            </h3>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  toggleSwitch('enabled');
                  // Trigger save immediately for status
                  setTimeout(() => handleSave("trạng thái"), 100);
                }}
                disabled={loading}
                className={cn(
                  "w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all group",
                  formData.enabled 
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600" 
                    : "bg-rose-500/5 border-rose-500/20 text-rose-600"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                    formData.enabled ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                  )}>
                    {formData.enabled ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Hệ Thống Đang</p>
                    <p className="text-sm font-black uppercase tracking-[0.1em]">{formData.enabled ? "Hoạt Động" : "Tạm Ngưng"}</p>
                  </div>
                </div>
                {formData.enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>

            <div className="p-4 bg-muted/50 rounded-2xl border border-border/50 text-[10px] text-muted-foreground leading-relaxed">
              <p className="font-medium italic">Lưu ý: Khi tắt trạng thái, khách hàng sẽ không thể nhìn thấy hoặc gửi thẻ cào lên hệ thống.</p>
            </div>
          </div>

          {/* CALLBACK URL CARD */}
          <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
            
            <div className="relative space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                <Copy className="w-4 h-4 text-blue-500" /> Webhook URL
              </h3>
              
              <div className="p-5 bg-secondary/30 rounded-2xl border border-border/50 space-y-4">
                <p className="text-[10px] text-muted-foreground font-medium">Copy URL này cấu hình vào mục <span className="text-foreground font-bold">"Callback URL"</span> tại trang quản trị đối tác của bạn.</p>
                
                <div className="flex items-center justify-between bg-background p-3 rounded-xl border border-border group/url relative">
                  <code className="text-[10px] font-black text-primary truncate pr-8">
                    {origin ? `${origin}/api/webhooks/deposit/card` : "https://loading..."}
                  </code>
                  <button
                    onClick={() => {
                      if(!origin) return;
                      navigator.clipboard.writeText(`${origin}/api/webhooks/deposit/card`)
                      addMessage({ type: "success", text: "Đã sao chép Callback URL!" })
                    }}
                    className="absolute right-2 p-2 hover:bg-secondary rounded-lg transition-all text-muted-foreground hover:text-primary active:scale-90 shadow-sm"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[9px] text-blue-500/70 font-bold leading-normal">
                  URL này dùng để nhận thông báo tự động khi thẻ được duyệt thành công. Nếu không cấu hình, số dư của khách sẽ không tự cập nhật.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
