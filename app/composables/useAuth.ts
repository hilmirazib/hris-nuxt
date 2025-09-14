import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { authService } from '../services/auth.service'
import { computed } from 'vue'

export const useAuth = () => {
  const store = useAuthStore()
  const { token, user } = storeToRefs(store)

  const login = async (payload: { email: string; password: string }) => {
    const res = await authService.login(payload)
    if ((res as any)?.success) {
      store.setToken((res as any).data.token)
      // Ambil profil supaya state siap
      const me: any = await authService.me().catch(() => null)
      if (me?.success) store.setUser(me.data)
    }
    return res
  }

  const logout = async () => {
    await authService.logout()
    store.reset()
  }

  const isAuthenticated = computed(() => !!token.value)

  const verify = async () => {
    try { await authService.verify(); return true } catch { return false }
  }

  return { token, user, isAuthenticated, login, logout, verify }
}
