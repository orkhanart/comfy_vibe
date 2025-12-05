<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore, type AdminTabType } from '@/stores/uiStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { getRoleLabel, getRoleBadgeColor } from '@/types/workspace'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const uiStore = useUiStore()
const workspaceStore = useWorkspaceStore()

const showAccountMenu = ref(false)
const showCreateWorkspace = ref(false)
const newWorkspaceName = ref('')

// Reset states when menu closes
watch(() => props.show, (isOpen) => {
  if (!isOpen) {
    showAccountMenu.value = false
    showCreateWorkspace.value = false
    newWorkspaceName.value = ''
  }
})

// Computed
const currentWorkspace = computed(() => workspaceStore.currentWorkspace)
const privateWorkspace = computed(() => workspaceStore.privateWorkspace)
const teamWorkspaces = computed(() => workspaceStore.teamWorkspaces)

function selectWorkspace(workspaceId: string): void {
  workspaceStore.setCurrentWorkspace(workspaceId)
  emit('close')
  router.push({ name: 'workspace-dashboard', params: { workspaceId } })
}

function goToPrivateWorkspaceSettings(): void {
  emit('close')
  openAdminPage('dashboard')
}

function goToTeamWorkspaceSettings(workspaceId: string): void {
  emit('close')
  workspaceStore.setCurrentWorkspace(workspaceId)
  openAdminPage('dashboard')
}

function leaveWorkspace(workspaceId: string): void {
  if (confirm('Are you sure you want to leave this workspace?')) {
    workspaceStore.leaveWorkspace(workspaceId)
    emit('close')
  }
}

function goToWorkspace(): void {
  emit('close')
  router.push({ name: 'workspace-dashboard', params: { workspaceId: workspaceStore.currentWorkspaceId } })
}

function goToSettings(): void {
  emit('close')
  openAdminPage('settings')
}

function openAdminPage(type: AdminTabType): void {
  const tab = uiStore.openAdminTab(type)
  router.push(tab.route)
}

function signOut(): void {
  emit('close')
  router.push('/')
}

function toggleTheme(): void {
  uiStore.toggleTheme()
}

function toggleAccountMenu(): void {
  showAccountMenu.value = !showAccountMenu.value
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
</script>

<template>
  <div v-if="show" class="absolute left-0 top-full z-[200] mt-1 min-w-[280px] rounded-lg border border-border bg-popover p-1 shadow-xl">
    <!-- File Section -->
    <div class="px-3 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">File</div>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent">
      <Icon name="file" size="sm" class="w-4 text-muted-foreground" />
      <span class="flex-1">New Workflow</span>
      <span class="text-[11px] text-muted-foreground">Ctrl+N</span>
    </button>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent">
      <Icon name="folder-open" size="sm" class="w-4 text-muted-foreground" />
      <span class="flex-1">Open...</span>
      <span class="text-[11px] text-muted-foreground">Ctrl+O</span>
    </button>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent">
      <Icon name="save" size="sm" class="w-4 text-muted-foreground" />
      <span class="flex-1">Save</span>
      <span class="text-[11px] text-muted-foreground">Ctrl+S</span>
    </button>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent">
      <Icon name="download" size="sm" class="w-4 text-muted-foreground" />
      <span>Export...</span>
    </button>

    <div class="mx-2 my-1 h-px bg-border" />

    <!-- Workspaces Section -->
    <div class="px-3 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Workspaces</div>

    <!-- Create Workspace Form (inline) -->
    <div v-if="showCreateWorkspace" class="mx-1 mb-1 rounded-md bg-accent/50 p-2">
      <input
        v-model="newWorkspaceName"
        type="text"
        placeholder="Workspace name"
        class="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
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

    <!-- Workspace List -->
    <div v-else class="max-h-[200px] overflow-y-auto">
      <!-- Private Workspace -->
      <div
        v-if="privateWorkspace"
        class="flex w-full items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-accent"
        :class="currentWorkspace?.id === privateWorkspace.id ? 'bg-accent' : ''"
      >
        <button
          class="flex flex-1 items-center gap-2.5 text-left"
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
        <button
          v-if="currentWorkspace?.id === privateWorkspace.id"
          v-tooltip.right="{ value: 'Workspace Settings', showDelay: 300 }"
          class="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-zinc-200 hover:text-foreground dark:hover:bg-zinc-700"
          @click.stop="goToPrivateWorkspaceSettings"
        >
          <Icon name="cog" size="xs" />
        </button>
      </div>

      <!-- Team Workspaces -->
      <template v-if="teamWorkspaces.length > 0">
        <div
          v-for="workspace in teamWorkspaces"
          :key="workspace.id"
          class="flex w-full items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-accent"
          :class="currentWorkspace?.id === workspace.id ? 'bg-accent' : ''"
        >
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
              @click.stop="goToTeamWorkspaceSettings(workspace.id)"
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
      <button
        class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        @click="openCreateWorkspace"
      >
        <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-dashed border-border">
          <Icon name="plus" size="xs" />
        </div>
        <span>Create Workspace</span>
      </button>
    </div>

    <div class="mx-2 my-1 h-px bg-border" />

    <!-- Navigate Section -->
    <div class="px-3 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Navigate</div>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent" @click="goToWorkspace">
      <Icon name="th-large" size="sm" class="w-4 text-muted-foreground" />
      <span>Dashboard</span>
    </button>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent" @click="goToSettings">
      <Icon name="cog" size="sm" class="w-4 text-muted-foreground" />
      <span>Settings</span>
    </button>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent" @click="toggleTheme">
      <Icon :name="uiStore.themeMode === 'dark' ? 'moon' : 'sun'" size="sm" class="w-4 text-muted-foreground" />
      <span class="flex-1">{{ uiStore.themeMode === 'dark' ? 'Dark Mode' : 'Light Mode' }}</span>
      <div
        class="h-5 w-9 rounded-full p-0.5 transition-colors"
        :class="uiStore.themeMode === 'dark' ? 'bg-primary' : 'bg-muted'"
      >
        <div
          class="h-4 w-4 rounded-full bg-white shadow-sm transition-transform"
          :class="uiStore.themeMode === 'dark' ? 'translate-x-4' : 'translate-x-0'"
        />
      </div>
    </button>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent" @click="uiStore.toggleQuickstart()">
      <Icon name="th-large" size="sm" class="w-4 text-muted-foreground" />
      <span class="flex-1">Show Quickstart</span>
      <div
        class="h-5 w-9 rounded-full p-0.5 transition-colors"
        :class="uiStore.showQuickstart ? 'bg-primary' : 'bg-muted'"
      >
        <div
          class="h-4 w-4 rounded-full bg-white shadow-sm transition-transform"
          :class="uiStore.showQuickstart ? 'translate-x-4' : 'translate-x-0'"
        />
      </div>
    </button>

    <div class="mx-2 my-1 h-px bg-border" />

    <!-- User Profile (at bottom) -->
    <div class="relative">
      <button
        class="flex w-full items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent"
        @click="toggleAccountMenu"
      >
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon name="user" size="sm" />
        </div>
        <div class="flex-1 min-w-0 text-left">
          <p class="truncate text-sm font-medium text-foreground">John Doe</p>
          <p class="truncate text-xs text-muted-foreground">john@example.com</p>
        </div>
        <Icon
          name="chevron-up"
          size="xs"
          class="text-muted-foreground transition-transform"
          :class="showAccountMenu ? 'rotate-180' : ''"
        />
      </button>

      <!-- Account Submenu -->
      <div v-if="showAccountMenu" class="mt-1 rounded-md bg-accent/50 p-1">
        <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent">
          <Icon name="user-cog" size="sm" class="w-4 text-muted-foreground" />
          <span>Account Settings</span>
        </button>
        <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent">
          <Icon name="exchange-alt" size="sm" class="w-4 text-muted-foreground" />
          <span>Switch Account</span>
        </button>
        <div class="mx-2 my-1 h-px bg-border" />
        <button
          class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-destructive transition-colors hover:bg-destructive/10"
          @click="signOut"
        >
          <Icon name="sign-out" size="sm" class="w-4 text-destructive" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Backdrop -->
  <div v-if="show" class="fixed inset-0 z-[199]" @click="emit('close')" />
</template>
