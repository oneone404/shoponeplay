import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

  console.log("Đã cập nhật cấu hình HOT cho Nap Game thành công!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
