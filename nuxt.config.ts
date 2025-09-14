// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/test-utils', '@pinia/nuxt', '@nuxtjs/i18n', 'vuetify-nuxt-module'],
  css: ['@mdi/font/css/materialdesignicons.css'],
  ssr: true,
  typescript: { strict: true },
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret',
    uploadMaxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '5242880', 10),
    allowedExtensions: (process.env.ALLOWED_EXTENSIONS || 'png,jpg,jpeg').split(','),
    databaseUrl: process.env.DATABASE_URL
  },
})
