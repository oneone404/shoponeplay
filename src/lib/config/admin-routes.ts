const SUFFIX = " - ShopOnePlay";

export const ADMIN_ROUTES = {
  DASHBOARD: {
    path: "/admin",
    title: `Bảng Điều Khiển${SUFFIX}`
  },
  USERS: {
    path: "/admin/users",
    title: `Quản Lý Người Dùng${SUFFIX}`
  },
  SELLERS: {
    path: "/admin/sellers",
    title: `Quản Lý Người Bán${SUFFIX}`
  },
  PRODUCTS: {
    path: "/admin/products",
    title: `Danh Sách Sản Phẩm${SUFFIX}`
  },
  PRODUCTS_PLAY: {
    path: "/admin/products/play",
    title: `Quản Lý Tài Khoản Play${SUFFIX}`
  },
  PRODUCTS_RANDOM: {
    path: "/admin/products/random",
    title: `Quản Lý Tài Khoản Random${SUFFIX}`
  },
  PRODUCTS_PLAY_ADD: {
    path: "/admin/products/play/add",
    title: `Thêm Tài Khoản Play${SUFFIX}`
  },
  PRODUCTS_RANDOM_ADD: {
    path: "/admin/products/random/add",
    title: `Thêm Lô Random${SUFFIX}`
  },
  CATEGORIES: {
    path: "/admin/categories",
    title: `Quản Lý Danh Mục${SUFFIX}`
  },
  TRANSACTIONS: {
    path: "/admin/transactions",
    title: `Quản Lý Giao Dịch${SUFFIX}`
  },
  SETTINGS: {
    path: "/admin/settings",
    title: `Cấu Hình Hệ Thống${SUFFIX}`
  },
  BRANDING: {
    path: "/admin/settings/branding",
    title: `Cấu Hình Giao Diện${SUFFIX}`
  },
  SYSTEM: {
    path: "/admin/settings/system",
    title: `Trạng Thái Hệ Thống${SUFFIX}`
  },
  USER_ACTIVITY: (id: string) => ({
    path: `/admin/users/${id}/activity`,
    title: `Lịch Sử Người Dùng${SUFFIX}`
  })
} as const;
