/**
 * 路由配置文件
 * 定义应用的所有页面路由映射关系
 * 使用 Vue Router 的 HTML5 History 模式进行路由管理
 *
 * 采用路由懒加载（动态 import），工具页面按需加载，
 * 首屏只加载首页代码，进入对应工具页才加载该工具的代码，
 * 工具越多性能优势越明显。
 *
 * 工具路由统一从 src/config/tools.ts 的配置生成，
 * 新增工具只需在 tools.ts 中添加配置即可。
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import { categories } from '@/config/tools'

// 使用 Vite 的 import.meta.glob 收集所有页面组件
// Vite 会自动将匹配的文件拆分成独立 chunk
const pageModules = import.meta.glob('@/pages/**/*.vue')

/**
 * 根据配置中的组件路径找到对应的 glob 模块
 */
function getPageComponent(componentPath: string) {
  const relativePath = componentPath.replace('@/', '/src/')
  // 遍历所有 glob 模块，找到路径匹配的
  for (const key of Object.keys(pageModules)) {
    if (key.endsWith(relativePath) || key === relativePath) {
      return pageModules[key]
    }
  }
  // 兜底：按文件名匹配
  const fileName = componentPath.split('/').pop()
  for (const key of Object.keys(pageModules)) {
    if (key.endsWith(fileName!)) {
      return pageModules[key]
    }
  }
  return () => Promise.reject(new Error(`找不到组件: ${componentPath}`))
}

/**
 * 基础路由：首页
 */
const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
]

/**
 * 工具路由：从 categories 配置动态生成
 * 所有工具页使用懒加载，访问时才下载代码
 */
const toolRoutes: RouteRecordRaw[] = categories.flatMap(category =>
  category.items.map(tool => ({
    path: tool.path,
    name: tool.name,
    component: getPageComponent(tool.component),
  }))
)

const routes: RouteRecordRaw[] = [...baseRoutes, ...toolRoutes]

// 创建路由实例，使用 HTML5 History 模式
const router = createRouter({
  history: createWebHistory(),
  routes,
  // 页面切换时滚动到顶部
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
