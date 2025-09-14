import { defineStore } from 'pinia'
import type { Employee } from '@prisma/client'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    user: null as Employee | null
  }),
  actions: {
    setToken(t: string) { this.token = t },
    setUser(u: Employee) { this.user = u },
    reset() { this.token = ''; this.user = null }
  },
  // opsional bila pakai persisted state
})
