import { useAuth } from "../composables/useAuth"
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to: any) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated.value && to.path.startsWith('/admin')) {
    return navigateTo('/login')
  }
})
