"use client"

import { useState } from "react"
import { Search, MoreVertical, Shield, User, Wallet, Edit, SearchX, Trash2, History } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useUI } from "@/providers/UIProvider"
import Image from "next/image"
import Link from "next/link"
import EditUserModal from "./EditUserModal"
import ConfirmModal from "@/components/utils/ConfirmModal"

export default function UserTable({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState("")
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, userId: string, userName: string }>({
    isOpen: false,
    userId: "",
    userName: ""
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const { addMessage } = useUI()

  const filteredUsers = users.filter(user =>
    (user.email && user.email.toLowerCase().includes(search.toLowerCase())) ||
    (user.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
    user.id.toLowerCase().includes(search.toLowerCase())
  )

  const handleUpdateUser = (updatedUser: any) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u))
  }

  const handleDeleteUser = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/users/${confirmDelete.userId}`, {
        method: "DELETE"
      })
      if (res.ok) {
        setUsers(users.filter(u => u.id !== confirmDelete.userId))
        addMessage({ type: "success", text: "Đã Xóa Người Dùng Thành Công!" })
      } else {
        const data = await res.json()
        addMessage({ type: "error", text: data.error || "Có Lỗi Xảy Ra" })
      }
    } catch (e) {
      addMessage({ type: "error", text: "Lỗi Kết Nối Máy Chủ" })
    } finally {
      setIsDeleting(false)
      setConfirmDelete({ isOpen: false, userId: "", userName: "" })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ ...confirmDelete, isOpen: false })}
        onConfirm={handleDeleteUser}
        title="Xóa Người Dùng"
        message={`Bạn Có Chắc Chắn Muốn Xóa Người Dùng ${confirmDelete.userName}? Hành Động Này Không Thể Hoàn Tác.`}
        confirmText="Xóa Ngay"
        cancelText="Hủy Bỏ"
        type="danger"
        isLoading={isDeleting}
      />
      {/* Toolbar */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/30">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Tìm Kiếm Email, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-xl w-full outline-none focus:border-primary/50 text-sm font-medium"
          />
        </div>
        <div className="text-[10px] md:text-sm font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap ml-4 shrink-0">
          Tổng: {filteredUsers.length}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-secondary/50 text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4 font-bold">Người dùng</th>
              <th className="px-6 py-4 font-bold">Chức vụ</th>
              <th className="px-6 py-4 font-bold">Số dư</th>
              <th className="px-6 py-4 font-bold">Đã nạp</th>
              <th className="px-6 py-4 font-bold">Địa chỉ IP</th>
              <th className="px-6 py-4 font-bold">Ngày tham gia</th>
              <th className="px-6 py-4 font-bold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <SearchX className="w-12 h-12 mb-2 opacity-20" />
                    <p className="font-bold">Không tìm thấy người dùng nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border">
                        {user.image ? (
                          <Image src={user.image} alt={user.name || "User"} width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{user.name || "Chưa cập nhật tên"}</div>
                        <div className="text-xs text-muted-foreground">{user.email || user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        user.role === 'SELLER' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          'bg-secondary text-muted-foreground border-border'
                      }`}>
                      {user.role === 'ADMIN' && <Shield className="w-3 h-3 mr-1" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-primary">
                      {new Intl.NumberFormat('vi-VN').format(user.balance)} VND
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-muted-foreground">
                      {new Intl.NumberFormat('vi-VN').format(user.totalDeposited)} VND
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-muted-foreground/60 text-xs">
                      {user.lastIP || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs font-medium">
                    {format(new Date(user.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 flex items-center justify-end">
                    <Link
                      href={`/admin/users/${user.id}/activity`}
                      className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors inline-flex items-center justify-center"
                      title="Lịch sử hoạt động"
                    >
                      <History className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete({ isOpen: true, userId: user.id, userName: user.name || user.email })}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors inline-flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  )
}
