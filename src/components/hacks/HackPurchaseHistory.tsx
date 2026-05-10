"use client"

import { useState, useEffect, useCallback } from "react"
import { Key, History, Calendar, CheckCircle2, Monitor, Trash2, RotateCcw, AlertTriangle, X, Loader2 } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { cn } from "@/lib/utils"

interface HackPurchaseHistoryProps {
  hackId: string
  hackName: string
  refreshTrigger?: number
}

export default function HackPurchaseHistory({ hackId, hackName, refreshTrigger }: HackPurchaseHistoryProps) {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addMessage } = useUI()
  
  // Modal State
  const [showManageModal, setShowManageModal] = useState(false)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [keyDetails, setKeyDetails] = useState<any>(null)
  const [isFetchingDetails, setIsFetchingDetails] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/hacks/my-orders?hackId=${hackId}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [hackId])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory, refreshTrigger])

  const openManageModal = async (keyValue: string) => {
    setSelectedKey(keyValue)
    setShowManageModal(true)
    setIsFetchingDetails(true)
    try {
      const res = await fetch(`/api/hacks/manage-devices?key=${keyValue}`)
      if (res.ok) {
        const data = await res.json()
        setKeyDetails(data)
      } else {
        const err = await res.json()
        addMessage({ type: "error", text: err.error || "Không thể tải thông tin máy" })
      }
    } catch (e) {
      addMessage({ type: "error", text: "Lỗi kết nối máy chủ" })
    } finally {
      setIsFetchingDetails(false)
    }
  }

  const handleDeviceAction = async (action: 'reset' | 'delete', deviceIds?: string[]) => {
    if (!selectedKey) return
    
    const confirmMsg = action === 'reset' 
      ? "Bạn có chắc chắn muốn RESET toàn bộ thiết bị? Phí là 5,000 VND." 
      : `Bạn có chắc chắn muốn XÓA ${deviceIds?.length} thiết bị đã chọn? Phí là 5,000 VND.`

    if (!confirm(confirmMsg)) return

    setIsProcessing(true)
    try {
      const res = await fetch('/api/hacks/manage-devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyValue: selectedKey, action, deviceIds })
      })

      const data = await res.json()
      if (res.ok) {
        addMessage({ type: "success", text: data.message || "Thao tác thành công!" })
        // Refresh details
        openManageModal(selectedKey)
      } else {
        addMessage({ type: "error", text: data.error || "Thao tác thất bại" })
      }
    } catch (e) {
      addMessage({ type: "error", text: "Lỗi kết nối máy chủ" })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-card border-2 border-border p-6 md:p-8 rounded-2xl mt-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
          <History className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">Lịch Sử Mua Key VIP</h3>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Mã kích hoạt đã mua cho {hackName}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-muted-foreground animate-pulse font-bold uppercase tracking-widest">Đang tải lịch sử...</div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-border/60 rounded-2xl bg-secondary/10">
          <Key className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Bạn chưa mua key VIP nào</p>
          <p className="text-[10px] mt-1 text-muted-foreground uppercase tracking-widest">Vui lòng nâng cấp bản VIP để xem lịch sử</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order: any) => (
            <div key={order.id} className="p-5 bg-secondary/30 border-2 border-border rounded-2xl group hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-2 shrink-0">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => openManageModal(order.key)}
                    className="h-6 flex items-center gap-1 px-2 bg-amber-500/10 rounded-md border-2 border-amber-500/20 hover:bg-amber-500 hover:text-white transition-all text-[9px] font-bold text-amber-600 uppercase whitespace-nowrap"
                  >
                    <Monitor className="w-2.5 h-2.5" /> Máy
                  </button>
                  <div className="h-6 flex items-center gap-1 px-2 bg-emerald-500/10 rounded-md border-2 border-emerald-500/20 shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-500 uppercase whitespace-nowrap">Thành Công</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-5">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Thời Hạn</p>
                  <p className="text-sm font-bold text-foreground uppercase tracking-tight">{order.duration}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Số Máy</p>
                  <p className="text-sm font-bold text-foreground uppercase tracking-tight">{order.machines} Máy</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Tổng Tiền</p>
                  <p className="text-sm font-bold text-amber-500">{order.totalPrice.toLocaleString()} VND</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center">
                  <Key className="w-4 h-4 text-amber-500" />
                </div>
                <input 
                  readOnly 
                  value={order.key || "Đang xử lý..."} 
                  onClick={(e) => {
                    (e.target as HTMLInputElement).select()
                    navigator.clipboard.writeText(order.key)
                    addMessage({ type: "success", text: "Đã copy key!" })
                  }}
                  className="w-full bg-background border-2 border-border rounded-xl pl-11 pr-4 py-3 text-xs font-mono font-bold text-foreground cursor-pointer hover:border-amber-500/50 transition-all focus:outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity pointer-events-none">
                  <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border-2 border-amber-500/20 shadow-sm">COPY</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manage Devices Modal */}
      {showManageModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowManageModal(false)}>
          <div className="absolute inset-0 bg-black/50 transition-opacity" />
          <div 
            className="relative w-full max-w-lg bg-card border-2 border-border rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">Quản Lý Thiết Bị</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Key: {selectedKey?.substring(0, 15)}...</p>
                </div>
              </div>
              <button onClick={() => setShowManageModal(false)} className="p-2 hover:bg-secondary rounded-xl transition-all text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {isFetchingDetails ? (
                <div className="py-20 text-center animate-pulse"><Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" /><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Đang tải danh sách máy...</p></div>
              ) : keyDetails ? (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/30 p-4 rounded-2xl border border-border">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Giới Hạn Máy</p>
                      <p className="text-lg font-bold text-foreground tabular-nums">{keyDetails.device_limit} THIẾT BỊ</p>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-2xl border border-border">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Đang Sử Dụng</p>
                      <p className="text-lg font-bold text-amber-500">{(keyDetails.devices || []).length} / {keyDetails.device_limit}</p>
                    </div>
                  </div>

                  {/* Device List */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Danh Sách Máy Đã Lưu</h4>
                    {(keyDetails.devices || []).length === 0 ? (
                      <div className="py-10 text-center border-2 border-dashed border-border rounded-2xl text-xs font-bold text-muted-foreground uppercase tracking-widest">Chưa có máy nào kết nối</div>
                    ) : (
                      keyDetails.devices.map((device: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-secondary/10 border border-border rounded-2xl group hover:border-rose-500/20 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground border border-border"><Monitor className="w-4 h-4" /></div>
                            <div>
                              <p className="text-[11px] font-bold text-foreground leading-tight truncate max-w-[200px]">{device.device_model || "Thiết bị không tên"}</p>
                              <p className="text-[9px] text-muted-foreground font-bold truncate max-w-[200px]">{device.device_id}</p>
                            </div>
                          </div>
                          <button 
                            disabled={isProcessing}
                            onClick={() => handleDeviceAction('delete', [device.device_id])}
                            className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                            title="Xóa máy này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Warning Note */}
                  <div className="flex items-start gap-3 p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">Lưu ý quan trọng</p>
                      <p className="text-[10px] text-muted-foreground font-bold leading-relaxed uppercase tracking-wider">
                        Phí cho mỗi lần Reset hoặc Xóa THIẾT BỊ là <span className="text-rose-500 font-black">5,000 VND</span>. Thao tác này sẽ giải phóng slot để bạn có thể đăng nhập trên THIẾT BỊ khác.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border bg-secondary/20 flex items-center gap-4">
              <button 
                disabled={isProcessing || isFetchingDetails || (keyDetails?.devices || []).length === 0}
                onClick={() => handleDeviceAction('reset')}
                className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
              >
                <RotateCcw className={cn("w-3.5 h-3.5", isProcessing && "animate-spin")} />
                {isProcessing ? "Đang Xử Lý..." : "Reset Toàn Bộ (5k)"}
              </button>
              <button 
                onClick={() => setShowManageModal(false)}
                className="px-6 py-3 border border-border text-foreground rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-secondary transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
