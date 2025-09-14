import { useAuth } from "../composables/useAuth"
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, verify } = useAuth()

  const needsAuth = to.path.startsWith('/admin')

  if (!needsAuth) return

  if (!isAuthenticated.value) {
    const ok = await verify()
    if (!ok) return navigateTo('/login?next=' + encodeURIComponent(to.fullPath))
  }
})
