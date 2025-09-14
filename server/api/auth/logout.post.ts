import { ok } from '../../../server/utils/responseWrapper'
export default defineEventHandler((event) => {
  deleteCookie(event, 'token', { path: '/' })
  return ok({ message: 'Logged out' })
})
