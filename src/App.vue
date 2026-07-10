/**
 * 根组件
 * 应用的主入口组件，负责整体布局和全局状态管理
 * 包含侧边栏导航、提示消息容器和主内容区域
 */
<script setup lang="ts">
import { ref, provide } from 'vue'
import NavBar from '@/components/NavBar.vue'
import Toast from '@/components/Toast.vue'

// 侧边栏折叠状态，控制侧边栏是否收起
const sidebarCollapsed = ref(false)

// 使用依赖注入将折叠状态共享给子组件，实现跨组件状态共享
provide('sidebarCollapsed', sidebarCollapsed)
</script>

<template>
  <!-- 应用根容器，设置最小高度和背景色 -->
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300">
    <!-- 侧边栏导航组件 -->
    <NavBar />
    <!-- 提示消息组件，用于显示全局通知 -->
    <Toast />
    <!-- 主内容区域，左侧预留240px给侧边栏，大屏幕时显示 -->
    <main class="lg:pl-[240px] transition-all duration-300">
      <!-- 路由视图，根据当前路由渲染对应的页面组件 -->
      <router-view />
    </main>
  </div>
</template>