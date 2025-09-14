import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { LoginSchema } from '../../schemas/auth'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    setResponseStatus(event, 400)
    return fail('Invalid payload', 'VALIDATION_ERROR', 400)
  }

  const { email, password } = parsed.data
  const user = await prisma.employee.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    setResponseStatus(event, 401)
    return fail('Invalid credentials', 'AUTH_INVALID', 401)
  }

  const config = useRuntimeConfig()
  const token = signJwt({ sub: user.id }, config.jwtSecret as string, 60 * 60 * 24)

  setCookie(event, 'token', token, {
    httpOnly: true, sameSite: 'lax', secure: false, path: '/', maxAge: 60 * 60 * 24
  })

  // hanya kirim data aman ke client; detail lengkap distandardkan via transformer di repo
  return ok({ token }) // bisa juga kembalikan profile ringkas kalau mau
})
