/**
 * 提示消息组件
 * 用于显示全局的通知消息，支持成功、错误和信息三种类型
 * 消息会自动在3秒后消失，也支持手动关闭
 */
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { CheckCircle, XCircle, Info, X } from 'lucide-vue-next'

/**
 * 提示消息接口定义
 * @property id - 消息唯一标识
 * @property type - 消息类型：success/error/info
 * @property message - 消息内容
 */
interface ToastMessage {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

// 消息列表，存储当前显示的所有消息
const messages = ref<ToastMessage[]>([])

// 消息ID计数器，用于生成唯一ID
let idCounter = 0

/**
 * 显示提示消息
 * @param type - 消息类型
 * @param message - 消息内容
 */
function showToast(type: ToastMessage['type'], message: string) {
  const id = ++idCounter
  // 将新消息添加到列表
  messages.value.push({ id, type, message })
  
  // 使用nextTick确保DOM更新后再设置定时器
  nextTick(() => {
    // 3秒后自动移除消息
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  })
}

/**
 * 移除指定的提示消息
 * @param id - 要移除的消息ID
 */
function removeToast(id: number) {
  const index = messages.value.findIndex(m => m.id === id)
  if (index > -1) {
    // 从列表中删除消息
    messages.value.splice(index, 1)
  }
}

// 暴露方法给父组件调用
defineExpose({
  showToast,
  success: (msg: string) => showToast('success', msg),
  error: (msg: string) => showToast('error', msg),
  info: (msg: string) => showToast('info', msg),
})

// 不同类型消息对应的图标
const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

// 不同类型消息图标对应的背景色
const bgColors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}
</script>

<template>
  <!-- 消息容器，固定在页面右上角 -->
  <div class="fixed top-20 right-4 z-50 flex flex-col gap-2">
    <!-- 使用TransitionGroup实现消息的进入/离开动画 -->
    <TransitionGroup name="toast">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm min-w-[280px]',
          // 根据消息类型设置不同的背景色
          msg.type === 'success' ? 'bg-green-50 border border-green-200' : '',
          msg.type === 'error' ? 'bg-red-50 border border-red-200' : '',
          msg.type === 'info' ? 'bg-blue-50 border border-blue-200' : '',
          'dark:bg-gray-800/90 dark:border-gray-700'
        ]"
      >
        <!-- 消息图标 -->
        <div :class="[
          'w-5 h-5 rounded-full flex items-center justify-center',
          bgColors[msg.type]
        ]">
          <component :is="icons[msg.type]" class="w-3 h-3 text-white" />
        </div>
        <!-- 消息文本 -->
        <span :class="[
          'text-sm font-medium flex-1',
          // 根据消息类型设置不同的文字颜色
          msg.type === 'success' ? 'text-green-700' : '',
          msg.type === 'error' ? 'text-red-700' : '',
          msg.type === 'info' ? 'text-blue-700' : '',
          'dark:text-gray-200'
        ]">
          {{ msg.message }}
        </span>
        <!-- 关闭按钮 -->
        <button
          @click="removeToast(msg.id)"
          class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X class="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* 消息进入动画 */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

/* 消息离开动画 */
.toast-leave-active {
  transition: all 0.3s ease-in;
}

/* 消息进入起始状态：从右侧滑入且透明 */
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

/* 消息离开结束状态：向右滑出且透明 */
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>