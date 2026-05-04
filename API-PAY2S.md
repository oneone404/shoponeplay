🧠 Khái niệm & Tích hợp Hook Pay2S
🔌 Tích hợp nhanh chóng
Việc tích hợp cực kỳ đơn giản với PHP, Node.js hoặc bất kỳ ngôn ngữ nào.
Bạn chỉ cần khai báo đầu nhận dữ liệu (endpoint) và xử lý kết quả được Pay2S gửi về.

🏦 Liên kết tài khoản
Bạn cần có tài khoản Pay2S và liên kết ít nhất một tài khoản ngân hàng.
Truy cập trang quản trị để xem danh sách tài khoản liên kết.

Giao diện liên kết
Hệ thống có thể hỗ trợ liên kết cùng lúc nhiều tài khoản. Việc tích hợp gần như không phụ thuộc vào việc bạn liên kết tài khoản nào vào hệ thống nhờ tính linh động của hệ thống Hook.

⚙️ Tạo Hook
Sau khi liên kết tài khoản, bạn tiến hành khai báo Hook – là endpoint của bạn để nhận dữ liệu giao dịch.

Chi tiết vui lòng tham khảo ở mục Tạo Hook !

📩 Cơ chế gửi giao dịch
Mỗi giao dịch được gửi riêng lẻ: nếu có 5 giao dịch thì gửi 5 lần
Bạn có thể theo dõi tại Lịch sử giao dịch để debug
Mẹo: Tạo 1 giao dịch test → Xem dữ liệu tại Lịch sử giao dịch để kiểm tra endpoint

🔐 Bảo mật với API Key
Dữ liệu được gửi ở định dạng JSON (raw body) với Header:


Authorization: Bearer [Token của Hook]
⚠️ Lưu ý: Token được gửi trong Header Authorization. Bạn PHẢI kiểm tra và so sánh Token này trước khi xử lý dữ liệu giao dịch để đảm bảo request từ Pay2S thực sự.

📦 Dữ liệu giao dịch gửi về từ Pay2S
Dưới đây là các trường được gửi từ hệ thống:

Trường	Kiểu	Mô tả
id	String	Mã định danh duy nhất tại Pay2S
gateway	String	Tên cổng thanh toán (momo, vcb, techcombank...)
transactionDate	Date	Ngày tháng giao dịch (yyyy-mm-dd)
transactionNumber	String	Mã giao dịch riêng biệt, không trùng lặp trên cùng tài khoản
accountNumber	String	Số tài khoản liên kết nhận giao dịch
content	String	Nội dung giao dịch từ cổng thanh toán
transferType	String	Loại giao dịch: IN (nhận) hoặc OUT (chuyển)
transferAmount	Long	Số tiền giao dịch (dạng số nguyên, vd: 1000000)
checksum	String	Mã xác định duy nhất giao dịch được sinh ra từ Pay2S
⚡ Best Practices
Xác thực Token: Luôn check header Authorization trước khi xử lý
Verify checksum: Kiểm tra tính toàn vẹn dữ liệu bằng checksum
Idempotent: Xử lý webhook nhiều lần mà không gây lỗi (check id hoặc transactionNumber)
Response nhanh: Trả về HTTP 200 trong vòng 30 giây
Async processing: Offload xử lý nặng vào queue/background job
Logging: Log tất cả request webhook để debug
Retry logic: Pay2S sẽ retry nếu không nhận được 200 OK
HTTPS Only: Endpoint phải dùng HTTPS
Database transaction: Dùng transaction khi cập nhật database
Monitoring: Alert khi có lỗi hoặc timeout
Practices
🪝 Tạo Hook
🔐 Token là gì?
Token được tạo một lần duy nhất trong quá trình khai báo Hook trên hệ thống Pay2S.vn. Token giúp xác minh rằng dữ liệu giao dịch được gửi từ Pay2S là chính xác và hợp lệ.

Định dạng Request Header

Content-Type: application/json
Authorization: Bearer <SecretKey>
⚠️ Lưu ý: Token này chỉ được hiển thị duy nhất một lần khi bạn tạo Hook. Lưu giữ an toàn!

🛠️ Cách tạo Webhook
1️⃣ Truy cập Webhooks
Vào khu vực Webhooks → Thêm webhook
Bạn sẽ thấy giao diện như sau:
Thêm Webhook

2️⃣ Nhập các thông tin cần thiết
Trường	Bắt buộc	Mô tả
Tài khoản	✓	Tài khoản liên kết sẽ gửi dữ liệu
Sự kiện	✓	Loại giao dịch (tất cả, nhận, chuyển)
Endpoint	✓	URL nhận dữ liệu (http/https)
3️⃣ Mô tả chi tiết
Chọn tài khoản
Chọn tài khoản ngân hàng đã liên kết
Lưu ý: Bạn cần liên kết tài khoản trước khi tạo Hook
Chọn sự kiện
Tất cả: Gửi cả giao dịch nhận và chuyển
Nhận tiền: Chỉ gửi khi có tiền vào
Chuyển tiền: Chỉ gửi khi có tiền ra
Endpoint
URL địa chỉ nhận dữ liệu từ Pay2S
Dùng https:// nếu website có SSL
Dùng http:// nếu không có SSL
Phải trả về HTTP 200 để xác nhận
🔁 Chu kỳ gửi dữ liệu
⏱️ Cơ chế Retry
Gửi ngay: Ngay lập tức khi có giao dịch
Retry 1: Sau 60 giây nếu chưa nhận được 200
Retry 2-5: Tiếp tục retry 5 lần nếu lỗi
Dừng: Khi nhận được HTTP 200 hoặc sau lần gửi thứ 6
✅ Điều kiện dừng
Pay2S sẽ ngừng gửi nếu:

Nhận được HTTP 200 hoặc
Response body chứa:
json
{
  "success": true
}
💻 Ví dụ xử lý Webhook

PHP

Node.js

Python

Java

Go

Ruby
javascript
const express = require('express');
const app = express();

app.use(express.json());

const SECRET_KEY = 'YOUR_SECRET_KEY_HERE';

app.post('/webhook', (req, res) => {
  // Kiểm tra header Authorization
  const authHeader = req.headers['authorization'] || '';
  if (authHeader !== `Bearer ${SECRET_KEY}`) {
    return res.status(401).json({ success: false });
  }

  // Lấy dữ liệu từ body
  const { id, transactionNumber, transferAmount, content } = req.body;

  // Xử lý dữ liệu giao dịch
  console.log('Transaction received:', {
    id,
    transactionNumber,
    transferAmount,
    content
  });

  // Lưu vào database
  // await Transaction.create({ id, transactionNumber, transferAmount, content });

  // Trả về response
  return res.status(200).json({ success: true });
});

app.listen(3000, () => console.log('Webhook server running on port 3000'));
📌 Test Webhook
Cách test
Tạo giao dịch test trên hệ thống Pay2S
Kiểm tra logs endpoint của bạn để xem dữ liệu nhận được
Xem lịch sử tại mục Lịch sử giao dịch trên dashboard Pay2S
Công cụ test
Dùng Postman hoặc curl để test:

bash
curl -X POST https://your-endpoint.com/webhook \
  -H "Authorization: Bearer YOUR_SECRET_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test123",
    "gateway": "momo",
    "transactionDate": "2024-01-25",
    "transactionNumber": "TXN001",
    "accountNumber": "0123456789",
    "content": "Test payment",
    "transferType": "IN",
    "transferAmount": 100000,
    "checksum": "abc123"
  }'
⚡ Best Practices
Bảo mật: Lưu token ở environment variables, không hardcode
Validation: Luôn kiểm tra Authorization header trước khi xử lý
Idempotency: Xử lý được webhook gửi nhiều lần (lưu transaction ID)
Response nhanh: Trả về 200 trong 30 giây, offload processing vào queue
Logging: Log tất cả webhook để debug và audit
HTTPS: Luôn dùng HTTPS cho endpoint
Error handling: Đừng trả về 200 nếu có lỗi database
Monitoring: Alert khi webhook failed hoặc timeout
Database transaction: Dùng transaction để tránh race condition
Rate limiting: Đừng bị dồn request từ Pay2S (nếu endpoint lỗi)
📚 Tài liệu kỹ thuật Webhook
🔄 Cơ chế hoạt động
Khi một giao dịch xảy ra, Pay2S sẽ gửi dữ liệu đến endpoint của bạn qua HTTP POST.

🛠️ Request từ Pay2S
Method

POST
Header
json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <YOUR_SECRET_KEY>"
}
Body (POST Parameters)
json
{
  "transactions": [
    {
      "id": "1788052",
      "gateway": "ACB",
      "transactionDate": "2025-04-01 00:02:18",
      "transactionNumber": "10418",
      "accountNumber": "12805521",
      "content": "SHOPVPS12537 GD 789604-040125 00:05:38",
      "transferType": "IN",
      "transferAmount": 50000,
      "checksum": "7e2b3bbc03d1083017e3d2a96d3b8e01"
    }
  ]
}
Response từ Endpoint của bạn
json
{
  "success": true
}
🔁 Cơ chế Retry
Pay2S sẽ thực hiện các bước sau:

Bước	Thời gian	Hành động
1️⃣ Gửi ngay	Lập tức	Gửi dữ liệu đến endpoint
2️⃣ Retry 1	+60 giây	Gửi lại nếu không nhận 200 OK
3️⃣ Retry 2-5	+60 giây mỗi lần	Tiếp tục retry (tối đa 5 lần)
4️⃣ Dừng	Sau lần 6	Ngừng gửi
✅ Điều kiện dừng gửi lại
Pay2S sẽ dừng gửi khi một trong hai điều kiện được thỏa:

HTTP status: 200 OK hoặc
Response body chứa:
json
{
  "success": true
}
💡 Tip: Nếu endpoint xử lý lâu, hãy trả về 200 ngay và offload xử lý vào background job

💻 Code mẫu

PHP

Node.js

Python

Java

Go

Ruby
javascript
const express = require('express');
const app = express();

app.use(express.json());

const SECRET_KEY = 'your_expected_token_here';

app.post('/webhook', (req, res) => {
  // Kiểm tra Authorization
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '');
  
  if (token !== SECRET_KEY) {
    return res.status(403).json({ success: false });
  }

  const { transactions } = req.body;
  
  if (!transactions || !Array.isArray(transactions)) {
    return res.status(400).json({ success: false });
  }

  // Xử lý từng giao dịch
  transactions.forEach(tx => {
    const { id, transferAmount, content } = tx;
    // await Transaction.create({ id, transferAmount, content });
  });

  return res.status(200).json({ success: true });
});

app.listen(3000, () => console.log('Webhook running on :3000'));
🔧 Troubleshooting
⚠️ Authorization header không được nhận
Nếu server của bạn không nhận được header Authorization, thêm rule này vào .htaccess:

.htaccess
RewriteEngine On
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule .* - [e=HTTP_AUTHORIZATION:%1]
⚡ Best Practices
Xác thực ngay: Kiểm tra token trước khi xử lý
Validate dữ liệu: Kiểm tra transactions array trước khi loop
Response nhanh: Trả về 200 ngay, offload xử lý vào queue/background job
Idempotent: Xử lý webhook nhiều lần mà không bị lỗi (kiểm tra ID trước insert)
Logging: Log tất cả webhook request/response để debug
Error handling: Không trả về 200 nếu xử lý thất bại
Timeout: Đặt timeout vì Pay2S sẽ retry sau 60 giây
Database transaction: Dùng DB transaction để tránh data inconsistency
Monitoring: Alert nếu webhook failed nhiều lần
Versioning: Hỗ trợ multiple webhook versions để dễ update
📌 Checklist trước deploy
[ ] Authorization header được kiểm tra
[ ] JSON validation đầy đủ
[ ] Response 200 được trả về luôn
[ ] Logging được cấu hình
[ ] Database transaction được dùng
[ ] Error handling cho timeout/network error
[ ] Endpoint có HTTPS (nếu production)
[ ] Rate limiting được setup
[ ] Webhook được test với Postman/curl
[ ] Alert/monitoring được cấu hình