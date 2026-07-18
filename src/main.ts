/**
 * 应用入口文件
 * 负责创建和挂载Vue应用实例，并注册全局插件
 */

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// 在Vue应用挂载前初始化主题，避免首屏闪烁
// 读取localStorage保存的主题偏好，兼容旧版 light/dark 值
const validThemes = ['warm-light', 'warm-dark', 'classic-light', 'classic-dark']
const savedTheme = localStorage.getItem('theme')
let initialTheme: string

if (savedTheme && validThemes.includes(savedTheme)) {
  initialTheme = savedTheme
} else if (savedTheme === 'light') {
  initialTheme = 'warm-light'
} else if (savedTheme === 'dark') {
  initialTheme = 'warm-dark'
} else {
  // 默认使用暖橙浅色主题
  initialTheme = 'warm-light'
}

// 设置 data-theme 属性和 dark 类名
document.documentElement.setAttribute('data-theme', initialTheme)
const isDark = initialTheme.endsWith('dark')
document.documentElement.classList.add(isDark ? 'dark' : 'light')

// 创建Vue应用实例，传入根组件
const app = createApp(App)

// 注册路由插件，使应用支持路由功能
app.use(router)

// 将应用挂载到DOM中id为'app'的元素上
app.mount('#app')