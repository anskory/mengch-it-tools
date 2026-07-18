<!--
  图片压缩组件
  
  功能描述：
  - 本地图片压缩，不上传服务器
  - 支持调整压缩质量
  - 支持调整最大尺寸
  - 支持 JPEG/PNG/WebP 输出格式
  - 实时预览压缩效果和大小对比
  
  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Upload, Download, Image, Trash2, RefreshCw, FileImage } from 'lucide-vue-next'
import { compressImage, formatFileSize, type CompressResult } from '@/utils/image'

const file = ref<File | null>(null)
const result = ref<CompressResult | null>(null)
const quality = ref(0.8)
const maxWidth = ref(1920)
const maxHeight = ref(0)
const outputFormat = ref<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg')
const isCompressing = ref(false)
const originalPreview = ref('')

const formatOptions = [
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/webp', label: 'WebP' },
]

const compressionRatio = computed(() => {
  if (!result.value) return 0
  return Math.round((1 - result.value.size / result.value.originalSize) * 100)
})

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    loadFile(target.files[0])
  }
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    loadFile(e.dataTransfer.files[0])
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
}

function loadFile(f: File) {
  if (!f.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }
  file.value = f
  result.value = null
  
  const reader = new FileReader()
  reader.onload = (e) => {
    originalPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(f)
  
  doCompress()
}

async function doCompress() {
  if (!file.value) return
  isCompressing.value = true
  try {
    result.value = await compressImage(file.value, {
      quality: quality.value,
      maxWidth: maxWidth.value,
      maxHeight: maxHeight.value,
      format: outputFormat.value,
    })
  } catch (err) {
    console.error('压缩失败', err)
  }
  isCompressing.value = false
}

function downloadImage() {
  if (!result.value || !file.value) return
  const url = URL.createObjectURL(result.value.blob)
  const a = document.createElement('a')
  a.href = url
  const ext = outputFormat.value.split('/')[1]
  const baseName = file.value.name.replace(/\.[^/.]+$/, '')
  a.download = `${baseName}_compressed.${ext}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function clearImage() {
  file.value = null
  result.value = null
  originalPreview.value = ''
}

function resetSettings() {
  quality.value = 0.8
  maxWidth.value = 1920
  maxHeight.value = 0
  outputFormat.value = 'image/jpeg'
  if (file.value) doCompress()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          图片压缩
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          本地浏览器压缩图片，支持调整质量和尺寸，数据不上传
        </p>
      </div>

      <div v-if="!file" class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 mb-6">
        <div
          class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-primary-400 transition-colors cursor-pointer"
          @click="($refs.fileInput as HTMLInputElement)?.click()"
          @drop="handleDrop"
          @dragover="handleDragOver"
        >
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
              <Upload class="w-8 h-8 text-primary-500" />
            </div>
            <p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              点击或拖拽图片到这里
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              支持 JPG、PNG、WebP 等常见图片格式
            </p>
          </div>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileSelect"
        />
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <Image class="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">原图</span>
            </div>
            <button
              @click="clearImage"
              class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="清除"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
          
          <div class="bg-gray-50 dark:bg-dark-200 rounded-lg overflow-hidden mb-4 flex items-center justify-center" style="height: 280px;">
            <img
              v-if="originalPreview"
              :src="originalPreview"
              alt="原图"
              class="max-w-full max-h-full object-contain"
            />
          </div>

          <div v-if="file" class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <div class="flex justify-between">
              <span>文件名:</span>
              <span class="font-mono truncate max-w-[200px]">{{ file.name }}</span>
            </div>
            <div class="flex justify-between">
              <span>文件大小:</span>
              <span class="font-mono">{{ formatFileSize(file.size) }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <FileImage class="w-5 h-5 text-primary-500" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">压缩后</span>
              <span
                v-if="result && compressionRatio > 0"
                class="text-xs px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full"
              >
                节省 {{ compressionRatio }}%
              </span>
            </div>
            <button
              v-if="result"
              @click="downloadImage"
              class="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              <Download class="w-4 h-4" />
              下载
            </button>
          </div>
          
          <div class="bg-gray-50 dark:bg-dark-200 rounded-lg overflow-hidden mb-4 flex items-center justify-center" style="height: 280px;">
            <div v-if="isCompressing" class="text-gray-400 dark:text-gray-500">
              压缩中...
            </div>
            <img
              v-else-if="result"
              :src="result.dataUrl"
              alt="压缩后"
              class="max-w-full max-h-full object-contain"
            />
          </div>

          <div v-if="result" class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <div class="flex justify-between">
              <span>文件大小:</span>
              <span class="font-mono text-primary-600 dark:text-primary-400">{{ formatFileSize(result.size) }}</span>
            </div>
            <div class="flex justify-between">
              <span>尺寸:</span>
              <span class="font-mono">{{ result.width }} × {{ result.height }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="file" class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-6">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">压缩设置</span>
          <button
            @click="resetSettings"
            class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="重置设置"
          >
            <RefreshCw class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                压缩质量
              </label>
              <span class="text-sm font-mono text-primary-600 dark:text-primary-400">{{ Math.round(quality * 100) }}%</span>
            </div>
            <input
              v-model.number="quality"
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              class="w-full accent-primary-500"
              @change="doCompress"
            />
            <div class="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
              <span>低质量</span>
              <span>高质量</span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              输出格式
            </label>
            <div class="flex gap-2">
              <button
                v-for="opt in formatOptions"
                :key="opt.value"
                @click="outputFormat = opt.value as any; doCompress()"
                :class="[
                  'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  outputFormat === opt.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                ]"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              最大宽度 (px)
            </label>
            <input
              v-model.number="maxWidth"
              type="number"
              min="0"
              placeholder="0表示不限制"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              @change="doCompress"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              最大高度 (px)
            </label>
            <input
              v-model.number="maxHeight"
              type="number"
              min="0"
              placeholder="0表示不限制"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              @change="doCompress"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
