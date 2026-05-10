"use client"

import { useState, useEffect } from "react"
import { X, Check, Copy, CreditCard, QrCode, ArrowRight, Loader2, Wallet, History, Send, Info, CheckCircle2, XCircle, Clock, Building2, Hash, User, DollarSign, MessageSquare, RotateCw, Zap, ShieldCheck } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useLanguage } from "@/providers/LanguageProvider"
import { useRouter } from "next/navigation"

const QUICK_AMOUNTS = [10000, 50000, 100000, 200000, 500000, 1000000]

const TELCOS = [
  { id: "VIETTEL", name: "Viettel", logo: "/images/networks/viettel.svg" },
  { id: "MOBIFONE", name: "Mobifone", logo: "/images/networks/mobifone.svg" },
  { id: "VINAPHONE", name: "Vinaphone", logo: "/images/networks/vinaphone.svg" },
  { id: "ZING", name: "Zing", logo: "/images/networks/zing.svg" },
  { id: "GARENA", name: "Garena", logo: "/images/networks/garena.svg" },
]

const CARD_AMOUNTS = [10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000]

export default function DepositModal() {
  const { depositOpen, setDepositOpen, addMessage } = useUI()
  const router = useRouter()
  const { data: session } = useSession()
  const { t } = useLanguage()

  // Common states
  const [method, setMethod] = useState<"BANK" | "CARD">("BANK")
  const [loading, setLoading] = useState(false)

  // Bank states
  const [amount, setAmount] = useState<number>(0)
  const [selectedBank, setSelectedBank] = useState<any>(null)
  const [banks, setBanks] = useState<any[]>([])
  const [config, setConfig] = useState({ prefix: "SOP", suffix: "", minAmount: 10000 })
  const [step, setStep] = useState(1) // 1: Amount, 2: Bank & QR, 3: Processing
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isRefreshingHistory, setIsRefreshingHistory] = useState(false)

  // Card states
  const [selectedTelco, setSelectedTelco] = useState(TELCOS[0].id)
  const [selectedCardAmount, setSelectedCardAmount] = useState(CARD_AMOUNTS[4])
  const [serial, setSerial] = useState("")
  const [pin, setPin] = useState("")
  const [cardHistory, setCardHistory] = useState<any[]>([])

  // Fetch bank info
  useEffect(() => {
    if (depositOpen && method === "BANK") {
      const fetchBanks = async () => {
        try {
          const res = await fetch("/api/user/bank-info")
          const data = await res.json()
          setBanks(data.banks || [])
          if (data.config) setConfig(data.config)
          if (data.banks?.length > 0) setSelectedBank(data.banks[0])
        } catch (error) {
          console.error("Failed to fetch banks", error)
        }
      }
      fetchBanks()
    }
  }, [depositOpen, method])

  // Fetch card history
  const fetchCardHistory = async () => {
    try {
      const res = await fetch("/api/user/deposits/card/history")
      const data = await res.json()
      if (data.deposits) setCardHistory(data.deposits)
    } catch (error) {
      console.error("Failed to fetch card history", error)
    }
  }

  useEffect(() => {
    if (depositOpen && method === "CARD") {
      fetchCardHistory()
    }
  }, [depositOpen, method])

  const refreshCardHistory = async () => {
    if (isRefreshingHistory) return
    setIsRefreshingHistory(true)
    await fetchCardHistory()
    // Keep spinning for a bit for better feel
    setTimeout(() => setIsRefreshingHistory(false), 800)
  }

  // Polling for bank confirmation
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (step === 3 && !isConfirmed && method === "BANK") {
      interval = setInterval(async () => {
        try {
          const res = await fetch("/api/user/deposits/check")
          const data = await res.json()
          if (data.confirmed) {
            setIsConfirmed(true)
            clearInterval(interval)
          }
        } catch (err) {
          console.error("Polling error:", err)
        }
      }, 2000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [step, isConfirmed, method])

  // Handle Card Submit
  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!serial || !pin) {
      addMessage({ type: "error", text: "Vui lòng nhập đầy đủ Serial và Mã thẻ" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/user/deposits/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telco: selectedTelco,
          amount: selectedCardAmount,
          serial,
          pin
        })
      })

      const data = await res.json()
      if (data.success) {
        addMessage({ type: "success", text: "Đã gửi thẻ thành công. Vui lòng chờ xử lý!" })
        setSerial("")
        setPin("")
        fetchCardHistory()
      } else {
        addMessage({ type: "error", text: data.error || "Gửi thẻ thất bại" })
      }
    } catch (error) {
      addMessage({ type: "error", text: "Lỗi kết nối máy chủ" })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    addMessage({ type: "success", text: t.common.copy_success_label.replace("{label}", label) })
  }

  const transferSyntax = session?.user?.id
    ? [config.prefix, session.user.id.slice(-8).toUpperCase(), config.suffix].filter(Boolean).join(" ")
    : [config.prefix, "ONEPLAY", config.suffix].filter(Boolean).join(" ")

  const qrUrl = selectedBank
    ? `https://qr.sepay.vn/img?acc=${selectedBank.accountNumber}&bank=${selectedBank.bankName}&amount=${amount}&des=${encodeURIComponent(transferSyntax)}`
    : ""

  return (
    <div className={cn(
      "fixed inset-0 h-[100dvh] z-[999] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] bg-background overflow-hidden",
      depositOpen ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"
    )}>
      <div className="flex flex-col h-full w-full overflow-hidden bg-background">
        {/* Header */}
        <div className="px-4 py-6 border-b border-border bg-secondary/30 shrink-0">
          <div className="max-w-xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest">{t.deposit.title}</h2>
                <p className="text-[10px] text-muted-foreground font-bold tracking-tighter">{t.deposit.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setDepositOpen(false)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-[calc(env(safe-area-inset-bottom)+80px)] bg-background overscroll-contain">
          <div className="mx-auto w-full max-w-4xl px-4 py-6 transition-all duration-500">
            {/* Method Toggle */}
            <div className="flex items-center space-x-2 bg-secondary/95 p-1.5 rounded-2xl border border-border mb-8 shadow-inner">
              <button
                onClick={() => {
                  setMethod("BANK")
                  setStep(1)
                }}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center space-x-2",
                  method === "BANK" ? "bg-white dark:bg-card text-foreground shadow-md border border-border/50" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <QrCode className="w-4 h-4" />
                <span>Ngân hàng</span>
              </button>
              <button
                onClick={() => {
                  setMethod("CARD")
                }}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center space-x-2",
                  method === "CARD" ? "bg-white dark:bg-card text-foreground shadow-md border border-border/50" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <CreditCard className="w-4 h-4" />
                <span>Thẻ cào</span>
              </button>
            </div>

            {/* --- BANK VIEW --- */}
            {method === "BANK" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Step 1: Amount Selection */}
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-card border border-border rounded-3xl overflow-hidden p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="md:col-span-3 space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{t.deposit.amount_label}</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={amount || ""}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            placeholder={t.deposit.amount_placeholder}
                            className="relative w-full bg-background/50 border border-border rounded-2xl px-6 py-4 text-lg font-bold text-foreground outline-none focus:border-primary transition-all placeholder:text-muted-foreground/30"
                          />
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-muted-foreground opacity-50">VND</div>
                        </div>
                        {amount > 0 && amount < config.minAmount && (
                          <p className="text-[10px] font-bold text-rose-500 mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
                            Nạp Tối Thiểu {new Intl.NumberFormat('vi-VN').format(config.minAmount)} VND
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {QUICK_AMOUNTS.map((val) => (
                          <button
                            key={val}
                            onClick={() => setAmount(val)}
                            className={cn(
                              "py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all border",
                              amount === val
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                                : "bg-background/50 text-muted-foreground border-border hover:border-primary/30"
                            )}
                          >
                            {new Intl.NumberFormat('vi-VN').format(val)}
                          </button>
                        ))}
                      </div>

                      <button
                        disabled={amount < config.minAmount}
                        onClick={() => setStep(2)}
                        className="w-full h-14 bg-white dark:bg-card border-2 border-border text-foreground rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-secondary active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:grayscale group/btn"
                      >
                        <span>{t.common.continue}</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    <div className="md:col-span-2 flex flex-col space-y-4 pt-8 md:pt-0 border-t md:border-t-0 md:border-l border-border/50 pl-0 md:pl-8 mt-2 md:mt-0">
                      <div className="flex items-center space-x-2 text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                        <Info className="w-4 h-4" />
                        <span>Hướng dẫn & Lưu ý</span>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            icon: <Zap className="w-3.5 h-3.5 text-amber-500" />,
                            title: "Tự động 24/7",
                            desc: "Hệ Thống Xử Lý Nạp Tiền Hoàn Toàn Tự Động 24/7 - Cộng Tiền Sau 5S."
                          },
                          {
                            icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />,
                            title: "An toàn & Bảo mật",
                            desc: "Vui Lòng Chuyển Khoản Đúng Nội Dung Để Được Xử Lý Và Cộng Tiền."
                          },
                          {
                            icon: <Clock className="w-3.5 h-3.5 text-blue-500" />,
                            title: "Hỗ Trợ Tận Tâm",
                            desc: "Nạp Sai Nội Dung Liên Hệ Admin Để Được Hỗ Trợ."
                          }
                        ].map((item, i) => (
                          <div key={i} className="p-4 bg-background/30 border-2 border-border/50 rounded-2xl">
                            <div className="flex items-center space-x-2 mb-1.5">
                              {item.icon}
                              <span className="text-[10px] font-bold uppercase tracking-tight">{item.title}</span>
                            </div>
                            <p className="text-[9px] text-muted-foreground font-bold leading-relaxed opacity-70">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: QR & Info - 2 Columns on Desktop */}
                {step === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Column 1: QR Code */}
                    <div className="md:col-span-2 bg-card border border-border rounded-3xl overflow-hidden p-8 flex flex-col items-center justify-center space-y-4 shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Quét mã QR</p>
                      <div className="relative group p-4 bg-white rounded-3xl shadow-2xl shadow-black/5 transition-transform hover:scale-[1.02] duration-500">
                        <img src={qrUrl} alt="QR Code" className="w-56 h-56" />
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] font-bold text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                        <Info className="w-3.5 h-3.5" />
                        <span>Tự Động Nhận Tiền Trong 5 Giây</span>
                      </div>

                      <button
                        onClick={() => setStep(1)}
                        className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors mt-2 group"
                      >
                        <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        <span>Quay lại nhập số tiền</span>
                      </button>
                    </div>

                    {/* Column 2: Information */}
                    <div className="md:col-span-3 space-y-4 flex flex-col">
                      <div className="bg-card border border-border rounded-3xl overflow-hidden p-6 space-y-3 shadow-sm flex-1">
                        {[
                          { label: "Ngân hàng", value: selectedBank?.bankName, icon: <Building2 className="w-3 h-3" /> },
                          { label: "Số tài khoản", value: selectedBank?.accountNumber, icon: <Hash className="w-3 h-3" /> },
                          { label: "Chủ tài khoản", value: selectedBank?.accountName, icon: <User className="w-3 h-3" /> },
                          { label: "Số tiền", value: `${new Intl.NumberFormat('vi-VN').format(amount)} VND`, icon: <DollarSign className="w-3 h-3" /> },
                          { label: "Nội dung", value: transferSyntax, icon: <MessageSquare className="w-3 h-3" /> },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-background/30 border border-border/50 group hover:border-primary/30 transition-all">
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">{item.icon}</span>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-xs font-bold">{item.value}</span>
                              <button
                                onClick={() => handleCopy(item.value, item.label)}
                                className="p-2 bg-background/50 hover:bg-primary hover:text-white rounded-lg transition-all shadow-sm"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setStep(3)}
                        className="w-full h-14 bg-white dark:bg-card border-2 border-border text-foreground rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-secondary active:scale-95 transition-all flex items-center justify-center space-x-2 mt-2 group/btn"
                      >
                        <Check className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span>Xác Nhận Đã Chuyển Tiền</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Processing/Confirmation */}
                {step === 3 && (
                  <div className="bg-card border border-border rounded-3xl overflow-hidden p-12 flex flex-col items-center justify-center space-y-8 shadow-sm animate-in zoom-in-95 duration-500">
                    {!isConfirmed ? (
                      <>
                        <div className="relative">
                          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                          <Clock className="w-8 h-8 text-primary absolute inset-0 m-auto animate-pulse" />
                        </div>
                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-bold uppercase tracking-widest">Đang kiểm tra giao dịch</h3>
                          <p className="text-xs text-muted-foreground font-bold opacity-60">Hệ Thống Đang Xác Nhận Số Tiền...</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-bold uppercase tracking-widest text-emerald-500">Nạp tiền thành công!</h3>
                          <p className="text-xs text-muted-foreground font-bold opacity-60">Số Tiền Đã Được Cộng Vào Tài Khoản Của Bạn.</p>
                        </div>
                        <button
                          onClick={() => {
                            setDepositOpen(false)
                            setTimeout(() => {
                              setStep(1)
                              setIsConfirmed(false)
                              setAmount(0)
                            }, 500)
                          }}
                          className="w-full h-14 bg-emerald-500 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
                        >
                          <span>Xác Nhận</span>
                          <Check className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* --- CARD VIEW --- */}
            {method === "CARD" && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="md:col-span-3">
                  <form onSubmit={handleCardSubmit} className="bg-card border border-border rounded-3xl overflow-hidden p-8 space-y-6 shadow-sm h-full">
                    {/* Telco Selection */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Chọn Nhà Mạng</label>
                      <div className="grid grid-cols-5 gap-2">
                        {TELCOS.map((telco) => (
                          <button
                            key={telco.id}
                            type="button"
                            onClick={() => setSelectedTelco(telco.id)}
                            className={cn(
                              "relative flex flex-col items-center justify-center py-2 px-3 rounded-xl border transition-all duration-300",
                              selectedTelco === telco.id ? "bg-background border-primary shadow-lg shadow-primary/10" : "bg-background/50 border-border hover:border-primary/30"
                            )}
                          >
                            <div className="w-full aspect-video flex items-center justify-center">
                              <img src={telco.logo} alt={telco.name} className="w-full h-full object-contain" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount Selection */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Chọn Mệnh Giá</label>
                      <div className="grid grid-cols-3 gap-2">
                        {CARD_AMOUNTS.map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setSelectedCardAmount(amt)}
                            className={cn(
                              "py-3 rounded-xl text-[10px] font-bold border transition-all",
                              selectedCardAmount === amt ? "bg-primary text-white border-primary shadow-md" : "bg-background/50 text-muted-foreground border-border"
                            )}
                          >
                            {new Intl.NumberFormat('vi-VN').format(amt)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Số Serial</label>
                        <input
                          type="text"
                          value={serial}
                          onChange={(e) => setSerial(e.target.value)}
                          placeholder="Nhập Serial"
                          className="w-full bg-background/50 border border-border rounded-xl px-5 py-3.5 text-sm font-bold focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Mã Thẻ (Pin)</label>
                        <input
                          type="text"
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          placeholder="Nhập Mã Thẻ"
                          className="w-full bg-background/50 border border-border rounded-xl px-5 py-3.5 text-sm font-bold focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>

                    <button
                      disabled={loading}
                      type="submit"
                      className="w-full h-14 bg-white dark:bg-card border-2 border-border text-foreground rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-secondary active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 group/btn"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Gửi Thẻ Ngay</span><Send className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /></>}
                    </button>
                  </form>
                </div>

                {/* Card History (Integrated into Card) */}
                <div className="md:col-span-2 flex flex-col">
                  <div className="bg-card border border-border rounded-3xl overflow-hidden p-5 shadow-sm flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center space-x-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
                        <History className="w-3.5 h-3.5" />
                        <span>Giao dịch gần đây</span>
                      </div>
                      <button
                        onClick={refreshCardHistory}
                        disabled={isRefreshingHistory}
                        className={cn(
                          "relative flex items-center justify-center w-8 h-8 rounded-xl border transition-all duration-500",
                          isRefreshingHistory 
                            ? "bg-primary/20 border-primary/30 cursor-not-allowed" 
                            : "bg-background/80 border-border active:scale-90"
                        )}
                        title="Làm mới lịch sử"
                      >
                        <RotateCw className={cn(
                          "w-3.5 h-3.5 transition-all duration-700 ease-in-out",
                          isRefreshingHistory ? "animate-spin text-primary" : "text-muted-foreground"
                        )} />
                      </button>
                    </div>

                    {cardHistory.length > 0 ? (
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[550px] pr-2 custom-scrollbar">
                        {cardHistory.map((item) => (
                          <div key={item.id} className="p-4 bg-background/50 border border-border rounded-2xl flex items-center justify-between group hover:border-primary/40 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 aspect-video rounded-lg bg-background flex items-center justify-center p-1 shadow-inner border border-border/50">
                                {(() => {
                                  const telco = TELCOS.find(t => t.id === item.cardType.toUpperCase())
                                  return telco ? (
                                    <img src={telco.logo} alt={telco.name} className="w-full h-full object-contain" />
                                  ) : (
                                    <span className="text-[10px] font-bold text-primary">{item.cardType[0]}</span>
                                  )
                                })()}
                              </div>
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-tight">{item.cardType} - {new Intl.NumberFormat('vi-VN').format(item.declaredValue)}</p>
                                <p className="text-[9px] text-muted-foreground font-bold uppercase">{new Date(item.createdAt).toLocaleTimeString()}</p>
                              </div>
                            </div>
                            <div className={cn(
                              "px-2 py-0.5 rounded-md flex items-center space-x-1 border shrink-0 whitespace-nowrap",
                              item.status === "COMPLETED" ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" : 
                              item.status === "FAILED" ? "text-rose-500 bg-rose-500/5 border-rose-500/10" : 
                              "text-yellow-500 bg-yellow-500/5 border-yellow-500/10 shadow-[0_0_10px_rgba(234,179,8,0.1)]"
                            )}>
                              {item.status === "COMPLETED" ? <CheckCircle2 className="w-2.5 h-2.5" /> : 
                               item.status === "FAILED" ? <XCircle className="w-2.5 h-2.5" /> : 
                               <Clock className="w-2.5 h-2.5 animate-pulse" />}
                              <span className="text-[7.5px] font-bold uppercase tracking-widest">
                                {item.status === "COMPLETED" ? "Đã nạp" : 
                                 item.status === "FAILED" ? "Thất bại" : 
                                 "Chờ xử lý"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex-1 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-8 space-y-3 opacity-40">
                        <Clock className="w-8 h-8 text-muted-foreground" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Chưa có giao dịch</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
