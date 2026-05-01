/**
 * Cấu hình cho hệ thống thông báo (Global Toast System) của ShopOnePlay.
 * Tại đây bạn có thể điều chỉnh các thông số về thời gian hiển thị, số lượng và vị trí.
 */

export const TOAST_CONFIG = {
  // Số lượng thông báo tối đa được phép hiển thị cùng lúc
  MAX_TOASTS: 3,

  // Thời gian mặc định (ms) trước khi thông báo tự động biến mất
  DURATION: 3000,

  // Vị trí hiển thị (Tailwind CSS classes)
  POSITION: "fixed top-20 right-4 sm:right-6",

  // Cấu hình hiệu ứng Framer Motion (Spring Physics)
  ANIMATION: {
    initial: { opacity: 0, x: 20, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 10, scale: 0.95 },
    transition: { type: "spring", damping: 20, stiffness: 400 }
  }
} as const;
