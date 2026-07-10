<script setup lang="ts">
import { type Component } from 'vue'

interface Props {
  icon: Component
  title: string
  description: string
  path: string
}

defineProps<Props>()
</script>

<template>
  <a
    :href="path"
    class="group relative p-6 bg-white dark:bg-dark-100 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-1 cursor-pointer"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <div class="relative">
      <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <component :is="icon" class="w-6 h-6 text-white" />
      </div>
      
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {{ title }}
      </h3>
      
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        {{ description }}
      </p>
      
      <div class="mt-4 flex items-center text-primary-500 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <span>开始使用</span>
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  </a>
</template>