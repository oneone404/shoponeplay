"use client"

import { useState } from "react"
import { PackageCheck, Search, Plus, Edit, Trash2, Tag, Layers } from "lucide-react"
import Image from "next/image"
import { useUI } from "@/providers/UIProvider"
import ConfirmModal from "@/components/utils/ConfirmModal"
import { cn } from "@/lib/utils"
import OptionFormModal from "./OptionFormModal"

interface ServiceOption {
  id: string
  name: string
  price: number
  thumbnail: string | null
  description: string | null
  status: string
}

interface GameService {
  id: string
  name: string
  options: ServiceOption[]
}

interface ServiceOptionsClientProps {
  service: GameService
}

export default function ServiceOptionsClient({ service }: ServiceOptionsClientProps) {
  const [options, setOptions] = useState<ServiceOption[]>(service.options)
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOption, setEditingOption] = useState<ServiceOption | null>(null)
  
  const [deletingOption, setDeletingOption] = useState<ServiceOption | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { addMessage } = useUI()

  const filteredOptions = options.filter((option) => {
    const keyword = search.trim().toLowerCase()
    return !keyword || option.name.toLowerCase().includes(keyword)
  })

  const handleDelete = async () => {
    if (!deletingOption) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/services/options/${deletingOption.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Xóa thất bại')
      addMessage({ type: "success", text: "Đã xóa gói dịch vụ thành công" })
      setOptions(prev => prev.filter(o => o.id !== deletingOption.id))
    } catch (err) {
      addMessage({ type: "error", text: "Có lỗi xảy ra khi xóa. Vui lòng thử lại." })
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      setDeletingOption(null)
    }
  }

  const handleOpenEdit = (option: ServiceOption) => {
    setEditingOption(option)
    setIsModalOpen(true)
  }

  const handleOpenAdd = () => {
    setEditingOption(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SummaryCard label="Tổng Số Gói" value={options.length.toString()} icon={<Layers className="w-5 h-5" />} color="text-primary" />
        <SummaryCard label="Gói Đang Bán" value={options.filter(o => o.status === 'ACTIVE').length.toString()} icon={<PackageCheck className="w-5 h-5" />} color="text-green-500" />
      </div>

      <div className="flex flex-col bg-card border border-border rounded-2xl shadow-sm">
        <div className="p-4 border-b border-border bg-secondary/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm tên gói..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl w-full outline-none focus:border-primary/50 text-[11px] font-bold transition-colors uppercase tracking-widest"
            />
          </div>
          <button 
            onClick={handleOpenAdd}
            className="w-full md:w-auto px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Thêm Gói Mới
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Tên Gói</th>
                <th className="px-6 py-4 font-bold text-left">Giá Tiền</th>
                <th className="px-6 py-4 font-bold text-center">Trạng Thái</th>
                <th className="px-6 py-4 font-bold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOptions.length > 0 ? filteredOptions.map((option) => (
                <tr key={option.id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {option.thumbnail && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border bg-secondary shrink-0 group/img">
                          <Image src={option.thumbnail} alt={option.name} fill className="object-cover group-hover/img:scale-110 transition-transform duration-300" unoptimized />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate max-w-[250px] text-xs">{option.name}</p>
                        {option.description && (
                          <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[200px]">{option.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-primary">
                      {option.price.toLocaleString("vi-VN")} VND
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                      option.status === 'ACTIVE' ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                      option.status === 'MAINTENANCE' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                      "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                    )}>
                      {option.status === 'ACTIVE' ? 'Hoạt động' : option.status === 'MAINTENANCE' ? 'Bảo trì' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenEdit(option)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="Chỉnh sửa thông tin">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setDeletingOption(option); setIsDeleteModalOpen(true); }} className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all" title="Xóa gói">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-secondary">
                        <Tag className="w-8 h-8 text-muted-foreground opacity-20" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Chưa có gói dịch vụ nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Xác nhận xóa gói"
        message="Gói dịch vụ này sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác."
        confirmText="Xóa vĩnh viễn"
        type="danger"
      />

      {isModalOpen && (
        <OptionFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          serviceId={service.id}
          option={editingOption} 
          onSuccess={(savedOption, isNew) => {
            if (isNew) {
              setOptions(prev => [...prev, savedOption].sort((a,b) => a.price - b.price))
            } else {
              setOptions(prev => prev.map(o => o.id === savedOption.id ? savedOption : o).sort((a,b) => a.price - b.price))
            }
            setIsModalOpen(false)
          }} 
        />
      )}
    </div>
  )
}

function SummaryCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-bold mt-2 text-foreground tabular-nums tracking-tight">{value}</p>
        </div>
        <div className={cn("w-11 h-11 rounded-xl bg-secondary flex items-center justify-center transition-transform group-hover:scale-110", color)}>{icon}</div>
      </div>
    </div>
  )
}
