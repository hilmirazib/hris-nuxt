<template>
  <v-app>
    <Vue3Toastify />
    <!-- Top App Bar -->
    <v-app-bar color="primary" density="comfortable">
      <v-btn icon @click="drawer = !drawer" class="mr-2">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-app-bar-title class="font-semibold">
        HRIS — {{ currentSection }}
      </v-app-bar-title>

      <v-spacer />

      <!-- Quick search (dummy) -->
      <v-text-field
        v-model="q"
        hide-details
        density="compact"
        variant="solo-filled"
        placeholder="Search employees, leave, payroll…"
        prepend-inner-icon="mdi-magnify"
        class="mx-4"
        style="max-width: 360px"
      />

      <!-- User menu -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" prepend-icon="mdi-account-circle">
            Admin
            <v-icon end>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item to="/profile" prepend-icon="mdi-account">Profile</v-list-item>
          <v-list-item to="/settings" prepend-icon="mdi-cog">Settings</v-list-item>
          <v-divider />
          <v-list-item @click="onLogout" prepend-icon="mdi-logout">Logout</v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      @click="rail = false"
      app
    >
      <v-list density="compact" nav>
        <v-list-item
          prepend-avatar=""
          title="My Company"
          subtitle="HRIS"
          class="mb-2"
        >
          <template #prepend>
            <v-avatar size="36" color="primary">
              <span class="text-white text-subtitle-2">HC</span>
            </v-avatar>
          </template>
          <template #append>
            <v-btn icon variant="text" @click.stop="rail = !rail">
              <v-icon>mdi-arrow-left-right</v-icon>
            </v-btn>
          </template>
        </v-list-item>

        <v-divider class="mb-2" />

        <v-list-item to="/admin" prepend-icon="mdi-view-dashboard" title="Dashboard" exact />
        <v-list-item to="/admin/employees" prepend-icon="mdi-account-multiple" title="Employees" />
        <v-list-item to="/admin/attendance" prepend-icon="mdi-calendar-check" title="Attendance" />
        <v-list-item to="/admin/leave" prepend-icon="mdi-beach" title="Leave" />
        <v-list-item to="/admin/payroll" prepend-icon="mdi-cash" title="Payroll" />
        <v-list-item to="/admin/reports" prepend-icon="mdi-file-chart" title="Reports" />
        <v-list-item to="/admin/settings" prepend-icon="mdi-cog" title="Settings" />
      </v-list>
    </v-navigation-drawer>

    <!-- Main content -->
    <v-main>
      <v-container class="py-6">
        <!-- Optional breadcrumb -->
        <v-breadcrumbs :items="breadcrumbs" class="mb-4" />

        <slot />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app color="grey-lighten-4" class="py-2">
      <v-container class="d-flex align-center justify-space-between">
        <span class="text-body-2">© {{ new Date().getFullYear() }} — HRIS</span>
        <div class="d-flex align-center">
          <v-switch
            v-model="isDark"
            inset
            hide-details
            :label="`Theme: ${isDark ? 'Dark' : 'Light'}`"
            class="mr-2"
          />
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useAuth } from '../composables/useAuth'
import { Vue3Toastify, toast } from 'vue3-toastify'

const { logout } = useAuth()
const drawer = ref(true)
const rail = ref(false)
const q = ref('')
const route = useRoute()

// Title section dari path
const currentSection = computed(() => {
  const map: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/employees': 'Employees',
    '/admin/attendance': 'Attendance',
    '/admin/leave': 'Leave',
    '/admin/payroll': 'Payroll',
    '/admin/reports': 'Reports',
    '/admin/settings': 'Settings',
  }
  return map[route.path] ?? 'HRIS'
})

// Breadcrumbs sederhana dari path
const breadcrumbs = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  const items = []
  let acc = ''
  for (const p of parts) {
    acc += '/' + p
    items.push({ title: p.charAt(0).toUpperCase() + p.slice(1), to: acc })
  }
  return items
})

// Theme toggle (light/dark)
const theme = useTheme()
const isDark = ref(theme.global.current.value.dark)
watch(isDark, (val) => {
  theme.global.name.value = val ? 'dark' : 'light'
})

const onLogout = async () => {
  await logout()
  navigateTo('/login')
}
</script>
