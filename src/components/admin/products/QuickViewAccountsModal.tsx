"use client"

import { Copy, Eye, Loader2, X } from "lucide-react"
import { useEffect, useState } from "react"

interface QuickViewAccountsModalProps {
  product: {
    id: string
    title: string
  }
  onClose: () => void
}

interface AccountPreview {
  id: string
  accountId: string | null
  username: string
  password: string
  extraInfo: string | null
}

export default function QuickViewAccountsModal({ product, onClose }: QuickViewAccountsModalProps) {
  const [accounts, setAccounts] = useState<AccountPreview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    const loadAccounts = async () => {
      setIsLoading(true)
      setError("")

      try {
        const response = await fetch(`/api/admin/accounts/quick-view?productId=${product.id}&limit=20`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || "Không thể tải danh sách tài khoản")
        }

        if (isMounted) {
          setAccounts(data.secrets || [])
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Không thể tải danh sách tài khoản")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadAccounts()

    return () => {
      isMounted = false
    }
  }, [product.id])

  const copyAll = async () => {
    const content = accounts
      .map((account) => [account.username, account.password, account.accountId || ""].filter(Boolean).join("|"))
      .join("\n")

    await navigator.clipboard.writeText(content)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Xem acc nhanh</p>
            <h3 className="mt-1 text-lg font-bold uppercase text-foreground">{product.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm font-bold text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              ĐANG TẢI TÀI KHOẢN...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-500">
              {error}
            </div>
          ) : accounts.length === 0 ? (
            <div className="rounded-xl border border-border bg-secondary/30 p-8 text-center text-sm font-bold uppercase text-muted-foreground">
              KHÔNG CÓ TÀI KHOẢN KHẢ DỤNG
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Hiển thị nhanh {accounts.length} tài khoản đầu tiên
                </p>
                <button
                  type="button"
                  onClick={copyAll}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-[10px] font-bold uppercase text-foreground hover:bg-secondary transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  Copy tất cả
                </button>
              </div>

              <div className="max-h-[420px] overflow-auto rounded-xl border border-border">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="sticky top-0 bg-secondary text-[10px] uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-bold">Tài khoản</th>
                      <th className="px-4 py-3 font-bold">Mật khẩu</th>
                      <th className="px-4 py-3 font-bold">ID Acc</th>
                      <th className="px-4 py-3 font-bold">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {accounts.map((account) => (
                      <tr key={account.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-foreground">{account.username}</td>
                        <td className="px-4 py-3 font-mono text-xs text-foreground">{account.password}</td>
                        <td className="px-4 py-3 text-muted-foreground">{account.accountId || "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{account.extraInfo || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
