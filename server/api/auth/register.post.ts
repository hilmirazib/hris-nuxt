import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { ok, fail } from '../../../server/utils/responseWrapper'

const prisma = new PrismaClient()
const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = RegisterSchema.safeParse(body)
  if (!parsed.success) { setResponseStatus(event, 400); return fail('Invalid payload', 'VALIDATION_ERROR', 400) }

  const { name, email, password } = parsed.data
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) { setResponseStatus(event, 409); return fail('Email in use', 'EMAIL_EXISTS', 409) }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { name, email, passwordHash } })
  return ok({ id: user.id })
})
