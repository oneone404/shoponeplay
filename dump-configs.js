
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const configs = await prisma.config.findMany()
  console.log('---CONFIG_START---')
  console.log(JSON.stringify(configs, null, 2))
  console.log('---CONFIG_END---')
}

main().catch(console.error).finally(() => prisma.$disconnect())
