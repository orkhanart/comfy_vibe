<script setup lang="ts">
import LinearTopBar from '@/components/linear/LinearTopBar.vue'
import LinearWorkflowsPanel from '@/components/linear/LinearWorkflowsPanel.vue'
import LinearHistoryPanel from '@/components/linear/LinearHistoryPanel.vue'
</script>

<template>
  <div class="linear-view flex h-screen flex-col bg-zinc-950">
    <!-- Top Bar with Logo and Projects -->
    <LinearTopBar />

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Panel - Run Workflow (always open) -->
      <LinearWorkflowsPanel />

      <!-- Right Main Area (generations) -->
      <LinearHistoryPanel />
    </div>
  </div>
</template>

<style scoped>
.linear-view {
  font-family: var(--font-sans, system-ui);
}
</style>
