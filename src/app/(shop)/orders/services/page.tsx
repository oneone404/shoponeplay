import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { USER_ROUTES } from "@/lib/config/user-routes";
import ServiceOrdersClient from "@/components/shop/orders/ServiceOrdersClient";

export const metadata = {
  title: USER_ROUTES.HISTORY.SERVICES.title,
};

export default async function UserServiceOrdersPage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/signin");
  }

  const [serviceOrders, topupOrders] = await Promise.all([
    prisma.serviceOrder.findMany({
      where: { userId: session.user.id },
      include: {
        service: { select: { name: true, thumbnail: true } },
        option: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.topupOrder.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <ServiceOrdersClient 
        initialServiceOrders={serviceOrders} 
        initialTopupOrders={topupOrders}
      />
    </div>
  );
}
