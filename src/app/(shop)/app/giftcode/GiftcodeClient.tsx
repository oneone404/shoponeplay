"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Zap, Save, Trash2, Play, CheckCircle2, XCircle,
  RefreshCw, History, Settings, ChevronRight, Copy, Info, User, Terminal, HelpCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useUI } from "@/providers/UIProvider"
import Navbar from "@/components/layouts/Navbar"
import UserPageHeader from "@/components/shared/UserPageHeader"

interface SavedAccount {
  id: string;
  name: string;
  serverId?: string;
}

interface RedeemResult {
  roleId: string;
  code: string;
  status: "SUCCESS" | "FAILED" | "ALREADY_DONE";
  message: string;
}

export default function GiftcodeClient() {
  const { addMessage } = useUI()
  const [mode, setMode] = useState<"manual" | "saved" | "auto">("saved")
  const [idsInput, setIdsInput] = useState("")
  const [codesInput, setCodesInput] = useState("")
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([])
  const [selectedSavedIds, setSelectedSavedIds] = useState<string[]>([])
  const [autoEnabled, setAutoEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [results, setResults] = useState<RedeemResult[]>([])
  const [progress, setProgress] = useState(0)
  const [idFormat, setIdFormat] = useState<"id" | "full">("id")

  // Fetch config and saved accounts
  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/giftcode/config")
      const data = await res.json()
      if (data.savedAccounts) setSavedAccounts(data.savedAccounts)
      if (data.autoGiftcode !== undefined) setAutoEnabled(data.autoGiftcode)
    } catch (error) {
      addMessage({ type: "error", text: "Không thể tải cấu hình" })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAuto = async () => {
    try {
      const res = await fetch("/api/giftcode/config", {
        method: "POST",
        body: JSON.stringify({ autoGiftcode: !autoEnabled })
      })
      if (res.ok) {
        setAutoEnabled(!autoEnabled)
        addMessage({
          type: "success",
          text: !autoEnabled ? "Đã bật tự động nhập" : "Đã tắt tự động nhập"
        })
      }
    } catch (error) {
      addMessage({ type: "error", text: "Lỗi cập nhật cấu hình" })
    }
  }

  const handleRedeem = async () => {
    let targetIds: string[] = []

    if (mode === "manual") {
      const lines = idsInput.split("\n").map(l => l.trim()).filter(l => l !== "")
      targetIds = lines.map(line => {
        if (idFormat === "full") {
          const parts = line.split("|")
          return parts[parts.length - 1]?.trim() || ""
        }
        return line
      }).filter(id => id !== "")
    } else {
      targetIds = selectedSavedIds
    }

    const targetCodes = codesInput.split("\n").map(c => c.trim()).filter(c => c !== "")

    if (targetIds.length === 0) return addMessage({ type: "error", text: "Vui lòng chọn hoặc nhập ID nhân vật" })
    if (targetCodes.length === 0) return addMessage({ type: "error", text: "Vui lòng nhập Giftcode" })

    setIsRedeeming(true)
    setResults([])
    setProgress(0)

    try {
      const res = await fetch("/api/giftcode/redeem", {
        method: "POST",
        body: JSON.stringify({ roleIds: targetIds, codes: targetCodes })
      })
      const data = await res.json()
      if (data.success) {
        setResults(data.results)
        addMessage({ type: "success", text: `Đã xử lý xong ${data.results.length} lượt nhập` })
      } else {
        addMessage({ type: "error", text: data.error || "Có lỗi xảy ra" })
      }
    } catch (error) {
      addMessage({ type: "error", text: "Lỗi kết nối Server" })
    } finally {
      setIsRedeeming(false)
      setProgress(100)
    }
  }

  const clearManual = () => {
    setIdsInput("")
    setCodesInput("")
    setResults([])
    setProgress(0)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <UserPageHeader
        title="CÔNG CỤ"
        highlightTitle="GIFTCODE"
        subtitle="HỆ THỐNG NHẬP GIFTCODE TỰ ĐỘNG"
      />

      <main className="max-w-7xl mx-auto px-4 py-12 pb-32">
        <div className="lg:col-span-12 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border-2 border-border rounded-2xl overflow-hidden"
          >
            <div className="p-4 md:p-8 border-b-2 border-border bg-secondary/30 flex flex-col md:flex-row items-center md:items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 text-center md:text-left">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold uppercase tracking-tight">Cấu hình nhập code</h2>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1">Hệ thống xử lý đa luồng</p>
                </div>
              </div>

              <div className="flex bg-secondary/20 border-2 border-border rounded-xl p-1 h-fit mx-auto md:mx-0">
                <button
                  onClick={() => setMode("saved")}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all",
                    mode === "saved" ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary/50"
                  )}
                >
                  Đã lưu
                </button>
                <button
                  onClick={() => setMode("manual")}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all",
                    mode === "manual" ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary/50"
                  )}
                >
                  Thủ công
                </button>
                <button
                  onClick={() => setMode("auto")}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all",
                    mode === "auto" ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary/50"
                  )}
                >
                  Cài đặt
                </button>
              </div>
            </div>

            <div className="p-4 md:p-10 space-y-8 md:space-y-10">
              {/* ID Input/Selection */}
              {mode !== "auto" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Bước 1: Chọn nhân vật</label>
                    {mode === "saved" && savedAccounts.length > 0 && (
                      <div className="flex items-center space-x-3">
                        <button onClick={() => setSelectedSavedIds(savedAccounts.map(a => a.id))} className="text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors">CHỌN TẤT CẢ</button>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <button onClick={() => setSelectedSavedIds([])} className="text-[9px] font-bold text-muted-foreground hover:text-accent transition-colors">XÓA CHỌN</button>
                      </div>
                    )}
                  </div>

                  {mode === "saved" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                      {savedAccounts.length > 0 ? (
                        savedAccounts.map(acc => (
                          <button
                            key={acc.id}
                            onClick={() => {
                              setSelectedSavedIds(prev =>
                                prev.includes(acc.id) ? prev.filter(id => id !== acc.id) : [...prev, acc.id]
                              )
                            }}
                            className={cn(
                              "p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all text-left group relative overflow-hidden",
                              selectedSavedIds.includes(acc.id)
                                ? "bg-primary/5 border-primary scale-[1.02]"
                                : "bg-background border-border hover:border-primary/50"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="min-w-0">
                                <p className={cn(
                                  "text-sm font-bold truncate mb-0.5",
                                  selectedSavedIds.includes(acc.id) ? "text-primary" : "text-foreground"
                                )}>{acc.name}</p>
                                <p className="text-[10px] text-muted-foreground font-mono font-bold tracking-tighter">{acc.id}</p>
                              </div>
                              <div className={cn(
                                "w-6 h-6 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all",
                                selectedSavedIds.includes(acc.id)
                                  ? "bg-primary border-primary rotate-0"
                                  : "bg-background border-border rotate-45"
                              )}>
                                {selectedSavedIds.includes(acc.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="col-span-full py-12 text-center bg-background border-2 border-dashed border-border rounded-2xl group">
                          <User className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-20 group-hover:scale-110 transition-transform" />
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Chưa có nhân vật nào</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase font-bold">Hãy lưu nhân vật từ trang nạp game</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex bg-secondary/10 border-2 border-border rounded-xl p-1 w-fit mx-auto md:mx-0">
                        <button
                          onClick={() => setIdFormat("id")}
                          className={cn(
                            "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                            idFormat === "id" ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary/50"
                          )}
                        >
                          Chỉ ID
                        </button>
                        <button
                          onClick={() => setIdFormat("full")}
                          className={cn(
                            "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                            idFormat === "full" ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary/50"
                          )}
                        >
                          tk|mk|id
                        </button>
                      </div>
                      <div className="relative group">
                        <textarea
                          value={idsInput}
                          onChange={(e) => setIdsInput(e.target.value)}
                          placeholder={idFormat === "id" ? "Mỗi Dòng 1 ID (Ví Dụ: A1B2-C3D4-E5F6)..." : "Mỗi Dòng 1 Tài Khoản (Ví Dụ: user|pass|A1B2-C3D4-E5F6)..."}
                          className="w-full h-32 bg-background border-2 border-border rounded-xl md:rounded-2xl p-4 md:p-5 text-xs md:text-sm font-bold font-mono outline-none focus:border-primary transition-all resize-none"
                        />
                        <div className="absolute top-4 right-4 text-muted-foreground opacity-20">
                          <Terminal className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Codes Input & Auto Section */}
              <div className="space-y-4">
                {mode !== "auto" && (
                  <>
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Bước 2: Danh sách Giftcode</label>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Hỗ trợ đa luồng</span>
                      </div>
                    </div>
                    <div className="relative group">
                      <textarea
                        value={codesInput}
                        onChange={(e) => setCodesInput(e.target.value)}
                        placeholder="Mỗi Dòng 1 Code (Ví Dụ: GIFTCODE2024)..."
                        className="w-full h-48 bg-background border-2 border-border rounded-xl md:rounded-2xl p-4 md:p-5 text-xs md:text-sm font-bold font-mono outline-none focus:border-primary transition-all resize-none text-primary"
                      />
                      <div className="absolute bottom-4 right-6 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                        {codesInput.split('\n').filter(l => l.trim()).length} Codes Detected
                      </div>
                    </div>
                  </>
                )}

                {mode === "auto" && (
                  <div className="space-y-8">
                    <div className="relative p-6 bg-secondary/10 rounded-2xl border-2 border-border group/item">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                            <Zap className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold uppercase tracking-widest">One Bot AI (Smart Scan)</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase">Tự động quét & nạp code mới nhất từ NPH</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleAuto}
                          className={cn(
                            "w-14 h-7 rounded-full relative transition-all duration-500 bg-secondary border-2 border-border"
                          )}
                        >
                          <div
                            className={cn(
                              "absolute top-0.5 w-5 h-5 rounded-full transition-all",
                              autoEnabled ? "bg-primary left-7" : "bg-muted-foreground/30 left-0.5"
                            )}
                          />
                        </button>
                      </div>
                      <div className="p-4 bg-background/50 rounded-xl border border-border/50 text-[11px] text-muted-foreground leading-relaxed">
                        <p className="font-bold text-foreground mb-1 uppercase tracking-tighter">Giao thức tự động hóa:</p>
                        Bot sẽ liên tục kiểm tra cơ sở dữ liệu và các nguồn tin từ NPH. Khi có Giftcode mới, hệ thống sẽ tự động thực thi nạp cho tất cả nhân vật bạn đã lưu trong hệ thống mà không cần thao tác thủ công.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 bg-secondary/10 border-2 border-border rounded-2xl group/stat hover:border-primary transition-all">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Trạng thái Engine</p>
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-xl font-bold tracking-tighter">ONLINE</span>
                        </div>
                      </div>
                      <div className="p-5 bg-secondary/10 border-2 border-border rounded-2xl group/stat hover:border-primary transition-all">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Tổng nhân vật</p>
                        <p className="text-2xl font-bold tracking-tighter">{savedAccounts.length}</p>
                      </div>
                      <div className="p-5 bg-secondary/10 border-2 border-border rounded-2xl group/stat hover:border-primary transition-all">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Độ trễ xử lý</p>
                        <p className="text-2xl font-bold tracking-tighter">~0.2s</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {mode !== "auto" && (
                <div className="flex items-center justify-between gap-4 md:gap-6 pt-6 border-t-2 border-border">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => { }}
                      className="p-3 rounded-xl bg-primary/10 border-2 border-primary/20 transition-all active:scale-95"
                    >
                      <HelpCircle className="w-4 h-4 text-primary" />
                    </button>
                    <div className="hidden sm:block">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Cần hỗ trợ?</p>
                      <p className="text-[11px] text-muted-foreground font-medium">Nhấn Vào Đây Để Xem Hướng Dẫn</p>
                    </div>
                  </div>

                  <button
                    disabled={isRedeeming}
                    onClick={handleRedeem}
                    className={cn(
                      "w-12 h-12 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase transition-all active:scale-95 group overflow-hidden relative shadow-none",
                      isRedeeming ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.05] hover:-translate-y-1"
                    )}
                  >
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                    {isRedeeming ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Đang xử lý dữ liệu...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-current" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border-2 border-border rounded-2xl overflow-hidden"
              >
                <div className="p-4 md:p-8 border-b-2 border-border bg-secondary/30 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <History className="w-5 h-5" />
                    </div>
                    <h2 className="text-sm font-bold uppercase tracking-widest">Báo cáo kết quả chi tiết</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="px-3 py-1.5 bg-green-500/10 text-green-500 rounded-lg text-[10px] font-bold">
                      {results.filter(r => r.status === "SUCCESS").length} THÀNH CÔNG
                    </div>
                    <div className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-bold">
                      {results.filter(r => r.status === "FAILED").length} THẤT BẠI
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                  <div className="min-w-[600px] md:min-w-full">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-card z-10">
                        <tr className="border-b-2 border-border">
                          <th className="p-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">ID NHÂN VẬT</th>
                          <th className="p-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">GIFTCODE</th>
                          <th className="p-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">TRẠNG THÁI</th>
                          <th className="p-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-right">CHI TIẾT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-border">
                        {results.map((res, i) => (
                          <motion.tr
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={i}
                            className="hover:bg-secondary/10 transition-colors"
                          >
                            <td className="p-5 text-xs font-mono font-bold tracking-tighter">{res.roleId}</td>
                            <td className="p-5 text-xs font-mono font-bold text-accent">{res.code}</td>
                            <td className="p-5">
                              {res.status === "SUCCESS" ? (
                                <div className="flex items-center space-x-2 text-green-500 font-bold text-[10px] tracking-tighter">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                  <span>HOÀN TẤT</span>
                                </div>
                              ) : res.status === "ALREADY_DONE" ? (
                                <div className="flex items-center space-x-2 text-amber-500 font-bold text-[10px] tracking-tighter">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  <span>ĐÃ NHẬN</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2 text-red-500 font-bold text-[10px] tracking-tighter">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                  <span>LỖI MÃ</span>
                                </div>
                              )}
                            </td>
                            <td className="p-5 text-right text-[10px] text-muted-foreground font-bold uppercase tracking-tight italic">{res.message}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
