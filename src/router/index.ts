/**
 * 路由配置文件
 * 定义应用的所有页面路由映射关系
 * 使用Vue Router的HTML5 History模式进行路由管理
 */

import { createRouter, createWebHistory } from 'vue-router'
// 导入各个页面组件
import HomePage from '@/pages/HomePage.vue'
import VariableConverter from '@/pages/VariableConverter.vue'
import TextDiff from '@/pages/TextDiff.vue'
import JsonBeautify from '@/pages/JsonBeautify.vue'
import JsonDiff from '@/pages/JsonDiff.vue'
import JsonEscape from '@/pages/JsonEscape.vue'
import QrCode from '@/pages/QrCode.vue'
import UrlEncoder from '@/pages/UrlEncoder.vue'
import InConditionGenerator from '@/pages/InConditionGenerator.vue'
import CrontabGenerator from '@/pages/CrontabGenerator.vue'

/**
 * 路由配置数组
 * 每个路由对象包含:
 * - path: 路由路径
 * - name: 路由名称，用于编程式导航
 * - component: 对应的页面组件
 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/variable-converter',
    name: 'variable-converter',
    component: VariableConverter,
  },
  {
    path: '/text-diff',
    name: 'text-diff',
    component: TextDiff,
  },
  {
    path: '/json-beautify',
    name: 'json-beautify',
    component: JsonBeautify,
  },
  {
    path: '/json-diff',
    name: 'json-diff',
    component: JsonDiff,
  },
  {
    path: '/json-escape',
    name: 'json-escape',
    component: JsonEscape,
  },
  {
    path: '/qr-code',
    name: 'qr-code',
    component: QrCode,
  },
  {
    path: '/url-encoder',
    name: 'url-encoder',
    component: UrlEncoder,
  },
  {
    path: '/in-condition',
    name: 'in-condition',
    component: InConditionGenerator,
  },
  {
    path: '/crontab',
    name: 'crontab',
    component: CrontabGenerator,
  },
]

// 创建路由实例，使用HTML5 History模式
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router