import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  const company1 = await prisma.company.create({
    data: {
      name: 'Stark Industries',
      acronym: 'SI',
    },
  })
  console.log(`Created company with id: ${company1.id}`)

  const company2 = await prisma.company.create({
    data: {
      name: 'Wayne Enterprises',
      acronym: 'WE',
    },
  })
  console.log(`Created company with id: ${company2.id}`)

  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(`An error occurred during seeding:`, e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })