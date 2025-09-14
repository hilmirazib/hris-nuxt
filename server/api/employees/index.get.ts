import { PrismaClient } from '@prisma/client'
import { EmployeeTransformer } from '../../transformers/employee.transformer'
import { defineEventHandler } from 'h3'
import { ok } from '../../../server/utils/responseWrapper'
const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  const employees = await prisma.employee.findMany({ where: { isDeleted: false } })
  return ok(EmployeeTransformer.collection(employees))
})
