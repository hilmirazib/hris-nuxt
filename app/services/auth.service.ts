export const authService = {
  login: (body: any) => $fetch('/api/auth/login', { method: 'POST', body }),
  logout: () => $fetch('/api/auth/logout', { method: 'POST' }),
  me: () => $fetch('/api/auth/me')
}
