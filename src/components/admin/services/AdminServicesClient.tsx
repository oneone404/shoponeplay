"use client"

import { useState } from "react"
import { PackageCheck, Search, Plus, Edit, Trash2, ShieldCheck, Gamepad2, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useUI } from "@/providers/UIProvider"
import ConfirmModal from "@/components/utils/ConfirmModal"
import { cn } from "@/lib/utils"
import ServiceFormModal from "./ServiceFormModal"

interface GameService {
  id: string
  name: string
  slug: string
  thumbnail: string
  description: string | null
  type: string
  status: string
  fields: any
  _count: {
    options: number
    orders: number
  }
}

interface AdminServicesClientProps {
  initialServices: GameService[]
}

export default function AdminServicesClient({ initialServices }: AdminServicesClientProps) {
  const [services, setServices] = useState<GameService[]>(initialServices)
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<GameService | null>(null)

  const [deletingService, setDeletingService] = useState<GameService | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { addMessage } = useUI()

  const filteredServices = services.filter((service) => {
    const keyword = search.trim().toLowerCase()
    return !keyword ||
      service.name.toLowerCase().includes(keyword) ||
      service.slug.toLowerCase().includes(keyword)
  })

  const handleDelete = async () => {
    if (!deletingService) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/services/${deletingService.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Xóa thất bại')
      addMessage({ type: "success", text: "Đã xóa dịch vụ thành công" })
      setServices(prev => prev.filter(s => s.id !== deletingService.id))
    } catch (err) {
      addMessage({ type: "error", text: "Có lỗi xảy ra khi xóa. Vui lòng thử lại." })
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      setDeletingService(null)
    }
  }

  const handleOpenEdit = (service: GameService) => {
    setEditingService(service)
    setIsModalOpen(true)
  }

  const handleOpenAdd = () => {
    setEditingService(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SummaryCard label="Tổng Dịch Vụ" value={services.length.toString()} icon={<PackageCheck className="w-5 h-5" />} color="text-primary" />
        <SummaryCard label="Đang Hoạt Động" value={services.filter(s => s.status === 'ACTIVE').length.toString()} icon={<ShieldCheck className="w-5 h-5" />} color="text-green-500" />
        <SummaryCard label="Tổng Đơn Hàng" value={services.reduce((acc, s) => acc + s._count.orders, 0).toString()} icon={<Gamepad2 className="w-5 h-5" />} color="text-amber-500" />
      </div>

      <div className="flex flex-col bg-card border border-border rounded-2xl shadow-sm">
        <div className="p-4 border-b border-border bg-secondary/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm tên dịch vụ, slug..."
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
            Thêm Dịch Vụ Mới
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Dịch Vụ</th>
                <th className="px-6 py-4 font-bold">Phân Loại</th>
                <th className="px-6 py-4 font-bold text-center">Các Gói</th>
                <th className="px-6 py-4 font-bold text-center">Đơn Hàng</th>
                <th className="px-6 py-4 font-bold text-center">Trạng Thái</th>
                <th className="px-6 py-4 font-bold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredServices.length > 0 ? filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border bg-secondary shrink-0 group/img">
                        <Image src={service.thumbnail || "/images/placeholder.jpg"} alt={service.name} fill className="object-cover group-hover/img:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate max-w-[200px] text-xs">{service.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[150px]">/{service.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-secondary px-2.5 py-1 rounded-lg text-[10px] font-bold text-muted-foreground border border-border uppercase tracking-widest">
                      {service.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-primary">
                    {service._count.options}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-foreground">
                    {service._count.orders}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                      service.status === 'ACTIVE' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                        service.status === 'MAINTENANCE' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                          "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                    )}>
                      {service.status === 'ACTIVE' ? 'Hoạt động' : service.status === 'MAINTENANCE' ? 'Bảo trì' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/services/${service.id}`} className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all" title="Quản lý Gói & Tùy chọn">
                        <Settings className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleOpenEdit(service)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="Chỉnh sửa thông tin">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setDeletingService(service); setIsDeleteModalOpen(true); }} className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all" title="Xóa dịch vụ">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-secondary">
                        <Search className="w-8 h-8 text-muted-foreground opacity-20" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Không tìm thấy dịch vụ nào</p>
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
        title="Xác nhận xóa dịch vụ"
        message="Hành động này sẽ xóa vĩnh viễn dịch vụ và CÁC GÓI TÙY CHỌN bên trong. Các đơn hàng cũ vẫn được giữ lại nhưng không thể liên kết. Cân nhắc chuyển trạng thái sang 'Bảo trì' thay vì xóa."
        confirmText="Xóa vĩnh viễn"
        type="danger"
      />

      {isModalOpen && (
        <ServiceFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service={editingService}
          onSuccess={(savedService, isNew) => {
            if (isNew) {
              setServices(prev => [savedService, ...prev])
            } else {
              setServices(prev => prev.map(s => s.id === savedService.id ? savedService : s))
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
