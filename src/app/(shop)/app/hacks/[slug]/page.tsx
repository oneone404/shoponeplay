import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/layouts/Navbar";
import { getSiteConfig } from "@/lib/configUtils";
import { USER_ROUTES } from "@/lib/config/user-routes";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import HackDetailClient from "@/components/hacks/HackDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const hack = await prisma.hackTool.findUnique({
    where: { slug },
    select: { name: true }
  });

  if (!hack) return { title: "Không tìm thấy nội dung" };

  return {
    title: USER_ROUTES.HACK_DETAIL(slug, hack.name).title,
  };
}

export default async function HackDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const config = await getSiteConfig();

  const hack = await prisma.hackTool.findUnique({
    where: { slug, status: { not: "HIDDEN" } },
  });

  if (!hack) notFound();

  const serialized = {
    ...hack,
    createdAt: hack.createdAt.toISOString(),
    updatedAt: hack.updatedAt.toISOString(),
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar logoUrl={config.siteLogo} />
      
      <div className="px-4 max-w-7xl mx-auto pt-24">
        {/* Back Button */}
        <Link 
          href={USER_ROUTES.HACKS.path}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Link>

        {/* Detail Client Handler */}
        <HackDetailClient hack={serialized} />
      </div>
    </main>
  );
}
