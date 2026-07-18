<!--
  哈希加密组件
  
  功能描述：
  - 支持 MD5、SHA1、SHA256、SHA384、SHA512 等多种哈希算法
  - 实时计算哈希值
  - 一键复制结果
  - 全部在本地浏览器运行，数据不上传
  
  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Copy, Check, Trash2, RefreshCw } from 'lucide-vue-next'
import { hash, hashAlgorithms, type HashAlgorithm } from '@/utils/hash'

const inputText = ref('Hello, 檬橙IT工具箱！')
const algorithm = ref<HashAlgorithm>('sha256')
const result = ref('')
const copied = ref(false)
const isCalculating = ref(false)

async function calculateHash() {
  if (!inputText.value) {
    result.value = ''
    return
  }
  isCalculating.value = true
  try {
    result.value = await hash(algorithm.value, inputText.value)
  } catch {
    result.value = ''
  }
  isCalculating.value = false
}

watch([inputText, algorithm], () => {
  calculateHash()
}, { immediate: true })

async function copyResult() {
  if (!result.value) return
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(result.value)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = result.value
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
  algorithm.value = 'sha256'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          哈希加密
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          支持 MD5、SHA1、SHA256、SHA512 等多种哈希算法，全部本地运行
        </p>
      </div>

      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            输入文本
          </label>
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
              title="清空"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <textarea
          v-model="inputText"
          placeholder="请输入要加密的文本"
          rows="4"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all mb-4"
        ></textarea>

        <div class="flex flex-wrap gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            算法:
          </label>
          <button
            v-for="algo in hashAlgorithms"
            :key="algo.value"
            @click="algorithm = algo.value"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              algorithm === algo.value
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            ]"
            :title="algo.desc"
          >
            {{ algo.label }}
            <span class="text-xs opacity-70 ml-1">{{ algo.bits }}位</span>
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            哈希结果
            <span v-if="isCalculating" class="ml-2 text-xs text-gray-400 dark:text-gray-500">
              计算中...
            </span>
          </label>
          <button
            @click="copyResult"
            :disabled="!result"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
              copied
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                : result
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            ]"
          >
            <Check v-if="copied" class="w-4 h-4" />
            <Copy v-else class="w-4 h-4" />
            {{ copied ? '已复制' : '复制' }}
          </button>
        </div>
        
        <div class="font-mono text-sm bg-gray-50 dark:bg-dark-200 rounded-lg p-4 break-all text-gray-800 dark:text-white min-h-[80px]">
          {{ result || '请输入文本' }}
        </div>

        <div v-if="result" class="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>字符长度: {{ result.length }}</span>
          <span>位长度: {{ result.length * 4 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
