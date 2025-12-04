<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import WorkflowEditorLogoMenu from './WorkflowEditorLogoMenu.vue'
import ModeTabs from './ModeTabs.vue'
import WorkflowEditorShareDialog from './WorkflowEditorShareDialog.vue'
import { useUiStore } from '@/stores/uiStore'

const router = useRouter()
const uiStore = useUiStore()
const showShareDialog = ref(false)
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
  // Navigate to the correct mode if different from current
  if (mode === 'linear') {
    router.push({ name: 'linear-mode' })
  }
  // Already in workflow editor, no navigation needed
}

function handleNewWorkflow(): void {
  // Create new workflow in current mode (workflow editor)
  uiStore.createWorkflowTab('workflow')
}
</script>

<template>
  <div class="flex h-10 items-center gap-1 border-b border-border bg-background px-2 select-none">
    <!-- Logo Section -->
    <div class="relative">
      <button
        class="flex items-center gap-1 rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        @click="handleLogoClick"
      >
        <img :src="uiStore.themeMode === 'dark' ? '/assets/images/comfy-logo-mono.svg' : '/assets/images/comfy-logo-single.svg'" alt="Comfy" class="h-5 w-5" />
        <Icon name="chevron-down" size="xs" class="opacity-70" />
      </button>

      <WorkflowEditorLogoMenu :show="showMenu" @close="showMenu = false" />
    </div>

    <!-- Divider -->
    <div class="mx-1 h-5 w-px bg-border" />

    <!-- Home Button -->
    <button
      v-tooltip.bottom="{ value: 'Home', showDelay: 50 }"
      class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      @click="handleHomeClick"
    >
      <Icon name="home" size="md" />
    </button>

    <!-- Divider -->
    <div class="mx-1 h-5 w-px bg-border" />

    <!-- Tabs Section -->
    <ModeTabs
      :tabs="uiStore.workflowTabs"
      :active-tab-id="uiStore.activeWorkflowTabId"
      @select="handleTabSelect"
      @close="uiStore.closeWorkflowTab"
      @new="handleNewWorkflow"
    />

    <!-- Right Section -->
    <div class="ml-auto flex items-center gap-1">
      <!-- Mode Toggle -->
      <div class="flex h-7 items-center rounded-md bg-muted p-0.5">
        <button
          class="flex h-6 items-center gap-1 rounded px-2 text-xs font-medium bg-background text-foreground shadow-sm"
        >
          <Icon name="sitemap" size="xs" />
          Workflow
        </button>
        <button
          class="flex h-6 items-center gap-1 rounded px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          @click="router.push({ name: 'linear-mode' })"
        >
          <Icon name="sliders-h" size="xs" />
          Linear
        </button>
      </div>

      <!-- Divider -->
      <div class="mx-1 h-5 w-px bg-border" />

      <button
        v-tooltip.bottom="{ value: 'Share', showDelay: 50 }"
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        @click="showShareDialog = true"
      >
        <Icon name="share-alt" size="sm" />
      </button>
    </div>

    <!-- Share Dialog -->
    <WorkflowEditorShareDialog
      v-model:visible="showShareDialog"
      :workflow-name="uiStore.activeWorkflowName"
    />
  </div>
</template>
