<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LinearTopBar from '@/components/linear/LinearTopBar.vue'
import LinearSidebar, { type SidebarTab } from '@/components/linear/LinearSidebar.vue'
import LinearWorkflowsPanel from '@/components/linear/LinearWorkflowsPanel.vue'
import LinearAssetsPanel from '@/components/linear/LinearAssetsPanel.vue'
import LinearHistoryPanel from '@/components/linear/LinearHistoryPanel.vue'
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()
const activeTab = ref<SidebarTab>('workflows')

onMounted(() => {
  // Set canvas mode to linear when this view mounts
  uiStore.setCanvasMode('linear')
})
</script>

<template>
  <div class="linear-view flex h-screen flex-col bg-zinc-950">
    <!-- Top Bar with Logo and Projects -->
    <LinearTopBar />

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Icon Sidebar -->
      <LinearSidebar v-model:active-tab="activeTab" />

      <!-- Left Panel - switches based on active tab -->
      <LinearAssetsPanel v-if="activeTab === 'assets'" />
      <LinearWorkflowsPanel v-else-if="activeTab === 'workflows'" />

      <!-- Right Main Area (generations/canvas) -->
      <LinearHistoryPanel />
    </div>
  </div>
</template>

<style scoped>
.linear-view {
  font-family: var(--font-sans, system-ui);
}
</style>
