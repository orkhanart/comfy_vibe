<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import WorkspaceSidebarV2 from './WorkspaceSidebarV2.vue'
import WorkspaceTopBarV2 from './WorkspaceTopBarV2.vue'
import WorkspaceMobileView from './mobile/WorkspaceMobileView.vue'

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
</script>

<template>
  <div class="h-screen bg-white dark:bg-background">
    <!-- Mobile View -->
    <WorkspaceMobileView v-if="isMobile" />

    <!-- Desktop View -->
    <div v-else class="flex h-full flex-col">
      <!-- Top Navigation Bar -->
      <WorkspaceTopBarV2 />

      <!-- Main Content with Sidebar -->
      <div class="flex flex-1 overflow-hidden">
        <WorkspaceSidebarV2 />
        <main class="flex-1 overflow-auto bg-zinc-50/50 dark:bg-card/50">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
