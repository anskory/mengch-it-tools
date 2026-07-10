<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { CheckCircle, XCircle, Info, X } from 'lucide-vue-next'

interface ToastMessage {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

const messages = ref<ToastMessage[]>([])
let idCounter = 0

function showToast(type: ToastMessage['type'], message: string) {
  const id = ++idCounter
  messages.value.push({ id, type, message })
  
  nextTick(() => {
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  })
}

function removeToast(id: number) {
  const index = messages.value.findIndex(m => m.id === id)
  if (index > -1) {
    messages.value.splice(index, 1)
  }
}

defineExpose({
  showToast,
  success: (msg: string) => showToast('success', msg),
  error: (msg: string) => showToast('error', msg),
  info: (msg: string) => showToast('info', msg),
})

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const bgColors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}
</script>

<template>
  <div class="fixed top-20 right-4 z-50 flex flex-col gap-2">
    <TransitionGroup name="toast">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm min-w-[280px]',
          msg.type === 'success' ? 'bg-green-50 border border-green-200' : '',
          msg.type === 'error' ? 'bg-red-50 border border-red-200' : '',
          msg.type === 'info' ? 'bg-blue-50 border border-blue-200' : '',
          'dark:bg-gray-800/90 dark:border-gray-700'
        ]"
      >
        <div :class="[
          'w-5 h-5 rounded-full flex items-center justify-center',
          bgColors[msg.type]
        ]">
          <component :is="icons[msg.type]" class="w-3 h-3 text-white" />
        </div>
        <span :class="[
          'text-sm font-medium flex-1',
          msg.type === 'success' ? 'text-green-700' : '',
          msg.type === 'error' ? 'text-red-700' : '',
          msg.type === 'info' ? 'text-blue-700' : '',
          'dark:text-gray-200'
        ]">
          {{ msg.message }}
        </span>
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
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>