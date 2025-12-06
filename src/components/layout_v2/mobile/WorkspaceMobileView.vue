<script setup lang="ts">
import { ref } from 'vue'
import WorkspaceMobileTopBar from './WorkspaceMobileTopBar.vue'
import WorkspaceMobileTabBar, { type MobileTab } from './WorkspaceMobileTabBar.vue'
import WorkspaceMobileHomeTab from './WorkspaceMobileHomeTab.vue'
import WorkspaceMobileProjectsTab from './WorkspaceMobileProjectsTab.vue'
import WorkspaceMobileSearchTab from './WorkspaceMobileSearchTab.vue'
import WorkspaceMobileAccountTab from './WorkspaceMobileAccountTab.vue'

const activeTab = ref<MobileTab>('home')
</script>

<template>
  <div class="flex h-full flex-col bg-background">
    <!-- Top Bar -->
    <WorkspaceMobileTopBar />

    <!-- Tab Bar (under navbar) -->
    <WorkspaceMobileTabBar v-model:active-tab="activeTab" />

    <!-- Content Area -->
    <main class="flex-1 overflow-hidden">
      <WorkspaceMobileHomeTab v-if="activeTab === 'home'" />
      <WorkspaceMobileProjectsTab v-else-if="activeTab === 'projects'" />
      <WorkspaceMobileSearchTab v-else-if="activeTab === 'search'" />
      <WorkspaceMobileAccountTab v-else-if="activeTab === 'account'" />
    </main>
  </div>
</template>
