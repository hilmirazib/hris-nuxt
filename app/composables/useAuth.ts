import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { authService } from '../services/auth.service'
import { computed } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const useAuth = () => {
  const store = useAuthStore()
  const { user } = storeToRefs(store)

  const login = async (payload: { email: string; password:string }) => {
    try {
      const res = await authService.login(payload)
      if ((res as any)?.success) {
        const me: any = await authService.me().catch(() => null)
        if (me?.success) store.setUser(me.data)
      }
      return res
    } catch (err: any) {
      const message = err.data?.message
      // toast.error(message)
      return null
    }
  }

  const logout = async () => {
    await authService.logout()
    store.reset()
  }

  const isAuthenticated = computed(() => !!user.value)

  const verify = async () => {
    try { await authService.verify(); return true } catch { return false }
  }

  return { user, isAuthenticated, login, logout, verify }
}
