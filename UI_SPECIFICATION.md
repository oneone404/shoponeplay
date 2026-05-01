# 🎮 ShopOnePlay - UI/UX Specification

Bản tài liệu chi tiết về giao diện và trải nghiệm người dùng của dự án ShopOnePlay Gaming Marketplace.

## 🎨 Hệ thống Thiết kế (Design System)

### 1. Bảng màu (Color Palette)
Hệ thống màu sắc được cấu hình thông qua Tailwind CSS CSS variables, hỗ trợ chuyển đổi Dark/Light mode mượt mà.

| Biến (Variable) | Màu sắc (HEX) | Vai trò |
| :--- | :--- | :--- |
| `--primary` | `#8b5cf6` (Violet) | Màu thương hiệu chính, dùng cho nút bấm quan trọng. |
| `--accent` | `#f43f5e` (Rose) | Màu nhấn, dùng cho các thông báo, giảm giá, hoặc gradient. |
| `--background` | `#ffffff` / `#050505` | Nền trang (Trắng cho Light, Đen sâu cho Dark). |
| `--card` | `#ffffff` / `#0d0d12` | Nền của các khối nội dung, sản phẩm. |
| `--border` | `#e5e7eb` / `#1f2937` | Màu đường kẻ phân cách cực mảnh. |

### 2. Typography
- **Font**: Sử dụng font San-serif hệ thống (tối ưu tốc độ load trên Safari).
- **Heading**: Cấp bậc rõ ràng, tiêu đề chính sử dụng hiệu ứng **Text Gradient** (Violet ➔ Rose).
- **Smoothing**: Bật chế độ `antialiased` và `font-feature-settings: "rlig" 1, "calt" 1`.

---

## 🏗️ Cấu trúc Thành phần (Components)

### 1. Navbar (Desktop Only)
- **Vị trí**: Cố định phía trên cùng (`sticky top-0`).
- **Hiệu ứng**: Nền đặc (`bg-background`), có border dưới mảnh.
- **Menu Items**:
    - **Cửa hàng**: Danh mục sản phẩm.
    - **Tin tức / Hướng dẫn**: Nội dung hỗ trợ.
    - **Liên hệ**: Hỗ trợ khách hàng.
- **Nạp tiền Button**: Nút bo tròn, màu Primary, hiệu ứng hover sáng dần.
- **User Dropdown**: Menu Avatar chứa thông tin tài khoản, ví tiền và phân quyền (Admin/Seller).

### 2. Hero Section
- **Thiết kế**: Theo phong cách High-Conversion.
- **Tiêu đề**: "ShopOnePlay - Premium Gaming Marketplace" (Kích thước lớn, in đậm).
- **Mô tả**: Slogan ngắn gọn giúp định vị thương hiệu.
- **Hiệu ứng**: Sử dụng CSS Class `.glass` để tạo khối nội dung mờ ảo phía dưới tiêu đề.

### 3. Bottom Navigation (Mobile Focus)
Đây là thành phần quan trọng nhất cho trải nghiệm di động.
- **Cấu trúc**: Thanh điều hướng nổi ở dưới cùng màn hình.
- **Hệ thống nút**: Home, Store, Tools, Profile.
- **Nút "Nạp tiền" (Center Action)**:
    - Bo tròn hoàn hảo.
    - Nhô cao hơn thanh điều hướng (`-top-3`).
    - Hiệu ứng Shadow lan tỏa giúp làm nổi bật hành động nạp tiền.
- **Tools Drawer (Bottom Sheet)**:
    - Vuốt lên để mở danh mục công cụ (Check tài khoản, Nhập code...).
    - **Drag Handle**: Thanh ngang dày 4px, bo tròn, nằm ở đỉnh Drawer giúp người dùng biết có thể vuốt/kéo.
    - **Backdrop**: Làm mờ màn hình phía sau (`blur-sm`).

### 4. Page 404 (Ghost Edition)
- **Thiết kế**: Tối giản với icon Ghost gaming.
- **UX**: Không hiển thị các nút điều hướng thừa, tập trung vào thông báo lỗi chuyên nghiệp.

---

## ⚡ Hiệu ứng & Chuyển động (Animations)
Sử dụng thư viện `framer-motion` cho các chuyển động:
- **Drawer**: Trượt lên mượt mà với `type: "spring", damping: 25`.
- **Buttons**: Hiệu ứng Scale nhẹ (`whileTap={{ scale: 0.95 }}`) tạo cảm giác vật lý khi nhấn.
- **Glassmorphism**: Tận dụng `backdrop-filter: blur(12px)` cho tiêu chuẩn UI hiện đại.

---

## 📱 Tối ưu hóa Safari & Mobile
- **Font-Display**: `swap` để tránh hiện tượng mất chữ khi load.
- **Touch Targets**: Các nút bấm có kích thước tối thiểu 44x44px.
- **Safe Area**: Tự động thích ứng với "tai thỏ" và thanh home của iPhone.

---

## 🔘 Chi tiết các Nút bấm (Button Details)

### 1. Thanh Điều hướng Trên (Navbar - Desktop)
| Tên nút | Chức năng | Hành vi (Behavior) |
| :--- | :--- | :--- |
| **Menu Điều hướng** | Chuyển trang (Shop, News, v.v.) | Hover đổi màu chữ sang Tím (`#8b5cf6`). |
| **Nút "Nạp tiền"** | Đi tới trang nạp | Hiệu ứng đổ màu đặc, co giãn nhẹ khi nhấn. |
| **Avatar Profile** | Mở Dropdown cá nhân | Hiển thị Info, Số dư ví, Dashboard, Đăng xuất. |

### 2. Phần Hero (Trang chủ)
| Tên nút | Chức năng | Hành vi (Behavior) |
| :--- | :--- | :--- |
| **CTA Chính** | Mua tài khoản ngay | Nút kích thước lớn, sử dụng Gradient Violet-Rose. |

### 3. Thanh Điều hướng Dưới (Bottom Nav - Mobile)
| Tên nút | Chức năng | Hành vi (Behavior) |
| :--- | :--- | :--- |
| **Home/Store** | Menu điều hướng nhanh | Phản hồi rung nhẹ (Haptic) nếu được hỗ trợ. |
| **Nạp tiền (Giữa)** | Phím nóng nạp tiền | Thiết kế nhô cao, màu rực rỡ nhất để kích thích nạp. |
| **Công cụ (Tools)** | Mở Drawer (Bottom Sheet) | Trượt từ dưới lên, chiếm 40-60% chiều cao màn hình. |
| **Cá nhân** | Mở trang Profile | Hiển thị thông tin người dùng trên mobile. |

### 4. Drawer Công cụ (Tools Sheet Content)
| Tên nút | Chức năng | Hành vi (Behavior) |
| :--- | :--- | :--- |
| **Check Tài khoản** | Công cụ kiểm tra nick | Mở modal hoặc chuyển hướng trang check. |
| **Nhập Code** | Nhận quà khuyến mãi | Mở form nhập mã Giftcode. |
| **Hỗ trợ** | Liên hệ CSKH | Kết nối qua Messenger/Zalo/Telegram. |
