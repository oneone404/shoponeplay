"use client"

import { useState } from "react"
import Image from "next/image"
import { ShieldCheck, Clock, Zap, Wallet, CreditCard, ChevronRight, Check, AlertTriangle, Loader2 } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ServiceDetailClientProps {
  service: any
  isLoggedIn: boolean
  userBalance: number
}

export default function ServiceDetailClient({ service, isLoggedIn, userBalance }: ServiceDetailClientProps) {
  const [selectedOptionId, setSelectedOptionId] = useState(service.options[0]?.id || "")
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  
  const { addMessage } = useUI()
  const router = useRouter()

  const selectedOption = service.options.find((o: any) => o.id === selectedOptionId)

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      addMessage({ type: 'warning', text: 'Vui lòng đăng nhập để sử dụng dịch vụ' })
      return
    }

    if (!selectedOption) {
      addMessage({ type: 'error', text: 'Vui lòng chọn một gói dịch vụ' })
      return
    }

    if (userBalance < selectedOption.price) {
      addMessage({ type: 'error', text: 'Số dư tài khoản không đủ. Vui lòng nạp thêm tiền.' })
      return
    }

    // Basic validation for required fields
    const missingFields = service.fields.filter((f: any) => f.required && !formData[f.name])
    if (missingFields.length > 0) {
      addMessage({ type: 'error', text: `Vui lòng nhập: ${missingFields.map((f: any) => f.label).join(", ")}` })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/shop/services/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          optionId: selectedOptionId,
          customerData: formData
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Có lỗi xảy ra")

      addMessage({ type: 'success', text: 'Đặt đơn thành công! Kỹ thuật viên sẽ xử lý ngay.' })
      router.push("/user/history/services") // We'll need to create this later
    } catch (error: any) {
      addMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Cột trái: Thông tin & Lựa chọn gói */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Header Section */}
        <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row gap-8">
          <div className="relative w-full md:w-56 aspect-[4/3] md:aspect-square rounded-[2rem] overflow-hidden shrink-0 border border-border">
            <Image 
              src={service.thumbnail || "/images/placeholder.jpg"} 
              alt={service.name} 
              fill 
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-col justify-center flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                {service.type === 'LEVELING' ? 'Cày Thuê' : 'Nạp Game'}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" /> Bảo mật 100%
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight leading-tight">
              {service.name}
            </h1>
            <p className="text-muted-foreground text-sm mt-3 font-medium leading-relaxed">
              {service.description || "Hệ thống tự động xử lý, uy tín và chuyên nghiệp hàng đầu Việt Nam."}
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-tight">Tốc độ cao</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-tight">Xử lý ngay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="space-y-6">
          <h2 className="text-lg font-black text-foreground uppercase tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Bước 1: Chọn gói dịch vụ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.options.map((option: any) => (
              <button
                key={option.id}
                onClick={() => setSelectedOptionId(option.id)}
                className={cn(
                  "p-5 rounded-[2rem] border-2 text-left transition-all relative group overflow-hidden",
                  selectedOptionId === option.id 
                    ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" 
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <div className="flex flex-col h-full justify-between gap-4">
                  <div className="flex justify-between items-start">
                    <h4 className={cn(
                      "text-sm font-black uppercase tracking-tight transition-colors",
                      selectedOptionId === option.id ? "text-primary" : "text-foreground"
                    )}>
                      {option.name}
                    </h4>
                    {selectedOptionId === option.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Giá thanh toán</p>
                    <p className="text-xl font-black text-foreground tabular-nums">
                      {option.price.toLocaleString('vi-VN')} <span className="text-xs">đ</span>
                    </p>
                  </div>
                </div>
                {option.description && (
                  <p className="text-[10px] text-muted-foreground mt-3 italic line-clamp-1">{option.description}</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Form Fields */}
        <div className="space-y-6">
          <h2 className="text-lg font-black text-foreground uppercase tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Bước 2: Thông tin yêu cầu
          </h2>
          <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-sm">
            {service.fields.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.fields.map((field: any) => (
                  <div key={field.name} className={cn("space-y-2", field.type === 'textarea' ? "md:col-span-2" : "")}>
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>
                    
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-5 py-4 bg-secondary border-2 border-transparent rounded-[1.5rem] focus:border-primary/20 focus:bg-background outline-none text-sm font-bold transition-all appearance-none"
                      >
                        <option value="">-- Chọn một lựa chọn --</option>
                        {field.options?.split(",").map((opt: string) => (
                          <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder || "Nhập thông tin..."}
                        className="w-full px-5 py-4 bg-secondary border-2 border-transparent rounded-[1.5rem] focus:border-primary/20 focus:bg-background outline-none text-sm font-medium transition-all min-h-[120px]"
                      />
                    ) : (
                      <input
                        type={field.type === 'password' ? 'password' : 'text'}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder || "Nhập thông tin..."}
                        className="w-full px-5 py-4 bg-secondary border-2 border-transparent rounded-[1.5rem] focus:border-primary/20 focus:bg-background outline-none text-sm font-bold transition-all"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground italic">Dịch vụ này không yêu cầu thông tin bổ sung.</p>
              </div>
            )}
            
            <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Vui lòng kiểm tra kỹ thông tin đã nhập (tài khoản, mật khẩu...). Chúng tôi không chịu trách nhiệm nếu thông tin bạn cung cấp bị sai lệch dẫn đến chậm trễ hoặc lỗi trong quá trình xử lý.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải: Thanh toán (Sticky) */}
      <div className="lg:col-span-4">
        <div className="sticky top-24 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-primary/5 space-y-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Chi tiết thanh toán</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Tên dịch vụ</span>
                <span className="font-bold text-foreground text-right">{service.name}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Gói dịch vụ</span>
                <span className="font-bold text-primary text-right">{selectedOption?.name || "Chưa chọn"}</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-end">
                <span className="text-muted-foreground font-bold uppercase tracking-widest text-[11px]">Tổng cộng</span>
                <span className="text-3xl font-black text-primary tabular-nums">
                  {selectedOption?.price.toLocaleString('vi-VN') || 0} <span className="text-sm">đ</span>
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Số dư của bạn</span>
                </div>
                <span className={cn(
                  "font-bold tabular-nums",
                  userBalance >= (selectedOption?.price || 0) ? "text-green-500" : "text-rose-500"
                )}>
                  {userBalance.toLocaleString('vi-VN')} đ
                </span>
              </div>
              
              {isLoggedIn ? (
                userBalance < (selectedOption?.price || 0) && (
                  <Link 
                    href="/deposit"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-secondary text-foreground rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-secondary/80 transition-all"
                  >
                    <CreditCard className="w-4 h-4" /> Nạp thêm tiền
                  </Link>
                )
              ) : (
                <Link 
                  href="/signin"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-secondary text-foreground rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-secondary/80 transition-all"
                >
                  <User className="w-4 h-4" /> Đăng nhập để mua
                </Link>
              )}
            </div>

            <button
              onClick={handleCheckout}
              disabled={isLoading || !selectedOption || (isLoggedIn && userBalance < selectedOption.price)}
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
              Thanh toán ngay
            </button>

            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-green-500" /> Uy tín
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-green-500" /> Bảo mật
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-green-500" /> Hoàn tiền
              </div>
            </div>
          </div>

          {/* Support Widget */}
          <div className="p-6 bg-secondary/50 border border-border rounded-[2rem] space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">Hỗ trợ kỹ thuật</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Bạn gặp khó khăn trong việc cung cấp thông tin? Liên hệ Fanpage hoặc Hotline để được hỗ trợ 24/7.
            </p>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Liên hệ ngay</button>
          </div>
        </div>
      </div>

    </div>
  )
}
