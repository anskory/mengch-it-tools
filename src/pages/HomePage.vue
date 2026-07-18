<!--
  首页组件
  
  功能描述：
  - 展示檬橙IT工具箱的主页界面
  - 显示工具列表卡片，提供快速导航入口
  - 展示工具集的基本信息和特性说明
  
  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { computed } from 'vue'
import { Sparkles } from 'lucide-vue-next'
import ToolCard from '@/components/ToolCard.vue'
import { categories, getToolCount } from '@/config/tools'

const toolCount = computed(() => getToolCount())
</script>

<template>
  <!-- 主容器：暖橙渐变背景，响应式高度 -->
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-bg-base to-amber-50 dark:from-dark-300 dark:via-dark-200 dark:to-dark-300 relative overflow-hidden">
    <!-- 装饰性背景光晕 -->
    <div class="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-primary-300/20 to-secondary-300/20 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-tr from-secondary-300/15 to-primary-300/15 blur-3xl pointer-events-none"></div>

    <div class="relative">
    <!-- 头部区域：标题和简介 -->
    <section class="pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <!-- 徽章：标识工具集特点 -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6 shadow-sm">
          <Sparkles class="w-4 h-4" />
          <span>开发者必备工具集</span>
        </div>

        <!-- 主标题：带渐变效果 -->
        <h1 class="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 bg-clip-text text-transparent">
          檬橙IT工具箱
        </h1>

        <!-- 副标题：工具集简介 -->
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          一站式解决开发过程中的常见文本处理需求，提高你的工作效率
        </p>

        <!-- 特性标签：工具数量、免费、离线 -->
        <div class="flex flex-wrap justify-center gap-4">
          <div class="px-4 py-2 bg-bg-card rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 shadow-sm">
            <span class="text-primary-500 font-semibold">{{ toolCount }}+</span> 实用工具
          </div>
          <div class="px-4 py-2 bg-bg-card rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 shadow-sm">
            <span class="text-primary-500 font-semibold">100%</span> 免费使用
          </div>
          <div class="px-4 py-2 bg-bg-card rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 shadow-sm">
            <span class="text-primary-500 font-semibold">离线</span> 本地处理
          </div>
        </div>
      </div>
    </section>

    <!-- 工具列表区域 -->
    <section class="px-4 sm:px-6 lg:px-8 pb-16">
      <div class="max-w-7xl mx-auto">
        <!-- 区域标题 -->
        <div class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
            工具列表
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            选择你需要的工具，开始提升效率
          </p>
        </div>

        <!-- 按分类展示工具 -->
        <div class="space-y-12">
          <div
            v-for="category in categories"
            :key="category.id"
            class="scroll-mt-24"
          >
            <!-- 分类标题 -->
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <component :is="category.icon" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">
                  {{ category.label }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  共 {{ category.items.length }} 个工具
                </p>
              </div>
            </div>

            <!-- 工具卡片网格 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <ToolCard
                v-for="tool in category.items"
                :key="tool.name"
                :icon="tool.icon"
                :title="tool.label"
                :description="tool.description"
                :path="tool.path"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚区域：备案信息和隐私说明 -->
    <footer class="border-t border-gray-200 dark:border-gray-700 bg-bg-card/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>檬橙IT工具箱 - 让开发更高效</p>
          <!-- 隐私提示：强调数据本地处理 -->
          <p class="mt-2">所有功能均在本地浏览器中运行，数据不会上传到服务器</p>
          <!-- 备案信息 -->
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
  </div>
</template>