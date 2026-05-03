import { unlink } from "fs/promises"
import path from "path"

/**
 * Xóa file vật lý khỏi thư mục public/uploads
 * @param url Đường dẫn tương đối (ví dụ: /uploads/products/image.webp)
 */
export async function deleteUploadFile(url: string | null | undefined) {
  if (!url || !url.startsWith("/uploads/")) return

  try {
    const filePath = path.join(process.cwd(), "public", url)
    await unlink(filePath)
    return true
  } catch (error) {
    console.error(`[FILE_DELETE_ERROR] ${url}:`, error)
    return false
  }
}

/**
 * Xóa danh sách các file
 */
export async function deleteUploadFiles(urls: string[] | any) {
  if (!urls || !Array.isArray(urls)) return

  return Promise.all(urls.map(url => deleteUploadFile(url)))
}
