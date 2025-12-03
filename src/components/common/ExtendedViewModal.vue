<script setup lang="ts">
import { watch, onMounted, onUnmounted, useSlots } from 'vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  visible: boolean
  title?: string
}>(), {})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'close': []
}>()

const slots = useSlots()
const hasSidebar = () => !!slots.sidebar
const hasHeaderLeft = () => !!slots['header-left']

// Handle escape key
function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape' && props.visible) {
    close()
  }
}

function close(): void {
  emit('update:visible', false)
  emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Prevent body scroll when modal is open
watch(() => props.visible, (visible) => {
  if (visible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/60"
          @click="close"
        />

        <!-- Modal Container -->
        <div class="relative z-10 flex h-[85vh] w-[85vw] max-w-6xl flex-col overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
          <!-- Header -->
          <div class="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
            <div class="flex items-center gap-4">
              <span v-if="title && !hasHeaderLeft()" class="text-sm font-medium text-foreground">{{ title }}</span>
              <slot name="header-left" />
            </div>
            <div class="flex items-center gap-2">
              <slot name="header-actions" />
              <button
                class="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                @click="close"
              >
                <X class="size-4" />
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar -->
            <div
              v-if="hasSidebar()"
              class="w-52 shrink-0 overflow-y-auto border-r border-border bg-muted/30"
            >
              <slot name="sidebar" />
            </div>

            <!-- Main Content -->
            <div class="flex-1 overflow-y-auto">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.15s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.98);
}
</style>
