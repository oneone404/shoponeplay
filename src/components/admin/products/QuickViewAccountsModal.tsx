"use client"

import { useEffect, useState, useCallback } from "react"
import {
  X,
  Search,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
  ShieldOff,
  ShoppingBag,
  Eye,
  EyeOff
} from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import ConfirmModal from "@/components/utils/ConfirmModal"
import { cn } from "@/lib/utils"

interface AccountSecret {
  id: string
  username: string
  password: string
  extraInfo?: string | null
  accountId?: string | null
  status: "AVAILABLE" | "SOLD" | "EXPORTED" | "DISABLED"
  isSold: boolean
  createdAt: string
}

interface QuickViewAccountsModalProps {
  product: { id: string; title: string }
  onClose: () => void
}

export default function QuickViewAccountsModal({ product, onClose }: QuickViewAccountsModalProps) {
  const [accounts, setAccounts] = useState<AccountSecret[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isToggling, setIsToggling] = useState<string | null>(null)

  const itemsPerPage = 10
  const { addMessage } = useUI()

  const fetchAccounts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/accounts/quick-view?productId=${product.id}&page=${currentPage}&limit=${itemsPerPage}&search=${search}`)
      const data = await res.json()
      if (data.success) {
        setAccounts(data.accounts)
        setTotalPages(data.pagination.totalPages)
        setTotalItems(data.pagination.total)
      }
    } catch (error) {
      addMessage({ type: "error", text: "Không thể tải danh sách tài khoản" })
    } finally {
      setLoading(false)
    }
  }, [product.id, currentPage, search, addMessage])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      const res = await fetch(`/api/admin/accounts/${deletingId}`, { method: "DELETE" })
      if (res.ok) {
        addMessage({ type: "success", text: "Đã xóa tài khoản vĩnh viễn" })
        fetchAccounts()
      }
    } catch (error) {
      addMessage({ type: "error", text: "Lỗi khi xóa tài khoản" })
    } finally {
      setIsDeleteModalOpen(false)
      setDeletingId(null)
    }
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    if (isToggling) return
    setIsToggling(id)
    const newStatus = currentStatus === "AVAILABLE" ? "DISABLED" : "AVAILABLE"

    try {
      const res = await fetch(`/api/admin/accounts/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        addMessage({
          type: "success",
          text: newStatus === "DISABLED" ? "Đã tạm ẩn tài khoản" : "Đã mở bán lại tài khoản"
        })
        // Cập nhật state local để mượt mà
        setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, status: newStatus as any } : acc))
      }
    } catch (error) {
      addMessage({ type: "error", text: "Lỗi khi cập nhật trạng thái" })
    } finally {
      setIsToggling(null)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
          <div>
            <h2 className="text-xl font-bold text-foreground uppercase tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              QUẢN LÝ KHO TÀI KHOẢN
            </h2>
            <p className="text-xs font-bold text-muted-foreground uppercase opacity-60 mt-1">Sản phẩm: {product.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl transition-colors">
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-border bg-card flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm Kiếm Username, Password, ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-xl text-sm font-bold outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-3 py-2 bg-secondary/50 rounded-lg border border-border">
              Tổng kho: {totalItems}
            </div>
            <button
              onClick={fetchAccounts}
              className={cn("p-2 hover:bg-secondary rounded-xl transition-all", loading && "animate-spin")}
              title="Làm mới"
            >
              <RefreshCw className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="sticky top-0 z-10 bg-secondary/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4">Tài khoản / Mật khẩu</th>
                <th className="px-6 py-4">ID Tài khoản</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8 bg-secondary/5" />
                  </tr>
                ))
              ) : accounts.length > 0 ? (
                accounts.map((acc) => (
                  <tr key={acc.id} className={cn("hover:bg-secondary/20 transition-colors group", acc.status === "DISABLED" && "opacity-60")}>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-bold text-foreground font-mono">{acc.username}</p>
                        <p className="text-[11px] text-muted-foreground font-mono opacity-70">{acc.password}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-muted-foreground font-mono">{acc.accountId || "---"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {acc.status === "SOLD" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-secondary text-muted-foreground uppercase">
                            Đã bán
                          </span>
                        ) : (
                          <button
                            disabled={isToggling === acc.id}
                            onClick={() => toggleStatus(acc.id, acc.status)}
                            className={cn(
                              "relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none",
                              acc.status === "AVAILABLE" ? "bg-green-500" : "bg-zinc-600",
                              isToggling === acc.id && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <span
                              className={cn(
                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                acc.status === "AVAILABLE" ? "translate-x-7" : "translate-x-1"
                              )}
                            />
                            <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
                              {acc.status === "AVAILABLE" ? <Eye className="w-3 h-3 text-white ml-0.5" /> : <EyeOff className="w-3 h-3 text-white ml-auto mr-0.5" />}
                            </div>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setDeletingId(acc.id)
                          setIsDeleteModalOpen(true)
                        }}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
                    Không tìm thấy tài khoản nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 border-t border-border bg-secondary/30 flex items-center justify-between">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Trang {currentPage} / {totalPages}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => goToPage(1)} disabled={currentPage === 1} className="p-2 hover:bg-background rounded-lg disabled:opacity-20 transition-all"><ChevronsLeft className="w-4 h-4" /></button>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 hover:bg-background rounded-lg disabled:opacity-20 transition-all"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-4 text-xs font-black text-primary">{currentPage}</span>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 hover:bg-background rounded-lg disabled:opacity-20 transition-all"><ChevronRight className="w-4 h-4" /></button>
            <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="p-2 hover:bg-background rounded-lg disabled:opacity-20 transition-all"><ChevronsRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message="Hành động này sẽ xóa vĩnh viễn tài khoản khỏi hệ thống. Bạn có chắc chắn không?"
        confirmText="XÓA VĨNH VIỄN"
        type="danger"
      />
    </div>
  )
}
