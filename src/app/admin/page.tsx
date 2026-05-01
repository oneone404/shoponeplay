import { prisma } from "@/lib/prisma";
import { startOfDay, startOfWeek, startOfMonth } from "date-fns";
import { Clock, Calendar, TrendingUp } from "lucide-react";
import AdminDashboardView from "@/components/admin/dashboard/AdminDashboardView";
import { ADMIN_ROUTES } from "@/lib/config/admin-routes";

export const metadata = {
  title: ADMIN_ROUTES.DASHBOARD.title
};

export default async function AdminDashboard() {
  const now = new Date();
  const today = startOfDay(now);
  const week = startOfWeek(now, { weekStartsOn: 1 });
  const month = startOfMonth(now);

  // Fetch KPI stats
  const [
    totalUsers,
    totalSellers,
    totalProducts,
    totalCategories,
    todayOrders,
    totalStock,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "SELLER" } }),
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count({
      where: {
        createdAt: { gte: today },
        status: "COMPLETED"
      }
    }),
    prisma.accountSecret.count({ where: { isSold: false } }),
  ]);

  // Stats Table Calculation
  const fetchRevenue = async (startDate: Date) => {
    const [deposits, orders] = await Promise.all([
      prisma.deposit.aggregate({
        where: { createdAt: { gte: startDate }, status: "COMPLETED" },
        _sum: { amount: true }
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startDate }, status: "COMPLETED" },
        _sum: { totalAmount: true }
      })
    ]);
    return {
      deposit: deposits._sum.amount || 0,
      order: orders._sum.totalAmount || 0
    };
  };

  const dayStats = await fetchRevenue(today);
  const weekStats = await fetchRevenue(week);
  const monthStats = await fetchRevenue(month);

  const tableData = [
    { label: "Hôm Nay", deposit: dayStats.deposit, order: dayStats.order, iconName: "clock" },
    { label: "Tuần Này", deposit: weekStats.deposit, order: weekStats.order, iconName: "calendar" },
    { label: "Tháng Này", deposit: monthStats.deposit, order: monthStats.order, iconName: "trending-up" },
  ];

  return (
    <AdminDashboardView
      totalUsers={totalUsers}
      totalSellers={totalSellers}
      totalProducts={totalProducts}
      totalCategories={totalCategories}
      todayOrders={todayOrders}
      todayRevenue={dayStats.order}
      monthRevenue={monthStats.order}
      totalStock={totalStock}
      dayStats={dayStats}
      tableData={tableData}
    />
  );
}
