// server/utils/response.ts
export type ApiOk<T> = { success: true; data: T }
export type ApiFail = {
  success: false
  error: {
    code: string          // e.g. VALIDATION_ERROR, AUTH_INVALID, P2002, NOT_FOUND
    message: string       // ringkas untuk user
    details?: any         // opsional: detail teknis/zod/prisma
  }
}
export const ok = <T>(data: T): ApiOk<T> => ({ success: true, data })
export const fail = (code: string, message: string, details?: any): ApiFail =>
  ({ success: false, error: { code, message, details } })
