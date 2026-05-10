import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/config/admin-routes";
import AdminHeader from "@/components/admin/AdminHeader";
import HackToolForm from "@/components/admin/hacks/HackToolForm";

export const metadata = {
  title: ADMIN_ROUTES.HACKS_ADD.title,
};

export default async function AdminHacksAddPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="w-full">
      <HackToolForm 
        mode="create" 
        title="Thêm Hack Tool Mới"
        subtitle="Khởi tạo phần mềm hỗ trợ mới cho hệ thống."
        backPath={ADMIN_ROUTES.HACKS.path}
      />
    </div>
  );
}
