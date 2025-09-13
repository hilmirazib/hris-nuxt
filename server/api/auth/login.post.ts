import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { LoginSchema } from '../../schemas/auth'
import { defineEventHandler } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    setResponseStatus(event, 400)
    return { success: false, error: { message: 'Invalid payload' } }
  }
  const { email, password } = parsed.data
  const user = await prisma.employee.findUnique({ where: { email } })
  if (!user) {
    setResponseStatus(event, 401)
    return { success: false, error: { message: 'Invalid credentials' } }
  }
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    setResponseStatus(event, 401)
    return { success: false, error: { message: 'Invalid credentials' } }
  }
  const config = useRuntimeConfig()
  const token = jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: '1d' })
  // (opsional) set cookie HttpOnly
  setCookie(event, 'token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 86400 })
  return { success: true, data: { token } }
})
