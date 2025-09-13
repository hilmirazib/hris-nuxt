import { defineStore } from 'pinia'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null as any, token: '' }),
  actions: {
    async login(payload: { email: string; password: string }) {
      const res = await authService.login(payload)
      if (res?.success) this.token = (res.data as any).token
      // (opsional) panggil me()
    },
    async logout() {
      await authService.logout()
      this.user = null; this.token = ''
    }
  },
  persist: true as any
})
