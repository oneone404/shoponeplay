# ShopOnePlay - Hệ Thống Bán Tài Khoản Game Chuyên Nghiệp

Chào mừng bạn đến với ShopOnePlay, nền tảng thương mại điện tử chuyên biệt cho việc mua bán tài khoản game với đầy đủ tính năng dành cho Admin, Seller (Cộng tác viên) và Khách hàng.

## 🚀 Tính năng nổi bật vừa cập nhật

- **Seller Dashboard Modernization**: Giao diện quản lý dành cho người bán được đồng bộ 100% UI/UX với Admin dashboard (Premium glassmorphism design).
- **Hệ thống thanh toán tự động**: Tự động trừ tiền người mua, cộng tiền cho người bán và trích xuất phí sàn vào quỹ hệ thống.
- **Tối ưu hình ảnh**: Tự động chuyển đổi sang WebP và nén ảnh bằng Sharp để tăng tốc độ tải trang.
- **Quy trình nạp an toàn (Pre-check)**: Đã thêm bước kiểm tra nhân vật và gói nạp trước khi mua thẻ.
- **Quản lý lịch sử nạp gói**: Đã thêm trang Admin chuyên biệt để theo dõi, kiểm tra chi tiết lỗi và nạp bù (Retry) cho các đơn hàng nạp tự động.
- **Bảo mật**: Mã hóa thẻ cào và xác thực callback NCC bằng chữ ký.
- **Tiếng Việt có dấu**: Đã cập nhật toàn bộ UI và Logs sang tiếng Việt có dấu chuẩn.
- **Dọn dẹp tài nguyên**: Tự động xóa file ảnh vật lý trên server khi sản phẩm bị xóa hoặc cập nhật ảnh mới.
- **Quản lý lợi nhuận**: Dashboard dành cho Admin theo dõi chi tiết lợi nhuận thu được từ từng đơn hàng.
- **Admin UI Standardization**: Đồng bộ hóa toàn diện giao diện trang cấu hình Ngân hàng & Thẻ cào với phong cách hiện đại (bg-card, rounded-2xl).
- **Shop & Hack UX Optimization**: Tối ưu hóa phông chữ (Max 700 bold), tăng khoảng cách danh mục lọc và chuẩn hóa số liệu lượt tải để tăng độ uy tín cho hệ thống.
- **Nạp Gói Game Thông Minh**: Tích hợp API VNG tra cứu nhân vật, phân loại sản phẩm tự động, hỗ trợ cấu hình tăng giá % và làm tròn tiền thông minh (Nearest 5k/10k). Hỗ trợ danh sách gói HOT quản lý từ Admin.
- **Cloud Account Persistence**: Tự động ghi nhớ Game ID (AccountId) của người dùng trên hệ thống đám mây (Cloud), giúp đồng bộ hóa thông tin nhân vật trên mọi thiết bị khi đăng nhập. Hỗ trợ fallback localStorage cho khách vãng lai.
- **Component Refactoring**: Tái cấu trúc trang Nạp Gói Game theo mô hình Server/Client Component giúp tăng tốc độ tải trang ban đầu và tối ưu hóa việc quản lý mã nguồn.
- **UI/UX Premium**: Nâng cấp Modal chi tiết sản phẩm với hiệu ứng làm mờ nền (Blur background technique), đảm bảo ảnh gói nạp (dọc/ngang) luôn hiển thị đẹp mắt và phông chữ được chuẩn hóa (Max weight 700).
- **Hệ thống Nạp Gói Game Tự Động (Auto-Topup)**: 
  - Backend Orchestrator điều phối mua thẻ (TheGiare) và nạp VNG hoàn toàn tự động.
  - Cơ chế retry polling và Callback API xác thực chữ ký bảo mật.
  - Mã hóa AES-256 cho mã PIN thẻ cào và Rate Limiting chống spam API.
  - Tự động hoàn tiền (Refund) cho người dùng khi giao dịch lỗi.
  - Dashboard Admin quản lý toàn diện NCC, sản phẩm tự động và lịch sử đơn hàng.
- **Hệ thống Nạp Manual (VietQR)**: 
  - Hỗ trợ nạp các gói không có trong danh sách nạp tự động thông qua quét mã VietQR.
  - Tự động tạo QR code động từ VNG Billing kèm đầy đủ thông tin đơn hàng và giá tiền.
  - Thông báo tức thì cho Admin qua Telegram kèm ảnh QR Code và nút xác nhận thanh toán trực tiếp.
  - Cơ chế bảo vệ Admin: Nút "Tạo lại QR" khi mã cũ hết hạn và log chi tiết người xác nhận đơn.

---

## 🛠️ Hướng dẫn cài đặt & Chạy dự án

## 🎮 Tính năng Nạp Gói Game (NapGame)
Hệ thống nạp gói game đã được hiện đại hóa với các tính năng:
- **Quản lý đa tài khoản Cloud-based**: Đồng bộ danh sách tài khoản (`id`, `name`) qua Database.
- **Account Switcher Modal**: Giao diện đổi tài khoản tập trung, hỗ trợ thêm/xóa ID linh hoạt.
- **Tối ưu Mobile**: Sử dụng `100dvh` để đảm bảo Modal phủ kín màn hình và hiệu ứng Loading mượt mà.
- **Tự động đồng bộ**: Tự động lấy tên nhân vật từ API VNG và cập nhật vào danh sách đã lưu.

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

## ✅ Nhật ký cập nhật UI/UX Premium (11/05/2026)

- **Premium UI Standardization**:
    - **UserPageHeader Architecture**: Phát triển component `UserPageHeader` dùng chung, thống nhất giao diện Premium Full-width cho hơn 15 trang chức năng (Giftcode, Nạp Game, Hacks, Lịch sử các loại, Blog, Giỏ hàng).
    - **Aesthetic Refinements**: Tối ưu hóa khoảng cách (Padding), áp dụng bố cục căn giữa (Centered layout) và tinh chỉnh kích thước chữ (Typography) để tạo cảm giác chuyên nghiệp, thanh thoát.
    - **Sticky Toolbars**: Chuyển các bộ lọc và tìm kiếm xuống thanh Toolbar riêng biệt (Sticky) để giữ cho Header luôn sạch sẽ và tăng trải nghiệm người dùng khi cuộn trang.
- **System Optimization**:
    - **Metadata Consistency**: Tích hợp `USER_ROUTES` để tự động hóa tiêu đề trang và metadata, đảm bảo SEO và tính nhất quán.
    - **Route Optimization**: Loại bỏ các đường dẫn viết cứng (hardcoded), đồng bộ hóa hệ thống Navigation (BottomNav, Navbar) theo cấu hình Route tập trung.
    - **Dọn dẹp mã nguồn**: Loại bỏ hoàn toàn các lệnh import dư thừa và tối ưu hóa cấu trúc component giúp tăng hiệu năng render.
