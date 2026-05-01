"use client"

import { useState, useEffect } from "react"
import { Loader2, Activity, Cpu, HardDrive, ShieldCheck, Zap, Database, Clock, Server, Globe, Users, ShoppingBag, Network, ShieldAlert, Monitor, Terminal, Ban, Trash2, Plus, Info, ChevronLeft, ChevronRight } from "lucide-react"
import ConfirmModal from "@/components/utils/ConfirmModal"

interface SystemInfo {
  version: string
  nextVersion: string
  prismaVersion: string
  nodeVersion: string
  platform: string
  uptime: string
  memory: string
  osMemory: string
  env: string
  cpuCount: number
  cpuModel: string
  cpuUsage: string
  dbStatus: string
  localIp: string
  traffic: {
    totalUsers: number
    todayOrders: number
  }
  timezone: string
  serverTime: string
  lastUpdate: string
}

interface VisitorLog {
  id: string
  ip: string
  userAgent: string
  path: string
  method: string
  createdAt: string
}

interface BannedIPEntry {
  id: string
  ip: string
  reason: string
  expiresAt: string | null
  createdAt: string
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function SystemStatus() {
  const [info, setInfo] = useState<SystemInfo | null>(null)
  const [logs, setLogs] = useState<VisitorLog[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [bannedIPs, setBannedIPs] = useState<BannedIPEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [banInput, setBanInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [apiStatus, setApiStatus] = useState<"Online" | "Degraded" | "Offline">("Online")
  const [latestError, setLatestError] = useState<string | null>(null)

  // State cho ConfirmModal
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    type: "danger" | "info" | "warning"
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger"
  })

  const fetchData = async (page = currentPage) => {
    try {
      const [infoRes, logsRes, bannedRes] = await Promise.all([
        fetch("/api/admin/system-info"),
        fetch(`/api/admin/settings/visitor-logs?page=${page}`),
        fetch("/api/admin/settings/banned-ips"),
      ])

      setApiStatus(infoRes.ok && logsRes.ok && bannedRes.ok ? "Online" : "Degraded")

      if (infoRes.ok) setInfo(await infoRes.json())
      if (logsRes.ok) {
        const data = await logsRes.json()
        setLogs(data.logs)
        setPagination(data.pagination)
      }
      if (bannedRes.ok) setBannedIPs(await bannedRes.json())

      if (!infoRes.ok || !logsRes.ok || !bannedRes.ok) {
        setLatestError(`API health warning: system=${infoRes.status}, logs=${logsRes.status}, banned=${bannedRes.status}`)
      } else {
        setLatestError(null)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown monitoring error"
      setApiStatus("Offline")
      setLatestError(message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData(currentPage)
    let interval: any
    if (currentPage === 1) {
      interval = setInterval(() => fetchData(1), 15000)
    }
    return () => interval && clearInterval(interval)
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage)
    }
  }

  // Wrapper gọi modal xác nhận
  const showConfirm = (title: string, message: string, onConfirm: () => Promise<void>, type: "danger" | "info" | "warning" = "danger") => {
    setConfirmConfig({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: async () => {
        setIsProcessing(true)
        await onConfirm()
        setIsProcessing(false)
        setConfirmConfig(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  const banIP = async () => {
    if (!banInput.trim()) return
    try {
      const res = await fetch("/api/admin/settings/banned-ips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: banInput.trim(), reason: "Manual Ban by Admin", permanent: false })
      })
      if (res.ok) {
        setBanInput("")
        fetchData()
      }
    } catch (e) { console.error(e) }
  }

  const unbanIP = async (ip: string) => {
    try {
      await fetch("/api/admin/settings/banned-ips", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip })
      })
      fetchData()
    } catch (e) { console.error(e) }
  }

  const clearLogs = async () => {
    try {
      await fetch("/api/admin/settings/visitor-logs", { method: "DELETE" })
      fetchData()
    } catch (e) { console.error(e) }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Đang tải dữ liệu giám sát...</p>
        </div>
      </div>
    )
  }

  if (!info) return null

  return (
    <div className="space-y-8">
      {/* Confirm Modal Instance */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        type={confirmConfig.type}
        isLoading={isProcessing}
      />

      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-6">
        <h3 className="font-bold text-base text-foreground">Trạng Thái Hệ Thống</h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => showConfirm("Xóa Nhật Ký", "Bạn Có Chắc Chắn Muốn Xóa Sạch Toàn Bộ Lịch Sử Truy Cập? Hành Động Này Không Thể Hoàn Tác.", clearLogs)}
            title="Dọn dẹp nhật ký"
            className="p-1.5 rounded-lg bg-secondary/50 border border-border text-muted-foreground hover:bg-secondary hover:text-primary transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-lg border border-border/40 text-[10px] font-bold">
            <Network className="w-3 h-3 text-primary" />
            <span className="text-muted-foreground">Server IP:</span>
            <span>{info.localIp}</span>
          </div>
        </div>
      </div>

      {/* Grid: Critical Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          label="API Status"
          value={apiStatus}
          subValue="Admin monitoring endpoints"
          icon={<Activity className="w-4 h-4" />}
          color={apiStatus === "Online" ? "green" : apiStatus === "Degraded" ? "primary" : "red"}
          pulse={apiStatus === "Online"}
        />
        <StatusCard
          label="Database"
          value={info.dbStatus}
          subValue={info.dbStatus === "Connected" ? "PostgreSQL connected" : "Connection failed"}
          icon={<Database className="w-4 h-4" />}
          color={info.dbStatus === "Connected" ? "green" : "red"}
          pulse={info.dbStatus === "Connected"}
        />
        <StatusCard
          label="IP Bị Chặn"
          value={bannedIPs.length.toString()}
          subValue="Blacklist entries"
          icon={<Ban className="w-4 h-4" />}
          color={bannedIPs.length > 0 ? "red" : "green"}
        />
        <StatusCard
          label="Lỗi Gần Nhất"
          value={latestError ? "Có lỗi" : "Không có"}
          subValue={latestError || "Monitoring clean"}
          icon={<ShieldAlert className="w-4 h-4" />}
          color={latestError ? "red" : "green"}
          pulse={!latestError}
        />
      </div>

      {/* Grid: Hardware & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Server className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Chi tiết phần cứng</span>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Processor</span>
              <span className="font-bold text-foreground max-w-[200px] truncate">{info.cpuModel}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Platform</span>
              <span className="font-bold text-foreground uppercase">{info.platform}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Node Version</span>
              <span className="font-bold text-foreground">{info.nodeVersion}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Monitor className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Thông tin vận hành</span>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Thời gian hoạt động</span>
              <span className="font-bold text-green-500">{info.uptime}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Tổng khách hàng</span>
              <span className="font-bold text-foreground">{(info?.traffic?.totalUsers || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Đơn hàng hôm nay</span>
              <span className="font-bold text-foreground">{(info?.traffic?.todayOrders || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Ban Input */}
      <div className="p-4 bg-card border border-border/60 rounded-2xl flex flex-col md:flex-row gap-3 items-center shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground shrink-0">
          <Ban className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Chặn IP thủ công:</span>
        </div>
        <div className="flex flex-1 gap-2 w-full">
          <input
            type="text"
            value={banInput}
            onChange={(e) => setBanInput(e.target.value)}
            placeholder="Ví dụ: 1.2.3.4"
            className="flex-1 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/40 text-xs focus:border-primary outline-none transition-all"
            onKeyDown={(e) => e.key === "Enter" && showConfirm("Chặn IP", `Bạn có muốn chặn IP ${banInput} không?`, banIP, "warning")}
          />
          <button
            onClick={() => showConfirm("Chặn IP", `Bạn Có Muốn Chặn IP ${banInput} Không?`, banIP, "warning")}
            disabled={isProcessing || !banInput.trim()}
            className="px-4 py-1.5 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isProcessing ? "..." : "Thực Thi"}
          </button>
        </div>
      </div>

      {/* Visitor Logs Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nhật ký truy cập gần đây (Live Feed)</span>
          </div>
          <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">LIVE</span>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left table-fixed border-collapse">
              <thead>
                <tr className="bg-secondary/30 border-b border-border/40">
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground w-[100px] whitespace-nowrap">Thời gian</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground w-[180px] whitespace-nowrap">Địa chỉ IP</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground w-[160px] whitespace-nowrap">Đường dẫn</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground w-[70px] whitespace-nowrap">Method</th>
                  <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">User-Agent</th>
                  <th className="px-4 py-3 w-[40px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {logs.length > 0 ? logs.map((log) => (
                  <tr key={log.id} className="hover:bg-secondary/10 transition-colors group">
                    <td className="px-4 py-2.5">
                      <p className="text-[10px] font-bold text-foreground leading-none">{new Date(log.createdAt).toLocaleTimeString('vi-VN')}</p>
                      <p className="text-[8px] text-muted-foreground mt-0.5">{new Date(log.createdAt).toLocaleDateString('vi-VN')}</p>
                    </td>
                    <td className="px-4 py-2.5 overflow-hidden">
                      <span className="px-1.5 py-0.5 bg-secondary/50 rounded text-[9px] font-bold font-mono text-primary block truncate" title={log.ip}>{log.ip}</span>
                    </td>
                    <td className="px-4 py-2.5 text-[10px] font-medium text-foreground truncate">{log.path}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${log.method === 'GET' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>{log.method}</span>
                    </td>
                    <td className="px-4 py-2.5 text-[9px] text-muted-foreground truncate" title={log.userAgent || ''}>
                      {log.userAgent || 'Unknown'}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button 
                        onClick={() => showConfirm("Chặn IP", `Bạn Muốn Chặn IP ${log.ip}?`, async () => {
                          await fetch("/api/admin/settings/banned-ips", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ip: log.ip, reason: "Banned from Visitor Log", permanent: false })
                          })
                          fetchData()
                        }, "warning")} 
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-all"
                      >
                        <Ban className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-xs text-muted-foreground italic">Chưa có dữ liệu...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-secondary/10 border-t border-border/40">
              <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest">
                Trang {pagination.page} / {pagination.totalPages} • Tổng {pagination.total}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-primary disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <div className="flex items-center gap-1 px-2">
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                    let pageNum = i + 1;
                    if (pagination.totalPages > 5) {
                      if (currentPage > 3) pageNum = currentPage - 3 + i + 1;
                      if (pageNum > pagination.totalPages) pageNum = pagination.totalPages - 4 + i;
                    }
                    if (pageNum <= 0 || pageNum > pagination.totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-6 h-6 rounded-lg text-[9px] font-bold flex items-center justify-center transition-all ${
                          currentPage === pageNum ? "bg-primary text-white" : "hover:bg-secondary/50 text-muted-foreground"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="p-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-primary disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blacklist List */}
      {bannedIPs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Ban className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Danh sách IP đang bị khóa</span>
          </div>
          <div className="bg-card border border-red-500/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-border/40">
                  {bannedIPs.map((b) => (
                    <tr key={b.id} className="hover:bg-red-500/5 transition-colors">
                      <td className="px-4 py-2">
                        <span className="text-[10px] font-bold font-mono text-red-500">{b.ip}</span>
                      </td>
                      <td className="px-4 py-2 text-[10px] text-muted-foreground">{b.reason}</td>
                      <td className="px-4 py-2 text-[10px] text-muted-foreground">
                        {b.expiresAt ? new Date(b.expiresAt).toLocaleString('vi-VN') : "Vĩnh viễn"}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button 
                          onClick={() => showConfirm("Gỡ Chặn", `Bạn Muốn Gỡ Chặn Cho IP ${b.ip}?`, async () => {
                            await fetch("/api/admin/settings/banned-ips", {
                              method: "DELETE",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ ip: b.ip })
                            })
                            fetchData()
                          }, "info")} 
                          className="p-1 rounded hover:bg-green-500/10 text-green-500 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center pt-4 border-t border-border/30">
        <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-[0.4em]">ShopOnePlay Security Shield v{info.version}</p>
      </div>
    </div>
  )
}

function StatusCard({ label, value, subValue, icon, color = "primary", pulse = false, progress }: {
  label: string, value: string, subValue?: string, icon: React.ReactNode,
  color?: "primary" | "green" | "red" | "warning", pulse?: boolean, progress?: number
}) {
  return (
    <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 hover:border-primary/20 transition-all group flex flex-col justify-between min-h-[110px] relative overflow-hidden">
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-primary/20 transition-all duration-1000" style={{ width: `${progress}%` }} />
      )}
      <div className="flex items-center gap-2 mb-2 text-muted-foreground group-hover:text-primary transition-colors">
        {icon}
        <p className="text-[9px] font-bold uppercase tracking-widest">{label}</p>
      </div>
      <div className="space-y-1 relative z-10">
        <div className="flex items-center gap-2">
          {pulse && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
          <p className={`font-bold text-xl tracking-tight ${color === "green" ? "text-green-500" : color === "red" ? "text-red-500" : "text-foreground"}`}>{value}</p>
        </div>
        {subValue && <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tight">{subValue}</p>}
      </div>
    </div>
  )
}
