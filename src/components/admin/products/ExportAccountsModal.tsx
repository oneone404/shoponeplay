"use client"

import { Download, Loader2, X } from "lucide-react"
import { useState } from "react"

interface ExportAccountsModalProps {
  product: {
    id: string
    ids?: string[]
    title: string
    available: number
  }
  onClose: () => void
}

type ExportFormat = "CSV" | "TXT" | "JSON"
type ExportAction = "EXPORT_ONLY" | "EXPORT_AND_DISABLE"

export default function ExportAccountsModal({ product, onClose }: ExportAccountsModalProps) {
  const [quantity, setQuantity] = useState(Math.max(1, Math.min(product.available, 50)))
  const [format, setFormat] = useState<ExportFormat>("CSV")
  const [action, setAction] = useState<ExportAction>("EXPORT_ONLY")
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState("")

  const handleExport = async () => {
    setError("")
    setIsExporting(true)

    try {
      const response = await fetch("/api/admin/accounts/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(product.ids?.length ? { productIds: product.ids } : { productId: product.id }),
          quantity,
          format,
          action,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || "Không thể xuất tài khoản")
      }

      const blob = await response.blob()
      const disposition = response.headers.get("content-disposition")
      const fileName = disposition?.match(/filename="(.+)"/)?.[1] || `account-export.${format.toLowerCase()}`
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xuất tài khoản")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Xuất tài khoản</p>
            <h3 className="mt-1 text-lg font-bold text-foreground">{product.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tài khoản còn trong kho</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{product.available.toLocaleString("vi-VN")} Tài Khoản</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Số lượng xuất</span>
              <input
                type="number"
                min={1}
                max={product.available}
                value={quantity}
                onChange={(event) => setQuantity(Math.max(1, Math.min(Number(event.target.value) || 1, product.available)))}
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm font-bold outline-none focus:border-primary/50"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Định dạng</span>
              <select
                value={format}
                onChange={(event) => setFormat(event.target.value as ExportFormat)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm font-bold outline-none focus:border-primary/50"
              >
                <option value="CSV">CSV</option>
                <option value="TXT">TXT</option>
                <option value="JSON">JSON</option>
              </select>
            </label>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sau khi xuất</span>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setAction("EXPORT_ONLY")}
                className={`rounded-xl border px-4 py-3 text-left text-xs font-bold uppercase transition-colors ${action === "EXPORT_ONLY" ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:bg-secondary"}`}
              >
                Chỉ xuất file
              </button>
              <button
                type="button"
                onClick={() => setAction("EXPORT_AND_DISABLE")}
                className={`rounded-xl border px-4 py-3 text-left text-xs font-bold uppercase transition-colors ${action === "EXPORT_AND_DISABLE" ? "border-amber-500 bg-amber-500/10 text-amber-500" : "border-border bg-background text-muted-foreground hover:bg-secondary"}`}
              >
                Xuất & tháo kho
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-bold text-red-500">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold uppercase text-foreground hover:bg-secondary transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting || product.available <= 0}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold uppercase text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Xuất file
          </button>
        </div>
      </div>
    </div>
  )
}
