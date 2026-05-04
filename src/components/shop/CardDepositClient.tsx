"use client"

import { useState, useEffect } from "react"
import { CreditCard, History, Send, Info, CheckCircle2, XCircle, Clock } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { cn } from "@/lib/utils"

const TELCOS = [
  { id: "VIETTEL", name: "Viettel", logo: "https://thesieure.com/storage/userfiles/images/viettel.png" },
  { id: "MOBIFONE", name: "Mobifone", logo: "https://thesieure.com/storage/userfiles/images/mobifone.png" },
  { id: "VINAPHONE", name: "Vinaphone", logo: "https://thesieure.com/storage/userfiles/images/vinaphone.png" },
  { id: "ZING", name: "Zing", logo: "https://thesieure.com/storage/userfiles/images/zing.png" },
  { id: "GATE", name: "Gate", logo: "https://thesieure.com/storage/userfiles/images/gate.png" },
]

const AMOUNTS = [10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000]

export default function CardDepositClient() {
  const { addMessage } = useUI()
  const [loading, setLoading] = useState(false)
  const [selectedTelco, setSelectedTelco] = useState(TELCOS[0].id)
  const [selectedAmount, setSelectedAmount] = useState(AMOUNTS[4])
  const [serial, setSerial] = useState("")
  const [pin, setPin] = useState("")
  const [history, setHistory] = useState<any[]>([])

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/user/deposits/card/history")
      const data = await res.json()
      if (data.deposits) setHistory(data.deposits)
    } catch (error) {
      console.error("Failed to fetch history", error)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  // Poll history every 10s if there are pending cards
  useEffect(() => {
    const hasPending = history.some(h => h.status === "PENDING")
    if (hasPending || history.length === 0) {
      const interval = setInterval(fetchHistory, 10000)
      return () => clearInterval(interval)
    }
  }, [history])

  const handleSubmit = async (e: React.FormEvent) => {
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
          amount: selectedAmount,
          serial,
          pin
        })
      })

      const data = await res.json()
      if (data.success) {
        addMessage({ type: "success", text: "Đã gửi thẻ thành công. Vui lòng chờ xử lý!" })
        setSerial("")
        setPin("")
        fetchHistory()
      } else {
        addMessage({ type: "error", text: data.error || "Gửi thẻ thất bại" })
      }
    } catch (error) {
      addMessage({ type: "error", text: "Lỗi kết nối máy chủ" })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "text-emerald-500 bg-emerald-500/10"
      case "FAILED": return "text-rose-500 bg-rose-500/10"
      default: return "text-amber-500 bg-amber-500/10"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED": return <CheckCircle2 className="w-3 h-3" />
      case "FAILED": return <XCircle className="w-3 h-3" />
      default: return <Clock className="w-3 h-3 animate-pulse" />
    }
  }

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight italic">
          Nạp Thẻ <span className="text-primary">Cào</span>
        </h1>
        <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-60">
          Hệ thống nạp thẻ tự động 24/7 - Xử lý trong 10-30s
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="p-8 bg-secondary/30 backdrop-blur-xl border border-border rounded-[2.5rem] space-y-8 shadow-2xl shadow-black/5">
            <div className="space-y-6">
              {/* Telco Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Chọn Nhà Mạng</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {TELCOS.map((telco) => (
                    <button
                      key={telco.id}
                      type="button"
                      onClick={() => setSelectedTelco(telco.id)}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 active:scale-95",
                        selectedTelco === telco.id
                          ? "bg-background border-primary shadow-lg shadow-primary/10"
                          : "bg-background/50 border-border hover:border-primary/50"
                      )}
                    >
                      <div className="h-8 w-12 relative mb-1">
                        <img src={telco.logo} alt={telco.name} className="h-full w-full object-contain" />
                      </div>
                      <span className="text-[10px] font-bold uppercase">{telco.name}</span>
                      {selectedTelco === telco.id && (
                        <div className="absolute top-1.5 right-1.5">
                          <CheckCircle2 className="w-3 h-3 text-primary fill-primary/10" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Chọn Mệnh Giá</label>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                  {AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setSelectedAmount(amount)}
                      className={cn(
                        "py-3 rounded-xl text-[11px] font-bold transition-all border",
                        selectedAmount === amount
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                          : "bg-background/50 text-muted-foreground border-border hover:border-primary/30"
                      )}
                    >
                      {new Intl.NumberFormat('vi-VN').format(amount)} đ
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Số Serial</label>
                  <input
                    type="text"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    placeholder="Nhập số Serial thẻ"
                    className="w-full bg-background/50 border border-border rounded-2xl px-6 py-4 text-sm font-bold text-foreground outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Mã Thẻ (Pin)</label>
                  <input
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Nhập mã thẻ cào"
                    className="w-full bg-background/50 border border-border rounded-2xl px-6 py-4 text-sm font-bold text-foreground outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                disabled={loading}
                type="submit"
                className="w-full h-16 bg-foreground text-background rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-foreground/10 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Gửi Thẻ Ngay</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Info & History */}
        <div className="space-y-6">
          <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl space-y-4">
            <div className="flex items-center space-x-2 text-amber-500">
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Lưu ý trước khi nạp</span>
            </div>
            <ul className="space-y-3">
              {[
                "Vui lòng chọn đúng mệnh giá, chọn sai mất 100% giá trị thẻ.",
                "Gửi thẻ sai quá 3 lần tài khoản sẽ bị khóa nạp thẻ.",
                "Thẻ sẽ được duyệt tự động sau 10-60 giây.",
                "Mọi thắc mắc vui lòng liên hệ hỗ trợ."
              ].map((text, i) => (
                <li key={i} className="flex items-start space-x-2 text-[11px] text-muted-foreground leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40 mt-1.5 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-secondary/30 border border-border rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Lịch sử gần đây</span>
              </div>
              <button className="text-[9px] font-bold text-primary uppercase">Xem tất cả</button>
            </div>

            <div className="space-y-4">
              {history.length > 0 ? (
                history.map((item) => (
                  <div key={item.id} className="p-4 bg-background/50 border border-border/50 rounded-2xl space-y-3 group hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-[10px] font-bold text-primary">
                          {item.cardType[0]}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase">{item.cardType}</p>
                          <p className="text-[9px] text-muted-foreground font-medium">{new Date(item.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "px-2 py-1 rounded-md flex items-center space-x-1.5",
                        getStatusColor(item.status)
                      )}>
                        {getStatusIcon(item.status)}
                        <span className="text-[8px] font-bold uppercase tracking-widest">{item.status}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-1 border-t border-border/10">
                      <div>
                        <p className="text-[8px] text-muted-foreground uppercase tracking-widest mb-0.5">Mệnh giá</p>
                        <p className="text-[11px] font-bold italic">{new Intl.NumberFormat('vi-VN').format(item.declaredValue)} đ</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-muted-foreground uppercase tracking-widest mb-0.5">Serial</p>
                        <p className="text-[11px] font-bold truncate opacity-60">...{item.serial.slice(-6)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-xs text-muted-foreground font-medium italic opacity-50">
                  Chưa có giao dịch nào gần đây.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
