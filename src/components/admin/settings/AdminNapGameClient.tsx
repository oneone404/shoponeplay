"use client"

import { useState } from "react"
import { Save, Plus, Trash2, GripVertical, Loader2, Star, AlertCircle, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUI } from "@/providers/UIProvider"
import { updateNapGameConfig } from "@/app/admin/settings/napgame/actions"
import AdminHeader from "../AdminHeader"

interface HotItem {
  name: string
  order: number
}

interface AdminNapGameClientProps {
  initialHotConfig: HotItem[]
  initialMarkup: number
  initialRounding: boolean
}

export default function AdminNapGameClient({ initialHotConfig, initialMarkup, initialRounding }: AdminNapGameClientProps) {
  const { addMessage } = useUI()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<HotItem[]>(initialHotConfig.sort((a, b) => a.order - b.order))
  const [markup, setMarkup] = useState<number>(initialMarkup)
  const [rounding, setRounding] = useState<boolean>(initialRounding)

  const addItem = () => {
    setItems([...items, { name: "", order: items.length + 1 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, name: string) => {
    const newItems = [...items]
    newItems[index].name = name
    setItems(newItems)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Re-assign orders based on current index
      const itemsToSave = items
        .filter(item => item.name.trim() !== "")
        .map((item, index) => ({ ...item, order: index + 1 }))
        
      const result = await updateNapGameConfig(itemsToSave, markup, rounding)

      if (result.success) {
        addMessage({ type: "success", text: "Cấu hình đã được lưu thành công!" })
      } else {
        addMessage({ type: "error", text: "Lỗi: " + result.error })
      }
    } catch (error) {
      addMessage({ type: "error", text: "Lỗi kết nối máy chủ" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">
      <AdminHeader
        title="Cấu Hình Nạp Gói"
        subtitle="Quản lý danh sách các gói nạp HOT hiển thị ở đầu trang napgame"
      />

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Star className="w-4 h-4 fill-primary" />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Cấu Hình Nạp Gói</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={addItem}
              className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center space-x-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm gói HOT</span>
            </button>
            <button
              disabled={loading}
              onClick={handleSave}
              className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Lưu cấu hình</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Price Markup Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-border/50">
              <Zap className="w-4 h-4 text-primary" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cấu Hình Giá</h4>
            </div>
            <div className="max-w-xs space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Phần trăm tăng giá (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={markup}
                  onChange={(e) => setMarkup(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-xs font-bold focus:border-primary outline-none transition-all"
                  placeholder="Ví dụ: 10"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</div>
              </div>
              <p className="text-[9px] text-muted-foreground leading-relaxed">
                Giá hiển thị = Giá gốc VNG + (Giá gốc * %)
              </p>
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Làm tròn tiền</label>
                  <p className="text-[9px] text-muted-foreground">Tự động làm tròn lên các mốc 5k, 10k</p>
                </div>
                <button
                  onClick={() => setRounding(!rounding)}
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-all duration-300",
                    rounding ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                    rounding ? "left-6" : "left-1"
                  )} />
                </button>
              </div>

              {rounding && (
                <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg space-y-1 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Quy tắc làm tròn:</p>
                  <ul className="text-[9px] text-primary/80 space-y-1 font-medium list-disc pl-3">
                    <li>Dưới 50k: Làm tròn lên mốc 5k gần nhất (24k → 25k)</li>
                    <li>Trên 50k: Làm tròn lên mốc 10k gần nhất (72k → 80k)</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Hot Items Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-border/50">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Danh Sách Gói HOT</h4>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-xl opacity-50">
                <Star className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs font-bold uppercase tracking-widest">Chưa có gói HOT nào được cấu hình</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-secondary/30 border border-border rounded-xl group">
                    <div className="w-8 h-8 flex items-center justify-center bg-background rounded-lg border border-border text-[10px] font-bold text-muted-foreground shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(index, e.target.value)}
                        placeholder="Nhập tên chính xác của gói nạp (ví dụ: Thành viên Plus)"
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-xs font-bold focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="w-8 h-8 flex items-center justify-center bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Lưu ý quan trọng</p>
                <p className="text-[10px] text-amber-600/80 leading-relaxed font-medium">
                  Tên gói nạp phải khớp chính xác với tên được trả về từ VNG API. 
                  Hệ thống sẽ lọc danh sách sản phẩm theo các tên này để hiển thị trong mục HOT ở đầu trang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
