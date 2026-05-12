import { Inter, Luckiest_Guy } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import BottomNav from "@/components/layouts/BottomNav";
import ZoomControl from "@/components/utils/ZoomControl";
import Footer from "@/components/layouts/Footer";
import { PageLoader } from "@/components/utils/PageLoader";
import { PremiumLoader } from "@/components/utils/PremiumLoader";
import { Suspense } from "react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const inter = Inter({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700", "800", "900"] });
const luckiestGuy = Luckiest_Guy({ subsets: ["latin"], weight: ["400"], variable: "--font-luckiest-guy" });

import { getSiteConfig } from "@/lib/configUtils";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return {
    title: config.siteTitle,
    description: config.siteDescription,
  };
}

import ChatWidget from "@/components/utils/ChatWidget";
import TopupNotification from "@/components/utils/TopupNotification";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();
  const showLoader = config.MAINTENANCE_MODE === 'true';

  return (
    <html lang="vi" className="light" suppressHydrationWarning>
      <body className={`${inter.className} ${luckiestGuy.variable} antialiased min-h-screen flex flex-col font-sans`}>
        {showLoader ? (
          <div className="fixed inset-0 z-[999999]">
            <PremiumLoader />
          </div>
        ) : (
          <>
            <ZoomControl />
            <AppProviders>
              <div className="flex-1">
                <Suspense fallback={null}>
                  <PageLoader />
                </Suspense>
                {children}
              </div>
              <Footer logoUrl={config.siteFooterLogo} />
              <BottomNav />
              <ChatWidget />
              <TopupNotification />
            </AppProviders>
          </>
        )}
      </body>
    </html>
  );
}
