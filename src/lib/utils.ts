import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Tạo mã định danh ngắn gọn (Chữ hoa + Số) cho Đơn hàng, Giao dịch
 */
export function generateShortId(length = 10, prefix = "") {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function slugify(str: string) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/\W+/g, " ");
  str = str.replace(/\s/g, "-");
  str = str.replace(/[^a-zA-Z0-9\-]/g, "");
  str = str.replace(/-+/g, "-");
  str = str.replace(/^-+|-+$/g, "");
  return str;
}

export function generateUniqueSlug(title: string, id: string) {
  const baseSlug = slugify(title);
  // Cách pro: Lấy 4 ký tự cuối của ID để đảm bảo duy nhất mà vẫn đẹp
  const shortId = id.slice(-4); 
  return `${baseSlug}-${shortId}`;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + " VND";
}
