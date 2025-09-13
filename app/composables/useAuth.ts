import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
export const useAuth = () => {
  const store = useAuthStore()
  const { user, token } = storeToRefs(store)
  const login = (payload: { email: string; password: string }) => store.login(payload)
  const logout = () => store.logout()
  const isAuthenticated = computed(() => !!token.value)
  return { user, token, login, logout, isAuthenticated }
}
