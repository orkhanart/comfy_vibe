<script setup lang="ts">
import LinearTopBar from '@/components/linear-mode/LinearTopBar.vue'
import LinearSidebar from '@/components/linear-mode/LinearSidebar.vue'
import LinearParametersPanel from '@/components/linear-mode/LinearParametersPanel.vue'
import LinearHistoryPanel from '@/components/linear-mode/LinearHistoryPanel.vue'
import type { RunParams } from '@/components/linear-mode/LinearParametersPanel.vue'

function handleRun(params: RunParams): void {
  console.log('Run workflow:', params)
}
</script>

<template>
  <div class="linear-view flex h-screen flex-col bg-background">
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
</template>

<style scoped>
.linear-view {
  font-family: var(--font-sans, system-ui);
}
</style>
