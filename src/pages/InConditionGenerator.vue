<!--
  IN条件生成组件
  
  功能描述：
  - 将数据列表转换为SQL IN条件语句
  - 支持数据类型选择（字符串/数字）
  - 支持引号风格选择（单引号/双引号）
  - 支持分隔符选择（逗号/逗号+空格）
  - 支持分段功能，解决IN条件过长的数据库限制
  - 支持去重和排序功能
  
  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
// 引入操作图标组件
import { Copy, Check, Trash2, RefreshCw } from 'lucide-vue-next'

// 输入文本：用户输入的数据列表，每行一个值，默认提供示例
const inputText = ref(`1001
1002
1003
1004
1005`)

// 数据类型：字符串或数字
const dataType = ref<'string' | 'number'>('number')

// 引号风格：单引号或双引号（仅对字符串类型有效）
const quoteStyle = ref<'single' | 'double'>('single')

// 分隔符：逗号或逗号+空格
const separator = ref<'comma' | 'comma-space'>('comma-space')

// 是否去重：移除重复值
const shouldDeduplicate = ref(true)

// 是否排序：对值进行排序
const shouldSort = ref(true)

// 每段最大数量：超过此数量时分段生成，0表示不分段
const maxPerGroup = ref(1000)

// 复制状态标记
const copied = ref(false)

/**
 * 解析输入文本为值数组
 * 支持换行和逗号分隔
 * @param text - 输入文本
 * @returns 解析后的值数组
 */
function parseValues(text: string): string[] {
  if (!text.trim()) return []
  // 按换行或逗号分隔
  const lines = text.split(/[\n\r,]+/)
  // 去除每项首尾空格，过滤空值
  return lines.map(l => l.trim()).filter(l => l !== '')
}

/**
 * 格式化单个值
 * 根据数据类型和引号风格格式化值
 * @param value - 原始值
 * @param type - 数据类型
 * @param quote - 引号风格
 * @returns 格式化后的值字符串
 */
function formatValue(value: string, type: 'string' | 'number', quote: 'single' | 'double'): string {
  if (type === 'number') {
    const num = Number(value)
    // 有效数字直接返回数字格式
    if (!isNaN(num)) return String(num)
  }
  // 字符串类型添加引号
  const q = quote === 'single' ? "'" : '"'
  return q + value + q
}

// 输出文本计算属性
// 根据配置生成IN条件语句
const outputText = computed(() => {
  let values = parseValues(inputText.value)
  if (values.length === 0) return ''

  // 去重处理
  if (shouldDeduplicate.value) {
    values = [...new Set(values)]
  }

  // 排序处理：数字按数值排序，其他按字母排序
  if (shouldSort.value) {
    values.sort((a, b) => {
      const na = Number(a)
      const nb = Number(b)
      if (!isNaN(na) && !isNaN(nb)) return na - nb
      return a.localeCompare(b)
    })
  }

  // 确定分隔符
  const sep = separator.value === 'comma' ? ',' : ', '
  // 格式化所有值
  const formatted = values.map(v => formatValue(v, dataType.value, quoteStyle.value))

  // 分段处理
  const max = maxPerGroup.value
  if (max > 0 && formatted.length > max) {
    const groups: string[] = []
    // 按最大数量分组
    for (let i = 0; i < formatted.length; i += max) {
      groups.push(formatted.slice(i, i + max).join(sep))
    }
    // 使用OR连接多个IN条件
    return groups.map((g, i) => `IN (${g})  -- 第 ${i + 1} 段`).join('\nOR\n')
  }

  // 单段直接生成
  return `IN (${formatted.join(sep)})`
})

// 统计信息计算属性
const stats = computed(() => {
  const values = parseValues(inputText.value)
  const unique = [...new Set(values)]
  return {
    total: values.length, // 总数
    unique: unique.length, // 唯一值数量
    groups: maxPerGroup.value > 0 && values.length > maxPerGroup.value
      ? Math.ceil(values.length / maxPerGroup.value)
      : 1, // 分段数量
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
}

/**
 * 重置为默认示例和配置
 */
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
      <!-- 页面标题和描述 -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          IN条件生成
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          将数据列表转换为 SQL IN 条件语句，支持分段、去重和排序
        </p>
      </div>

      <!-- 双栏布局：输入和配置/输出 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左侧：输入区域 -->
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              输入数据
              <span class="text-xs text-gray-400 dark:text-gray-500 ml-2">(每行一个值，支持逗号分隔)</span>
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
            placeholder="请输入数据，每行一个值&#10;例如：&#10;1001&#10;1002&#10;1003"
            rows="12"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all mb-4"
          ></textarea>

          <!-- 统计信息 -->
          <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>共 {{ stats.total }} 条</span>
            <span v-if="stats.total !== stats.unique">去重后 {{ stats.unique }} 条</span>
          </div>
        </div>

        <!-- 右侧：配置选项和输出 -->
        <div class="space-y-6">
          <!-- 配置选项区域 -->
          <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              生成选项
            </label>

            <!-- 选项网格布局 -->
            <div class="grid grid-cols-2 gap-4">
              <!-- 数据类型选择 -->
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

              <!-- 引号风格选择 -->
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

              <!-- 分隔符选择 -->
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

              <!-- 每段最大数量输入 -->
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

            <!-- 复选框选项 -->
            <div class="flex items-center gap-6 mt-4">
              <!-- 去重选项 -->
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="shouldDeduplicate"
                  type="checkbox"
                  class="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span class="text-sm text-gray-600 dark:text-gray-300">去重</span>
              </label>
              <!-- 排序选项 -->
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

          <!-- 输出区域 -->
          <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  输出结果
                </label>
                <!-- 分段数量标识 -->
                <span v-if="stats.groups > 1" class="text-xs px-2 py-1 bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded">
                  分 {{ stats.groups }} 段
                </span>
              </div>
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

            <!-- 输出结果显示 -->
            <div class="font-mono text-sm h-[200px] overflow-auto bg-gray-50 dark:bg-dark-200 rounded-lg p-4 whitespace-pre-wrap break-all">
              {{ outputText || '请输入数据生成IN条件' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>