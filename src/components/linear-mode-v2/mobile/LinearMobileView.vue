<script setup lang="ts">
import { ref, computed } from 'vue'
import LinearMobileTopBar from './LinearMobileTopBar.vue'
import LinearMobileTabBar, { type MobileTab } from './LinearMobileTabBar.vue'
import LinearMobileRunTab from './LinearMobileRunTab.vue'
import LinearMobileQueueTab from './LinearMobileQueueTab.vue'
import LinearMobileAssetsTab from './LinearMobileAssetsTab.vue'
import LinearMobileWorkflowsTab from './LinearMobileWorkflowsTab.vue'
import LinearMobileTemplatesTab from './LinearMobileTemplatesTab.vue'

const activeTab = ref<MobileTab>('run')

const tabTitles: Record<MobileTab, string> = {
  run: 'Run',
  queue: 'Queue',
  assets: 'Assets',
  workflows: 'Workflows',
  templates: 'Templates',
}

const activeTitle = computed(() => tabTitles[activeTab.value])
</script>

<template>
  <div class="flex h-full flex-col bg-background">
    <!-- Top Bar -->
    <LinearMobileTopBar />

    <!-- Tab Bar (under navbar) -->
    <LinearMobileTabBar v-model:active-tab="activeTab" />

    <!-- Title Area -->
    <div class="border-b border-border px-3 py-1.5">
      <h1 class="text-sm font-medium">{{ activeTitle }}</h1>
    </div>

    <!-- Content Area -->
    <main class="flex-1 overflow-hidden">
      <LinearMobileRunTab v-if="activeTab === 'run'" />
      <LinearMobileQueueTab v-else-if="activeTab === 'queue'" />
      <LinearMobileAssetsTab v-else-if="activeTab === 'assets'" />
      <LinearMobileWorkflowsTab v-else-if="activeTab === 'workflows'" />
      <LinearMobileTemplatesTab v-else-if="activeTab === 'templates'" />
    </main>
  </div>
</template>
