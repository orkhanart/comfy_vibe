<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import LinearTopBar from '@/components/linear-mode/LinearTopBar.vue'
import LinearSidebar from '@/components/linear-mode/LinearSidebar.vue'
import LinearParametersPanel from '@/components/linear-mode/LinearParametersPanel.vue'
import LinearHistoryPanel from '@/components/linear-mode/LinearHistoryPanel.vue'
import LinearMobileView from '@/components/linear-mode/mobile/LinearMobileView.vue'
import type { RunParams } from '@/components/linear-mode/LinearParametersPanel.vue'

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
        <!-- Left Sidebar: Assets, Workflows, Templates -->
        <LinearSidebar />

        <!-- Center: History/Output Panel -->
        <LinearHistoryPanel />

        <!-- Right: Parameters Panel -->
        <LinearParametersPanel @run="handleRun" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.linear-view {
  font-family: var(--font-sans, system-ui);
}
</style>
