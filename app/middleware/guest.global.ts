// middleware/guest.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const guestOnly = /^\/(login|register|forgot)/.test(to.path)
  if (!guestOnly) return

  const { isAuthenticated, verify } = useAuth()

  if (isAuthenticated.value) {
    return navigateTo('/admin', { replace: true })
  }

  const ok = await verify().catch(() => false)
  if (ok) {
    const next = typeof to.query.next === 'string' ? to.query.next : '/admin'
    const safeNext = next.startsWith('/login') ? '/admin' : next
    return navigateTo(safeNext, { replace: true })
  }
})
