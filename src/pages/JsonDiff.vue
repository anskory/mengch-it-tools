<!--
  JSON对比组件
  
  功能描述：
  - 对比两个JSON对象的差异，支持嵌套结构的深度对比
  - 高亮显示新增、删除和修改的字段
  - 提供详细的差异路径和值对比
  - 支持JSON有效性校验和错误提示
  
  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
// 引入操作图标组件
import { Copy, Check, Trash2, RefreshCw } from 'lucide-vue-next'
// 引入JSON对比工具函数
import { compareJson, isValidJson, getJsonError } from '@/utils/json'
import type { JsonDiffResult } from '@/utils/json'

// 原始JSON：左侧输入的旧JSON，默认提供示例数据
const oldJson = ref('{"name":"檬橙IT工具箱","version":"1.0.0","features":["变量名转换","文本比较"],"author":{"name":"mengch"}}')

// 新JSON：右侧输入的新JSON，默认提供示例数据
const newJson = ref('{"name":"檬橙IT工具箱","version":"2.0.0","features":["变量名转换","文本比较","JSON美化"],"author":{"name":"mengch","site":"it.mengch.cn"}}')

// 原始JSON有效性校验
const oldValid = computed(() => isValidJson(oldJson.value))
// 新JSON有效性校验
const newValid = computed(() => isValidJson(newJson.value))
// 原始JSON错误信息
const oldError = computed(() => getJsonError(oldJson.value))
// 新JSON错误信息
const newError = computed(() => getJsonError(newJson.value))

// 差异结果计算属性
// 仅当两个JSON都有效时才执行对比
const diffResult = computed((): JsonDiffResult[] => {
  if (!oldValid.value || !newValid.value) return []
  return compareJson(oldJson.value, newJson.value)
})

// 统计信息计算属性
// 计算新增、删除和修改的字段数量
const stats = computed(() => ({
  added: diffResult.value.filter(r => r.type === 'added').length, // 新增字段数
  removed: diffResult.value.filter(r => r.type === 'removed').length, // 删除字段数
  changed: diffResult.value.filter(r => r.type === 'changed').length, // 修改字段数
}))

// 左侧复制状态标记
const copiedLeft = ref(false)
// 右侧复制状态标记
const copiedRight = ref(false)

/**
 * 复制左侧原始JSON
 */
async function copyLeft() {
  try {
    await navigator.clipboard.writeText(oldJson.value)
    copiedLeft.value = true
    setTimeout(() => copiedLeft.value = false, 2000)
  } catch {}
}

/**
 * 复制右侧新JSON
 */
async function copyRight() {
  try {
    await navigator.clipboard.writeText(newJson.value)
    copiedRight.value = true
    setTimeout(() => copiedRight.value = false, 2000)
  } catch {}
}

/**
 * 清空左侧原始JSON
 */
function clearLeft() {
  oldJson.value = ''
}

/**
 * 清空右侧新JSON
 */
function clearRight() {
  newJson.value = ''
}

/**
 * 重置为默认示例数据
 */
function resetExample() {
  oldJson.value = '{"name":"檬橙IT工具箱","version":"1.0.0","features":["变量名转换","文本比较"],"author":{"name":"mengch"}}'
  newJson.value = '{"name":"檬橙IT工具箱","version":"2.0.0","features":["变量名转换","文本比较","JSON美化"],"author":{"name":"mengch","site":"it.mengch.cn"}}'
}

/**
 * 格式化值显示
 * 对对象类型进行JSON格式化，其他类型转为字符串
 * @param value - 要格式化的值
 * @returns 格式化后的字符串
 */
function formatValue(value: any): string {
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题和描述 -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          JSON对比
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          对比两个JSON对象的差异，支持嵌套结构的深度对比
        </p>
      </div>

      <!-- 双栏布局：原始JSON和新JSON -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- 左侧：原始JSON输入 -->
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              原始JSON
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
              <!-- 复制按钮 -->
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
              <!-- 清空按钮 -->
              <button
                @click="clearLeft"
                class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="清空"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- 输入文本框：根据JSON有效性显示不同边框颜色 -->
          <textarea
            v-model="oldJson"
            placeholder="请输入原始JSON"
            rows="10"
            class="w-full px-4 py-3 border rounded-lg font-mono text-sm resize-none transition-all"
            :class="[
              oldValid
                ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white'
                : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            ]"
          ></textarea>
          
          <!-- JSON错误提示 -->
          <div v-if="!oldValid && oldJson" class="mt-3 flex items-center gap-2 text-red-500 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ oldError }}
          </div>
        </div>

        <!-- 右侧：新JSON输入 -->
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              新JSON
            </label>
            <!-- 操作按钮组 -->
            <div class="flex items-center gap-2">
              <!-- 复制按钮 -->
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
              <!-- 清空按钮 -->
              <button
                @click="clearRight"
                class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="清空"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- 输入文本框 -->
          <textarea
            v-model="newJson"
            placeholder="请输入新JSON"
            rows="10"
            class="w-full px-4 py-3 border rounded-lg font-mono text-sm resize-none transition-all"
            :class="[
              newValid
                ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white'
                : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            ]"
          ></textarea>
          
          <!-- JSON错误提示 -->
          <div v-if="!newValid && newJson" class="mt-3 flex items-center gap-2 text-red-500 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ newError }}
          </div>
        </div>
      </div>

      <!-- 差异结果显示区域 -->
      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            差异结果
          </label>
          <!-- 差异统计标签 -->
          <div class="flex items-center gap-2">
            <!-- 新增统计 -->
            <span class="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              +{{ stats.added }} 新增
            </span>
            <!-- 删除统计 -->
            <span class="inline-flex items-center gap-1 text-xs px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19V5M5 12h14" />
              </svg>
              -{{ stats.removed }} 删除
            </span>
            <!-- 修改统计 -->
            <span class="inline-flex items-center gap-1 text-xs px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              ~{{ stats.changed }} 修改
            </span>
          </div>
        </div>
        
        <!-- 空状态提示：输入无效时 -->
        <div v-if="!(oldValid && newValid)" class="text-gray-400 text-center py-12">
          请输入有效的JSON数据进行对比
        </div>
        
        <!-- 空状态提示：无差异时 -->
        <div v-else-if="diffResult.length === 0" class="text-gray-400 text-center py-12">
          两个JSON完全相同，没有差异
        </div>
        
        <!-- 差异结果列表 -->
        <div v-else class="space-y-3">
          <!-- 循环渲染每个差异项 -->
          <template v-for="(item, index) in diffResult" :key="index">
            <div
              :class="[
                'rounded-lg p-4 font-mono text-sm',
                // 根据差异类型设置不同背景颜色
                item.type === 'added' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : '',
                item.type === 'removed' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : '',
                item.type === 'changed' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' : '',
              ]"
            >
              <!-- 差异类型标签和路径 -->
              <div class="flex items-center gap-2 mb-2">
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs font-medium',
                    item.type === 'added' ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' : '',
                    item.type === 'removed' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' : '',
                    item.type === 'changed' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' : '',
                  ]"
                >
                  {{ item.type === 'added' ? '新增' : item.type === 'removed' ? '删除' : '修改' }}
                </span>
                <span class="text-gray-600 dark:text-gray-400">{{ item.path }}</span>
              </div>
              
              <!-- 新增字段显示 -->
              <div v-if="item.type === 'added'" class="break-all">
                <span class="text-green-600 dark:text-green-400">+ {{ item.key }}:</span>
                <span class="text-gray-800 dark:text-gray-200 ml-2">{{ formatValue(item.newValue) }}</span>
              </div>
              
              <!-- 删除字段显示 -->
              <div v-else-if="item.type === 'removed'" class="break-all">
                <span class="text-red-600 dark:text-red-400">- {{ item.key }}:</span>
                <span class="text-gray-800 dark:text-gray-200 ml-2">{{ formatValue(item.oldValue) }}</span>
              </div>
              
              <!-- 修改字段显示：同时显示旧值和新值 -->
              <div v-else class="space-y-2">
                <div class="break-all">
                  <span class="text-red-600 dark:text-red-400">- {{ item.key }}:</span>
                  <span class="text-gray-800 dark:text-gray-200 ml-2">{{ formatValue(item.oldValue) }}</span>
                </div>
                <div class="break-all">
                  <span class="text-green-600 dark:text-green-400">+ {{ item.key }}:</span>
                  <span class="text-gray-800 dark:text-gray-200 ml-2">{{ formatValue(item.newValue) }}</span>
                </div>
                
                <!-- 子级差异：嵌套对象的差异 -->
                <div v-if="item.children && item.children.length > 0" class="mt-3 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                  <template v-for="(child, childIndex) in item.children" :key="childIndex">
                    <div
                      :class="[
                        'rounded-lg p-3 mt-2 font-mono text-sm',
                        child.type === 'added' ? 'bg-green-50 dark:bg-green-900/20' : '',
                        child.type === 'removed' ? 'bg-red-50 dark:bg-red-900/20' : '',
                        child.type === 'changed' ? 'bg-yellow-50 dark:bg-yellow-900/20' : '',
                      ]"
                    >
                      <div class="flex items-center gap-2 mb-1">
                        <span
                          :class="[
                            'px-1.5 py-0.5 rounded text-xs font-medium',
                            child.type === 'added' ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' : '',
                            child.type === 'removed' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' : '',
                            child.type === 'changed' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' : '',
                          ]"
                        >
                          {{ child.type === 'added' ? '新增' : child.type === 'removed' ? '删除' : '修改' }}
                        </span>
                        <span class="text-gray-600 dark:text-gray-400">{{ child.path }}</span>
                      </div>
                      
                      <div v-if="child.type === 'added'" class="break-all">
                        <span class="text-green-600 dark:text-green-400">+ {{ child.key }}:</span>
                        <span class="text-gray-800 dark:text-gray-200 ml-2">{{ formatValue(child.newValue) }}</span>
                      </div>
                      
                      <div v-else-if="child.type === 'removed'" class="break-all">
                        <span class="text-red-600 dark:text-red-400">- {{ child.key }}:</span>
                        <span class="text-gray-800 dark:text-gray-200 ml-2">{{ formatValue(child.oldValue) }}</span>
                      </div>
                      
                      <div v-else class="space-y-1">
                        <div class="break-all">
                          <span class="text-red-600 dark:text-red-400">- {{ child.key }}:</span>
                          <span class="text-gray-800 dark:text-gray-200 ml-2">{{ formatValue(child.oldValue) }}</span>
                        </div>
                        <div class="break-all">
                          <span class="text-green-600 dark:text-green-400">+ {{ child.key }}:</span>
                          <span class="text-gray-800 dark:text-gray-200 ml-2">{{ formatValue(child.newValue) }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>