export const ok = (data: any) => ({ success: true, data })
export const fail = (message: string, code?: string) => ({ success: false, error: { message, code } })
