import { ADMIN_ROUTES } from "./config/admin-routes";
import { SELLER_ROUTES } from "./config/seller-routes";
import { USER_ROUTES } from "./config/user-routes";

/**
 * @deprecated Dần chuyển sang sử dụng trực tiếp các file trong src/lib/config/
 * để có thể truy cập cả path và title.
 */
export const ROUTES = {
  HOME: USER_ROUTES.HOME.path,
  SHOP: USER_ROUTES.SHOP.path,
  BAG: USER_ROUTES.BAG.path,
  ORDERS: USER_ROUTES.HISTORY.ORDERS.path,
  TOOLS: USER_ROUTES.TOOLS.path,
  HISTORY: USER_ROUTES.HISTORY.path,
  HACKS: USER_ROUTES.HACKS.path,
  SERVICES: USER_ROUTES.SERVICES.path,
  BLOG: USER_ROUTES.BLOG.path,
  SIGNIN: USER_ROUTES.SIGNIN.path,
  SIGNUP: USER_ROUTES.SIGNUP.path,
  FORGOT_PASSWORD: USER_ROUTES.FORGOT_PASSWORD.path,
  TRACK: USER_ROUTES.TRACK.path,
  NAPGAME: USER_ROUTES.NAPGAME.path,
  GIFTCODE: USER_ROUTES.GIFTCODE.path,
  
  // User Pages
  USER: {
    SETTINGS: USER_ROUTES.SETTINGS.path,
    HISTORY: USER_ROUTES.HISTORY.path,
    KEYS: USER_ROUTES.KEYS.path,
  },

  // Role Based
  ADMIN: ADMIN_ROUTES.DASHBOARD.path,
  SELLER: SELLER_ROUTES.DASHBOARD.path,

  // Dynamic Routes
  SHOP_CATEGORY: (slug: string) => USER_ROUTES.SHOP_CATEGORY(slug).path,
  PRODUCT_DETAIL: (id: string) => USER_ROUTES.PRODUCT_DETAIL(id).path,
  BLOG_DETAIL: (slug: string) => USER_ROUTES.BLOG_DETAIL(slug).path,
  HACK_DETAIL: (slug: string) => USER_ROUTES.HACK_DETAIL(slug).path,

  // Giữ lại các API Routes (vì thường không cần Title Tab)
  API: {
    BAG: "/api/shop/bag",
    CHECKOUT: "/api/shop/checkout",
    ORDERS: "/api/shop/orders",
    USER_2FA: "/api/user/2fa",
    USER_BANK_INFO: "/api/user/bank-info",
    USER_CHANGE_EMAIL: "/api/user/change-email",
    USER_CHANGE_PASSWORD: "/api/user/change-password",
    USER_SEND_OTP: "/api/user/send-otp",
    USER_VERIFY_EMAIL: "/api/user/verify-email",
    USER_DEPOSIT: "/api/user/deposit",
  }
} as const;
