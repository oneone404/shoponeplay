import { prisma } from "@/lib/prisma";
import { USER_ROUTES } from "@/lib/config/user-routes";
import Navbar from "@/components/layouts/Navbar";
import { getSiteConfig } from "@/lib/configUtils";
import HacksList from "@/components/hacks/HacksList";

export const metadata = {
  title: USER_ROUTES.HACKS.title,
};

export const dynamic = "force-dynamic";

export default async function HacksPage() {
  const config = await getSiteConfig();

  const hacks = await prisma.hackTool.findMany({
    where: { status: { not: "HIDDEN" } },
    orderBy: { createdAt: "desc" },
  });

  const serialized = hacks.map(h => ({
    ...h,
    createdAt: h.createdAt.toISOString(),
    updatedAt: h.updatedAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar logoUrl={config.siteLogo} />
      <HacksList hacks={serialized} />
    </main>
  );
}
