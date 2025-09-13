import { PrismaClient } from '@prisma/client'
import { EmployeeTransformer } from '../../transformers/employee.transformer'
import { defineEventHandler } from 'h3'
const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  const employees = await prisma.employee.findMany({ where: { isDeleted: false } })
  return { success: true, data: EmployeeTransformer.collection(employees) }
})
