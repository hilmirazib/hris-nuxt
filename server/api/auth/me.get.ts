import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { EmployeeTransformer } from '~~/server/transformers/employee.transformer'
import { ok, fail } from '../../../server/utils/responseWrapper'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  if (!token) { setResponseStatus(event, 401); return fail('No token', 'AUTH_NO_TOKEN', 401) }

  try {
    const { jwtSecret } = useRuntimeConfig()
    const payload = jwt.verify(token, jwtSecret)
    // @ts-ignore
    const employeeId = Number(payload.sub)
    const employee = await prisma.employee.findUnique({ where: { id: employeeId } })
    if (!employee) { setResponseStatus(event, 404); return fail('User not found', 'USER_NOT_FOUND', 404) }
    return ok(EmployeeTransformer.one(employee))
  } catch {
    setResponseStatus(event, 401)
    return fail('Invalid token', 'AUTH_INVALID_TOKEN', 401)
  }
})
