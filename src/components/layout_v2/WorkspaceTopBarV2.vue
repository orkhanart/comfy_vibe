<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import WorkflowEditorLogoMenu from '@/components/workflow-editor/WorkflowEditorLogoMenu.vue'
import ModeTabs from '@/components/workflow-editor/ModeTabs.vue'
import { useUiStore, type AdminTabType } from '@/stores/uiStore'

const router = useRouter()
const uiStore = useUiStore()
const showMenu = ref(false)

function handleLogoClick(): void {
  showMenu.value = !showMenu.value
}

function openAdminPage(type: AdminTabType): void {
  const tab = uiStore.openAdminTab(type)
  router.push(tab.route)
}

// Admin tab functions
function handleAdminTabClick(tabId: string): void {
  const tab = uiStore.adminTabs.find(t => t.id === tabId)
  if (tab) {
    uiStore.selectAdminTab(tabId)
    router.push(tab.route)
  }
}

function handleCloseAdminTab(tabId: string, event: MouseEvent): void {
  event.stopPropagation()
  const wasActive = uiStore.activeAdminTabId === tabId
  uiStore.closeAdminTab(tabId)

  if (wasActive && uiStore.adminTabs.length === 0) {
    router.push({ name: 'workspace-v2-dashboard' })
  } else if (wasActive && uiStore.activeAdminTab) {
    router.push(uiStore.activeAdminTab.route)
  }
}

function handleTabSelect(tabId: string): void {
  const mode = uiStore.getWorkflowMode(tabId)
  uiStore.selectWorkflowTab(tabId)
  if (mode === 'linear') {
    router.push({ name: 'linear-mode' })
  } else {
    router.push({ name: 'workflow-editor' })
  }
}

function handleNewWorkflow(): void {
  uiStore.createWorkflowTab('workflow')
  router.push({ name: 'workflow-editor' })
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

      <WorkflowEditorLogoMenu :show="showMenu" @close="showMenu = false" />
    </div>

    <!-- Divider -->
    <div class="mx-1 h-5 w-px bg-border" />

    <!-- Admin Tabs (Settings, Billing, etc.) -->
    <template v-if="uiStore.adminTabs.length > 0">
      <!-- Admin Tab Buttons -->
      <div class="flex items-center gap-0.5">
        <button
          v-for="tab in uiStore.adminTabs"
          :key="tab.id"
          class="group flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs transition-colors"
          :class="[
            tab.id === uiStore.activeAdminTabId
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          ]"
          @click="handleAdminTabClick(tab.id)"
        >
          <Icon :name="tab.icon" size="xs" class="shrink-0 opacity-60" />
          <span class="max-w-[120px] truncate">{{ tab.name }}</span>
          <span
            class="flex h-4 w-4 items-center justify-center rounded text-muted-foreground opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover:opacity-100"
            @click="handleCloseAdminTab(tab.id, $event)"
          >
            <Icon name="times" size="xs" />
          </span>
        </button>
      </div>

      <!-- Divider -->
      <div class="mx-1 h-5 w-px bg-border" />
    </template>

    <!-- Tabs Section -->
    <ModeTabs
      :tabs="uiStore.workflowTabs"
      :active-tab-id="''"
      @select="handleTabSelect"
      @close="uiStore.closeWorkflowTab"
      @new="handleNewWorkflow"
    />
  </div>
</template>
