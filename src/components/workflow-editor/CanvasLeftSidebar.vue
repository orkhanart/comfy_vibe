<script setup lang="ts">
// Sidebar Components
import { SidebarIconBar } from '@/components/sidebar'
import SidebarPanel from '@/components/sidebar/SidebarPanel.vue'

const emit = defineEmits<{
  'extend-library': []
  'extend-nodes': []
  'extend-models': []
}>()
</script>

<template>
  <div class="flex h-full">
    <SidebarIconBar />
    <SidebarPanel
      @extend-library="emit('extend-library')"
      @extend-nodes="emit('extend-nodes')"
      @extend-models="emit('extend-models')"
    />
  </div>
</template>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Custom scrollbar for the panel */
aside ::-webkit-scrollbar {
  width: 4px;
}

aside ::-webkit-scrollbar-track {
  background: transparent;
}

aside ::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 2px;
}

aside ::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}

/* Fade transition for node preview */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
