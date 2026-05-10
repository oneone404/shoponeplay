# Tài liệu Luồng Xử Lý Key (Flow Documentation)

Tài liệu này chi tiết hóa các bước xử lý nghiệp vụ cho việc Mua Key và Reset Key trong hệ thống.

---

## 0. Cấu hình hệ thống (.env)

Các khóa cấu hình quan trọng cần thiết cho luồng API HackViet:
- `HACKVIET_BASE_URL`: Địa chỉ máy chủ API (Ví dụ: `https://hackviet.io`).
- `HACKVIET_EMAIL`: Email tài khoản đại lý/seller.
- `HACKVIET_PASSWORD`: Mật khẩu tài khoản đại lý.

---

## 1. Luồng Mua Key VIP (Game Hack Key)

Luồng này được thực hiện khi người dùng thực hiện mua bản hack cho game trên giao diện.

### Thành phần tham gia:
- **Controller:** `app/Http/Controllers/GameKeyController.php` (hàm `createKey`)
- **Service:** `app/Services/HackVietService.php`
- **Database Tables:** `users`, `key_purchase_histories`, `money_transactions`, `key_vips`, `discount_keys`

### Chi tiết các bước (Step-by-step):

1.  **Xác thực & Bảo mật:**
    - Kiểm tra người dùng đã đăng nhập chưa.
    - Áp dụng **Rate Limiting**: Tối đa 5 lần mua trong 1 phút để tránh spam.
2.  **Tính toán giá:**
    - Lấy giá gốc từ danh sách gói dịch vụ.
    - Kiểm tra và áp dụng mã giảm giá (`discount_code`) từ bảng `discount_keys` nếu có.
3.  **Chi tiết kỹ thuật & API Mua Key:**
    - **Hành động:** Hệ thống gọi `HackVietService@createVipKey`.
    - **Xác thực (Login Process):**
        1. **Lấy CSRF:** Gửi `GET {BASE_URL}/login` để nhận cookies khởi tạo và `XSRF-TOKEN`.
        2. **Gửi Đăng nhập:** `POST {BASE_URL}/login` với:
            - **Headers:** `X-XSRF-TOKEN` (từ bước 1), `X-Requested-With: XMLHttpRequest`.
            - **Payload:** `{"email": "...", "password": "...", "remember": true}`.
        3. **Lưu trữ:** Sau khi login thành công, toàn bộ Cookies trả về sẽ được lưu vào file `storage/app/hackviet_cookies.json` để đính kèm vào các Request API sau này.
        4. **Cơ chế duy trì Session:**
            - **Keep-alive:** Hệ thống chạy lệnh cron `hackviet:keep-alive` định kỳ mỗi giờ để giữ session không bị hết hạn.
            - **Auto Re-login:** Nếu nhận mã lỗi `401` hoặc `419` khi gọi API, hệ thống sẽ tự động đăng nhập lại và thực hiện lại (Retry) request đó ngay lập tức.
    - **API Endpoint:** `POST {BASE_URL}/api/seller/keys/bulk`
    - **Dữ liệu chuẩn bị (Payload JSON):**
      ```json
      {
        "game_id": 1,
        "duration_value": 30, // Lấy từ form (1, 7, 30...)
        "duration_type": "day",
        "device_limit": 1,    // Số máy người dùng chọn
        "status": "active",
        "is_vip": true,
        "quantity": 1,
        "key_prefix": "ADMIN" // Format từ username (không dấu, viết hoa, max 5 ký tự)
      }
      ```
    - **Kết quả trả về mẫu (Response JSON):**
      ```json
      {
        "message": "Bulk keys created successfully",
        "data": [
          {
            "id": 12345,
            "key": "ADMIN-ABCDE-12345",
            "game_id": 1,
            "duration_value": 30,
            "duration_type": "day",
            "device_limit": 1,
            "status": "active",
            "expires_at": "2026-06-08 10:00:00"
          }
        ]
      }
      ```
4.  **Hoàn tất giao dịch:**
    - Trừ tiền User, ghi log `money_transactions` và `key_purchase_histories`.
    - Trả mã Key nhận được từ API về cho người dùng.

---

## 3. Luồng Xem Thông Tin Key & Thiết Bị

Luồng này dùng để hiển thị thông tin chi tiết của một mã Key cho người dùng (Thường dùng trong trang quản lý Key).

### Chi tiết kỹ thuật & API:

1.  **API Endpoint:** `GET {BASE_URL}/api/seller/keys?search={key_value}`
2.  **Cách lấy dữ liệu:** Hệ thống gọi API search và lọc lấy item khớp với mã Key.
3.  **Dữ liệu trả về mẫu (Response JSON):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 5678,
          "key": "ADMIN-ABCDE-12345",
          "device_limit": 1,
          "status": "active",
          "expires_at": "2026-06-08 10:00:00",
          "devices": [
            {
              "device_id": "8db3...f2a",
              "device_model": "Samsung SM-G991B",
              "last_active": "2024-05-09 10:00:00"
            }
          ]
        }
      ]
    }
    ```
4.  **Hiển thị:** Dựa vào mảng `devices`, hệ thống sẽ hiển thị số máy đã dùng (ví dụ: `1/1`) và thông tin máy đang sử dụng.

---

## 4. Luồng Reset Thiết Bị (Làm mới Key)

Sử dụng khi người dùng muốn xóa thông tin thiết bị cũ gắn liền với Key để đăng nhập trên máy khác.

### Thành phần tham gia:
- **Controller:** `GameKeyController.php` (hàm `resetKey` hoặc `ajaxResetDevices`)
- **Đối tác:** HMGTeam hoặc HackViet (tùy cấu hình)

### Chi tiết kỹ thuật & API Reset:

1.  **Bước 1: Tìm ID hệ thống của Key (Search API):**
    - Vì API reset cần `id` (số), không phải mã key (chuỗi).
    - **API Endpoint:** `GET {BASE_URL}/api/seller/keys?search={key_value}`
    - **Xử lý:** Backend duyệt mảng `data` trả về để lấy trường `id` của item khớp với mã key.

    - **Kết quả trả về mẫu (Response JSON):**
      ```json
      {
        "success": true,
        "data": [
          {
            "id": 5678,
            "key": "ADMIN-ABCDE-12345",
            "expires_at": "2026-06-08 10:00:00",
            "device_limit": 1,
            "status": "active"
          }
        ],
        "meta": { "total": 1 }
      }
      ```

2.  **Bước 2: Kiểm tra phí và Thông tin thiết bị:**
    - **Thông tin thiết bị:** Trước khi reset, backend có thể lấy trường `devices` từ Search API để hiển thị số máy đang dùng (Ví dụ: `0/1`).
    - **Tra cứu phí:** Kiểm tra `reset_count` trong DB local. Phí: Lần đầu 0đ, các lần sau 5,000đ.

3.  **Bước 3: Gọi lệnh Reset:**
    - **API Endpoint:** `POST {BASE_URL}/api/seller/keys/{id}/devices/reset`
    - **Headers:** Truyền kèm Cookies xác thực đã lưu trong hệ thống.
    - **Kết quả trả về mẫu (Response JSON):**
      ```json
      {
        "success": true,
        "message": "Reset thiết bị thành công"
      }
      ```

4.  **Bước 4: Cập nhật:**
    - Tăng `reset_count` trong DB local.
    - Trừ tiền người dùng và ghi log giao dịch nếu có phí.

---

## 5. Luồng Xóa Từng Thiết Bị Riêng Lẻ

Khác với Reset (xóa tất cả), luồng này cho phép người dùng hoặc Admin chọn chính xác một hoặc nhiều thiết bị để xóa khỏi Key.

### Chi tiết kỹ thuật & API:

1.  **Dữ liệu cần thiết:**
    - `id`: ID hệ thống của Key (Lấy từ Search API).
    - `device_ids`: Mảng chứa các chuỗi ID của thiết bị cần xóa (Lấy từ danh sách `devices` trong Search API).
2.  **API Endpoint:** `POST {BASE_URL}/api/seller/keys/{id}/devices/delete`
3.  **Payload JSON:**
    ```json
    {
      "device_ids": ["8db3...f2a"]
    }
    ```
4.  **Kết quả:** Thiết bị được chọn sẽ bị loại bỏ, giải phóng slot cho máy khác mà không làm ảnh hưởng đến các máy còn lại trong danh sách (nếu key hỗ trợ nhiều máy).

---

## 6. Xử lý lỗi và Bảo mật

- **Giao dịch nguyên tử (Atomicity):** Luồng mua key sử dụng `DB::beginTransaction()`. Nếu API đối tác lỗi hoặc không trả về mã key, toàn bộ giao dịch (trừ tiền, ghi log) sẽ được **Rollback** để đảm bảo không mất tiền của User.
- **Bảo mật Cookies:** File `hackviet_cookies.json` chứa thông tin nhạy cảm, chỉ Backend có quyền truy cập.
- **Rate Limit:** Chặn spam mua key liên tục thông qua Cache (mặc định tối đa 5 lần/phút).
