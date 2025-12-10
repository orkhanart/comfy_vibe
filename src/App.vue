<script setup lang="ts">
import { onMounted } from 'vue'
import { Toaster } from 'vue-sonner'

import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()

// Vercel Toolbar for preview feedback
onMounted(async () => {
  if (import.meta.env.DEV || import.meta.env.VITE_VERCEL_ENV === 'preview') {
    const { mountVercelToolbar } = await import('@vercel/toolbar/vite')
    mountVercelToolbar()
  }
})
</script>

<template>
  <div class="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-background dark:text-foreground">
    <!-- Global components -->
    <Toaster richColors position="bottom-right" :theme="uiStore.themeMode === 'dark' ? 'dark' : 'light'" />

    <!-- Main content -->
    <RouterView />
  </div>
</template>
