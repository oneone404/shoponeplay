# API LẤY DANH SÁCH SẢN PHẨM PTG
import requests

cookies = {
    'ah-uuid': 'd1e3d5e2-b2a2-4beb-bf0d-50dcac303299',
    '__gg_sdk_evtm': 'eyJjbGllbnRfaWQiOiJ2bmdnYW1lcy1zaG9wIiwidHJhY2tpbmdfc2Vzc2lvbl9pZCI6IjJmMTk1NDc4LTJiNTMtNGI1OC04ZGE5LTVjNTRhMmI2YmM2YiIsImRvbWFpbiI6Imh0dHBzOi8vc2hvcC52bmdnYW1lcy5jb20vdm4vZ2FtZS9wdGd2biJ9',
}

headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-GB;q=0.8,en;q=0.7,fr-FR;q=0.6,fr;q=0.5,en-US;q=0.4',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Origin': 'https://shop.vnggames.com',
    'Referer': 'https://shop.vnggames.com/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    # 'Cookie': 'ah-uuid=d1e3d5e2-b2a2-4beb-bf0d-50dcac303299; __gg_sdk_evtm=eyJjbGllbnRfaWQiOiJ2bmdnYW1lcy1zaG9wIiwidHJhY2tpbmdfc2Vzc2lvbl9pZCI6IjJmMTk1NDc4LTJiNTMtNGI1OC04ZGE5LTVjNTRhMmI2YmM2YiIsImRvbWFpbiI6Imh0dHBzOi8vc2hvcC52bmdnYW1lcy5jb20vdm4vZ2FtZS9wdGd2biJ9',
}

data = {
    'jtoken': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJNQiIsImV4cCI6MTc4NTQ5NjExMSwiYXBwSUQiOiIwaURXUXAzYmlURzVVU1dkQUJiYnp3IiwiY2xpZW50SUQiOiIwaURXUXAzYmlURzVVU1dkQUJiYnp3IiwidXNlcklEIjoiQjRqMVZ3VlVkX0k1RFhXQzQ0NHdPSDdRRmhpd0FqWm13Ykc5T1pJR2pnQSIsImxvZ2luVHlwZSI6ImhOWVB5OXRzNVRLUHAyMUw0M2NjeGciLCJsb2dpbk1ldGhvZCI6ImNPcHVuX2JSdDZIdmpDd3pHMFRHVVEiLCJyb2xlSUQiOiJfd0N6Y2VqSW82YThvSkJWNWFPNmpnIiwicm9sZU5hbWUiOiJGMzQ5eW52TXBvZFl2Z3gwX29CNXF3Iiwic2VydmVySUQiOiIydDBBM2FLNTA5eXU3UDkya2J1NjBBIiwic2VydmVyTmFtZSI6Ino3ME1acnhWZXNVWW1IM1g0cTZXQXciLCJ1c2VySVAiOiJ6NzBNWnJ4VmVzVVltSDNYNHE2V0F3IiwiYXBwVHJhbnNJRCI6Ino3ME1acnhWZXNVWW1IM1g0cTZXQXciLCJ2Z2FJZCI6IjMyNDM1MzhkZmUyMjE5ODEiLCJoYXNoU2hhcmVkU2Vzc2lvbiI6IiIsInZnYVNpZ25Jbk1ldGhvZCI6IiIsInNzb0dhbWVVc2VySWQiOiIiLCJ0ZXJyaXRvcnkiOiIiLCJpc1NTTyI6ZmFsc2V9.fpjjOFoldxKd_Y-02QFfPG92EODWOgf304D3QPADNfjLw8HyrwM5yg_i9i7XG8g6K9T85HrMD-5UAlRdcKOwGw',
    'serverID': '2',
    'userID': '3152240186565877760',
    'loginType': '9',
    'roleID': 'AL6D-BUZL-LMGG',
    'roleName': 'KAIA3R2XLQ',
    'lang': 'VI',
    'bonusInfo': 'false',
}

response = requests.post(
    'https://billing.vnggames.com/fe/api/multiitemorder/getProducts',
    cookies=cookies,
    headers=headers,
    data=data,
)
RETURN
{
    "returnCode": 1,
    "returnMessage": "Thành công",
    "returnMessage_": "SUCCESS",
    "data": {
        "products": {
            "91110035": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110035",
                "promotionID": "",
                "productName": "Gói Đồ ngủ CHIMMY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Bịt mắt CHIMMY\u003cbr /\u003e1 Đồ bộ sọc CHIMMY\u003cbr /\u003e1 D\u0026eacute;p CHIMMY\u003cbr /\u003e1 B\u0026uacute;p b\u0026ecirc; CHIMMY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110035.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 149000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 5,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111004": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111004",
                "promotionID": "",
                "productName": "Gói Dép quai hậu ORBIT hè đen",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn phối m\u0026agrave;u ORBIT (đen) \u003cbr\u003e1 Quần thun ORBIT (đen trong) \u003cbr\u003e1 D\u0026eacute;p quai hậu ORBIT phi\u0026ecirc;n bản gốc (đen) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (đen trắng) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111004.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110036": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110036",
                "promotionID": "",
                "productName": "Gói Đồ ngủ COOKY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Bịt mắt COOKY\u003cbr /\u003e1 Đồ bộ sọc COOKY\u003cbr /\u003e1 D\u0026eacute;p COOKY\u003cbr /\u003e1 B\u0026uacute;p b\u0026ecirc; COOKY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110036.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 149000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 5,
                "sellFromDate": -1,