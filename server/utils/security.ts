import { H3Event, getHeader, getCookie, createError } from 'h3'

const CSRF_COOKIE = process.env.COOKIE_CSRT || 'csrf'
const PUBLIC_ORIGIN = process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export function setStrictCookies(event: H3Event, name: string, value: string, maxAge?: number) {
  // secure=true untuk production HTTPS
  const secure = process.env.NODE_ENV === 'production'
  setCookie(event, name, value, {
    httpOnly: name !== CSRF_COOKIE, // CSRF cookie harus bisa diakses JS (double-submit pattern)
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge
  })
}

export function assertCsrf(event: H3Event) {
  const method = event.method.toUpperCase()
  if (['GET','HEAD','OPTIONS'].includes(method)) return
  const headerToken = getHeader(event, 'x-csrf-token')
  const cookieToken = getCookie(event, CSRF_COOKIE)
  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    throw createError({ statusCode: 403, statusMessage: 'Bad CSRF token' })
  }
  // Origin/Referer same-origin (mitigasi CSRF tambahan)
  const origin = getHeader(event, 'origin') || ''
  if (origin && !origin.startsWith(PUBLIC_ORIGIN)) {
    throw createError({ statusCode: 403, statusMessage: 'Invalid origin' })
  }
}
