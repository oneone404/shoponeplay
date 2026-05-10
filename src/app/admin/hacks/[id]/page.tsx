import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminHeader from "@/components/admin/AdminHeader";
import HackToolForm from "@/components/admin/hacks/HackToolForm";

import { ADMIN_ROUTES } from "@/lib/config/admin-routes";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hack = await prisma.hackTool.findUnique({
    where: { id },
    select: { name: true }
  });
  
  return {
    title: ADMIN_ROUTES.HACKS_EDIT(id, hack?.name || "").title,
  };
}

export default async function AdminHacksEditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;
  const hack = await prisma.hackTool.findUnique({ where: { id } });
  if (!hack) notFound();

  const serialized = {
    ...hack,
    createdAt: hack.createdAt.toISOString(),
    updatedAt: hack.updatedAt.toISOString(),
  };

  return (
    <div className="w-full">
      <HackToolForm 
        mode="edit" 
        initialData={serialized} 
        title={hack.name}
        subtitle="Cập nhật thông tin chi tiết và cấu hình API đối tác."
        backPath={ADMIN_ROUTES.HACKS.path}
      />
    </div>
  );
}
