import { verifyJwt } from '../../../server/utils/jwt'
import { ok, fail } from '../../../server/utils/responseWrapper'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'token')
  if (!token) { setResponseStatus(event, 401); return fail('No token', 'AUTH_NO_TOKEN', 401) }

  try {
    const payload = verifyJwt(token, useRuntimeConfig().jwtSecret as string)
    return ok({ valid: true, sub: payload.sub })
  } catch {
    setResponseStatus(event, 401)
    return fail('Invalid token', 'AUTH_INVALID_TOKEN', 401)
  }
})
