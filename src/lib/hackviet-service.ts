import fs from 'fs';
import path from 'path';

const COOKIE_FILE = path.join(process.cwd(), 'data', 'hackviet_cookies.json');

export interface HackVietConfig {
  baseUrl: string;
  email: string;
  password: string;
}

export class HackVietService {
  private config: HackVietConfig;

  constructor(config: HackVietConfig) {
    this.config = config;
  }

  private async getAuthHeaders(customCookies?: string) {
    if (!fs.existsSync(path.dirname(COOKIE_FILE))) {
      fs.mkdirSync(path.dirname(COOKIE_FILE), { recursive: true });
    }

    let cookies = customCookies;
    let xsrfToken = "";

    if (!cookies && fs.existsSync(COOKIE_FILE)) {
      try {
        const data = JSON.parse(fs.readFileSync(COOKIE_FILE, 'utf-8'));
        cookies = data.cookies || "";
      } catch (e) {
        cookies = "";
      }
    }

    if (cookies) {
      const match = cookies.match(/XSRF-TOKEN=([^;]+)/);
      if (match) xsrfToken = decodeURIComponent(match[1]);
    }

    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-TOKEN': xsrfToken,
      'Referer': `${this.config.baseUrl}/seller/keys`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Cookie': cookies || ""
    };
  }

  private async login() {
    const { baseUrl, email, password } = this.config;

    if (!baseUrl || !email || !password) {
      throw new Error("Chưa cấu hình thông tin HackViet trong cài đặt hệ thống.");
    }

    // 1. Get Initial Cookies & XSRF-TOKEN
    const initRes = await fetch(`${baseUrl}/login`, { 
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    });
    
    const setCookies = initRes.headers.getSetCookie();
    let xsrfToken = "";
    
    // Parse cookies
    const cookieJar: Record<string, string> = {};
    setCookies.forEach(cookieStr => {
      const parts = cookieStr.split(';')[0].split('=');
      const name = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      cookieJar[name] = value;
      if (name === 'XSRF-TOKEN') xsrfToken = decodeURIComponent(value);
    });

    const cookieString = Object.entries(cookieJar).map(([k, v]) => `${k}=${v}`).join('; ');
    
    // 2. Login POST
    const loginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': xsrfToken,
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': `${baseUrl}/login`,
        'Cookie': cookieString
      },
      body: JSON.stringify({ email, password, remember: true })
    });

    if (loginRes.ok) {
      const finalSetCookies = loginRes.headers.getSetCookie();
      const finalCookieJar = { ...cookieJar };
      finalSetCookies.forEach(cookieStr => {
        const parts = cookieStr.split(';')[0].split('=');
        finalCookieJar[parts[0].trim()] = parts.slice(1).join('=').trim();
      });
      
      const finalCookieString = Object.entries(finalCookieJar).map(([k, v]) => `${k}=${v}`).join('; ');
      fs.writeFileSync(COOKIE_FILE, JSON.stringify({ cookies: finalCookieString }));
      return finalCookieString;
    } else {
      const errorText = await loginRes.text();
      console.error(`[HACKVIET_LOGIN_FAILED] Status: ${loginRes.status}, Body: ${errorText}`);
      throw new Error("Đăng nhập HackViet thất bại. Vui lòng kiểm tra lại Email/Mật khẩu trong cài đặt.");
    }
  }

  async createVipKey(params: {
    game_id: number;
    duration_value: number;
    duration_type: 'day' | 'week' | 'month';
    device_limit: number;
    key_prefix: string;
  }) {
    const { baseUrl } = this.config;
    if (!baseUrl) throw new Error("HACKVIET_BASE_URL is missing");

    const callApi = async (retry = true): Promise<any> => {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${baseUrl}/api/seller/keys/bulk`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...params,
          status: 'active',
          is_vip: true,
          quantity: 1
        })
      });

      console.log(`[HACKVIET_API_CALL] Path: /api/seller/keys/bulk, Status: ${res.status}`);

      if (res.status === 401 || res.status === 419) {
        if (retry) {
          console.log(`[HACKVIET_API_RETRY] Token expired or invalid, attempting to re-login...`);
          await this.login();
          return callApi(false);
        }
      }

      if (!res.ok) {
        const errorData = await res.json();
        console.error(`[HACKVIET_API_ERROR] Status: ${res.status}, Message: ${JSON.stringify(errorData)}`);
        throw new Error(errorData.message || "Lỗi khi gọi API HackViet");
      }

      return await res.json();
    };

    return callApi();
  }

  async getKeyDetails(keyValue: string) {
    const { baseUrl } = this.config;
    const callApi = async (retry = true): Promise<any> => {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${baseUrl}/api/seller/keys?search=${encodeURIComponent(keyValue)}`, {
        method: 'GET',
        headers
      });

      if (res.status === 401 || res.status === 419) {
        if (retry) {
          await this.login();
          return callApi(false);
        }
      }

      if (!res.ok) throw new Error("Không thể tìm thấy thông tin Key");
      
      const result = await res.json();
      const keyData = result.data.find((k: any) => k.key === keyValue);
      if (!keyData) throw new Error("Mã Key không tồn tại trên hệ thống đối tác");
      
      return keyData;
    };
    return callApi();
  }

  async resetDevices(keyId: number) {
    const { baseUrl } = this.config;
    const callApi = async (retry = true): Promise<any> => {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${baseUrl}/api/seller/keys/${keyId}/devices/reset`, {
        method: 'POST',
        headers
      });

      if (res.status === 401 || res.status === 419) {
        if (retry) {
          await this.login();
          return callApi(false);
        }
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Lỗi khi reset thiết bị");
      }
      return await res.json();
    };
    return callApi();
  }

  async deleteDevices(keyId: number, deviceIds: string[]) {
    const { baseUrl } = this.config;
    const callApi = async (retry = true): Promise<any> => {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${baseUrl}/api/seller/keys/${keyId}/devices/delete`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ device_ids: deviceIds })
      });

      if (res.status === 401 || res.status === 419) {
        if (retry) {
          await this.login();
          return callApi(false);
        }
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Lỗi khi xóa thiết bị");
      }
      return await res.json();
    };
    return callApi();
  }

  // --- FREE KEY SYSTEM METHODS ---

  async initFreeKeySession(shopSlug: string, gameSlug: string) {
    const { baseUrl } = this.config;
    const res = await fetch(`${baseUrl}/api/free-key/session`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ shop_slug: shopSlug, game_slug: gameSlug })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Không thể khởi tạo phiên lấy key free");
    }

    const data = await res.json();
    const sessionCode = data.session_code || data.data?.session_code;
    
    return {
      session_code: sessionCode,
      cookies: res.headers.getSetCookie().join('; ')
    };
  }

  async bypassFreeKeyLink(sessionCode: string, shopSlug: string, initialCookies: string) {
    const { baseUrl } = this.config;
    let currentUrl = `${baseUrl}/r/free/${sessionCode}?slug=${shopSlug}`;
    let cookies = initialCookies;

    // Simulate redirect steps (Step 2 in doc)
    for (let i = 0; i < 5; i++) { // Max 5 redirects
      const res = await fetch(currentUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Cookie': cookies,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
        },
        redirect: 'manual'
      });

      // Collect new cookies
      const newCookies = res.headers.getSetCookie().join('; ');
      if (newCookies) cookies = this.mergeCookies(cookies, newCookies);

      if (res.status === 301 || res.status === 302) {
        currentUrl = res.headers.get('location') || "";
        if (!currentUrl.startsWith('http')) {
          currentUrl = new URL(currentUrl, baseUrl).toString();
        }
      } else {
        break; // No more redirects
      }
    }

    return cookies;
  }

  async claimFreeKey(sessionCode: string, cookies: string, shopSlug: string) {
    const { baseUrl } = this.config;
    const headers = await this.getAuthHeaders(cookies);
    
    // As per Step 3 requirement
    headers['Referer'] = `${baseUrl}/shop/${shopSlug}/free-key-success/${sessionCode}`;

    const res = await fetch(`${baseUrl}/api/free-key/claim`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ session_code: sessionCode })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Lấy key free thất bại");
    }

    return await res.json();
  }

  private mergeCookies(oldCookies: string, newCookies: string): string {
    const cookieJar: Record<string, string> = {};
    
    [oldCookies, newCookies].forEach(str => {
      if (!str) return;
      str.split(';').forEach(c => {
        const parts = c.trim().split('=');
        if (parts.length >= 2) {
          cookieJar[parts[0]] = parts.slice(1).join('=');
        }
      });
    });

    return Object.entries(cookieJar).map(([k, v]) => `${k}=${v}`).join('; ');
  }
}
