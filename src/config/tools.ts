/**
 * 工具分类配置
 *
 * 集中管理所有工具的分类、图标、路由等信息，
 * 供侧边栏导航、首页展示、工具数量统计等多处复用。
 *
 * 新增工具时只需在此处添加一项，同时在 pages/对应分类/ 下创建页面文件即可。
 */

import {
  FileText, Database, Code, QrCode, Table,
  Sparkles, GitCompare, FileJson, Link, Hash, Calendar
} from 'lucide-vue-next'
import type { Component } from 'vue'

/**
 * 单个工具项配置
 */
export interface ToolItem {
  /** 唯一标识 */
  name: string
  /** 显示名称 */
  label: string
  /** 图标组件 */
  icon: Component
  /** 路由路径 */
  path: string
  /** 组件文件路径（懒加载用） */
  component: string
  /** 工具描述（首页展示用） */
  description: string
}

/**
 * 工具分类配置
 */
export interface ToolCategory {
  /** 分类 ID */
  id: string
  /** 分类名称 */
  label: string
  /** 分类图标 */
  icon: Component
  /** 分类下的工具列表 */
  items: ToolItem[]
}

/**
 * 所有工具分类配置
 */
export const categories: ToolCategory[] = [
  {
    id: 'text-tools',
    label: '文本工具',
    icon: FileText,
    items: [
      {
        name: 'variable-converter',
        label: '变量名转换',
        icon: Sparkles,
        path: '/variable-converter',
        component: '@/pages/text/VariableConverter.vue',
        description: '支持驼峰式、下划线式、中划线式等多种命名风格之间的相互转换',
      },
      {
        name: 'text-diff',
        label: '文本比较',
        icon: GitCompare,
        path: '/text-diff',
        component: '@/pages/text/TextDiff.vue',
        description: '对比两段文本的差异，高亮显示新增、删除和修改的内容',
      },
    ],
  },
  {
    id: 'data-tools',
    label: '数据工具',
    icon: Database,
    items: [
      {
        name: 'json-beautify',
        label: 'JSON美化',
        icon: FileJson,
        path: '/json-beautify',
        component: '@/pages/data/JsonBeautify.vue',
        description: '将压缩的JSON格式化为易读的缩进格式，支持自定义缩进',
      },
      {
        name: 'json-diff',
        label: 'JSON对比',
        icon: GitCompare,
        path: '/json-diff',
        component: '@/pages/data/JsonDiff.vue',
        description: '对比两个JSON对象的差异，支持嵌套结构的深度对比',
      },
      {
        name: 'json-escape',
        label: 'JSON转义',
        icon: Code,
        path: '/json-escape',
        component: '@/pages/data/JsonEscape.vue',
        description: 'JSON转义/去转义，支持Unicode转换、符号转换等多种功能',
      },
      {
        name: 'json-explorer',
        label: 'JSON字段提取',
        icon: Hash,
        path: '/json-explorer',
        component: '@/pages/data/JsonExplorer.vue',
        description: '解析JSON结构，树形浏览字段，快速提取需要的字段值',
      },
    ],
  },
  {
    id: 'encoding-tools',
    label: '编码工具',
    icon: Code,
    items: [
      {
        name: 'url-encoder',
        label: 'URL编码解码',
        icon: Link,
        path: '/url-encoder',
        component: '@/pages/encoding/UrlEncoder.vue',
        description: '对URL进行编码和解码操作，支持完整URL和组件编码',
      },
    ],
  },
  {
    id: 'generate-tools',
    label: '生成工具',
    icon: QrCode,
    items: [
      {
        name: 'qr-code',
        label: '二维码生成',
        icon: QrCode,
        path: '/qr-code',
        component: '@/pages/generate/QrCode.vue',
        description: '将文本或URL转换为二维码图片，支持自定义尺寸和颜色',
      },
      {
        name: 'crontab',
        label: 'Crontab生成',
        icon: Calendar,
        path: '/crontab',
        component: '@/pages/generate/CrontabGenerator.vue',
        description: '可视化生成Crontab定时任务表达式，支持反解析说明',
      },
    ],
  },
  {
    id: 'db-tools',
    label: '数据库工具',
    icon: Table,
    items: [
      {
        name: 'in-condition',
        label: 'IN条件生成',
        icon: Code,
        path: '/in-condition',
        component: '@/pages/db/InConditionGenerator.vue',
        description: '快速生成SQL的IN条件语句，支持多种格式输出',
      },
    ],
  },
]

/**
 * 获取所有工具的数量
 */
export function getToolCount(): number {
  return categories.reduce((sum, cat) => sum + cat.items.length, 0)
}

/**
 * 获取所有工具的平铺列表
 */
export function getAllTools(): ToolItem[] {
  return categories.flatMap(cat => cat.items)
}
