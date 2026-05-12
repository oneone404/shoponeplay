cái thứ 3 là nhập code, logic trang nhập code như sau:

import requests
import json

API_URL = "https://vgrapi-sea.vnggames.com/coordinator/api/v1/code/redeem"

HEADERS = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'vi-VN,vi;q=0.9,en-GB;q=0.8,en;q=0.7,fr-FR;q=0.6,fr;q=0.5,en-US;q=0.4',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    'origin': 'https://giftcode.vnggames.com',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://giftcode.vnggames.com/',
    'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
    'x-client-region': 'VN',
}

# Error code meanings
ERROR_CODES = {
    2108: "Code đã được sử dụng",
    2105: "ID nhân vật sai hoặc tài khoản không tồn tại",
    2106: "Code không tồn tại",
    2121: "Hạn mức nhập code đã hết"
}

def redeem_code(server_id, game_code, role_id, role_name, code, proxy=None, timeout=15):
    """
    Redeem code API

    Args:
        server_id: Server ID
        game_code: Game code
        role_id: Character ID (roleId)
        role_name: Character name (roleName)
        code: Gift code to redeem
        proxy: Proxy URL (e.g., "http://ip:port:user:pass" or "socks5://ip:port")
        timeout: Request timeout in seconds

    Returns:
        dict with keys: 'success', 'error_code', 'message'
    """
    payload = {
        'serverId': server_id,
        'gameCode': game_code,
        'roleId': role_id,
        'roleName': role_name,
        'code': code,
    }

    proxies = None
    if proxy:
        # Convert proxy format: ip:port:user:pass -> http://user:pass@ip:port
        if ':' in proxy:
            parts = proxy.split(':')
            if len(parts) == 4:
                ip, port, user, pwd = parts
                proxy_url = f"http://{user}:{pwd}@{ip}:{port}"
                proxies = {
                    'http': proxy_url,
                    'https': proxy_url
                }
            elif len(parts) == 2:
                ip, port = parts
                proxy_url = f"http://{ip}:{port}"
                proxies = {
                    'http': proxy_url,
                    'https': proxy_url
                }

    try:
        response = requests.post(API_URL, headers=HEADERS, json=payload,
                                proxies=proxies, timeout=timeout)

        result = response.json()

        if 'errorCode' in result:
            error_code = result['errorCode']
            message = result.get('message', '')

            # Special case: errorCode = 1 with "Success" message means success
            if error_code == 1 and message.lower() == "success":
                return {
                    'success': True,
                    'error_code': 0,
                    'message': 'Success'
                }

            error_msg = ERROR_CODES.get(error_code, "Unknown error")
            return {
                'success': False,
                'error_code': error_code,
                'message': error_msg
            }
        else:
            return {
                'success': True,
                'error_code': 0,
                'message': result.get('message', 'Success')
            }

    except requests.exceptions.Timeout:
        return {
            'success': False,
            'error_code': -1,
            'message': 'Request timeout'
        }
    except Exception as e:
        return {
            'success': False,
            'error_code': -2,
            'message': f'Error: {str(e)}'
        }


if __name__ == "__main__":
    # Test example
    test_server_id = "2"
    test_game_code = "661"
    test_role_id = "2JED-ZTRL-LMYU"
    test_role_name = "2JED-ZTRL-LMYU"
    test_code = "2026PT5HBD"

    print("Testing redeem code API...")
    print(f"API URL: {API_URL}\n")

    result = redeem_code(test_server_id, test_game_code, test_role_id, test_role_name, test_code)
    print(json.dumps(result, indent=2, ensure_ascii=False))


trang này sẽ dùng các id đc lưu trong db để nhập hoặc nhập bằng danh sách id do user nhập vào, có 2 chế độ như thế,
ô nhập code sẽ cũng nhập đc nhiều code để nhập sll
- card cấu hình: tự động  nhập  khi có code mới cho danh sách id của user đó.
- tạm thời như vạy trước, hãy lập plan và còn cần gì thì hỏi tôi
