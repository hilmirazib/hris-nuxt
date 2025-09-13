import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Example: Fetch all companies
  const companies = await prisma.company.findMany()
  return companies
})
