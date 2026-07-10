<script setup lang="ts">
import { Code2, GitCompare, FileJson, QrCode, Link, Sparkles } from 'lucide-vue-next'
import ToolCard from '@/components/ToolCard.vue'

const tools = [
  {
    icon: Code2,
    title: '变量名转换',
    description: '支持驼峰式、下划线式、中划线式等多种命名风格之间的相互转换',
    path: '/variable-converter',
  },
  {
    icon: GitCompare,
    title: '文本比较',
    description: '对比两段文本的差异，高亮显示新增、删除和修改的内容',
    path: '/text-diff',
  },
  {
    icon: FileJson,
    title: 'JSON美化',
    description: '将压缩的JSON格式化为易读的缩进格式，支持自定义缩进',
    path: '/json-beautify',
  },
  {
    icon: GitCompare,
    title: 'JSON对比',
    description: '对比两个JSON对象的差异，支持嵌套结构的深度对比',
    path: '/json-diff',
  },
  {
    icon: QrCode,
    title: '二维码生成',
    description: '将文本或URL转换为二维码图片，支持自定义尺寸和颜色',
    path: '/qr-code',
  },
  {
    icon: Link,
    title: 'URL编码解码',
    description: '对URL进行编码和解码操作，支持完整URL和组件编码',
    path: '/url-encoder',
  },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-dark-300 dark:via-dark-200 dark:to-dark-300">
    <section class="pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
          <Sparkles class="w-4 h-4" />
          <span>开发者必备工具集</span>
        </div>
        
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-6">
          檬橙IT工具箱
        </h1>
        
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          一站式解决开发过程中的常见文本处理需求，提高你的工作效率
        </p>
        
        <div class="flex flex-wrap justify-center gap-4">
          <div class="px-4 py-2 bg-white dark:bg-dark-100 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
            <span class="text-primary-500 font-semibold">6+</span> 实用工具
          </div>
          <div class="px-4 py-2 bg-white dark:bg-dark-100 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
            <span class="text-primary-500 font-semibold">100%</span> 免费使用
          </div>
          <div class="px-4 py-2 bg-white dark:bg-dark-100 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
            <span class="text-primary-500 font-semibold">离线</span> 本地处理
          </div>
        </div>
      </div>
    </section>

    <section class="px-4 sm:px-6 lg:px-8 pb-16">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
            工具列表
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            选择你需要的工具，开始提升效率
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ToolCard
            v-for="tool in tools"
            :key="tool.title"
            :icon="tool.icon"
            :title="tool.title"
            :description="tool.description"
            :path="tool.path"
          />
        </div>
      </div>
    </section>

    <footer class="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-dark-200/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>檬橙IT工具箱 - 让开发更高效</p>
          <p class="mt-2">所有功能均在本地浏览器中运行，数据不会上传到服务器</p>
          <p class="mt-3">
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              桂ICP备2021007060号
            </a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>