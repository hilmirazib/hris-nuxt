import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { id: number; name: string; email: string }
  }),
  actions: {
    setUser(u: any) { this.user = u },
    reset() { this.user = null }
  },
  // opsional bila pakai persisted state
  persist: true,
})
