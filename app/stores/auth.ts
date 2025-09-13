import { defineStore } from 'pinia'
import type { AuthResponse, Employee } from '../types/auth';
import { authService } from '../services/auth.service';

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null as Employee | null, token: '' }),
  actions: {
    async login(payload: { email: string; password: string }) {
      const res: AuthResponse = await authService.login(payload)
      if (res?.success && res.data) {
        this.token = res.data.token
        // (opsional) panggil me()
      }
    },
    async logout() {
      await authService.logout()
      this.user = null
      this.token = ''
    }
  },
})

