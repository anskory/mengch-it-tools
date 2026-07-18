/**
 * 路由配置文件
 * 定义应用的所有页面路由映射关系
 * 使用 Vue Router 的 HTML5 History 模式进行路由管理
 *
 * 采用路由懒加载（动态 import），工具页面按需加载，
 * 首屏只加载首页代码，进入对应工具页才加载该工具的代码，
 * 工具越多性能优势越明显。
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'

/**
 * 路由配置数组
 *  - 首页：静态引入（首屏需要立即展示）
 *  - 工具页：使用动态 import 懒加载，访问时才下载代码
 *    打包时自动拆分成独立 chunk，减小首屏体积
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/variable-converter',
    name: 'variable-converter',
    component: () => import('@/pages/VariableConverter.vue'),
  },
  {
    path: '/text-diff',
    name: 'text-diff',
    component: () => import('@/pages/TextDiff.vue'),
  },
  {
    path: '/json-beautify',
    name: 'json-beautify',
    component: () => import('@/pages/JsonBeautify.vue'),
  },
  {
    path: '/json-diff',
    name: 'json-diff',
    component: () => import('@/pages/JsonDiff.vue'),
  },
  {
    path: '/json-escape',
    name: 'json-escape',
    component: () => import('@/pages/JsonEscape.vue'),
  },
  {
    path: '/json-explorer',
    name: 'json-explorer',
    component: () => import('@/pages/JsonExplorer.vue'),
  },
  {
    path: '/qr-code',
    name: 'qr-code',
    component: () => import('@/pages/QrCode.vue'),
  },
  {
    path: '/url-encoder',
    name: 'url-encoder',
    component: () => import('@/pages/UrlEncoder.vue'),
  },
  {
    path: '/in-condition',
    name: 'in-condition',
    component: () => import('@/pages/InConditionGenerator.vue'),
  },
  {
    path: '/crontab',
    name: 'crontab',
    component: () => import('@/pages/CrontabGenerator.vue'),
  },
]

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
