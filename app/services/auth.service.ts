import type { AuthResponse } from "../types/auth";

export const authService = {
  login: (body: any): Promise<AuthResponse> => $fetch('/api/auth/login', { method: 'POST', body }),
  logout: () => $fetch('/api/auth/logout', { method: 'POST' }),
  me: () => $fetch('/api/auth/me')
}
