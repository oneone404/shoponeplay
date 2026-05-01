const SUFFIX = " - Kênh Người Bán";

export const SELLER_ROUTES = {
  DASHBOARD: {
    path: "/seller",
    title: `Kênh Người Bán${SUFFIX}`
  },
  PRODUCTS: {
    path: "/seller/products",
    title: `Sản Phẩm Của Tôi${SUFFIX}`
  },
  ADD_PRODUCT: {
    path: "/seller/products/add",
    title: `Đăng Sản Phẩm Mới${SUFFIX}`
  },
  ORDERS: {
    path: "/seller/orders",
    title: `Quản Lý Đơn Hàng${SUFFIX}`
  },
  WITHDRAW: {
    path: "/seller/withdraw",
    title: `Rút Tiền${SUFFIX}`
  },
  SETTINGS: {
    path: "/seller/settings",
    title: `Cài Đặt Cửa Hàng${SUFFIX}`
  }
} as const;
