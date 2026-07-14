/**
 * 应用入口文件
 * 负责创建和挂载Vue应用实例，并注册全局插件
 */

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// 在Vue应用挂载前初始化主题，避免首屏闪烁
// 读取localStorage保存的主题偏好，或检测系统主题
const savedTheme = localStorage.getItem('theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const initialTheme = savedTheme === 'dark' || savedTheme === 'light'
  ? savedTheme
  : (prefersDark ? 'dark' : 'light')
document.documentElement.classList.add(initialTheme)

// 创建Vue应用实例，传入根组件
const app = createApp(App)

// 注册路由插件，使应用支持路由功能
app.use(router)

// 将应用挂载到DOM中id为'app'的元素上
app.mount('#app')