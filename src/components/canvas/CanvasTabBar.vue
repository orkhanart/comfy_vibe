<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CanvasLogoMenu from './CanvasLogoMenu.vue'
import CanvasTabs, { type CanvasTab } from './CanvasTabs.vue'
import CanvasShareDialog from './CanvasShareDialog.vue'
import { useUiStore } from '@/stores/uiStore'

const router = useRouter()
const uiStore = useUiStore()
const showShareDialog = ref(false)

const tabs = ref<CanvasTab[]>([
  { id: 'workflow-1', name: 'Main Workflow', isActive: true },
  { id: 'workflow-2', name: 'Upscale Pipeline', isActive: false, isDirty: true },
  { id: 'workflow-3', name: 'ControlNet Test', isActive: false },
])

const activeTabId = ref('workflow-1')
const showMenu = ref(false)

function handleLogoClick(): void {
  showMenu.value = !showMenu.value
}

function handleHomeClick(): void {
  router.push({ name: 'workspace-dashboard', params: { workspaceId: 'default' } })
}

function selectTab(tabId: string): void {
  activeTabId.value = tabId
  tabs.value = tabs.value.map(tab => ({
    ...tab,
    isActive: tab.id === tabId
  }))
}

function closeTab(tabId: string): void {
  const index = tabs.value.findIndex(t => t.id === tabId)
  if (index > -1) {
    tabs.value.splice(index, 1)
    if (tabId === activeTabId.value && tabs.value.length > 0) {
      const newIndex = Math.min(index, tabs.value.length - 1)
      selectTab(tabs.value[newIndex]!.id)
    }
  }
}

function createNewTab(): void {
  const newId = `workflow-${Date.now()}`
  tabs.value.push({
    id: newId,
    name: 'Untitled Workflow',
    isActive: false,
  })
  selectTab(newId)
}

const activeWorkflowName = computed(() => {
  return tabs.value.find(t => t.id === activeTabId.value)?.name || 'Workflow'
})
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

      <CanvasLogoMenu :show="showMenu" @close="showMenu = false" />
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
    <CanvasTabs
      :tabs="tabs"
      :active-tab-id="activeTabId"
      @select="selectTab"
      @close="closeTab"
      @new="createNewTab"
    />

    <!-- Right Section -->
    <div class="ml-auto flex items-center gap-1">
      <!-- Mode Toggle -->
      <div class="flex h-7 items-center rounded-md bg-muted p-0.5">
        <button
          class="flex h-6 items-center gap-1 rounded px-2 text-xs font-medium bg-background text-foreground shadow-sm"
        >
          <Icon name="sitemap" size="xs" />
          Node
        </button>
        <button
          class="flex h-6 items-center gap-1 rounded px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          @click="router.push({ name: 'linear' })"
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
    <CanvasShareDialog
      v-model:visible="showShareDialog"
      :workflow-name="activeWorkflowName"
    />
  </div>
</template>
