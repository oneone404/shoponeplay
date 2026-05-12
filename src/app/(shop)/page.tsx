import Navbar from "@/components/layouts/Navbar"
import { prisma } from "@/lib/prisma"

import HomeClient from "@/components/home/HomeClient"
import { HomeHighlights } from "@/components/home/sections/HomeHighlights"
import { CategorySection } from "@/components/home/sections/CategorySection"
import { ServiceSection } from "@/components/home/sections/ServiceSection"
import { NewsSection } from "@/components/home/sections/NewsSection"

import { USER_ROUTES } from "@/lib/config/user-routes"
import { getSiteConfig } from "@/lib/configUtils"

export const metadata = {
  title: USER_ROUTES.HOME.title,
}

export const dynamic = "force-dynamic"

export default async function Home() {
  const config = await getSiteConfig();
  
  // Fetch Groups to get their actual names from DB
  const playGroup = await prisma.categoryGroup.findUnique({
    where: { slug: "tai-khoan-play" },
    include: { 
      categories: {
        include: { _count: { select: { products: { where: { sold: false, isHidden: false } } } } }
      }
    }
  })

  const randomGroupRaw = await prisma.categoryGroup.findUnique({
    where: { slug: "tai-khoan-random" },
    include: { 
      categories: {
        include: { 
          products: {
            where: { isHidden: false },
            select: { stock: true }
          }
        }
      }
    }
  })

  // Format random categories to have a virtual _count reflecting total stock
  const randomGroup = randomGroupRaw ? {
    ...randomGroupRaw,
    categories: randomGroupRaw.categories.map(cat => ({
      ...cat,
      _count: {
        products: cat.products.reduce((acc, p) => acc + (p.stock || 0), 0)
      }
    }))
  } : null

  const latestPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const gameServices = await prisma.gameService.findMany({
    where: { status: 'ACTIVE' },
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  // --- FETCH REAL TRANSACTIONS FOR TICKER ---
  const [latestBank, latestCard, latestOrders] = await Promise.all([
    prisma.bankDeposit.findMany({
      where: { status: 'COMPLETED' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } }
    }),
    prisma.cardDeposit.findMany({
      where: { status: 'COMPLETED' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } }
    }),
    prisma.order.findMany({
      where: { status: 'COMPLETED' },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { 
        user: { select: { name: true } },
        items: { select: { titleSnapshot: true } }
      }
    })
  ]);

  const realNotifications: string[] = [
    ...latestBank.map(d => {
      const name = d.user.name || "Khách"
      const masked = name.slice(0, 2) + "***" + name.slice(-1)
      return `User ${masked} vừa nạp ${d.amount.toLocaleString()} VND qua Bank thành công`
    }),
    ...latestCard.map(d => {
      const name = d.user.name || "Khách"
      const masked = name.slice(0, 2) + "***" + name.slice(-1)
      return `User ${masked} vừa nạp ${d.amount?.toLocaleString() || d.declaredValue.toLocaleString()} VND từ thẻ ${d.cardType}`
    }),
    ...latestOrders.map(o => {
      const name = o.user.name || "Khách"
      const masked = name.slice(0, 2) + "***" + name.slice(-1)
      const productName = o.items[0]?.titleSnapshot || "Sản phẩm"
      return `Chúc mừng user ${masked} vừa mua ${productName}`
    })
  ].sort(() => Math.random() - 0.5); // Shuffle a bit for variety

  // Fallback if no real transactions yet
  const notifications = realNotifications.length > 0 ? realNotifications : [
    "Chào mừng bạn đến với ShopOnePlay - Hệ thống bán acc uy tín số 1 VN",
    "Nạp tiền qua ATM/Momo nhận ngay 100% giá trị nạp",
    "Hệ thống nạp thẻ tự động cực nhanh, chiết khấu cực thấp",
    "Giao dịch tự động 24/7 - Bảo mật thông tin tuyệt đối"
  ];

  // Serialize data to plain objects for Client Components (important for Dates)
  const safePlayCategories = playGroup ? JSON.parse(JSON.stringify(playGroup.categories)) : []
  const safeRandomCategories = randomGroup ? JSON.parse(JSON.stringify(randomGroup.categories)) : []

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar logoUrl={config.siteLogo} />

      <HomeClient 
        notifications={notifications} 
        bannerUrl={config.siteBanner}
        heroTitle={config.heroTitle}
        heroSub={config.heroSub}
        heroTopText={config.heroTopText}
        heroBottomText={config.heroBottomText}
      />

      <HomeHighlights 
        title={config.bannerTitle}
        description={config.bannerDesc}
        introLinks={config.introLinks}
      />

      <div className="px-4 max-w-7xl mx-auto space-y-12 mt-12">
        {/* SECTION: TÀI KHOẢN PLAY */}
        {playGroup && (
          <CategorySection
            title={playGroup.name}
            tKeys={{
              title: playGroup.slug,
              highlight: "", // Empty to trigger automatic split
              subtitle: "play_accounts"
            }}
            categories={safePlayCategories}
            variant="neutral"
          />
        )}

        {/* SECTION: TÀI KHOẢN RANDOM */}
        {randomGroup && (
          <CategorySection
            title={randomGroup.name}
            tKeys={{
              title: randomGroup.slug,
              highlight: "", // Empty to trigger automatic split
              subtitle: "play_accounts"
            }}
            categories={safeRandomCategories}
            variant="neutral"
          />
        )}

        {/* SECTION: DỊCH VỤ GAME */}
        <ServiceSection services={JSON.parse(JSON.stringify(gameServices))} />

        {/* SECTION: LATEST NEWS / ARTICLES */}
        <NewsSection posts={JSON.parse(JSON.stringify(latestPosts))} />
      </div>
    </main>
  )
}