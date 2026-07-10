<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Sun, Moon, Home, ChevronRight, Sparkles, FileText, Database, Code, QrCode,
  ChevronDown, ChevronLeft, ChevronRight as ChevronRightIcon, Layers, Table
} from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const route = useRoute()
const { theme, toggleTheme } = useTheme()
const isCollapsed = ref(false)
const expandedCategories = ref<Set<string>>(new Set(['text-tools', 'data-tools', 'encoding-tools', 'generate-tools', 'db-tools']))

interface NavItem {
  name: string
  label: string
  icon: any
  path: string
}

interface NavCategory {
  id: string
  label: string
  icon: any
  items: NavItem[]
}

const categories: NavCategory[] = [
  {
    id: 'text-tools',
    label: '文本工具',
    icon: FileText,
    items: [
      { name: 'variable-converter', label: '变量名转换', icon: Sparkles, path: '/variable-converter' },
      { name: 'text-diff', label: '文本比较', icon: Code, path: '/text-diff' },
    ],
  },
  {
    id: 'data-tools',
    label: '数据工具',
    icon: Database,
    items: [
      { name: 'json-beautify', label: 'JSON美化', icon: Code, path: '/json-beautify' },
      { name: 'json-diff', label: 'JSON对比', icon: Code, path: '/json-diff' },
    ],
  },
  {
    id: 'encoding-tools',
    label: '编码工具',
    icon: Code,
    items: [
      { name: 'url-encoder', label: 'URL编码解码', icon: Code, path: '/url-encoder' },
    ],
  },
  {
    id: 'generate-tools',
    label: '生成工具',
    icon: QrCode,
    items: [
      { name: 'qr-code', label: '二维码生成', icon: QrCode, path: '/qr-code' },
      { name: 'crontab', label: 'Crontab生成', icon: Code, path: '/crontab' },
    ],
  },
  {
    id: 'db-tools',
    label: '数据库工具',
    icon: Table,
    items: [
      { name: 'in-condition', label: 'IN条件生成', icon: Code, path: '/in-condition' },
    ],
  },
]

const currentPath = computed(() => route.path)
const isHome = computed(() => currentPath.value === '/')

function navigateTo(path: string) {
  router.push(path)
}

function toggleCategory(id: string) {
  const next = new Set(expandedCategories.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  expandedCategories.value = next
}

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <!-- Mobile overlay -->
  <div
    v-if="!isCollapsed"
    class="fixed inset-0 bg-black/30 z-40 lg:hidden"
    @click="isCollapsed = true"
  ></div>

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed left-0 top-0 bottom-0 z-50 bg-white dark:bg-dark-100 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col',
      isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-[64px]' : 'w-[240px]'
    ]"
  >
    <!-- Logo area -->
    <div
      :class="[
        'flex items-center border-b border-gray-200 dark:border-gray-700',
        isCollapsed ? 'h-[64px] justify-center px-2' : 'h-[64px] px-4 gap-3'
      ]"
    >
      <img
        src="/cv.png"
        alt="檬橙IT工具箱"
        class="w-8 h-8 rounded-lg object-cover flex-shrink-0 cursor-pointer"
        @click="navigateTo('/')"
      />
      <span
        v-if="!isCollapsed"
        class="text-base font-bold text-gray-800 dark:text-white truncate transition-opacity duration-300"
      >
        檬橙IT工具箱
      </span>
    </div>

    <!-- Toggle button (desktop) -->
    <button
      @click="toggleSidebar"
      :class="[
        'absolute -right-3 top-[74px] w-6 h-6 rounded-full bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-sm hover:shadow-md transition-all hidden lg:flex',
        isCollapsed ? 'rotate-180' : ''
      ]"
      :title="isCollapsed ? '展开' : '收起'"
    >
      <ChevronLeft class="w-3 h-3 text-gray-500" />
    </button>

    <!-- Nav content -->
    <div class="flex-1 overflow-y-auto py-3">
      <!-- Home -->
      <button
        @click="navigateTo('/')"
        :class="[
          'w-full flex items-center transition-all duration-200',
          isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-2.5 gap-3',
          isHome
            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
        ]"
        :title="isCollapsed ? '首页' : ''"
      >
        <Home class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="text-sm font-medium">首页</span>
      </button>

      <!-- Categories -->
      <div
        v-for="category in categories"
        :key="category.id"
        class="mt-1"
      >
        <!-- Category header -->
        <button
          v-if="!isCollapsed"
          @click="toggleCategory(category.id)"
          class="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <div class="flex items-center gap-2">
            <component :is="category.icon" class="w-4 h-4" />
            {{ category.label }}
          </div>
          <ChevronDown
            class="w-3 h-3 transition-transform duration-200"
            :class="expandedCategories.has(category.id) ? 'rotate-180' : ''"
          />
        </button>

        <!-- Collapsed category icon only -->
        <div
          v-else
          class="flex justify-center py-3 text-gray-400 dark:text-gray-500"
          :title="category.label"
        >
          <component :is="category.icon" class="w-5 h-5" />
        </div>

        <!-- Category items -->
        <div
          v-if="!isCollapsed"
          class="overflow-hidden transition-all duration-200"
          :style="{
            maxHeight: expandedCategories.has(category.id) ? '200px' : '0',
            opacity: expandedCategories.has(category.id) ? 1 : 0,
          }"
        >
          <button
            v-for="item in category.items"
            :key="item.name"
            @click="navigateTo(item.path)"
            :class="[
              'w-full flex items-center px-4 py-2 gap-3 text-sm transition-all duration-200',
              currentPath === item.path
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/10'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white'
            ]"
          >
            <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
            <span class="truncate">{{ item.label }}</span>
          </button>
        </div>

        <!-- Collapsed: show active item dot -->
        <div v-else class="flex flex-col items-center gap-1 py-1">
          <div
            v-for="item in category.items"
            :key="item.name"
            @click="navigateTo(item.path)"
            :class="[
              'w-2 h-2 rounded-full cursor-pointer transition-all',
              currentPath === item.path
                ? 'bg-primary-500 scale-125'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
            ]"
            :title="item.label"
          ></div>
        </div>
      </div>
    </div>

    <!-- Bottom actions -->
    <div
      :class="[
        'border-t border-gray-200 dark:border-gray-700',
        isCollapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-3 flex items-center gap-2'
      ]"
    >
      <button
        @click="toggleTheme"
        :class="[
          'rounded-lg transition-all duration-200 flex items-center',
          isCollapsed ? 'w-10 h-10 justify-center' : 'px-3 py-2 gap-2 flex-1',
          'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        ]"
        :title="isCollapsed ? (theme === 'light' ? '切换到深色' : '切换到浅色') : ''"
      >
        <Sun v-if="theme === 'dark'" class="w-5 h-5" />
        <Moon v-else class="w-5 h-5" />
        <span v-if="!isCollapsed" class="text-sm">{{ theme === 'light' ? '深色模式' : '浅色模式' }}</span>
      </button>
    </div>
  </aside>

  <!-- Mobile hamburger (when sidebar collapsed) -->
  <button
    v-if="isCollapsed"
    @click="isCollapsed = false"
    class="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-lg bg-white dark:bg-dark-100 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-md"
  >
    <Layers class="w-5 h-5 text-gray-600 dark:text-gray-300" />
  </button>
</template>