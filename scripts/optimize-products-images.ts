import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import "dotenv/config"
import sharp from "sharp"
import fs from "fs/promises"
import path from "path"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "products")

async function main() {
  console.log("--- STARTING FOLDER-BASED IMAGE OPTIMIZATION ---")
  
  try {
    const files = await fs.readdir(UPLOADS_DIR)
    console.log(`Found ${files.length} files in ${UPLOADS_DIR}`)

    for (const file of files) {
      const ext = path.extname(file).toLowerCase()
      if (ext === ".webp" || ext === "") continue

      const absolutePath = path.join(UPLOADS_DIR, file)
      const baseName = path.basename(file, ext)
      const newFileName = `${baseName}.webp`
      const newAbsolutePath = path.join(UPLOADS_DIR, newFileName)
      
      const relativeUrl = `/uploads/products/${file}`
      const newRelativeUrl = `/uploads/products/${newFileName}`

      console.log(`Processing: ${file}...`)

      try {
        // 1. Convert to webp
        const buffer = await fs.readFile(absolutePath)
        await sharp(buffer)
          .webp({ quality: 80 })
          .toFile(newAbsolutePath)

        // 2. Update DB references (Thumbnail)
        const thumbUpdate = await prisma.product.updateMany({
          where: { thumbnail: relativeUrl },
          data: { thumbnail: newRelativeUrl }
        })

        // 3. Update DB references (Images array)
        // Note: images is Json, we need to handle it carefully. 
        // Simplest way is to find all products and update locally if needed
        const productsWithImages = await prisma.product.findMany({
          where: {
            images: {
              has: relativeUrl
            }
          }
        })

        for (const p of productsWithImages) {
          const oldImages = p.images as string[]
          const newImages = oldImages.map(img => img === relativeUrl ? newRelativeUrl : img)
          await prisma.product.update({
            where: { id: p.id },
            data: { images: newImages }
          })
        }

        // 4. Delete old file
        await fs.unlink(absolutePath)
        
        console.log(`  [OK] ${file} -> ${newFileName}. Updated ${thumbUpdate.count} thumbnails and ${productsWithImages.length} image arrays.`)
      } catch (err) {
        console.error(`  [ERROR] Failed to process ${file}:`, err)
      }
    }
  } catch (err) {
    console.error("Critical Error:", err)
  }

  console.log("--- STARTING ORPHANED IMAGE PRUNING ---")
  
  try {
    const remainingFiles = await fs.readdir(UPLOADS_DIR)
    console.log(`Checking ${remainingFiles.length} files for orphaned status...`)

    for (const file of remainingFiles) {
      if (file === "." || file === "..") continue
      
      const relativeUrl = `/uploads/products/${file}`
      
      // Kiểm tra xem có sản phẩm nào dùng ảnh này không
      const usedAsThumbnail = await prisma.product.findFirst({
        where: { thumbnail: relativeUrl }
      })
      
      const usedInGallery = await prisma.product.findFirst({
        where: {
          images: {
            has: relativeUrl
          }
        }
      })

      if (!usedAsThumbnail && !usedInGallery) {
        console.log(`Pruning orphaned file: ${file}`)
        await fs.unlink(path.join(UPLOADS_DIR, file))
      }
    }
  } catch (err) {
    console.error("Pruning Error:", err)
  }

  console.log("--- OPTIMIZATION & PRUNING COMPLETE ---")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })