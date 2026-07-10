<script setup lang="ts">
import { ref, computed } from 'vue'
import { Copy, Check, Trash2, RefreshCw } from 'lucide-vue-next'

const inputText = ref(`1001
1002
1003
1004
1005`)
const dataType = ref<'string' | 'number'>('number')
const quoteStyle = ref<'single' | 'double'>('single')
const separator = ref<'comma' | 'comma-space'>('comma-space')
const shouldDeduplicate = ref(true)
const shouldSort = ref(true)
const maxPerGroup = ref(1000)
const copied = ref(false)

function parseValues(text: string): string[] {
  if (!text.trim()) return []
  const lines = text.split(/[\n\r,]+/)
  return lines.map(l => l.trim()).filter(l => l !== '')
}

function formatValue(value: string, type: 'string' | 'number', quote: 'single' | 'double'): string {
  if (type === 'number') {
    const num = Number(value)
    if (!isNaN(num)) return String(num)
  }
  const q = quote === 'single' ? "'" : '"'
  return q + value + q
}

const outputText = computed(() => {
  let values = parseValues(inputText.value)
  if (values.length === 0) return ''

  if (shouldDeduplicate.value) {
    values = [...new Set(values)]
  }

  if (shouldSort.value) {
    values.sort((a, b) => {
      const na = Number(a)
      const nb = Number(b)
      if (!isNaN(na) && !isNaN(nb)) return na - nb
      return a.localeCompare(b)
    })
  }

  const sep = separator.value === 'comma' ? ',' : ', '
  const formatted = values.map(v => formatValue(v, dataType.value, quoteStyle.value))

  const max = maxPerGroup.value
  if (max > 0 && formatted.length > max) {
    const groups: string[] = []
    for (let i = 0; i < formatted.length; i += max) {
      groups.push(formatted.slice(i, i + max).join(sep))
    }
    return groups.map((g, i) => `IN (${g})  -- 第 ${i + 1} 段`).join('\nOR\n')
  }

  return `IN (${formatted.join(sep)})`
})

const stats = computed(() => {
  const values = parseValues(inputText.value)
  const unique = [...new Set(values)]
  return {
    total: values.length,
    unique: unique.length,
    groups: maxPerGroup.value > 0 && values.length > maxPerGroup.value
      ? Math.ceil(values.length / maxPerGroup.value)
      : 1,
  }
})

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
  inputText.value = `1001\n1002\n1003\n1004\n1005`
  dataType.value = 'number'
  quoteStyle.value = 'single'
  separator.value = 'comma-space'
  shouldDeduplicate.value = true
  shouldSort.value = true
  maxPerGroup.value = 1000
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          IN条件生成
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          将数据列表转换为 SQL IN 条件语句，支持分段、去重和排序
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left: Input -->
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              输入数据
              <span class="text-xs text-gray-400 dark:text-gray-500 ml-2">(每行一个值，支持逗号分隔)</span>
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
            placeholder="请输入数据，每行一个值&#10;例如：&#10;1001&#10;1002&#10;1003"
            rows="12"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all mb-4"
          ></textarea>

          <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>共 {{ stats.total }} 条</span>
            <span v-if="stats.total !== stats.unique">去重后 {{ stats.unique }} 条</span>
          </div>
        </div>

        <!-- Right: Options + Output -->
        <div class="space-y-6">
          <!-- Options -->
          <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              生成选项
            </label>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">数据类型</label>
                <div class="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                  <button
                    @click="dataType = 'string'"
                    :class="[
                      'flex-1 py-2 text-xs font-medium transition-all',
                      dataType === 'string'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-50 dark:bg-dark-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    ]"
                  >
                    字符串
                  </button>
                  <button
                    @click="dataType = 'number'"
                    :class="[
                      'flex-1 py-2 text-xs font-medium transition-all',
                      dataType === 'number'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-50 dark:bg-dark-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    ]"
                  >
                    数字
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">引号风格</label>
                <div class="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                  <button
                    @click="quoteStyle = 'single'"
                    :class="[
                      'flex-1 py-2 text-xs font-medium transition-all',
                      quoteStyle === 'single'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-50 dark:bg-dark-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    ]"
                  >
                    单引号
                  </button>
                  <button
                    @click="quoteStyle = 'double'"
                    :class="[
                      'flex-1 py-2 text-xs font-medium transition-all',
                      quoteStyle === 'double'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-50 dark:bg-dark-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    ]"
                  >
                    双引号
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">分隔符</label>
                <div class="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                  <button
                    @click="separator = 'comma'"
                    :class="[
                      'flex-1 py-2 text-xs font-medium transition-all',
                      separator === 'comma'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-50 dark:bg-dark-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    ]"
                  >
                    逗号
                  </button>
                  <button
                    @click="separator = 'comma-space'"
                    :class="[
                      'flex-1 py-2 text-xs font-medium transition-all',
                      separator === 'comma-space'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-50 dark:bg-dark-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    ]"
                  >
                    逗号+空格
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                  每段最大数量
                  <span class="text-gray-400">(0=不分段)</span>
                </label>
                <input
                  v-model.number="maxPerGroup"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div class="flex items-center gap-6 mt-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="shouldDeduplicate"
                  type="checkbox"
                  class="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span class="text-sm text-gray-600 dark:text-gray-300">去重</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="shouldSort"
                  type="checkbox"
                  class="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span class="text-sm text-gray-600 dark:text-gray-300">排序</span>
              </label>
            </div>
          </div>

          <!-- Output -->
          <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  输出结果
                </label>
                <span v-if="stats.groups > 1" class="text-xs px-2 py-1 bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded">
                  分 {{ stats.groups }} 段
                </span>
              </div>
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

            <div class="font-mono text-sm h-[200px] overflow-auto bg-gray-50 dark:bg-dark-200 rounded-lg p-4 whitespace-pre-wrap break-all">
              {{ outputText || '请输入数据生成IN条件' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>