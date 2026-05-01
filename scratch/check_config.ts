import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const configs = await prisma.config.findMany()
  console.log('--- CURRENT CONFIGS IN DB ---')
  console.log(JSON.stringify(configs, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
