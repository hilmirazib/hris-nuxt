import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { EmployeeTransformer } from '~~/server/transformers/employee.transformer'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  if (!token) { setResponseStatus(event, 401); return { success: false, error: { message: 'No token' } } }

  try {
    const { jwtSecret } = useRuntimeConfig()
    const payload = jwt.verify(token, jwtSecret)
    // @ts-ignore
    const employeeId = Number(payload.sub)
    const employee = await prisma.employee.findUnique({ where: { id: employeeId } })
    if (!employee) { setResponseStatus(event, 404); return { success: false, error: { message: 'User not found' } } }
    return { success: true, data: EmployeeTransformer.one(employee) }
  } catch {
    setResponseStatus(event, 401)
    return { success: false, error: { message: 'Invalid token' } }
  }
})
