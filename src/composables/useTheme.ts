/**
 * @file 主题切换组合式函数
 * @description 提供响应式的多主题切换功能，支持本地存储持久化
 *
 * 支持的主题：
 * - warm-light：治愈暖橙浅色（米白底、粉橙主色、温暖治愈）
 * - warm-dark：治愈暖橙深色（暖夜底、粉橙点缀、柔和护眼）
 * - classic-light：经典浅色（原蓝灰配色）
 * - classic-dark：经典深色（原深色配色）
 *
 * @author IT Tools
 */

import { ref, watch, computed } from 'vue'

/**
 * 主题类型定义
 */
export type ThemeMode = 'warm-light' | 'warm-dark' | 'classic-light' | 'classic-dark'

/**
 * 所有可用主题配置
 */
export interface ThemeOption {
  value: ThemeMode
  label: string
  desc: string
  /** 是否为深色系（用于 Tailwind dark: 变体映射） */
  isDark: boolean
}

export const themeOptions: ThemeOption[] = [
  { value: 'warm-light', label: '暖橙·浅', desc: '米白底色，粉橙暖意', isDark: false },
  { value: 'warm-dark', label: '暖橙·深', desc: '暖夜底色，粉橙点缀', isDark: true },
  { value: 'classic-light', label: '经典·浅', desc: '蓝灰配色，清爽简洁', isDark: false },
  { value: 'classic-dark', label: '经典·深', desc: '深色配色，专注沉浸', isDark: true },
]

/**
 * 获取用户偏好的主题
 * 优先读取本地存储，兼容旧版 light/dark 值
 */
function getPreferredTheme(): ThemeMode {
  const saved = localStorage.getItem('theme')
  if (saved && themeOptions.some(o => o.value === saved)) return saved as ThemeMode

  // 兼容旧版 light/dark
  if (saved === 'light') return 'warm-light'
  if (saved === 'dark') return 'warm-dark'

  // 默认使用暖橙浅色
  return 'warm-light'
}

/**
 * 应用主题到 DOM
 * 设置 data-theme 属性供 CSS 变量切换，同时同步 dark 类名给 Tailwind
 */
function applyTheme(t: ThemeMode) {
  const option = themeOptions.find(o => o.value === t) ?? themeOptions[0]
  const html = document.documentElement
  // 设置 data-theme 供 CSS 变量主题切换
  html.setAttribute('data-theme', t)
  // 同步 Tailwind dark 类（dark: 变体仍然可用）
  html.classList.remove('light', 'dark')
  html.classList.add(option.isDark ? 'dark' : 'light')
  localStorage.setItem('theme', t)
}

// 全局单例主题状态，所有组件共享
const theme = ref<ThemeMode>(getPreferredTheme())

// 监听主题变化，自动应用
watch(theme, (newVal) => {
  applyTheme(newVal)
}, { immediate: true })

/**
 * 主题切换组合式函数
 */
export function useTheme() {
  /** 切换到指定主题 */
  const setTheme = (t: ThemeMode) => {
    theme.value = t
  }

  /** 在浅色/深色之间快速切换（保留当前色系） */
  const toggleTheme = () => {
    const isDark = theme.value.endsWith('dark')
    const base = theme.value.replace(/-dark$|-light$/, '')
    theme.value = isDark ? `${base}-light` as ThemeMode : `${base}-dark` as ThemeMode
  }

  return {
    theme,
    themeOptions,
    setTheme,
    toggleTheme,
    isDark: computed(() => theme.value.endsWith('dark')),
  }
}
