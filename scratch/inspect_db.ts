import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const groups = await prisma.categoryGroup.findMany({
    include: {
      categories: {
        include: {
          _count: {
            select: { products: true }
          }
        }
      }
    }
  })
  
  console.log(JSON.stringify(groups, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
