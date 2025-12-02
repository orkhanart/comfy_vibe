<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { Toaster } from 'vue-sonner'

import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()

// Global keyboard shortcut: X to toggle interface version (v1/v2)
function handleKeydown(event: KeyboardEvent): void {
  // Ignore if user is typing in an input or textarea
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement
  ) {
    return
  }

  if (event.key.toLowerCase() === 'x') {
    uiStore.toggleInterfaceVersion()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
    <!-- Global components -->
    <Toaster richColors position="bottom-right" />

    <!-- Main content -->
    <RouterView />
  </div>
</template>

<style>
/* Dark mode color scheme */
.dark {
  color-scheme: dark;
}
</style>
