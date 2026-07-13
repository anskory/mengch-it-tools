<!--
  文本比较组件
  
  功能描述：
  - 对比两段文本的差异，高亮显示新增、删除和修改的内容
  - 支持行级别的差异对比
  - 提供统计信息，包括行数、字符数和差异数量
  
  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
// 引入操作图标组件
import { Copy, Check, Trash2, RefreshCw } from 'lucide-vue-next'
// 引入文本对比工具函数
import { compareText, countLines, countChars } from '@/utils/text'
import type { DiffLine } from '@/utils/text'

// 原始文本：左侧输入的旧文本，默认提供示例内容
const oldText = ref(`Hello World
This is line 2
This is line 3
This is line 4`)

// 新文本：右侧输入的新文本，默认提供示例内容
const newText = ref(`Hello World!
This is line 2
This is line 3 modified
This is line 5`)

// 左侧复制状态标记
const copiedLeft = ref(false)
// 右侧复制状态标记
const copiedRight = ref(false)

// 差异结果计算属性
// 调用文本对比函数，生成逐行的差异对比结果
const diffResult = computed((): DiffLine[] => {
  return compareText(oldText.value, newText.value)
})

// 统计信息计算属性
// 计算行数、字符数以及新增、删除的差异行数
const stats = computed(() => ({
  oldLines: countLines(oldText.value), // 原始文本行数
  newLines: countLines(newText.value), // 新文本行数
  oldChars: countChars(oldText.value), // 原始文本字符数
  newChars: countChars(newText.value), // 新文本字符数
  added: diffResult.value.filter(l => l.added).length, // 新增行数
  removed: diffResult.value.filter(l => l.removed).length, // 删除行数
}))

/**
 * 复制左侧原始文本
 */
async function copyLeft() {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(oldText.value)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = oldText.value
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      textarea.style.top = '-9999px'
      textarea.setAttribute('readonly', '')
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    copiedLeft.value = true
    // 2秒后清除复制状态
    setTimeout(() => copiedLeft.value = false, 2000)
  } catch (err) {
    console.error('复制失败', err)
  }
}

/**
 * 复制右侧新文本
 */
async function copyRight() {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(newText.value)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = newText.value
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      textarea.style.top = '-9999px'
      textarea.setAttribute('readonly', '')
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    copiedRight.value = true
    // 2秒后清除复制状态
    setTimeout(() => copiedRight.value = false, 2000)
  } catch (err) {
    console.error('复制失败', err)
  }
}

/**
 * 清空左侧原始文本
 */
function clearLeft() {
  oldText.value = ''
}

/**
 * 清空右侧新文本
 */
function clearRight() {
  newText.value = ''
}

/**
 * 重置为默认示例内容
 */
function resetExample() {
  oldText.value = `Hello World
This is line 2
This is line 3
This is line 4`
  newText.value = `Hello World!
This is line 2
This is line 3 modified
This is line 5`
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题和描述 -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          文本比较
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          对比两段文本的差异，高亮显示新增、删除和修改的内容
        </p>
      </div>

      <!-- 三栏布局：原始文本、新文本、差异结果 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- 左侧：原始文本输入 -->
        <div class="lg:col-span-1 bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              原始文本
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
              <!-- 复制按钮 -->
              <button
                @click="copyLeft"
                :class="[
                  'p-2 rounded-lg transition-all',
                  copiedLeft ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
                :title="copiedLeft ? '已复制' : '复制'"
              >
                <Check v-if="copiedLeft" class="w-4 h-4" />
                <Copy v-else class="w-4 h-4" />
              </button>
              <!-- 清空按钮 -->
              <button
                @click="clearLeft"
                class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="清空"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- 统计信息：行数和字符数 -->
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {{ stats.oldLines }} 行 | {{ stats.oldChars }} 字符
          </div>
          
          <!-- 输入文本框 -->
          <textarea
            v-model="oldText"
            placeholder="请输入原始文本"
            rows="15"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          ></textarea>
        </div>

        <!-- 中间：新文本输入 -->
        <div class="lg:col-span-1 bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              新文本
            </label>
            <!-- 操作按钮组 -->
            <div class="flex items-center gap-2">
              <!-- 复制按钮 -->
              <button
                @click="copyRight"
                :class="[
                  'p-2 rounded-lg transition-all',
                  copiedRight ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
                :title="copiedRight ? '已复制' : '复制'"
              >
                <Check v-if="copiedRight" class="w-4 h-4" />
                <Copy v-else class="w-4 h-4" />
              </button>
              <!-- 清空按钮 -->
              <button
                @click="clearRight"
                class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="清空"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- 统计信息：行数和字符数 -->
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {{ stats.newLines }} 行 | {{ stats.newChars }} 字符
          </div>
          
          <!-- 输入文本框 -->
          <textarea
            v-model="newText"
            placeholder="请输入新文本"
            rows="15"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          ></textarea>
        </div>

        <!-- 右侧：差异结果显示 -->
        <div class="lg:col-span-1 bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              差异结果
            </label>
            <!-- 差异统计标签 -->
            <div class="flex items-center gap-2">
              <!-- 新增统计 -->
              <span class="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                +{{ stats.added }} 新增
              </span>
              <!-- 删除统计 -->
              <span class="inline-flex items-center gap-1 text-xs px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
                <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                -{{ stats.removed }} 删除
              </span>
            </div>
          </div>
          
          <!-- 差异结果展示：使用等宽字体，可滚动 -->
          <div class="font-mono text-sm h-[420px] overflow-auto bg-gray-50 dark:bg-dark-200 rounded-lg p-4">
            <!-- 循环渲染差异行 -->
            <template v-for="(line, index) in diffResult" :key="index">
              <!-- 删除行：红色背景，左侧红色边框 -->
              <div
                v-if="line.removed"
                class="flex items-start gap-2 py-1 bg-red-50 dark:bg-red-900/20 border-l-2 border-red-500"
              >
                <span class="text-red-400 select-none">-</span>
                <span class="text-gray-600 dark:text-gray-400">{{ line.value }}</span>
              </div>
              <!-- 新增行：绿色背景，左侧绿色边框 -->
              <div
                v-else-if="line.added"
                class="flex items-start gap-2 py-1 bg-green-50 dark:bg-green-900/20 border-l-2 border-green-500"
              >
                <span class="text-green-400 select-none">+</span>
                <span class="text-gray-600 dark:text-gray-400">{{ line.value }}</span>
              </div>
              <!-- 未修改行：无特殊样式 -->
              <div
                v-else
                class="flex items-start gap-2 py-1 border-l-2 border-transparent"
              >
                <span class="text-gray-300 select-none"> </span>
                <span class="text-gray-600 dark:text-gray-400">{{ line.value }}</span>
              </div>
            </template>
            <!-- 空状态提示 -->
            <div v-if="diffResult.length === 0" class="text-gray-400 text-center py-8">
              请输入文本进行比较
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>