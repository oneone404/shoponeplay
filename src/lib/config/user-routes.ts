const SUFFIX = " - ShopOnePlay";

export const USER_ROUTES = {
  HOME: {
    path: "/",
    title: `ShopOnePlay - Hệ Thống Tài Khoản Game Uy Tín`
  },
  SHOP: {
    path: "/shop",
    title: `Cửa Hàng${SUFFIX}`
  },
  BAG: {
    path: "/bag",
    title: `Giỏ Hàng${SUFFIX}`
  },

  TOOLS: {
    path: "/app",
    title: `Công Cụ Game${SUFFIX}`
  },
  NAPGAME: {
    path: "/app/napgame",
    title: `Nạp Gói Game${SUFFIX}`
  },
  GIFTCODE: {
    path: "/app/giftcode",
    title: `Nhập Code Game${SUFFIX}`
  },

  HACKS: {
    path: "/app/hacks",
    title: `Công Cụ Hỗ Trợ${SUFFIX}`
  },
  SERVICES: {
    path: "/services",
    title: `Dịch Vụ Game${SUFFIX}`
  },
  BLOG: {
    path: "/blog",
    title: `Tin Tức & Blog${SUFFIX}`
  },
  SIGNIN: {
    path: "/signin",
    title: `Đăng Nhập${SUFFIX}`
  },
  SIGNUP: {
    path: "/signup",
    title: `Đăng Ký Tài Khoản${SUFFIX}`
  },
  FORGOT_PASSWORD: {
    path: "/forgot-password",
    title: `Quên Password${SUFFIX}`
  },
  TRACK: {
    path: "/shop/track",
    title: `Tra Cứu Đơn Hàng${SUFFIX}`
  },
  SETTINGS: {
    path: "/user/settings",
    title: `Cấu Hình Tài Khoản${SUFFIX}`
  },
  HISTORY: {
    path: "/orders",
    title: `Lịch Sử Giao Dịch${SUFFIX}`,
    BALANCE: { path: "/orders/balance", title: `Biến Động Số Dư${SUFFIX}` },
    BANK: { path: "/orders/bank", title: `Lịch Sử Nạp Bank${SUFFIX}` },
    CARD: { path: "/orders/card", title: `Lịch Sử Nạp Card${SUFFIX}` },
    ORDERS: { path: "/orders", title: `Đơn Hàng Đã Mua${SUFFIX}` },
    ACCOUNTS: { path: "/orders/accounts", title: `Lịch Sử Mua Tài Khoản${SUFFIX}` },
    HACKS: { path: "/orders/hacks", title: `Lịch Sử Mua Key${SUFFIX}` },
    SERVICES: { path: "/orders/services", title: `Lịch Sử Dịch Vụ${SUFFIX}` },
  },
  KEYS: {
    path: "/user/keys",
    title: `Quản Lý Keys${SUFFIX}`
  },
  // Dynamic Routes
  SHOP_CATEGORY: (slug: string, name?: string) => ({
    path: `/shop/${slug}`,
    title: `Danh Mục ${name || slug}${SUFFIX}`
  }),
  PRODUCT_DETAIL: (id: string) => ({
    path: `/shop/acc/${id}`,
    title: `Xem Thông Tin Acc${SUFFIX}`
  }),
  BLOG_DETAIL: (slug: string, title?: string) => ({
    path: `/blog/${slug}`,
    title: title || slug
  }),
  ORDER_DETAIL: (id: string) => ({
    path: `/orders/${id}`,
    title: `Đơn Hàng #${id.slice(-12).toUpperCase()}${SUFFIX}`
  }),
  HACK_DETAIL: (slug: string, name?: string) => ({
    path: `/app/hacks/${slug}`,
    title: `${(name || slug).toUpperCase()}${SUFFIX}`
  })
} as const;
