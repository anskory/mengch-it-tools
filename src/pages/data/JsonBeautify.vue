<!--
  JSON美化组件
  
  功能描述：
  - 将压缩的JSON格式化为易读的缩进格式
  - 支持自定义缩进空格数（1/2/4/8空格）
  - 支持JSON压缩功能，移除多余空格和换行
  - 提供JSON有效性校验和错误提示
  
  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
// 引入操作图标组件
import { Copy, Check, Trash2, RefreshCw, Minimize2, Maximize2 } from 'lucide-vue-next'
// 引入JSON处理工具函数
import { beautifyJson, minifyJson, isValidJson, getJsonError } from '@/utils/json'

// 输入JSON：用户输入的JSON字符串，默认提供示例数据
const inputJson = ref('{"name":"檬橙IT工具箱","version":"1.0.0","features":["变量名转换","文本比较","JSON美化","JSON对比","二维码生成","URL编码解码"],"author":{"name":"mengch","email":"it.mengch.cn"}}')

// 缩进空格数：用于JSON格式化时的缩进设置
const indent = ref(2)

// 复制状态标记
const copied = ref(false)

// 视图模式：美化或压缩
const viewMode = ref<'beautify' | 'minify'>('beautify')

// JSON有效性校验计算属性
const isValid = computed(() => isValidJson(inputJson.value))

// JSON错误信息计算属性：当JSON无效时返回具体错误信息
const errorMessage = computed(() => getJsonError(inputJson.value))

// 输出JSON计算属性
// 根据视图模式决定是美化还是压缩JSON
const outputJson = computed(() => {
  if (!inputJson.value) return ''
  if (viewMode.value === 'beautify') {
    // 美化模式：使用指定缩进格式化JSON
    return beautifyJson(inputJson.value, indent.value)
  }
  // 压缩模式：移除所有空格和换行
  return minifyJson(inputJson.value)
})

/**
 * 复制输出结果到剪贴板
 */
async function copyOutput() {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(outputJson.value)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = outputJson.value
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      textarea.style.top = '-9999px'
      textarea.setAttribute('readonly', '')
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    copied.value = true
    // 2秒后清除复制状态
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('复制失败', err)
  }
}

/**
 * 清空输入内容
 */
function clearInput() {
  inputJson.value = ''
}

/**
 * 重置为默认示例数据
 */
function resetExample() {
  inputJson.value = '{"name":"檬橙IT工具箱","version":"1.0.0","features":["变量名转换","文本比较","JSON美化","JSON对比","二维码生成","URL编码解码"],"author":{"name":"mengch","site":"it.mengch.cn"}}'
}

/**
 * 切换视图模式（美化/压缩）
 */
function toggleViewMode() {
  viewMode.value = viewMode.value === 'beautify' ? 'minify' : 'beautify'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题和描述 -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          JSON美化格式化
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          将压缩的JSON格式化为易读的缩进格式，支持自定义缩进和压缩
        </p>
      </div>

      <!-- 输入区域 -->
      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            输入JSON
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
        
        <!-- 输入文本框：根据JSON有效性显示不同边框颜色 -->
        <textarea
          v-model="inputJson"
          placeholder="请输入JSON字符串"
          rows="8"
          class="w-full px-4 py-3 border rounded-lg font-mono text-sm resize-none transition-all"
          :class="[
            isValid
              ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white'
              : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          ]"
        ></textarea>
        
        <!-- JSON错误提示：当输入无效时显示 -->
        <div v-if="!isValid && inputJson" class="mt-3 flex items-center gap-2 text-red-500 text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ errorMessage }}
        </div>
      </div>

      <!-- 输出区域 -->
      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              输出结果
            </label>
            <!-- 缩进选择器：仅在美化模式下显示 -->
            <div v-if="viewMode === 'beautify'" class="flex items-center gap-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">缩进:</span>
              <select
                v-model="indent"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option :value="1">1 空格</option>
                <option :value="2">2 空格</option>
                <option :value="4">4 空格</option>
                <option :value="8">8 空格</option>
              </select>
            </div>
          </div>
          <!-- 操作按钮组 -->
          <div class="flex items-center gap-2">
            <!-- 切换模式按钮：美化/压缩 -->
            <button
              @click="toggleViewMode"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              :class="[
                viewMode === 'minify'
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              ]"
            >
              <component :is="viewMode === 'beautify' ? Minimize2 : Maximize2" class="w-4 h-4 inline mr-1" />
              {{ viewMode === 'beautify' ? '压缩' : '美化' }}
            </button>
            <!-- 复制按钮 -->
            <button
              @click="copyOutput"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                copied
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              ]"
            >
              <Check v-if="copied" class="w-4 h-4" />
              <Copy v-else class="w-4 h-4" />
              {{ copied ? '已复制' : '复制' }}
            </button>
          </div>
        </div>
        
        <!-- 输出结果显示：使用等宽字体，保留格式 -->
        <div class="font-mono text-sm h-[300px] overflow-auto bg-gray-50 dark:bg-dark-200 rounded-lg p-4 whitespace-pre-wrap break-all text-gray-800 dark:text-white">
          {{ outputJson || '请输入JSON数据' }}
        </div>
      </div>
    </div>
  </div>
</template>