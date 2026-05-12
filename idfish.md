# Tài liệu Logic Lấy Danh Sách ID Cá

Tài liệu này mô tả chi tiết cách hệ thống lấy, xử lý và hiển thị danh sách ID cá từ API bên ngoài.

## 1. Nguồn dữ liệu (Data Sources)

Hệ thống sử dụng cơ chế ưu tiên dữ liệu mới nhất từ API và tự động sao lưu để dự phòng.

- **API Chính**: `https://hackviet.io/api/fish` (Phương thức GET).
- **File Sao lưu (Backup)**: `storage/app/fish_backup.json`.
- **Bộ nhớ đệm (Cache)**: Sử dụng Laravel Cache với key `fish_id_data`, thời gian sống (TTL) là 60 giây.

## 2. Cấu trúc dữ liệu trả về (JSON Example)

Dữ liệu từ API hoặc file sao lưu có dạng một mảng các đối tượng. Ví dụ:

```json
[
    {
        "id": "1001",
        "name": "Cá Chép",
        "grade": 1,
        "ItemType": 17
    },
    {
        "id": "2005",
        "name": "Rác Thải",
        "grade": 1,
        "ItemType": 9
    },
    {
        "id": "5001",
        "name": "Cá Rồng Vàng",
        "grade": 5,
        "ItemType": 17
    }
]
```

### Các trường dữ liệu quan trọng:
- `id`: Mã định danh của vật phẩm.
- `name`: Tên vật phẩm hiển thị.
- `grade`: Phẩm chất/Cấp độ (1: Trắng, 2: Xanh lá, 3: Xanh dương, 4: Tím, 5: Cầu vồng).
- `ItemType`: Loại vật phẩm (17: Cá, 9: Rác).

## 3. Logic xử lý tại Controller (`FishIdController`)

Quy trình xử lý diễn ra như sau:

1.  **Lấy dữ liệu**:
    - Kiểm tra Cache. Nếu có, trả về ngay.
    - Nếu không, gọi API `https://hackviet.io/api/fish` (timeout 10 giây).
    - Nếu API thành công: Lưu vào file `fish_backup.json` và cập nhật Cache.
    - Nếu API thất bại: Đọc dữ liệu cũ từ file `fish_backup.json`.

2.  **Phân loại dữ liệu (Mapping)**:
    - Duyệt qua danh sách vật phẩm.
    - **Cá (`fishMap`)**: Nếu `ItemType == 17`.
    - **Rác (`trashMap`)**: Nếu `ItemType == 9`.
    - **Cấp độ đặc biệt**:
        - `grade == 5`: Lưu vào `rainbowMap` (Cầu vồng).
        - `grade == 4`: Lưu vào `purpleMap` (Tím).

3.  **Sắp xếp**:
    - Sử dụng `ksort()` để sắp xếp danh sách theo ID tăng dần.

## 4. Logic hiển thị tại View (`id-fish.blade.php`)

View sử dụng Blade và JavaScript để cung cấp bộ lọc động cho người dùng:

- **Gộp dữ liệu**: Tất cả cá và rác được gộp chung vào mảng `allMaps` để hiển thị trên cùng một bảng.
- **Bộ lọc (Filter)**: Người dùng có thể lọc theo:
    - Loại (Cá hoặc Rác).
    - Phẩm chất (Grade từ 1 đến 5).
    - Từ khóa tìm kiếm (Tên hoặc ID).
- **Màu sắc hiển thị**:
    - Cấp 1 (Trắng): Nền nhạt, chữ xanh đậm.
    - Cấp 4 (VIP - Tím): Chữ đậm, nền tím hồng.
    - Cấp 5 (VVIP - Cầu vồng): Nền hiệu ứng Gradient đa sắc.
- **Chức năng Copy**:
    - Click vào từng ID để copy nhanh.
    - Nút "Sao Chép ID Đã Lọc": Tự động nối các ID đang hiển thị thành chuỗi cách nhau bởi dấu phẩy (ví dụ: `1001,1002,1005`) để dán vào công cụ hack.

## 6. Chi tiết Logic Bộ lọc tại View (JavaScript)

Bộ lọc được xử lý hoàn toàn phía Client (trình duyệt) thông qua hàm `filterRows()` trong JavaScript để đảm bảo tốc độ phản hồi tức thì.

### 6.1. Các thành phần tham gia lọc:
- **Keyword**: Lấy từ ô Input, so khớp với tên cá hoặc mã ID (không phân biệt hoa thường).
- **Phẩm chất (Grade)**: Mảng các giá trị `[1, 2, 3, 4, 5]` được chọn từ checkbox.
- **Loại (Type)**: Giá trị `fish` hoặc `trash` được chọn từ switch.

### 6.2. Quy trình lọc từng dòng (`.fish-row`):
Hàm `filterRows()` thực hiện các bước sau cho mỗi dòng trong bảng:

1.  **Xác định trạng thái dòng**:
    - Duyệt qua tất cả các ô dữ liệu (`.fish-cell`) trong dòng đó.
    - Mỗi ô được kiểm tra qua 3 điều kiện đồng thời (AND):
        - `matchGrade`: Grade của cá có nằm trong danh sách đang chọn không?
        - `matchType`: Loại của cá (cá/rác) có đang được bật switch không?
        - `matchKeyword`: Tên cá hoặc ID dòng có chứa từ khóa tìm kiếm không?

2.  **Ẩn/Hiện ô dữ liệu**:
    - Nếu ô thỏa mãn cả 3 điều kiện -> Hiển thị ô.
    - Nếu không thỏa mãn -> Ẩn ô (`display: none`).

3.  **Ẩn/Hiện cả dòng**:
    - Nếu trong dòng có **ít nhất một ô** thỏa mãn điều kiện -> Hiển thị cả dòng.
    - Nếu không có ô nào thỏa mãn -> Ẩn toàn bộ dòng khỏi bảng.

### 6.3. Logic Sao chép thông minh:
Khi nhấn nút "Sao Chép ID Đã Lọc", JavaScript thực hiện:
1. Lọc lấy các dòng đang hiển thị (`style.display !== 'none'`).
2. Trong các dòng đó, chỉ lấy những dòng có dấu tích xanh (checkbox đầu dòng).
3. Lấy nội dung ID từ cột đầu tiên.
4. Nối chúng bằng dấu phẩy và đưa vào bộ nhớ đệm (Clipboard).

## 7. Các file liên quan

| File | Chức năng |
| :--- | :--- |
| `app/Http/Controllers/User/FishIdController.php` | Xử lý logic lấy và phân loại dữ liệu. |
| `resources/views/user/id-fish.blade.php` | Giao diện hiển thị và bộ lọc JavaScript. |
| `routes/web.php` | Khai báo route `/fish`. |
| `storage/app/fish_backup.json` | File lưu trữ dữ liệu dự phòng. |


thêm thông tin là có thể chọn version ở api https://hackviet.io/api/fish/versions,
kết quả trả về ví dụ: {"versions":["2.22.0","2.23.0","2.25.1","2.26.0","2.26.1"],"latest":"2.26.1"}
ưu tiên hiện lastest, và có thêm tính năng chọn ver
