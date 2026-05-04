CARD PARTNER API
POST
Lấy trạng thái
http://{{domain_post}}/api/rechargews
Hàm này sẽ tải lại thẻ theo mã đơn hàng, không phát sinh giao dịch mới.
Thứ tự mã hóa chữ ký: md5(partner_key + partner_id + command + request_id)

Body
raw (json)
json
{
    "partner_id": "3681148751", 
    "command":"getstatus", 
    "request_id": "116",
    "order_code": "R625931CC50F71",
    "sign":"43567456546dfs32465asdkg123"
}
Example Request
Get Status
curl
curl --location -g 'http://{{domain_post}}/api/rechargews' \
--data '{
    "partner_id": "3681148751", 
    "command":"getstatus", 
    "request_id": "116",
    "order_code": "R625931CC50F71",
    "sign":"43567456546dfs32465asdkg123"
}'
200 OK
Example Response
Body
Headers (12)
View More
json
{
  "status": "success",
  "data": {
    "account": {
      "phone": "0943793984"
    },
    "request_value": 10000,
    "amount": 10000,
    "request_id": "116",
    "order_code": "R625931CC50F71",
    "status": "pending"
  }
}
POST
Lấy danh sách sản phẩm
http://{{domain_post}}/api/rechargews
Hàm này sẽ tải tất cả thông tin về sản phẩm mà chúng tôi đang bán.
Thứ tự mã hóa chữ ký: md5(partner_key + partner_id + command)

Body
raw (json)
json
{
    "partner_id": "45974491332", 
    "command":"productlist", 
    "sign":"43567456546dfs32465asdkg123"
}
Example Request
Get Product Info
curl
curl --location -g 'http://{{domain_post}}/api/rechargews' \
--data '{
    "partner_id": "3681148751", 
    "command":"productlist", 
    "sign":"43567456546dfs32465asdkg123"
}'
200 OK
Example Response
Body
Headers (12)
View More
json
{
  "status": "success",
  "data": [
    {
      "name": "Nạp Viettel trả sau",
      "service_code": "viettelts",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/thecao/the-viettel.png",
      "items": [
        {
          "name": "10,000 đ",
          "value": 10000,
          "price": "10000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "20,000 đ",
          "value": 20000,
          "price": "20000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "30,000 đ",
          "value": 30000,
          "price": "30000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "300,000 đ",
          "value": 300000,
          "price": "300000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": 0
        }
      ]
    },
    {
      "name": "Nạp Viettel trả trước",
      "service_code": "vietteltt",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/thecao/the-viettel.png",
      "items": [
        {
          "name": "10,000 đ",
          "value": 10000,
          "price": "10000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "20,000 đ",
          "value": 20000,
          "price": "20000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "30,000 đ",
          "value": 30000,
          "price": "30000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "300,000 đ",
          "value": 300000,
          "price": "300000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        }
      ]
    },
    {
      "name": "Nạp Vinaphone trả trước",
      "service_code": "vinatt",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/thecao/the-vinaphone.jpeg",
      "items": [
        {
          "name": "20,000 đ",
          "value": 20000,
          "price": "20000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "30,000 đ",
          "value": 30000,
          "price": "30000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "300,000 đ",
          "value": 300000,
          "price": "300000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "10,000 đ",
          "value": 10000,
          "price": "10000",
          "currency_code": "VND",
          "discount": 0
        }
      ]
    },
    {
      "name": "Nạp Vinaphone trả sau",
      "service_code": "vinats",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/thecao/the-vinaphone.jpeg",
      "items": [
        {
          "name": "20,000 đ",
          "value": 20000,
          "price": "20000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "30,000 đ",
          "value": 30000,
          "price": "30000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "300,000 đ",
          "value": 300000,
          "price": "300000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "10,000 đ",
          "value": 10000,
          "price": "10000",
          "currency_code": "VND",
          "discount": 0
        }
      ]
    },
    {
      "name": "Nạp Mobifone trả sau",
      "service_code": "mobits",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/thecao/the-mobifone.jpeg",
      "items": [
        {
          "name": "20,000 đ",
          "value": 20000,
          "price": "20000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "30,000 đ",
          "value": 30000,
          "price": "30000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "300,000 đ",
          "value": 300000,
          "price": "300000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "10,000 đ",
          "value": 10000,
          "price": "10000",
          "currency_code": "VND",
          "discount": 0
        }
      ]
    },
    {
      "name": "Nạp Mobifone trả trước",
      "service_code": "mobitt",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/thecao/the-mobifone.jpeg",
      "items": [
        {
          "name": "20,000 đ",
          "value": 20000,
          "price": "20000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "30,000 đ",
          "value": 30000,
          "price": "30000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "300,000 đ",
          "value": 300000,
          "price": "300000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "10,000 đ",
          "value": 10000,
          "price": "10000",
          "currency_code": "VND",
          "discount": 0
        }
      ]
    },
    {
      "name": "Nạp Vietnamobile trả trước",
      "service_code": "vnmobilett",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/thecao/the-vietnamobile.jpeg",
      "items": [
        {
          "name": "20,000 đ",
          "value": 20000,
          "price": "20000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "30,000 đ",
          "value": 30000,
          "price": "30000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "300,000 đ",
          "value": 300000,
          "price": "300000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": 0
        },
        {
          "name": "10,000 đ",
          "value": 10000,
          "price": "10000",
          "currency_code": "VND",
          "discount": 0
        }
      ]
    },
    {
      "name": "Avatar 3",
      "service_code": "av3",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/topup/avatar3.jpg",
      "items": [
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "1,000,000 đ",
          "value": 1000000,
          "price": "1000000",
          "currency_code": "VND",
          "discount": "4"
        }
      ]
    },
    {
      "name": "Avatar Musik",
      "service_code": "am",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/topup/avatarmusik.jpg",
      "items": [
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "1,000,000 đ",
          "value": 1000000,
          "price": "1000000",
          "currency_code": "VND",
          "discount": "4"
        }
      ]
    },
    {
      "name": "Ninja",
      "service_code": "nj",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/topup/ninjaschool.jpg",
      "items": [
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "1,000,000 đ",
          "value": 1000000,
          "price": "1000000",
          "currency_code": "VND",
          "discount": "4"
        }
      ]
    },
    {
      "name": "Ngọc Rồng",
      "service_code": "nr",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/topup/ngocrong.jpg",
      "items": [
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "1,000,000 đ",
          "value": 1000000,
          "price": "1000000",
          "currency_code": "VND",
          "discount": "4"
        }
      ]
    },
    {
      "name": "Hiệp Sĩ Online",
      "service_code": "hs",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/topup/hiepsionline.jpg",
      "items": [
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "1,000,000 đ",
          "value": 1000000,
          "price": "1000000",
          "currency_code": "VND",
          "discount": "4"
        }
      ]
    },
    {
      "name": "Sơn Thủy Phân Tranh",
      "service_code": "stpt",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/topup/sonthuyphantranh.jpg",
      "items": [
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "1,000,000 đ",
          "value": 1000000,
          "price": "1000000",
          "currency_code": "VND",
          "discount": "4"
        }
      ]
    },
    {
      "name": "KPAH",
      "service_code": "kpah",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/topup/kran.jpg",
      "items": [
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "1,000,000 đ",
          "value": 1000000,
          "price": "1000000",
          "currency_code": "VND",
          "discount": "4"
        }
      ]
    },
    {
      "name": "KPAH 3D",
      "service_code": "kpah3d",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/topup/kran3d.jpg",
      "items": [
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "1,000,000 đ",
          "value": 1000000,
          "price": "1000000",
          "currency_code": "VND",
          "discount": "4"
        }
      ]
    },
    {
      "name": "Mobi Army 2",
      "service_code": "army2",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/topup/army2.jpg",
      "items": [
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "1,000,000 đ",
          "value": 1000000,
          "price": "1000000",
          "currency_code": "VND",
          "discount": "4"
        }
      ]
    },
    {
      "name": "Mobi Army 3",
      "service_code": "army3",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/topup/army3.jpg",
      "items": [
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "1,000,000 đ",
          "value": 1000000,
          "price": "1000000",
          "currency_code": "VND",
          "discount": "4"
        }
      ]
    },
    {
      "name": "Ongame",
      "service_code": "ongame",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/topup/ongame.jpg",
      "items": [
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "1,000,000 đ",
          "value": 1000000,
          "price": "1000000",
          "currency_code": "VND",
          "discount": "4"
        }
      ]
    },
    {
      "name": "Avatar",
      "service_code": "avatar",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/topup/avatar.jpg",
      "items": [
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "1,000,000 đ",
          "value": 1000000,
          "price": "1000000",
          "currency_code": "VND",
          "discount": "4"
        }
      ]
    },
    {
      "name": "Hải Tặc Tí Hon",
      "service_code": "ht",
      "image": "http://api.netpaydev.vn/storage/userfiles/images/topup/haitactihon.jpg",
      "items": [
        {
          "name": "50,000 đ",
          "value": 50000,
          "price": "50000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "100,000 đ",
          "value": 100000,
          "price": "100000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "200,000 đ",
          "value": 200000,
          "price": "200000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "500,000 đ",
          "value": 500000,
          "price": "500000",
          "currency_code": "VND",
          "discount": "4"
        },
        {
          "name": "1,000,000 đ",
          "value": 1000000,
          "price": "1000000",
          "currency_code": "VND",
          "discount": "4"
        }
      ]
    }
  ]
}
POST
Lấy số dư
http://{{domain_post}}/api/rechargews
Hàm này sẽ tải lại thẻ theo mã đơn hàng, không phát sinh giao dịch mới.
Thứ tự mã hóa chữ ký: md5(partner_key + partner_id + command)

Body
raw (json)
json
{
    "partner_id": "3681148751", 
    "command":"getbalance", 
    "sign":"43567456546dfs32465asdkg123"
}
Example Request
Get Balance
curl
curl --location -g 'http://{{domain_post}}/api/rechargews' \
--data '{
    "partner_id": "3681148751", 
    "command":"getbalance", 
    "sign":"43567456546dfs32465asdkg123"
}'
200 OK
Example Response
Body
Headers (12)
json
{
  "status": "success",
  "data": {
    "balance": 85465019,
    "currency": "VND"
  }
}