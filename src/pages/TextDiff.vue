<script setup lang="ts">
import { ref, computed } from 'vue'
import { Copy, Check, Trash2, RefreshCw } from 'lucide-vue-next'
import { compareText, countLines, countChars } from '@/utils/text'
import type { DiffLine } from '@/utils/text'

const oldText = ref(`Hello World
This is line 2
This is line 3
This is line 4`)

const newText = ref(`Hello World!
This is line 2
This is line 3 modified
This is line 5`)

const copiedLeft = ref(false)
const copiedRight = ref(false)

const diffResult = computed((): DiffLine[] => {
  return compareText(oldText.value, newText.value)
})

const stats = computed(() => ({
  oldLines: countLines(oldText.value),
  newLines: countLines(newText.value),
  oldChars: countChars(oldText.value),
  newChars: countChars(newText.value),
  added: diffResult.value.filter(l => l.added).length,
  removed: diffResult.value.filter(l => l.removed).length,
}))

async function copyLeft() {
  try {
    await navigator.clipboard.writeText(oldText.value)
    copiedLeft.value = true
    setTimeout(() => copiedLeft.value = false, 2000)
  } catch {}
}

async function copyRight() {
  try {
    await navigator.clipboard.writeText(newText.value)
    copiedRight.value = true
    setTimeout(() => copiedRight.value = false, 2000)
  } catch {}
}

function clearLeft() {
  oldText.value = ''
}

function clearRight() {
  newText.value = ''
}

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
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          文本比较
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          对比两段文本的差异，高亮显示新增、删除和修改的内容
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="lg:col-span-1 bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              原始文本
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
              <button
                @click="clearLeft"
                class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="清空"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {{ stats.oldLines }} 行 | {{ stats.oldChars }} 字符
          </div>
          
          <textarea
            v-model="oldText"
            placeholder="请输入原始文本"
            rows="15"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          ></textarea>
        </div>

        <div class="lg:col-span-1 bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              新文本
            </label>
            <div class="flex items-center gap-2">
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
              <button
                @click="clearRight"
                class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="清空"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {{ stats.newLines }} 行 | {{ stats.newChars }} 字符
          </div>
          
          <textarea
            v-model="newText"
            placeholder="请输入新文本"
            rows="15"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          ></textarea>
        </div>

        <div class="lg:col-span-1 bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              差异结果
            </label>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                +{{ stats.added }} 新增
              </span>
              <span class="inline-flex items-center gap-1 text-xs px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
                <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                -{{ stats.removed }} 删除
              </span>
            </div>
          </div>
          
          <div class="font-mono text-sm h-[420px] overflow-auto bg-gray-50 dark:bg-dark-200 rounded-lg p-4">
            <template v-for="(line, index) in diffResult" :key="index">
              <div
                v-if="line.removed"
                class="flex items-start gap-2 py-1 bg-red-50 dark:bg-red-900/20 border-l-2 border-red-500"
              >
                <span class="text-red-400 select-none">-</span>
                <span class="text-gray-600 dark:text-gray-400">{{ line.value }}</span>
              </div>
              <div
                v-else-if="line.added"
                class="flex items-start gap-2 py-1 bg-green-50 dark:bg-green-900/20 border-l-2 border-green-500"
              >
                <span class="text-green-400 select-none">+</span>
                <span class="text-gray-600 dark:text-gray-400">{{ line.value }}</span>
              </div>
              <div
                v-else
                class="flex items-start gap-2 py-1 border-l-2 border-transparent"
              >
                <span class="text-gray-300 select-none"> </span>
                <span class="text-gray-600 dark:text-gray-400">{{ line.value }}</span>
              </div>
            </template>
            <div v-if="diffResult.length === 0" class="text-gray-400 text-center py-8">
              请输入文本进行比较
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>