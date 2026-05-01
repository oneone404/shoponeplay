"use client"

import {
  Users,
  ShoppingBag,
  Receipt,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  Store,
  FolderTree,
  PackageCheck,
} from "lucide-react";
import AdminHeader from "../AdminHeader";

interface AdminDashboardViewProps {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalCategories: number;
  todayOrders: number;
  todayRevenue: number;
  monthRevenue: number;
  totalStock: number;
  dayStats: { deposit: number; order: number };
  tableData: {
    label: string;
    deposit: number;
    order: number;
    iconName: string;
  }[];
}

const formatCurrency = (value: number) => `${value.toLocaleString("vi-VN")} VND`;

export default function AdminDashboardView({
  totalUsers,
  totalSellers,
  totalProducts,
  totalCategories,
  todayOrders,
  todayRevenue,
  monthRevenue,
  totalStock,
  tableData
}: AdminDashboardViewProps) {
  const stats = [
    { label: "Tổng người dùng", value: totalUsers.toLocaleString("vi-VN"), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Tổng người bán", value: totalSellers.toLocaleString("vi-VN"), icon: Store, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Tổng sản phẩm", value: totalProducts.toLocaleString("vi-VN"), icon: ShoppingBag, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Tổng danh mục", value: totalCategories.toLocaleString("vi-VN"), icon: FolderTree, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { label: "Đơn hàng hôm nay", value: todayOrders.toLocaleString("vi-VN"), icon: Receipt, color: "text-primary", bg: "bg-primary/10" },
    { label: "Doanh thu hôm nay", value: formatCurrency(todayRevenue), icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Doanh thu tháng này", value: formatCurrency(monthRevenue), icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Tài khoản còn trong kho", value: totalStock.toLocaleString("vi-VN"), icon: PackageCheck, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  const getIcon = (name: string) => {
    switch (name) {
      case "clock": return Clock;
      case "calendar": return Calendar;
      case "trending-up": return TrendingUp;
      default: return TrendingUp;
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader title="Bảng Điều Khiển" subtitle="Tổng quan vận hành, đơn hàng và kho tài khoản" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="relative overflow-hidden p-5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest truncate">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold mt-2 tracking-tight truncate">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shrink-0 group-hover:scale-105 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="text-xs font-bold uppercase tracking-widest flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-primary" />
            Bảng thống kê doanh thu
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Thời gian</th>
                <th className="px-6 py-4 font-bold">Tổng nạp tiền</th>
                <th className="px-6 py-4 font-bold">Tổng mua hàng</th>
                <th className="px-6 py-4 font-bold text-right">Tổng cộng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tableData.map((row, idx) => {
                const Icon = getIcon(row.iconName);
                return (
                  <tr key={idx} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-secondary text-muted-foreground">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold">{row.label}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-500">
                      +{formatCurrency(row.deposit)}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      +{formatCurrency(row.order)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-foreground">
                      {formatCurrency(row.deposit + row.order)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
