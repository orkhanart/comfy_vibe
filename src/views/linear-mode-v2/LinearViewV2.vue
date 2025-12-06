<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import LinearTopBar from '@/components/linear-mode-v2/LinearTopBar.vue'
import LinearSidebar from '@/components/linear-mode-v2/LinearSidebar.vue'
import LinearHistoryPanel from '@/components/linear-mode-v2/LinearHistoryPanel.vue'
import LinearMobileView from '@/components/linear-mode-v2/mobile/LinearMobileView.vue'
import type { RunParams } from '@/components/linear-mode-v2/LinearSidebar.vue'

const isMobile = ref(false)
const MOBILE_BREAKPOINT = 768

function checkMobile(): void {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

function handleRun(params: RunParams): void {
  console.log('Run workflow:', params)
}
</script>

<template>
  <div class="linear-view h-screen bg-background">
    <!-- Mobile View -->
    <LinearMobileView v-if="isMobile" />

    <!-- Desktop View -->
    <div v-else class="flex h-full flex-col">
      <!-- Top Bar -->
      <LinearTopBar />

      <!-- Main Content -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Left Sidebar: Run, Assets, Workflows, Templates -->
        <LinearSidebar @run="handleRun" />

        <!-- Center/Right: Queue/Output Panel (now takes full remaining width) -->
        <LinearHistoryPanel />
      </div>
    </div>
  </div>
</template>

<style scoped>
.linear-view {
  font-family: var(--font-sans, system-ui);
}
</style>
