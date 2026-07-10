<script setup lang="ts">
import { ref, watch } from 'vue'
import { Download, RefreshCw, Trash2, Upload, X, Palette } from 'lucide-vue-next'
import { generateQrCode, downloadQrCode, colorPresets } from '@/utils/qrcode'
import type { DotStyle } from '@/utils/qrcode'

const inputText = ref('https://it.mengch.cn')
const size = ref(256)
const margin = ref(4)
const darkColor = ref('#000000')
const lightColor = ref('#ffffff')
const dotStyle = ref<DotStyle>('square')
const iconUrl = ref('')
const iconSizePercent = ref(20)
const qrCodeData = ref('')
const isGenerating = ref(false)

const dotStyles: { value: DotStyle; label: string }[] = [
  { value: 'square', label: '方块' },
  { value: 'rounded', label: '圆角' },
  { value: 'dots', label: '圆点' },
  { value: 'classy', label: '优雅' },
]

async function generate() {
  if (!inputText.value.trim()) {
    qrCodeData.value = ''
    return
  }

  isGenerating.value = true
  try {
    qrCodeData.value = await generateQrCode(inputText.value, {
      width: size.value,
      margin: margin.value,
      color: {
        dark: darkColor.value,
        light: lightColor.value,
      },
      dotStyle: dotStyle.value,
      iconUrl: iconUrl.value || undefined,
      iconSize: Math.round(size.value * (iconSizePercent.value / 100)),
    })
  } catch {
    console.error('生成二维码失败')
  }
  isGenerating.value = false
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch([inputText, size, margin, darkColor, lightColor, dotStyle, iconUrl, iconSizePercent], () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => generate(), 200)
}, { immediate: true })

function download() {
  if (qrCodeData.value) {
    downloadQrCode(qrCodeData.value, 'qrcode.png')
  }
}

function clearInput() {
  inputText.value = ''
}

function resetExample() {
  inputText.value = 'https://it.mengch.cn'
  size.value = 256
  margin.value = 4
  darkColor.value = '#000000'
  lightColor.value = '#ffffff'
  dotStyle.value = 'square'
  iconUrl.value = ''
  iconSizePercent.value = 20
}

function applyPreset(dark: string, light: string) {
  darkColor.value = dark
  lightColor.value = light
}

function onIconUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('图标大小不能超过2MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    iconUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function removeIcon() {
  iconUrl.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          二维码生成
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          将文本或URL转换为二维码图片，支持自定义样式、颜色和图标
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left: Settings -->
        <div class="space-y-6">
          <!-- Input -->
          <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                输入内容
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
              placeholder="请输入文本或URL"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            ></textarea>
          </div>

          <!-- Style -->
          <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              点阵样式
            </label>
            <div class="grid grid-cols-4 gap-3">
              <button
                v-for="style in dotStyles"
                :key="style.value"
                @click="dotStyle = style.value"
                :class="[
                  'py-3 rounded-lg text-xs font-medium transition-all border-2',
                  dotStyle === style.value
                    ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                ]"
              >
                {{ style.label }}
              </button>
            </div>
          </div>

          <!-- Color -->
          <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center gap-2 mb-4">
              <Palette class="w-4 h-4 text-primary-500" />
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                颜色配置
              </label>
            </div>

            <!-- Presets -->
            <div class="mb-4">
              <label class="block text-xs text-gray-500 dark:text-gray-400 mb-2">预设配色</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="preset in colorPresets"
                  :key="preset.name"
                  @click="applyPreset(preset.dark, preset.light)"
                  class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                  :class="[
                    darkColor === preset.dark && lightColor === preset.light
                      ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                  ]"
                >
                  <span class="flex">
                    <span class="w-3 h-3 rounded-l" :style="{ background: preset.dark }"></span>
                    <span class="w-3 h-3 rounded-r border-l border-white/30" :style="{ background: preset.light }"></span>
                  </span>
                  {{ preset.name }}
                </button>
              </div>
            </div>

            <!-- Custom -->
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1 min-w-0">
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-2">前景色</label>
                <div class="flex items-center gap-2">
                  <div class="relative w-9 h-9 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 flex-shrink-0">
                    <input
                      type="color"
                      v-model="darkColor"
                      class="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                    />
                    <div class="w-full h-full" :style="{ background: darkColor }"></div>
                  </div>
                  <input
                    type="text"
                    v-model="darkColor"
                    class="flex-1 min-w-0 w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white font-mono text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-2">背景色</label>
                <div class="flex items-center gap-2">
                  <div class="relative w-9 h-9 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 flex-shrink-0">
                    <input
                      type="color"
                      v-model="lightColor"
                      class="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                    />
                    <div class="w-full h-full" :style="{ background: lightColor }"></div>
                  </div>
                  <input
                    type="text"
                    v-model="lightColor"
                    class="flex-1 min-w-0 w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white font-mono text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Icon -->
          <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              中心图标
            </label>

            <div v-if="!iconUrl" class="flex items-center justify-center w-full">
              <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-colors">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload class="w-8 h-8 text-gray-400 mb-2" />
                  <p class="text-sm text-gray-500 dark:text-gray-400">点击上传图标</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">支持 PNG/JPG/SVG，最大 2MB</p>
                </div>
                <input type="file" class="hidden" accept="image/*" @change="onIconUpload" />
              </label>
            </div>

            <div v-else class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 flex-shrink-0 bg-gray-50 dark:bg-dark-200 flex items-center justify-center">
                  <img :src="iconUrl" alt="图标预览" class="max-w-full max-h-full object-contain" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-600 dark:text-gray-300">图标已上传</p>
                  <button
                    @click="removeIcon"
                    class="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <X class="w-3 h-3" />
                    移除图标
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                  图标大小: {{ iconSizePercent }}%
                </label>
                <input
                  type="range"
                  v-model="iconSizePercent"
                  min="10"
                  max="30"
                  step="2"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- Size & Margin -->
          <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              尺寸与边距
            </label>
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                  尺寸: {{ size }}px
                </label>
                <input
                  type="range"
                  v-model="size"
                  min="128"
                  max="512"
                  step="16"
                  class="w-full"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                  边距: {{ margin }}
                </label>
                <input
                  type="range"
                  v-model="margin"
                  min="0"
                  max="10"
                  step="1"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Preview -->
        <div class="lg:sticky lg:top-4 lg:self-start">
          <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                预览
              </label>
              <button
                @click="download"
                :disabled="!qrCodeData || isGenerating"
                class="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                :class="[
                  qrCodeData && !isGenerating
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                ]"
              >
                <Download class="w-4 h-4" />
                下载
              </button>
            </div>

            <div class="flex items-center justify-center h-[400px] bg-gray-50 dark:bg-dark-200 rounded-xl">
              <div v-if="isGenerating" class="text-gray-500 dark:text-gray-400">
                <div class="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>生成中...</p>
              </div>
              <div v-else-if="!qrCodeData" class="text-gray-400 text-center">
                <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <p>请输入内容生成二维码</p>
              </div>
              <img
                v-else
                :src="qrCodeData"
                alt="二维码"
                class="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>

            <div v-if="qrCodeData && !isGenerating" class="mt-4 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                尺寸: {{ size }}px × {{ size }}px
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>