import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminServicesClient from "@/components/admin/services/AdminServicesClient";

export const metadata = {
  title: "Quản lý Dịch vụ Game | ShopOnePlay Admin",
};

export default async function AdminServicesPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const services = await prisma.gameService.findMany({
    include: {
      _count: {
        select: { options: true, orders: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Serialize the data for the client
  const serializedServices = services.map(s => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Dịch Vụ Game" 
        description="Quản lý các dịch vụ trò chơi, cày thuê, nạp thẻ và nhiệm vụ." 
      />
      <AdminServicesClient initialServices={serializedServices} />
    </div>
  );
}
