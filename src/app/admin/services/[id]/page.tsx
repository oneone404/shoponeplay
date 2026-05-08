import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminHeader from "@/components/admin/AdminHeader";
import ServiceOptionsClient from "@/components/admin/services/ServiceOptionsClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: "Quản lý Gói Dịch Vụ | ShopOnePlay Admin" };
}

export default async function AdminServiceOptionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const service = await prisma.gameService.findUnique({
    where: { id },
    include: {
      options: {
        orderBy: { price: 'asc' }
      }
    }
  });

  if (!service) {
    redirect("/admin/services");
  }

  // Serialize the data for the client
  const serializedService = {
    ...service,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
    options: service.options.map(opt => ({
      ...opt,
    }))
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title={`Cấu hình: ${service.name}`} 
        description="Quản lý các gói (Options) và mức giá cho dịch vụ này." 
        backUrl="/admin/services"
      />
      <ServiceOptionsClient service={serializedService} />
    </div>
  );
}
