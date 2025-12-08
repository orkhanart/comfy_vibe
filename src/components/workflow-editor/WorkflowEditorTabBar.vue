<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import WorkflowEditorLogoMenu from './WorkflowEditorLogoMenu.vue'
import { ShareDialog } from '@/components/common'
import { useUiStore, type AdminTabType, ADMIN_TAB_CONFIG } from '@/stores/uiStore'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const router = useRouter()
const route = useRoute()
const uiStore = useUiStore()
const showShareDialog = ref(false)
const shareWorkflowId = ref<string | null>(null)
const showMenu = ref(false)
const showWorkflowsDropdown = ref(false)
const activeContextMenu = ref<string | null>(null)

// Computed properties for share dialog
const shareDialogWorkflowId = computed(() => shareWorkflowId.value || uiStore.activeWorkflowTabId)
const shareDialogWorkflowName = computed(() => {
  if (shareWorkflowId.value) {
    return workflows.value.find(w => w.id === shareWorkflowId.value)?.name || 'Workflow'
  }
  return uiStore.activeWorkflowName
})

// Mock data for workflows
const workflows = ref([
  { id: 'workflow-1', name: 'Main Workflow' },
  { id: 'workflow-2', name: 'Upscale Pipeline' },
  { id: 'workflow-3', name: 'ControlNet Test' },
  { id: 'workflow-4', name: 'Inpainting Flow' },
])

const selectedWorkflow = ref('workflow-1')

// Open workflow tabs (demo)
const openWorkflowTabs = ref([
  { id: 'workflow-1', name: 'Main Workflow' },
  { id: 'workflow-2', name: 'Upscale Pipeline' },
  { id: 'workflow-3', name: 'ControlNet Test' },
])

const selectedWorkflowName = computed(() => {
  return workflows.value.find(w => w.id === selectedWorkflow.value)?.name || 'Select workflow'
})

const isInsideSubgraph = computed(() => !!uiStore.activeSubgraphId)

// Subgraph context menu state
const showSubgraphContextMenu = ref(false)

// Workflow tab dropdown state
const showWorkflowTabDropdown = ref(false)

function handleLogoClick(): void {
  showMenu.value = !showMenu.value
}

function handleHomeClick(): void {
  router.push({ name: 'workspace-dashboard', params: { workspaceId: 'default' } })
}

function handleWorkflowSelect(workflowId: string): void {
  selectedWorkflow.value = workflowId
  showWorkflowsDropdown.value = false
  showWorkflowTabDropdown.value = false
  uiStore.selectWorkflowTab(workflowId)
  // Exit any subgraph when switching workflows
  if (uiStore.activeSubgraphId) {
    uiStore.selectSubgraph('')
  }
  console.log('Selected workflow:', workflowId)
}

function handleCreateWorkflow(): void {
  uiStore.createWorkflowTab('workflow')
  showWorkflowsDropdown.value = false
}

function handleImportWorkflow(): void {
  // TODO: Implement import workflow dialog
  console.log('Import workflow')
  showWorkflowsDropdown.value = false
}

function handleCloseWorkflowTab(workflowId: string, event: MouseEvent): void {
  event.stopPropagation()
  const index = openWorkflowTabs.value.findIndex(w => w.id === workflowId)
  if (index > -1) {
    openWorkflowTabs.value.splice(index, 1)
    // If closing active tab, select another one
    if (selectedWorkflow.value === workflowId && openWorkflowTabs.value.length > 0) {
      selectedWorkflow.value = openWorkflowTabs.value[0].id
    }
  }
}

function toggleContextMenu(itemId: string, event: MouseEvent): void {
  event.stopPropagation()
  activeContextMenu.value = activeContextMenu.value === itemId ? null : itemId
}

function handleContextAction(action: string, itemId: string, itemType: 'project' | 'workflow' | 'subgraph'): void {
  console.log(`Action: ${action} on ${itemType} ${itemId}`)
  activeContextMenu.value = null

  switch (action) {
    case 'rename':
      // TODO: Implement rename
      break
    case 'duplicate':
      if (itemType === 'subgraph') {
        uiStore.duplicateSubgraph(itemId)
      }
      break
    case 'delete':
      if (itemType === 'subgraph') {
        uiStore.deleteSubgraph(itemId)
      }
      break
    case 'move':
      // TODO: Implement move
      break
    case 'share':
      shareWorkflowId.value = itemId
      showShareDialog.value = true
      break
  }
}

function handleExitSubgraph(): void {
  uiStore.selectSubgraph('')
  console.log('Exiting subgraph, back to main workflow')
}

// Navigate to a specific subgraph in the path (clicking on parent breadcrumb)
function handleNavigateToSubgraph(subgraphId: string): void {
  uiStore.selectSubgraph(subgraphId)
  console.log('Navigating to subgraph:', subgraphId)
}

// Subgraph context menu actions
function handleSubgraphAction(action: string): void {
  showSubgraphContextMenu.value = false
  console.log('Subgraph action:', action, 'on', uiStore.activeSubgraphId)

  switch (action) {
    case 'rename':
      // TODO: Open rename dialog
      break
    case 'duplicate':
      if (uiStore.activeSubgraphId) {
        uiStore.duplicateSubgraph(uiStore.activeSubgraphId)
      }
      break
    case 'save':
      // TODO: Save subgraph
      break
    case 'save-as':
      // TODO: Save subgraph as
      break
    case 'ungroup':
      // TODO: Ungroup subgraph back to parent
      break
    case 'delete':
      if (uiStore.activeSubgraphId) {
        uiStore.deleteSubgraph(uiStore.activeSubgraphId)
        handleExitSubgraph()
      }
      break
  }
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

  // If closing active tab and no more admin tabs, go back to workflow
  if (wasActive && uiStore.adminTabs.length === 0) {
    // Stay on current workflow view
  } else if (wasActive && uiStore.activeAdminTab) {
    // Navigate to the new active admin tab
    router.push(uiStore.activeAdminTab.route)
  }
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

    <!-- Admin Tabs (Settings, Billing, etc.) -->
    <template v-if="uiStore.adminTabs.length > 0">
      <!-- Divider -->
      <div class="mx-1 h-5 w-px bg-border" />

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
    </template>

    <!-- Divider -->
    <div class="mx-1 h-5 w-px bg-border" />

    <!-- All Workflow Tabs -->
    <template v-for="tab in openWorkflowTabs" :key="tab.id">
      <!-- Active Tab -->
      <div
        v-if="tab.id === selectedWorkflow"
        class="flex items-center rounded-md bg-accent"
      >
        <!-- Workflow name with dropdown -->
        <Popover v-model:open="showWorkflowTabDropdown">
          <PopoverTrigger as-child>
            <div
              class="group flex h-7 items-center gap-1 pl-2 pr-1.5 text-xs font-medium text-accent-foreground transition-colors cursor-pointer"
              :class="[isInsideSubgraph ? '' : 'rounded-md']"
            >
              <span class="max-w-[100px] truncate">{{ tab.name }}</span>
              <Icon name="chevron-down" size="xs" class="opacity-50" />
            </div>
          </PopoverTrigger>
          <PopoverContent align="start" :side-offset="4" class="w-[220px] p-1">
            <div class="flex flex-col">
              <!-- Workflow List -->
              <div
                v-for="workflow in workflows"
                :key="workflow.id"
                class="group flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent cursor-pointer"
                :class="{ 'bg-accent/50': workflow.id === selectedWorkflow }"
                @click="handleWorkflowSelect(workflow.id)"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <Icon name="sitemap" size="sm" class="shrink-0 opacity-60" />
                  <span class="truncate">{{ workflow.name }}</span>
                </div>
                <Icon v-if="workflow.id === selectedWorkflow" name="check" size="xs" class="shrink-0 text-primary" />
              </div>

              <!-- Divider -->
              <div class="my-1 h-px bg-border" />

              <!-- Action Buttons Row -->
              <div class="flex items-center gap-1">
                <button
                  class="flex flex-1 items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted/80"
                  @click="handleCreateWorkflow"
                >
                  <Icon name="plus" size="xs" />
                  <span>New Workflow</span>
                </button>
                <button
                  v-tooltip.bottom="{ value: 'Import workflow', showDelay: 50 }"
                  class="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  @click="handleImportWorkflow"
                >
                  <Icon name="upload" size="sm" />
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <!-- Close button (only when not inside subgraph) -->
        <span
          v-if="!isInsideSubgraph"
          class="flex h-4 w-4 items-center justify-center rounded text-accent-foreground/50 hover:bg-background/50 hover:text-accent-foreground cursor-pointer mr-1.5"
          @click.stop="handleCloseWorkflowTab(tab.id, $event)"
        >
          <Icon name="times" size="xs" />
        </span>

        <!-- Subgraph breadcrumbs (shown when inside any subgraph) -->
        <template v-if="isInsideSubgraph">
          <template v-for="(subgraph, index) in uiStore.subgraphPath" :key="subgraph.id">
            <Icon name="chevron-right" size="xs" class="text-accent-foreground/40" />

            <!-- Parent subgraphs (clickable to navigate) -->
            <div
              v-if="index < uiStore.subgraphPath.length - 1"
              class="flex h-7 items-center gap-1.5 pl-0.5 pr-1.5 text-xs font-medium text-accent-foreground hover:bg-background/20 cursor-pointer transition-colors"
              @click="handleNavigateToSubgraph(subgraph.id)"
            >
              <div
                class="h-2.5 w-2.5 rounded-sm shrink-0"
                :style="{ backgroundColor: subgraph.color || '#78909C' }"
              />
              <span class="max-w-[80px] truncate">{{ subgraph.name }}</span>
            </div>

            <!-- Active (deepest) subgraph with 3-dot menu -->
            <div
              v-else
              class="flex h-7 items-center gap-1 rounded-r-md pl-0.5 pr-1 text-xs font-medium text-accent-foreground"
            >
              <!-- 3-dot Menu Button for active subgraph -->
              <Popover v-model:open="showSubgraphContextMenu">
                <PopoverTrigger as-child>
                  <button
                    class="flex h-5 w-5 items-center justify-center rounded text-accent-foreground/60 transition-colors hover:bg-background/30"
                    @click.stop
                  >
                    <Icon name="ellipsis-v" size="xs" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" :side-offset="4" class="w-[160px] p-1">
                  <button
                    class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                    @click="handleSubgraphAction('rename')"
                  >
                    <Icon name="edit" size="xs" class="opacity-60" />
                    Rename
                  </button>
                  <button
                    class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                    @click="handleSubgraphAction('duplicate')"
                  >
                    <Icon name="copy" size="xs" class="opacity-60" />
                    Duplicate
                  </button>
                  <div class="my-1 h-px bg-border" />
                  <button
                    class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                    @click="handleSubgraphAction('save')"
                  >
                    <Icon name="save" size="xs" class="opacity-60" />
                    Save
                  </button>
                  <button
                    class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                    @click="handleSubgraphAction('save-as')"
                  >
                    <Icon name="save" size="xs" class="opacity-60" />
                    Save As
                  </button>
                  <div class="my-1 h-px bg-border" />
                  <button
                    class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                    @click="handleSubgraphAction('ungroup')"
                  >
                    <Icon name="object-ungroup" size="xs" class="opacity-60" />
                    Ungroup
                  </button>
                  <button
                    class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    @click="handleSubgraphAction('delete')"
                  >
                    <Icon name="trash" size="xs" class="opacity-60" />
                    Delete Subgraph
                  </button>
                </PopoverContent>
              </Popover>

              <div
                class="h-2.5 w-2.5 rounded-sm shrink-0"
                :style="{ backgroundColor: subgraph.color || '#78909C' }"
              />
              <span class="max-w-[80px] truncate">{{ subgraph.name }}</span>
              <span
                class="flex h-4 w-4 items-center justify-center rounded text-accent-foreground/50 hover:bg-background/50 hover:text-accent-foreground cursor-pointer"
                @click.stop="handleExitSubgraph"
              >
                <Icon name="times" size="xs" />
              </span>
            </div>
          </template>
        </template>
      </div>

      <!-- Inactive Tabs -->
      <button
        v-else
        class="group flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground ml-0.5"
        @click="handleWorkflowSelect(tab.id)"
      >
        <span class="max-w-[100px] truncate">{{ tab.name }}</span>
        <span
          class="flex h-4 w-4 items-center justify-center rounded text-muted-foreground opacity-0 transition-all hover:bg-background/50 hover:text-foreground group-hover:opacity-100"
          @click.stop="handleCloseWorkflowTab(tab.id, $event)"
        >
          <Icon name="times" size="xs" />
        </span>
      </button>
    </template>

    <!-- Add Workflow Dropdown -->
    <Popover v-model:open="showWorkflowsDropdown">
      <PopoverTrigger as-child>
        <button
          v-tooltip.bottom="{ value: 'Open workflow', showDelay: 50 }"
          class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground ml-0.5"
        >
          <Icon name="plus" size="xs" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" :side-offset="4" class="w-[220px] p-1">
        <div class="flex flex-col">
          <!-- Workflow List -->
          <div
            v-for="workflow in workflows"
            :key="workflow.id"
            class="group flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent cursor-pointer"
            :class="{ 'bg-accent/50': workflow.id === selectedWorkflow }"
            @click="handleWorkflowSelect(workflow.id)"
          >
            <div class="flex items-center gap-2 min-w-0">
              <Icon name="sitemap" size="sm" class="shrink-0 opacity-60" />
              <span class="truncate">{{ workflow.name }}</span>
            </div>
            <Popover>
              <PopoverTrigger as-child>
                <button
                  class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground/50 transition-colors hover:bg-accent-foreground/10 hover:text-foreground"
                  @click.stop
                >
                  <Icon name="ellipsis-v" size="sm" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" side="right" :side-offset="4" class="w-[140px] p-1">
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                  @click="handleContextAction('rename', workflow.id, 'workflow')"
                >
                  <Icon name="edit" size="xs" class="opacity-60" />
                  Rename
                </button>
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                  @click="handleContextAction('duplicate', workflow.id, 'workflow')"
                >
                  <Icon name="copy" size="xs" class="opacity-60" />
                  Duplicate
                </button>
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                  @click="handleContextAction('move', workflow.id, 'workflow')"
                >
                  <Icon name="folder" size="xs" class="opacity-60" />
                  Move
                </button>
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                  @click="handleContextAction('share', workflow.id, 'workflow')"
                >
                  <Icon name="share-alt" size="xs" class="opacity-60" />
                  Share
                </button>
                <div class="my-1 h-px bg-border" />
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  @click="handleContextAction('delete', workflow.id, 'workflow')"
                >
                  <Icon name="trash" size="xs" class="opacity-60" />
                  Delete
                </button>
              </PopoverContent>
            </Popover>
          </div>

          <!-- Action Buttons Row -->
          <div class="flex items-center gap-1 mt-1 pt-1 border-t border-border">
            <button
              class="flex flex-1 items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm text-accent-foreground transition-colors hover:bg-accent/80"
              @click="handleCreateWorkflow"
            >
              <Icon name="plus" size="xs" />
              <span>New Workflow</span>
            </button>
            <button
              v-tooltip.bottom="{ value: 'Import workflow', showDelay: 50 }"
              class="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              @click="handleImportWorkflow"
            >
              <Icon name="upload" size="sm" />
            </button>
          </div>
        </div>
      </PopoverContent>
      </Popover>

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
        @click="shareWorkflowId = null; showShareDialog = true"
      >
        <Icon name="share-alt" size="sm" />
      </button>
    </div>

    <!-- Share Dialog -->
    <ShareDialog
      v-model:open="showShareDialog"
      item-type="workflow"
      :item-name="shareDialogWorkflowName"
      :item-id="shareDialogWorkflowId"
    />
  </div>
</template>
