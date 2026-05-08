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
    title: `Tài Khoản Play${SUFFIX}`
  },
  PRODUCTS_RANDOM: {
    path: "/admin/products/random",
    title: `Tài Khoản Random${SUFFIX}`
  },
  PRODUCTS_PLAY_ADD: {
    path: "/admin/products/play/add",
    title: `Thêm Tài Khoản Play${SUFFIX}`
  },
  PRODUCTS_RANDOM_ADD: {
    path: "/admin/products/random/add",
    title: `Thêm Lô Random${SUFFIX}`
  },
  PRODUCTS_PLAY_EDIT: (id: string) => ({
    path: `/admin/products/play/${id}/edit`,
    title: `Sửa Tài Khoản Play${SUFFIX}`
  }),
  PRODUCTS_RANDOM_EDIT: (id: string) => ({
    path: `/admin/products/random/${id}/edit`,
    title: `Sửa Lô Random${SUFFIX}`
  }),
  CATEGORIES: {
    path: "/admin/categories",
    title: `Quản Lý Danh Mục${SUFFIX}`
  },
  CATEGORIES_ADD: {
    path: "/admin/categories/add",
    title: `Thêm Danh Mục${SUFFIX}`
  },
  CATEGORIES_EDIT: (id: string) => ({
    path: `/admin/categories/${id}/edit`,
    title: `Sửa Danh Mục${SUFFIX}`
  }),
  TRANSACTIONS: {
    path: "/admin/transactions",
    title: `Lịch Sử Đơn Hàng${SUFFIX}`
  },
  TRANSACTIONS_HISTORY: {
    path: "/admin/transactions/history",
    title: `Lịch Sử Giao Dịch${SUFFIX}`
  },
  WITHDRAWALS: {
    path: "/admin/withdrawals",
    title: `Lịch Sử Thanh Toán${SUFFIX}`
  },
  DEPOSITS_BANK: {
    path: "/admin/deposits/bank",
    title: `Lịch Sử Nạp Bank${SUFFIX}`
  },
  DEPOSITS_CARD: {
    path: "/admin/deposits/card",
    title: `Lịch Sử Nạp Card${SUFFIX}`
  },
  SETTINGS: {
    path: "/admin/settings",
    title: `Cấu Hình Hệ Thống${SUFFIX}`
  },
  BRANDING: {
    path: "/admin/settings/branding",
    title: `Cấu Hình Giao Diện${SUFFIX}`
  },
  NOTIFICATIONS: {
    path: "/admin/settings/notifications",
    title: `Cấu Hình Thông Báo${SUFFIX}`
  },
  SYSTEM: {
    path: "/admin/settings/system",
    title: `Trạng Thái Hệ Thống${SUFFIX}`
  },
  SETTINGS_SELLER: {
    path: "/admin/settings/seller",
    title: `Cấu Hình Người Bán${SUFFIX}`
  },
  BANKS: {
    path: "/admin/settings/banks",
    title: `Cấu Hình Nạp Bank${SUFFIX}`
  },
  CARDS: {
    path: "/admin/settings/cards",
    title: `Cấu Hình Nạp Card${SUFFIX}`
  },
  USER_ACTIVITY: (id: string) => ({
    path: `/admin/users/${id}/activity`,
    title: `Lịch Sử Người Dùng${SUFFIX}`
  }),
  ORDER_DETAIL: (id: string) => ({
    path: `/admin/orders/${id}`,
    title: `Đơn Hàng #${id.slice(-12).toUpperCase()}${SUFFIX}`
  }),
  ACCOUNTS_HISTORY: {
    path: "/admin/accounts",
    title: `Lịch Sử Bán Acc${SUFFIX}`
  }
} as const;
