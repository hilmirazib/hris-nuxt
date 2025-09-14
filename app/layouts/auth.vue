<template>
  <v-app>
    <!-- Navbar -->
    <v-app-bar flat color="primary" density="comfortable" dark>
      <NuxtLink to="/" class="text-white text-decoration-none">
        <v-app-bar-title>HRIS</v-app-bar-title>
      </NuxtLink>

      <v-spacer />

      <!-- Link navigasi simple -->
      <NuxtLink to="/" class="text-white mr-4">Home</NuxtLink>
      <NuxtLink to="/login" class="text-white mr-4">Login</NuxtLink>
      <NuxtLink to="/register" class="text-white">Register</NuxtLink>
    </v-app-bar>

    <!-- Konten utama -->
    <v-main>
      <v-container class="py-8">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// tidak ada logic khusus di layout guest
</script>
