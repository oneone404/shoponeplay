"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Download, Key, Play, ChevronDown, ChevronUp, Wrench, AlertTriangle, X, ShoppingCart, Monitor, CreditCard, History, Check, Star, ShieldCheck, ShoppingBag, BookOpen, ExternalLink, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUI } from "@/providers/UIProvider"

interface ChangelogEntry {
  version: string
  content: string
  date: string
}

interface FeatureOption {
  name: string
  category: string
  isVip?: boolean
}

interface HackToolCardProps {
  hack: {
    id: string
    name: string
    slug: string
    version: string
    description: string | null
    thumbnail: string | null
    downloadUrl: string | null
    fileName: string | null
    fileSize: string | null
    features: any
    requirements: string | null
    changelog: any
    prices: any
    videoUrl: string | null
    status: string
    totalDownload: number
    externalId: number | null
  }
  onPurchaseSuccess?: () => void
  onViewHistory?: () => void
}

export default function HackToolCard({ hack, onPurchaseSuccess, onViewHistory }: HackToolCardProps) {
  const [showChangelog, setShowChangelog] = useState(false)
  const [showResources, setShowResources] = useState(false)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState<string>("")
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [machines, setMachines] = useState<number | string>(1)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [isLoadingFreeKey, setIsLoadingFreeKey] = useState(false)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const { addMessage } = useUI()
  const selectRef = useRef<HTMLDivElement>(null)
  const downloadRef = useRef<HTMLDivElement>(null)

  const features = Array.isArray(hack.features) ? hack.features : []
  const prices = Array.isArray(hack.prices) ? hack.prices : []
  const changelog = Array.isArray(hack.changelog) ? hack.changelog : []

  // Close custom select when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false)
      }
      if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Auto-scroll to menu when opened
  useEffect(() => {
    if (showDownloadMenu && downloadRef.current) {
      downloadRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [showDownloadMenu])

  // Initialize selected duration
  useEffect(() => {
    if (prices.length > 0 && !selectedDuration) {
      setSelectedDuration(prices[0].label)
    }
  }, [prices, selectedDuration])

  // Group features by category
  const groupedFeatures: Record<string, FeatureOption[]> = {}
  features.forEach((f: any) => {
    const cat = f.category || "Khác"
    if (!groupedFeatures[cat]) groupedFeatures[cat] = []
    groupedFeatures[cat].push(f)
  })

  const isMaintenance = hack.status === "MAINTENANCE"

  const calculateTotal = () => {
    const selectedObj = prices.find(p => p.label === selectedDuration)
    if (!selectedObj) return 0
    const basePrice = selectedObj.price
    const machineCount = Number(machines) || 1
    return basePrice + (machineCount - 1) * (basePrice / 2)
  }

  useEffect(() => {
    if (showPriceModal) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [showPriceModal])

  const handlePurchase = async () => {
    if (!selectedDuration) return addMessage({ type: "error", text: "Vui lòng chọn thời hạn sử dụng." })
    setIsPurchasing(true)
    try {
      const res = await fetch("/api/hacks/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hackId: hack.id,
          durationLabel: selectedDuration,
          machines: machines
        })
      })

      const data = await res.json()
      if (!res.ok) {
        addMessage({ type: "error", text: data.error || "Có lỗi xảy ra." })
      } else {
        addMessage({ type: "success", text: "Mua Key VIP thành công!" })
        setShowPriceModal(false)
        if (onPurchaseSuccess) onPurchaseSuccess()
      }
    } catch (e) {
      addMessage({ type: "error", text: "Lỗi kết nối server." })
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleGetFreeKey = async () => {
    setIsLoadingFreeKey(true)
    try {
      const res = await fetch("/api/hacks/free-key/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hackId: hack.id })
      })

      const data = await res.json()
      if (res.ok) {
        // Redirect to Link4M
        window.location.href = data.shortUrl
      } else {
        addMessage({ type: "error", text: data.error || "Không thể khởi tạo phiên lấy key free." })
      }
    } catch (e) {
      addMessage({ type: "error", text: "Lỗi kết nối máy chủ." })
    } finally {
      setIsLoadingFreeKey(false)
    }
  }

  const labelClass = "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block"
  const inputClass = "w-full bg-background border-2 border-border rounded-xl px-4 py-3 text-xs font-bold focus:border-primary outline-none transition-all"

  return (
    <>
      <div className={cn(
        "border-2 border-border rounded-2xl bg-card transition-all duration-300 relative",
        isMaintenance && "opacity-80"
      )}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-80 aspect-[16/9] md:aspect-auto shrink-0 bg-secondary overflow-hidden rounded-t-[calc(1rem-2px)] md:rounded-l-[calc(1rem-2px)] md:rounded-tr-none">
            {hack.thumbnail ? (
              <Image src={hack.thumbnail} alt={hack.name} fill sizes="(max-width: 768px) 100vw, 320px" className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Wrench className="w-12 h-12 text-muted-foreground/20" />
              </div>
            )}
            {isMaintenance && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/90 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Đang Bảo Trì</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 p-6 md:p-8 flex flex-col">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight text-foreground">{hack.name}</h2>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">v{hack.version}</span>
                {hack.status === "ACTIVE" && (
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Hoạt Động</span>
                )}
              </div>
              {hack.description && (
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{hack.description}</p>
              )}
            </div>

            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {hack.fileName && (
                <div className="h-8 px-3 bg-secondary/80 border-2 border-border/50 rounded-lg flex items-center">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate max-w-[120px]">{hack.fileName}</span>
                </div>
              )}
              {hack.fileSize && (
                <div className="h-8 px-3 bg-secondary/80 border-2 border-border/50 rounded-lg flex items-center">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{hack.fileSize}</span>
                </div>
              )}
              <div className="h-8 px-3 bg-secondary/80 border-2 border-border/50 rounded-lg flex items-center gap-1.5">
                <ShoppingBag className="w-3 h-3 text-muted-foreground" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  {(hack.totalDownload + 8540).toLocaleString("vi-VN")} lượt mua
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap mt-auto">
              {hack.downloadUrl && !isMaintenance && (
                <div className="relative" ref={downloadRef}>
                  {Array.isArray(hack.downloadUrl) && hack.downloadUrl.length > 1 ? (
                    <>
                      <button
                        onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
                      >
                        <Download className="w-4 h-4" /> Tải Về {showDownloadMenu ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                      </button>

                      {showDownloadMenu && (
                        <div className="absolute bottom-full left-0 mb-2 w-64 z-50 bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <div className="p-3 border-b border-border bg-secondary/30">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Chọn phiên bản tải về</p>
                          </div>
                          <div className="p-1">
                            {hack.downloadUrl.map((link: any, i: number) => {
                              const isVng = link.label.toUpperCase().includes("VNG")
                              const isGlobal = link.label.toUpperCase().includes("GLOBAL")
                              const iconPath = isVng ? "/images/games/pt.webp" : isGlobal ? "/images/games/global.webp" : null

                              return (
                                <a
                                  key={i}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setShowDownloadMenu(false)}
                                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-all group"
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    {iconPath && (
                                      <div className="w-6 h-6 rounded-lg overflow-hidden border border-border/50 shrink-0 bg-background">
                                        <img src={iconPath} alt={link.label} className="w-full h-full object-cover" />
                                      </div>
                                    )}
                                    <span className="text-[11px] font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">{link.label}</span>
                                  </div>
                                  <Download className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </a>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={Array.isArray(hack.downloadUrl) ? hack.downloadUrl[0]?.url : hack.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" /> Tải Về
                    </a>
                  )}
                </div>
              )}
              {prices.length > 0 && (
                <button onClick={() => setShowPriceModal(true)} className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-600 transition-all active:scale-95">
                  <Star className="w-4 h-4 fill-white" /> MUA KEY VIP
                </button>
              )}
              {hack.externalId && (
                <button
                  disabled={isLoadingFreeKey}
                  onClick={handleGetFreeKey}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-primary/10 text-primary border-2 border-primary/20 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Key className="w-4 h-4" /> {isLoadingFreeKey ? "Đang xử lý..." : "Nhận Key MIỄN PHÍ (24H)"}
                </button>
              )}
              {onViewHistory && (
                <button
                  onClick={onViewHistory}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-secondary text-foreground border-2 border-border rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-secondary/80 transition-all active:scale-95"
                >
                  <History className="w-4 h-4" /> Lịch sử mua key
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        {Object.keys(groupedFeatures).length > 0 && (
          <div className="border-t border-border p-6 md:p-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Danh Sách Tính Năng</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(groupedFeatures).map(([category, featureList]) => (
                <div key={category} className="space-y-2">
                  <div className="text-[9px] font-bold text-primary uppercase tracking-widest px-2 py-1 bg-primary/5 rounded-lg inline-block">
                    {category}
                  </div>
                  {featureList.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-1">
                      <div className={cn("w-1 h-1 rounded-full shrink-0", f.isVip ? "bg-amber-500" : "bg-emerald-500")} />
                      <span className="text-[11px] font-bold text-foreground flex items-center gap-1 min-w-0">
                        {f.isVip && <span className="text-[8px] font-black text-amber-600 dark:text-amber-400 shrink-0">[VIP]</span>}
                        <span className="truncate">{f.name}</span>
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        {hack.requirements && (
          <div className="border-t border-border px-6 md:px-8 py-4">
            <p className="text-[10px] text-muted-foreground">
              <span className="font-bold uppercase tracking-widest">Yêu cầu:</span> {hack.requirements}
            </p>
          </div>
        )}

        {/* Data Library */}
        <div className="border-t border-border">
          <button
            onClick={() => setShowResources(!showResources)}
            className="w-full flex items-center justify-between px-6 md:px-8 py-4 hover:bg-secondary/50 transition-all group"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">Thư Viện Dữ Liệu</span>
            </div>
            {showResources ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>

          {showResources && (
            <div className="px-6 md:px-8 pb-8 space-y-3 animate-in slide-in-from-top-2 duration-300">
              {hack.slug === "play-together" ? (
                <div className="grid grid-cols-1 gap-2">
                  <DataLink
                    title="Danh Sách ID Cá"
                    href="#"
                    subtitle="Tổng Hợp ID Cá, Rác..."
                  />
                </div>
              ) : (
                <div className="text-center py-10 opacity-50">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Đang cập nhật dữ liệu...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Changelog */}
        {changelog.length > 0 && (
          <div className="border-t border-border">
            <button
              onClick={() => setShowChangelog(!showChangelog)}
              className="w-full flex items-center justify-between px-6 md:px-8 py-4 hover:bg-secondary/50 transition-all"
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">Lịch Sử Cập Nhật</span>
              </div>
              {showChangelog ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            {showChangelog && (
              <div className="px-6 md:px-8 pb-8 space-y-4 animate-in slide-in-from-top-2 duration-300">
                {changelog.map((item: ChangelogEntry, idx: number) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-border pb-2 last:pb-0">
                    <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-border border-2 border-card" />
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[11px] font-bold text-foreground">Phiên Bản {item.version}</span>
                      <span className="text-[9px] font-medium text-muted-foreground">{item.date}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground whitespace-pre-line leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Buy Key Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6" onClick={() => setShowPriceModal(false)}>
          <div className="fixed inset-0 bg-black/50 animate-in fade-in duration-200" />

          <div
            className="relative w-full max-w-md bg-card border-2 border-border rounded-[1.5rem] max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 shadow-2xl shadow-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Star className="w-5 h-5 text-amber-500 fill-amber-500" /></div>
                <div>
                  <h3 className="text-sm md:text-base font-bold uppercase tracking-tight text-foreground">MUA KEY VIP</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-widest font-bold">{hack.name} v{hack.version}</p>
                </div>
              </div>
              <button onClick={() => setShowPriceModal(false)} className="p-2 rounded-xl bg-secondary hover:bg-destructive/10 hover:text-destructive transition-all"><X className="w-4 h-4" /></button>
            </div>

            {/* Modal Body */}
            <div className="p-5 md:p-6 space-y-6">
              {/* VIP Note */}
              <div className="flex items-center gap-3 p-3 bg-amber-500/5 border-2 border-amber-500/10 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-[11px] font-bold text-amber-600 dark:text-amber-500 leading-tight uppercase tracking-widest">
                  Mua key VIP để sử dụng full tính năng VIP của bản hack.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* Custom Beautiful Select for Duration */}
                <div className="space-y-1.5" ref={selectRef}>
                  <label className={labelClass}>Chọn Gói Thời Gian</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                      className={cn(
                        inputClass,
                        "flex items-center justify-between group bg-background/50 hover:border-amber-500/50 text-left",
                        isSelectOpen && "border-amber-500"
                      )}
                    >
                      <span className="truncate">
                        {selectedDuration ? (
                          <span className="flex items-center gap-2">
                            <span className="text-amber-500 uppercase">{selectedDuration}</span>
                            <span className="text-muted-foreground/30">•</span>
                            <span>{prices.find(p => p.label === selectedDuration)?.price?.toLocaleString()} VND</span>
                          </span>
                        ) : "Chọn gói sử dụng"}
                      </span>
                      {isSelectOpen ? <ChevronUp className="w-4 h-4 text-amber-500" /> : <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />}
                    </button>

                    {/* Options Dropdown */}
                    {isSelectOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="max-h-60 overflow-y-auto">
                          {prices.map((p: any, i: number) => {
                            const isSelected = selectedDuration === p.label
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  setSelectedDuration(p.label)
                                  setIsSelectOpen(false)
                                }}
                                className={cn(
                                  "w-full flex items-center justify-between px-4 py-3 text-xs font-bold transition-all hover:bg-secondary",
                                  isSelected ? "bg-amber-500/5 text-amber-500" : "text-foreground"
                                )}
                              >
                                <div className="flex flex-col items-start gap-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="uppercase tracking-tight">{p.label}</span>
                                    {p.label === "1 Tháng" && (
                                      <span className="bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded-md">HOT</span>
                                    )}
                                  </div>
                                  <span className={cn("text-[10px]", isSelected ? "text-amber-500/70" : "text-muted-foreground")}>
                                    {p.price?.toLocaleString()} VND
                                  </span>
                                </div>
                                {isSelected && <Check className="w-4 h-4" />}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Số Máy Sử Dụng</label>
                  <div className="relative">
                    <Monitor className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={machines}
                      onChange={(e) => setMachines(e.target.value)}
                      onBlur={() => {
                        if (!machines || Number(machines) < 1) setMachines(1)
                      }}
                      className={cn(inputClass, "pl-11 bg-background/50")}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-[1.5rem] p-5 border-2 border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tổng Tiền</span>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-500" />
                    <span className="text-xl font-bold text-amber-500">{calculateTotal().toLocaleString()} VND</span>
                  </div>
                </div>
                <button disabled={isPurchasing} onClick={handlePurchase} className="w-full py-4 bg-amber-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> {isPurchasing ? "Đang Xử Lý..." : "Thanh Toán VIP Ngay"}
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-secondary/30 shrink-0"><p className="text-[9px] text-muted-foreground text-center leading-relaxed font-bold uppercase tracking-wider">Hệ thống nạp key tự động 24/7</p></div>
          </div>
        </div>
      )}
    </>
  )
}

function DataLink({ title, subtitle, href }: { title: string, subtitle?: string, href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-4 bg-secondary/30 border-2 border-border/50 rounded-2xl hover:border-primary/30 hover:bg-secondary/50 transition-all group/link"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] font-bold text-foreground group-hover/link:text-primary transition-colors">{title}</span>
        {subtitle && <span className="text-[9px] text-muted-foreground">{subtitle}</span>}
      </div>
      <div className="flex items-center gap-2">
        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover/link:text-primary transition-all" />
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/link:translate-x-1 transition-transform" />
      </div>
    </a>
  )
}
