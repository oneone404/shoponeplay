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

api lấy jtoken import requests

cookies = {
    'ah-uuid': 'b1d356fb-c115-4ddb-be0d-b4ed597c1141',
    '__gg_sdk_evtm': 'eyJjbGllbnRfaWQiOiJ2bmdnYW1lcy1zaG9wIiwidHJhY2tpbmdfc2Vzc2lvbl9pZCI6IjJjMDE2ZjE3LTFlNDgtNDZlOC1hZjM2LTdjYzQ5NWNjMDM3MiIsImRvbWFpbiI6Imh0dHBzOi8vc2hvcC52bmdnYW1lcy5jb20vdm4vZ2FtZS9wdGd2biJ9',
}

headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-GB;q=0.8,en;q=0.7,fr-FR;q=0.6,fr;q=0.5,en-US;q=0.4',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Origin': 'https://shop.vnggames.com',
    'Pragma': 'no-cache',
    'Referer': 'https://shop.vnggames.com/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36',
    'sec-ch-ua': '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    # 'Cookie': 'ah-uuid=b1d356fb-c115-4ddb-be0d-b4ed597c1141; __gg_sdk_evtm=eyJjbGllbnRfaWQiOiJ2bmdnYW1lcy1zaG9wIiwidHJhY2tpbmdfc2Vzc2lvbl9pZCI6IjJjMDE2ZjE3LTFlNDgtNDZlOC1hZjM2LTdjYzQ5NWNjMDM3MiIsImRvbWFpbiI6Imh0dHBzOi8vc2hvcC52bmdnYW1lcy5jb20vdm4vZ2FtZS9wdGd2biJ9',
}

data = {
    'platform': 'mobile',
    'clientKey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjIjoxMDY2MSwiYSI6MTA2NjEsInMiOjF9.B08-6v9oP3rNxrvImC-WBO-AN0mru77ZNLOgqosNIjA',
    'loginType': '9',
    'lang': 'VI',
    'jtoken': '',
    'userID': '',
    'roleID': 'FKAD-BUZL-LMGY',
    'roleName': 'FKAD-BUZL-LMGY',
    'serverID': '',
    'getVgaId': '1',
}

response = requests.post('https://billing.vnggames.com/fe/api/auth/quick', cookies=cookies, headers=headers, data=data)
ví dụ trả về
{
    "returnCode": 1,
    "returnMessage": "Thành công",
    "returnMessage_": "SUCCESS",
    "data": {
        "userID": "3150360999819239424",
        "loginType": "9",
        "jtoken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJNQiIsImV4cCI6MTc4NjEwMjI2MSwiYXBwSUQiOiIwaURXUXAzYmlURzVVU1dkQUJiYnp3IiwiY2xpZW50SUQiOiIwaURXUXAzYmlURzVVU1dkQUJiYnp3IiwidXNlcklEIjoiN2VMLTVEU2dya2YyYkR5MlZVeU5UbkNRSWpOOEFfNWJ4djltVGVFQ3JkcyIsImxvZ2luVHlwZSI6ImhOWVB5OXRzNVRLUHAyMUw0M2NjeGciLCJsb2dpbk1ldGhvZCI6ImNPcHVuX2JSdDZIdmpDd3pHMFRHVVEiLCJyb2xlSUQiOiJXRTNzLTZOelRtVWFQTHlsMzUtZ3RnIiwicm9sZU5hbWUiOiJzdDlDTWtUcUlTSXRRd3E0YWFZaGV3Iiwic2VydmVySUQiOiIydDBBM2FLNTA5eXU3UDkya2J1NjBBIiwic2VydmVyTmFtZSI6Ino3ME1acnhWZXNVWW1IM1g0cTZXQXciLCJ1c2VySVAiOiJ6NzBNWnJ4VmVzVVltSDNYNHE2V0F3IiwiYXBwVHJhbnNJRCI6Ino3ME1acnhWZXNVWW1IM1g0cTZXQXciLCJ2Z2FJZCI6IjMyNGY4OTFmYTRhMWI5ODEiLCJoYXNoU2hhcmVkU2Vzc2lvbiI6IiIsInZnYVNpZ25Jbk1ldGhvZCI6IiIsInNzb0dhbWVVc2VySWQiOiIiLCJ0ZXJyaXRvcnkiOiIiLCJpc1NTTyI6ZmFsc2V9.gnh3FsVBAkdDc2Tg_xJu7JJKurUm4W81uFZGPTqZp0sjPIbwQpGEM2jVXPilkc1fDiU1-fd8-GGI44kgJ06_ew",
        "serverID": "2",
        "serverName": "",
        "roleID": "FKAD-BUZL-LMGY",
        "roleName": "MapOne",
        "vgaId": "324f891fa4a1b981",
        "suggestion": {
            "userID": "3150360999819239424",
            "appID": 10661,
            "roles": []
        }
    }
}
ví dụ trả về sản phẩm
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
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111124": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111124",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Raglan Y2K ORBIT xanh navy",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o thun raglan Y2K ORBIT (xanh navy) \u003cbr\u003e1 Quần t\u0026uacute;i hộp d\u0026aacute;ng \u0026ocirc;m ORBIT (be nhạt) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 Đ\u0026aacute; Qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111124A9ZcH.png",
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
            "91111003": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111003",
                "promotionID": "",
                "productName": "Gói Dép quai hậu ORBIT hè trắng ngà",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn phối m\u0026agrave;u ORBIT (đỏ) \u003cbr\u003e1 Quần thun ORBIT (đen) \u003cbr\u003e1 D\u0026eacute;p quai hậu ORBIT phi\u0026ecirc;n bản gốc (trắng ng\u0026agrave;) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (đỏ rượu) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111003.png",
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
            "91111123": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111123",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Raglan Y2K ORBIT đỏ",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o thun raglan Y2K ORBIT (đỏ) \u003cbr\u003e1 Quần t\u0026uacute;i hộp d\u0026aacute;ng \u0026ocirc;m ORBIT (đen) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 Đ\u0026aacute; Qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111123Ogi7W.png",
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
            "91110034": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110034",
                "promotionID": "",
                "productName": "Gói Đồ ngủ RJ",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Bịt mắt RJ\u003cbr /\u003e1 Đồ bộ sọc RJ\u003cbr /\u003e1 D\u0026eacute;p RJ\u003cbr /\u003e1 B\u0026uacute;p b\u0026ecirc; RJ\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110034.png",
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
            "91111122": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111122",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Raglan Y2K ORBIT hồng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o thun raglan Y2K ORBIT (hồng) \u003cbr\u003e1 Quần t\u0026uacute;i hộp d\u0026aacute;ng \u0026ocirc;m ORBIT (hồng be) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 Đ\u0026aacute; Qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111122gKCxv.png",
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
            "91111008": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111008",
                "promotionID": "",
                "productName": "Gói Dép quai hậu ORBIT hè xám",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn phối m\u0026agrave;u ORBIT (x\u0026aacute;m) \u003cbr\u003e1 Quần thun ORBIT (trắng) \u003cbr\u003e1 D\u0026eacute;p quai hậu ORBIT phi\u0026ecirc;n bản gốc (x\u0026aacute;m) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (trắng) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m: \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111008.png",
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
            "91111129": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111129",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Raglan đường phố ORBIT xanh navy",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o thun raglan đường phố ORBIT (xanh Navy) \u003cbr\u003e1 Quần jean ống cong m\u0026oacute;c khỏa ORBIT (be nhạt) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 Đ\u0026aacute; Qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911111292ba2c.png",
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
            "91110831": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110831",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT xám đậm",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT xám đậm",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110831.png",
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
            "91110039": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110039",
                "promotionID": "",
                "productName": "Gói Đồ ngủ SHOOKY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Bịt mắt SHOOKY\u003cbr /\u003e1 Đồ bộ sọc SHOOKY\u003cbr /\u003e1 D\u0026eacute;p SHOOKY\u003cbr /\u003e1 B\u0026uacute;p b\u0026ecirc; SHOOKY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110039.png",
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
            "91111007": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111007",
                "promotionID": "",
                "productName": "Gói Dép quai hậu ORBIT hè neon",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn phối m\u0026agrave;u ORBIT (xanh l\u0026aacute;) \u003cbr\u003e1 Quần thun ORBIT (yến mạch) \u003cbr\u003e1 D\u0026eacute;p quai hậu ORBIT phi\u0026ecirc;n bản gốc (neon) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (m\u0026agrave;u be) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111007.png",
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
            "90032001": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90032001",
                "promotionID": "",
                "productName": "Bảng điểm danh Gói thẻ 30 ngày",
                "productGroup": "G4",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e \u003cbr\u003e1 K\u0026eacute;t thẻ si\u0026ecirc;u cao cấp \u003cbr\u003e5 G\u0026oacute;i thẻ VVIP \u003cbr\u003e12 G\u0026oacute;i thẻ VIP \u003cbr\u003e12 G\u0026oacute;i thẻ si\u0026ecirc;u cao cấp \u003cbr\u003e270 Đ\u0026aacute; qu\u0026yacute; \u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m: \u003cspan style\u003d\"color: rgb(185, 106, 217);\"\u003e35 đ\u0026aacute; qu\u0026yacute;\u003cbr\u003e\u003cspan style\u003d\"color: rgb(224, 62, 45);\"\u003e\u003cstrong\u003eLưu \u0026yacute;: bạn cần đăng nhập v\u0026agrave; bấm nhận mỗi ng\u0026agrave;y. G\u0026oacute;i chỉ được k\u0026iacute;ch hoạt 1 lần duy nhất.\u003c/strong\u003e\u003c/span\u003e\u003c!--EndFragment--\u003e\u0026nbsp;\u003cbr\u003e\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-sot.vcdn.vn/ws-content/uploads//PTG-ZINGPAY-1-LIVE/image/product/1301979846397792256.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 200000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 8,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91111128": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111128",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Raglan đường phố ORBIT đỏ",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o thun raglan đường phố ORBIT (đỏ) \u003cbr\u003e1 Quần jean ống cong m\u0026oacute;c khỏa ORBIT (kaki) \u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 Đ\u0026aacute; Qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111128MzOzL.png",
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
            "91110832": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110832",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT xanh hải quân",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT xanh hải quân",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110832.png",
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
            "91111006": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111006",
                "promotionID": "",
                "productName": "Gói Dép quai hậu ORBIT hè trắng xanh",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn phối m\u0026agrave;u ORBIT (trắng xanh) \u003cbr\u003e1 Quần thun ORBIT (xanh) \u003cbr\u003e1 D\u0026eacute;p quai hậu ORBIT phi\u0026ecirc;n bản gốc (xanh trắng) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (xanh trắng) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111006.png",
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
            "90032002": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90032002",
                "promotionID": "",
                "productName": "Bảng điểm danh Gói thẻ 7 ngày siêu cao cấp",
                "productGroup": "G4",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e \u003cbr\u003e2 K\u0026eacute;t thẻ si\u0026ecirc;u cao cấp \u003cbr\u003e4 K\u0026eacute;t thẻ cao cấp \u003cbr\u003e2 K\u0026eacute;t thẻ thường \u003cbr\u003e600 Đ\u0026aacute; qu\u0026yacute; \u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m: \u003cspan style\u003d\"color: rgb(185, 106, 217);\"\u003e50 đ\u0026aacute; qu\u0026yacute;\u003cbr\u003e\u003cspan style\u003d\"color: rgb(224, 62, 45);\"\u003e\u003cstrong\u003eLưu \u0026yacute;: bạn cần đăng nhập v\u0026agrave; bấm nhận mỗi ng\u0026agrave;y. G\u0026oacute;i chỉ được k\u0026iacute;ch hoạt 1 lần duy nhất.\u003c/strong\u003e\u003c/span\u003e\u003c!--EndFragment--\u003e\u0026nbsp;\u003cbr\u003e\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-sot.vcdn.vn/ws-content/uploads//PTG-ZINGPAY-1-LIVE/image/product/1301980029802123264.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 400000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 10,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91111127": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111127",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Raglan đường phố ORBIT kaki",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o thun raglan đường phố ORBIT (kaki) \u003cbr\u003e1 Quần jean ống cong m\u0026oacute;c khỏa ORBIT ( m\u0026agrave;u be )\u003c/p\u003e\n\u003cp\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 Đ\u0026aacute; Qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111127gZv1u.png",
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
            "91110037": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110037",
                "promotionID": "",
                "productName": "Gói Đồ ngủ TATA",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Bịt mắt TATA\u003cbr /\u003e1 Đồ bộ sọc TATA\u003cbr /\u003e1 D\u0026eacute;p TATA\u003cbr /\u003e1 B\u0026uacute;p b\u0026ecirc; TATA\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110037.png",
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
            "91111005": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111005",
                "promotionID": "",
                "productName": "Gói Dép quai hậu ORBIT hè kaki cam",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn phối m\u0026agrave;u ORBIT (trắng) \u003cbr\u003e1 Quần thun ORBIT (kaki) \u003cbr\u003e1 D\u0026eacute;p quai hậu ORBIT phi\u0026ecirc;n bản gốc (cam kaki) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (trắng đen) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111005.png",
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
            "91111126": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111126",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Raglan đường phố ORBIT đen",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o thun raglan đường phố ORBIT (đen) \u003cbr\u003e1 Quần jean ống cong m\u0026oacute;c khỏa ORBIT (đen) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 Đ\u0026aacute; Qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911111266C35X.png",
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
            "91110830": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110830",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT xanh da trời",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT xanh da trời",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110830.png",
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
            "91110038": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110038",
                "promotionID": "",
                "productName": "Gói Đồ ngủ KOYA",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Bịt mắt KOYA\u003cbr /\u003e1 Đồ bộ sọc KOYA\u003cbr /\u003e1 D\u0026eacute;p KOYA\u003cbr /\u003e1 B\u0026uacute;p b\u0026ecirc; KOYA\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110038.png",
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
            "91111242": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111242",
                "promotionID": "",
                "productName": "Gói Xu nông trại #4",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e15M Xu n\u0026ocirc;ng trại\u0026nbsp;\u003cbr\u003e10 V\u0026ograve;i tưới si\u0026ecirc;u cao cấp \u003cbr\u003e10 V\u0026ograve;i tưới huyền thoại \u003cbr\u003e5 Ống ti\u0026ecirc;m [Cầu vồng] \u003cbr\u003e2 Ống ti\u0026ecirc;m [\u0026Aacute;nh v\u0026agrave;ng] \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e35 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-sot.vcdn.vn/ws-content/uploads//PTG-ZINGPAY-1-LIVE/image/product/1495047393882804224.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 200000.0,
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
            "91111121": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111121",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Raglan Y2K ORBIT đen",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o thun raglan Y2K ORBIT (đen) \u003cbr\u003e1 Quần t\u0026uacute;i hộp d\u0026aacute;ng \u0026ocirc;m ORBIT (kaki) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 Đ\u0026aacute; Qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111121BY65F.png",
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
            "91111241": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111241",
                "promotionID": "",
                "productName": "Gói Xu nông trại #3",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e7M Xu n\u0026ocirc;ng trại\u0026nbsp;\u003cbr\u003e5 V\u0026ograve;i tưới si\u0026ecirc;u cao cấp\u003cbr\u003e5 V\u0026ograve;i tưới huyền thoại\u003cbr\u003e2 Ống ti\u0026ecirc;m [Cầu vồng]\u003cbr\u003e1 Ống ti\u0026ecirc;m [\u0026Aacute;nh v\u0026agrave;ng]\u0026nbsp;\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e20 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-sot.vcdn.vn/ws-content/uploads//PTG-ZINGPAY-1-LIVE/image/product/1495047256573874176.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
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
            "91111240": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111240",
                "promotionID": "",
                "productName": "Gói Xu nông trại #2",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e3M Xu n\u0026ocirc;ng trại\u0026nbsp;\u003cbr\u003e10 V\u0026ograve;i tưới si\u0026ecirc;u cao cấp\u003cbr\u003e1 Ống ti\u0026ecirc;m [Cầu vồng] \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e10 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-sot.vcdn.vn/ws-content/uploads//PTG-ZINGPAY-1-LIVE/image/product/1495047117033574400.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
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
            "91110824": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110824",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT hồ trăn",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT hồ trăn",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110824.png",
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
            "91110825": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110825",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT màu ô liu",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT màu ô liu",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110825.png",
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
            "91110822": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110822",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT trắng",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT trắng",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110822.png",
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
            "91100230": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100230",
                "promotionID": "",
                "productName": "Gói Bốc Thăm Theo Chủ Đề",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003c/p\u003e\r\r\r\n\u003cp\u003e5 V\u0026eacute; bốc thăm chủ đề\u003cbr /\u003e15 Đ\u0026aacute; qu\u0026yacute;\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eTặng th\u0026ecirc;m:\u003c/span\u003e \u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold; color: #ff00ff;\"\u003e10 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100230.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110823": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110823",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT vàng nhạt",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT vàng nhạt",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110823.png",
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
            "91110828": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110828",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT xám nhạt",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT xám nhạt",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110828.png",
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
            "91110829": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110829",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT xám",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT xám",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110829.png",
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
            "91110826": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110826",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT kaki",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT kaki",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110826.png",
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
            "91110827": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110827",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT xanh lá đậm",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT xanh lá đậm",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110827.png",
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
            "91110046": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110046",
                "promotionID": "",
                "productName": "Gói Cõi mộng KOYA",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ ngủ KOYA\u003cbr /\u003e1 \u0026Aacute;o Raglan KOYA\u003cbr /\u003e1 D\u0026eacute;p KOYA\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110046.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 99000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 6,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111014": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111014",
                "promotionID": "",
                "productName": "Gói Dép quai hậu ORBIT hè vàng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e \u003cbr\u003e1 \u0026Aacute;o tay ngắn phối m\u0026agrave;u ORBIT (v\u0026agrave;ng) \u003cbr\u003e1 Quần thun ORBIT (n\u0026acirc;u) \u003cbr\u003e1 D\u0026eacute;p quai hậu ORBIT phi\u0026ecirc;n bản gốc (v\u0026agrave;ng) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (v\u0026agrave;ng) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111014.png",
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
            "91110047": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110047",
                "promotionID": "",
                "productName": "Gói Cõi mộng SHOOKY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ ngủ SHOOKY\u003cbr /\u003e1 \u0026Aacute;o Raglan SHOOKY\u003cbr /\u003e1 D\u0026eacute;p SHOOKY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110047.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 99000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 6,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111013": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111013",
                "promotionID": "",
                "productName": "Gói Dép quai hậu ORBIT hè xám nhạt",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn phối m\u0026agrave;u ORBIT (xanh) \u003cbr\u003e1 Quần thun ORBIT (x\u0026aacute;m) \u003cbr\u003e1 D\u0026eacute;p quai hậu ORBIT phi\u0026ecirc;n bản gốc (x\u0026aacute;m nhạt) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (xanh đỏ) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111013.png",
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
            "91110044": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110044",
                "promotionID": "",
                "productName": "Gói Cõi mộng COOKY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ ngủ COOKY\u003cbr /\u003e1 \u0026Aacute;o Raglan COOKY\u003cbr /\u003e1 D\u0026eacute;p COOKY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110044.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 99000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 6,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111012": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111012",
                "promotionID": "",
                "productName": "Gói Dép quai hậu ORBIT hè xanh navy",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn phối m\u0026agrave;u ORBIT (xanh navy) \u003cbr\u003e1 Quần thun ORBIT (x\u0026aacute;m đậm) \u003cbr\u003e1 D\u0026eacute;p quai hậu ORBIT phi\u0026ecirc;n bản gốc (xanh navy) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (x\u0026aacute;m đậm) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m: \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111012.png",
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
            "91110045": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110045",
                "promotionID": "",
                "productName": "Gói Cõi mộng TATA",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ ngủ TATA\u003cbr /\u003e1 \u0026Aacute;o Raglan TATA\u003cbr /\u003e1 D\u0026eacute;p TATA\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110045.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 99000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 6,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110842": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110842",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT đỏ",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT đỏ",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110842.png",
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
            "91110963": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110963",
                "promotionID": "",
                "productName": "Gói Sư Tử Đỏ",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 V\u0026ograve;ng lửa đỏ\u003cbr\u003e1 T\u0026oacute;c Sư Tử đỏ\u003cbr\u003e1 Mặt Sư Tử đỏ\u003cbr\u003e1 Dấu ấn Sư Tử đỏ\u003cbr\u003e1 Sukajan Sư Tử đỏ\u003cbr\u003e1 Denim cam th\u0026ecirc;u sao\u003cbr\u003e1 Gi\u0026agrave;y thể thao Dash Point\u003cbr\u003e1 Đu\u0026ocirc;i Sư Tử đỏ\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : 15 đ\u0026aacute; qu\u0026yacute;\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110963.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91111019": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111019",
                "promotionID": "",
                "productName": "Gói Ủng đi mưa mùa hè ORBIT xám nhạt",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e \u003cbr\u003e1 \u0026Aacute;o s\u0026aacute;t n\u0026aacute;ch c\u0026oacute; n\u0026uacute;t ORBIT (x\u0026aacute;m) \u003cbr\u003e1 Quần c\u0026aacute; heo ORBIT (x\u0026aacute;m) \u003cbr\u003e1 Ủng đi mưa ORBIT phi\u0026ecirc;n bản gốc (x\u0026aacute;m nhạt) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (x\u0026aacute;m) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111019.png",
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
            "91111018": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111018",
                "promotionID": "",
                "productName": "Gói Ủng đi mưa mùa hè ORBIT trắng ngà",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o s\u0026aacute;t n\u0026aacute;ch c\u0026oacute; n\u0026uacute;t ORBIT (yến mạch) \u003cbr\u003e1 Quần c\u0026aacute; heo ORBIT (yến mạch) \u003cbr\u003e1 Ủng đi mưa ORBIT phi\u0026ecirc;n bản gốc (trắng ng\u0026agrave;) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (yến mạch) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111018.png",
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
            "91110048": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110048",
                "promotionID": "",
                "productName": "Gói Cõi mộng MANG",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ ngủ MANG\u003cbr /\u003e1 \u0026Aacute;o Raglan MANG\u003cbr /\u003e1 D\u0026eacute;p MANG\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110048.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 99000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 6,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110840": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110840",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT nâu đậm",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT nâu đậm",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110840.png",
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
            "91111259": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111259",
                "promotionID": "",
                "productName": "Gói Song Ngư tình cảm",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 V\u0026ograve;ng quỹ đạo c\u0026aacute;\u003cbr\u003e1 T\u0026oacute;c gợn s\u0026oacute;ng uốn lượn\u003cbr\u003e1 Mặt \u0026aacute;nh sao mơ m\u0026agrave;ng\u003cbr\u003e1 Đầm vảy cực quang\u003cbr\u003e1 Sandal c\u0026oacute; quai m\u0026agrave;u nước\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111259RFWWH.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91111017": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111017",
                "promotionID": "",
                "productName": "Gói Ủng đi mưa mùa hè ORBIT đen",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e\u0026Aacute;o s\u0026aacute;t n\u0026aacute;ch c\u0026oacute; n\u0026uacute;t ORBIT (đen) \u003cbr\u003eQuần c\u0026aacute; heo ORBIT (đen) \u003cbr\u003eỦng đi mưa ORBIT phi\u0026ecirc;n bản gốc (đen) \u003cbr\u003e\u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (đen) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111017.png",
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
            "91110841": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110841",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT đỏ rượu",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT đỏ rượu",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110841.png",
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
            "91111258": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111258",
                "promotionID": "",
                "productName": "Gói Song Ngư tốt bụng",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u0026nbsp;\u003c/strong\u003e\u003cbr\u003e1 Vương miện s\u0026oacute;ng \u0026ecirc;m đềm\u003cbr\u003e1 T\u0026oacute;c buộc đu\u0026ocirc;i gợn s\u0026oacute;ng\u003cbr\u003e1 Mặt \u0026aacute;nh sao dịu d\u0026agrave;ng\u003cbr\u003e1 Đồ bơi ra khơi cực quang\u003cbr\u003e1 Gi\u0026agrave;y thể thao m\u0026agrave;u nước\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/9111125802I6r.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110962": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110962",
                "promotionID": "",
                "productName": "Gói Sư Tử Xanh",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 V\u0026ograve;ng lửa xanh\u003cbr\u003e1 T\u0026oacute;c sư tử xanh\u003cbr\u003e1 Mặt sư tử xanh\u003cbr\u003e1 Dấu ấn sư tử xanh\u003cbr\u003e1 Sukajan sư tử xanh\u003cbr\u003e1 Denim xanh th\u0026ecirc;u sao\u003cbr\u003e1 Gi\u0026agrave;y thể thao điểm nhấn sao\u003cbr\u003e1 Đu\u0026ocirc;i sư tử xanh\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110962.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91111016": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111016",
                "promotionID": "",
                "productName": "Gói Ủng đi mưa mùa hè ORBIT trắng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e\u0026Aacute;o s\u0026aacute;t n\u0026aacute;ch c\u0026oacute; n\u0026uacute;t ORBIT (trắng) \u003cbr\u003eQuần c\u0026aacute; heo ORBIT (xanh) \u003cbr\u003eỦng đi mưa ORBIT phi\u0026ecirc;n bản gốc (trắng) \u003cbr\u003e\u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (xanh) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111016.png",
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
            "91110160": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110160",
                "promotionID": "",
                "productName": "Gói Lớp Học Brown",
                "productGroup": "G6",
                "description": "\u003cdiv\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Mũ lớp học BROWN\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Đầm lớp học BROWN\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Gi\u0026agrave;y bệt BROWN (đen)\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Mic BROWN\u003c/div\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110160.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 149000.0,
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
            "91111011": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111011",
                "promotionID": "",
                "productName": "Gói Dép quai hậu ORBIT hè xanh da trời",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn phối m\u0026agrave;u ORBIT (xanh da trời) \u003cbr\u003e1 Quần thun ORBIT (trắng ng\u0026agrave;) \u003cbr\u003e1 D\u0026eacute;p quai hậu ORBIT phi\u0026ecirc;n bản gốc (xanh da trời) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (trắng ng\u0026agrave;) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111011.png",
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
            "91110042": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110042",
                "promotionID": "",
                "productName": "Gói Cõi mộng RJ",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ ngủ RJ\u003cbr /\u003e1 \u0026Aacute;o Raglan RJ\u003cbr /\u003e1 D\u0026eacute;p RJ\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110042.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 99000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 6,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111010": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111010",
                "promotionID": "",
                "productName": "Gói Dép quai hậu ORBIT hè đỏ đen",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn phối m\u0026agrave;u ORBIT (kaki) \u003cbr\u003e1 Quần thun ORBIT (đỏ) \u003cbr\u003e1 D\u0026eacute;p quai hậu ORBIT phi\u0026ecirc;n bản gốc (đỏ đen) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (đỏ) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111010.png",
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
            "91110043": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110043",
                "promotionID": "",
                "productName": "Gói Cõi mộng CHIMMY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ ngủ CHIMMY\u003cbr /\u003e1 \u0026Aacute;o Raglan CHIMMY\u003cbr /\u003e1 D\u0026eacute;p CHIMMY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110043.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 99000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 6,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110161": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110161",
                "promotionID": "",
                "productName": "Gói Lớp Học Sally",
                "productGroup": "G6",
                "description": "\u003cdiv\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Mũ lớp học SALLY\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Đầm lớp học SALLY\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Gi\u0026agrave;y bệt BROWN (n\u0026acirc;u)\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 B\u0026uacute;a hơi BROWN\u003c/div\u003e\r\r\r\n\u003cdiv\u003e\u0026nbsp;\u003c/div\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110161.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 149000.0,
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
            "91110040": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110040",
                "promotionID": "",
                "productName": "Gói Đồ ngủ MANG",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Bịt mắt MANG\u003cbr /\u003e1 Đồ bộ sọc MANG\u003cbr /\u003e1 D\u0026eacute;p MANG\u003cbr /\u003e1 B\u0026uacute;p b\u0026ecirc; MANG\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110040.png",
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
            "91100248": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100248",
                "promotionID": "",
                "productName": "Thuyền thiên nga CeREELs",
                "productGroup": "G8",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Thuyền thi\u0026ecirc;n nga CeREELs\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100248.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 4,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91100249": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100249",
                "promotionID": "",
                "productName": "Gói Cần câu CeREELs Bird",
                "productGroup": "G8",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Cần c\u0026acirc;u CeREELs Bird\u003cbr /\u003e25 Đ\u0026aacute; Qu\u0026yacute;\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100249.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 79000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110835": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110835",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT trắng ngà",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT trắng ngà",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110835.png",
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
            "91110836": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110836",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT yến mạch",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT yến mạch",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110836.png",
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
            "91110833": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110833",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT xanh đậm",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT xanh đậm",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110833.png",
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
            "91111009": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111009",
                "promotionID": "",
                "productName": "Gói Dép quai hậu ORBIT hè hồng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn phối m\u0026agrave;u ORBIT (hồng) \u003cbr\u003e1 Quần thun ORBIT (n\u0026acirc;u hồng) \u003cbr\u003e1 D\u0026eacute;p quai hậu ORBIT phi\u0026ecirc;n bản gốc (hồng) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (hồng) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111009.png",
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
            "91110834": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110834",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT đen",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT đen",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110834.png",
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
            "91110839": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110839",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT nâu",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT nâu",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110839.png",
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
            "91110837": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110837",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT màu be",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT màu be",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110837.png",
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
            "91110958": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110958",
                "promotionID": "",
                "productName": "PlayBoo V2",
                "productGroup": "G3",
                "description": "PlayBoo V2",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110958.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
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
            "91110838": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110838",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT màu be đậm",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT màu be đậm",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110838.png",
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
            "91110959": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110959",
                "promotionID": "",
                "productName": "PlayBoo V2 (10 lần)",
                "productGroup": "G3",
                "description": "PlayBoo V2 (10 lần)",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110959.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 540000.0,
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
            "91111026": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111026",
                "promotionID": "",
                "productName": "Gói Ủng đi mưa mùa hè ORBIT hồng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o s\u0026aacute;t n\u0026aacute;ch c\u0026oacute; n\u0026uacute;t ORBIT (hồng) \u003cbr\u003e1 Quần c\u0026aacute; heo ORBIT (hồng) \u003cbr\u003e1 Ủng đi mưa ORBIT phi\u0026ecirc;n bản gốc (hồng) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (hồng nhạt) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111026.png",
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
            "91110970": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110970",
                "promotionID": "",
                "productName": "Gói Cardigan hè ORBIT đen",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Cardigan cổ V ORBIT (đen) \u003cbr\u003e1 Quần chữ A Orbit (kaki) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110970.png",
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
            "91111025": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111025",
                "promotionID": "",
                "productName": "Gói Ủng đi mưa mùa hè ORBIT oải hương",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o s\u0026aacute;t n\u0026aacute;ch c\u0026oacute; n\u0026uacute;t ORBIT (oải hương) \u003cbr\u003e1 Quần c\u0026aacute; heo ORBIT (oải hương) \u003cbr\u003e1 Ủng đi mưa ORBIT phi\u0026ecirc;n bản gốc (oải hương) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (oải hương) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111025.png",
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
            "91110971": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110971",
                "promotionID": "",
                "productName": "Gói Cardigan hè ORBIT sô cô la",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Cardigan cổ V ORBIT (Socola) \u003cbr\u003e1 Quần chữ A Orbit (n\u0026acirc;u) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110971.png",
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
            "91600321": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91600321",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Techwear xanh neon KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003c!--StartFragment--\u003e\u003c!-- x-tinymce/html --\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr\u003e1 Khoắc jumper tech xanh neon\u003cbr\u003e1 T\u0026oacute;c cột hush cut sư tử\u003cbr\u003e1 K\u0026iacute;nh bảo hộ xanh neon\u003cbr\u003e1 Quần techwear xanh neon\u003cbr\u003e1 Gi\u0026agrave;y cao cổ xanh neon\u003c/p\u003e\n\u003cp\u003e\u003c!--EndFragment--\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91600321.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91111024": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111024",
                "promotionID": "",
                "productName": "Gói Ủng đi mưa mùa hè ORBIT xanh da trời",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o s\u0026aacute;t n\u0026aacute;ch c\u0026oacute; n\u0026uacute;t ORBIT (xanh da trời) \u003cbr\u003e1 Quần c\u0026aacute; heo ORBIT (x\u0026aacute;m nhạt) \u003cbr\u003e1 Ủng đi mưa ORBIT phi\u0026ecirc;n bản gốc (xanh da trời) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (xanh da trời) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111024.png",
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
            "91111023": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111023",
                "promotionID": "",
                "productName": "Gói Ủng đi mưa mùa hè ORBIT xanh",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o s\u0026aacute;t n\u0026aacute;ch c\u0026oacute; n\u0026uacute;t ORBIT (xanh) \u003cbr\u003e1 Quần c\u0026aacute; heo ORBIT (trắng) \u003cbr\u003e1 Ủng đi mưa ORBIT phi\u0026ecirc;n bản gốc (xanh) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (trắng xanh) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111023.png",
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
            "91110974": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110974",
                "promotionID": "",
                "productName": "Gói Cardigan hè ORBIT hồng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Cardigan cổ V ORBIT (hồng) \u003cbr\u003e1 Quần chữ A Orbit (yến mạch) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110974.png",
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
            "91110975": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110975",
                "promotionID": "",
                "productName": "Gói Cardigan hè ORBIT xanh nhạt",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Cardigan cổ V ORBIT (Xanh nhạt) \u003cbr\u003e1 Quần chữ A Orbit (trắng) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110975.png",
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
            "91110972": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110972",
                "promotionID": "",
                "productName": "Gói Cardigan hè ORBIT trắng ngà",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Cardigan cổ V ORBIT (trắng ng\u0026agrave;) \u003cbr\u003e1 Quần chữ A Orbit (x\u0026aacute;m nhạt) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110972.png",
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
            "91110973": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110973",
                "promotionID": "",
                "productName": "Gói Cardigan hè ORBIT oải hương",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Cardigan cổ V ORBIT (Oải hương) \u003cbr\u003e1 Quần chữ A Orbit (caro t\u0026iacute;m) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110973.png",
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
            "91111027": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111027",
                "promotionID": "",
                "productName": "Gói Ủng đi mưa mùa hè ORBIT latte",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o s\u0026aacute;t n\u0026aacute;ch c\u0026oacute; n\u0026uacute;t ORBIT (matcha) \u003cbr\u003e1 Quần c\u0026aacute; heo ORBIT (latte) \u003cbr\u003e1 Ủng đi mưa ORBIT phi\u0026ecirc;n bản gốc (matcha) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (latte) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111027.png",
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
            "91110050": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110050",
                "promotionID": "",
                "productName": "Gói Xe điện đụng BROWN",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ bảo hiểm BROWN\u003cbr /\u003e1 Xe điện dụng BROWN\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110050.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111022": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111022",
                "promotionID": "",
                "productName": "Gói Ủng đi mưa mùa hè ORBIT vàng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o s\u0026aacute;t n\u0026aacute;ch c\u0026oacute; n\u0026uacute;t ORBIT (xanh navy) \u003cbr\u003e1 Quần c\u0026aacute; heo ORBIT (x\u0026aacute;m lạnh) \u003cbr\u003e1 Ủng đi mưa ORBIT phi\u0026ecirc;n bản gốc (v\u0026agrave;ng) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (v\u0026agrave;ng nhạt) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111022.png",
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
            "91111021": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111021",
                "promotionID": "",
                "productName": "Gói Ủng đi mưa mùa hè ORBIT than chì",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o s\u0026aacute;t n\u0026aacute;ch c\u0026oacute; n\u0026uacute;t ORBIT (kaki) \u003cbr\u003e1 Quần c\u0026aacute; heo ORBIT (than ch\u0026igrave;) \u003cbr\u003e1 Ủng đi mưa ORBIT phi\u0026ecirc;n bản gốc (than ch\u0026igrave;) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (kaki) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111021.png",
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
            "91111020": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111020",
                "promotionID": "",
                "productName": "Gói Ủng đi mưa mùa hè ORBIT choco bạc hà",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o s\u0026aacute;t n\u0026aacute;ch c\u0026oacute; n\u0026uacute;t ORBIT (choco bạc h\u0026agrave;) \u003cbr\u003e1 Quần c\u0026aacute; heo ORBIT (n\u0026acirc;u) \u003cbr\u003e1 Ủng đi mưa ORBIT phi\u0026ecirc;n bản gốc (x\u0026aacute;m) \u003cbr\u003e1 \u0026Ocirc; ORBIT phi\u0026ecirc;n bản gốc (choco bạc h\u0026agrave;) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111020.png",
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
            "91110051": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110051",
                "promotionID": "",
                "productName": "Gói Xe điện đụng SALLY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ bảo hiểm SALLY\u003cbr /\u003e1 Xe điện dụng SALLY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110051.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 229000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91100379": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100379",
                "promotionID": "",
                "productName": "Gói Cô gái hộp nhạc",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003c!--StartFragment--\u003e\u003c!-- x-tinymce/html --\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e \u003cbr\u003e1 T\u0026oacute;c c\u0026ocirc; g\u0026aacute;i hộp nhạc \u003cbr\u003e1 T\u0026uacute;i d\u0026acirc;y c\u0026oacute;t hộp nhạc \u003cbr\u003e1 V\u0026aacute;y x\u0026ograve;e c\u0026ocirc; g\u0026aacute;i hộp nhạc \u003cbr\u003e1 Gi\u0026agrave;y c\u0026ocirc; g\u0026aacute;i hộp nhạc \u003cbr\u003e1 Bộ m\u0026aacute;y c\u0026ocirc; g\u0026aacute;i hộp nhạc\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(234, 51, 242);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c!--EndFragment--\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100379.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 110000.0,
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
            "91110604": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110604",
                "promotionID": "",
                "productName": "Gói đá quý 1+1 3",
                "productGroup": "G1",
                "description": "\u003cp\u003eQu\u0026agrave;:\u003cbr\u003e-2300 Đ\u0026aacute; Qu\u0026yacute; \u003cbr\u003eTặng th\u0026ecirc;m: \u003cbr\u003e-150 Đ\u0026aacute; Qu\u0026yacute;\u003cbr\u003e\u0026nbsp;\u003c!--StartFragment--\u003e\u003c!-- x-tinymce/html --\u003e\u003cspan style\u003d\"color: rgb(224, 62, 45);\"\u003e\u003cstrong\u003eMỗi th\u0026aacute;ng một lần, cơ hội v\u0026agrave;ng để nhận th\u0026ecirc;m thật nhiều đ\u0026aacute; qu\u0026yacute;!!!\u003c/strong\u003e\u003c/span\u003e\u003c!--EndFragment--\u003e\u0026nbsp;\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110604.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 1000000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110605": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110605",
                "promotionID": "",
                "productName": "Gói đá quý 1+1 4",
                "productGroup": "G1",
                "description": "\u003cp\u003eQu\u0026agrave;: \u003cbr\u003e-4770 Đ\u0026aacute; Qu\u0026yacute; \u003cbr\u003eTặng th\u0026ecirc;m: \u003cbr\u003e-200 Đ\u0026aacute; Qu\u0026yacute;\u003cbr\u003e\u0026nbsp;\u003c!--StartFragment--\u003e\u003c!-- x-tinymce/html --\u003e\u003cspan style\u003d\"color: rgb(224, 62, 45);\"\u003e\u003cstrong\u003eMỗi th\u0026aacute;ng một lần, cơ hội v\u0026agrave;ng để nhận th\u0026ecirc;m thật nhiều đ\u0026aacute; qu\u0026yacute;!!!\u003c/strong\u003e\u003c/span\u003e\u003c!--EndFragment--\u003e\u0026nbsp;\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110605.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 2000000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110968": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110968",
                "promotionID": "",
                "productName": "Gói Cardigan hè ORBIT xanh navy",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Cardigan cổ V ORBIT (Xanh navy) \u003cbr\u003e1 Quần chữ A Orbit (caro đen) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110968.png",
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
            "91110602": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110602",
                "promotionID": "",
                "productName": "Gói đá quý 1+1 1",
                "productGroup": "G1",
                "description": "\u003cp\u003eQu\u0026agrave;:\u003cbr\u003e-400 Đ\u0026aacute; Qu\u0026yacute;\u003cbr\u003eTặng th\u0026ecirc;m:\u003cbr\u003e-35 Đ\u0026aacute; Qu\u0026yacute;\u003cbr\u003e\u003cspan style\u003d\"color: rgb(224, 62, 45);\"\u003e\u003cstrong\u003eMỗi th\u0026aacute;ng một lần, cơ hội v\u0026agrave;ng để nhận th\u0026ecirc;m thật nhiều đ\u0026aacute; qu\u0026yacute;!!!\u003c/strong\u003e\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110602.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 200000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110603": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110603",
                "promotionID": "",
                "productName": "Gói đá quý 1+1 2",
                "productGroup": "G1",
                "description": "\u003cp\u003eQu\u0026agrave;:\u003cbr\u003e-840 Đ\u0026aacute; Qu\u0026yacute;\u003cbr\u003eTặng th\u0026ecirc;m:\u003cbr\u003e-50 Đ\u0026aacute; Qu\u0026yacute;\u003cbr\u003e\u0026nbsp;\u003c!--StartFragment--\u003e\u003c!-- x-tinymce/html --\u003e\u003cspan style\u003d\"color: rgb(224, 62, 45);\"\u003e\u003cstrong\u003eMỗi th\u0026aacute;ng một lần, cơ hội v\u0026agrave;ng để nhận th\u0026ecirc;m thật nhiều đ\u0026aacute; qu\u0026yacute;!!!\u003c/strong\u003e\u003c/span\u003e\u003c!--EndFragment--\u003e\u0026nbsp;\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110603.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 400000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110969": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110969",
                "promotionID": "",
                "productName": "Gói Cardigan hè ORBIT đỏ",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Cardigan cổ V ORBIT (đỏ) \u003cbr\u003e1 Quần chữ A Orbit (đen) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m: \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110969.png",
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
            "91200745": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91200745",
                "promotionID": "",
                "productName": "Công viên giải trí Dreaming KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 Ngựa gỗ Dreamland ảo mộng\u003cbr /\u003e1 Mũ gấu \u0026aacute;nh sao\u003cbr /\u003e1 T\u0026oacute;c hai đu\u0026ocirc;i kẹo b\u0026ocirc;ng m\u0026acirc;y\u003cbr /\u003e1 Mặt đ\u0026ocirc;i mắt huyền b\u0026iacute;\u003cbr /\u003e1 M\u0026aacute; hồng ửng đỏ\u003cbr /\u003e1 Đầm diễu h\u0026agrave;nh mộng mơ\u003cbr /\u003e1 Gi\u0026agrave;y Mary Jane đỏ\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/9120074547PRm.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110981": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110981",
                "promotionID": "",
                "productName": "Gói Áo tay ngắn hè ORBIT trắng ngà",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn form rộng ORBIT (trắng ng\u0026agrave;) \u003cbr\u003e1 Quần Bermuda ORBIT (x\u0026aacute;m) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110981.png",
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
            "91110982": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110982",
                "promotionID": "",
                "productName": "Gói Áo tay ngắn hè ORBIT màu hồ trăn",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn form rộng ORBIT (hồ trăn) \u003cbr\u003e1 Quần Bermuda ORBIT denim nhạt) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m: \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110982.png",
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
            "91110980": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110980",
                "promotionID": "",
                "productName": "Gói Áo tay ngắn hè ORBIT trắng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn form rộng ORBIT (trắng) \u003cbr\u003e1 Quần Bermuda ORBIT (denim trung t\u0026iacute;nh) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110980.png",
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
            "91110985": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110985",
                "promotionID": "",
                "productName": "Gói Áo tay ngắn hè ORBIT raglan xanh navy",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn form rộng ORBIT (raglan xanh navy) \u003cbr\u003e1 Quần Bermuda ORBIT (x\u0026aacute;m bạc m\u0026agrave;u) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110985.png",
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
            "91110986": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110986",
                "promotionID": "",
                "productName": "Gói Áo tay ngắn hè ORBIT raglan đen",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn form rộng ORBIT (raglan đen) \u003cbr\u003e1 Quần Bermuda ORBIT (đen) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110986.png",
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
            "91110983": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110983",
                "promotionID": "",
                "productName": "Gói Áo tay ngắn hè ORBIT xanh navy",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn form rộng ORBIT (xanh navy) \u003cbr\u003e1 Quần Bermuda ORBIT (trắng) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110983.png",
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
            "91110984": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110984",
                "promotionID": "",
                "productName": "Gói Áo tay ngắn hè ORBIT oải hương",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn form rộng ORBIT (oải hương) \u003cbr\u003e1 Quần Bermuda ORBIT (đen bạc m\u0026agrave;u) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110984.png",
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
            "91111150": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111150",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Nhân Mã đầy thử thách",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u0026nbsp;\u003c/strong\u003e\u003cbr\u003e1 T\u0026oacute;c rẽ ng\u0026ocirc;i b\u0026uacute;i nửa đầu\u003cbr\u003e1 Mặt thợ săn lửa\u003cbr\u003e1 Khuy\u0026ecirc;n tai x\u0026iacute;ch sắt\u003cbr\u003e1 \u0026Aacute;o kho\u0026aacute;c da thợ săn\u003cbr\u003e1 Quần xắn gấu lửa đen\u003cbr\u003e1 Gi\u0026agrave;y sắt đen\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-sot.vcdn.vn/ws-content/uploads//PTG-ZINGPAY-1-LIVE/image/product/1461997631638212608.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110062": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110062",
                "promotionID": "",
                "productName": "Gói Đầu bếp CONY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Tạp dề đầu bếp CONY\u003cbr /\u003e1 Mũ đầu bếp CONY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110062.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 99000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 4,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91600339": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91600339",
                "promotionID": "",
                "productName": "Thiên nga đen KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e \u003cbr\u003e1 T\u0026oacute;c thanh lịch thi\u0026ecirc;n nga đen \u003cbr\u003e1 B\u0026ocirc;ng tai đ\u0026aacute; qu\u0026yacute; đen \u003cbr\u003e1 Mặt thi\u0026ecirc;n nga đen \u003cbr\u003e1 Đầm thanh lịch thi\u0026ecirc;n nga đen \u003cbr\u003e1 Gi\u0026agrave;y đế bằng thi\u0026ecirc;n nga đen\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91600339.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110063": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110063",
                "promotionID": "",
                "productName": "Gói Đầu bếp CHOCO",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Tạp dề đầu bếp CHOCO\u003cbr /\u003e1 Mũ đầu bếp CHOCO\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110063.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 99000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 4,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111151": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111151",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Nhân Mã tự do",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 T\u0026oacute;c rẽ ng\u0026ocirc;i lửa\u003cbr\u003e1 Băng đ\u0026ocirc; thợ săn đen\u003cbr\u003e1 Mặt thợ săn mắt hai m\u0026agrave;u\u003cbr\u003e1 Xỏ khuy\u0026ecirc;n sắt một b\u0026ecirc;n\u003cbr\u003e1 \u0026Aacute;o kho\u0026aacute;c da nhật thực\u003cbr\u003e1 Quần jogger lửa đen\u003cbr\u003e1 Gi\u0026agrave;y sắt trắng\u0026nbsp;\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-sot.vcdn.vn/ws-content/uploads//PTG-ZINGPAY-1-LIVE/image/product/1461997834818686976.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91100148": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100148",
                "promotionID": "",
                "productName": "Nội Thất Mẫu Giáo",
                "productGroup": "G6",
                "description": "\u003cdiv\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Ghế bập b\u0026ecirc;nh BROWN\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Ghế bập b\u0026ecirc;nh SALLY\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Bảng th\u0026ocirc;ng b\u0026aacute;o BROWN and SALLY\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 B\u0026agrave;n trẻ em BROWN\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Ghế trẻ em BROWN\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 B\u0026agrave;n trẻ em CONY\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Ghế trẻ em CONY\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Tủ gi\u0026aacute;o cụ những người bạn BROWN\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Tủ s\u0026aacute;ch trẻ em SALLY\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Cột n\u0026eacute;m v\u0026ograve;ng SALLY\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Hộp b\u0026uacute;t ch\u0026igrave; m\u0026agrave;u BROWN\u003c/div\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100148.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "92110040": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "92110040",
                "promotionID": "",
                "productName": "Thành viên Plus (7 Ngày)",
                "productGroup": "G4",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr /\u003e_T\u0026ecirc;n m\u0026agrave;u t\u0026iacute;m cực ngầu\u003cbr /\u003e_Phần thưởng nhiệm vụ x3\u003cbr /\u003e_Nhận ngay điểm Vương miện miễn ph\u0026iacute;\u003cbr /\u003e_Nhận ngay phần thưởng miễn ph\u0026iacute;\u003cbr /\u003e_Miễn ph\u0026iacute; \"\"Ho\u0026agrave;n th\u0026agrave;nh ngay\"\" nhiệm vụ hằng ng\u0026agrave;y\u003cbr /\u003e_Miễn ph\u0026iacute; bốc thăm hộp quảng c\u0026aacute;o\u003cbr /\u003e_C\u0026oacute; thể thu hoạch đồng loạt ở My Farm\u003cbr /\u003e_Số lần c\u0026acirc;u c\u0026aacute; kh\u0026ocirc;ng giới hạn\u003cbr /\u003e_C\u0026oacute; thể sử dụng th\u0026ecirc;m 1 bẫy c\u0026aacute; nữa\u003cbr /\u003e_Giảm giờ ph\u0026aacute;t triển chậu c\u0026acirc;y\u003cbr /\u003e_Giảm giờ ph\u0026aacute;t triển th\u0026uacute; cưng\u003cbr /\u003e_Giảm thời gian nhận nu\u0026ocirc;i minime\u003cbr /\u003e_C\u0026oacute; thể sử dụng Roulette hằng ng\u0026agrave;y th\u0026ecirc;m một lần nữa\u003cbr /\u003e_Giải quyết nhu cầu ngay lập tức 3 lần mỗi ng\u0026agrave;y\u003cbr /\u003e_Nhảy v\u0026ograve;ng Vượt chướng ngại vật\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/92110040fh2bE.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 20000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91100387": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100387",
                "promotionID": "",
                "productName": "Gói Vật thí nghiệm 03",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003c!--StartFragment--\u003e\u003c!-- x-tinymce/html --\u003e\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 T\u0026oacute;c rối\u003cbr\u003e1 Mặt trống rỗng\u003cbr\u003e1 M\u0026atilde; vạch số hiệu\u003cbr\u003e1 \u0026Aacute;o th\u0026iacute; nghiệm tả tơi\u003cbr\u003e1 Quần m\u0026atilde; vạch nhận dạng\u003cbr\u003e1 Thẻ theo d\u0026otilde;i vật th\u0026iacute; nghiệm\u003c/p\u003e\n\u003cp\u003e\u003c!--EndFragment--\u003e \u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(234, 51, 242);\"\u003e20 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100387.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
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
            "91110979": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110979",
                "promotionID": "",
                "productName": "Gói Áo tay ngắn hè ORBIT đen",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn form rộng ORBIT (đen) \u003cbr\u003e1 Quần Bermuda ORBIT (denim đen) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110979.png",
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
            "91110976": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110976",
                "promotionID": "",
                "productName": "Gói Cardigan hè ORBIT màu chanh",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Cardigan cổ V ORBIT (m\u0026agrave;u chanh) \u003cbr\u003e1 Quần chữ A Orbit (xanh navy) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110976.png",
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
            "91110977": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110977",
                "promotionID": "",
                "productName": "Gói Cardigan hè ORBIT dâu tây",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Cardigan cổ V ORBIT (d\u0026acirc;u t\u0026acirc;y) \u003cbr\u003e1 Quần chữ A Orbit (xanh da trời) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110977.png",
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
            "91200755": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91200755",
                "promotionID": "",
                "productName": "Quy tắc công chúa nổi loạn KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 Đồ buộc t\u0026oacute;c nơ b\u0026aacute;o\u003cbr /\u003e1 T\u0026oacute;c rẽ ng\u0026ocirc;i c\u0026ocirc;ng ch\u0026uacute;a\u003cbr /\u003e1 Mặt c\u0026ocirc;ng ch\u0026uacute;a lung linh\u003cbr /\u003e1 B\u0026ocirc;ng tai tim mềm mại\u003cbr /\u003e1 Hoodie d\u0026acirc;y k\u0026eacute;o Go-go Girls\u003cbr /\u003e1 V\u0026aacute;y thắt lưng tim\u003cbr /\u003e1 Gi\u0026agrave;y b\u0026aacute;o hồng\u003cbr /\u003e1 M\u0026agrave;u da Vanilla ấm\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/912007559ZoGm.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
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
            "91110354": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110354",
                "promotionID": "",
                "productName": "Gói Guitar bass Shu-Shu",
                "productGroup": "G8",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mặt nạ Shu-Shu\u003cbr /\u003e1 Guitar bass Shu-Shu\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110354.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 49000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91200319": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91200319",
                "promotionID": "",
                "productName": "Bạch kim xinh trai KM",
                "productGroup": "G5",
                "description": "Bạch kim xinh trai KM",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91200319.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91111202": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111202",
                "promotionID": "",
                "productName": "Gói Len form rộng ORBIT nâu đậm",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 Mũ trooper gấu b\u0026ocirc;ng ORBIT (n\u0026acirc;u đậm)\u003cbr\u003e1 \u0026Aacute;o len cổ V Argyle ORBIT (n\u0026acirc;u đậm)\u003cbr\u003e1 Quần len sọc ORBIT (n\u0026acirc;u đậm)\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m: \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111202Mg2vV.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": -1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110355": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110355",
                "promotionID": "",
                "productName": "Gói Trống Gloop and Glop",
                "productGroup": "G8",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mặt nạ Gloop \u0026amp; Glop\u003cbr /\u003e1 Trống Gloop \u0026amp; Glop\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110355.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 79000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111201": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111201",
                "promotionID": "",
                "productName": "Gói Len form rộng ORBIT 3+1",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e4 Mũ trooper len ORBIT ( đen, trắng, n\u0026acirc;u đậm, n\u0026acirc;u lạc đ\u0026agrave;)\u003cbr\u003e4 \u0026Aacute;o len cổ V Argyle ORBIT ( xanh navy, hồng baby, n\u0026acirc;u đậm, m\u0026agrave;u be)\u003cbr\u003e4 Quần len sọc ORBIT ( xanh navy, x\u0026aacute;m nhạt, n\u0026acirc;u đậm, n\u0026acirc;u)\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911112012FCP5.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 110000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": -1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110352": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110352",
                "promotionID": "",
                "productName": "Gói Ca sĩ Halley",
                "productGroup": "G8",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mặt nạ Halley\u003cbr /\u003e1 Mic Halley\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110352.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 49000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110353": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110353",
                "promotionID": "",
                "productName": "Gói Đàn phím Borgon",
                "productGroup": "G8",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mặt nạ Borgon\u003cbr /\u003e1 Đ\u0026agrave;n ph\u0026iacute;m Borgon\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110353.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 79000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110116": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110116",
                "promotionID": "",
                "productName": "Kỳ nghỉ hè của CHILLI",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 V\u0026aacute;n lướt s\u0026oacute;ng [CHILLI]\u003cbr /\u003e1 Cần c\u0026acirc;u đ\u0026aacute; qu\u0026yacute; [CHILLI]\u003cbr /\u003e1 Balo nh\u0026acirc;n vật [CHILLI]\u003cbr /\u003e1 Mũ nh\u0026acirc;n vật [CHILLI]\u003cbr /\u003e1 \u0026Aacute;o thun logo [CHILLI]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110116.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 179000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 8,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110237": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110237",
                "promotionID": "",
                "productName": "Gói BT21 KOYA",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 [BABY] Mũ KOYA\u003cbr /\u003e1 Sticker to KOYA\u003cbr /\u003e1 Gối KOYA\u003cbr /\u003e1 \u0026Ocirc; KOYA\u003cbr /\u003e1 Đồng hồ KOYA\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110237.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111205": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111205",
                "promotionID": "",
                "productName": "Gói Len form rộng ORBIT hồng baby",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ trooper len ORBIT (trắng)\u0026nbsp;\u003cbr\u003e1 \u0026Aacute;o len cổ V Argyle ORBIT (hồng baby)\u0026nbsp;\u003cbr\u003e1 Quần len sọc ORBIT (x\u0026aacute;m nhạt)\u0026nbsp;\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m: \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111205UhCi4.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": -1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110117": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110117",
                "promotionID": "",
                "productName": "Kỳ nghỉ hè của ROMY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 V\u0026aacute;n lướt s\u0026oacute;ng [ROMY]\u003cbr /\u003e1 Cần c\u0026acirc;u đ\u0026aacute; qu\u0026yacute; [ROMY]\u003cbr /\u003e1 Balo nh\u0026acirc;n vật [ROMY]\u003cbr /\u003e1 Mũ nh\u0026acirc;n vật [ROMY]\u003cbr /\u003e1 \u0026Aacute;o thun logo [ROMY]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110117.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 179000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 8,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110238": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110238",
                "promotionID": "",
                "productName": "Gói BT21 RJ",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 [BABY] Mũ RJ\u003cbr /\u003e1 Sticker to RJ\u003cbr /\u003e1 Gối RJ\u003cbr /\u003e1 \u0026Ocirc; RJ\u003cbr /\u003e1 Đ\u0026egrave;n RJ\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110238.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111204": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111204",
                "promotionID": "",
                "productName": "Gói Len form rộng ORBIT màu be",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ trooper gấu b\u0026ocirc;ng ORBIT (n\u0026acirc;u lạc đ\u0026agrave;)\u0026nbsp;\u003cbr\u003e1 \u0026Aacute;o len cổ V Argyle ORBIT (m\u0026agrave;u be)\u0026nbsp;\u003cbr\u003e1 Quần len sọc ORBIT (n\u0026acirc;u)\u0026nbsp;\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m: \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111204hJ2oc.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": -1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111203": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111203",
                "promotionID": "",
                "productName": "Gói Len form rộng ORBIT xanh navy",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ trooper len ORBIT (đen)\u0026nbsp;\u003cbr\u003e1 \u0026Aacute;o len cổ V Argyle ORBIT (xanh navy)\u0026nbsp;\u003cbr\u003e1 Quần len sọc ORBIT (xanh navy)\u0026nbsp;\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m: \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911112034Wx7t.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": -1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91211337": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91211337",
                "promotionID": "",
                "productName": "Gói Sổ tay phối đồ thập niên 90 (Tóc-Mặt) KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 T\u0026oacute;c cắt tầng s\u0026agrave;nh điệu\u003cbr /\u003e1 Mặt nụ cười đ\u0026aacute;ng y\u0026ecirc;u\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91211337cmxk2.png",
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
            "91211338": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91211338",
                "promotionID": "",
                "productName": "Gói Kẹo mút Popping KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 Mũ lưỡi trai hồng tro\u003cbr /\u003e1 \u0026Aacute;o trễ vai sọc kẹo ngọt\u003cbr /\u003e1 Ch\u0026acirc;n v\u0026aacute;y b\u0026iacute; phồng kitsch\u003cbr /\u003e1 Gi\u0026agrave;y k\u0026egrave;m tất giữ ấm kẹo m\u0026uacute;t\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91211338e98uf.png",
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
            "91211339": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91211339",
                "promotionID": "",
                "productName": "Gói Pink Rush KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 Hoodie d\u0026acirc;y k\u0026eacute;o hot pink\u003cbr /\u003e1 Quần lấp l\u0026aacute;nh hot pink\u003cbr /\u003e1 Gi\u0026agrave;y thể thao Pink Rush\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91211339NqZXM.png",
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
            "91100676": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100676",
                "promotionID": "",
                "productName": "Nội thất Celestial",
                "productGroup": "G15",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e \u003cbr\u003e1 Cửa sổ Cosmic Space Station \u003cbr\u003e1 B\u0026agrave;n đầu giường Cosmic Space Station \u003cbr\u003e2 Thảm Cosmic Space Station \u003cbr\u003e1 Bồn tắm Cosmic Space Station \u003cbr\u003e1 B\u0026agrave;n trang điểm Cosmic Space Station \u003cbr\u003e2 Kệ ph\u0026ograve;ng tắm Cosmic Space Station \u003cbr\u003e1 B\u0026agrave;n ăn Cosmic Space Station \u003cbr\u003e2 Ghế Cosmic Space Station \u003cbr\u003e2 Kệ bếp Cosmic Space Station\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100676.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 99000.0,
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
            "91100675": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100675",
                "promotionID": "",
                "productName": "Nhà Celestial",
                "productGroup": "G15",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u0026nbsp;\u003c/strong\u003e\u003cbr\u003e1 Nh\u0026agrave; Celestial\u003cbr\u003e1 Cửa sổ Cosmic Space Station\u003cbr\u003e1 B\u0026agrave;n đầu giường Cosmic Space Station\u003cbr\u003e2 Thảm Cosmic Space Station\u003cbr\u003e1 Bồn tắm Cosmic Space Station\u003cbr\u003e1 B\u0026agrave;n trang điểm Cosmic Space Station\u003cbr\u003e2 Kệ ph\u0026ograve;ng tắm Cosmic Space Station\u003cbr\u003e1 B\u0026agrave;n ăn Cosmic Space Station\u003cbr\u003e2 Ghế Cosmic Space Station\u003cbr\u003e2 Kệ Bếp Cosmic Space Station\u003cbr\u003e1 Giấy d\u0026aacute;n tường Celestial\u003cbr\u003e1 S\u0026agrave;n Celestial\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100675.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 499000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110107": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110107",
                "promotionID": "",
                "productName": "Gói SALLY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Gối mặt SALLY\u003cbr /\u003e1 Ghế đẩu SALLY\u003cbr /\u003e1 Kệ treo tường SALLY\u003cbr /\u003e1 Kệ treo quần \u0026aacute;o SALLY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110107.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 129000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 10,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91100670": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100670",
                "promotionID": "",
                "productName": "Hoa hồng đỏ máu",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Ocirc; hoa hồng đỏ m\u0026aacute;u \u003cbr\u003e1 T\u0026oacute;c hai đu\u0026ocirc;i thấp gothic\u003cbr\u003e1 Vương miện hoa hồng đỏ m\u0026aacute;u \u003cbr\u003e1 Bịt mắt hoa hồng đỏ m\u0026aacute;u \u003cbr\u003e1 Mặt hoa hồng đỏ m\u0026aacute;u \u003cbr\u003e1 Đầm nhung đỏ m\u0026aacute;u \u003cbr\u003e1 Gi\u0026agrave;y cao g\u0026oacute;t quai đỏ m\u0026aacute;u \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(234, 51, 242);\"\u003e20 đ\u0026aacute; qu\u0026yacute;\u0026nbsp;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100670.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 130000.0,
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
            "91110108": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110108",
                "promotionID": "",
                "productName": "Gói CONY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Gối mặt CONY\u003cbr /\u003e1 Giường đơn CONY\u003cbr /\u003e1 Kệ s\u0026aacute;ch CONY\u003cbr /\u003e1 Kệ treo mũ CONY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110108.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 129000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 10,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91100550": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100550",
                "promotionID": "",
                "productName": "Gói Đặc vụ thỏ chiến binh",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e \u003cbr\u003e1 Mũ tr\u0026ugrave;m đầu thỏ \u003cbr\u003e1 Mặt đặc vụ thỏ chiến binh \u003cbr\u003e1 T\u0026oacute;c thỏ chiến binh \u003cbr\u003e1 Đồng phục thỏ chiến binh \u003cbr\u003e1 Gi\u0026agrave;y thỏ chiến binh\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100550.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91111334": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111334",
                "promotionID": "",
                "productName": "Gói Chip dữ liệu #5",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e35000 Chip dữ liệu\u003cbr /\u003e150 Đ\u0026aacute; qu\u0026yacute;\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e50 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911113345yPWE.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 300000.0,
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
            "91110123": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110123",
                "promotionID": "",
                "productName": "Kỳ nghỉ hè của YE-DEE",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 V\u0026aacute;n lướt s\u0026oacute;ng [YE-DEE]\u003cbr /\u003e1 Cần c\u0026acirc;u đ\u0026aacute; qu\u0026yacute; [YE-DEE]\u003cbr /\u003e1 Balo nh\u0026acirc;n vật [YE-DEE]\u003cbr /\u003e1 Mũ nh\u0026acirc;n vật [YE-DEE]\u003cbr /\u003e1 \u0026Aacute;o thun logo [YE-DEE]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110123.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 179000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 8,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111333": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111333",
                "promotionID": "",
                "productName": "Gói Chip dữ liệu #4",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; : \u003c/strong\u003e\u003cbr /\u003e20000 Chip dữ liệu\u003cbr /\u003e100 Đ\u0026aacute; qu\u0026yacute;\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e35 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111333vHdSm.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 200000.0,
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
            "91111212": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111212",
                "promotionID": "",
                "productName": "Gói Bảo Bình tự do",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 Mũ nồi chiffon \u0026aacute;nh nước\u003cbr\u003e1 T\u0026oacute;c buộc voan nửa đầu gợn s\u0026oacute;ng\u003cbr\u003e1 Mặt cười tự do\u003cbr\u003e1 Đầm tay phồng gợn s\u0026oacute;ng\u003cbr\u003e1 Gi\u0026agrave;y lười nơ \u0026aacute;nh nước\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u0026nbsp;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111212BV6fA.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110124": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110124",
                "promotionID": "",
                "productName": "Kỳ nghỉ hè của SOM",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 V\u0026aacute;n lướt s\u0026oacute;ng [SOM]\u003cbr /\u003e1 Cần c\u0026acirc;u đ\u0026aacute; qu\u0026yacute; [SOM]\u003cbr /\u003e1 Balo nh\u0026acirc;n vật [SOM]\u003cbr /\u003e1 Mũ nh\u0026acirc;n vật [SOM]\u003cbr /\u003e1 \u0026Aacute;o thun logo [SOM]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110124.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 179000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 8,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110245": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110245",
                "promotionID": "",
                "productName": "BROWN khổng lồ",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 BROWN khổng lồ\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110245.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 499000.0,
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
            "91111332": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111332",
                "promotionID": "",
                "productName": "Gói Chip dữ liệu #3",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e5000 Chip dữ liệu\u003cbr /\u003e50 Đ\u0026aacute; qu\u0026yacute;\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e20 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/9111133232568.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
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
            "91111211": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111211",
                "promotionID": "",
                "productName": "Gói Bảo Bình lý trí",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 Kẹp t\u0026oacute;c pha l\u0026ecirc; \u0026aacute;nh nước\u003cbr\u003e1 T\u0026oacute;c buộc nửa một b\u0026ecirc;n ng\u0026acirc;y thơ\u003cbr\u003e1 Mặt \u0026aacute;nh mắt điềm tĩnh\u003cbr\u003e1 K\u0026iacute;nh gọng \u0026aacute;nh nước\u003cbr\u003e1 Đầm ren xẻ s\u0026oacute;ng nước\u003cbr\u003e1 Gi\u0026agrave;y lười nơ \u0026aacute;nh nước\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911112117CZD3.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110121": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110121",
                "promotionID": "",
                "productName": "Kỳ nghỉ hè của LAWOO",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 V\u0026aacute;n lướt s\u0026oacute;ng [LAWOO]\u003cbr /\u003e1 Cần c\u0026acirc;u đ\u0026aacute; qu\u0026yacute; [LAWOO]\u003cbr /\u003e1 Balo nh\u0026acirc;n vật [LAWOO]\u003cbr /\u003e1 Mũ nh\u0026acirc;n vật [LAWOO]\u003cbr /\u003e1 \u0026Aacute;o thun logo [LAWOO]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110121.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 179000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 8,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110242": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110242",
                "promotionID": "",
                "productName": "Gói BT21 TATA",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 [BABY] Mũ TATA\u003cbr /\u003e1 Sticker to TATA\u003cbr /\u003e1 Gối TATA\u003cbr /\u003e1 \u0026Ocirc; TATA\u003cbr /\u003e1 Đ\u0026egrave;n chiếu TATA\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110242.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111331": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111331",
                "promotionID": "",
                "productName": "Gói Chip dữ liệu #2",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e2000 Chip dữ liệu\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111331EpdZi.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 20000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110122": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110122",
                "promotionID": "",
                "productName": "Kỳ nghỉ hè của HIKUN",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 V\u0026aacute;n lướt s\u0026oacute;ng [HIKUN]\u003cbr /\u003e1 Cần c\u0026acirc;u đ\u0026aacute; qu\u0026yacute; [HIKUN]\u003cbr /\u003e1 Balo nh\u0026acirc;n vật [HIKUN]\u003cbr /\u003e1 Mũ nh\u0026acirc;n vật [HIKUN]\u003cbr /\u003e1 \u0026Aacute;o thun logo [HIKUN]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110122.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 179000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 8,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110243": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110243",
                "promotionID": "",
                "productName": "Gói BT21 COOKY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 [BABY] Mũ COOKY\u003cbr /\u003e1 Sticker to COOKY\u003cbr /\u003e1 Gối COOKY\u003cbr /\u003e1 \u0026Ocirc; COOKY\u003cbr /\u003e1 M\u0026aacute;y đếm COOKY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110243.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110127": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110127",
                "promotionID": "",
                "productName": "Kỳ nghỉ hè của PODONG",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 V\u0026aacute;n lướt s\u0026oacute;ng [PODONG]\u003cbr /\u003e1 Cần c\u0026acirc;u đ\u0026aacute; qu\u0026yacute; [PODONG]\u003cbr /\u003e1 Balo nh\u0026acirc;n vật [PODONG]\u003cbr /\u003e1 Mũ nh\u0026acirc;n vật [PODONG]\u003cbr /\u003e1 \u0026Aacute;o thun logo [PODONG]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110127.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 179000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 8,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111217": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111217",
                "promotionID": "",
                "productName": "Gói Áo dài tay ORBIT đỏ",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ lưỡi trai k\u0026iacute;nh răm ORBIT (đường chỉ trắng) \u003cbr\u003e1 \u0026Aacute;o d\u0026agrave;i tay đường phố ORBIT (đỏ) \u003cbr\u003e1 Quần jean th\u0026ocirc; xắn gấu ORBIT (n\u0026acirc;u đậm)\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m: \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/9111121790lNq.png",
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
            "91111216": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111216",
                "promotionID": "",
                "productName": "Gói Áo dài tay ORBIT trắng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ lưỡi trai k\u0026iacute;nh r\u0026acirc;m ORBIT (trắng) \u003cbr\u003e1 \u0026Aacute;o d\u0026agrave;i tay đường phố ORBIT (trắng) \u003cbr\u003e1 Quần jean th\u0026ocirc; xắn gấu ORBIT (x\u0026aacute;m)\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111216x67t4.png",
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
            "91110246": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110246",
                "promotionID": "",
                "productName": "CHOCO khổng lồ",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 CHOCO khổng lồ\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110246.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110125": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110125",
                "promotionID": "",
                "productName": "Kỳ nghỉ hè của RURU",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 V\u0026aacute;n lướt s\u0026oacute;ng [RURU]\u003cbr /\u003e1 Cần c\u0026acirc;u đ\u0026aacute; qu\u0026yacute; [RURU]\u003cbr /\u003e1 Balo nh\u0026acirc;n vật [RURU]\u003cbr /\u003e1 Mũ nh\u0026acirc;n vật [RURU]\u003cbr /\u003e1 \u0026Aacute;o thun logo [RURU]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110125.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 179000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 8,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111215": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111215",
                "promotionID": "",
                "productName": "Gói Áo dài tay ORBIT xanh",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ lưỡi trai k\u0026iacute;nh r\u0026acirc;m ORBIT (đường chỉ xanh) \u003cbr\u003e1 \u0026Aacute;o d\u0026agrave;i tay đường phố ORBIT (xanh) \u003cbr\u003e1 Quần jean th\u0026ocirc; xắn gấu ORBIT (đen)\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111215904sA.png",
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
            "91110247": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110247",
                "promotionID": "",
                "productName": "CONY khổng lồ",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 CONY khổng lồ\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110247.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110126": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110126",
                "promotionID": "",
                "productName": "Kỳ nghỉ hè của WOOPY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 V\u0026aacute;n lướt s\u0026oacute;ng [WOOPY]\u003cbr /\u003e1 Cần c\u0026acirc;u đ\u0026aacute; qu\u0026yacute; [WOOPY]\u003cbr /\u003e1 Balo nh\u0026acirc;n vật [WOOPY]\u003cbr /\u003e1 Mũ nh\u0026acirc;n vật [WOOPY]\u003cbr /\u003e1 \u0026Aacute;o thun logo [WOOPY]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110126.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 179000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 8,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111214": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111214",
                "promotionID": "",
                "productName": "Gói Áo dài tay ORBIT đen",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ lưỡi trai k\u0026iacute;nh r\u0026acirc;m ORBIT (đường chỉ đen) \u003cbr\u003e1 \u0026Aacute;o d\u0026agrave;i tay đường phố ORBIT (đen) \u003cbr\u003e1 Quần jean th\u0026ocirc; xắn gấu ORBIT (m\u0026agrave;u ch\u0026agrave;m)\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111214GxegI.png",
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
            "91111335": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111335",
                "promotionID": "",
                "productName": "Gói Chip dữ liệu #6",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; : \u003c/strong\u003e\u003cbr /\u003e75000 Chip dữ liệu\u003cbr /\u003e250 Đ\u0026aacute; qu\u0026yacute;\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e50 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111335ebiUM.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 500000.0,
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
            "90110016": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90110016",
                "promotionID": "",
                "productName": "Vali vàng",
                "productGroup": "G1",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e\u003cspan class\u003d\"bold\" style\u003d\"color: #ff9900; font-weight: bold;\"\u003e450 Thỏi v\u0026agrave;ng\u003c/span\u003e\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"color: #ff00ff; font-weight: bold;\"\u003e200 Đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/90110016.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 1299000.0,
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
            "90110017": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90110017",
                "promotionID": "",
                "productName": "Két vàng",
                "productGroup": "G1",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e\u003cspan class\u003d\"bold\" style\u003d\"color: #ff9900; font-weight: bold;\"\u003e900 Thỏi v\u0026agrave;ng\u003c/span\u003e\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold; color: #ff00ff;\"\u003e430 Đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003cbr /\u003e\u003cbr /\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/90110017.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 2499000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 6,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110240": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110240",
                "promotionID": "",
                "productName": "Gói BT21 MANG",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 [BABY] Mũ MANG\u003cbr /\u003e1 Sticker to MANG\u003cbr /\u003e1 Gối MANG\u003cbr /\u003e1 \u0026Ocirc; MANG\u003cbr /\u003e1 Loa MANG\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110240.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "90110012": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90110012",
                "promotionID": "",
                "productName": "Thỏi vàng",
                "productGroup": "G1",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e\u003cspan class\u003d\"bold\" style\u003d\"color: #ff9900; font-weight: bold;\"\u003e18 Thỏi v\u0026agrave;ng\u003c/span\u003e\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"color: #ff00ff; font-weight: bold;\"\u003e6 Đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/90110012.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 49000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91100317": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100317",
                "promotionID": "",
                "productName": "Gói Choco Vanilla",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ m\u0026egrave;o xi\u0026ecirc;m\u003cbr /\u003e1 Đầm Choco Vanilla\u003cbr /\u003e1 Bốt m\u0026egrave;o Choco Vanilla\u003cbr /\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eTặng th\u0026ecirc;m: \u003cspan style\u003d\"color: #ff00ff;\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100317.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110120": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110120",
                "promotionID": "",
                "productName": "Kỳ nghỉ hè của MATETSU",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 V\u0026aacute;n lướt s\u0026oacute;ng [MATETSU]\u003cbr /\u003e1 Cần c\u0026acirc;u đ\u0026aacute; qu\u0026yacute; [MATETSU]\u003cbr /\u003e1 Balo nh\u0026acirc;n vật [MATETSU]\u003cbr /\u003e1 Mũ nh\u0026acirc;n vật [MATETSU]\u003cbr /\u003e1 \u0026Aacute;o thun logo [MATETSU]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110120.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 179000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 8,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110241": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110241",
                "promotionID": "",
                "productName": "Gói BT21 CHIMMY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 [BABY] Mũ CHIMMY\u003cbr /\u003e1 Sticker to CHIMMY\u003cbr /\u003e1 Gối CHIMMY\u003cbr /\u003e1 \u0026Ocirc; CHIMMY\u003cbr /\u003e1 Biển hiệu CHIMMY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110241.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "90110013": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90110013",
                "promotionID": "",
                "productName": "Vài thỏi vàng",
                "productGroup": "G1",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e\u003cspan class\u003d\"bold\" style\u003d\"color: #ff9900; font-weight: bold;\"\u003e45 Thỏi v\u0026agrave;ng\u003c/span\u003e\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold; color: #ff00ff;\"\u003e20 Đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/90110013.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 129000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "90110014": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90110014",
                "promotionID": "",
                "productName": "Chồng thỏi vàng",
                "productGroup": "G1",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e\u003cspan class\u003d\"bold\" style\u003d\"color: #ff9900; font-weight: bold;\"\u003e90 Thỏi v\u0026agrave;ng\u003c/span\u003e\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"color: #ff00ff; font-weight: bold;\"\u003e40 Đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/90110014.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "90110015": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90110015",
                "promotionID": "",
                "productName": "Hộp vàng",
                "productGroup": "G1",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e\u003cspan class\u003d\"bold\" style\u003d\"color: #ff9900; font-weight: bold;\"\u003e180 Thỏi v\u0026agrave;ng\u003c/span\u003e\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"color: #ff00ff; font-weight: bold;\"\u003e70 Đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/90110015.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 499000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 4,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91100325": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100325",
                "promotionID": "",
                "productName": "Ella Gator khổng lồ CeREELs",
                "productGroup": "G8",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Ella Gator khổng lồ\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100325.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 4,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91100326": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100326",
                "promotionID": "",
                "productName": "Ella Gator biết bay CeREELs",
                "productGroup": "G8",
                "description": "\u003cp\u003eQu\u0026agrave;:\u003cbr /\u003e1 Ella Gator biết bay\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100326.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 149000.0,
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
            "91100327": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100327",
                "promotionID": "",
                "productName": "Cuốc CeREELs Bird",
                "productGroup": "G8",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Cuốc Bird\u003cbr /\u003e25 Đ\u0026aacute; qu\u0026yacute;\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100327.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 79000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91200696": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91200696",
                "promotionID": "",
                "productName": "Sói anh đào KM",
                "productGroup": "G5",
                "description": "Nạp nhận vật phẩm theo chủ đề của gói",
                "image": "https://stc-billing.mto.zing.vn/ptg/9120069642qo8.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91200332": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91200332",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Thỏ hư hỏng KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003c!--StartFragment--\u003e\u003c!-- x-tinymce/html --\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr\u003e1 Mũ thỏ hư hỏng\u003cbr\u003e1 \u0026Aacute;o nỉ thỏ hư hỏng\u003cbr\u003e1 V\u0026aacute;y thỏ hư hỏng\u003cbr\u003e1 Gi\u0026agrave;y thỏ hư hỏng\u003c/p\u003e\n\u003cp\u003e\u003c!--EndFragment--\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91200332.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110118": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110118",
                "promotionID": "",
                "productName": "Kỳ nghỉ hè của YOCHI",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 V\u0026aacute;n lướt s\u0026oacute;ng [YOCHI]\u003cbr /\u003e1 Cần c\u0026acirc;u đ\u0026aacute; qu\u0026yacute; [YOCHI]\u003cbr /\u003e1 Balo nh\u0026acirc;n vật [YOCHI]\u003cbr /\u003e1 Mũ nh\u0026acirc;n vật [YOCHI]\u003cbr /\u003e1 \u0026Aacute;o thun logo [YOCHI]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110118.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 179000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 8,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110239": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110239",
                "promotionID": "",
                "productName": "Gói BT21 SHOOKY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 [BABY] Mũ SHOOKY\u003cbr /\u003e1 Sticker to SHOOKY\u003cbr /\u003e1 Gối SHOOKY\u003cbr /\u003e1 \u0026Ocirc; SHOOKY\u003cbr /\u003e1 Đ\u0026agrave;n synth SHOOKY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110239.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110119": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110119",
                "promotionID": "",
                "productName": "Kỳ nghỉ hè của BONBON",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 V\u0026aacute;n lướt s\u0026oacute;ng [BONBON]\u003cbr /\u003e1 Cần c\u0026acirc;u đ\u0026aacute; qu\u0026yacute; [BONBON]\u003cbr /\u003e1 Balo nh\u0026acirc;n vật [BONBON]\u003cbr /\u003e1 Mũ nh\u0026acirc;n vật [BONBON]\u003cbr /\u003e1 \u0026Aacute;o thun logo [BONBON]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110119.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 179000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 8,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "90900201": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90900201",
                "promotionID": "",
                "productName": "Mùa Nụ hôn ma cà rồng",
                "productGroup": "G4",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 Thuyền quan t\u0026agrave;i đỏ rực\u003cbr /\u003e1 T\u0026oacute;c d\u0026agrave;i Midnight\u003cbr /\u003e1 Mặt \u0026aacute;nh mắt nửa đ\u0026ecirc;m\u003cbr /\u003e1 B\u0026ocirc;ng tai th\u0026aacute;nh gi\u0026aacute; m\u0026aacute;u\u003cbr /\u003e1 \u0026Aacute;o kho\u0026aacute;c đ\u0026ecirc;m trăng tối\u003cbr /\u003e1 Bốt quai đen sẫm\u003cbr /\u003e1 B\u0026agrave;n trang điểm gothic n\u0026acirc;u\u003cbr /\u003e1 Sofa nhung đỏ \u003cbr /\u003e1 Đ\u0026egrave;n với chụp đ\u0026egrave;n gothic\u003cbr /\u003e1 Tủ \u0026aacute;o nhung đỏ crimso\u003cbr /\u003e1 Gấu b\u0026ocirc;ng nụ h\u0026ocirc;n ma c\u0026agrave; rồng\u003cbr /\u003e1 G\u0026oacute;i VIP\u003cbr /\u003e1 G\u0026oacute;i VVIP\u003cbr /\u003e1 Thẻ 4 sao\u003cbr /\u003e1 Thẻ 5 sao\u003cbr /\u003e1 Thẻ v\u0026agrave;ng\u003cbr /\u003e8000 Tiền sao\u003cbr /\u003e15 Đ\u0026aacute; qu\u0026yacute;\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/9090020123Q3F.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 110000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "90900202": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90900202",
                "promotionID": "",
                "productName": "Mùa Nụ hôn ma cà rồng VIP",
                "productGroup": "G4",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 Thuyền quan t\u0026agrave;i đỏ rực\u003cbr /\u003e1 T\u0026oacute;c d\u0026agrave;i Midnight\u003cbr /\u003e1 Mặt \u0026aacute;nh mắt nửa đ\u0026ecirc;m\u003cbr /\u003e1 B\u0026ocirc;ng tai th\u0026aacute;nh gi\u0026aacute; m\u0026aacute;u\u003cbr /\u003e1 \u0026Aacute;o kho\u0026aacute;c đ\u0026ecirc;m trăng tối\u003cbr /\u003e1 Bốt quai đen sẫm\u003cbr /\u003e1 B\u0026agrave;n trang điểm gothic n\u0026acirc;u\u003cbr /\u003e1 Sofa nhung đỏ \u003cbr /\u003e1 Đ\u0026egrave;n với chụp đ\u0026egrave;n gothic\u003cbr /\u003e1 Tủ \u0026aacute;o nhung đỏ crimso\u003cbr /\u003e1 Gấu b\u0026ocirc;ng nụ h\u0026ocirc;n ma c\u0026agrave; rồng\u003cbr /\u003e1 G\u0026oacute;i VIP\u003cbr /\u003e1 G\u0026oacute;i VVIP\u003cbr /\u003e1 Thẻ 4 sao\u003cbr /\u003e1 Thẻ 5 sao\u003cbr /\u003e1 Thẻ v\u0026agrave;ng\u003cbr /\u003e8000 Tiền sao\u003cbr /\u003e15 Đ\u0026aacute; qu\u0026yacute;\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eĐặc quyền VIP của V\u0026eacute; Play:\u003c/strong\u003e\u003cbr /\u003e- Profile M\u0026ugrave;a Nụ h\u0026ocirc;n ma c\u0026agrave; rồng\u003cbr /\u003e- Mở tức th\u0026igrave; th\u0026ecirc;m 18 cấp\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e40 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003e\u0026nbsp;\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/90900202FAz03.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 250000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91111345": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111345",
                "promotionID": "",
                "productName": "Gói Quần cạp trễ denim xanh",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 \u0026Aacute;o s\u0026aacute;t n\u0026aacute;ch croptop xanh\u003cbr /\u003e1 Quần cạp trễ denim xanh\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111345d4C5v.png",
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
            "91111103": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111103",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Hoodie bạn trai ORBIT melange",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ lưỡi trai phối m\u0026agrave;u ORBIT (đen) \u003cbr\u003e1 Hoodie k\u0026eacute;o kh\u0026oacute;a phối m\u0026agrave;u ORBIT (melange) \u003cbr\u003e1 Quần t\u0026uacute;i bộp tiện dụng ORBIT (xanh navy vintage) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111103.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110376": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110376",
                "promotionID": "",
                "productName": "Gói Du Khách Đưa Thư Jett",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 T\u0026oacute;c xoăn d\u0026agrave;y lữ kh\u0026aacute;ch\u003cbr /\u003e1 Mặt lữ kh\u0026aacute;ch lạnh l\u0026ugrave;ng\u003cbr /\u003e1 Mũ nồi lữ kh\u0026aacute;ch\u003cbr /\u003e1 Đồ quần short vest du lịch\u003cbr /\u003e1 Gi\u0026agrave;y thể thao du lịch\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eTặng th\u0026ecirc;m:\u003c/span\u003e \u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold; color: #ff00ff;\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110376.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 110000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 4,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111102": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111102",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Hoodie bạn trai ORBIT xanh navy",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ lưỡi trai phối m\u0026agrave;u ORBIT (xanh navy) \u003cbr\u003e1 Hoodie k\u0026eacute;o kh\u0026oacute;a phối m\u0026agrave;u ORBIT (xanh navy) \u003cbr\u003e1 Quần t\u0026uacute;i bộp tiện dụng ORBIT (kaki đậm) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111102.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91111343": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111343",
                "promotionID": "",
                "productName": "Gói Vũ điệu hoa sen",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 Mũ trang tr\u0026iacute; lụa hoa sen\u003cbr /\u003e1 T\u0026oacute;c b\u0026iacute;m bu\u0026ocirc;ng d\u0026agrave;i\u003cbr /\u003e1 Mặt nụ cười thanh khiết\u003cbr /\u003e1 Đầm lụa th\u0026ecirc;u hoa sen\u003cbr /\u003e1 Sandal đế xuồng nơ hồng\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e20 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/9111134389EFP.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
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
            "91111342": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111342",
                "promotionID": "",
                "productName": "Gói Vũ điệu bướm",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 Mũ trang tr\u0026iacute; lụa hồng nhạt\u003cbr /\u003e1 T\u0026oacute;c hai b\u0026iacute;m nhỏ xinh\u003cbr /\u003e1 Mặt nụ cười e thẹn\u003cbr /\u003e1 Đầm lụa họa tiết bướm\u003cbr /\u003e1 Sandal đế xuồng nơ xanh\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e20 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111342pM0kk.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
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
            "91111100": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111100",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Cần câu bọ cạp đen tối",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003eCần c\u0026acirc;u bọ cạp đen tối\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e35 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003cbr\u003e\u003cbr\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111100.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 220000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110375": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110375",
                "promotionID": "",
                "productName": "Gói Du Khách Đưa Thư Nova",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 T\u0026oacute;c hai đu\u0026ocirc;i lữ kh\u0026aacute;ch\u003cbr /\u003e1 Mặt lữ kh\u0026aacute;ch hoạt b\u0026aacute;t\u003cbr /\u003e1 Mũ mini lữ kh\u0026aacute;ch\u003cbr /\u003e1 Đầm vest du lịch\u003cbr /\u003e1 Gi\u0026agrave;y c\u0026oacute; quai du lịch\u003cbr /\u003e1 Va li vintage\u003cbr /\u003e\u003cbr /\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eTặng th\u0026ecirc;m:\u003c/span\u003e \u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold; color: #ff00ff;\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110375.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 110000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 4,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111106": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111106",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Hoodie bạn trai ORBIT hồng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ lưỡi trai phối m\u0026agrave;u ORBIT (hồng) \u003cbr\u003e1 Hoodie k\u0026eacute;o kh\u0026oacute;a phối m\u0026agrave;u ORBIT (hồng) \u003cbr\u003e1 Quần t\u0026uacute;i bộp tiện dụng ORBIT (x\u0026aacute;m đậm) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111106.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91111105": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111105",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Hoodie bạn trai ORBIT đen",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ lưỡi trai phối m\u0026agrave;u ORBIT (trắng) \u003cbr\u003e1 Hoodie k\u0026eacute;o kh\u0026oacute;a phối m\u0026agrave;u ORBIT (đen) \u003cbr\u003e1 Quần t\u0026uacute;i bộp tiện dụng ORBIT (x\u0026aacute;m) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111105.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91600364": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91600364",
                "promotionID": "",
                "productName": "Hot girl cạp trễ KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 T\u0026oacute;c xoăn tỉa tầng hot girl\u003cbr /\u003e1 Bộ dồ hot girl cạp trễ\u003cbr /\u003e1 Gi\u0026agrave;y lười hot girl cạp trễ\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91600364yQsrd.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 20000.0,
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
            "91111104": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111104",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Hoodie bạn trai ORBIT nâu",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ lưỡi trai phối m\u0026agrave;u ORBIT (n\u0026acirc;u) \u003cbr\u003e1 Hoodie k\u0026eacute;o kh\u0026oacute;a phối m\u0026agrave;u ORBIT (n\u0026acirc;u) \u003cbr\u003e1 Quần t\u0026uacute;i bộp tiện dụng ORBIT (n\u0026acirc;u) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111104.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91111346": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111346",
                "promotionID": "",
                "productName": "Gói Quần cạp trễ denim đen",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 \u0026Aacute;o s\u0026aacute;t n\u0026aacute;ch croptop đen\u003cbr /\u003e1 Quần cạp trễ denim đen\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111346H46RV.png",
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
            "91111341": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111341",
                "promotionID": "",
                "productName": "Gói Vũ điệu hoa hồng",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 Mũ trang tr\u0026iacute; lụa hoa hồng\u003cbr /\u003e1 T\u0026oacute;c buộc hoa hồng\u003cbr /\u003e1 Mặt sương b\u0026igrave;nh minh\u003cbr /\u003e1 Đầm lụa th\u0026ecirc;u hoa hồng\u003cbr /\u003e1 Sandal đế xuồng nơ m\u0026agrave;u be\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m :\u003cspan style\u003d\"color: #ff00ff;\"\u003e 20 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111341jJ06s.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
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
            "91110251": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110251",
                "promotionID": "",
                "productName": "Gói Ella Gator",
                "productGroup": "G8",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Trang phục Ella\u003cbr /\u003e1 Bạn Bird của Ella\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110251.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 179000.0,
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
            "91110252": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110252",
                "promotionID": "",
                "productName": "Gói Three Eyes",
                "productGroup": "G8",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ Three Eyes \u0027Mu\u0027\u003cbr /\u003e1 Bộ đồ Three Eyes \u0027Mu\u0027\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110252.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 149000.0,
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
            "91110808": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110808",
                "promotionID": "",
                "productName": "Gói Kim Ngưu Kiên Định nữ",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u0026nbsp;\u003c/strong\u003e\u003cbr\u003e1 Mũ sừng n\u0026acirc;u đ\u0026aacute;ng y\u0026ecirc;u\u003cbr\u003e1 Mặt trong s\u0026aacute;ng hiền l\u0026agrave;nh\u003cbr\u003e1 T\u0026oacute;c thiếu nữ ngoan cường\u0026nbsp;\u003cbr\u003e1 Đầm da b\u0026ograve; xếp tầng đ\u0026aacute;ng y\u0026ecirc;u\u003cbr\u003e1 Bốt nữ trắng cổ cao\u003cbr\u003e1 Dấu ấn sao Kim Ngưu\u0026nbsp;\u003cbr\u003e1 Đu\u0026ocirc;i b\u0026ograve; n\u0026acirc;u đeo nơ\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110808.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110807": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110807",
                "promotionID": "",
                "productName": "Gói Kim Ngưu Kiên Định nam",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 Sừng n\u0026acirc;u xoăn ốc\u003cbr\u003e1 Khuy\u0026ecirc;n tai dũng sĩ đấu b\u0026ograve;\u003cbr\u003e1 Mặt nam ch\u0026iacute;nh trực\u003cbr\u003e1 T\u0026oacute;c ch\u0026agrave;ng trai cứng cỏi\u003cbr\u003e1 Bộ đồ đấu sĩ b\u0026ograve; t\u0026oacute;t\u003cbr\u003e1 Gi\u0026agrave;y nam cột d\u0026acirc;y nhiều tầng\u003cbr\u003e1 Dấu ấn sao Kim Ngưu\u003cbr\u003e1 Đu\u0026ocirc;i b\u0026ograve; n\u0026acirc;u choco\u003cbr\u003e\u003cbr\u003e\u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e\u003cstrong\u003e\u003cspan style\u003d\"color: rgb(0, 0, 0);\"\u003eTặng th\u0026ecirc;m :\u003c/span\u003e 15 đ\u0026aacute; qu\u0026yacute;\u003c/strong\u003e\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110807.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91111112": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111112",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Hoodie bạn gái ORBIT xanh da trời",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ lưỡi trai ấm \u0026aacute;p ORBIT (trắng ng\u0026agrave;) \u003cbr\u003e1 Hoodie k\u0026eacute;o kh\u0026oacute;a form rộng ORBIT (xanh da trời) \u003cbr\u003e1 Quần t\u0026uacute;i hộp rộng (trắng ng\u0026agrave;) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111112.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91111111": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111111",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Hoodie bạn gái ORBIT trắng ngà",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ lưỡi trai ấm \u0026aacute;p ORBIT (be) \u003cbr\u003e1 Hoodie k\u0026eacute;o kh\u0026oacute;a form rộng ORBIT (trắng ng\u0026agrave;) \u003cbr\u003e1 Quần t\u0026uacute;i hộp rộng (be) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111111.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110820": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110820",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT hồng",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT hồng",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110820.png",
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
            "91111239": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111239",
                "promotionID": "",
                "productName": "Gói Xu nông trại #1",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1M Xu n\u0026ocirc;ng trại\u003cbr\u003e5 V\u0026ograve;i tưới si\u0026ecirc;u cao cấp\u003cbr\u003e1 Ống ti\u0026ecirc;m [Cầu vồng]\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-sot.vcdn.vn/ws-content/uploads//PTG-ZINGPAY-1-LIVE/image/product/1495046879325589504.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 20000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110821": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110821",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT oải hương",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT oải hương",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110821.png",
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
            "91111110": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111110",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Hoodie bạn gái ORBIT xám",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ lưỡi trai ấm \u0026aacute;p ORBIT (xanh navy) \u003cbr\u003e1 Hoodie k\u0026eacute;o kh\u0026oacute;a form rộng ORBIT (x\u0026aacute;m) \u003cbr\u003e1 Quần t\u0026uacute;i hộp rộng (xanh navy) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111110.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110819": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110819",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT hồng baby",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT hồng baby",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110819.png",
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
            "91100221": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100221",
                "promotionID": "",
                "productName": "Câu cá LINE FRIENDS minini",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Trang phục LINE FRIENDS lenini\u003cbr /\u003e1 Ba l\u0026ocirc; LINE FRIENDS conini\u003cbr /\u003e1 Cần c\u0026acirc;u LINE FRIENDS dnini\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100221.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91100222": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100222",
                "promotionID": "",
                "productName": "Tàu hỏa LINE FRIENDS minini",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 T\u0026agrave;u hỏa LINE FRIENDS minini\u003cbr /\u003e1 Mũ LINE FRIENDS conini\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100222.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 349000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 3,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "92110002": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "92110002",
                "promotionID": "",
                "productName": "Thành viên Plus (30 Ngày)",
                "productGroup": "G4",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003cbr /\u003e\u003cspan style\u003d\"color: #cc99ff;\"\u003eT\u0026ecirc;n m\u0026agrave;u t\u0026iacute;m cực ngầu\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003ePhần thưởng điểm danh x2\u003cbr /\u003eNhận ngay phần thưởng miễn ph\u0026iacute;\u003cbr /\u003eMiễn ph\u0026iacute; ho\u0026agrave;n th\u0026agrave;nh ngay nhiệm vụ hằng ng\u0026agrave;y\u003cbr /\u003eMiễn ph\u0026iacute; bốc thăm hộp quảng c\u0026aacute;o\u003cbr /\u003eNhận ngay điểm vương miện miễn ph\u0026iacute;\u003cbr /\u003ePhần thường nhiệm vụ x3\u003cbr /\u003eGiảm giờ ph\u0026aacute;t triển th\u0026uacute; cưng\u003cbr /\u003eNhảy v\u0026ograve;ng vượt chướng ngại vật\u003cbr /\u003e\u003cspan class\u003d\"bold\" style\u003d\"color: #ff0000; font-weight: bold;\"\u003eSố lần c\u0026acirc;u c\u0026aacute; kh\u0026ocirc;ng giới hạn\u003c/span\u003e\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eTặng th\u0026ecirc;m:\u003c/span\u003e \u003cspan style\u003d\"color: #ff00ff;\"\u003e20 Đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/92110002.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91111109": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111109",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Hoodie bạn gái ORBIT xám đậm",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ lưỡi trai ấm \u0026aacute;p ORBIT (hồng) \u003cbr\u003e1 Hoodie k\u0026eacute;o kh\u0026oacute;a form rộng ORBIT (x\u0026aacute;m đậm) \u003cbr\u003e1 Quần t\u0026uacute;i hộp rộng (đen) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111109.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91100220": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100220",
                "promotionID": "",
                "productName": "Đồ nội thất B\u0026F",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Đ\u0026egrave;n s\u0026acirc;n khấu SALLY\u003cbr /\u003e1 Bồn tắm th\u0026uacute; cưng SALLY\u003cbr /\u003e1 Giường th\u0026uacute; cưng BROWN\u003cbr /\u003e1 Tủ lạnh hai cửa BROWN v\u0026agrave; SALLY\u003cbr /\u003e1 Tủ lạnh SALLY nhỏ\u003cbr /\u003e1 Bạt nh\u0026uacute;n l\u0026ograve; xo BROWN\u003cbr /\u003e1 \u0026Ocirc; BROWN\u003cbr /\u003e1 \u0026Ocirc; SALLY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100220.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 499000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 10,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111108": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111108",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Hoodie bạn gái ORBIT hồng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ lưỡi trai ấm \u0026aacute;p ORBIT (t\u0026iacute;m đậm) \u003cbr\u003e1 Hoodie k\u0026eacute;o kh\u0026oacute;a form rộng ORBIT (hồng) \u003cbr\u003e1 Quần t\u0026uacute;i hộp rộng (kaki) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111108.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "92110004": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "92110004",
                "promotionID": "",
                "productName": "30 Ngày Đá Quý! (CAO CẤP)",
                "productGroup": "G4",
                "description": "\u003cp\u003eThẻ Th\u0026aacute;ng\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e300 Đ\u0026aacute; qu\u0026yacute;\u003cbr /\u003e25 đ\u0026aacute; qu\u0026yacute; mỗi ng\u0026agrave;y khi đăng nhập\u003cbr /\u003e1 Đặc biệt cấp\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eTặng th\u0026ecirc;m:\u003c/span\u003e \u003cspan style\u003d\"color: #ff00ff;\"\u003e35 Đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/92110004.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 220000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 8,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110818": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110818",
                "promotionID": "",
                "productName": "Gói Đồ thể thao ORBIT đào",
                "productGroup": "G16",
                "description": "Gói Đồ thể thao ORBIT đào",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110818.png",
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
            "92110005": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "92110005",
                "promotionID": "",
                "productName": "Thành Viên Bán Tức Thì",
                "productGroup": "G4",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;: lợi \u0026iacute;ch duy tr\u0026igrave; 14 ng\u0026agrave;y kể từ thời điểm nhận g\u0026oacute;i trong thư\u003c/span\u003e\u003cbr /\u003e- B\u0026aacute;n c\u0026aacute;, c\u0026ocirc;n tr\u0026ugrave;ng, kho\u0026aacute;ng thạch ngay khi thu được\u003cbr /\u003e- C\u0026acirc;u c\u0026aacute; kh\u0026ocirc;ng giới hạn\u003cbr /\u003e- 10 mồi c\u0026aacute; thu mỗi ng\u0026agrave;y\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eTặng th\u0026ecirc;m:\u003c/span\u003e \u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold; color: #ff00ff;\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/92110005.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 20000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91130041": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130041",
                "promotionID": "",
                "productName": "Gói Hoa diên vĩ",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e3 Hạt giống hoa di\u0026ecirc;n vĩ (trắng) \u003cbr\u003e3 Hạt giống hoa di\u0026ecirc;n vĩ (v\u0026agrave;ng) \u003cbr\u003e3 Hạt giống hoa di\u0026ecirc;n vĩ (đỏ) \u003cbr\u003e2 V\u0026ograve;i tưới si\u0026ecirc;u cao cấp \u003cbr\u003e10 Xẻng bứng c\u0026acirc;y \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(185, 106, 217);\"\u003e10 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91130041p9rdl.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
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
            "91130040": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130040",
                "promotionID": "",
                "productName": "Gói Hoa hải quỳ",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e3 Hạt giống hoa hải quỳ (trắng) \u003cbr\u003e3 Hạt giống hoa hải quỳ (v\u0026agrave;ng) \u003cbr\u003e3 hạt giống hoa hải quỳ (đỏ) \u003cbr\u003e2 V\u0026ograve;i tưới si\u0026ecirc;u cao cấp \u003cbr\u003e10 Xẻng bứng c\u0026acirc;y \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(185, 106, 217);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91130040D83NJ.png",
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
            "91110795": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110795",
                "promotionID": "",
                "productName": "Gói Chàng Bạch Dương lãng mạn",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 Sừng Bạch Dương\u003cbr\u003e1 Dấu ấn sao Bạch Dương\u003cbr\u003e1 Mặt ngẩn ngơ\u003cbr\u003e1 T\u0026oacute;c Bạch Dương chải chuốt\u003cbr\u003e1 \u0026Aacute;o Bạch Dương ấm \u0026aacute;p\u003cbr\u003e1 Quần Bạch Dương lơ lửng\u003cbr\u003e1 Bốt cừu con tươi tắn\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110795.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110796": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110796",
                "promotionID": "",
                "productName": "Gói Nàng Bạch Dương lãng mạn",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 Sừng Bạch Dương\u003cbr\u003e1 Dấu ấn sao Bạch Dương\u003cbr\u003e1 Mặt thẫn thờ\u003cbr\u003e1 T\u0026oacute;c Bạch Dương bồng bềnh\u003cbr\u003e1 Đầm Bạch Dương lấp l\u0026aacute;nh\u003cbr\u003e1 Bốt cừu con ấm \u0026aacute;p\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110796.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91130045": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130045",
                "promotionID": "",
                "productName": "Gói Hoa mộc lan",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e3 Hạt giống hoa mộc lan (trắng) \u003cbr\u003e3 Hạt giống hoa mộc lan (v\u0026agrave;ng) \u003cbr\u003e3 Hạt giống hoa mộc lan (đỏ) \u003cbr\u003e2 V\u0026ograve;i tưới si\u0026ecirc;u cao cấp\u003cbr\u003e10 Xẻng bứng c\u0026acirc;y \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(185, 106, 217);\"\u003e10 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911300459kJpe.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
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
            "91130044": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130044",
                "promotionID": "",
                "productName": "Gói Hoa đỗ quyên",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e3 Hạt hoa đỗ quy\u0026ecirc;n (trắng) \u003cbr\u003e3 Hạt hoa đỗ quy\u0026ecirc;n (v\u0026agrave;ng) \u003cbr\u003e3 Hạt hoa đỗ quy\u0026ecirc;n (đỏ) \u003cbr\u003e2 V\u0026ograve;i tưới si\u0026ecirc;u cao cấp \u003cbr\u003e10 Xẻng bứng c\u0026acirc;y \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(185, 106, 217);\"\u003e10 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91130044EmvNt.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
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
            "91130043": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130043",
                "promotionID": "",
                "productName": "Gói Hoa anh đào",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e3 Hạt hoa anh đ\u0026agrave;o (trắng) \u003cbr\u003e3 Hạt hoa anh đ\u0026agrave;o (v\u0026agrave;ng) \u003cbr\u003e3 Hạt hoa anh đ\u0026agrave;o (đỏ) \u003cbr\u003e2 V\u0026ograve;i tưới si\u0026ecirc;u cao cấp \u003cbr\u003e10 Xẻng bứng c\u0026acirc;y \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(185, 106, 217);\"\u003e20 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911300437Up5y.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
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
            "91100748": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100748",
                "promotionID": "",
                "productName": "Nhịp điệu hoang dã",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 T\u0026oacute;c buộc nửa kiểu đường phố\u003cbr /\u003e1 Mặt \u0026aacute;nh mắt lạnh l\u0026ugrave;ng\u003cbr /\u003e1 Xỏ khuy\u0026ecirc;n hồng neon\u003cbr /\u003e1 \u0026Aacute;o thun rộng nhịp điệu hoang d\u0026atilde;\u003cbr /\u003e1 Quần si\u0026ecirc;u ngắn punk đen\u003cbr /\u003e1 Gi\u0026agrave;y walker x\u0026iacute;ch punk\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91100748heoN1.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91130042": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130042",
                "promotionID": "",
                "productName": "Gói Hoa mận",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e3 Hạt giống hoa mận (trắng) \u003cbr\u003e3 Hạt giống hoa mận (v\u0026agrave;ng) \u003cbr\u003e3 Hạt giống hoa mận (đỏ) \u003cbr\u003e2 V\u0026ograve;i tưới si\u0026ecirc;u cao cấp \u003cbr\u003e10 Xẻng bứng c\u0026acirc;y \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m: \u003cspan style\u003d\"color: rgb(185, 106, 217);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911300429lrIR.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91200482": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91200482",
                "promotionID": "",
                "productName": "Mây thiên nhiên KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 Giường m\u0026acirc;y thi\u0026ecirc;n nhi\u0026ecirc;n\u003cbr /\u003e1 B\u0026agrave;n trang điểm m\u0026acirc;y\u003cbr /\u003e1 Chậu c\u0026acirc;y l\u0026aacute; rộng\u003cbr /\u003e1 Ghế đẩu m\u0026acirc;y thi\u0026ecirc;n nhi\u0026ecirc;n\u003cbr /\u003e1 Kệ để chậu c\u0026acirc;y\u003cbr /\u003e1 Macrame\u003cbr /\u003e1 Kệ m\u0026acirc;y\u003cbr /\u003e1 Gương m\u0026acirc;y thi\u0026ecirc;n nhi\u0026ecirc;n\u003cbr /\u003e1 Ngựa bập b\u0026ecirc;nh m\u0026acirc;y\u003cbr /\u003e1 Thảm m\u0026acirc;y thi\u0026ecirc;n nhi\u0026ecirc;n\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91200482lYeHt.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91100079": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100079",
                "promotionID": "",
                "productName": "Gói Trang phục CHOCO",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Trang phục CHOCO\u003cbr /\u003e1 \u0026Ocirc; CHOCO\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100079.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 149000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91130039": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130039",
                "promotionID": "",
                "productName": "Gói Hoa thủy tiên",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e3 Hạt giống hoa thủy ti\u0026ecirc;n (trắng) \u003cbr\u003e3 Hạt giống hoa thủy ti\u0026ecirc;n (v\u0026agrave;ng) \u003cbr\u003e3 Hạt giống hoa thủy ti\u0026ecirc;n (đỏ) \u003cbr\u003e2 V\u0026ograve;i tưới si\u0026ecirc;u cao cấp \u003cbr\u003e10 Xẻng bứng c\u0026acirc;y \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(185, 106, 217);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/9113003959986.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91200489": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91200489",
                "promotionID": "",
                "productName": "Ốc sên nhỏ KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 T\u0026oacute;c b\u0026uacute;i ốc s\u0026ecirc;n\u003cbr /\u003e1 T\u0026uacute;i vỏ ốc s\u0026ecirc;n\u003cbr /\u003e1 R\u0026acirc;u ốc s\u0026ecirc;n\u003cbr /\u003e1 Quần yếm n\u0026acirc;u\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91200489TSu0S.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 20000.0,
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
            "91200367": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91200367",
                "promotionID": "",
                "productName": "Hoa liên kiều nhỏ xinh KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 Nơ bướm hoa li\u0026ecirc;n kiều nhỏ xinh\u003cbr\u003e1 T\u0026oacute;c bob ngắn nhỏ xinh\u003cbr\u003e1 Đầm hoa li\u0026ecirc;n kiều nhỏ xinh\u003cbr\u003e1 Gi\u0026agrave;y hoa li\u0026ecirc;n kiều nhỏ xinh\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/912003674DE4q.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
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
            "91100080": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100080",
                "promotionID": "",
                "productName": "Gói Trang phục CONY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Trang phục CONY\u003cbr /\u003e1 \u0026Ocirc; CONY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100080.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 149000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91130038": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130038",
                "promotionID": "",
                "productName": "Gói Hoa nghệ tây",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e3 Hạt giống hoa nghệ t\u0026acirc;y (trắng) \u003cbr\u003e3 Hạt giống hoa nghệ t\u0026acirc;y (v\u0026agrave;ng) \u003cbr\u003e3 Hạt giống hoa nghệ t\u0026acirc;y (đỏ) \u003cbr\u003e2 V\u0026ograve;i tưới si\u0026ecirc;u cao cấp \u003cbr\u003e10 Xẻng bứng c\u0026acirc;y \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(185, 106, 217);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91130038V5YEn.png",
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
            "91130037": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130037",
                "promotionID": "",
                "productName": "Gói Hoa tulip",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e3 Hạt giống hoa tulip (trắng) \u003cbr\u003e3 Hạt giống hoa tulip (v\u0026agrave;ng) \u003cbr\u003e3 Hạt giống hoa tulip (đỏ) \u003cbr\u003e2 V\u0026ograve;i tưới si\u0026ecirc;u cao cấp \u003cbr\u003e10 Xẻng bứng c\u0026acirc;y \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(185, 106, 217);\"\u003e10 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91130037N9h3S.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
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
            "91130036": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130036",
                "promotionID": "",
                "productName": "Gói Dạ lan hương",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e3 Hạt giống Dạ lan hương (trắng) \u003cbr\u003e3 Hạt giống dạ lan hương (v\u0026agrave;ng) \u003cbr\u003e3 Hạt giống dạ lan hương (đỏ) \u003cbr\u003e2 V\u0026ograve;i tưới si\u0026ecirc;u cao cấp \u003cbr\u003e10 Xẻng bứng c\u0026acirc;y \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(185, 106, 217);\"\u003e20 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91130036Uu0s2.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
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
            "91111099": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111099",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Thần Nông quyến rũ",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u0026nbsp;\u003c/strong\u003e\u003cbr\u003e1 T\u0026oacute;c đu\u0026ocirc;i ngựa bọ cạp\u003cbr\u003e1 Mặt l\u0026ocirc;ng mi kh\u0026oacute;i\u003cbr\u003e1 Khuy\u0026ecirc;n tai b\u0026oacute;ng ma đen\u003cbr\u003e1 Gum bong b\u0026oacute;ng berry t\u0026iacute;m\u003cbr\u003e1 Bộ đồ b\u0026oacute;ng ma t\u0026iacute;m\u003cbr\u003e1 Gi\u0026agrave;y bọ cạp t\u0026iacute;m\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111099.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91111098": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111098",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Gói Thần Nông định mệnh",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u0026nbsp;\u003c/strong\u003e\u003cbr\u003e1 T\u0026oacute;c sidecut bọ cạp\u003cbr\u003e1 Mặt lưỡi dao kh\u0026oacute;i\u003cbr\u003e1 Khuy\u0026ecirc;n tai b\u0026oacute;ng ma đen\u003cbr\u003e1 Gum bong b\u0026oacute;ng anh đ\u0026agrave;o đen\u003cbr\u003e1 Bộ đồ b\u0026oacute;ng ma đen\u003cbr\u003e1 Gi\u0026agrave;y bọ cạp đen\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111098.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91100081": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100081",
                "promotionID": "",
                "productName": "Bếp ăn ngọt ngào",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Bếp nướng CHOCO\u003cbr /\u003e1 L\u0026ograve; nướng CONY\u003cbr /\u003e1 Đảo bếp CHOCO\u003cbr /\u003e1 Bếp ga CHOCO\u003cbr /\u003e1 Gi\u0026aacute; phơi b\u0026aacute;t đĩa CONY\u003cbr /\u003e1 M\u0026aacute;y rửa ch\u0026eacute;n CONY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100081.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 179000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 10,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111301": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111301",
                "promotionID": "91111301oGg2W",
                "productName": "Gói Hội chứng Kitsch girl",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr /\u003e1 T\u0026oacute;c b\u0026uacute;i kitsch\u003cbr /\u003e1 Mặt với đ\u0026ocirc;i mắt to tr\u0026ograve;n\u003cbr /\u003e1 M\u0026aacute; ửng hồng kitsch\u003cbr /\u003e1 \u0026Aacute;o thun chữ in đậm\u003cbr /\u003e1 V\u0026aacute;y voan ch\u0026eacute;o hồng\u003cbr /\u003e1 Bốt kh\u0026oacute;a k\u0026eacute;o trước tr\u0026aacute;i tim\u003c/p\u003e\r\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111301oGg2W.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
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
            "91100091": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100091",
                "promotionID": "",
                "productName": "Gói Mô hình phòng thu",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 [M\u0026ocirc; h\u0026igrave;nh] KOYA\u003cbr /\u003e1 [M\u0026ocirc; h\u0026igrave;nh] RJ\u003cbr /\u003e1 [M\u0026ocirc; h\u0026igrave;nh] SHOOKY\u003cbr /\u003e1 [M\u0026ocirc; h\u0026igrave;nh] MANG\u003cbr /\u003e1 [M\u0026ocirc; h\u0026igrave;nh] CHIMMY\u003cbr /\u003e1 [M\u0026ocirc; h\u0026igrave;nh] TATA\u003cbr /\u003e1 [M\u0026ocirc; h\u0026igrave;nh] COOKY\u003cbr /\u003e1 [M\u0026ocirc; h\u0026igrave;nh] VAN\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100091.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 499000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 10,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91211350": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91211350",
                "promotionID": "",
                "productName": "Gói Sổ tay phối đồ thập niên 90 KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 Mũ lưỡi trai hồng tro\u003cbr /\u003e1 T\u0026oacute;c cắt tầng s\u0026agrave;nh điệu\u003cbr /\u003e1 Mặt nụ cười đ\u0026aacute;ng y\u0026ecirc;u\u003cbr /\u003e1 \u0026Aacute;o trễ vai sọc kẹo ngọt \u003cbr /\u003e1 Ch\u0026acirc;n v\u0026aacute;y b\u0026iacute; phồng kitsch\u003cbr /\u003e1 Gi\u0026agrave;y k\u0026egrave;m tất giữ ấm kẹo m\u0026uacute;t\u003cbr /\u003e1 Hoodie d\u0026acirc;y k\u0026eacute;o hot pink\u003cbr /\u003e1 Quần lấp l\u0026aacute;nh hot pink\u003cbr /\u003e1 Gi\u0026agrave;y thể thao Pink Rush\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91211350v87cQ.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
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
            "91211351": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91211351",
                "promotionID": "",
                "productName": "Gói Cú lướt của Rio (Phương tiện) KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 V\u0026aacute;n trượt lướt gi\u0026oacute;\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91211351iKpQf.png",
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
            "91211352": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91211352",
                "promotionID": "",
                "productName": "Gói Cú lướt của Rio (Trang phục) KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 K\u0026iacute;nh bảo hộ trượt v\u0026aacute;n vintage\u003cbr /\u003e1 T\u0026oacute;c thẳng chỉa nhọn\u003cbr /\u003e1 Mặt cười h\u0026iacute;p mắt\u003cbr /\u003e1 Phấn m\u0026aacute; đ\u0026agrave;o m\u0026ugrave;a h\u0026egrave;\u003cbr /\u003e1 \u0026Aacute;o thun in h\u0026igrave;nh phom rộng\u003cbr /\u003e1 Quần rằn ri đơn sắc\u003cbr /\u003e1 Gi\u0026agrave;y thể thao mũi th\u0026eacute;p đen\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/912113526McU7.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
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
            "91111303": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111303",
                "promotionID": "911113036XwW7",
                "productName": "Gói Hội chứng Kitsch girl (tóc-biểu cảm)",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr /\u003e1 T\u0026oacute;c b\u0026uacute;i kitsch\u003cbr /\u003e1 Mặt với đ\u0026ocirc;i mắt to tr\u0026ograve;n\u003c/p\u003e\r\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e10 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911113036XwW7.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
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
            "91211353": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91211353",
                "promotionID": "",
                "productName": "Gói Cú lướt của Rio KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 V\u0026aacute;n trượt lướt gi\u0026oacute; \u003cbr /\u003e1 K\u0026iacute;nh bảo hộ trượt v\u0026aacute;n vintage\u003cbr /\u003e1 T\u0026oacute;c thẳng chỉa nhọn\u003cbr /\u003e1 Mặt cười h\u0026iacute;p mắt\u003cbr /\u003e1 Phấn m\u0026aacute; đ\u0026agrave;o m\u0026ugrave;a h\u0026egrave;\u003cbr /\u003e1 \u0026Aacute;o thun in h\u0026igrave;nh phom rộng\u003cbr /\u003e1 Quần rằn ri đơn sắc\u003cbr /\u003e1 Gi\u0026agrave;y thể thao mũi th\u0026eacute;p đen\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91211353GeBen.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91111302": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111302",
                "promotionID": "911113027721O",
                "productName": "Gói Hội chứng Kitsch girl (trang phục)",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr /\u003e1 M\u0026aacute; ửng hồng kitsch\u003cbr /\u003e1 \u0026Aacute;o thun chữ in đậm\u003cbr /\u003e1 V\u0026aacute;y voan ch\u0026eacute;o hồng\u003cbr /\u003e1 Bốt kh\u0026oacute;a k\u0026eacute;o trước tr\u0026aacute;i tim\u003c/p\u003e\r\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m :\u003cspan style\u003d\"color: #ff00ff;\"\u003e 5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911113027721O.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
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
            "90110005": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90110005",
                "promotionID": "",
                "productName": "Rổ Đá Quý",
                "productGroup": "G1",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e420 Đ\u0026aacute; qu\u0026yacute;\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eTặng th\u0026ecirc;m:\u003c/span\u003e \u003cspan class\u003d\"bold\" style\u003d\"color: #ff00ff; font-weight: bold;\"\u003e50\u0026nbsp;Đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/90110005.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 400000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 10,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "90110006": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90110006",
                "promotionID": "",
                "productName": "Vali Đá Quý",
                "productGroup": "G1",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1150 Đ\u0026aacute; qu\u0026yacute;\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eTặng th\u0026ecirc;m:\u003c/span\u003e \u003cspan class\u003d\"bold\" style\u003d\"color: #ff00ff; font-weight: bold;\"\u003e150\u0026nbsp;Đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/90110006.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 1000000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 11,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "90110007": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90110007",
                "promotionID": "",
                "productName": "Thùng Đá Quý",
                "productGroup": "G1",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e2385 Đ\u0026aacute; qu\u0026yacute;\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eTặng th\u0026ecirc;m:\u003c/span\u003e \u003cspan class\u003d\"bold\" style\u003d\"color: #ff00ff; font-weight: bold;\"\u003e200\u0026nbsp;Đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/90110007.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 2000000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 12,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "90110002": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90110002",
                "promotionID": "",
                "productName": "Một Ít Đá Quý",
                "productGroup": "G1",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e36 Đ\u0026aacute; qu\u0026yacute;\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eTặng th\u0026ecirc;m:\u003c/span\u003e \u003cspan class\u003d\"bold\" style\u003d\"color: #ff00ff; font-weight: bold;\"\u003e5\u0026nbsp;Đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/90110002.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 40000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "90110003": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90110003",
                "promotionID": "",
                "productName": "Chồng Đá Quý",
                "productGroup": "G1",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e95 Đ\u0026aacute; qu\u0026yacute;\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eTặng th\u0026ecirc;m:\u003c/span\u003e \u003cspan class\u003d\"bold\" style\u003d\"color: #ff00ff; font-weight: bold;\"\u003e20\u0026nbsp;Đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/90110003.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 8,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "90110004": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "90110004",
                "promotionID": "",
                "productName": "Bắp Rang Đá Quý",
                "productGroup": "G1",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e200 Đ\u0026aacute; qu\u0026yacute;\u003c/p\u003e\r\r\r\n\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eTặng th\u0026ecirc;m:\u003c/span\u003e \u003cspan class\u003d\"bold\" style\u003d\"color: #ff00ff; font-weight: bold;\"\u003e35\u0026nbsp;Đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/90110004.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 200000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 9,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91100652": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100652",
                "promotionID": "",
                "productName": "Caramel vintage",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Mũ nồi caramel \u003cbr\u003e1 T\u0026agrave;n nhang caramel \u003cbr\u003e1 T\u0026oacute;c gợn s\u0026oacute;ng vintage \u003cbr\u003e1 Mặt caramel dịu d\u0026agrave;ng \u003cbr\u003e1 B\u0026ocirc;ng tai lủng lẳng vintage \u003cbr\u003e1 Đầm caramel vintage \u003cbr\u003e1 Bốt d\u0026agrave;i caramel \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m: \u003cspan style\u003d\"color: rgb(234, 51, 242);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100652.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 110000.0,
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
            "91111312": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111312",
                "promotionID": "91111312u0W1V",
                "productName": "Gói Bộ đồ thể thao retro ORBIT đen",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr /\u003e1 Tai nghe retro ORBIT (đen)\u003cbr /\u003e1 \u0026Aacute;o kho\u0026aacute;c thể thao phối m\u0026agrave;u ORBIT (đen)\u003cbr /\u003e1 Quần thể thao viền dọc ORBIT (đen)\u003c/p\u003e\r\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111312u0W1V.png",
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
            "91111315": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111315",
                "promotionID": "911113155789C",
                "productName": "Gói Bộ đồ thể thao retro ORBIT xanh da trời",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr /\u003e1 Tai nghe retro ORBIT (xanh da trời)\u003cbr /\u003e1 \u0026Aacute;o kho\u0026aacute;c thể thao phối m\u0026agrave;u ORBIT (xanh da trời)\u003cbr /\u003e1 Quần thể thao viền dọc ORBIT (xanh da trời)\u003c/p\u003e\r\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911113155789C.png",
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
            "91110106": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110106",
                "promotionID": "",
                "productName": "Gói BROWN",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Gối mặt BROWN\u003cbr /\u003e1 Đ\u0026egrave;n tường BROWN\u003cbr /\u003e1 TV BROWN\u003cbr /\u003e1 B\u0026agrave;n trang điểm BROWN\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110106.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 129000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 10,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111314": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111314",
                "promotionID": "911113144JIzL",
                "productName": "Gói Bộ đồ thể thao retro ORBIT trắng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr /\u003e1 Tai nghe retro ORBIT (trắng)\u003cbr /\u003e1 \u0026Aacute;o kho\u0026aacute;c thể thao phối m\u0026agrave;u ORBIT (trắng)\u003cbr /\u003e1 Quần thể thao viền dọc ORBIT (trắng)\u003c/p\u003e\r\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911113144JIzL.png",
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
            "91111313": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111313",
                "promotionID": "911113139c0Mj",
                "productName": "Gói Bộ đồ thể thao retro ORBIT xanh navy",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr /\u003e1 Tai nghe retro ORBIT (xanh navy)\u003cbr /\u003e1 \u0026Aacute;o kho\u0026aacute;c thể thao phối m\u0026agrave;u ORBIT (xanh navy)\u003cbr /\u003e1 Quần thể thao viền dọc ORBIT (xanh navy)\u003c/p\u003e\r\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911113139c0Mj.png",
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
            "91200232": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91200232",
                "promotionID": "",
                "productName": "Gói Kẹo bông mềm (KM)",
                "productGroup": "G5",
                "description": "\u003cp\u003eG\u0026oacute;i Kẹo b\u0026ocirc;ng mềm (KM)\u003c/p\u003e",
                "image": "https://stc-sot.vcdn.vn/ws-content/uploads//PTG-ZINGPAY-1-LIVE/image/product/1324815823902216192.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91100663": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100663",
                "promotionID": "",
                "productName": "Fan gấu mèo Go go!",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Xe m\u0026aacute;y gấu m\u0026egrave;o \u003cbr\u003e1 Mũ bảo hiểm xe m\u0026aacute;y gấu m\u0026egrave;o \u003cbr\u003e1 T\u0026oacute;c hai đu\u0026ocirc;i buộc lỏng \u003cbr\u003e1 Mặt đầy chữa l\u0026agrave;nh \u003cbr\u003e1 Băng c\u0026aacute; nh\u0026acirc;n gấu m\u0026egrave;o \u003cbr\u003e1 Hoodie sọc hồng \u003cbr\u003e1 Quần jean Kitsch ng\u0026ocirc;i sao \u003cbr\u003e1 Gi\u0026agrave;y tất mềm mại \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e20 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100663.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 130000.0,
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
            "91200233": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91200233",
                "promotionID": "",
                "productName": "Gói Cân đẩu vân kẹo bông (KM)",
                "productGroup": "G5",
                "description": "\u003cp\u003eG\u0026oacute;i C\u0026acirc;n đẩu v\u0026acirc;n kẹo b\u0026ocirc;ng (KM)\u003c/p\u003e",
                "image": "https://stc-sot.vcdn.vn/ws-content/uploads//PTG-ZINGPAY-1-LIVE/image/product/1324816080375517184.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91200235": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91200235",
                "promotionID": "",
                "productName": "Cô bé thỏ RARA",
                "productGroup": "G5",
                "description": "Cô bé thỏ RARA",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91200235.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
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
            "91111287": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111287",
                "promotionID": "91111287fu89c",
                "productName": "Gói Tiểu quỷ Dark Berry",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr /\u003e1 Băng đ\u0026ocirc; Dark Berry\u003cbr /\u003e1 T\u0026oacute;c b\u0026oacute;ng đ\u0026ecirc;m\u003cbr /\u003e1 Mặt \u0026aacute;c mộng ngọt ng\u0026agrave;o\u003cbr /\u003e1 Đầm berry gothic\u003cbr /\u003e1 C\u0026aacute;nh cacao đen\u003cbr /\u003e1 Gi\u0026agrave;y quỷ b\u0026oacute;ng tối\u003c/p\u003e\r\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e20 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111287fu89c.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
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
            "91110997": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110997",
                "promotionID": "",
                "productName": "Gói Xử Nữ trầm lặng",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 V\u0026ograve;ng hoa vườn m\u0026ugrave;a h\u0026egrave;\u003cbr\u003e1 T\u0026oacute;c thắt n\u0026uacute;t tươi m\u0026aacute;t\u003cbr\u003e1 Mặt \u0026aacute;nh mắt điềm tĩnh\u003cbr\u003e1 Đầm vườn lục bảo\u003cbr\u003e1 Sandal l\u0026aacute; ngọc lục bảo\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110997.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91130005": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130005",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Hạt khế",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Hạt khế \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m: \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e35 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91130005.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 200000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91130004": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130004",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Hạt sầu riêng",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Hạt sầu ri\u0026ecirc;ng \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e35 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91130004.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 210000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91130003": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130003",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Hạt táo đường",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Hạt t\u0026aacute;o đường \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e35 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91130003.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 210000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91130002": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130002",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Hạt cây đậu",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Hạt c\u0026acirc;y đậu \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e40 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91130002.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 250000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91111286": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111286",
                "promotionID": "91111286wOa56",
                "productName": "Gói Thiên thần Marshmallow",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr /\u003e1 Băng đ\u0026ocirc; marshmallow\u003cbr /\u003e1 T\u0026oacute;c gợn s\u0026oacute;ng m\u0026acirc;y\u003cbr /\u003e1 Mặt giấc mơ thuần khiết\u003cbr /\u003e1 Đầm thi\u0026ecirc;n thần Marshmallow\u003cbr /\u003e1 C\u0026aacute;nh Marshmallow ấm \u0026aacute;p\u003cbr /\u003e1 Gi\u0026agrave;y thi\u0026ecirc;n thần kem\u003c/p\u003e\r\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e20 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111286wOa56.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
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
            "91100710": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100710",
                "promotionID": "",
                "productName": "Siêu xe cảnh sát đặc nhiệm",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u0026nbsp;\u003c/strong\u003e\u003cbr\u003e1 Si\u0026ecirc;u xe cảnh s\u0026aacute;t đặc nhiệm\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(234, 51, 242);\"\u003e50 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911007104GNRK.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 320000.0,
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
            "91600619": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91600619",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Xưởng may hoa hồng KM",
                "productGroup": "G5",
                "description": "Nạp nhận vật phẩm theo chủ đề của gói",
                "image": "https://stc-billing.mto.zing.vn/ptg/916006193XYC5.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110868": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110868",
                "promotionID": "",
                "productName": "Gói Song Tử Ánh Sáng",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 Mũ miện tinh t\u0026uacute;\u003cbr\u003e1 T\u0026oacute;c tinh t\u0026uacute; b\u0026oacute;ng tối\u003cbr\u003e1 Mặt lấp l\u0026aacute;nh mắt \u0026aacute;nh v\u0026agrave;ng\u003cbr\u003e1 Đầm Song Tử \u0026aacute;nh s\u0026aacute;ng\u003cbr\u003e1 Bốt trắng \u0026aacute;nh s\u0026aacute;ng\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110868.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110987": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110987",
                "promotionID": "",
                "productName": "Gói Áo tay ngắn hè ORBIT raglan xanh da trời",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn form rộng ORBIT (raglan xanh da trời) \u003cbr\u003e1 Quần Bermuda ORBIT (yến mạch) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110987.png",
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
            "91110867": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110867",
                "promotionID": "",
                "productName": "Gói Song Tử Bóng Tối",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 Mũ miện b\u0026oacute;ng tối\u003cbr\u003e1 T\u0026oacute;c ch\u0026ograve;m sao \u0026aacute;nh s\u0026aacute;ng\u003cbr\u003e1 Mặt hồn nhi\u0026ecirc;n mắt đen l\u0026aacute;y\u003cbr\u003e1 Đầm Song Tử b\u0026oacute;ng tối\u003cbr\u003e1 Gi\u0026agrave;y bốt đen tinh h\u0026agrave;\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u0026nbsp;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110867.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110988": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110988",
                "promotionID": "",
                "productName": "Gói Áo tay ngắn hè ORBIT raglan hồng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 \u0026Aacute;o tay ngắn form rộng ORBIT (raglan hồng) \u003cbr\u003e1 Quần Bermuda ORBIT (v\u0026agrave;ng bạc m\u0026agrave;u) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110988.png",
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
            "91200603": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91200603",
                "promotionID": "",
                "productName": "Nội thất kính KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e2 Gạch k\u0026iacute;nh cường lực ML\u003cbr /\u003e1 Gạch k\u0026iacute;nh cường lực XXL\u003cbr /\u003e2 Tường k\u0026iacute;nh cường lực L\u003cbr /\u003e2 Tường k\u0026iacute;nh cường lực XL\u003cbr /\u003e1 Tường k\u0026iacute;nh cường lực XXL\u003cbr /\u003e2 Cầu thang k\u0026iacute;nh cường lực\u003cbr /\u003e1 Cầu thang 2 tầng k\u0026iacute;nh cường lực\u003cbr /\u003e2 Cầu thang bậc rỗng k\u0026iacute;nh cường lực\u003cbr /\u003e1 Cầu thang bậc rỗng k\u0026iacute;nh cường lực 2 tầng\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91200603b3ZCs.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
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
            "91111059": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111059",
                "promotionID": "",
                "productName": "Gói sơ mi caro hàng ngày ORBIT hồng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 K\u0026iacute;nh tr\u0026ograve;n ORBIT (hồng) \u003cbr\u003e1 Sơ mi caro h\u0026agrave;ng ng\u0026agrave;y ORBIT (hồng) \u003cbr\u003e1 Quần form vừa ORBIT (trắng ng\u0026agrave;) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111059.png",
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
            "91111058": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111058",
                "promotionID": "",
                "productName": "Gói sơ mi caro hàng ngày ORBIT xanh navy",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 K\u0026iacute;nh tr\u0026ograve;n ORBIT (đỏ) \u003cbr\u003e1 Sơ mi caro h\u0026agrave;ng ng\u0026agrave;y ORBIT (xanh navy) \u003cbr\u003e1 Quần form vừa ORBIT (đen) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111058.png",
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
            "91110088": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110088",
                "promotionID": "",
                "productName": "Gói Trường học YE-DEE",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ nồi [YE-DEE]\u003cbr /\u003e1 Đồng phục [YE-DEE]\u003cbr /\u003e1 Gi\u0026agrave;y thể thao [YE-DEE]\u003cbr /\u003e1 Ba l\u0026ocirc; [YE-DEE]\u003cbr /\u003e1 Xe trượt điện [YE-DEE]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110088.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 199000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110880": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110880",
                "promotionID": "",
                "productName": "Gói Cự Giải quý phái",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 C\u0026agrave;i t\u0026oacute;c b\u0026eacute; cua tr\u0026aacute;i tim\u003cbr\u003e1 T\u0026oacute;c nữ xoăn nhẹ Cự Giải\u003cbr\u003e1 Mặt nữ qu\u0026yacute; ph\u0026aacute;i mắt \u0026aacute;nh sao\u003cbr\u003e1 Đầm c\u0026uacute;p ngực Cự Giải\u003cbr\u003e1 Gi\u0026agrave;y vũ hội đỏ\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110880.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110089": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110089",
                "promotionID": "",
                "productName": "Gói Trường học SOM",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ nồi [SOM]\u003cbr /\u003e1 Đồng phục [SOM]\u003cbr /\u003e1 Gi\u0026agrave;y thể thao [SOM]\u003cbr /\u003e1 Ba l\u0026ocirc; [SOM]\u003cbr /\u003e1 Xe trượt điện [SOM]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110089.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 199000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110881": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110881",
                "promotionID": "",
                "productName": "Gói Cự Giải lịch thiệp",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 Mũ nồi ch\u0026agrave;ng cua tr\u0026aacute;i tim\u003cbr\u003e1 T\u0026oacute;c nam vuốt m\u0026aacute;i Cự Giải\u003cbr\u003e1 Mặt nam lịch thiệp mắt \u0026aacute;nh kim\u003cbr\u003e1 Bộ đồ vest Cự Giải lịch thiệp\u003cbr\u003e1 Gi\u0026agrave;y t\u0026acirc;y nam m\u0026agrave;u đỏ gạch cua\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110881.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110082": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110082",
                "promotionID": "",
                "productName": "Gói Trường học ROMY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ nồi [ROMY]\u003cbr /\u003e1 Đồng phục [ROMY]\u003cbr /\u003e1 Gi\u0026agrave;y thể thao [ROMY]\u003cbr /\u003e1 Ba l\u0026ocirc; [ROMY]\u003cbr /\u003e1 Xe trượt điện [ROMY]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110082.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 199000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110083": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110083",
                "promotionID": "",
                "productName": "Gói Trường học YOCHI",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ nồi [YOCHI]\u003cbr /\u003e1 Đồng phục [YOCHI]\u003cbr /\u003e1 Gi\u0026agrave;y thể thao [YOCHI]\u003cbr /\u003e1 Ba l\u0026ocirc; [YOCHI]\u003cbr /\u003e1 Xe trượt điện [YOCHI]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110083.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 199000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110081": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110081",
                "promotionID": "",
                "productName": "Gói Trường học CHILLI",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ nồi [CHILLI]\u003cbr /\u003e1 Đồng phục [CHILLI]\u003cbr /\u003e1 Gi\u0026agrave;y thể thao [CHILLI]\u003cbr /\u003e1 Ba l\u0026ocirc; [CHILLI]\u003cbr /\u003e1 Xe trượt điện [CHILLI]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110081.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 199000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110086": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110086",
                "promotionID": "",
                "productName": "Gói Trường học LAWOO",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ nồi [LAWOO]\u003cbr /\u003e1 Đồng phục [LAWOO]\u003cbr /\u003e1 Gi\u0026agrave;y thể thao [LAWOO]\u003cbr /\u003e1 Ba l\u0026ocirc; [LAWOO]\u003cbr /\u003e1 Xe trượt điện [LAWOO]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110086.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 199000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110087": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110087",
                "promotionID": "",
                "productName": "Gói Trường học HIKUN",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ nồi [HIKUN]\u003cbr /\u003e1 Đồng phục [HIKUN]\u003cbr /\u003e1 Gi\u0026agrave;y thể thao [HIKUN]\u003cbr /\u003e1 Ba l\u0026ocirc; [HIKUN]\u003cbr /\u003e1 Xe trượt điện [HIKUN]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110087.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 199000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111175": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111175",
                "promotionID": "",
                "productName": "Gói Ma Kết thận trọng",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 Sừng d\u0026ecirc; trời đ\u0026ecirc;m\u003cbr\u003e1 T\u0026oacute;c gi\u0026oacute; đ\u0026ocirc;ng\u003cbr\u003e1 Mặt Ma Kết thận trọng\u003cbr\u003e1 Trang phục trời sao Bắc Đẩu\u003cbr\u003e1 Gi\u0026agrave;y lười trời sao Bắc Đẩu\u003cbr\u003e1 S\u0026aacute;ch về c\u0026aacute;c ch\u0026ograve;m sao\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91111175P3b8z.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91111053": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111053",
                "promotionID": "",
                "productName": "Gói Thiên Bình nam",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u0026nbsp;\u003c/strong\u003e\u003cbr\u003e1 T\u0026oacute;c tỉa wind cut \u0026aacute;nh sao\u003cbr\u003e1 Kẹp t\u0026oacute;c sao Thi\u0026ecirc;n B\u0026igrave;nh\u003cbr\u003e1 Mặt ng\u0026ocirc;i sao b\u0026igrave;nh thản\u003cbr\u003e1 Bộ đồ ng\u0026acirc;n h\u0026agrave;\u003cbr\u003e1 Gi\u0026agrave;y lười ng\u0026acirc;n h\u0026agrave;\u003cbr\u003e1 Đũa ph\u0026eacute;p sao Thi\u0026ecirc;n B\u0026igrave;nh\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111053.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110084": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110084",
                "promotionID": "",
                "productName": "Gói Trường học BONBON",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ nồi [BONBON]\u003cbr /\u003e1 Đồng phục [BONBON]\u003cbr /\u003e1 Gi\u0026agrave;y thể thao [BONBON]\u003cbr /\u003e1 Ba l\u0026ocirc; [BONBON]\u003cbr /\u003e1 Xe trượt điện [BONBON]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110084.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 199000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111174": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111174",
                "promotionID": "",
                "productName": "Gói Ma Kết chăm chỉ",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 Sừng d\u0026ecirc; dải ng\u0026acirc;n h\u0026agrave;\u003cbr\u003e1 T\u0026oacute;c gi\u0026oacute; sao\u003cbr\u003e1 Mặt Ma Kết chăm chỉ\u003cbr\u003e1 Đầm trời sao Bắc Đẩu\u003cbr\u003e1 Gi\u0026agrave;y sao Bắc Đẩu\u003cbr\u003e1 S\u0026aacute;ch về c\u0026aacute;c ch\u0026ograve;m sao\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/911111740o0qA.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91111052": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111052",
                "promotionID": "",
                "productName": "Gói Thiên Bình nữ",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 T\u0026oacute;c tết \u0026aacute;nh sao\u003cbr\u003e1 Kẹp t\u0026oacute;c ng\u0026acirc;n h\u0026agrave;\u003cbr\u003e1 Mặt ng\u0026ocirc;i sao điềm tĩnh\u003cbr\u003e1 Đầm ng\u0026acirc;n h\u0026agrave;\u003cbr\u003e1 Gi\u0026agrave;y cao g\u0026oacute;t ng\u0026acirc;n h\u0026agrave;\u003cbr\u003e1 Đũa ph\u0026eacute;p sao Thi\u0026ecirc;n B\u0026igrave;nh\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111052.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110085": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110085",
                "promotionID": "",
                "productName": "Gói Trường học MATETSU",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ nồi [MATETSU]\u003cbr /\u003e1 Đồng phục [MATETSU]\u003cbr /\u003e1 Gi\u0026agrave;y thể thao [MATETSU]\u003cbr /\u003e1 Ba l\u0026ocirc; [MATETSU]\u003cbr /\u003e1 Xe trượt điện [MATETSU]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110085.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 199000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91100047": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100047",
                "promotionID": "",
                "productName": "Gói LINE FRIENDS",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Trang phục BROWN\u003cbr /\u003e1 T\u0026uacute;i SALLY\u003cbr /\u003e1 Cần c\u0026acirc;u SALLY\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100047.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91100284": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100284",
                "promotionID": "",
                "productName": "Cần câu sồi tím",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Cần c\u0026acirc;u sồi t\u0026iacute;m\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100284.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 79000.0,
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
            "91110998": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110998",
                "promotionID": "",
                "productName": "Gói Xử Nữ thông minh",
                "productGroup": "G13",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e1 Vương miện ngọc lục bảo\u003cbr\u003e1 T\u0026oacute;c chải một b\u0026ecirc;n th\u0026ocirc;ng minh\u003cbr\u003e1 Mặt \u0026aacute;nh mắt th\u0026ocirc;ng minh\u003cbr\u003e1 Bộ đồ vườn lục bảo\u003cbr\u003e1 Gi\u0026agrave;y trang trọng xanh lục bảo\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110998.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91110877": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110877",
                "promotionID": "",
                "productName": "PlayBoo Box 1",
                "productGroup": "G3",
                "description": "PlayBoo Box 1",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110877.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 60000.0,
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
            "91100286": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100286",
                "promotionID": "",
                "productName": "Hope in Love UNIVERSTAR BT21!",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u0026nbsp;\u003c/span\u003e\u003cbr /\u003e1 C\u0026acirc;y sồi t\u0026iacute;m\u003cbr /\u003e1 S\u0026agrave;n tr\u0026ograve;n bằng gỗ\u003cbr /\u003e1 V\u0026ograve;m s\u0026acirc;n khấu Hope in Love\u003cbr /\u003e1 Hộp nhạc Hope in Love\u003cbr /\u003e2 Loa sồi t\u0026iacute;m (L)\u003cbr /\u003e2 Loa sồi t\u0026iacute;m (M)\u003cbr /\u003e6 Đ\u0026egrave;n sồi t\u0026iacute;m\u0026nbsp;\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100286.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110878": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110878",
                "promotionID": "",
                "productName": "PlayBoo Box 10",
                "productGroup": "G3",
                "description": "PlayBoo Box 10",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110878.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 540000.0,
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
            "91111069": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111069",
                "promotionID": "",
                "productName": "Gói sơ mi caro cơ bản ORBIT trắng ngà",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 K\u0026iacute;nh tr\u0026ograve;n ORBIT (m\u0026agrave;u be) \u003cbr\u003e1 Sơ mi caro cơ bản ORBIT (trắng ng\u0026agrave;) \u003cbr\u003e1 Quần ORBIT ti\u0026ecirc;u chuẩn (n\u0026acirc;u) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111069.png",
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
            "91111068": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111068",
                "promotionID": "",
                "productName": "Gói sơ mi caro cơ bản ORBIT đen",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 K\u0026iacute;nh m\u0026aacute;t tr\u0026ograve;n ORBIT (xanh navy) \u003cbr\u003e1 Sơ mi caro cơ bản ORBIT (đen) \u003cbr\u003e1 Quần ORBIT ti\u0026ecirc;u chuẩn (x\u0026aacute;m) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute; \u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111068.png",
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
            "91111067": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111067",
                "promotionID": "",
                "productName": "Gói sơ mi túi cơ bản ORBIT trắng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 K\u0026iacute;nh tr\u0026ograve;n ORBIT (đen) \u003cbr\u003e1 Sơ mi t\u0026uacute;i cơ bản ORBIT (trắng) \u003cbr\u003e1 Quần ORBIT ti\u0026ecirc;u chuẩn (denim nhạt) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111067.png",
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
            "91110535": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110535",
                "promotionID": "",
                "productName": "Gói đá tăng cường #2",
                "productGroup": "G3",
                "description": "\u003cp\u003eG\u0026oacute;i đ\u0026aacute; tăng cường #2\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110535.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 20000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110414": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110414",
                "promotionID": "",
                "productName": "Gói UNIVERSTAR BT21 KOYA",
                "productGroup": "G6",
                "description": "\u003cdiv\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Trang phục KOYA\u003c/div\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110414.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 149000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91600089": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91600089",
                "promotionID": "",
                "productName": "Bọ rùa KM",
                "productGroup": "G5",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003e1 Đồ ngủ bọ r\u0026ugrave;a \u003cbr /\u003e1 Gi\u0026agrave;y bọ r\u0026ugrave;a\u003cbr /\u003e1 C\u0026aacute;nh bọ r\u0026ugrave;a\u003cbr /\u003e1 Xe bọ r\u0026ugrave;a\u003cbr /\u003e1 Đồ chơi bọ r\u0026ugrave;a\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91600089Rvysr.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91111062": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111062",
                "promotionID": "",
                "productName": "Gói sơ mi xắn tay hàng ngày ORBIT xanh nhạt",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 K\u0026iacute;nh m\u0026aacute;t tr\u0026ograve;n ORBIT (trắng) \u003cbr\u003e1\u0026nbsp;Sơ mi xắn tay h\u0026agrave;ng ng\u0026agrave;y ORBIT ( xanh nhạt) \u003cbr\u003e1 Quần form vừa ORBIT (trắng) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m :\u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e 5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111062.png",
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
            "91111061": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111061",
                "promotionID": "",
                "productName": "Gói sơ mi xắn tay hàng ngày ORBIT trắng",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 K\u0026iacute;nh tr\u0026ograve;n ORBIT (da b\u0026aacute;o nhạt) \u003cbr\u003e1 Sơ mi xắn tay h\u0026agrave;ng ng\u0026agrave;y ORBIT (trắng) \u003cbr\u003e1 Quần form vừa ORBIT (xanh denim) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111061.png",
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
            "91110091": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110091",
                "promotionID": "",
                "productName": "Gói Trường học WOOPY",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ nồi [WOOPY]\u003cbr /\u003e1 Đồng phục [WOOPY]\u003cbr /\u003e1 Gi\u0026agrave;y thể thao [WOOPY]\u003cbr /\u003e1 Ba l\u0026ocirc; [WOOPY]\u003cbr /\u003e1 Xe trượt điện [WOOPY]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110091.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 199000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111060": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111060",
                "promotionID": "",
                "productName": "Gói sơ mi caro hàng ngày ORBIT trắng ngà",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 K\u0026iacute;nh tr\u0026ograve;n ORBIT (trắng ng\u0026agrave;) \u003cbr\u003e1 Sơ mi caro h\u0026agrave;ng ng\u0026agrave;y ORBIT (trắng ng\u0026agrave;) \u003cbr\u003e1 Quần form vừa ORBIT (n\u0026acirc;u) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111060.png",
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
            "91110092": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110092",
                "promotionID": "",
                "productName": "Gói Trường học PODONG",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ nồi [PODONG]\u003cbr /\u003e1 Đồng phục [PODONG]\u003cbr /\u003e1 Gi\u0026agrave;y thể thao [PODONG]\u003cbr /\u003e1 Ba l\u0026ocirc; [PODONG]\u003cbr /\u003e1 Xe trượt điện [PODONG]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110092.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 199000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111066": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111066",
                "promotionID": "",
                "productName": "Gói sơ mi túi cơ bản ORBIT đen",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 K\u0026iacute;nh m\u0026aacute;t tr\u0026ograve;n ORBIT (đen) \u003cbr\u003e1 Sơ mi t\u0026uacute;i cơ bản ORBIT (đen) \u003cbr\u003e1 Quần ORBIT ti\u0026ecirc;u chuẩn (x\u0026aacute;m đậm) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111066.png",
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
            "91111065": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111065",
                "promotionID": "",
                "productName": "Gói sơ mi túi cơ bản ORBIT xanh da trời",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 K\u0026iacute;nh tr\u0026ograve;n ORBIT (n\u0026acirc;u) \u003cbr\u003e1 Sơ mi t\u0026uacute;i cơ bản ORBIT (xanh da trời) \u003cbr\u003e1\u0026nbsp;Quần ORBIT ti\u0026ecirc;u chuẩn (đen) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111065.png",
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
            "91111063": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111063",
                "promotionID": "",
                "productName": "Gói sơ mi xắn tay hàng ngày ORBIT choco",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 K\u0026iacute;nh tr\u0026ograve;n ORBIT (da b\u0026aacute;o) \u003cbr\u003e1 Sơ mi xắn tay h\u0026agrave;ng ng\u0026agrave;y ORBIT (choco) \u003cbr\u003e1 Quần forrm vừa ORBIT (n\u0026acirc;u đỏ) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111063.png",
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
            "91100056": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100056",
                "promotionID": "",
                "productName": "Gói Phòng nghỉ LINE FRIENDS",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 M\u0026aacute;y đĩa SALLY\u003cbr /\u003e1 Tủ lạnh BROWN LỚN\u003cbr /\u003e5 Khối BROWN\u003cbr /\u003e5 Khối SALLY\u003cbr /\u003e5 Khối CONY\u003cbr /\u003e1 Đ\u0026egrave;n mặt trăng SALLY\u003cbr /\u003e1 Sofa đơn BROWN\u003cbr /\u003e1 Tủ ngăn k\u0026eacute;o SALLY \u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91100056.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 249000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 10,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110090": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110090",
                "promotionID": "",
                "productName": "Gói Trường học RURU",
                "productGroup": "G6",
                "description": "\u003cp\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003cbr /\u003e1 Mũ nồi [RURU]\u003cbr /\u003e1 Đồng phục [RURU]\u003cbr /\u003e1 Gi\u0026agrave;y thể thao [RURU]\u003cbr /\u003e1 Ba l\u0026ocirc; [RURU]\u003cbr /\u003e1 Xe trượt điện [RURU]\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110090.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 199000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110420": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110420",
                "promotionID": "",
                "productName": "Gói UNIVERSTAR BT21 COOKY",
                "productGroup": "G6",
                "description": "\u003cdiv\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Trang phục của COOKY\u003c/div\u003e\r\r\r\n\u003cdiv\u003e\u0026nbsp;\u003c/div\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110420.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 149000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91111079": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111079",
                "promotionID": "",
                "productName": "TWINKLEPING",
                "productGroup": "G15",
                "description": "TWINKLEPING",
                "image": "https://stc-sot.vcdn.vn/ws-content/uploads//PTG-ZINGPAY-1-LIVE/image/product/1436322481651716096.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 79000.0,
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
            "91111078": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111078",
                "promotionID": "",
                "productName": "SPARKLEPING",
                "productGroup": "G15",
                "description": "SPARKLEPING",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111078.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 79000.0,
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
            "91111070": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111070",
                "promotionID": "",
                "productName": "Gói sơ mi caro cơ bản ORBIT xanh navy",
                "productGroup": "G16",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 K\u0026iacute;nh m\u0026aacute;t tr\u0026ograve;n ORBIT (x\u0026aacute;m) \u003cbr\u003e1 Sơ mi caro cơ bản ORBIT (xanh navy) \u003cbr\u003e1 Quần ORBIT ti\u0026ecirc;u chuẩn (x\u0026aacute;m nhạt) \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e5 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111070.png",
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
            "91100735": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100735",
                "promotionID": "91100735I64vI",
                "productName": "Ngày anh đào ngọt ngào",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr /\u003e1 Pogo tim anh đ\u0026agrave;o ngọt ng\u0026agrave;o\u003cbr /\u003e1 Bộ kẹp t\u0026oacute;c mix nhiều m\u0026agrave;u sắc\u003cbr /\u003e1 T\u0026oacute;c b\u0026iacute;m tươi tắn\u003cbr /\u003e1 Mặt \u0026aacute;nh mắt anh đ\u0026agrave;o rạng rỡ\u003cbr /\u003e1 Yếm liền quần anh đ\u0026agrave;o ngọt ng\u0026agrave;o\u003cbr /\u003e1 Gi\u0026agrave;y thể thao anh đ\u0026agrave;o mềm mại\u003c/p\u003e\r\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e20 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-sot.vcdn.vn/ws-content/uploads//PTG-ZINGPAY-1-LIVE/image/product/1520501626857721856.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
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
            "91111077": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91111077",
                "promotionID": "",
                "productName": "SHIMMERPING",
                "productGroup": "G15",
                "description": "SHIMMERPING",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91111077.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 79000.0,
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
            "91130010": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130010",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Hạt bí ngô",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e5 Hạt b\u0026iacute; ng\u0026ocirc; \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91130010.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91130009": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130009",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Hạt dưa hấu",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e5 Hạt dưa hấu \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e20 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91130009.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 100000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91130008": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130008",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Hạt xoài",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 Hạt xo\u0026agrave;i \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91130008.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 150000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91102006": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91102006",
                "promotionID": "",
                "productName": "Chọn công cụ Chào mừng!",
                "productGroup": "G4",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave; :\u003c/strong\u003e\u003cbr /\u003eBạn c\u0026oacute; thể \u003cstrong\u003echọn 1 trong 3 m\u0026oacute;n\u003c/strong\u003e c\u0026ocirc;ng cụ sau đ\u0026acirc;y với gi\u0026aacute; si\u0026ecirc;u ưu đ\u0026atilde;i !\u003cbr /\u003e1 G\u0026oacute;i Cần c\u0026acirc;u b\u0026uacute;a thần\u003cbr /\u003eHOẶC\u003cbr /\u003e1 G\u0026oacute;i B\u0026uacute;a sấm set\u003cbr /\u003eHOẶC\u003cbr /\u003e1 Vợt \u0026aacute;nh sao mơ m\u0026agrave;ng\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/9110200654pba.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 150000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91130007": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130007",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Hạt dừa",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;: \u003c/strong\u003e\u003cbr\u003e1 hạt dừa \u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91130007.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 150000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91100741": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91100741",
                "promotionID": "91100741CCFb0",
                "productName": "Sương giá mùa xuân",
                "productGroup": "G3",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr /\u003e1 K\u0026iacute;nh r\u0026acirc;m vu\u0026ocirc;ng nhẹ\u003cbr /\u003e1 T\u0026oacute;c hai khối mềm mại\u003cbr /\u003e1 Mặt \u0026aacute;nh mắt trong trẻo\u003cbr /\u003e1 Khuy\u0026ecirc;n tai h\u0026agrave;nh tinh lủng lẳng\u003cbr /\u003e1 Len cộc tay Argyle xanh\u003cbr /\u003e1 Quần denim t\u0026uacute;i hộp sao\u003cbr /\u003e1 Gi\u0026agrave;y thể thao sao sương gi\u0026aacute;\u003cbr /\u003e1 M\u0026aacute;y ảnh vintage xanh\u003c/p\u003e\r\n\u003cp\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: #ff00ff;\"\u003e15 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://stc-billing.mto.zing.vn/ptg/91100741CCFb0.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 80000.0,
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
            "91130006": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91130006",
                "promotionID": "https://stc-billing.mto.zing.vn/ptg/",
                "productName": "Hạt nhân sâm",
                "productGroup": "G17",
                "description": "\u003cp\u003e\u003cstrong\u003eQu\u0026agrave;:\u003c/strong\u003e\u003cbr\u003e5 Hạt nh\u0026acirc;n s\u0026acirc;m\u003cbr\u003e\u003cbr\u003e\u003cstrong\u003eTặng th\u0026ecirc;m : \u003cspan style\u003d\"color: rgb(191, 39, 252);\"\u003e30 đ\u0026aacute; qu\u0026yacute;\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91130006.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 180000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 7,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110417": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110417",
                "promotionID": "",
                "productName": "Gói UNIVERSTAR BT21 MANG",
                "productGroup": "G6",
                "description": "\u003cdiv\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Trang phục MANG\u003c/div\u003e\r\r\r\n\u003cdiv\u003e\u0026nbsp;\u003c/div\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110417.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 149000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110418": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110418",
                "promotionID": "",
                "productName": "Gói UNIVERSTAR BT21 CHIMMY",
                "productGroup": "G6",
                "description": "\u003cdiv\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Trang phục CHIMMY\u003c/div\u003e\r\r\r\n\u003cdiv\u003e\u0026nbsp;\u003c/div\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110418.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 149000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110536": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110536",
                "promotionID": "",
                "productName": "Gói đá tăng cường #3",
                "productGroup": "G3",
                "description": "\u003cp\u003eG\u0026oacute;i đ\u0026aacute; tăng cường #3\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110536.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 110000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 1,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110415": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110415",
                "promotionID": "",
                "productName": "Gói UNIVERSTAR BT21 RJ",
                "productGroup": "G6",
                "description": "\u003cdiv\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Trang phục RJ\u003c/div\u003e\r\r\r\n\u003cdiv\u003e\u0026nbsp;\u003c/div\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110415.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 149000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110537": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110537",
                "promotionID": "",
                "productName": "Gói đá tăng cường #4",
                "productGroup": "G3",
                "description": "\u003cp\u003eG\u0026oacute;i đ\u0026aacute; tăng cường #4\u003c/p\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110537.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 200000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 6,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 1,
                "limit": {
                    "maxQuantity": 1
                }
            },
            "91110416": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110416",
                "promotionID": "",
                "productName": "Gói UNIVERSTAR BT21 SHOOKY",
                "productGroup": "G6",
                "description": "\u003cdiv\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Trang phục SHOOKY\u003c/div\u003e\r\r\r\n\u003cdiv\u003e\u0026nbsp;\u003c/div\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110416.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 149000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            },
            "91110419": {
                "enable": 1,
                "hidden": 0,
                "sellingProductID": "91110419",
                "promotionID": "",
                "productName": "Gói UNIVERSTAR BT21 TATA",
                "productGroup": "G6",
                "description": "\u003cdiv\u003e\u003cspan class\u003d\"bold\" style\u003d\"font-weight: bold;\"\u003eQu\u0026agrave;:\u003c/span\u003e\u003c/div\u003e\r\r\r\n\u003cdiv\u003e1 Trang phục TATA\u003c/div\u003e\r\r\r\n\u003cdiv\u003e\u0026nbsp;\u003c/div\u003e",
                "image": "https://scdn-stc-billing.vnggames.com/ptg/91110419.png",
                "productType": "PACKAGE",
                "prices": {
                    "VND": {
                        "currency": "VND",
                        "price": 149000.0,
                        "convertionRate": 0.0
                    }
                },
                "inGameCurrency": "Gem",
                "orderDisplay": 2,
                "sellFromDate": -1,
                "sellToDate": -1,
                "isSubscription": 0,
                "isLimitedProduct": 0
            }
        }
    }
}
