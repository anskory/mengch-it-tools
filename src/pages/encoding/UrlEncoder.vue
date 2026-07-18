<!--
  URL编码解码组件
  
  功能描述：
  - 对URL进行编码和解码操作
  - 支持完整URL编码和组件编码两种模式
  - 支持编码/解码模式切换
  - 提供输入输出交换功能
  - 显示URL有效性校验和长度统计
  
  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
// 引入操作图标组件
import { Copy, Check, Trash2, RefreshCw, ArrowRightLeft } from 'lucide-vue-next'
// 引入URL处理工具函数
import { encodeUrl, decodeUrl, encodeUrlFull, decodeUrlFull, isValidUrl } from '@/utils/url'

// 输入文本：用户输入的URL，默认提供示例
const inputText = ref('https://it.mengch.cn/path?name=檬橙IT工具箱&type=test')

// 当前模式：编码或解码
const mode = ref<'encode' | 'decode'>('encode')

// 编码类型：组件编码或完整URL编码
// 组件编码：encodeURIComponent，适合编码URL参数部分
// 完整编码：encodeURI，保留URL结构字符（如:/?）
const encodeType = ref<'component' | 'full'>('component')

// 复制状态标记
const copied = ref(false)

// 输出文本计算属性
// 根据模式和编码类型计算编码/解码结果
const outputText = computed(() => {
  if (!inputText.value) return ''
  
  // 编码模式
  if (mode.value === 'encode') {
    return encodeType.value === 'component' 
      ? encodeUrl(inputText.value)  // 组件编码
      : encodeUrlFull(inputText.value) // 完整URL编码
  }
  
  // 解码模式
  try {
    return encodeType.value === 'component'
      ? decodeUrl(inputText.value) // 组件解码
      : decodeUrlFull(inputText.value) // 完整URL解码
  } catch {
    return inputText.value // 解码失败时返回原值
  }
})

// URL有效性校验计算属性
const isUrl = computed(() => isValidUrl(inputText.value))

/**
 * 复制输出结果到剪贴板
 */
async function copyOutput() {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(outputText.value)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = outputText.value
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
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('复制失败', err)
  }
}

/**
 * 清空输入内容
 */
function clearInput() {
  inputText.value = ''
}

/**
 * 重置为默认示例和配置
 */
function resetExample() {
  inputText.value = 'https://it.mengch.cn/path?name=檬橙IT工具箱&type=test'
  mode.value = 'encode'
  encodeType.value = 'component'
}

/**
 * 切换编码/解码模式
 */
function toggleMode() {
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
}

/**
 * 交换输入和输出
 * 将输出结果作为新的输入，便于连续操作
 */
function swapText() {
  inputText.value = outputText.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题和描述 -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          URL编码解码
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          对URL进行编码和解码操作，支持完整URL和组件编码
        </p>
      </div>

      <!-- 双栏布局：输入和输出 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左侧：输入和配置 -->
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ mode === 'encode' ? '输入原始URL' : '输入编码后的URL' }}
              </label>
              <!-- URL有效性标识 -->
              <span
                v-if="isUrl"
                class="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                有效URL
              </span>
            </div>
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
            :placeholder="mode === 'encode' ? '请输入URL' : '请输入编码后的URL'"
            rows="5"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all mb-4"
          ></textarea>

          <!-- 配置选项 -->
          <div class="flex items-center gap-4">
            <!-- 模式切换按钮 -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                模式:
              </label>
              <button
                @click="toggleMode"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                :class="[
                  mode === 'encode'
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                ]"
              >
                {{ mode === 'encode' ? '编码' : '解码' }}
              </button>
            </div>
            
            <!-- 编码类型选择器 -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                类型:
              </label>
              <select
                v-model="encodeType"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="component">组件编码</option>
                <option value="full">完整URL编码</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 右侧：输出结果 -->
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ mode === 'encode' ? '编码结果' : '解码结果' }}
            </label>
            <!-- 操作按钮组 -->
            <div class="flex items-center gap-2">
              <!-- 交换按钮：将输出作为新输入 -->
              <button
                @click="swapText"
                class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="交换输入输出"
              >
                <ArrowRightLeft class="w-4 h-4" />
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
          
          <!-- 输出结果显示 -->
          <div class="font-mono text-sm h-[280px] overflow-auto bg-gray-50 dark:bg-dark-200 rounded-lg p-4 whitespace-pre-wrap break-all text-gray-800 dark:text-white">
            {{ outputText || '请输入URL' }}
          </div>

          <!-- 长度统计信息 -->
          <div v-if="outputText" class="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>原始长度: {{ inputText.length }}</span>
            <span>结果长度: {{ outputText.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>