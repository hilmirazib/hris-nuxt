// server/utils/handler.ts
import { H3Event, setResponseStatus } from 'h3'
import { fail } from './response'

export async function handle<T>(event: H3Event, fn: () => Promise<T>) {
  try {
    const data = await fn()
    return { success: true, data }
  } catch (err: any) {
    // Prisma mapping
    if (err?.code) {
      if (err.code === 'P2002') {
        setResponseStatus(event, 409)
        return fail('P2002', 'Data sudah ada (unik).', { meta: err.meta })
      }
      if (err.code === 'P2025') {
        setResponseStatus(event, 404)
        return fail('P2025', 'Data tidak ditemukan.', { meta: err.meta })
      }
      if (err.code === 'P2024') {
        setResponseStatus(event, 503)
        return fail('P2024', 'Koneksi database timeout.', { meta: err.meta })
      }
    }

    // Zod error
    if (err?.name === 'ZodError') {
      setResponseStatus(event, 422)
      return fail('VALIDATION_ERROR', 'Input tidak valid.', err.flatten?.() ?? err.errors)
    }

    // JWT & Auth
    if (err?.name === 'TokenExpiredError') {
      setResponseStatus(event, 401)
      return fail('AUTH_EXPIRED', 'Sesi kedaluwarsa.')
    }
    if (err?.name === 'JsonWebTokenError') {
      setResponseStatus(event, 401)
      return fail('AUTH_INVALID', 'Token tidak valid.')
    }

    // H3 / Nuxt thrown errors with statusCode
    if (typeof err?.statusCode === 'number') {
      setResponseStatus(event, err.statusCode)
      return fail(err.code || 'ERROR', err.statusMessage || 'Terjadi kesalahan.', err.data)
    }

    // Fallback
    console.error('[UNHANDLED]', err)
    setResponseStatus(event, 500)
    return fail('INTERNAL', 'Terjadi kesalahan pada server.')
  }
}
