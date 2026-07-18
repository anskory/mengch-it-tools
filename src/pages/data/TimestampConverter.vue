<!--
  时间戳转换组件
  
  功能描述：
  - 时间戳转日期时间
  - 日期时间转时间戳
  - 支持秒和毫秒两种单位
  - 多种日期格式支持
  - 快速获取当前时间戳
  
  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Copy, Check, Trash2, RefreshCw, Clock } from 'lucide-vue-next'
import { timestampToDate, dateToTimestamp, getCurrentTimestamp, dateFormats, type TimestampUnit } from '@/utils/datetime'

const mode = ref<'ts2date' | 'date2ts'>('ts2date')
const timestampInput = ref(String(Math.floor(Date.now() / 1000)))
const timestampUnit = ref<TimestampUnit>('s')
const dateInput = ref('')
const dateFormat = ref('YYYY-MM-DD HH:mm:ss')
const formatIndex = ref(0)
const copied = ref(false)
const currentTimestamp = ref(getCurrentTimestamp('s'))

let timer: number | null = null

onMounted(() => {
  updateCurrentDate()
  timer = window.setInterval(() => {
    currentTimestamp.value = getCurrentTimestamp(timestampUnit.value)
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const dateResult = computed(() => {
  if (!timestampInput.value) return ''
  return timestampToDate(timestampInput.value, timestampUnit.value, dateFormats[formatIndex.value].value)
})

const timestampResult = computed(() => {
  if (!dateInput.value) return 0
  return dateToTimestamp(dateInput.value, timestampUnit.value)
})

function updateCurrentDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  dateInput.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function useCurrentTimestamp() {
  timestampInput.value = String(getCurrentTimestamp(timestampUnit.value))
}

function useCurrentDate() {
  updateCurrentDate()
}

function toggleMode() {
  mode.value = mode.value === 'ts2date' ? 'date2ts' : 'ts2date'
}

function toggleUnit() {
  timestampUnit.value = timestampUnit.value === 's' ? 'ms' : 's'
  currentTimestamp.value = getCurrentTimestamp(timestampUnit.value)
}

async function copyResult() {
  const text = mode.value === 'ts2date' ? dateResult.value : String(timestampResult.value)
  if (!text) return
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
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
  if (mode.value === 'ts2date') {
    timestampInput.value = ''
  } else {
    dateInput.value = ''
  }
}

function resetExample() {
  timestampUnit.value = 's'
  formatIndex.value = 0
  if (mode.value === 'ts2date') {
    timestampInput.value = String(Math.floor(Date.now() / 1000))
  } else {
    updateCurrentDate()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          时间戳转换
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          时间戳与日期时间格式相互转换，支持秒和毫秒
        </p>
      </div>

      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">模式:</label>
              <button
                @click="toggleMode"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                :class="[
                  mode === 'ts2date'
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                ]"
              >
                {{ mode === 'ts2date' ? '时间戳 → 日期' : '日期 → 时间戳' }}
              </button>
            </div>

            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">单位:</label>
              <button
                @click="toggleUnit"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                :class="[
                  timestampUnit === 's'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                ]"
              >
                秒 (s)
              </button>
              <button
                @click="toggleUnit"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                :class="[
                  timestampUnit === 'ms'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                ]"
              >
                毫秒 (ms)
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock class="w-4 h-4" />
            <span>当前时间戳: </span>
            <span class="font-mono text-primary-600 dark:text-primary-400 cursor-pointer" @click="useCurrentTimestamp">
              {{ currentTimestamp }}
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ mode === 'ts2date' ? '输入时间戳' : '输入日期时间' }}
            </label>
            <div class="flex items-center gap-2">
              <button
                @click="mode === 'ts2date' ? useCurrentTimestamp() : useCurrentDate()"
                class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                :title="mode === 'ts2date' ? '当前时间戳' : '当前时间'"
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
          
          <template v-if="mode === 'ts2date'">
            <input
              v-model="timestampInput"
              type="text"
              placeholder="请输入时间戳"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </template>
          <template v-else>
            <input
              v-model="dateInput"
              type="text"
              placeholder="YYYY-MM-DD HH:mm:ss"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                v-for="(fmt, idx) in dateFormats.slice(0, 4)"
                :key="fmt.value"
                @click="dateFormat = fmt.value; formatIndex = idx"
                :class="[
                  'px-2 py-1 text-xs rounded transition-all',
                  formatIndex === idx
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                ]"
              >
                {{ fmt.label }}
              </button>
            </div>
          </template>
        </div>

        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ mode === 'ts2date' ? '转换结果 (日期)' : '转换结果 (时间戳)' }}
            </label>
            <button
              @click="copyResult"
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
          
          <div class="font-mono text-lg bg-gray-50 dark:bg-dark-200 rounded-lg p-4 break-all text-gray-800 dark:text-white min-h-[60px] flex items-center">
            {{ (mode === 'ts2date' ? dateResult : timestampResult) || '请输入内容' }}
          </div>

          <div v-if="mode === 'ts2date' && dateResult" class="mt-4 flex flex-wrap gap-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">更多格式:</span>
            <button
              v-for="(fmt, idx) in dateFormats"
              :key="fmt.value"
              @click="formatIndex = idx; dateFormat = fmt.value"
              :class="[
                'px-2 py-1 text-xs rounded transition-all',
                formatIndex === idx
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              ]"
            >
              {{ timestampToDate(timestampInput, timestampUnit, fmt.value) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
