/**
 * @file 主题切换组合式函数
 * @description 提供响应式的明暗主题切换功能，支持本地存储和系统偏好检测
 * @author IT Tools
 */

import { ref, watchEffect, onMounted, computed } from 'vue'

/**
 * 主题类型定义
 * @description 支持的主题模式：light（明亮）和 dark（暗色）
 */
type Theme = 'light' | 'dark'

/**
 * 主题切换组合式函数
 * @description 提供主题状态管理和切换功能，自动同步到 localStorage 和 DOM
 * 
 * 功能特性：
 * 1. 自动检测系统主题偏好
 * 2. 本地存储持久化用户选择
 * 3. 响应式主题状态
 * 4. 自动更新 DOM 类名
 * 
 * @returns {Object} 主题相关对象
 * @returns {Ref<Theme>} theme - 当前主题的响应式引用
 * @returns {Function} toggleTheme - 切换主题的函数
 * @returns {ComputedRef<boolean>} isDark - 计算属性，当前是否为暗色主题
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useTheme } from '@/composables/useTheme'
 * 
 * const { theme, toggleTheme, isDark } = useTheme()
 * </script>
 * 
 * <template>
 *   <button @click="toggleTheme">
 *     {{ isDark ? '切换到明亮模式' : '切换到暗色模式' }}
 *   </button>
 * </template>
 * ```
 */
export function useTheme() {
  // 当前主题状态，响应式变量
  const theme = ref<Theme>('light')

  /**
   * 获取用户偏好的主题
   * @description 优先读取本地存储的主题设置，若没有则检测系统偏好
   * @returns 用户偏好的主题类型
   */
  const getPreferredTheme = (): Theme => {
    // 尝试从 localStorage 读取已保存的主题设置
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved === 'light' || saved === 'dark') return saved
    
    // 没有保存设置时，检测系统主题偏好
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  /**
   * 应用主题到 DOM
   * @description 更新 HTML 根元素的类名，并保存主题设置到 localStorage
   * @param t - 要应用的主题类型
   */
  const applyTheme = (t: Theme) => {
    // 移除旧的主题类名
    document.documentElement.classList.remove('light', 'dark')
    // 添加新的主题类名
    document.documentElement.classList.add(t)
    // 持久化主题设置到本地存储
    localStorage.setItem('theme', t)
  }

  /**
   * 切换主题
   * @description 在明亮和暗色主题之间切换
   */
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // 组件挂载时初始化主题
  onMounted(() => {
    // 获取并应用用户偏好的主题
    theme.value = getPreferredTheme()
    applyTheme(theme.value)
  })

  // 监听主题变化，自动应用到 DOM
  watchEffect(() => {
    applyTheme(theme.value)
  })

  return {
    /** 当前主题的响应式引用 */
    theme,
    /** 切换主题的函数 */
    toggleTheme,
    /** 计算属性：当前是否为暗色主题 */
    isDark: computed(() => theme.value === 'dark'),
  }
}