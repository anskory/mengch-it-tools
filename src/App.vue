<script setup lang="ts">
import { ref, provide } from 'vue'
import NavBar from '@/components/NavBar.vue'
import Toast from '@/components/Toast.vue'

const sidebarCollapsed = ref(false)
provide('sidebarCollapsed', sidebarCollapsed)
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300">
    <NavBar />
    <Toast />
    <main class="lg:pl-[240px] transition-all duration-300">
      <router-view />
    </main>
  </div>
</template>