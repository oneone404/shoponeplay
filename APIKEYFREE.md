# Tài liệu Luồng Lấy Key Miễn Phí (Free Key Flow)

Tài liệu này chi tiết hóa logic giả lập quy trình vượt link (bypass link) để lấy Key 24h tự động từ hệ thống HackViet.

---

## 1. Tổng Quan
Hệ thống HackViet cung cấp key miễn phí 24h thông qua việc người dùng vượt qua các liên kết rút gọn quảng cáo. Luồng này tự động hóa quy trình đó bằng cách giả lập các request của trình duyệt và xử lý Cookies để nhận Key mà không cần can thiệp thủ công.

---

## 2. Quy Trình Kỹ Thuật (3 Bước)

### Bước 1: Khởi tạo phiên (Create Session)
Gửi yêu cầu bắt đầu luồng lấy key free cho một game cụ thể.

- **API Endpoint:** `POST {BASE_URL}/api/free-key/session`
- **Payload (JSON):**
  ```json
  {
    "shop_slug": "shop-82-kcvara",
    "game_slug": "play-together"
  }
  ```
- **Kết quả trả về:** Một mã `session_code` (Ví dụ: `abc-123-xyz`). Mã này dùng cho các bước tiếp theo.

### Bước 2: Xác thực & Giả lập vượt link (Verify Session)
Đây là bước quan trọng nhất để "đánh lừa" hệ thống rằng người dùng đã xem quảng cáo thành công.

- **URL:** `GET {BASE_URL}/r/free/{session_code}?slug={shop_slug}`
- **Logic xử lý:**
    1. Gửi request GET tới URL trên.
    2. **Xử lý Redirect (302):** Hệ thống sẽ chuyển hướng bạn qua 1-2 URL trung gian. Bạn phải theo dõi Header `Location` và truy cập tiếp các URL đó.
    3. **Cập nhật Cookies:** Sau mỗi lần chuyển hướng, server đối tác sẽ trả về bộ Cookies mới. Bạn phải lưu và gửi kèm bộ cookies này cho bước tiếp theo.
- **Mục tiêu:** Sau bước này, `session_code` trên server đối tác sẽ được chuyển trạng thái sang "Đã xác thực".

### Bước 3: Nhận Key (Claim Key)
Sau khi đã xác thực ở bước 2, gửi yêu cầu để lấy mã key thực tế.

- **API Endpoint:** `POST {BASE_URL}/api/free-key/claim`
- **Payload (JSON):**
  ```json
  {
    "session_code": "abc-123-xyz"
  }
  ```
- **Yêu cầu quan trọng (Headers):**
    - Phải gửi kèm Header `Referer`: `{BASE_URL}/shop/{shop_slug}/free-key-success/{session_code}`
    - Phải gửi kèm bộ **Cookies** mới nhất thu thập được từ bước 1 và bước 2.
- **Kết quả trả về mẫu:**
  ```json
  {
    "success": true,
    "message": "Đã tạo key miễn phí thành công",
    "data": {
      "key": "FREE-XXXX-YYYY",
      "duration": "24h"
    }
  }
  ```

---

## 3. Luồng Rút Gọn Link & Bảo Mật URL

Hệ thống không cung cấp trực tiếp Link của đối tác cho người dùng để đảm bảo bảo mật và kiểm soát quy trình:

1.  **Bọc mã Session (Wrapping):**
    - Hệ thống tạo một mã `token` ngẫu nhiên lưu trong database local (`free_key_sessions`).
    - Tạo URL đích trỏ về website: `GET /keyfree/session/{token}`.
2.  **Rút gọn Link (Shortening):**
    - URL đích trên được gửi qua API của dịch vụ rút gọn (XLink) bằng `XLINK_API_TOKEN`.
    - Dịch vụ trả về Link quảng cáo (Ví dụ: `https://xlink.co/abc`).
3.  **Mục đích:**
    - Giấu mã `hackviet_session_code` thực tế khỏi người dùng.
    - Ép người dùng phải đi qua các lớp quảng cáo của XLink trước khi quay lại website để nhận key.
    - Cho phép hệ thống theo dõi và đo lường số lượt click thực tế.
  dùng link4m
Your API token:
6601738a18be877d2b4c6fd5
For developers Link4m prepared API which returns responses in JSON

Currently there is one method which can be used to shorten links on behalf of your account.

All you have to do is to send a GET request with your API token and URL Like the following:

https://link4m.co/api-shorten/v2?api=6601738a18be877d2b4c6fd5&url=yourdestinationlink.com
You will get a JSON response like the following

{"status":"success","shortenedUrl":"https:\/\/link4m.com\/xxxxxx"}
---

## 4. Các Lưu Ý Về Code (HackVietService.php)

- **User-Agent:** Luôn giữ cố định một User-Agent (giả lập trình duyệt Chrome/Safari) trong suốt 3 bước để tránh bị block.
- **Auto Re-login:** Nếu nhận mã lỗi `401` hoặc `419` ở bất kỳ bước nào, hệ thống sẽ tự động gọi hàm `login()` để làm mới session Admin trước khi tiếp tục.
- **Xử lý ngoại lệ:** Nếu bước 2 không thành công (không chuyển hướng đúng), bước 3 sẽ trả về lỗi "Chưa vượt link".

---

## 5. Cơ chế Tái sử dụng Session & Bảo mật

Hệ thống tích hợp các lớp kiểm tra để tối ưu hóa việc tạo key và ngăn chặn gian lận:

1.  **Kiểm tra Session cũ (Reuse Logic):**
    - Sử dụng `visitor_id` (lưu trong cookie 1 năm) để định danh trình duyệt.
    - Nếu người dùng yêu cầu lấy key cho cùng một bản hack trong vòng **30 phút**, hệ thống sẽ trả về Link cũ đang ở trạng thái `PENDING` thay vì tạo session mới trên HackViet.
2.  **Thời gian chờ tối thiểu (Anti-Cheat):**
    - Hệ thống yêu cầu thời gian vượt link thực tế phải từ **60 - 75 giây** (ngẫu nhiên).
    - Nếu người dùng kích hoạt quá sớm, hệ thống sẽ báo lỗi "Thao tác quá nhanh" và yêu cầu chờ đợi thêm.
3.  **Xác minh Cloudflare Turnstile:**
    - Sau khi vượt link, người dùng phải hoàn thành CAPTCHA của Cloudflare tại trang xác nhận để nhận được Key cuối cùng.
4.  **Giới hạn hiệu lực:**
    - Các yêu cầu lấy key (`FreeKeySession`) sẽ tự động hết hạn vào cuối ngày (23:59:59) để đảm bảo key free luôn là key trong ngày.

---
