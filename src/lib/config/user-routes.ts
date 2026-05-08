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
    path: "/tools",
    title: `Công Cụ Game${SUFFIX}`
  },

  HACKS: {
    path: "/hacks",
    title: `Phần Mềm Hỗ Trợ${SUFFIX}`
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
  })
} as const;
