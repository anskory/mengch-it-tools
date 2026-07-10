<!--
  变量名转换组件
  
  功能描述：
  - 将变量名在不同命名风格之间转换
  - 支持驼峰式、下划线式、中划线式等多种命名风格
  - 提供实时转换、一键复制和清空重置功能
  
  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
// 引入操作图标组件
import { Copy, Check, Trash2, RefreshCw } from 'lucide-vue-next'
// 引入变量名转换工具函数和配置
import { variableTransforms } from '@/utils/variable'

// 输入文本：用户输入的变量名，默认提供示例值
const inputText = ref('myVariableName')

// 复制状态标记：记录当前复制成功的卡片索引，用于显示复制成功提示
const copiedIndex = ref<number | null>(null)

// 转换结果计算属性
// 对输入文本应用所有转换规则，生成多种命名风格的转换结果
const results = computed(() => {
  return variableTransforms.map((transform, index) => ({
    ...transform,
    result: transform.transform(inputText.value), // 执行转换函数
    index, // 添加索引，用于复制状态追踪
  }))
})

/**
 * 复制文本到剪贴板
 * @param text - 要复制的文本内容
 * @param index - 转换结果的索引，用于标记复制状态
 */
async function copyText(text: string, index: number) {
  try {
    // 使用浏览器剪贴板API复制文本
    await navigator.clipboard.writeText(text)
    copiedIndex.value = index // 设置复制成功标记
    // 2秒后清除复制状态
    setTimeout(() => {
      copiedIndex.value = null
    }, 2000)
  } catch {
    console.error('复制失败')
  }
}

/**
 * 清空输入内容
 */
function clearInput() {
  inputText.value = ''
}

/**
 * 重置为默认示例值
 */
function resetExample() {
  inputText.value = 'myVariableName'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题和描述 -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          变量名转换
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          将变量名在不同命名风格之间转换
        </p>
      </div>

      <!-- 输入区域 -->
      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            输入变量名
          </label>
          <!-- 操作按钮组 -->
          <div class="flex items-center gap-2">
            <!-- 重置示例按钮 -->
            <button
              @click="resetExample"
              class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="重置示例"
            >
              <RefreshCw class="w-4 h-4" />
            </button>
            <!-- 清空输入按钮 -->
            <button
              @click="clearInput"
              class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="清空输入"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <!-- 输入文本框 -->
        <textarea
          v-model="inputText"
          placeholder="请输入变量名，如: myVariableName 或 my_variable_name"
          rows="3"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
        ></textarea>
      </div>

      <!-- 转换结果展示区域：网格布局 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- 循环渲染每个转换结果卡片 -->
        <div
          v-for="item in results"
          :key="item.name"
          class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:border-primary-400 dark:hover:border-primary-500 transition-all"
        >
          <div class="flex items-center justify-between mb-3">
            <!-- 转换风格标签 -->
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ item.label }}
            </span>
            <!-- 复制按钮：根据复制状态显示不同样式和图标 -->
            <button
              @click="copyText(item.result, item.index)"
              :class="[
                'p-2 rounded-lg transition-all duration-200',
                copiedIndex === item.index
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              ]"
              :title="copiedIndex === item.index ? '已复制' : '复制'"
            >
              <Check v-if="copiedIndex === item.index" class="w-4 h-4" />
              <Copy v-else class="w-4 h-4" />
            </button>
          </div>
          
          <!-- 转换结果显示：使用等宽字体 -->
          <div class="font-mono text-lg text-gray-800 dark:text-white break-all p-3 bg-gray-50 dark:bg-dark-200 rounded-lg">
            {{ item.result || '-' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>