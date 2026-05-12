làm tự động mua thẻ và nạp gói:
- chỉ áp dụng cho nhũng gói có trong configs ( tạo config cho những gói có tự đọng nạp, và cấu hình trong trang cấu hình nạp gói admin).
- api ở dưới chỉ quan tâm đến:
- check số dư user mua
xong gọi check số dư đại lý xem đủ ko, nếu ko đủ trả số dư ví tgr không đủ
- xong check xem user mua từ id đó có gói cần mua không, nếu ko có thì trả lỗi khônng có gói cần mua ( nhưng trường hợp này hiếm vì user login đúng user trong napgame thì nó tự hiện các gói có thể mua rồi, trừ khi user nạp từ mục nạp nhiều id)
- xong gọi api mua thẻ bên thegiare, nếu chưa có thẻ sau lần đầu mua thì gọi API Tải Lại Thẻ, chắc chắn phải có thẻ thì mới tiếp tục nạp, nếu chưa có thẻ thì cứ gọi cách 5p gọi lại 1 lần, tối đa 5 lần. nếu 5 lần ko có thì bắn thông báo vào telegram, dùng hàm telegram có sẵn để thông báo và cáu hình trong cài đặt thông baoas của admin mà trước đó đã làm.
- xong khi có thẻ gọi API Nạp Thẻ Vào Game VNG, cáid sản phẩm phải lấy chính xác từ sản phẩm đó và nạp.
- tính năng nạp tự động này chỉ có những sản phẩm trong config ở trên mới đc nạp và trong trang cấu hình nạp gói của admin.

# Tài liệu API Nạp Gói Game (Chi Tiết Toàn Bộ Flow)
curl 'https://zlp-ofp-emvco-gateway.zalopay.vn/v1/emvco/dynamic-qr/info' \
  -H 'accept: */*' \
  -H 'accept-language: vi-VN,vi;q=0.9,en-GB;q=0.8,en;q=0.7,fr-FR;q=0.6,fr;q=0.5,en-US;q=0.4' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'origin: https://gateway.zalopay.vn' \
  -H 'pragma: no-cache' \
  -H 'priority: u=1, i' \
  -H 'referer: https://gateway.zalopay.vn/' \
  -H 'sec-ch-ua: "Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36' \
  --data-raw '{"emvco_qr":"00020101021226530010vn.zalopay01061801890203001031818215797547179665238610010A000000727013100069704320117ZLP261301598171960208QRIBFTTA5204739953037045405200005802VN63047905","platform":""}'
---

## 1. API Mua Thẻ Zing Từ NCC (CardGateway - buycard)

- **API Endpoint:** `POST {CARD_BASE_URL}/api/cardws`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Tất cả trường cần gửi:**

| Trường | Kiểu | Bắt buộc | Giá trị mẫu | Mô tả |
|--------|------|----------|-------------|-------|
| `partner_id` | string | ✅ | `"33372596257"` | ID đối tác được NCC cấp |
| `command` | string | ✅ | `"buycard"` | Lệnh mua thẻ (cố định) |
| `request_id` | string | ✅ | `"01JVMX..."` | Mã yêu cầu duy nhất (ULID) |
| `service_code` | string | ✅ | `"ZING"` | Loại thẻ: `ZING`, `GARENA`, `VIETTEL`... |
| `value` | int | ✅ | `20000` | Mệnh giá thẻ cần mua (VND) |
| `qty` | int | ✅ | `1` | Số lượng thẻ |
| `wallet_number` | string | ✅ | `"0020189759"` | Số ví tiền đại lý tại NCC |
| `sign` | string | ✅ | `"a1b2c3..."` | Chữ ký: `md5(partner_key + partner_id + command + request_id)` |

- **Response thành công:**
```json
{
  "status": 1,
  "message": "Giao dịch thành công",
  "data": {
    "cards": [
      {
        "serial": "SN123456789",
        "pin": "PIN123456789",
        "name": "ZING",
        "expired": "2026-12-31"
      }
    ],
    "order_code": "ORDER_ID_NCC",
    "time": "2026-05-10 14:00:00"
  }
}
```

- **Mã status trả về:**
  - `1`: Thành công, có thẻ.
  - `2`: Đang xử lý (NCC chưa cấp thẻ, cần chờ hoặc redownload).
  - Khác: Thất bại.

---

## 2. API Kiểm Tra Số Dư Ví Đại Lý (CardGateway - getbalance)

- **API Endpoint:** `POST {CARD_BASE_URL}/api/cardws`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Tất cả trường cần gửi:**

| Trường | Kiểu | Bắt buộc | Giá trị mẫu | Mô tả |
|--------|------|----------|-------------|-------|
| `partner_id` | string | ✅ | `"33372596257"` | ID đối tác |
| `command` | string | ✅ | `"getbalance"` | Lệnh kiểm tra số dư (cố định) |
| `wallet_number` | string | ✅ | `"0020189759"` | Số ví đại lý |
| `request_id` | string | ✅ | `"bal-663f..."` | Mã yêu cầu (dùng `uniqid`) |
| `sign` | string | ✅ | `"a1b2c3..."` | Chữ ký: `md5(partner_key + partner_id + command + request_id)` |

- **Response:**
```json
{
  "balance": 1500000
}
```

---

## 3. API Tải Lại Thẻ (CardGateway - redownload)

Dùng khi mua thẻ thành công nhưng bị mất kết quả (timeout, lỗi mạng).

- **API Endpoint:** `POST {CARD_BASE_URL}/api/cardws`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Tất cả trường cần gửi:**

| Trường | Kiểu | Bắt buộc | Giá trị mẫu | Mô tả |
|--------|------|----------|-------------|-------|
| `partner_id` | string | ✅ | `"33372596257"` | ID đối tác |
| `command` | string | ✅ | `"redownload"` | Lệnh tải lại thẻ (cố định) |
| `request_id` | string | ✅ | `"pz123abc"` | Mã yêu cầu gốc (cùng `request_id` lúc mua) |
| `sign` | string | ✅ | `"a1b2c3..."` | Chữ ký: `md5(partner_key + partner_id + command + request_id)` |
| `order_code` | string | ❌ | `"ORDER_ID"` | Mã đơn hàng NCC (nếu có) |

- **Response:** Cấu trúc giống API buycard (trả về `cards[]`).

---

## 4. API Xác Thực Nhân Vật VNG (auth/quick)

Lấy Token phiên làm việc (`jtoken`) và thông tin định danh nhân vật từ Player ID.

- **API Endpoint:** `POST https://billing.vnggames.com/fe/api/auth/quick`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Tất cả trường cần gửi:**

| Trường | Kiểu | Bắt buộc | Giá trị mẫu | Mô tả |
|--------|------|----------|-------------|-------|
| `platform` | string | ✅ | `"mobile"` | Nền tảng (cố định) |
| `clientKey` | string | ✅ | `"eyJhbGciOiJI..."` | JWT Key của game (cố định) |
| `loginType` | string | ✅ | `"9"` | Kiểu đăng nhập (cố định) |
| `lang` | string | ✅ | `"VI"` | Ngôn ngữ |
| `jtoken` | string | ✅ | `""` | Để trống khi login lần đầu |
| `userID` | string | ✅ | `""` | Để trống khi login lần đầu |
| `roleID` | string | ✅ | `"1234567"` | ID nhân vật (Player ID) |
| `roleName` | string | ✅ | `"1234567"` | Tên nhân vật (= roleID) |
| `serverID` | string | ✅ | `""` | Để trống |
| `getVgaId` | string | ✅ | `"1"` | Lấy VGA ID (cố định) |

- **Response thành công (`returnCode: 1`):**
```json
{
  "returnCode": 1,
  "data": {
    "jtoken": "eyJhbGciOiJI...",
    "userID": "987654321",
    "serverID": "2",
    "roleID": "1234567",
    "roleName": "TênNhânVật",
    "serverName": "Server 1",
    "loginType": "9"
  }
}
```

---

## 5. API Lấy Danh Sách Nhân Vật (getRoles)

Dùng khi đã có `jtoken` và `userID` từ session, lấy lại thông tin nhân vật.

- **API Endpoint:** `POST https://billing.vnggames.com/fe/api/store/getRoles`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Tất cả trường cần gửi:**

| Trường | Kiểu | Bắt buộc | Giá trị mẫu | Mô tả |
|--------|------|----------|-------------|-------|
| `jtoken` | string | ✅ | `"eyJhbGci..."` | Token từ auth/quick |
| `userID` | string | ✅ | `"987654321"` | User ID từ auth/quick |
| `serverID` | string | ✅ | `""` | Để trống |
| `loginType` | string | ✅ | `"9"` | Kiểu đăng nhập (cố định) |
| `lang` | string | ✅ | `"VI"` | Ngôn ngữ |

- **Response:**
```json
{
  "returnCode": 1,
  "data": {
    "1234567": {
      "roleID": "1234567",
      "roleName": "TênNhânVật"
    }
  }
}
```

---

## 6. API Kiểm Tra Gói Plus (getProducts)

Kiểm tra xem nhân vật có đủ điều kiện mua gói Plus hay không.

- **API Endpoint:** `POST https://billing.vnggames.com/fe/api/multiitemorder/getProducts`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Tất cả trường cần gửi:**

| Trường | Kiểu | Bắt buộc | Giá trị mẫu | Mô tả |
|--------|------|----------|-------------|-------|
| `jtoken` | string | ✅ | `"eyJhbGci..."` | Token từ auth/quick |
| `serverID` | string | ✅ | `"2"` | Server ID từ auth/quick |
| `userID` | string | ✅ | `"987654321"` | User ID từ auth/quick |
| `loginType` | string | ✅ | `"9"` | Kiểu đăng nhập từ auth/quick |
| `roleID` | string | ✅ | `"1234567"` | Role ID từ auth/quick |
| `roleName` | string | ✅ | `"TênNhânVật"` | Role Name từ auth/quick |
| `lang` | string | ✅ | `"VI"` | Ngôn ngữ |
| `bonusInfo` | string | ✅ | `"false"` | Lấy thông tin bonus (cố định) |

- **Response:** Trả về danh sách `products` dạng object, key là Product ID.
- **Kiểm tra:** Nếu product có `enable == 1` và `hidden == 0` thì nhân vật có thể mua.

---

## 7. API Nạp Thẻ Vào Game VNG (createOrder)

Bước cuối cùng: đẩy mã thẻ Zing vào hệ thống VNG để nhận gói quà.

- **API Endpoint:** `POST https://billing.vnggames.com/fe/api/multiitemorder/createOrder`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Tất cả trường cần gửi:**

| Trường | Kiểu | Bắt buộc | Giá trị mẫu | Mô tả |
|--------|------|----------|-------------|-------|
| `pmcID` | string | ✅ | `"1"` | ID phương thức thanh toán (cố định) |
| `paymentGatewayID` | string | ✅ | `"1"` | ID cổng thanh toán (cố định) |
| `paymentGroupID` | string | ✅ | `"card"` | Nhóm thanh toán: thẻ cào (cố định) |
| `paymentPartnerID` | string | ✅ | `"1"` | ID đối tác thanh toán (cố định) |
| `providerID` | string | ✅ | `"1"` | ID nhà cung cấp (cố định) |
| `amount` | string | ✅ | `"20000"` | Mệnh giá thẻ (VND) |
| `payingAmount` | string | ✅ | `"20000"` | Số tiền thanh toán (= amount) |
| `currency` | string | ✅ | `"VND"` | Loại tiền (cố định) |
| `country` | string | ✅ | `"VN"` | Quốc gia (cố định) |
| `lang` | string | ✅ | `"VI"` | Ngôn ngữ |
| `description` | string | ✅ | `"S0FJQTNEWURFNSBu..."` | Mô tả giao dịch (Base64) |
| `cardSerial` | string | ✅ | `"SN1234567890"` | Số Seri thẻ Zing (từ Bước 1) |
| `cardPassword` | string | ✅ | `"PIN1234567890"` | Mã PIN thẻ Zing (từ Bước 1) |
| `paymentMethodID` | string | ✅ | `"1"` | ID phương thức (cố định) |
| `paymentProviderID` | string | ✅ | `"1"` | ID nhà cung cấp thanh toán (cố định) |
| `jtoken` | string | ✅ | `"eyJhbGci..."` | Token từ Bước 4 (auth/quick) |
| `serverID` | string | ✅ | `"2"` | Server ID từ Bước 4 |
| `userID` | string | ✅ | `"987654321"` | User ID từ Bước 4 |
| `roleID` | string | ✅ | `"1234567"` | ID nhân vật khách hàng |
| `roleName` | string | ✅ | `"TênNhânVật"` | Tên nhân vật từ Bước 4 |
| `serverName` | string | ✅ | `"Server 1"` | Tên server từ Bước 4 |
| `products` | string (JSON) | ✅ | `"[{\"productID\":\"92110025\",\"quantity\":1}]"` | Gói nạp (JSON encode) |

### Bảng Product ID:

| Type | Product ID | Gói |
|------|-----------|-----|
| `22` | `92110005` | Gói Ngày |
| `30` | `92110025` | Gói Tuần / PLUS (env: `PRODUCT_ID_PLUS`) |

- **Response thành công:**
```json
{
  "returnCode": 1,
  "data": {
    "message": "Transaction Success"
  }
}
```

---

## 8. API Nhập Giftcode VNG

- **API Endpoint:** `POST https://vgrapi-sea.vnggames.com/coordinator/api/v1/code/redeem`
- **Content-Type:** `application/json`
- **Headers đặc biệt:**

| Header | Giá trị |
|--------|---------|
| `origin` | `https://giftcode.vnggames.com` |
| `referer` | `https://giftcode.vnggames.com/` |
| `x-client-region` | `VN` |
| `x-request-id` | UUID ngẫu nhiên |

- **Tất cả trường cần gửi:**

| Trường | Kiểu | Bắt buộc | Giá trị mẫu | Mô tả |
|--------|------|----------|-------------|-------|
| `serverId` | string | ✅ | `"2"` | Server ID (cố định) |
| `gameCode` | string | ✅ | `"661"` | Mã game (cố định cho Play Together) |
| `roleId` | string | ✅ | `"1234567"` | ID nhân vật |
| `roleName` | string | ✅ | `"1234567"` | Tên nhân vật |
| `code` | string | ✅ | `"GIFTCODE123"` | Mã giftcode cần nhập |

---

## 9. Luồng Tổng Quát (TopupCardJob)

```
User đặt đơn trên Web
     │
     ▼
Trừ tiền balance → Tạo đơn hàng (PENDING)
     │
     ▼
[Job] Gọi API 1: buycard (NCC) → Nhận Serial + PIN
     │
     ▼
[Job] Gọi API 4: auth/quick (VNG) → Nhận jtoken + userID
     │
     ▼
[Job] Gọi API 7: createOrder (VNG) → Nạp thẻ vào nhân vật
     │
     ▼
Kiểm tra returnCode === 1 ?
  ├── ✅ → Đơn hàng COMPLETED + Thông báo Telegram
  └── ❌ → Đơn hàng ERROR + Admin kiểm tra
```

---

## 10. Cấu hình .env

| Biến | Mô tả | Giá trị mẫu |
|------|-------|-------------|
| `CARD_BASE_URL` | URL API mua thẻ NCC | `https://thegiare.vn` |
| `CARD_PARTNER_ID` | ID đối tác tại NCC | `33372596257` |
| `CARD_PARTNER_KEY` | Key bí mật để ký MD5 | `***` |
| `CARD_WALLET_NUMBER` | Số ví đại lý | `0020189759` |
| `CARD_CALLBACK_URL` | URL nhận callback từ NCC | `https://domain.com/api/card/callback` |
| `CARD_SERVICE_CODE_ZING` | Mã loại thẻ Zing | `Zing` |
| `PRODUCT_ID_PLUS` | Product ID gói Plus VNG | `92110025` |
