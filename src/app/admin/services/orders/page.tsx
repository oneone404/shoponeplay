import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminServiceOrdersClient from "@/components/admin/services/AdminServiceOrdersClient";

export const metadata = {
  title: "Quản lý Đơn hàng Dịch vụ | ShopOnePlay Admin",
};

export default async function AdminServiceOrdersPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const orders = await prisma.serviceOrder.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      },
      service: {
        select: {
          name: true,
        }
      },
      option: {
        select: {
          name: true,
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Serialize the data for the client
  const serializedOrders = orders.map(order => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Đơn Hàng Dịch Vụ" 
        description="Quản lý và xử lý các đơn hàng cày thuê, nạp game từ khách hàng." 
      />
      <AdminServiceOrdersClient initialOrders={serializedOrders} />
    </div>
  );
}
