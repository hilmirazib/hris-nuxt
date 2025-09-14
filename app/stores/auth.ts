import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    user: null as null | { id: number; name: string; email: string }
  }),
  actions: {
    setToken(t: string) { this.token = t },
    setUser(u: any) { this.user = u },
    reset() { this.token = ''; this.user = null }
  },
  // opsional bila pakai persisted state
})
