/**
 * 侧边栏导航组件
 * 提供应用的导航菜单、主题切换和折叠展开功能
 * 支持响应式设计，在移动端和桌面端有不同的展示方式
 */
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Sun, Moon, Home, ChevronRight, Sparkles, FileText, Database, Code, QrCode,
  ChevronDown, ChevronLeft, ChevronRight as ChevronRightIcon, Layers, Table, Palette, Check
} from 'lucide-vue-next'
import { useTheme, type ThemeMode } from '@/composables/useTheme'

const router = useRouter()
const route = useRoute()
// 主题切换功能，从组合式函数获取
const { theme, themeOptions, setTheme } = useTheme()

// 主题选择面板展开状态
const showThemePanel = ref(false)

// 侧边栏折叠状态：移动端默认折叠，桌面端默认展开
const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024
const isCollapsed = ref(isMobile)

// 监听窗口大小变化，自动适配移动端
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    const nowMobile = window.innerWidth < 1024
    // 从桌面端切换到移动端时自动折叠
    if (nowMobile && !isMobile) {
      isCollapsed.value = true
    }
  })
}

// 当前展开的分类ID集合，默认全部展开
const expandedCategories = ref<Set<string>>(new Set(['text-tools', 'data-tools', 'encoding-tools', 'generate-tools', 'db-tools']))

/**
 * 导航项接口定义
 * @property name - 唯一标识符
 * @property label - 显示标签
 * @property icon - 图标组件
 * @property path - 路由路径
 */
interface NavItem {
  name: string
  label: string
  icon: any
  path: string
}

/**
 * 导航分类接口定义
 * @property id - 分类唯一标识
 * @property label - 分类显示标签
 * @property icon - 分类图标组件
 * @property items - 分类下的导航项数组
 */
interface NavCategory {
  id: string
  label: string
  icon: any
  items: NavItem[]
}

/**
 * 导航分类配置
 * 按功能模块分组，包含文本工具、数据工具、编码工具、生成工具和数据库工具
 */
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
      { name: 'json-escape', label: 'JSON转义', icon: Code, path: '/json-escape' },
      { name: 'json-explorer', label: 'JSON字段提取', icon: Code, path: '/json-explorer' },
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

// 当前路由路径，用于高亮当前菜单项
const currentPath = computed(() => route.path)

// 判断是否在首页
const isHome = computed(() => currentPath.value === '/')

/**
 * 导航到指定路径
 * @param path - 目标路由路径
 */
function navigateTo(path: string) {
  router.push(path)
}

/**
 * 切换分类的展开/折叠状态
 * @param id - 分类ID
 */
function toggleCategory(id: string) {
  const next = new Set(expandedCategories.value)
  if (next.has(id)) {
    // 如果已展开则折叠
    next.delete(id)
  } else {
    // 如果已折叠则展开
    next.add(id)
  }
  expandedCategories.value = next
}

/**
 * 切换侧边栏的折叠状态
 */
function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <!-- 移动端遮罩层，点击后关闭侧边栏 -->
  <div
    v-if="!isCollapsed"
    class="fixed inset-0 bg-black/30 z-40 lg:hidden"
    @click="isCollapsed = true"
  ></div>

  <!-- 侧边栏主体 -->
  <aside
    :class="[
      'fixed left-0 top-0 bottom-0 z-50 bg-bg-card border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col',
      isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-[64px]' : 'w-[240px]'
    ]"
  >
    <!-- Logo区域 -->
    <div
      :class="[
        'flex items-center border-b border-gray-200 dark:border-gray-700',
        isCollapsed ? 'h-[64px] justify-center px-2' : 'h-[64px] px-4 gap-3'
      ]"
    >
      <!-- Logo图片，带主题色渐变光晕 -->
      <div class="relative flex-shrink-0">
        <!-- 外层光晕 -->
        <div class="absolute -inset-1 rounded-2xl opacity-40 blur-sm"
          style="background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary));"></div>
        <img
          src="/cv.png"
          alt="檬橙IT工具箱"
          class="relative w-9 h-9 rounded-xl object-cover cursor-pointer border-2 border-bg-card"
          @click="navigateTo('/')"
        />
      </div>
      <!-- 应用标题，折叠时隐藏 -->
      <span
        v-if="!isCollapsed"
        class="text-base font-bold text-gray-800 dark:text-white truncate transition-opacity duration-300"
      >
        檬橙IT工具箱
      </span>
    </div>

    <!-- 折叠/展开按钮（仅桌面端显示） -->
    <button
      @click="toggleSidebar"
      :class="[
        'absolute -right-3 top-[74px] w-6 h-6 rounded-full bg-bg-card border border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-sm hover:shadow-md hover:border-primary-400 transition-all hidden lg:flex',
        isCollapsed ? 'rotate-180' : ''
      ]"
      :title="isCollapsed ? '展开' : '收起'"
    >
      <ChevronLeft class="w-3 h-3 text-primary-500" />
    </button>

    <!-- 导航内容区域 -->
    <div class="flex-1 overflow-y-auto py-3">
      <!-- 首页按钮 -->
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

      <!-- 工具分类列表 -->
      <div
        v-for="category in categories"
        :key="category.id"
        class="mt-1"
      >
        <!-- 分类标题（未折叠状态） -->
        <button
          v-if="!isCollapsed"
          @click="toggleCategory(category.id)"
          class="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <div class="flex items-center gap-2">
            <component :is="category.icon" class="w-4 h-4" />
            {{ category.label }}
          </div>
          <!-- 展开/折叠箭头指示器 -->
          <ChevronDown
            class="w-3 h-3 transition-transform duration-200"
            :class="expandedCategories.has(category.id) ? 'rotate-180' : ''"
          />
        </button>

        <!-- 分类图标（折叠状态） -->
        <div
          v-else
          class="flex justify-center py-3 text-gray-400 dark:text-gray-500"
          :title="category.label"
        >
          <component :is="category.icon" class="w-5 h-5" />
        </div>

        <!-- 分类下的工具项列表（未折叠状态） -->
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

        <!-- 折叠状态下显示为圆点指示器 -->
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

    <!-- 底部操作区域 -->
    <div
      :class="[
        'border-t border-gray-200 dark:border-gray-700 relative',
        isCollapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-3'
      ]"
    >
      <!-- 主题选择按钮 -->
      <button
        @click="showThemePanel = !showThemePanel"
        :class="[
          'rounded-lg transition-all duration-200 flex items-center',
          isCollapsed ? 'w-10 h-10 justify-center' : 'px-3 py-2 gap-2 w-full',
          'text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20',
          showThemePanel && 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
        ]"
        :title="isCollapsed ? '主题选择' : ''"
      >
        <Palette class="w-5 h-5" />
        <span v-if="!isCollapsed" class="text-sm flex-1 text-left">主题</span>
        <ChevronDown v-if="!isCollapsed" class="w-4 h-4 transition-transform duration-200" :class="showThemePanel ? 'rotate-180' : ''" />
      </button>

      <!-- 主题选择面板 -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-if="showThemePanel"
          class="absolute bottom-full left-2 right-2 mb-2 p-2 bg-white dark:bg-dark-100 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-black/5 z-50"
        >
          <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 px-2 py-1 mb-1">选择主题</div>
          <button
            v-for="opt in themeOptions"
            :key="opt.value"
            @click="setTheme(opt.value as ThemeMode); showThemePanel = false"
            :class="[
              'w-full flex items-center gap-2 px-2 py-2 rounded-lg transition-colors text-left',
              theme === opt.value
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            ]"
          >
            <!-- 主题预览色块 -->
            <span class="w-6 h-6 rounded-full shrink-0 ring-2 ring-white/50 dark:ring-white/10"
              :style="{ background: `linear-gradient(135deg, ${opt.color}, ${opt.color2})` }"></span>
            <span class="flex-1 min-w-0">
              <span class="block text-sm font-medium truncate">{{ opt.label }}</span>
              <span class="block text-[10px] text-gray-400 dark:text-gray-500 truncate">{{ opt.desc }}</span>
            </span>
            <Check v-if="theme === opt.value" class="w-4 h-4 text-primary-500 shrink-0" />
          </button>
        </div>
      </Transition>
    </div>
  </aside>

  <!-- 移动端汉堡菜单按钮（侧边栏折叠时显示） -->
  <button
    v-if="isCollapsed"
    @click="isCollapsed = false"
    class="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-bg-card border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-md text-primary-500"
  >
    <Layers class="w-5 h-5" />
  </button>
</template>