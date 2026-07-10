<script setup lang="ts">
import { ref, computed } from 'vue'
import { Copy, Check, Clock, Calendar } from 'lucide-vue-next'

interface CronField {
  name: string
  label: string
  min: number
  max: number
  value: string
  presets: { label: string; value: string }[]
}

const fields = ref<CronField[]>([
  {
    name: 'minute',
    label: '分钟',
    min: 0,
    max: 59,
    value: '0',
    presets: [
      { label: '每分钟', value: '*' },
      { label: '每5分', value: '*/5' },
      { label: '每15分', value: '*/15' },
      { label: '每30分', value: '*/30' },
    ],
  },
  {
    name: 'hour',
    label: '小时',
    min: 0,
    max: 23,
    value: '8',
    presets: [
      { label: '每小时', value: '*' },
      { label: '每2小时', value: '*/2' },
      { label: '每4小时', value: '*/4' },
      { label: '每6小时', value: '*/6' },
      { label: '每12小时', value: '*/12' },
    ],
  },
  {
    name: 'day',
    label: '日期',
    min: 1,
    max: 31,
    value: '*',
    presets: [
      { label: '每天', value: '*' },
      { label: '每月1日', value: '1' },
      { label: '每月15日', value: '15' },
    ],
  },
  {
    name: 'month',
    label: '月份',
    min: 1,
    max: 12,
    value: '*',
    presets: [
      { label: '每月', value: '*' },
      { label: '每季度', value: '*/3' },
      { label: '每半年', value: '*/6' },
    ],
  },
  {
    name: 'week',
    label: '星期',
    min: 0,
    max: 7,
    value: '*',
    presets: [
      { label: '每天', value: '*' },
      { label: '周一至五', value: '1-5' },
      { label: '周六日', value: '0,6' },
      { label: '周日', value: '0' },
      { label: '周一', value: '1' },
    ],
  },
])

const globalPresets = [
  { label: '每分钟', value: '* * * * *' },
  { label: '每5分钟', value: '*/5 * * * *' },
  { label: '每15分钟', value: '*/15 * * * *' },
  { label: '每小时', value: '0 * * * *' },
  { label: '每天8点', value: '0 8 * * *' },
  { label: '每天0点', value: '0 0 * * *' },
  { label: '每周一8点', value: '0 8 * * 1' },
  { label: '每月1日0点', value: '0 0 1 * *' },
  { label: '工作日8点', value: '0 8 * * 1-5' },
]

const cronExpression = computed(() => {
  return fields.value.map(f => f.value).join(' ')
})

const copied = ref(false)

async function copyExpression() {
  try {
    await navigator.clipboard.writeText(cronExpression.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {}
}

function applyPreset(expression: string) {
  const parts = expression.split(' ')
  if (parts.length === 5) {
    fields.value.forEach((field, index) => {
      field.value = parts[index]
    })
  }
}

function applyFieldPreset(fieldIndex: number, value: string) {
  fields.value[fieldIndex].value = value
}

function humanReadable(expression: string): string {
  const parts = expression.split(' ')
  if (parts.length !== 5) return expression

  const [min, hour, day, month, week] = parts
  const desc: string[] = []

  if (month !== '*') {
    if (month === '*/3') desc.push('每季度')
    else if (month === '*/6') desc.push('每半年')
    else desc.push(`${month}月`)
  }

  if (day !== '*') {
    if (day === '1') desc.push('1日')
    else if (day === '15') desc.push('15日')
    else desc.push(`${day}日`)
  }

  if (week !== '*') {
    if (week === '1-5') desc.push('周一至周五')
    else if (week === '0,6') desc.push('周六和周日')
    else if (week === '0' || week === '7') desc.push('周日')
    else if (week === '1') desc.push('周一')
    else if (week === '2') desc.push('周二')
    else if (week === '3') desc.push('周三')
    else if (week === '4') desc.push('周四')
    else if (week === '5') desc.push('周五')
    else if (week === '6') desc.push('周六')
    else desc.push(`星期${week}`)
  }

  if (hour === '*' && min === '*') {
    desc.push('每小时')
  } else if (hour.startsWith('*/')) {
    desc.push(`每${hour.slice(2)}小时`)
  } else if (hour !== '*') {
    if (min === '0') desc.push(`${hour}点整`)
    else desc.push(`${hour}:${min.padStart(2, '0')}`)
  }

  if (min.startsWith('*/')) {
    if (hour === '*') desc.push(`每${min.slice(2)}分钟`)
    else desc.push(`每${min.slice(2)}分钟`)
  } else if (min !== '0' && min !== '*') {
    desc.push(`${min}分`)
  }

  if (desc.length === 0) return '每分钟执行'

  const timeParts = desc.filter(d =>
    d.includes('点') || d.includes('分') || d.includes('小时') || d.includes(':')
  )
  const dateParts = desc.filter(d =>
    !d.includes('点') && !d.includes('分') && !d.includes('小时') && !d.includes(':')
  )

  let result = ''
  if (dateParts.length > 0) result += dateParts.join('')
  if (timeParts.length > 0) {
    if (result) result += '的'
    result += timeParts.join('')
  }

  return result || '执行'
}

function getNextExecutions(expression: string, count: number = 5): string[] {
  const parts = expression.split(' ')
  if (parts.length !== 5) return []

  const [minStr, hourStr, dayStr, monthStr, weekStr] = parts
  const results: string[] = []
  const now = new Date()

  function matches(value: number, pattern: string, min: number, max: number): boolean {
    if (pattern === '*') return true
    if (pattern.includes('/')) {
      const [, step] = pattern.split('/')
      return value % parseInt(step) === 0
    }
    if (pattern.includes('-')) {
      const [start, end] = pattern.split('-').map(Number)
      return value >= start && value <= end
    }
    if (pattern.includes(',')) {
      return pattern.split(',').map(Number).includes(value)
    }
    return value === parseInt(pattern)
  }

  let checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1)

  while (results.length < count) {
    const m = checkDate.getMinutes()
    const h = checkDate.getHours()
    const d = checkDate.getDate()
    const mo = checkDate.getMonth() + 1
    const w = checkDate.getDay()

    if (
      matches(m, minStr, 0, 59) &&
      matches(h, hourStr, 0, 23) &&
      matches(d, dayStr, 1, 31) &&
      matches(mo, monthStr, 1, 12) &&
      matches(w, weekStr, 0, 7)
    ) {
      results.push(
        checkDate.toLocaleString('zh-CN', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          weekday: 'short',
        })
      )
    }

    checkDate.setMinutes(checkDate.getMinutes() + 1)

    if (checkDate.getFullYear() > now.getFullYear() + 1) break
  }

  return results
}

const nextExecutions = computed(() => {
  return getNextExecutions(cronExpression.value, 5)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Crontab生成器
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          可视化配置定时任务，生成 Crontab 表达式
        </p>
      </div>

      <!-- Global Presets -->
      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          常用预设
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in globalPresets"
            :key="preset.value"
            @click="applyPreset(preset.value)"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
            :class="[
              cronExpression === preset.value
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-dark-200 dark:text-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
            ]"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>

      <!-- Expression Display -->
      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <Clock class="w-5 h-5 text-primary-500" />
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Crontab 表达式
            </label>
          </div>
          <button
            @click="copyExpression"
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

        <div class="font-mono text-xl text-center py-4 bg-gray-50 dark:bg-dark-200 rounded-lg text-gray-800 dark:text-white">
          {{ cronExpression }}
        </div>

        <div class="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar class="w-4 h-4" />
          <span>{{ humanReadable(cronExpression) }}</span>
        </div>
      </div>

      <!-- Fields -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div
          v-for="(field, index) in fields"
          :key="field.name"
          class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
        >
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ field.label }}
            </label>
            <span class="text-xs text-gray-400 dark:text-gray-500">
              {{ field.min }}-{{ field.max }}
            </span>
          </div>

          <input
            v-model="field.value"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white font-mono text-sm text-center focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all mb-3"
          />

          <div class="space-y-1">
            <button
              v-for="preset in field.presets"
              :key="preset.value"
              @click="applyFieldPreset(index, preset.value)"
              class="w-full px-2 py-1.5 rounded text-xs font-medium transition-all text-left"
              :class="[
                field.value === preset.value
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              ]"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Next Executions -->
      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center gap-2 mb-4">
          <Clock class="w-5 h-5 text-primary-500" />
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            未来5次执行时间
          </label>
        </div>

        <div v-if="nextExecutions.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div
            v-for="(time, i) in nextExecutions"
            :key="i"
            class="px-4 py-3 bg-gray-50 dark:bg-dark-200 rounded-lg text-center"
          >
            <div class="text-xs text-gray-400 dark:text-gray-500 mb-1">第 {{ i + 1 }} 次</div>
            <div class="text-sm font-mono text-gray-700 dark:text-gray-300">{{ time }}</div>
          </div>
        </div>
        <div v-else class="text-center text-gray-400 py-8">
          无法计算执行时间
        </div>
      </div>
    </div>
  </div>
</template>