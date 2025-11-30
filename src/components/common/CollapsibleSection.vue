<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title: string
  icon?: string
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: true
})

const isOpen = ref(props.defaultOpen)

function toggle(): void {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="border-b border-zinc-800">
    <!-- Header -->
    <button
      class="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-zinc-800/50"
      @click="toggle"
    >
      <i
        class="pi pi-chevron-right text-[10px] text-zinc-500 transition-transform duration-200"
        :class="{ 'rotate-90': isOpen }"
      />
      <i v-if="icon" :class="['pi', icon, 'text-xs text-zinc-400']" />
      <span class="text-xs font-medium uppercase tracking-wide text-zinc-400">{{ title }}</span>
    </button>

    <!-- Content -->
    <div
      v-show="isOpen"
      class="px-3 pb-3"
    >
      <slot />
    </div>
  </div>
</template>
