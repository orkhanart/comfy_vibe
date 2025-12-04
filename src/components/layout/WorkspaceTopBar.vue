<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CanvasLogoMenu from '@/components/canvas/CanvasLogoMenu.vue'
import CanvasTabs from '@/components/canvas/CanvasTabs.vue'
import { useUiStore } from '@/stores/uiStore'

const router = useRouter()
const uiStore = useUiStore()
const showMenu = ref(false)

function handleLogoClick(): void {
  showMenu.value = !showMenu.value
}

function handleHomeClick(): void {
  router.push({ name: 'workspace-dashboard', params: { workspaceId: 'default' } })
}

function handleTabSelect(tabId: string): void {
  const mode = uiStore.getWorkflowMode(tabId)
  uiStore.selectWorkflowTab(tabId)
  // Navigate to the correct mode
  if (mode === 'linear') {
    router.push({ name: 'linear' })
  } else {
    router.push({ name: 'node-editor' })
  }
}

function handleNewWorkflow(): void {
  // Create new workflow in node mode by default from workspace
  uiStore.createWorkflowTab('node')
  router.push({ name: 'node-editor' })
}
</script>

<template>
  <div class="flex h-10 shrink-0 items-center gap-1 border-b border-border bg-background px-2 select-none">
    <!-- Logo Section -->
    <div class="relative">
      <button
        class="flex items-center gap-1 rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        @click="handleLogoClick"
      >
        <img :src="uiStore.themeMode === 'dark' ? '/assets/images/comfy-logo-mono.svg' : '/assets/images/comfy-logo-single.svg'" alt="Comfy" class="h-5 w-5" />
        <Icon name="chevron-down" size="xs" class="opacity-70" />
      </button>

      <CanvasLogoMenu :show="showMenu" @close="showMenu = false" />
    </div>

    <!-- Divider -->
    <div class="mx-1 h-5 w-px bg-border" />

    <!-- Home Button (Active in Workspace) -->
    <button
      v-tooltip.bottom="{ value: 'Home', showDelay: 50 }"
      class="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground"
      @click="handleHomeClick"
    >
      <Icon name="home" size="md" />
    </button>

    <!-- Divider -->
    <div class="mx-1 h-5 w-px bg-border" />

    <!-- Tabs Section -->
    <CanvasTabs
      :tabs="uiStore.workflowTabs"
      :active-tab-id="''"
      @select="handleTabSelect"
      @close="uiStore.closeWorkflowTab"
      @new="handleNewWorkflow"
    />

  </div>
</template>
