// server/api/auth/login.post.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { createError } from 'h3'
import { handle } from '../../../server/utils/handler' // sesuaikan path jika berbeda
import { signJwt } from '../../../server/utils/jwt'
import { LoginSchema } from '../../schemas/auth'

const prisma = new PrismaClient()

export default defineEventHandler((event) =>
  handle(event, async () => {
    // 1) Validasi (biarkan Zod melempar error -> ditangani handler)
    const body = await readBody(event)
    const { email, password } = LoginSchema.parse(body)

    // 2) Cari user & verifikasi password
    const user = await prisma.employee.findUnique({ where: { email } })
    const ok = user && (await bcrypt.compare(password, user.passwordHash))
    if (!ok) {
      // Ditangani oleh handler sebagai error H3 dengan statusCode
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
        data: { code: 'AUTH_INVALID' },
      })
    }

    // 3) Buat JWT & set cookie
    const config = useRuntimeConfig()
    const token = signJwt({ sub: user.id }, config.jwtSecret as string, 60 * 60 * 24)

    setCookie(event, 'token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    })

    // 4) Kembalikan data yang perlu (handler akan bungkus: { success: true, data })
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }
  }),
)
