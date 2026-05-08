import { prisma } from "@/lib/prisma";
import ServiceListClient from "@/components/shop/services/ServiceListClient";

export const metadata = {
  title: "Dịch Vụ Game | ShopOnePlay",
  description: "Cung cấp các dịch vụ cày thuê, nạp game, làm nhiệm vụ uy tín, giá rẻ.",
};

export default async function ServicesPage() {
  const services = await prisma.gameService.findMany({
    where: { status: 'ACTIVE' },
    include: {
      _count: {
        select: { options: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight uppercase">
          Dịch Vụ <span className="text-primary">Game</span>
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Chọn dịch vụ bạn cần, chúng tôi sẽ xử lý nhanh nhất có thể.
        </p>
      </div>

      <ServiceListClient initialServices={services} />
    </div>
  );
}
