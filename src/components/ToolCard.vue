/**
 * 工具卡片组件
 * 用于首页展示各个工具的入口卡片
 * 提供悬停动画效果和视觉反馈
 */
<script setup lang="ts">
import { type Component } from 'vue'

/**
 * 组件属性接口
 * @property icon - 工具图标组件
 * @property title - 工具名称
 * @property description - 工具描述
 * @property path - 工具页面路径
 */
interface Props {
  icon: Component
  title: string
  description: string
  path: string
}

// 定义组件属性，不使用默认值
defineProps<Props>()
</script>

<template>
  <!-- 工具卡片容器，使用链接形式便于点击跳转 -->
  <a
    :href="path"
    class="group relative p-6 bg-white dark:bg-dark-100 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-1 cursor-pointer"
  >
    <!-- 悬停时的渐变背景效果 -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <div class="relative">
      <!-- 图标容器，带有渐变背景 -->
      <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <component :is="icon" class="w-6 h-6 text-white" />
      </div>
      
      <!-- 工具标题 -->
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {{ title }}
      </h3>
      
      <!-- 工具描述 -->
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        {{ description }}
      </p>
      
      <!-- 悬停时显示的"开始使用"提示 -->
      <div class="mt-4 flex items-center text-primary-500 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <span>开始使用</span>
        <!-- 箭头图标 -->
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  </a>
</template>