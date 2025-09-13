export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated.value && to.path.startsWith('/admin')) {
    return navigateTo('/login')
  }
})
