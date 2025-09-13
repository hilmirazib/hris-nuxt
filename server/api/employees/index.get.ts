import { PrismaClient } from '@prisma/client'
import { EmployeeTransformer } from '~/server/transformers/employee.transformer'
const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  const employees = await prisma.employee.findMany({ where: { isDeleted: false } })
  return { success: true, data: EmployeeTransformer.collection(employees) }
})
