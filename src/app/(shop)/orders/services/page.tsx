import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceOrdersClient from "@/components/shop/orders/ServiceOrdersClient";

export const metadata = {
  title: "Lịch sử Dịch vụ | ShopOnePlay",
};

export default async function UserServiceOrdersPage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/signin");
  }

  const orders = await prisma.serviceOrder.findMany({
    where: { userId: session.user.id },
    include: {
      service: { select: { name: true, thumbnail: true } },
      option: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-black text-foreground uppercase tracking-tight">Lịch sử <span className="text-primary">Dịch vụ</span></h1>
        <p className="text-muted-foreground text-sm font-medium italic">Theo dõi trạng thái và tiến độ xử lý yêu cầu của bạn.</p>
      </div>

      <ServiceOrdersClient initialOrders={orders} />
    </div>
  );
}
