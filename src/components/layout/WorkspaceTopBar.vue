<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import WorkflowEditorLogoMenu from '@/components/workflow-editor/WorkflowEditorLogoMenu.vue'
import ModeTabs from '@/components/workflow-editor/ModeTabs.vue'
import { useUiStore, type AdminTabType } from '@/stores/uiStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { getRoleLabel, getRoleBadgeColor } from '@/types/workspace'

const router = useRouter()
const route = useRoute()
const uiStore = useUiStore()
const workspaceStore = useWorkspaceStore()
const showMenu = ref(false)
const showWorkspaceSwitcher = ref(false)

const currentWorkspace = computed(() => workspaceStore.currentWorkspace)
const privateWorkspace = computed(() => workspaceStore.privateWorkspace)
const teamWorkspaces = computed(() => workspaceStore.teamWorkspaces)

// Create workspace state
const showCreateWorkspace = ref(false)
const newWorkspaceName = ref('')

// Reset states when dropdown closes
watch(showWorkspaceSwitcher, (isOpen) => {
  if (!isOpen) {
    showCreateWorkspace.value = false
    newWorkspaceName.value = ''
  }
})

function handleLogoClick(): void {
  showMenu.value = !showMenu.value
  showWorkspaceSwitcher.value = false
}

function handleWorkspaceClick(): void {
  showWorkspaceSwitcher.value = !showWorkspaceSwitcher.value
  showMenu.value = false
}

function closeDropdown(): void {
  showWorkspaceSwitcher.value = false
}

function selectWorkspace(workspaceId: string): void {
  workspaceStore.setCurrentWorkspace(workspaceId)
  showWorkspaceSwitcher.value = false
  router.push({ name: 'workspace-dashboard', params: { workspaceId } })
}

function goToWorkspaceSettings(workspaceId: string): void {
  showWorkspaceSwitcher.value = false
  workspaceStore.setCurrentWorkspace(workspaceId)
  openAdminPage('dashboard')
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

  // If closing active tab and no more admin tabs, go to workspace dashboard
  if (wasActive && uiStore.adminTabs.length === 0) {
    router.push({ name: 'workspace-dashboard' })
  } else if (wasActive && uiStore.activeAdminTab) {
    router.push(uiStore.activeAdminTab.route)
  }
}

function leaveWorkspace(workspaceId: string): void {
  if (confirm('Are you sure you want to leave this workspace?')) {
    workspaceStore.leaveWorkspace(workspaceId)
    showWorkspaceSwitcher.value = false
  }
}

function openCreateWorkspace(): void {
  showCreateWorkspace.value = true
  newWorkspaceName.value = ''
}

function createWorkspace(): void {
  if (newWorkspaceName.value.trim()) {
    const workspace = workspaceStore.createWorkspace({
      name: newWorkspaceName.value.trim(),
    })
    showCreateWorkspace.value = false
    newWorkspaceName.value = ''
    selectWorkspace(workspace.id)
  }
}

function cancelCreateWorkspace(): void {
  showCreateWorkspace.value = false
  newWorkspaceName.value = ''
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

    <!-- Workspace Switcher Button -->
    <div class="relative">
      <button
        class="flex h-8 items-center gap-1.5 rounded-md bg-accent px-2.5 text-accent-foreground transition-colors hover:bg-accent/80"
        @click="handleWorkspaceClick"
      >
        <!-- Workspace Avatar/Icon -->
        <div class="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded">
          <template v-if="currentWorkspace?.isPrivate">
            <Icon name="home" size="sm" />
          </template>
          <template v-else-if="currentWorkspace?.avatar">
            <img :src="currentWorkspace.avatar" :alt="currentWorkspace.name" class="h-full w-full object-cover" />
          </template>
          <template v-else>
            <Icon name="users" size="sm" />
          </template>
        </div>
        <!-- Workspace Name (truncated) -->
        <span class="max-w-[120px] truncate text-sm font-medium">{{ currentWorkspace?.name || 'Workspace' }}</span>
        <!-- Dropdown Icon -->
        <Icon name="chevron-down" size="xs" class="opacity-70" />
      </button>

      <!-- Workspace Switcher Dropdown -->
      <div
        v-if="showWorkspaceSwitcher"
        class="absolute left-0 top-full z-[200] mt-1 min-w-[280px] rounded-lg border border-border bg-popover p-1 shadow-xl"
      >
        <div class="px-3 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Workspaces</div>

        <!-- Create Workspace Form -->
        <div v-if="showCreateWorkspace" class="mx-1 mb-1 rounded-md bg-accent/50 p-2">
          <input
            v-model="newWorkspaceName"
            type="text"
            placeholder="Workspace name"
            class="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
            autofocus
            @keyup.enter="createWorkspace"
            @keyup.escape="cancelCreateWorkspace"
          />
          <div class="mt-2 flex justify-end gap-1.5">
            <button
              class="rounded px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              @click="cancelCreateWorkspace"
            >
              Cancel
            </button>
            <button
              class="rounded bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              :disabled="!newWorkspaceName.trim()"
              @click="createWorkspace"
            >
              Create
            </button>
          </div>
        </div>

        <template v-else>
          <!-- Private Workspace -->
          <button
            v-if="privateWorkspace"
            class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent"
            :class="currentWorkspace?.id === privateWorkspace.id ? 'bg-accent' : ''"
            @click="selectWorkspace(privateWorkspace.id)"
          >
            <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800">
              <Icon name="home" size="xs" class="text-muted-foreground" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[13px] font-medium text-foreground">{{ privateWorkspace.name }}</p>
            </div>
            <Icon v-if="currentWorkspace?.id === privateWorkspace.id" name="check" size="xs" class="shrink-0 text-primary" />
          </button>

          <!-- Team Workspaces -->
          <template v-if="teamWorkspaces.length > 0">
            <div
              v-for="workspace in teamWorkspaces"
              :key="workspace.id"
              class="flex w-full items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-accent"
              :class="currentWorkspace?.id === workspace.id ? 'bg-accent' : ''"
            >
              <!-- Clickable workspace area -->
              <button
                class="flex flex-1 items-center gap-2.5 text-left"
                @click="selectWorkspace(workspace.id)"
              >
                <div class="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
                  <img v-if="workspace.avatar" :src="workspace.avatar" :alt="workspace.name" class="h-full w-full object-cover" />
                  <Icon v-else name="users" size="xs" class="text-muted-foreground" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-[13px] font-medium text-foreground">{{ workspace.name }}</p>
                </div>
                <span :class="['shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium', getRoleBadgeColor(workspace.role)]">
                  {{ getRoleLabel(workspace.role) }}
                </span>
                <Icon v-if="currentWorkspace?.id === workspace.id" name="check" size="xs" class="shrink-0 text-primary" />
              </button>

              <!-- Settings icon for owners, Leave icon for members/viewers - only show when selected -->
              <template v-if="currentWorkspace?.id === workspace.id">
                <button
                  v-if="workspace.role === 'owner'"
                  v-tooltip.right="{ value: 'Workspace Settings', showDelay: 300 }"
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-zinc-200 hover:text-foreground dark:hover:bg-zinc-700"
                  @click.stop="goToWorkspaceSettings(workspace.id)"
                >
                  <Icon name="cog" size="xs" />
                </button>
                <button
                  v-else
                  v-tooltip.right="{ value: 'Leave Workspace', showDelay: 300 }"
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-zinc-200 hover:text-destructive dark:hover:bg-zinc-700"
                  @click.stop="leaveWorkspace(workspace.id)"
                >
                  <Icon name="sign-out" size="xs" />
                </button>
              </template>
            </div>
          </template>

          <!-- Create Workspace Button -->
          <div class="mx-2 my-1.5 h-px bg-border" />
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="openCreateWorkspace"
          >
            <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-dashed border-border">
              <Icon name="plus" size="xs" />
            </div>
            <span>Create Workspace</span>
          </button>
        </template>
      </div>

      <!-- Backdrop for workspace switcher -->
      <div v-if="showWorkspaceSwitcher" class="fixed inset-0 z-[199]" @click="closeDropdown" />
    </div>

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
