import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminHeader from "@/components/admin/AdminHeader";
import ServiceOptionsClient from "@/components/admin/services/ServiceOptionsClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
        rightElement={
          <Link 
            href="/admin/services" 
            className="flex items-center gap-1.5 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-[10px] font-bold uppercase tracking-widest rounded-xl border border-border transition-all active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay Lại</span>
          </Link>
        }
      />
      <ServiceOptionsClient service={serializedService} />
    </div>
  );
}
