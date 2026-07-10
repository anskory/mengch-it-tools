<script setup lang="ts">
import { ref, computed } from 'vue'
import { Copy, Check, Trash2, RefreshCw } from 'lucide-vue-next'
import { variableTransforms } from '@/utils/variable'

const inputText = ref('myVariableName')
const copiedIndex = ref<number | null>(null)

const results = computed(() => {
  return variableTransforms.map((transform, index) => ({
    ...transform,
    result: transform.transform(inputText.value),
    index,
  }))
})

async function copyText(text: string, index: number) {
  try {
    await navigator.clipboard.writeText(text)
    copiedIndex.value = index
    setTimeout(() => {
      copiedIndex.value = null
    }, 2000)
  } catch {
    console.error('复制失败')
  }
}

function clearInput() {
  inputText.value = ''
}

function resetExample() {
  inputText.value = 'myVariableName'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          变量名转换
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          将变量名在不同命名风格之间转换
        </p>
      </div>

      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            输入变量名
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
              title="清空输入"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <textarea
          v-model="inputText"
          placeholder="请输入变量名，如: myVariableName 或 my_variable_name"
          rows="3"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="item in results"
          :key="item.name"
          class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:border-primary-400 dark:hover:border-primary-500 transition-all"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ item.label }}
            </span>
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
          
          <div class="font-mono text-lg text-gray-800 dark:text-white break-all p-3 bg-gray-50 dark:bg-dark-200 rounded-lg">
            {{ item.result || '-' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>