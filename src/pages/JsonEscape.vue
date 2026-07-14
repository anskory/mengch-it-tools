<!--
  JSON转义/去转义组件
  
  功能描述：
  - 对JSON字符串进行转义和去转义操作
  - 转义：将JSON中的特殊字符（引号、换行、制表符等）转义
  - 去转义：将转义后的JSON字符串还原为可读格式
  - 支持输入输出交换功能
  - 显示实时统计信息
  
  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
// 引入操作图标组件
import { Copy, Check, Trash2, RefreshCw, ArrowRightLeft } from 'lucide-vue-next'

// 输入文本：用户输入的JSON内容，默认提供示例
const inputText = ref(`{"name": "檬橙IT工具箱", "version": "1.0.0", "url": "https://it.mengch.cn"}`)

// 当前模式：转义或去转义
const mode = ref<'escape' | 'unescape'>('escape')

// 复制状态标记
const copied = ref(false)

// 错误信息
const errorMsg = ref('')

/**
 * 转义JSON字符串
 * 将JSON对象或字符串进行转义处理
 * @param text - 输入文本
 * @returns 转义后的字符串
 */
function escapeJson(text: string): string {
  if (!text.trim()) return ''
  
  try {
    // 尝试解析为JSON对象
    const parsed = JSON.parse(text)
    // 将JSON对象转换为字符串（会自动转义）
    return JSON.stringify(parsed)
  } catch {
    // 如果不是有效JSON，直接作为字符串处理
    // 使用JSON.stringify转义字符串中的特殊字符
    return JSON.stringify(text)
  }
}

/**
 * 去转义JSON字符串
 * 将转义后的JSON字符串还原
 * @param text - 输入文本
 * @returns 去转义后的字符串
 */
function unescapeJson(text: string): string {
  if (!text.trim()) return ''
  
  try {
    // 尝试解析转义后的字符串
    const parsed = JSON.parse(text)
    
    // 如果解析结果是对象或数组，格式化输出
    if (typeof parsed === 'object') {
      return JSON.stringify(parsed, null, 2)
    }
    
    // 如果是字符串，直接返回
    return String(parsed)
  } catch {
    throw new Error('无效的转义JSON字符串')
  }
}

// 输出文本计算属性
// 根据模式计算转义/去转义结果
const outputText = computed(() => {
  errorMsg.value = ''
  if (!inputText.value.trim()) return ''
  
  try {
    if (mode.value === 'escape') {
      return escapeJson(inputText.value)
    } else {
      return unescapeJson(inputText.value)
    }
  } catch (err) {
    errorMsg.value = err instanceof Error ? err.message : '处理失败'
    return ''
  }
})

// 统计信息计算属性
const stats = computed(() => {
  const input = inputText.value
  const output = outputText.value
  return {
    inputLength: input.length,
    outputLength: output.length,
    inputLines: input ? input.split('\n').length : 0,
    outputLines: output ? output.split('\n').length : 0,
  }
})

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
  errorMsg.value = ''
}

/**
 * 重置为默认示例和配置
 */
function resetExample() {
  inputText.value = `{"name": "檬橙IT工具箱", "version": "1.0.0", "url": "https://it.mengch.cn"}`
  mode.value = 'escape'
  errorMsg.value = ''
}

/**
 * 切换转义/去转义模式
 */
function toggleMode() {
  mode.value = mode.value === 'escape' ? 'unescape' : 'escape'
}

/**
 * 交换输入和输出
 * 将输出结果作为新的输入，便于连续操作
 */
function swapText() {
  if (outputText.value) {
    inputText.value = outputText.value
    // 同时切换模式
    toggleMode()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题和描述 -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          JSON转义/去转义
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          对JSON字符串进行转义和去转义操作，处理引号、换行符等特殊字符
        </p>
      </div>

      <!-- 双栏布局：输入和输出 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左侧：输入和配置 -->
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ mode === 'escape' ? '输入原始JSON' : '输入转义后的JSON' }}
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
            :placeholder="mode === 'escape' ? '请输入JSON对象或字符串' : '请输入转义后的JSON字符串'"
            rows="8"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all mb-4"
          ></textarea>

          <!-- 模式切换 -->
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              模式:
            </label>
            <button
              @click="toggleMode"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              :class="[
                mode === 'escape'
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              ]"
            >
              {{ mode === 'escape' ? '转义' : '去转义' }}
            </button>
          </div>
        </div>

        <!-- 右侧：输出结果 -->
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ mode === 'escape' ? '转义结果' : '去转义结果' }}
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
                :disabled="!outputText"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                  copied
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : outputText
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800 cursor-not-allowed'
                ]"
              >
                <Check v-if="copied" class="w-4 h-4" />
                <Copy v-else class="w-4 h-4" />
                {{ copied ? '已复制' : '复制' }}
              </button>
            </div>
          </div>
          
          <!-- 错误提示 -->
          <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-600 dark:text-red-400">{{ errorMsg }}</p>
          </div>
          
          <!-- 输出结果显示 -->
          <div class="font-mono text-sm h-[280px] overflow-auto bg-gray-50 dark:bg-dark-200 rounded-lg p-4 whitespace-pre-wrap break-all">
            {{ outputText || (errorMsg ? '' : '请输入JSON内容') }}
          </div>

          <!-- 统计信息 -->
          <div v-if="outputText && !errorMsg" class="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>输入: {{ stats.inputLength }} 字符, {{ stats.inputLines }} 行</span>
            <span>输出: {{ stats.outputLength }} 字符, {{ stats.outputLines }} 行</span>
          </div>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="mt-8 bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-3">使用说明</h3>
        <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li><strong>转义：</strong>将JSON对象转换为转义后的字符串，用于存储或传输。例如换行符 <code class="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">\n</code> 会变为 <code class="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">\\n</code></li>
          <li><strong>去转义：</strong>将转义后的JSON字符串还原为可读的JSON格式，便于查看和编辑</li>
          <li><strong>交换：</strong>点击交换按钮可将输出结果作为新输入，并自动切换模式，便于连续操作</li>
        </ul>
      </div>
    </div>
  </div>
</template>