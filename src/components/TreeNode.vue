
<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight, ChevronDown, Braces, List, Hash, ToggleLeft, Type, Minus } from 'lucide-vue-next'

export interface FieldNode {
  path: string
  key: string
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
  value: any
  children?: FieldNode[]
  length?: number
}

interface TreeNodeProps {
  node: FieldNode
  selected: Set<string>
  expanded: Set<string>
  keyword: string
  depth: number
}

const props = defineProps<TreeNodeProps>()
const emit = defineEmits<{
  'toggle-expand': [path: string]
  'toggle-select': [path: string]
}>()

const hasChildren = computed(() => {
  return props.node.type === 'object' || props.node.type === 'array'
})

const isVisible = computed(() => {
  if (!props.keyword) return true
  const kw = props.keyword.toLowerCase()
  if (props.node.key.toLowerCase().includes(kw) || props.node.path.toLowerCase().includes(kw)) {
    return true
  }
  if (props.node.children) {
    return props.node.children.some(child => {
      const childKw = props.keyword.toLowerCase()
      return child.key.toLowerCase().includes(childKw) || child.path.toLowerCase().includes(childKw)
        || (child.children && child.children.some(c => c.key.toLowerCase().includes(childKw) || c.path.toLowerCase().includes(childKw)))
    })
  }
  return false
})

function isSelected(path: string): boolean {
  return props.selected.has(path)
}

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
</script>

<template>
  <div v-if="isVisible">
    <div
      class="flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer transition-colors"
      :class="isSelected(node.path) ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'"
      :style="{ paddingLeft: (depth * 16 + 8) + 'px' }"
      @click="emit('toggle-select', node.path)"
    >
      <span
        v-if="hasChildren"
        class="cursor-pointer p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded shrink-0"
        @click.stop="emit('toggle-expand', node.path)"
      >
        <ChevronDown v-if="expanded.has(node.path)" class="w-3.5 h-3.5 text-gray-400" />
        <ChevronRight v-else class="w-3.5 h-3.5 text-gray-400" />
      </span>
      <span v-else class="w-4.5 inline-block shrink-0"></span>
      <component :is="getTypeIcon(node.type)" :class="['w-3.5 h-3.5', getTypeColorClass(node.type), 'shrink-0']" />
      <span class="text-gray-800 dark:text-gray-200 truncate">
        {{ node.key }}
      </span>
      <span v-if="node.type === 'array'" class="text-gray-400 shrink-0">
        [{{ node.length }}]
      </span>
    </div>

    <template v-if="hasChildren && expanded.has(node.path) && node.children">
      <TreeNode
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        :selected="selected"
        :expanded="expanded"
        :keyword="keyword"
        :depth="depth + 1"
        @toggle-expand="emit('toggle-expand', $event)"
        @toggle-select="emit('toggle-select', $event)"
      />
    </template>
  </div>
</template>
