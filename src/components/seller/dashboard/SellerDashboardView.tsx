"use client"

import {
  ShoppingBag,
  Receipt,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  PackageCheck,
  Tag,
} from "lucide-react";
import AdminHeader from "../../admin/AdminHeader";

interface SellerDashboardViewProps {
  totalProducts: number;
  availableProducts: number;
  soldProducts: number;
  totalOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  monthRevenue: number;
  balance: number;
  totalWithdrawn: number;
  recentWithdrawals: {
    id: string;
    amount: number;
    status: string;
    createdAt: Date;
    bankName: string;
  }[];
  tableData: {
    label: string;
    order: number;
    iconName: string;
  }[];
}

const formatCurrency = (value: number) => `${value.toLocaleString("vi-VN")} VND`;

export default function SellerDashboardView({
  totalProducts,
  availableProducts,
  soldProducts,
  totalOrders,
  totalRevenue,
  todayRevenue,
  monthRevenue,
  balance,
  totalWithdrawn,
  recentWithdrawals,
  tableData
}: SellerDashboardViewProps) {
  const stats = [
    { label: "Tổng sản phẩm", value: totalProducts.toLocaleString("vi-VN"), icon: ShoppingBag, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Đang bán", value: availableProducts.toLocaleString("vi-VN"), icon: PackageCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Đã bán", value: soldProducts.toLocaleString("vi-VN"), icon: Tag, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Tổng đơn hàng", value: totalOrders.toLocaleString("vi-VN"), icon: Receipt, color: "text-primary", bg: "bg-primary/10" },
    { label: "Doanh thu hôm nay", value: formatCurrency(todayRevenue), icon: Clock, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Doanh thu tháng này", value: formatCurrency(monthRevenue), icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Tổng doanh thu", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Số dư hiện tại", value: formatCurrency(balance), icon: DollarSign, color: "text-primary", bg: "bg-primary/20" },
    { label: "Đã rút tiền", value: formatCurrency(totalWithdrawn), icon: PackageCheck, color: "text-amber-600", bg: "bg-amber-600/10" },
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
      <AdminHeader title="Bảng Điều Khiển" subtitle="Tổng quan kinh doanh và doanh thu của bạn" />

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
                <th className="px-6 py-4 font-bold text-right">Doanh thu đạt được</th>
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
                    <td className="px-6 py-4 text-right font-bold text-primary">
                      +{formatCurrency(row.order)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Withdrawals Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-primary" />
            Lịch sử ví gần đây
          </h3>
          <a href="/seller/withdraw" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">
            Xem tất cả
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Ngày tạo</th>
                <th className="px-6 py-4 font-bold">Ngân hàng</th>
                <th className="px-6 py-4 font-bold text-right">Số tiền</th>
                <th className="px-6 py-4 font-bold text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        CHƯA CÓ YÊU CẦU RÚT TIỀN NÀO
                      </p>
                      <a 
                        href="/seller/withdraw" 
                        className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary/20 transition-colors"
                      >
                        <DollarSign className="w-3 h-3 mr-2" />
                        Rút tiền ngay
                      </a>
                    </div>
                  </td>
                </tr>
              ) : (
                recentWithdrawals.map((withdraw) => (
                  <tr key={withdraw.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4 text-xs">
                      {new Date(withdraw.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 font-bold text-xs">
                      {withdraw.bankName}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-primary">
                      {formatCurrency(withdraw.amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        withdraw.status === "COMPLETED" ? "bg-green-500/10 text-green-500" :
                        withdraw.status === "PENDING" ? "bg-amber-500/10 text-amber-500" :
                        "bg-rose-500/10 text-rose-500"
                      }`}>
                        {withdraw.status === "COMPLETED" ? "HOÀN TẤT" : 
                         withdraw.status === "PENDING" ? "ĐANG CHỜ" : "ĐÃ HỦY"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
