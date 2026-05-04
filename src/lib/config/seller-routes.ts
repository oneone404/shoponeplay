const SUFFIX = " - ShopOnePlay";

export const SELLER_ROUTES = {
  DASHBOARD: {
    path: "/seller",
    title: `Kênh Người Bán${SUFFIX}`
  },
  PRODUCTS: {
    path: "/seller/products",
    title: `Quản Lý Sản Phẩm${SUFFIX}`
  },
  PRODUCTS_PLAY: {
    path: "/seller/products/play",
    title: `Tài Khoản Play${SUFFIX}`
  },
  PRODUCTS_RANDOM: {
    path: "/seller/products/random",
    title: `Tài Khoản Random${SUFFIX}`
  },
  ADD_PRODUCT: {
    path: "/seller/products/add",
    title: `Đăng Sản Phẩm Mới${SUFFIX}`
  },
  PRODUCTS_PLAY_ADD: {
    path: "/seller/products/play/add",
    title: `Thêm Tài Khoản Play${SUFFIX}`
  },
  PRODUCTS_RANDOM_ADD: {
    path: "/seller/products/random/add",
    title: `Thêm Lô Random${SUFFIX}`
  },
  EDIT_PRODUCT: (id: string) => ({
    path: `/seller/products/edit/${id}`,
    title: `Chỉnh Sửa Sản Phẩm${SUFFIX}`
  }),
  ORDERS: {
    path: "/seller/transactions",
    title: `Lịch Sử Đơn Hàng${SUFFIX}`
  },
  WITHDRAW: {
    path: "/seller/withdraw",
    title: `Ví Tiền${SUFFIX}`
  },
  WITHDRAW_HISTORY: {
    path: "/seller/withdraw/history",
    title: `Lịch Sử Thanh Toán${SUFFIX}`
  },
  TRANSACTIONS: {
    path: "/seller/transactions/history",
    title: `Lịch Sử Giao Dịch${SUFFIX}`
  },
  SETTINGS: {
    path: "/seller/settings",
    title: `Cài Đặt Cửa Hàng${SUFFIX}`
  }
} as const;
