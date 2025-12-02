<script setup lang="ts">
import { Toaster } from 'vue-sonner'

import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()
</script>

<template>
  <div class="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-background dark:text-foreground">
    <!-- Global components -->
    <Toaster richColors position="bottom-right" :theme="uiStore.themeMode === 'dark' ? 'dark' : 'light'" />

    <!-- Main content -->
    <RouterView />
  </div>
</template>
