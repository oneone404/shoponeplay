import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ServiceDetailClient from "@/components/shop/services/ServiceDetailClient";
import { auth } from "@/auth";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.gameService.findUnique({
    where: { slug }
  });

  return {
    title: service ? `${service.name} | ShopOnePlay` : "Dịch vụ không tồn tại",
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();

  const service = await prisma.gameService.findUnique({
    where: { slug, status: 'ACTIVE' },
    include: {
      options: {
        where: { status: 'ACTIVE' },
        orderBy: { price: 'asc' }
      }
    }
  });

  if (!service) {
    notFound();
  }

  // Get user balance if logged in
  let userBalance = 0;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true }
    });
    userBalance = user?.balance || 0;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <ServiceDetailClient 
        service={service} 
        isLoggedIn={!!session} 
        userBalance={userBalance}
      />
    </div>
  );
}
