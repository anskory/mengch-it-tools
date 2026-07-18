/**
 * 根组件
 * 应用的主入口组件，负责整体布局和全局状态管理
 * 包含侧边栏导航、提示消息容器和主内容区域
 */
<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Toast from '@/components/Toast.vue'
import { Sparkles } from 'lucide-vue-next'

const router = useRouter()

// 侧边栏折叠状态，控制侧边栏是否收起
const sidebarCollapsed = ref(false)

// 路由加载状态（懒加载时显示 loading）
const isLoading = ref(false)
let loadingTimer: ReturnType<typeof setTimeout> | null = null

// 路由切换开始：显示 loading（加一点延迟，避免闪一下）
router.beforeEach((_to, _from, next) => {
  if (loadingTimer) clearTimeout(loadingTimer)
  loadingTimer = setTimeout(() => {
    isLoading.value = true
  }, 100)
  next()
})

// 路由切换完成：隐藏 loading
router.afterEach(() => {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
    loadingTimer = null
  }
  isLoading.value = false
})

// 使用依赖注入将折叠状态共享给子组件，实现跨组件状态共享
provide('sidebarCollapsed', sidebarCollapsed)

// 应用启动时恢复从 404 重定向回来的路由
// GitHub Pages 不支持 SPA 路由，刷新子页面会返回 404
// 通过 404.html 重定向到首页后，从 sessionStorage 读取原始路径并跳转
onMounted(() => {
  const redirectPath = sessionStorage.getItem('spa-redirect-path')
  if (redirectPath && redirectPath !== '/') {
    sessionStorage.removeItem('spa-redirect-path')
    router.replace(redirectPath)
  }
})
</script>

<template>
  <!-- 应用根容器，设置最小高度和背景色 -->
  <div class="min-h-screen bg-bg-base">
    <!-- 侧边栏导航组件 -->
    <NavBar />
    <!-- 提示消息组件，用于显示全局通知 -->
    <Toast />
    <!-- 主内容区域，左侧预留240px给侧边栏，大屏幕时显示 -->
    <main class="lg:pl-[240px] transition-all duration-300">
      <!-- 懒加载 Loading 遮罩 -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isLoading"
          class="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/80 backdrop-blur-sm pointer-events-none"
        >
          <div class="flex flex-col items-center gap-3">
            <div class="relative">
              <div class="w-12 h-12 rounded-full border-4 border-primary-200"></div>
              <div class="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
            </div>
            <div class="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-medium">
              <Sparkles class="w-4 h-4 animate-pulse" />
              <span>加载中...</span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- 路由视图，根据当前路由渲染对应的页面组件 -->
      <router-view v-slot="{ Component }">
        <Transition
          name="fade"
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>
  </div>
</template>