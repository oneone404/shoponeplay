# ShopOnePlay - Hệ Thống Bán Tài Khoản Game Chuyên Nghiệp

Chào mừng bạn đến với ShopOnePlay, nền tảng thương mại điện tử chuyên biệt cho việc mua bán tài khoản game với đầy đủ tính năng dành cho Admin, Seller (Cộng tác viên) và Khách hàng.

## 🚀 Tính năng nổi bật vừa cập nhật

- **Seller Dashboard Modernization**: Giao diện quản lý dành cho người bán được đồng bộ 100% UI/UX với Admin dashboard (Premium glassmorphism design).
- **Hệ thống thanh toán tự động**: Tự động trừ tiền người mua, cộng tiền cho người bán và trích xuất phí sàn vào quỹ hệ thống.
- **Tối ưu hình ảnh**: Tự động chuyển đổi sang WebP và nén ảnh bằng Sharp để tăng tốc độ tải trang.
- **Dọn dẹp tài nguyên**: Tự động xóa file ảnh vật lý trên server khi sản phẩm bị xóa hoặc cập nhật ảnh mới.
- **Quản lý lợi nhuận**: Dashboard dành cho Admin theo dõi chi tiết lợi nhuận thu được từ từng đơn hàng.

---

## 🛠️ Hướng dẫn cài đặt & Chạy dự án

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18.x trở lên.
- **Database**: PostgreSQL (Đã cấu hình trong Prisma).

### 2. Cài đặt Dependencies
Mở terminal tại thư mục gốc của dự án và chạy:
```bash
npm install
```

### 3. Cấu hình Database (Prisma)
Dự án sử dụng Prisma để quản lý cơ sở dữ liệu. Để đồng bộ Schema và khởi tạo Database, hãy chạy các lệnh sau:

**Khởi tạo Database & Sync Schema:**
```bash
npx prisma db push
```

**Khởi tạo dữ liệu mẫu (Seed data - Nếu cần):**
```bash
npx prisma db seed
```

**Mở giao diện quản lý DB (Prisma Studio):**
```bash
npx prisma studio
```

### 4. Chạy dự án ở chế độ phát triển
```bash
npm run dev
```
Sau đó truy cập: `http://localhost:3000`

---

## 📂 Cấu trúc dự án quan trọng

- `/src/app/admin`: Các trang quản trị hệ thống.
- `/src/app/seller`: Các trang dành cho người bán/cộng tác viên.
- `/src/app/api`: Hệ thống API Routes (Xử lý thanh toán, upload, quản lý sản phẩm).
- `/prisma/schema.prisma`: Định nghĩa cấu trúc dữ liệu toàn hệ thống.
- `/src/components`: Thư viện component UI (Tailwind CSS).

---

## ⚠️ Lưu ý khi triển khai (Production)

- Đảm bảo các biến môi trường trong file `.env` (DATABASE_URL, NEXTAUTH_SECRET, v.v.) được cấu hình chính xác.
- Chạy `npm run build` và `npm run start` để đạt hiệu năng tối ưu.

---
*Chúc bạn có trải nghiệm tuyệt vời với ShopOnePlay!*
