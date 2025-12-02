<script setup lang="ts">
import WorkspaceSidebar from './WorkspaceSidebar.vue'
</script>

<template>
  <div class="flex h-screen bg-white dark:bg-background">
    <WorkspaceSidebar />
    <main class="flex-1 overflow-auto bg-zinc-50/50 dark:bg-card/50">
      <slot />
    </main>
  </div>
</template>
