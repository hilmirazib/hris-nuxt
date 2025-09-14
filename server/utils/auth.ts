// server/utils/auth.ts
import jwt from 'jsonwebtoken'
import { H3Event, setResponseStatus } from 'h3'
import { fail } from './response'

export function requireAuth(event: H3Event) {
  const token = getCookie(event, 'token')
  if (!token) {
    setResponseStatus(event, 401)
    throw Object.assign(fail('AUTH_NO_TOKEN', 'Perlu login.'), { statusCode: 401 })
  }
  try {
    return jwt.verify(token, useRuntimeConfig().jwtSecret) as { sub: number }
  } catch (e: any) {
    setResponseStatus(event, 401)
    throw Object.assign(fail('AUTH_INVALID', 'Token tidak valid.'), { statusCode: 401 })
  }
}

export function requirePermission(has: boolean, code = 'FORBIDDEN') {
  if (!has) {
    const err: any = new Error('Akses ditolak.')
    err.statusCode = 403
    err.code = code
    throw err
  }
}
