<!--
  JSON字段提取工具

  功能描述：
  - 解析JSON，自动分析所有字段结构
  - 树形展示字段层级，支持展开/折叠
  - 字段搜索过滤
  - 点击字段查看对应的值
  - 支持数组元素遍历
  - 支持多选字段批量提取
  - 结果一键复制

  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Copy, Check, Trash2, ChevronRight, ChevronDown,
  Search, FileJson, RefreshCw, Braces, List, Hash, ToggleLeft, Type, Minus
} from 'lucide-vue-next'
import TreeNode, { type FieldNode } from '@/components/TreeNode.vue'

// 输入JSON
const inputJson = ref('')
// 解析错误
const parseError = ref('')
// 搜索关键词
const searchKeyword = ref('')
// 选中的路径列表
const selectedPaths = ref<string[]>([])
// 复制状态
const copied = ref(false)
// 展开的节点路径集合
const expandedPaths = ref<Set<string>>(new Set())

// 示例JSON
const exampleJson = `{
  "name": "檬橙IT工具箱",
  "version": "1.0.0",
  "url": "https://it.mengch.cn",
  "active": true,
  "count": 12345,
  "description": null,
  "categories": [
    "文本工具",
    "数据工具",
    "编码工具"
  ],
  "tools": [
    {
      "id": 1,
      "name": "JSON美化",
      "category": "数据工具",
      "enabled": true
    },
    {
      "id": 2,
      "name": "二维码生成",
      "category": "生成工具",
      "enabled": true,
      "config": {
        "size": 256,
        "margin": 4
      }
    }
  ],
  "author": {
    "name": "mengch",
    "email": "support@it.mengch.cn",
    "social": {
      "github": "Anskory",
      "website": "https://it.mengch.cn"
    }
  }
}`

/**
 * 获取值的类型
 */
function getValueType(val: any): string {
  if (val === null) return 'null'
  if (Array.isArray(val)) return 'array'
  return typeof val
}

/**
 * 递归构建字段树
 * @param data - 数据
 * @param path - 当前路径
 * @param key - 当前键名
 */
function buildTree(data: any, path: string, key: string): FieldNode {
  const type = getValueType(data) as FieldNode['type']
  const node: FieldNode = {
    path,
    key,
    type,
    value: data,
  }

  if (type === 'object' && data !== null) {
    node.children = Object.entries(data).map(([k, v]) => {
      return buildTree(v, `${path}.${k}`, k)
    })
  } else if (type === 'array') {
    node.length = data.length
    node.children = data.map((item: any, index: number) => {
      return buildTree(item, `${path}[${index}]`, `[${index}]`)
    })
  }

  return node
}

// 解析后的根节点
const rootNode = computed<FieldNode | null>(() => {
  if (!inputJson.value.trim()) {
    parseError.value = ''
    return null
  }
  try {
    const parsed = JSON.parse(inputJson.value)
    parseError.value = ''
    return buildTree(parsed, '$', '$')
  } catch (e) {
    parseError.value = e instanceof Error ? e.message : 'JSON解析失败'
    return null
  }
})

// 当根节点变化时，自动展开根节点
watch(rootNode, (node) => {
  if (node) {
    expandedPaths.value.add('$')
  }
})

/**
 * 过滤树节点（搜索）
 */
function filterNode(node: FieldNode, keyword: string): boolean {
  if (!keyword) return true
  const kw = keyword.toLowerCase()
  if (node.key.toLowerCase().includes(kw) || node.path.toLowerCase().includes(kw)) {
    return true
  }
  if (node.children) {
    return node.children.some(child => filterNode(child, keyword))
  }
  return false
}

// 过滤后的根节点
const filteredRoot = computed(() => {
  if (!rootNode.value) return null
  if (!searchKeyword.value) return rootNode.value
  return filterNode(rootNode.value, searchKeyword.value) ? rootNode.value : null
})

/**
 * 切换展开状态
 */
function toggleExpand(path: string) {
  if (expandedPaths.value.has(path)) {
    expandedPaths.value.delete(path)
  } else {
    expandedPaths.value.add(path)
  }
}

/**
 * 是否选中
 */
function isSelected(path: string): boolean {
  return selectedPaths.value.includes(path)
}

/**
 * 切换选中
 */
function toggleSelect(path: string) {
  const index = selectedPaths.value.indexOf(path)
  if (index > -1) {
    selectedPaths.value.splice(index, 1)
  } else {
    selectedPaths.value.push(path)
  }
}

/**
 * 根据路径获取值
 */
function getValueByPath(path: string): any {
  if (!rootNode.value || path === '$') return rootNode.value?.value
  // 将路径转换为可执行的访问
  try {
    // 替换 $. 为 data.，替换 [ 为 [
    let expr = path
      .replace(/^\$\./, '')
      .replace(/^\$/, '')
    if (!expr) return rootNode.value?.value

    // 使用安全的方式访问
    const keys: (string | number)[] = []
    const parts = path.slice(2).split(/\.|\[|\]/).filter(Boolean)
    for (const part of parts) {
      if (/^\d+$/.test(part)) {
        keys.push(parseInt(part))
      } else {
        keys.push(part)
      }
    }

    let result: any = JSON.parse(inputJson.value)
    for (const key of keys) {
      if (result === null || result === undefined) return undefined
      result = result[key]
    }
    return result
  } catch {
    return undefined
  }
}

// 选中字段的结果
const selectedResults = computed(() => {
  if (selectedPaths.value.length === 0) return []
  return selectedPaths.value.map(path => {
    const val = getValueByPath(path)
    return {
      path,
      value: val,
      displayValue: typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val),
      type: getValueType(val),
    }
  })
})

// 单字段预览值
const previewValue = computed(() => {
  if (selectedPaths.value.length !== 1) return ''
  const val = getValueByPath(selectedPaths.value[0])
  if (typeof val === 'object') {
    return JSON.stringify(val, null, 2)
  }
  return String(val)
})

/**
 * 获取类型图标组件
 */
function getTypeIcon(type: string) {
  switch (type) {
    case 'object': return Braces
    case 'array': return List
    case 'string': return Type
    case 'number': return Hash
    case 'boolean': return ToggleLeft
    case 'null': return Minus
    default: return Braces
  }
}

/**
 * 获取类型颜色类
 */
function getTypeColorClass(type: string): string {
  switch (type) {
    case 'object': return 'text-purple-500 dark:text-purple-400'
    case 'array': return 'text-blue-500 dark:text-blue-400'
    case 'string': return 'text-green-500 dark:text-green-400'
    case 'number': return 'text-orange-500 dark:text-orange-400'
    case 'boolean': return 'text-pink-500 dark:text-pink-400'
    case 'null': return 'text-gray-500 dark:text-gray-400'
    default: return 'text-gray-500 dark:text-gray-400'
  }
}

/**
 * 加载示例
 */
function loadExample() {
  inputJson.value = exampleJson
  selectedPaths.value = []
  expandedPaths.value.clear()
  searchKeyword.value = ''
}

/**
 * 清空
 */
function clearAll() {
  inputJson.value = ''
  selectedPaths.value = []
  expandedPaths.value.clear()
  searchKeyword.value = ''
  parseError.value = ''
}

/**
 * 格式化JSON
 */
function formatJson() {
  if (!inputJson.value.trim()) return
  try {
    const parsed = JSON.parse(inputJson.value)
    inputJson.value = JSON.stringify(parsed, null, 2)
  } catch (e) {
    parseError.value = e instanceof Error ? e.message : 'JSON解析失败'
  }
}

/**
 * 复制单字段值
 */
async function copyValue(val: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(val)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = val
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
 * 复制所有选中结果
 */
async function copyAllResults() {
  if (selectedResults.value.length === 0) return

  let text = ''
  if (selectedResults.value.length === 1) {
    text = selectedResults.value[0].displayValue
  } else {
    const obj: Record<string, any> = {}
    for (const item of selectedResults.value) {
      obj[item.path] = item.value
    }
    text = JSON.stringify(obj, null, 2)
  }

  await copyValue(text)
}

/**
 * 展开全部
 */
function expandAll() {
  if (!rootNode.value) return
  const collect = (node: FieldNode) => {
    expandedPaths.value.add(node.path)
    if (node.children) {
      node.children.forEach(collect)
    }
  }
  collect(rootNode.value)
}

/**
 * 折叠全部
 */
function collapseAll() {
  expandedPaths.value.clear()
}

/**
 * 全选字段
 */
function selectAll() {
  if (!rootNode.value) return
  selectedPaths.value = []
  const collect = (node: FieldNode) => {
    selectedPaths.value.push(node.path)
    if (node.children) {
      node.children.forEach(collect)
    }
  }
  collect(rootNode.value)
}

/**
 * 清空选择
 */
function clearSelection() {
  selectedPaths.value = []
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          JSON字段提取
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          解析JSON结构，浏览字段层级，快速提取需要的字段值
        </p>
      </div>

      <!-- 三栏布局 -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 左侧：JSON输入 -->
        <div class="lg:col-span-4 bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              JSON输入
            </label>
            <div class="flex items-center gap-1">
              <button
                @click="loadExample"
                class="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="加载示例"
              >
                <FileJson class="w-4 h-4" />
              </button>
              <button
                @click="formatJson"
                class="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="格式化"
              >
                <RefreshCw class="w-4 h-4" />
              </button>
              <button
                @click="clearAll"
                class="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="清空"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <textarea
            v-model="inputJson"
            placeholder="请粘贴JSON数据..."
            rows="24"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-xs resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          ></textarea>

          <div v-if="parseError" class="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-xs text-red-600 dark:text-red-400">{{ parseError }}</p>
          </div>
        </div>

        <!-- 中间：字段树 -->
        <div class="lg:col-span-4 bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              字段结构
              <span v-if="rootNode" class="text-xs text-gray-400 ml-2">
                已选 {{ selectedPaths.length }}
              </span>
            </label>
            <div class="flex items-center gap-1">
              <button
                @click="expandAll"
                class="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="全部展开"
              >
                展开
              </button>
              <button
                @click="collapseAll"
                class="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="全部折叠"
              >
                折叠
              </button>
              <button
                @click="selectAll"
                class="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="全选"
              >
                全选
              </button>
              <button
                @click="clearSelection"
                class="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="清空选择"
              >
                清空
              </button>
            </div>
          </div>

          <!-- 搜索框 -->
          <div class="relative mb-3">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索字段名或路径..."
              class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>

          <!-- 字段树 -->
          <div class="h-[520px] overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-dark-200">
            <div v-if="!rootNode" class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
              请输入JSON数据
            </div>
            <div v-else-if="!filteredRoot" class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
              没有匹配的字段
            </div>
            <div v-else class="space-y-0.5 font-mono text-xs">
              <!-- 根节点 -->
              <div
                class="flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer transition-colors"
                :class="isSelected('$') ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'"
                @click="toggleSelect('$')"
              >
                <span
                  v-if="rootNode.type === 'object' || rootNode.type === 'array'"
                  class="cursor-pointer p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  @click.stop="toggleExpand('$')"
                >
                  <ChevronDown v-if="expandedPaths.has('$')" class="w-3.5 h-3.5 text-gray-400" />
                  <ChevronRight v-else class="w-3.5 h-3.5 text-gray-400" />
                </span>
                <span v-else class="w-4.5 inline-block"></span>
                <component :is="getTypeIcon(rootNode.type)" :class="['w-3.5 h-3.5', getTypeColorClass(rootNode.type)]" />
                <span class="text-gray-800 dark:text-gray-200 font-medium">
                  {{ rootNode.key }}
                </span>
                <span v-if="rootNode.type === 'array'" class="text-gray-400">
                  [{{ rootNode.length }}]
                </span>
              </div>

              <!-- 子节点递归渲染 -->
              <template v-if="rootNode.children && expandedPaths.has('$')">
                <div
                  v-for="child in rootNode.children"
                  :key="child.path"
                >
                  <TreeNode
                    :node="child"
                    :selected="selectedPaths"
                    :expanded="expandedPaths"
                    :keyword="searchKeyword"
                    :depth="1"
                    @toggle-expand="toggleExpand"
                    @toggle-select="toggleSelect"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 右侧：结果展示 -->
        <div class="lg:col-span-4 bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              提取结果
              <span v-if="selectedResults.length > 0" class="text-xs text-gray-400 ml-2">
                {{ selectedResults.length }} 项
              </span>
            </label>
            <button
              @click="copyAllResults"
              :disabled="selectedResults.length === 0"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1',
                copied
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : selectedResults.length > 0
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-800 cursor-not-allowed'
              ]"
            >
              <Check v-if="copied" class="w-3.5 h-3.5" />
              <Copy v-else class="w-3.5 h-3.5" />
              {{ copied ? '已复制' : '复制' }}
            </button>
          </div>

          <div class="h-[580px] overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-dark-200">
            <div v-if="selectedResults.length === 0" class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
              点击左侧字段查看值
            </div>

            <!-- 单字段详细预览 -->
            <div v-else-if="selectedResults.length === 1" class="space-y-3">
              <div class="flex items-center gap-2 text-xs">
                <span class="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 font-mono">
                  {{ selectedResults[0].type }}
                </span>
                <span class="text-gray-500 dark:text-gray-400 truncate">
                  {{ selectedResults[0].path }}
                </span>
              </div>
              <pre class="font-mono text-xs p-3 bg-white dark:bg-dark-100 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white whitespace-pre-wrap break-all max-h-[480px] overflow-auto">
{{ selectedResults[0].displayValue }}</pre>
            </div>

            <!-- 多字段列表 -->
            <div v-else class="space-y-2">
              <div
                v-for="(item, index) in selectedResults"
                :key="index"
                class="p-2 bg-white dark:bg-dark-100 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-mono text-gray-600 dark:text-gray-400 truncate flex-1">
                    {{ item.path }}
                  </span>
                  <span class="px-1.5 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-800 rounded text-gray-500 dark:text-gray-400 ml-2 shrink-0">
                    {{ item.type }}
                  </span>
                </div>
                <pre class="font-mono text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all max-h-24 overflow-auto">
{{ item.type === 'object' || item.type === 'array' ? item.displayValue : item.displayValue.slice(0, 200) }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="mt-6 bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
        <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-3">使用说明</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">基本操作</h4>
            <ul class="space-y-1">
              <li>• 在左侧输入框粘贴JSON数据</li>
              <li>• 中间区域会自动展示字段树形结构</li>
              <li>• 点击字段名可选中/取消选中</li>
              <li>• 点击箭头图标展开/折叠子节点</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">进阶功能</h4>
            <ul class="space-y-1">
              <li>• 搜索框可按字段名或路径过滤</li>
              <li>• 支持多选字段，批量提取结果</li>
              <li>• 数组元素可逐个查看</li>
              <li>• 结果支持一键复制</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
