export const authService = {
  login: (data: { email: string; password: string }) =>
    $fetch('/api/auth/login', { method: 'POST', body: data }),
  logout: () => $fetch('/api/auth/logout', { method: 'POST' }),
  verify: () => $fetch('/api/auth/verify-token'),
  me: () => $fetch('/api/auth/me')
}
