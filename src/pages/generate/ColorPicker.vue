<!--
  颜色选择器组件
  
  功能描述：
  - 颜色选择器与格式转换
  - 支持 HEX、RGB、HSL 格式相互转换
  - 生成互补色、类似色、三角色
  - 生成同色系明暗调色板
  
  作者：mengch
  创建时间：2024
-->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Copy, Check, Pipette } from 'lucide-vue-next'
import { hexToRgb, hexToHsl, rgbToHex, hslToHex, getComplementary, getAnalogous, getTriadic, generateShades, type RGB, type HSL } from '@/utils/color'

const hexColor = ref('#f97316')
const rgbColor = ref<RGB>({ r: 249, g: 115, b: 22 })
const hslColor = ref<HSL>({ h: 24, s: 95, l: 53 })
const copiedField = ref<string | null>(null)
let isUpdating = false

watch(hexColor, (newVal) => {
  if (isUpdating) return
  const rgb = hexToRgb(newVal)
  const hsl = hexToHsl(newVal)
  if (rgb) {
    isUpdating = true
    rgbColor.value = rgb
    if (hsl) hslColor.value = hsl
    isUpdating = false
  }
}, { immediate: true })

watch(rgbColor, (newVal) => {
  if (isUpdating) return
  isUpdating = true
  hexColor.value = rgbToHex(newVal.r, newVal.g, newVal.b)
  isUpdating = false
}, { deep: true })

watch(hslColor, (newVal) => {
  if (isUpdating) return
  isUpdating = true
  hexColor.value = hslToHex(newVal.h, newVal.s, newVal.l)
  isUpdating = false
}, { deep: true })

const complementary = computed(() => getComplementary(hexColor.value))
const analogous = computed(() => getAnalogous(hexColor.value))
const triadic = computed(() => getTriadic(hexColor.value))
const shades = computed(() => generateShades(hexColor.value, 9))

async function copyText(text: string, field: string) {
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
    copiedField.value = field
    setTimeout(() => copiedField.value = null, 2000)
  } catch (err) {
    console.error('复制失败', err)
  }
}

function copyHex() {
  copyText(hexColor.value, 'hex')
}

function copyRgb() {
  copyText(`rgb(${rgbColor.value.r}, ${rgbColor.value.g}, ${rgbColor.value.b})`, 'rgb')
}

function copyHsl() {
  copyText(`hsl(${hslColor.value.h}, ${hslColor.value.s}%, ${hslColor.value.l}%)`, 'hsl')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 pt-4 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          颜色选择器
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          颜色选择与格式转换，支持 HEX、RGB、HSL 互转
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center gap-2 mb-4">
            <Pipette class="w-5 h-5 text-primary-500" />
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              颜色选择
            </label>
          </div>
          
          <div class="flex items-center gap-4 mb-6">
            <div class="relative">
              <input
                type="color"
                v-model="hexColor"
                class="w-20 h-20 rounded-xl cursor-pointer border-2 border-gray-200 dark:border-gray-700"
              />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">HEX</span>
                <input
                  v-model="hexColor"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
                <button
                  @click="copyHex"
                  :class="[
                    'p-2 rounded-lg transition-all',
                    copiedField === 'hex'
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  ]"
                  title="复制"
                >
                  <Check v-if="copiedField === 'hex'" class="w-4 h-4" />
                  <Copy v-else class="w-4 h-4" />
                </button>
              </div>
              <div
                class="h-16 rounded-lg border border-gray-200 dark:border-gray-700"
                :style="{ backgroundColor: hexColor }"
              ></div>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">RGB</span>
              <div class="flex items-center gap-2 flex-1">
                <div class="flex-1 flex items-center gap-1">
                  <span class="text-xs text-red-500 w-3">R</span>
                  <input
                    v-model.number="rgbColor.r"
                    type="number"
                    min="0"
                    max="255"
                    class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>
                <div class="flex-1 flex items-center gap-1">
                  <span class="text-xs text-green-500 w-3">G</span>
                  <input
                    v-model.number="rgbColor.g"
                    type="number"
                    min="0"
                    max="255"
                    class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>
                <div class="flex-1 flex items-center gap-1">
                  <span class="text-xs text-blue-500 w-3">B</span>
                  <input
                    v-model.number="rgbColor.b"
                    type="number"
                    min="0"
                    max="255"
                    class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
              <button
                @click="copyRgb"
                :class="[
                  'p-2 rounded-lg transition-all',
                  copiedField === 'rgb'
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
                title="复制"
              >
                <Check v-if="copiedField === 'rgb'" class="w-4 h-4" />
                <Copy v-else class="w-4 h-4" />
              </button>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">HSL</span>
              <div class="flex items-center gap-2 flex-1">
                <div class="flex-1 flex items-center gap-1">
                  <span class="text-xs text-gray-500 w-3">H</span>
                  <input
                    v-model.number="hslColor.h"
                    type="number"
                    min="0"
                    max="360"
                    class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>
                <div class="flex-1 flex items-center gap-1">
                  <span class="text-xs text-gray-500 w-3">S</span>
                  <input
                    v-model.number="hslColor.s"
                    type="number"
                    min="0"
                    max="100"
                    class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>
                <div class="flex-1 flex items-center gap-1">
                  <span class="text-xs text-gray-500 w-3">L</span>
                  <input
                    v-model.number="hslColor.l"
                    type="number"
                    min="0"
                    max="100"
                    class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-dark-200 text-gray-800 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
              <button
                @click="copyHsl"
                :class="[
                  'p-2 rounded-lg transition-all',
                  copiedField === 'hsl'
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
                title="复制"
              >
                <Check v-if="copiedField === 'hsl'" class="w-4 h-4" />
                <Copy v-else class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="space-y-6">
            <div>
              <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">互补色</div>
              <div class="flex gap-2">
                <div
                  v-for="(color, idx) in [hexColor, complementary]"
                  :key="idx"
                  class="flex-1 h-12 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                  :style="{ backgroundColor: color || '#fff' }"
                  @click="color && (hexColor = color)"
                >
                  <span class="text-xs font-mono text-white drop-shadow-md">{{ color }}</span>
                </div>
              </div>
            </div>

            <div>
              <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">类似色</div>
              <div class="flex gap-2">
                <div
                  v-for="(color, idx) in analogous"
                  :key="idx"
                  class="flex-1 h-12 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                  :style="{ backgroundColor: color }"
                  @click="hexColor = color"
                >
                  <span class="text-xs font-mono text-white drop-shadow-md">{{ color }}</span>
                </div>
              </div>
            </div>

            <div>
              <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">三角色</div>
              <div class="flex gap-2">
                <div
                  v-for="(color, idx) in triadic"
                  :key="idx"
                  class="flex-1 h-12 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                  :style="{ backgroundColor: color }"
                  @click="hexColor = color"
                >
                  <span class="text-xs font-mono text-white drop-shadow-md">{{ color }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">明暗调色板</div>
        <div class="flex gap-1">
          <div
            v-for="(color, idx) in shades"
            :key="idx"
            class="flex-1 h-16 cursor-pointer border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center transition-transform hover:scale-105"
            :style="{ backgroundColor: color }"
            @click="hexColor = color"
            :title="color"
          >
            <span class="text-[10px] font-mono text-white drop-shadow-md">{{ color }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
