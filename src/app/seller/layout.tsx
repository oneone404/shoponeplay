import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SellerLayoutShell from "@/components/seller/SellerLayoutShell";

export default async function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // Kiểm tra quyền truy cập tập trung cho toàn bộ kênh người bán
  if (!session || (session.user.role !== "SELLER" && session.user.role !== "ADMIN")) {
    redirect("/");
  }

  return (
    <SellerLayoutShell>
      {children}
    </SellerLayoutShell>
  );
}
