import { useAuth } from "../composables/useAuth"
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/login') {
    const { isAuthenticated } = useAuth()
    if (isAuthenticated.value) return navigateTo('/admin')
  }
})
