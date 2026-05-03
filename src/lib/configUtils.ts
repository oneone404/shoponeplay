import { prisma } from "@/lib/prisma";

export interface SiteConfig {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  facebookUrl: string;
  zaloUrl: string;
  siteLogo: string;
  siteFavicon: string;
  siteBanner: string;
  siteFooterLogo: string;
  bannerTitle: string;
  bannerDesc: string;
  heroTitle: string;
  heroSub: string;
  heroTopText: string;
  heroBottomText: string;
  introLinks: string; // JSON string of [{ label, url, icon }]
  menuLabels: string; // JSON string of { key: label }
  TELEGRAM_TOKEN: string;
  TELEGRAM_ID: string;
  TELEGRAM_ENABLED: string;
  SELLER_FEE: string; // Phí sàn (%)
}

const defaultConfig: SiteConfig = {
  siteName: "ShopOnePlay",
  siteTitle: "ShopOnePlay - Shop Bán Acc Uy Tín",
  siteDescription: "Hệ Thống Mua Bán Tài Khoản Game Uy Tín",
  contactEmail: "shoponeplay.com@gmail.com",
  contactPhone: "0999999999",
  facebookUrl: "https://facebook.com",
  zaloUrl: "https://zalo.me",
  siteLogo: "",
  siteFavicon: "",
  siteBanner: "",
  siteFooterLogo: "",
  bannerTitle: "SHOPONEPLAY.COM",
  bannerDesc: "ShopOnePlay Tự Hào Là Hệ Thống Cung Cấp Tài Khoản Game Uy Tín Số 1 VN",
  heroTitle: "SHOPONEPLAY.COM",
  heroSub: "SHOP ACC PLAY TOGETHER",
  heroTopText: "PLAY",
  heroBottomText: "TOGETHER!",
  introLinks: JSON.stringify([
    { label: "CHAT ZALO", url: "https://zalo.me", type: "zalo" },
    { label: "FACEBOOK", url: "https://facebook.com", type: "facebook" }
  ]),
  menuLabels: JSON.stringify({}),
  TELEGRAM_TOKEN: "",
  TELEGRAM_ID: "",
  TELEGRAM_ENABLED: "false",
  SELLER_FEE: "10" // Mặc định 10%
};

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const configs = await prisma.config.findMany();

    // Start with default config to ensure all keys exist
    const result: Record<string, string> = { ...defaultConfig };

    // Override with values from DB
    configs.forEach(c => {
      console.log(`>>> DB CONFIG: [${c.key}] = ${c.value.substring(0, 50)}...`);
      result[c.key] = c.value;
    });

    return result as unknown as SiteConfig;
  } catch (error) {
    console.error("Lá»—i Ä‘á»c cáº¥u hÃ¬nh trang web tá»« Database:", error);
    return defaultConfig;
  }
}

export async function saveSiteConfig(newConfig: Partial<SiteConfig>): Promise<boolean> {
  try {
    // Process each key in the newConfig object
    const operations = Object.entries(newConfig).map(([key, value]) => {
      return prisma.config.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    });

    // Run all upserts in a transaction
    await prisma.$transaction(operations);
    return true;
  } catch (error) {
    console.error("Lá»—i lÆ°u cáº¥u hÃ¬nh trang web vÃ o Database:", error);
    return false;
  }
}
