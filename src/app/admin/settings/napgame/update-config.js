const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const hotConfig = [
    { name: "Thành viên Plus (7 Ngày)", order: 1 },
    { name: "Thành Viên Bán Tức Thì", order: 2 },
    { name: "Thành viên Plus (30 Ngày)", order: 3 },
    { name: "Chọn công cụ Chào mừng!", order: 4 }
  ]

  await prisma.config.upsert({
    where: { key: "NAPGAME_HOT_CONFIG" },
    update: { value: JSON.stringify(hotConfig) },
    create: { key: "NAPGAME_HOT_CONFIG", value: JSON.stringify(hotConfig) }
  })

  await prisma.config.upsert({
    where: { key: "NAPGAME_MARKUP_PERCENT" },
    update: { value: "20" },
    create: { key: "NAPGAME_MARKUP_PERCENT", value: "20" }
  })

  await prisma.config.upsert({
    where: { key: "NAPGAME_ROUNDING_ENABLED" },
    update: { value: "true" },
    create: { key: "NAPGAME_ROUNDING_ENABLED", value: "true" }
  })

  console.log("Đã cập nhật cấu hình HOT cho Nap Game thành công!")
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
