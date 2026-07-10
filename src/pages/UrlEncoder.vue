<script setup lang="ts">
import { ref, computed } from 'vue'
import { Copy, Check, Trash2, RefreshCw, ArrowRightLeft } from 'lucide-vue-next'
import { encodeUrl, decodeUrl, encodeUrlFull, decodeUrlFull, isValidUrl } from '@/utils/url'

const inputText = ref('https://www.mengch.com/path?name=檬橙IT工具箱&type=test')
const mode = ref<'encode' | 'decode'>('encode')
const encodeType = ref<'component' | 'full'>('component')
const copied = ref(false)

const outputText = computed(() => {
  if (!inputText.value) return ''
  
  if (mode.value === 'encode') {
    return encodeType.value === 'component' 
      ? encodeUrl(inputText.value) 
      : encodeUrlFull(inputText.value)
  }
  
  try {
    return encodeType.value === 'component'
      ? decodeUrl(inputText.value)
      : decodeUrlFull(inputText.value)
  } catch {
    return inputText.value
  }
})

const isUrl = computed(() => isValidUrl(inputText.value))

async function copyOutput() {
  try {
    await navigator.clipboard.writeText(outputText.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {}
}

function clearInput() {
  inputText.value = ''
}

function resetExample() {
  inputText.value = 'https://www.mengch.com/path?name=檬橙IT工具箱&type=test'
  mode.value = 'encode'
  encodeType.value = 'component'
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
          URL编码解码
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          对URL进行编码和解码操作，支持完整URL和组件编码
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ mode === 'encode' ? '输入原始URL' : '输入编码后的URL' }}
              </label>
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
            :placeholder="mode === 'encode' ? '请输入URL' : '请输入编码后的URL'"
            rows="5"
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
          
          <div class="font-mono text-sm h-[280px] overflow-auto bg-gray-50 dark:bg-dark-200 rounded-lg p-4 whitespace-pre-wrap break-all">
            {{ outputText || '请输入URL' }}
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