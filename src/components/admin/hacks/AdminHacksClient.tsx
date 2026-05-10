"use client"

import { useState } from "react"
import Link from "next/link"
import { ADMIN_ROUTES } from "@/lib/config/admin-routes"
import { Plus, Pencil, Trash2, ShoppingBag, Eye, EyeOff, Wrench, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUI } from "@/providers/UIProvider"
import ConfirmModal from "@/components/utils/ConfirmModal"

interface HackTool {
  id: string
  name: string
  slug: string
  version: string
  thumbnail: string | null
  status: string
  totalDownload: number
  prices: any
  createdAt: string
}

export default function AdminHacksClient({ initialHacks }: { initialHacks: HackTool[] }) {
  const [hacks, setHacks] = useState(initialHacks)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { addMessage } = useUI()

  const handleDelete = async () => {
    if (!deletingId) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/hacks/${deletingId}`, { method: "DELETE" })
      if (res.ok) {
        setHacks(prev => prev.filter(h => h.id !== deletingId))
        addMessage({ type: "success", text: "Đã xóa hack tool thành công" })
      } else {
        addMessage({ type: "error", text: "Có lỗi xảy ra khi xóa" })
      }
    } catch (e) {
      addMessage({ type: "error", text: "Lỗi kết nối server" })
    } finally {
      setIsDeleting(false)
      setDeletingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Hoạt Động</span>
      case "MAINTENANCE": return <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Bảo Trì</span>
      case "HIDDEN": return <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">Đã Ẩn</span>
      default: return null
    }
  }

  return (
    <div className="space-y-6">


      {hacks.length === 0 ? (
        <div className="text-center py-20 bg-card border-2 border-border rounded-2xl text-muted-foreground">
          <Wrench className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm font-bold uppercase tracking-widest">Chưa có hack tool nào</p>
          <p className="text-xs mt-1 font-bold">Bấm nút "Thêm Hack Tool" phía trên để tạo mới.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {hacks.map(hack => (
            <div key={hack.id} className="flex items-center gap-4 p-4 bg-card border-2 border-border rounded-xl hover:border-primary/30 transition-all">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden shrink-0">
                {hack.thumbnail ? (
                  <img src={hack.thumbnail} alt={hack.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold uppercase tracking-tight text-foreground truncate">{hack.name}</h3>
                  <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">v{hack.version}</span>
                  {getStatusBadge(hack.status)}
                </div>
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3" />
                    {hack.totalDownload.toLocaleString("vi-VN")} lượt mua
                  </span>
                  <span>
                    {Array.isArray(hack.prices) && hack.prices.length > 0 
                      ? `${hack.prices.length} gói giá` 
                      : "Miễn phí"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/hacks/${hack.id}`}
                  className="p-2 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setDeletingId(hack.id)}
                  disabled={isDeleting}
                  className="p-2 rounded-lg bg-secondary hover:bg-rose-500/10 hover:text-rose-500 transition-all disabled:opacity-50 text-muted-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa hack tool này? Hành động này không thể hoàn tác."
        confirmText="Xóa Hack Tool"
        type="danger"
      />
    </div>
  )
}
