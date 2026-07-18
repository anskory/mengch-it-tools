<!--
  Base64编码解码组件
  
  功能描述：
  - 对文本进行Base64编码和解码
  - 支持中英文等多字节字符
  - 提供输入输出交换功能
  - 实时预览编码/解码结果
  
  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Copy, Check, Trash2, RefreshCw, ArrowRightLeft } from 'lucide-vue-next'
import { encodeBase64, decodeBase64, isValidBase64 } from '@/utils/base64'

const inputText = ref('Hello, 檬橙IT工具箱！')
const mode = ref<'encode' | 'decode'>('encode')
const copied = ref(false)

const outputText = computed(() => {
  if (!inputText.value) return ''
  if (mode.value === 'encode') {
    return encodeBase64(inputText.value)
  }
  return decodeBase64(inputText.value)
})

const isValid = computed(() => {
  if (mode.value === 'decode') {
    return isValidBase64(inputText.value)
  }
  return true
})

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

function clearInput() {
  inputText.value = ''
}

function resetExample() {
  inputText.value = 'Hello, 檬橙IT工具箱！'
  mode.value = 'encode'
}

function toggleMode() {
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
}

function swapText() {
  inputText.value = outputText.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Base64 编码解码
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          对文本进行Base64编码和解码，支持中英文等多字节字符
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ mode === 'encode' ? '输入原始文本' : '输入Base64字符串' }}
              </label>
              <span
                v-if="mode === 'decode' && inputText && !isValid"
                class="inline-flex items-center gap-1 text-xs px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded"
              >
                格式无效
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="resetExample"
                class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="重置示例"
              >
                <RefreshCw class="w-4 h-4" />
              </button>
              <button
                @click="clearInput"
                class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="清空输入"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <textarea
            v-model="inputText"
            :placeholder="mode === 'encode' ? '请输入要编码的文本' : '请输入要解码的Base64字符串'"
            rows="10"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all mb-4"
          ></textarea>

          <div class="flex items-center gap-4">
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
          </div>
        </div>

        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ mode === 'encode' ? '编码结果' : '解码结果' }}
            </label>
            <div class="flex items-center gap-2">
              <button
                @click="swapText"
                class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="交换输入输出"
              >
                <ArrowRightLeft class="w-4 h-4" />
              </button>
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
          
          <div class="font-mono text-sm h-[280px] overflow-auto bg-gray-50 dark:bg-dark-200 rounded-lg p-4 whitespace-pre-wrap break-all text-gray-800 dark:text-white">
            {{ outputText || '请输入内容' }}
          </div>

          <div v-if="outputText" class="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>原始长度: {{ inputText.length }}</span>
            <span>结果长度: {{ outputText.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
