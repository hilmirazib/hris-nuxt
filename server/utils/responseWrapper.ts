export const ok = <T>(data: T) => ({ success: true, data })
export const fail = (message: string, code?: string, status = 400) => ({
  success: false,
  error: { message, code, status }
})
