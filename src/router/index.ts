import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import VariableConverter from '@/pages/VariableConverter.vue'
import TextDiff from '@/pages/TextDiff.vue'
import JsonBeautify from '@/pages/JsonBeautify.vue'
import JsonDiff from '@/pages/JsonDiff.vue'
import QrCode from '@/pages/QrCode.vue'
import UrlEncoder from '@/pages/UrlEncoder.vue'
import InConditionGenerator from '@/pages/InConditionGenerator.vue'
import CrontabGenerator from '@/pages/CrontabGenerator.vue'

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

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router