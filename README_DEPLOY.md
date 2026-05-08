# Hướng Dẫn Triển Khai (Deployment Guide) - ShopOnePlay

Tài liệu này hướng dẫn chi tiết cách đưa mã nguồn ShopOnePlay lên môi trường máy chủ ảo (VPS) chạy hệ điều hành Linux (khuyến nghị Ubuntu 20.04/22.04/24.04).

## I. Yêu cầu hệ thống (Prerequisites)

Để chạy được project này trên VPS, bạn cần cài đặt các phần mềm sau:

### 1. Node.js (Môi trường chạy code)
Dự án sử dụng Next.js 16 và React 19, yêu cầu Node.js phiên bản mới (khuyến nghị v20.x trở lên).
```bash
# Cài đặt Node.js v20 qua nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

### 2. PostgreSQL (Cơ sở dữ liệu)
Bạn có thể cài đặt PostgreSQL trực tiếp trên VPS hoặc sử dụng dịch vụ DB Cloud (như Supabase, Vercel Postgres, Neon).
Nếu cài trực tiếp trên Ubuntu:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
```

### 3. Các công cụ hỗ trợ (Cần thiết cho tính năng Backup tự động)
Hệ thống Backup tự động qua Telegram yêu cầu một số công cụ dòng lệnh cơ bản:
```bash
sudo apt install zip jq curl -y
```

### 4. PM2 (Quản lý tiến trình Node.js)
Giúp ứng dụng của bạn luôn chạy ngầm và tự khởi động lại nếu server bị sập.
```bash
npm install -g pm2
```

---

## II. Các bước Triển khai (Deployment Steps)

### Bước 1: Đưa mã nguồn lên VPS
Bạn có thể dùng `git clone` từ kho lưu trữ của bạn (GitHub/GitLab) hoặc nén file zip ở máy tính và tải lên VPS (qua SFTP/WinSCP).

### Bước 2: Cấu hình biến môi trường
Tạo file `.env` tại thư mục gốc của dự án trên VPS và điền các thông tin (tham khảo từ file `.env.example` nếu có):

```env
# Database URL (Ví dụ: postgresql://username:password@localhost:5432/shoponeplay)
DATABASE_URL="thông_tin_kết_nối_db_của_bạn"

# NextAuth config
NEXTAUTH_URL="https://ten-mien-cua-ban.com"
NEXTAUTH_SECRET="một_chuỗi_ngẫu_nhiên_bảo_mật_dài_khoảng_32_ký_tự"

# Các cấu hình khác nếu có...
```

### Bước 3: Cài đặt thư viện và Đồng bộ Database
Di chuyển vào thư mục dự án và chạy các lệnh sau:

```bash
# Cài đặt toàn bộ thư viện (packages)
npm install

# Đồng bộ cấu trúc Database (chạy Prisma)
npx prisma generate
npx prisma db push

# Chạy file seed để khởi tạo tài khoản Admin mặc định (nếu bạn có file prisma/seed.ts)
npm run prisma db seed
```

### Bước 4: Build ứng dụng
Biến mã nguồn thành phiên bản tối ưu hóa cho môi trường Production:
```bash
npm run build
```

### Bước 5: Chạy ứng dụng bằng PM2
Khởi chạy ứng dụng bằng PM2 để nó chạy nền:
```bash
pm2 start npm --name "shoponeplay" -- run start

# Lưu cấu hình PM2 để tự khởi động cùng hệ điều hành
pm2 save
pm2 startup
```
Lúc này ứng dụng sẽ chạy ở cổng `3000` (mặc định) trên localhost của VPS: `http://localhost:3000`.

---

## III. Cấu hình Tên miền và Bảo mật (Cloudflare Tunnel)

Đây là phương pháp **Bảo mật và Tiện lợi nhất** (Không cần mở Port, không cần cài Nginx, SSL tự động gia hạn).
Bạn có thể thiết lập theo 1 trong 2 cách sau:

### Cách 1: Qua giao diện Web (Zero Trust) - Rất dễ làm
**1. Đăng ký Cloudflare Zero Trust:**
- Đăng nhập Cloudflare -> Chọn **Zero Trust** (Bên menu trái).
- Vào **Networks -> Tunnels** -> Nhấn **Create a tunnel**.
- Đặt tên cho Tunnel (VD: `shoponeplay-tunnel`).

**2. Cài đặt Tunnel trên VPS:**
- Tại trang Cloudflare, chọn hệ điều hành **Debian/Ubuntu** (64-bit).
- Sao chép dòng lệnh cài đặt mà Cloudflare cung cấp và dán vào VPS để chạy.

**3. Kết nối Tên miền với Ứng dụng:**
- Chuyển sang bước tiếp theo (Route traffic) trên web Cloudflare.
- **Public hostname:** Chọn tên miền của bạn (VD: `shoponeplay.com`).
- **Service:** Chọn `HTTP` và điền `localhost:3000`. Lưu lại là xong!

---

### Cách 2: Cấu hình 100% bằng Dòng lệnh (CLI) - Nhanh gọn
Nếu bạn không muốn vào web, hãy thao tác hoàn toàn trên VPS:

**1. Cài đặt `cloudflared`:**
```bash
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

**2. Đăng nhập và Tạo Tunnel:**
```bash
# Gõ lệnh đăng nhập
cloudflared tunnel login
```
*(Lưu ý: VPS không có trình duyệt web. Khi gõ lệnh trên, terminal sẽ in ra một đường link dài. Bạn hãy bôi đen copy link đó, dán vào trình duyệt Chrome/Edge trên **máy tính cá nhân của bạn** để đăng nhập và cấp quyền. Sau khi cấp quyền trên máy tính xong, VPS sẽ tự động nhận diện thành công!)*

```bash
# Sau khi đăng nhập xong, tạo tunnel mới
cloudflared tunnel create shoponeplay
```
*(Sau khi tạo, terminal sẽ in ra một mã ID của tunnel, hãy lưu mã này lại)*

**3. Tạo file cấu hình và trỏ Tên miền:**
```bash
# Trỏ domain về Tunnel (Cloudflare sẽ tự động thêm record CNAME)
cloudflared tunnel route dns shoponeplay shoponeplay.com

# Tạo file cấu hình định tuyến (Route)
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```
Dán nội dung sau vào file `config.yml` (Thay `<Tunnel-ID-của-bạn>` bằng mã ID ở bước 2):
```yaml
tunnel: shoponeplay
credentials-file: /root/.cloudflared/<Tunnel-ID-của-bạn>.json

ingress:
  - hostname: shoponeplay.com
    service: http://localhost:3000
  - service: http_status:404
```

**4. Chạy Tunnel chạy ngầm:**
```bash
# Cài đặt thành Service của hệ điều hành
sudo cloudflared service install

# Khởi động Tunnel
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

🎉 **Xong!** Dù chọn cách 1 hay cách 2, web của bạn giờ đã online với ổ khóa xanh (HTTPS) siêu an toàn. Lớp tường lửa của VPS (UFW) giờ có thể chặn sạch mọi Port từ bên ngoài, chỉ chừa lại Port 22 (SSH).
---

## IV. Thiết lập tính năng Backup Tự động (Admin Panel)

Sau khi web đã chạy thành công và bạn có thể đăng nhập bằng tài khoản Admin:
1. Vào phần **Cài đặt -> Cấu hình thông báo**.
2. Điền thông tin **Telegram Bot Token** và **Chat ID**.
3. Bật tính năng **"Tự động gửi Backup về Telegram"** và nhập **Mật khẩu** bảo vệ file nén.
4. Nhấn nút **"Cài đặt tự động lên VPS (Linux)"**.

Hệ thống sẽ tự động tạo file `scripts/backup.sh` và thiết lập Cron Job để sao lưu cơ sở dữ liệu vào lúc **00:00 mỗi ngày**.
