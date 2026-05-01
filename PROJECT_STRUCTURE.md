# Cấu trúc Dự án ShopOnePlay (Next.js 16 - App Router)

Dự án được cấu trúc theo mô hình hiện đại của Next.js, tách biệt rõ ràng giữa logic mua sắm công cộng (Shop), và các khu vực quản lý riêng biệt (Admin, Seller, User) bằng cách sử dụng **Route Groups** và **Nested Layouts**.

---

## 📂 Thư mục `src/app` (Routes & Page Logic)

| Thư mục | Loại | Mô tả |
| :--- | :--- | :--- |
| `(shop)/` | **Route Group** | Giao diện công khai cho khách hàng mua sắm. URL: `/`. |
| `(auth)/` | **Route Group** | Chứa các trang Đăng nhập, Đăng ký. URL: `/login`, `/register`. |
| `admin/` | **Nested Route** | Hệ thống quản trị viên. URL: `/admin`. Có Sidebar riêng. |
| `seller/` | **Nested Route** | Hệ thống dành cho người bán hàng. URL: `/seller`. Có Sidebar riêng. |
| `user/` | **Nested Route** | Dashboard cá nhân của người mua. URL: `/user`. |
| `api/` | **Backend** | Chứa các Route Handler (API). VD: `/api/health`. |
| `layout.tsx` | Root Layout | Bọc toàn bộ ứng dụng, chứa font, SEO, và ThemeProvider. |
| `globals.css` | Styles | Định nghĩa Design System (Tailwind, Gradients, Dark/Light). |

---

## 📂 Thư mục `src/components` (UI Components)

Thư mục này được chia theo ngữ cảnh sử dụng để dễ bảo trì:

- **`shop/`**: Các thành phần của trang chủ và cửa hàng (Hero section, Product Grid, Category cards).
- **`layouts/`**: Các thành phần điều hướng chính (Navbar ngang, BottomNav mobile).
- **`admin/`**: UI đặc thù cho Admin (Bảng dữ liệu, Biểu đồ thống kê).
- **`seller/`**: UI cho người bán (Form đăng sản phẩm, Quản lý kho).
- **`user/`**: UI cho khách hàng (Avatar, Ví tiền, Lịch sử mua hàng).
- **`ui/`**: Các nguyên tử UI cơ bản tái sử dụng nhiều nơi (Button, Input, Modal).
- **`auth/`**: Các form xử lý xác thực.

---

## 📂 Thư mục Core (`src/`)

- **`providers/`**: Chứa các Provider như `ThemeProvider` (xử lý Dark/Light mode tùy chỉnh).
- **`lib/`**: Chứa cấu hình thư viện (Prisma, Cloudinary, Utils v.v.).
- **`hooks/`**: Chứa các Custom React Hooks.
- **`types/`**: Định nghĩa interface/types cho TypeScript.

---

## 🛠️ Luồng Hoạt Động (Backend & View)

1. **View**: Các file `page.tsx` trong từng thư mục đảm nhận việc hiển thị UI. 
2. **Backend Logic**: Các file `route.ts` trong thư mục `api/` xử lý dữ liệu từ Database và trả về JSON.
3. **Phân quyền UI**: 
   - Khách hàng xem Navbar mặc định.
   - Admin/Seller/User khi vào Dashboard sẽ thấy Sidebar riêng do dùng **Nested Layouts**.

---
*Cập nhật lần cuối: 2026-04-20*
