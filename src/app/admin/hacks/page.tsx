import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ADMIN_ROUTES } from "@/lib/config/admin-routes";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminHacksClient from "@/components/admin/hacks/AdminHacksClient";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = {
  title: ADMIN_ROUTES.HACKS.title,
};

export default async function AdminHacksPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const hacks = await prisma.hackTool.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = hacks.map(h => ({
    ...h,
    createdAt: h.createdAt.toISOString(),
    updatedAt: h.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Quản Lý Hack Tools" 
        subtitle="Danh sách và trạng thái các phần mềm hỗ trợ tự động hóa." 
        rightElement={
          <Link
            href={ADMIN_ROUTES.HACKS_ADD.path}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border text-foreground rounded-xl font-bold text-xs md:text-sm hover:bg-secondary active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Thêm Hack Tool
          </Link>
        }
      />
      <AdminHacksClient initialHacks={serialized} />
    </div>
  );
}
