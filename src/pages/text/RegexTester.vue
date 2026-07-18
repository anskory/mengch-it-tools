<!--
  正则表达式测试组件
  
  功能描述：
  - 测试正则表达式匹配结果
  - 支持多种标志位（g/i/m/s/u）
  - 高亮显示匹配内容
  - 显示分组信息
  - 提供常用正则表达式模板
  
  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Copy, Check, Trash2, RefreshCw, ChevronDown, Regex } from 'lucide-vue-next'
import { testRegex, commonPatterns, type RegexMatchResult } from '@/utils/regex'

const pattern = ref('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
const flags = ref('g')
const testText = ref('联系方式：test@example.com 或 admin@mengch.cn，电话：13800138000')
const copied = ref(false)
const showCommonPatterns = ref(false)

const flagOptions = [
  { value: 'g', label: 'g', desc: '全局匹配' },
  { value: 'i', label: 'i', desc: '忽略大小写' },
  { value: 'm', label: 'm', desc: '多行模式' },
  { value: 's', label: 's', desc: '点号匹配换行' },
  { value: 'u', label: 'u', desc: 'Unicode模式' },
]

const result = computed(() => testRegex(pattern.value, flags.value, testText.value))

const highlightedText = computed(() => {
  if (!result.value.isValid || result.value.matches.length === 0) {
    return testText.value
  }
  const matches = [...result.value.matches].sort((a, b) => b.start - a.start)
  let text = testText.value
  for (const match of matches) {
    const before = text.slice(0, match.start)
    const matched = text.slice(match.start, match.end)
    const after = text.slice(match.end)
    text = before + `\u0000HIGHLIGHT_START\u0000${matched}\u0000HIGHLIGHT_END\u0000` + after
  }
  return text
})

function toggleFlag(flag: string) {
  if (flags.value.includes(flag)) {
    flags.value = flags.value.replace(flag, '')
  } else {
    flags.value += flag
  }
}

function useCommonPattern(pat: typeof commonPatterns[0]) {
  pattern.value = pat.pattern
  flags.value = pat.flags
  showCommonPatterns.value = false
}

async function copyMatches() {
  const text = result.value.matches.map(m => m.match).join('\n')
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
  testText.value = ''
}

function resetExample() {
  pattern.value = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
  flags.value = 'g'
  testText.value = '联系方式：test@example.com 或 admin@mengch.cn，电话：13800138000'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          正则表达式测试
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          在线测试正则表达式，实时查看匹配结果和分组信息
        </p>
      </div>

      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            正则表达式
          </label>
          <div class="relative">
            <button
              @click="showCommonPatterns = !showCommonPatterns"
              class="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Regex class="w-4 h-4" />
              常用模板
              <ChevronDown class="w-3 h-3" />
            </button>
            <div
              v-if="showCommonPatterns"
              class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 py-1"
            >
              <button
                v-for="pat in commonPatterns"
                :key="pat.name"
                @click="useCommonPattern(pat)"
                class="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {{ pat.name }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-2 mb-4">
          <span class="text-gray-400 dark:text-gray-500 text-lg font-mono">/</span>
          <input
            v-model="pattern"
            type="text"
            placeholder="输入正则表达式"
            class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          />
          <span class="text-gray-400 dark:text-gray-500 text-lg font-mono">/</span>
          <input
            v-model="flags"
            type="text"
            placeholder="flags"
            class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          />
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="opt in flagOptions"
            :key="opt.value"
            @click="toggleFlag(opt.value)"
            :class="[
              'px-3 py-1 rounded-lg text-sm font-mono transition-all',
              flags.includes(opt.value)
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            ]"
            :title="opt.desc"
          >
            {{ opt.label }}
            <span class="text-xs opacity-70 ml-1">{{ opt.desc }}</span>
          </button>
        </div>

        <div
          v-if="!result.isValid"
          class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm"
        >
          {{ result.error }}
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              测试文本
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
            v-model="testText"
            placeholder="请输入要测试的文本"
            rows="10"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          ></textarea>
        </div>

        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              匹配结果
              <span
                v-if="result.isValid"
                class="ml-2 text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full"
              >
                {{ result.matchCount }} 个匹配
              </span>
            </label>
            <button
              v-if="result.matchCount > 0"
              @click="copyMatches"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
                copied
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              ]"
            >
              <Check v-if="copied" class="w-3.5 h-3.5" />
              <Copy v-else class="w-3.5 h-3.5" />
              {{ copied ? '已复制' : '复制全部' }}
            </button>
          </div>
          
          <div class="font-mono text-sm h-[240px] overflow-auto bg-gray-50 dark:bg-dark-200 rounded-lg p-4 whitespace-pre-wrap break-all text-gray-800 dark:text-white mb-4">
            <template v-if="result.isValid && result.matchCount > 0">
              <template v-for="(part, idx) in highlightedText.split(/\u0000HIGHLIGHT_(START|END)\u0000/)" :key="idx">
                <span v-if="part === 'START'" class="bg-yellow-200 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-200 rounded px-0.5"></span>
                <span v-else-if="part === 'END'"></span>
                <span v-else>{{ part }}</span>
              </template>
            </template>
            <span v-else-if="!result.isValid" class="text-gray-400 dark:text-gray-500">
              正则表达式语法错误
            </span>
            <span v-else class="text-gray-400 dark:text-gray-500">
              无匹配结果
            </span>
          </div>

          <div v-if="result.isValid && result.matches.length > 0" class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">匹配详情</div>
            <div class="max-h-40 overflow-auto space-y-2">
              <div
                v-for="(match, idx) in result.matches.slice(0, 20)"
                :key="idx"
                class="p-2 bg-gray-50 dark:bg-dark-200 rounded-lg text-sm"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">匹配 #{{ idx + 1 }} (位置: {{ match.start }}-{{ match.end }})</span>
                </div>
                <div class="font-mono text-primary-600 dark:text-primary-400 break-all">{{ match.match }}</div>
                <div v-if="match.groups.length > 0" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  分组: 
                  <span
                    v-for="(g, gIdx) in match.groups"
                    :key="gIdx"
                    class="ml-1 px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded font-mono"
                  >
                    ${{ gIdx + 1 }}: {{ g || '(空)' }}
                  </span>
                </div>
              </div>
              <div v-if="result.matches.length > 20" class="text-center text-xs text-gray-400 dark:text-gray-500 py-2">
                还有 {{ result.matches.length - 20 }} 个匹配...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
