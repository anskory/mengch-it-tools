/**
 * @file 主题切换组合式函数
 * @description 提供响应式的明暗主题切换功能，支持本地存储和系统偏好检测
 * @author IT Tools
 */

import { ref, watch, computed } from 'vue'

/**
 * 主题类型定义
 * @description 支持的主题模式：light（明亮）和 dark（暗色）
 */
type Theme = 'light' | 'dark'

/**
 * 获取用户偏好的主题
 * @description 优先读取本地存储的主题设置，若没有则检测系统偏好
 * @returns 用户偏好的主题类型
 */
function getPreferredTheme(): Theme {
  const saved = localStorage.getItem('theme') as Theme | null
  if (saved === 'light' || saved === 'dark') return saved

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * 应用主题到 DOM
 * @description 更新 HTML 根元素的类名，并保存主题设置到 localStorage
 * @param t - 要应用的主题类型
 */
function applyTheme(t: Theme) {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(t)
  localStorage.setItem('theme', t)
}

// 全局单例主题状态，确保所有组件共享同一份状态
const theme = ref<Theme>(getPreferredTheme())

// 标记是否为初始加载，避免初始化时触发保存
let initialized = false

// 监听主题变化，自动应用到 DOM 并持久化
watch(theme, (newVal) => {
  if (!initialized) {
    initialized = true
    // 初始值已经在 main.ts 中应用到 DOM 了，这里只需要确保一致
    applyTheme(newVal)
    return
  }
  applyTheme(newVal)
}, { immediate: true })

/**
 * 主题切换组合式函数
 * @description 提供主题状态管理和切换功能，自动同步到 localStorage 和 DOM
 *
 * 功能特性：
 * 1. 自动检测系统主题偏好
 * 2. 本地存储持久化用户选择
 * 3. 响应式主题状态（全局共享）
 * 4. 自动更新 DOM 类名
 *
 * @returns {Object} 主题相关对象
 * @returns {Ref<Theme>} theme - 当前主题的响应式引用
 * @returns {Function} toggleTheme - 切换主题的函数
 * @returns {ComputedRef<boolean>} isDark - 计算属性，当前是否为暗色主题
 */
export function useTheme() {
  /**
   * 切换主题
   * @description 在明亮和暗色主题之间切换
   */
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return {
    theme,
    toggleTheme,
    isDark: computed(() => theme.value === 'dark'),
  }
}