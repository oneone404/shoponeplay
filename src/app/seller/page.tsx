import { SELLER_ROUTES } from "@/lib/config/seller-routes";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { startOfDay, startOfWeek, startOfMonth } from "date-fns";
import SellerDashboardView from "@/components/seller/dashboard/SellerDashboardView";

export const metadata = {
  title: SELLER_ROUTES.DASHBOARD.title,
};

export default async function SellerDashboard() {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "SELLER" && session.user.role !== "ADMIN")) {
    redirect("/");
  }

  const sellerId = session.user.id;
  const now = new Date();
  const today = startOfDay(now);
  const week = startOfWeek(now, { weekStartsOn: 1 });
  const month = startOfMonth(now);

  const user = await prisma.user.findUnique({
    where: { id: sellerId },
    select: { balance: true }
  });
  const balance = user?.balance || 0;

  // Fetch Seller's Products & Orders Stats
  const [
    totalProducts,
    totalAccounts,
    soldAccounts,
    totalOrders,
    withdrawnStats,
    withdrawals,
  ] = await Promise.all([
    prisma.product.count({ where: { uploaderId: sellerId } }),
    prisma.accountSecret.count({ where: { uploaderId: sellerId } }),
    prisma.accountSecret.count({ where: { uploaderId: sellerId, isSold: true } }),
    prisma.order.count({
      where: {
        status: "COMPLETED",
        items: {
          some: { product: { uploaderId: sellerId } }
        }
      }
    }),
    prisma.withdrawal.aggregate({
      where: { userId: sellerId, status: "COMPLETED" },
      _sum: { amount: true }
    }),
    prisma.withdrawal.findMany({
      where: { userId: sellerId },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  const totalWithdrawn = withdrawnStats._sum.amount || 0;
  const recentWithdrawals = withdrawals;

  const availableProducts = totalAccounts - soldAccounts;

  // Calculate Revenue (only from items sold by this seller)
  const calculateRevenue = async (startDate: Date | null) => {
    const dateFilter = startDate ? { gte: startDate } : undefined;
    
    const items = await prisma.orderItem.findMany({
      where: {
        order: {
          status: "COMPLETED",
          ...(dateFilter && { createdAt: dateFilter })
        },
        product: { uploaderId: sellerId }
      },
      select: { priceAtPurchase: true, quantity: true }
    });

    return items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);
  };

  const [totalRevenue, todayRevenue, weekRevenue, monthRevenue] = await Promise.all([
    calculateRevenue(null),
    calculateRevenue(today),
    calculateRevenue(week),
    calculateRevenue(month),
  ]);

  const tableData = [
    { label: "Hôm Nay", order: todayRevenue, iconName: "clock" },
    { label: "Tuần Này", order: weekRevenue, iconName: "calendar" },
    { label: "Tháng Này", order: monthRevenue, iconName: "trending-up" },
  ];

  return (
    <SellerDashboardView
      totalProducts={totalProducts}
      availableProducts={availableProducts}
      soldProducts={soldAccounts}
      totalOrders={totalOrders}
      totalRevenue={totalRevenue}
      todayRevenue={todayRevenue}
      monthRevenue={monthRevenue}
      balance={balance}
      totalWithdrawn={totalWithdrawn}
      recentWithdrawals={recentWithdrawals as any}
      tableData={tableData}
    />
  );
}
