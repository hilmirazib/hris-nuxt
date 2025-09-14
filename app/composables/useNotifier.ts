import { toast, type ToastOptions } from 'vue3-toastify'

type Kind = 'success' | 'error' | 'info' | 'warning' | 'loading'
const recent = new Map<string, number>() // anti-dupe sederhana

export function useNotifier() {
  const cfg = useRuntimeConfig()

  const base: ToastOptions = {
    position: 'top-right',
    autoClose: 3500,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'auto', // mengikuti prefers-color-scheme
  }

  function show(kind: Kind, message: string, opts?: ToastOptions, dedupeKey?: string) {
    // Anti-duplicate 2 detik
    if (dedupeKey) {
      const now = Date.now()
      const last = recent.get(dedupeKey) ?? 0
      if (now - last < 2000) return
      recent.set(dedupeKey, now)
    }

    const o = { ...base, ...opts }
    switch (kind) {
      case 'success': return toast.success(message, o)
      case 'error': return toast.error(message, o)
      case 'info': return toast.info(message, o)
      case 'warning': return toast.warning(message, o)
      case 'loading': return toast.loading(message, o)
    }
  }

  const success = (m: string, o?: ToastOptions, k?: string) => show('success', m, o, k)
  const error = (m: string, o?: ToastOptions, k?: string) => show('error', m, o, k)
  const info = (m: string, o?: ToastOptions, k?: string) => show('info', m, o, k)
  const warn = (m: string, o?: ToastOptions, k?: string) => show('warning', m, o, k)

  // Promise toast untuk async flow (loading → success/error)
  async function withPromise<T>(
    p: Promise<T>,
    texts: { loading?: string; success?: string | ((v: T) => string); error?: string | ((e: any) => string) },
    o?: ToastOptions
  ) {
    return toast.promise(
      p,
      {
        loading: texts.loading ?? 'Processing…',
        success: v => typeof texts.success === 'function' ? texts.success(v) : (texts.success ?? 'Done.'),
        error: e => typeof texts.error === 'function' ? texts.error(e) : (texts.error ?? 'Failed.'),
      },
      { ...base, ...o }
    )
  }

  // Ekspor juga toast asli bila perlu advanced API (update/dismiss)
  return { success, error, info, warn, withPromise, toast }
}
