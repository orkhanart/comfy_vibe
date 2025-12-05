<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@/components/ui/icon'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { getRoleLabel, getRoleBadgeColor } from '@/types/workspace'

interface MenuItem {
  label: string
  icon: string
  route?: string
  badge?: number
}

interface Project {
  id: string
  label: string
  icon: string
  route: string
  subItems: MenuItem[]
}

const route = useRoute()
const router = useRouter()
const workspaceStore = useWorkspaceStore()

// Workspace switcher state
const showWorkspaceSwitcher = ref(false)
const showCreateWorkspace = ref(false)
const newWorkspaceName = ref('')

const currentWorkspace = computed(() => workspaceStore.currentWorkspace)
const privateWorkspace = computed(() => workspaceStore.privateWorkspace)
const teamWorkspaces = computed(() => workspaceStore.teamWorkspaces)

// Reset states when dropdown closes
watch(showWorkspaceSwitcher, (isOpen) => {
  if (!isOpen) {
    showCreateWorkspace.value = false
    newWorkspaceName.value = ''
  }
})

// Overview section
const overviewItems: MenuItem[] = [
  { label: 'Recents', icon: 'clock', route: '/workspace_v2' },
  { label: 'Templates', icon: 'th-large', route: '/workspace_v2/templates' },
  { label: 'Tutorials', icon: 'book', route: '/workspace_v2/tutorials' },
]

// Private projects (with expandable subfolders)
const privateProjects = ref<Project[]>([
  {
    id: 'private-1',
    label: 'My First Project',
    icon: 'folder',
    route: '/workspace_v2/projects/private-1',
    subItems: [
      { label: 'Assets', icon: 'images', route: '/workspace_v2/projects/private-1/assets' },
      { label: 'Workflows', icon: 'sitemap', route: '/workspace_v2/projects/private-1/workflows' },
      { label: 'Models', icon: 'box', route: '/workspace_v2/projects/private-1/models' },
    ]
  },
  {
    id: 'private-2',
    label: 'Personal Work',
    icon: 'folder',
    route: '/workspace_v2/projects/private-2',
    subItems: [
      { label: 'Assets', icon: 'images', route: '/workspace_v2/projects/private-2/assets' },
      { label: 'Workflows', icon: 'sitemap', route: '/workspace_v2/projects/private-2/workflows' },
      { label: 'Models', icon: 'box', route: '/workspace_v2/projects/private-2/models' },
    ]
  },
])

// Team workspace projects (mock data)
const teamProjects = ref<Project[]>([
  {
    id: '1',
    label: 'Product Shots',
    icon: 'folder',
    route: '/workspace_v2/projects/1',
    subItems: [
      { label: 'Assets', icon: 'images', route: '/workspace_v2/projects/1/assets' },
      { label: 'Workflows', icon: 'sitemap', route: '/workspace_v2/projects/1/workflows' },
      { label: 'Models', icon: 'box', route: '/workspace_v2/projects/1/models' },
    ]
  },
  {
    id: '2',
    label: 'Brand Assets',
    icon: 'folder',
    route: '/workspace_v2/projects/2',
    subItems: [
      { label: 'Assets', icon: 'images', route: '/workspace_v2/projects/2/assets' },
      { label: 'Workflows', icon: 'sitemap', route: '/workspace_v2/projects/2/workflows' },
      { label: 'Models', icon: 'box', route: '/workspace_v2/projects/2/models' },
    ]
  },
  {
    id: '3',
    label: 'Marketing Campaign',
    icon: 'folder',
    route: '/workspace_v2/projects/3',
    subItems: [
      { label: 'Assets', icon: 'images', route: '/workspace_v2/projects/3/assets' },
      { label: 'Workflows', icon: 'sitemap', route: '/workspace_v2/projects/3/workflows' },
      { label: 'Models', icon: 'box', route: '/workspace_v2/projects/3/models' },
    ]
  },
])

// Track expanded projects
const expandedProjects = ref<Set<string>>(new Set())

function toggleProject(projectId: string): void {
  if (expandedProjects.value.has(projectId)) {
    expandedProjects.value.delete(projectId)
  } else {
    expandedProjects.value.add(projectId)
  }
}

function isProjectExpanded(projectId: string): boolean {
  return expandedProjects.value.has(projectId)
}

// Shared with me items (mock data)
const sharedItems: MenuItem[] = [
  { label: 'Client Project', icon: 'folder', route: '/workspace_v2/projects/shared-1' },
  { label: 'Portrait Workflow', icon: 'sitemap', route: '/workspace_v2/workflows/shared-1' },
  { label: 'Custom LoRA', icon: 'box', route: '/workspace_v2/models/shared-1' },
  { label: 'Reference Images', icon: 'images', route: '/workspace_v2/assets/shared-1' },
]

const trashItem: MenuItem = {
  label: 'Trash',
  icon: 'trash',
  route: '/workspace_v2/trash'
}

const helpItem: MenuItem = {
  label: 'Help',
  icon: 'question-circle',
  route: '#'
}

function isActive(itemRoute?: string): boolean {
  if (!itemRoute) return false
  if (itemRoute === '/workspace_v2') {
    return route.path === itemRoute
  }
  return route.path.startsWith(itemRoute)
}

function toggleWorkspaceSwitcher(): void {
  showWorkspaceSwitcher.value = !showWorkspaceSwitcher.value
}

function selectWorkspace(workspaceId: string): void {
  workspaceStore.setCurrentWorkspace(workspaceId)
  showWorkspaceSwitcher.value = false
}

function goToWorkspaceSettings(workspaceId: string): void {
  showWorkspaceSwitcher.value = false
  workspaceStore.setCurrentWorkspace(workspaceId)
  router.push({ name: 'workspace-manage-dashboard' })
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
</script>

<template>
  <aside
    class="flex h-full w-[220px] flex-col border-r border-zinc-200 bg-zinc-50/50 dark:border-border dark:bg-background"
  >
    <!-- Workspace Switcher at Top -->
    <div class="px-2 pt-2 pb-2">
      <div class="relative">
        <button
          class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent"
          @click="toggleWorkspaceSwitcher"
        >
          <!-- Workspace Avatar/Icon -->
          <div class="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-200 dark:bg-zinc-700">
            <template v-if="currentWorkspace?.isPrivate">
              <Icon name="home" size="sm" class="text-muted-foreground" />
            </template>
            <template v-else-if="currentWorkspace?.avatar">
              <img :src="currentWorkspace.avatar" :alt="currentWorkspace.name" class="h-full w-full object-cover" />
            </template>
            <template v-else>
              <Icon name="users" size="sm" class="text-muted-foreground" />
            </template>
          </div>
          <!-- Workspace Name -->
          <span class="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{{ currentWorkspace?.name || 'Workspace' }}</span>
          <!-- Dropdown Icon -->
          <Icon
            name="chevron-down"
            size="xs"
            class="shrink-0 text-muted-foreground transition-transform"
            :class="showWorkspaceSwitcher ? 'rotate-180' : ''"
          />
        </button>

        <!-- Workspace Switcher Dropdown -->
        <div
          v-if="showWorkspaceSwitcher"
          class="absolute left-0 right-0 top-full z-[200] mt-1 rounded-md border border-border bg-popover py-1 shadow-lg"
        >
          <!-- Create Workspace Form -->
          <div v-if="showCreateWorkspace" class="px-2 py-1">
            <input
              v-model="newWorkspaceName"
              type="text"
              placeholder="Workspace name"
              class="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground outline-none transition-colors focus:border-primary"
              autofocus
              @keyup.enter="createWorkspace"
              @keyup.escape="cancelCreateWorkspace"
            />
            <div class="mt-1.5 flex justify-end gap-1">
              <button
                class="rounded px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                @click="cancelCreateWorkspace"
              >
                Cancel
              </button>
              <button
                class="rounded bg-primary px-2 py-0.5 text-[11px] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
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
              class="flex w-full items-center gap-2 px-2 py-1 text-left transition-colors hover:bg-accent"
              :class="currentWorkspace?.id === privateWorkspace.id ? 'bg-accent/50' : ''"
              @click="selectWorkspace(privateWorkspace.id)"
            >
              <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-200 dark:bg-zinc-700">
                <Icon name="home" size="xs" class="text-muted-foreground" />
              </div>
              <span class="flex-1 truncate text-xs text-foreground">{{ privateWorkspace.name }}</span>
              <Icon v-if="currentWorkspace?.id === privateWorkspace.id" name="check" size="xs" class="shrink-0 text-primary" />
            </button>

            <!-- Team Workspaces -->
            <button
              v-for="workspace in teamWorkspaces"
              :key="workspace.id"
              class="flex w-full items-center gap-2 px-2 py-1 text-left transition-colors hover:bg-accent"
              :class="currentWorkspace?.id === workspace.id ? 'bg-accent/50' : ''"
              @click="selectWorkspace(workspace.id)"
            >
              <div class="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-200 dark:bg-zinc-700">
                <img v-if="workspace.avatar" :src="workspace.avatar" :alt="workspace.name" class="h-full w-full object-cover" />
                <Icon v-else name="users" size="xs" class="text-muted-foreground" />
              </div>
              <span class="flex-1 truncate text-xs text-foreground">{{ workspace.name }}</span>
              <Icon v-if="currentWorkspace?.id === workspace.id" name="check" size="xs" class="shrink-0 text-primary" />
            </button>

            <!-- Divider & Actions -->
            <div class="mx-2 my-1 h-px bg-border" />
            <button
              class="flex w-full items-center gap-2 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              @click="openCreateWorkspace"
            >
              <Icon name="plus" size="xs" />
              <span>New workspace</span>
            </button>
            <button
              v-if="currentWorkspace && !currentWorkspace.isPrivate"
              class="flex w-full items-center gap-2 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              @click="goToWorkspaceSettings(currentWorkspace.id)"
            >
              <Icon name="cog" size="xs" />
              <span>Workspace settings</span>
            </button>
          </template>
        </div>

        <!-- Backdrop -->
        <div v-if="showWorkspaceSwitcher" class="fixed inset-0 z-[199]" @click="showWorkspaceSwitcher = false" />
      </div>
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 overflow-y-auto px-2 py-2">
      <!-- Overview Section -->
      <div class="mb-3">
        <div class="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Overview
        </div>
        <ul class="flex flex-col gap-0.5">
          <li v-for="item in overviewItems" :key="item.label">
            <RouterLink
              :to="item.route ?? '#'"
              :class="[
                'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 transition-colors',
                isActive(item.route)
                  ? 'bg-button-active-surface font-medium text-button-active-foreground'
                  : 'text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
              ]"
            >
              <Icon :name="item.icon" size="md" />
              <span class="flex-1 text-sm">{{ item.label }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Private Section -->
      <div class="mb-3">
        <div class="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Private
        </div>
        <ul class="flex flex-col gap-0.5">
          <li v-for="project in privateProjects" :key="project.id">
            <!-- Project Header with Toggle -->
            <button
              :class="[
                'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 transition-colors',
                isActive(project.route)
                  ? 'bg-button-active-surface font-medium text-button-active-foreground'
                  : 'text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
              ]"
              @click="toggleProject(project.id)"
            >
              <Icon :name="project.icon" size="md" />
              <span class="flex-1 text-left text-sm">{{ project.label }}</span>
              <Icon
                name="chevron-right"
                size="xs"
                class="shrink-0 transition-transform"
                :class="isProjectExpanded(project.id) ? 'rotate-90' : ''"
              />
            </button>
            <!-- Sub Items (Tree) -->
            <ul
              v-if="isProjectExpanded(project.id)"
              class="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-2"
            >
              <li v-for="subItem in project.subItems" :key="subItem.label">
                <RouterLink
                  :to="subItem.route ?? '#'"
                  :class="[
                    'flex items-center gap-2 rounded-md px-2 py-1 transition-colors',
                    isActive(subItem.route)
                      ? 'bg-button-active-surface font-medium text-button-active-foreground'
                      : 'text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
                  ]"
                >
                  <Icon :name="subItem.icon" size="sm" />
                  <span class="text-xs">{{ subItem.label }}</span>
                </RouterLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- Workspace (Team) Section - Only show for team workspaces -->
      <div v-if="!currentWorkspace?.isPrivate" class="mb-3">
        <div class="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </div>
        <ul class="flex flex-col gap-0.5">
          <li v-for="project in teamProjects" :key="project.id">
            <!-- Project Header with Toggle -->
            <button
              :class="[
                'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 transition-colors',
                isActive(project.route)
                  ? 'bg-button-active-surface font-medium text-button-active-foreground'
                  : 'text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
              ]"
              @click="toggleProject(project.id)"
            >
              <Icon :name="project.icon" size="md" />
              <span class="flex-1 text-left text-sm">{{ project.label }}</span>
              <Icon
                name="chevron-right"
                size="xs"
                class="shrink-0 transition-transform"
                :class="isProjectExpanded(project.id) ? 'rotate-90' : ''"
              />
            </button>
            <!-- Sub Items (Tree) -->
            <ul
              v-if="isProjectExpanded(project.id)"
              class="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-2"
            >
              <li v-for="subItem in project.subItems" :key="subItem.label">
                <RouterLink
                  :to="subItem.route ?? '#'"
                  :class="[
                    'flex items-center gap-2 rounded-md px-2 py-1 transition-colors',
                    isActive(subItem.route)
                      ? 'bg-button-active-surface font-medium text-button-active-foreground'
                      : 'text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
                  ]"
                >
                  <Icon :name="subItem.icon" size="sm" />
                  <span class="text-xs">{{ subItem.label }}</span>
                </RouterLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- Shared Section -->
      <div class="mb-3">
        <div class="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Shared
        </div>
        <ul class="flex flex-col gap-0.5">
          <li v-for="item in sharedItems" :key="item.label">
            <RouterLink
              :to="item.route ?? '#'"
              :class="[
                'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 transition-colors',
                isActive(item.route)
                  ? 'bg-button-active-surface font-medium text-button-active-foreground'
                  : 'text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
              ]"
            >
              <Icon :name="item.icon" size="md" />
              <span class="flex-1 text-sm">{{ item.label }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Bottom Section: Trash & Help -->
    <div class="flex flex-col gap-0.5 px-2 py-2">
      <RouterLink
        :to="trashItem.route ?? '#'"
        :class="[
          'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 transition-colors',
          isActive(trashItem.route)
            ? 'bg-button-active-surface font-medium text-button-active-foreground'
            : 'text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
        ]"
      >
        <Icon :name="trashItem.icon" size="md" />
        <span class="text-sm">{{ trashItem.label }}</span>
      </RouterLink>
      <RouterLink
        :to="helpItem.route ?? '#'"
        :class="[
          'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 transition-colors',
          isActive(helpItem.route)
            ? 'bg-button-active-surface font-medium text-button-active-foreground'
            : 'text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
        ]"
      >
        <Icon :name="helpItem.icon" size="md" />
        <span class="text-sm">{{ helpItem.label }}</span>
      </RouterLink>
    </div>
  </aside>
</template>
