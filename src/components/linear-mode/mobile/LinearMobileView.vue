<script setup lang="ts">
import { ref } from 'vue'
import LinearMobileTopBar from './LinearMobileTopBar.vue'
import LinearMobileTabBar, { type MobileTab } from './LinearMobileTabBar.vue'
import LinearMobileRunTab from './LinearMobileRunTab.vue'
import LinearMobileQueueTab from './LinearMobileQueueTab.vue'
import LinearMobileAssetsTab from './LinearMobileAssetsTab.vue'
import LinearMobileWorkflowsTab from './LinearMobileWorkflowsTab.vue'
import LinearMobileTemplatesTab from './LinearMobileTemplatesTab.vue'

const activeTab = ref<MobileTab>('run')
</script>

<template>
  <div class="flex h-full flex-col bg-background">
    <!-- Top Bar -->
    <LinearMobileTopBar />

    <!-- Content Area -->
    <main class="flex-1 overflow-hidden">
      <LinearMobileRunTab v-if="activeTab === 'run'" />
      <LinearMobileQueueTab v-else-if="activeTab === 'queue'" />
      <LinearMobileAssetsTab v-else-if="activeTab === 'assets'" />
      <LinearMobileWorkflowsTab v-else-if="activeTab === 'workflows'" />
      <LinearMobileTemplatesTab v-else-if="activeTab === 'templates'" />
    </main>

    <!-- Bottom Tab Bar -->
    <LinearMobileTabBar v-model:active-tab="activeTab" />
  </div>
</template>
