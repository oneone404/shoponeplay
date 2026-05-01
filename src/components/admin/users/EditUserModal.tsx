"use client"

import { useState } from "react"
import { X, Shield, Wallet, Loader2 } from "lucide-react"
import { useUI } from "@/providers/UIProvider"
import { cn } from "@/lib/utils"

export default function EditUserModal({
  user,
  onClose,
  onUpdate
}: {
  user: any
  onClose: () => void
  onUpdate: (user: any) => void
}) {
  const [role, setRole] = useState(user.role)
  const [balanceAdd, setBalanceAdd] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addMessage } = useUI()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          balanceAdd: balanceAdd ? parseFloat(balanceAdd) : 0
        })
      })

      const data = await res.json()

      if (res.ok) {
        addMessage({ type: "success", text: "Cập nhật người dùng thành công!" })
        onUpdate(data.user)
        onClose()
      } else {
        addMessage({ type: "error", text: data.error || "Có lỗi xảy ra" })
      }
    } catch (error) {
      addMessage({ type: "error", text: "Lỗi kết nối máy chủ" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card border border-border rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tighter">Chỉnh sửa User</h2>
          <button
            onClick={onClose}
            className="p-2 bg-secondary text-muted-foreground hover:text-foreground rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6 p-4 bg-secondary rounded-2xl border border-border">
            <div className="text-sm font-bold">{user.name || "User"}</div>
            <div className="text-xs text-muted-foreground">{user.email || user.id}</div>
            <div className="mt-2 text-xs font-bold text-primary">Số Dư Hiện Tại: {new Intl.NumberFormat('vi-VN').format(user.balance)} VND</div>
          </div>

          <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center">
                <Shield className="w-3 h-3 mr-1" /> Phân quyền
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['USER', 'SELLER', 'ADMIN'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      "py-2 rounded-xl text-xs font-bold transition-all border",
                      role === r
                        ? "bg-primary text-white border-primary"
                        : "bg-secondary text-muted-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center">
                <Wallet className="w-3 h-3 mr-1" /> Cộng/Trừ tiền (VND)
              </label>
              <input
                type="number"
                placeholder="Ví Dụ: 10000"
                value={balanceAdd}
                onChange={(e) => setBalanceAdd(e.target.value)}
                className="w-full p-4 bg-secondary border border-border rounded-xl text-sm font-bold outline-none focus:border-primary transition-all"
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border bg-secondary/30">
          <button
            type="submit"
            form="edit-user-form"
            disabled={isSubmitting}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center disabled:opacity-50 transition-all"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  )
}
