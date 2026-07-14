<!--
  JSON转义/去转义工具

  功能描述：
  - 示例：加载示例JSON数据
  - 压缩：将JSON压缩成一行
  - 压缩并转义：压缩JSON并转义为字符串
  - 转义：将JSON对象转义为可嵌入代码的字符串
  - 去除转义：将转义后的字符串还原为JSON
  - Unicode转中文：将\uXXXX格式转为中文
  - 中文转Unicode：将中文转为\uXXXX格式
  - 中文符号转英文符号：中文标点转英文标点
  - 下载：下载结果文件
  - 交换：交换输入输出内容
  - 清空：清空输入内容

  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Copy, Check, Trash2, RefreshCw, ArrowRightLeft, Download,
  FileJson, Minimize2, Code, Languages, Type
} from 'lucide-vue-next'

// 输入文本
const inputText = ref('')
// 输出文本
const outputText = ref('')
// 复制状态
const copied = ref(false)
// 错误信息
const errorMsg = ref('')

// 示例JSON数据
const exampleJson = `{
  "name": "檬橙IT工具箱",
  "version": "1.0.0",
  "url": "https://it.mengch.cn",
  "description": "一款实用的IT工具集合\\n支持多种格式转换"
}`

// 中文符号到英文符号的映射
const cnToEnPunctuation: Record<string, string> = {
  '，': ',',
  '。': '.',
  '；': ';',
  '：': ':',
  '？': '?',
  '！': '!',
  '（': '(',
  '）': ')',
  '【': '[',
  '】': ']',
  '｛': '{',
  '｝': '}',
  '“': '"',
  '”': '"',
  '‘': "'",
  '’': "'",
  '《': '<',
  '》': '>',
  '、': ',',
  '·': '`',
  '～': '~',
  '—': '-',
  '…': '...',
}

/**
 * 显示错误信息
 * @param msg 错误信息
 */
function showError(msg: string) {
  errorMsg.value = msg
  setTimeout(() => errorMsg.value = '', 3000)
}

/**
 * 加载示例数据
 */
function loadExample() {
  inputText.value = exampleJson
  outputText.value = ''
  errorMsg.value = ''
}

/**
 * 清空输入
 */
function clearInput() {
  inputText.value = ''
  outputText.value = ''
  errorMsg.value = ''
}

/**
 * 压缩JSON
 * 将JSON格式化为一行，去除多余空格
 */
function compressJson() {
  if (!inputText.value.trim()) {
    showError('请输入JSON内容')
    return
  }
  try {
    const parsed = JSON.parse(inputText.value)
    outputText.value = JSON.stringify(parsed)
    errorMsg.value = ''
  } catch {
    showError('无效的JSON格式')
  }
}

/**
 * 压缩并转义
 * 先将JSON压缩，再转义为可嵌入代码的字符串
 */
function compressAndEscape() {
  if (!inputText.value.trim()) {
    showError('请输入JSON内容')
    return
  }
  try {
    const parsed = JSON.parse(inputText.value)
    const compressed = JSON.stringify(parsed)
    // 将压缩后的JSON再作为字符串转义
    outputText.value = JSON.stringify(compressed)
    errorMsg.value = ''
  } catch {
    showError('无效的JSON格式')
  }
}

/**
 * 转义JSON
 * 将JSON对象/字符串转义为可嵌入代码的字符串形式
 * 例如：{"a":"b"} -> "{\"a\":\"b\"}"
 */
function escapeJson() {
  if (!inputText.value.trim()) {
    showError('请输入JSON内容')
    return
  }
  try {
    // 先尝试解析输入为JSON对象
    const parsed = JSON.parse(inputText.value)
    // 序列化为JSON字符串
    const jsonStr = JSON.stringify(parsed)
    // 再将JSON字符串作为字符串进行转义
    outputText.value = JSON.stringify(jsonStr)
    errorMsg.value = ''
  } catch {
    // 如果不是有效JSON，直接作为字符串转义
    outputText.value = JSON.stringify(inputText.value)
    errorMsg.value = ''
  }
}

/**
 * 去除转义
 * 将转义后的JSON字符串还原
 * 例如："{\"a\":\"b\"}" -> {"a": "b"}（格式化）
 */
function unescapeJson() {
  if (!inputText.value.trim()) {
    showError('请输入转义后的JSON内容')
    return
  }
  try {
    // 第一步：解析外层字符串，得到内层JSON字符串
    let innerStr: string = inputText.value

    // 如果输入被双引号包裹，先尝试JSON.parse
    if ((inputText.value.startsWith('"') && inputText.value.endsWith('"')) ||
        (inputText.value.startsWith("'") && inputText.value.endsWith("'"))) {
      try {
        innerStr = JSON.parse(inputText.value)
      } catch {
        // 如果JSON.parse失败，可能是单引号包裹，手动去除
        innerStr = inputText.value.slice(1, -1)
      }
    }

    // 第二步：将内层字符串中的转义字符还原
    // 替换常见的转义序列
    innerStr = innerStr
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\\\/g, '\\')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\b/g, '\b')
      .replace(/\\f/g, '\f')

    // 第三步：尝试解析为JSON并格式化
    try {
      const parsed = JSON.parse(innerStr)
      outputText.value = JSON.stringify(parsed, null, 2)
    } catch {
      // 如果不是有效JSON，直接输出还原后的字符串
      outputText.value = innerStr
    }
    errorMsg.value = ''
  } catch {
    showError('去除转义失败，请检查输入格式')
  }
}

/**
 * Unicode转中文
 * 将\uXXXX格式转换为中文字符
 */
function unicodeToChinese() {
  if (!inputText.value.trim()) {
    showError('请输入包含Unicode编码的内容')
    return
  }
  try {
    // 使用JSON.parse解析Unicode转义序列
    // 先将内容包装成JSON字符串格式
    const wrapped = '"' + inputText.value.replace(/"/g, '\\"') + '"'
    outputText.value = JSON.parse(wrapped)
    errorMsg.value = ''
  } catch {
    // 如果整体解析失败，尝试逐个替换
    try {
      outputText.value = inputText.value.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
        return String.fromCharCode(parseInt(hex, 16))
      })
      errorMsg.value = ''
    } catch {
      showError('Unicode转中文失败')
    }
  }
}

/**
 * 中文转Unicode
 * 将中文字符转换为\uXXXX格式
 */
function chineseToUnicode() {
  if (!inputText.value.trim()) {
    showError('请输入包含中文的内容')
    return
  }
  try {
    outputText.value = inputText.value.split('').map(char => {
      const code = char.charCodeAt(0)
      // 中文字符范围：\u4e00-\u9fa5，以及中文标点等
      if (code > 127) {
        return '\\u' + code.toString(16).padStart(4, '0')
      }
      return char
    }).join('')
    errorMsg.value = ''
  } catch {
    showError('中文转Unicode失败')
  }
}

/**
 * 中文符号转英文符号
 * 将中文标点符号转换为英文标点符号
 */
function cnSymbolToEn() {
  if (!inputText.value.trim()) {
    showError('请输入包含中文符号的内容')
    return
  }
  let result = inputText.value
  for (const [cn, en] of Object.entries(cnToEnPunctuation)) {
    result = result.split(cn).join(en)
  }
  outputText.value = result
  errorMsg.value = ''
}

/**
 * 下载结果文件
 */
function downloadResult() {
  if (!outputText.value) {
    showError('没有可下载的内容')
    return
  }
  const blob = new Blob([outputText.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'result.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 交换输入输出
 */
function swapText() {
  if (!outputText.value) {
    showError('没有可交换的内容')
    return
  }
  const temp = inputText.value
  inputText.value = outputText.value
  outputText.value = temp
  errorMsg.value = ''
}

/**
 * 复制输出结果到剪贴板
 */
async function copyOutput() {
  if (!outputText.value) return
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

// 统计信息
const stats = computed(() => {
  return {
    inputLength: inputText.value.length,
    outputLength: outputText.value.length,
    inputLines: inputText.value ? inputText.value.split('\n').length : 0,
    outputLines: outputText.value ? outputText.value.split('\n').length : 0,
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题和描述 -->
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          JSON转义/去转义
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          JSON压缩、转义、Unicode转换、中文符号转换等多种处理功能
        </p>
      </div>

      <!-- 双栏布局 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左侧：输入区域 -->
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              输入
            </label>
            <!-- 操作按钮组 -->
            <div class="flex items-center gap-2">
              <button
                @click="loadExample"
                class="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex items-center gap-1"
                title="加载示例"
              >
                <FileJson class="w-3.5 h-3.5" />
                示例
              </button>
              <button
                @click="clearInput"
                class="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-1"
                title="清空"
              >
                <Trash2 class="w-3.5 h-3.5" />
                清空
              </button>
            </div>
          </div>

          <!-- 输入文本框 -->
          <textarea
            v-model="inputText"
            placeholder="请输入JSON内容..."
            rows="12"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          ></textarea>

          <!-- 输入统计 -->
          <div class="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>{{ stats.inputLength }} 字符</span>
            <span>{{ stats.inputLines }} 行</span>
          </div>
        </div>

        <!-- 右侧：输出区域 -->
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              输出
            </label>
            <!-- 操作按钮组 -->
            <div class="flex items-center gap-2">
              <button
                @click="swapText"
                class="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                title="交换"
              >
                <ArrowRightLeft class="w-3.5 h-3.5" />
                交换
              </button>
              <button
                @click="downloadResult"
                class="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-1"
                title="下载"
              >
                <Download class="w-3.5 h-3.5" />
                下载
              </button>
              <button
                @click="copyOutput"
                :disabled="!outputText"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1',
                  copied
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : outputText
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800 cursor-not-allowed'
                ]"
              >
                <Check v-if="copied" class="w-3.5 h-3.5" />
                <Copy v-else class="w-3.5 h-3.5" />
                {{ copied ? '已复制' : '复制' }}
              </button>
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-600 dark:text-red-400">{{ errorMsg }}</p>
          </div>

          <!-- 输出文本框 -->
          <textarea
            v-model="outputText"
            placeholder="处理结果将显示在这里..."
            rows="12"
            readonly
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          ></textarea>

          <!-- 输出统计 -->
          <div class="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>{{ stats.outputLength }} 字符</span>
            <span>{{ stats.outputLines }} 行</span>
          </div>
        </div>
      </div>

      <!-- 功能按钮区 -->
      <div class="mt-6 bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div class="flex flex-wrap items-center gap-2">
          <!-- JSON处理 -->
          <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">JSON:</span>
          <button
            @click="compressJson"
            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
            title="压缩JSON"
          >
            <Minimize2 class="w-3.5 h-3.5" />
            压缩
          </button>
          <button
            @click="compressAndEscape"
            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
            title="压缩并转义"
          >
            <Code class="w-3.5 h-3.5" />
            压缩并转义
          </button>
          <button
            @click="escapeJson"
            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors flex items-center gap-1"
            title="转义"
          >
            <Code class="w-3.5 h-3.5" />
            转义
          </button>
          <button
            @click="unescapeJson"
            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors flex items-center gap-1"
            title="去除转义"
          >
            <RefreshCw class="w-3.5 h-3.5" />
            去除转义
          </button>

          <div class="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1"></div>

          <!-- Unicode转换 -->
          <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">Unicode:</span>
          <button
            @click="unicodeToChinese"
            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors flex items-center gap-1"
            title="Unicode转中文"
          >
            <Languages class="w-3.5 h-3.5" />
            Unicode转中文
          </button>
          <button
            @click="chineseToUnicode"
            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors flex items-center gap-1"
            title="中文转Unicode"
          >
            <Languages class="w-3.5 h-3.5" />
            中文转Unicode
          </button>

          <div class="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1"></div>

          <!-- 符号转换 -->
          <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">符号:</span>
          <button
            @click="cnSymbolToEn"
            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors flex items-center gap-1"
            title="中文符号转英文符号"
          >
            <Type class="w-3.5 h-3.5" />
            中文符号转英文符号
          </button>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="mt-6 bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-3">使用说明</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">JSON处理</h4>
            <ul class="space-y-1">
              <li><strong>压缩：</strong>将JSON压缩为一行，去除多余空格和换行</li>
              <li><strong>压缩并转义：</strong>压缩JSON后转义为可嵌入代码的字符串</li>
              <li><strong>转义：</strong>将JSON转为转义字符串，如 <code class="px-1 bg-gray-100 dark:bg-gray-800 rounded">{"a":"b"}</code> → <code class="px-1 bg-gray-100 dark:bg-gray-800 rounded">"{\"a\":\"b\"}"</code></li>
              <li><strong>去除转义：</strong>将转义字符串还原为可读JSON</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">编码转换</h4>
            <ul class="space-y-1">
              <li><strong>Unicode转中文：</strong>将 <code class="px-1 bg-gray-100 dark:bg-gray-800 rounded">\u4e2d\u6587</code> 转为 <code class="px-1 bg-gray-100 dark:bg-gray-800 rounded">中文</code></li>
              <li><strong>中文转Unicode：</strong>将中文字符转为Unicode编码</li>
              <li><strong>中文符号转英文：</strong>将中文标点转为英文标点</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
