// server/utils/uploadGuard.ts
import { H3Event, setResponseStatus } from 'h3'
import { fail } from './response'

export function guardUpload(event: H3Event, file: { mimetype?: string; size?: number }) {
  const cfg = useRuntimeConfig()
  const allowed = (cfg.allowedExtensions as string[]) || []
  const max = Number(cfg.uploadMaxSize) || 5 * 1024 * 1024

  if ((file.size ?? 0) > max) {
    setResponseStatus(event, 413)
    throw fail('PAYLOAD_TOO_LARGE', `Maksimal ${Math.round(max / 1024 / 1024)}MB.`)
  }

  const okExt = allowed.some(ext => (file.mimetype || '').includes(ext))
  if (!okExt) {
    setResponseStatus(event, 415)
    throw fail('UNSUPPORTED_MEDIA_TYPE', `Hanya: ${allowed.join(', ')}`)
  }
}
