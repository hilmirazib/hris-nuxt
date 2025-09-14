<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const { login, isAuthenticated } = useAuth()
const loading = ref(false)
const email = ref('')
const password = ref('')
const showPass = ref(false)
const valid = ref(false)

const rules = {
  required: (v: any) => !!v || 'Required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Invalid email',
  min6: (v: string) => (v?.length ?? 0) >= 6 || 'Min 6 chars'
}

const onSubmit = async () => {
  if (!valid.value) return
  loading.value = true
  const res: any = await login({ email: email.value, password: password.value })
  loading.value = false

  if (res?.success) {
    return navigateTo('/admin')
  } else {
    // tampilkan pesan error sederhana
    alert(res?.error?.message ?? 'Login failed')
  }
}

if (isAuthenticated.value) navigateTo('/admin')
</script>

<template>
  <div class="d-flex align-center justify-center" style="min-height: 100vh;">
    <v-card width="420" elevation="8">
      <v-card-title class="text-h6 text-center">Sign in to HRIS</v-card-title>
      <v-card-text>
        <v-form v-model="valid" @submit.prevent="onSubmit">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            :rules="[rules.required, rules.email]"
            prepend-inner-icon="mdi-email-outline"
            autofocus
          />
          <v-text-field
            v-model="password"
            :type="showPass ? 'text' : 'password'"
            label="Password"
            :rules="[rules.required, rules.min6]"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPass = !showPass"
          />

          <v-btn
            type="submit"
            :loading="loading"
            block
            class="mt-2"
          >
            Sign In
          </v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-center">
        <small class="text-medium-emphasis">admin@example.com / Admin123!</small>
      </v-card-actions>
    </v-card>
  </div>
</template>
