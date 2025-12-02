<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Icon } from '@/components/ui/icon'
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()

const accountMenuOpen = ref(false)
const logoMenuOpen = ref(false)

interface MenuItem {
  label: string
  icon: string
  route?: string
  badge?: number
}

interface MenuGroup {
  label: string
  items: MenuItem[]
}

interface Project {
  id: string
  name: string
  emoji: string
}

const projects = ref<Project[]>([
  { id: 'proj-1', name: 'Marketing Campaign', emoji: '📢' },
  { id: 'proj-2', name: 'Product Launch', emoji: '🚀' },
  { id: 'proj-3', name: 'Social Media', emoji: '📱' },
])

// Create project dialog state
const showCreateProject = ref(false)
const newProjectName = ref('')
const newProjectEmoji = ref('📁')

const projectEmojis = [
  '📁', '📂', '🚀', '💡', '🎨', '📢', '📱', '💻',
  '🎯', '⭐', '🔥', '💎', '🎬', '📸', '🎵', '✨'
]

function createProject() {
  showCreateProject.value = true
  newProjectName.value = ''
  newProjectEmoji.value = '📁'
}

function confirmCreateProject() {
  if (newProjectName.value.trim()) {
    projects.value.push({
      id: `proj-${Date.now()}`,
      name: newProjectName.value.trim(),
      emoji: newProjectEmoji.value
    })
    showCreateProject.value = false
  }
}

function cancelCreateProject() {
  showCreateProject.value = false
}

// Project context menu
const projectMenuOpen = ref<string | null>(null)

function openProjectMenu(projectId: string, event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  projectMenuOpen.value = projectMenuOpen.value === projectId ? null : projectId
}

function closeProjectMenu() {
  projectMenuOpen.value = null
}

function handleProjectAction(action: string, projectId: string) {
  console.log(`Action: ${action} on project: ${projectId}`)

  switch (action) {
    case 'rename':
      // TODO: Implement rename dialog
      break
    case 'duplicate':
      const project = projects.value.find(p => p.id === projectId)
      if (project) {
        projects.value.push({
          id: `proj-${Date.now()}`,
          name: `${project.name} (Copy)`,
          emoji: project.emoji
        })
      }
      break
    case 'delete':
      projects.value = projects.value.filter(p => p.id !== projectId)
      break
    case 'share':
      // TODO: Implement share dialog
      break
    case 'move':
      // TODO: Implement move dialog
      break
  }

  closeProjectMenu()
}

const props = defineProps<{
  workspaceId: string
}>()

const route = useRoute()
const router = useRouter()

const menuGroups = computed<MenuGroup[]>(() => [
  {
    label: 'Overview',
    items: [
      { label: 'Home', icon: 'home', route: `/${props.workspaceId}` },
      { label: 'Recents', icon: 'clock', route: `/${props.workspaceId}/recents` },
      { label: 'Templates', icon: 'th-large', route: `/${props.workspaceId}/templates` }
    ]
  },
  {
    label: 'My Library',
    items: [
      { label: 'Workflows', icon: 'sitemap', route: `/${props.workspaceId}/workflows` },
      { label: 'Assets', icon: 'images', route: `/${props.workspaceId}/assets` },
      { label: 'Models', icon: 'box', route: `/${props.workspaceId}/models` }
    ]
  }
])

const trashItem = computed<MenuItem>(() => ({
  label: 'Trash',
  icon: 'trash',
  route: `/${props.workspaceId}/trash`
}))

function isActive(itemRoute?: string): boolean {
  if (!itemRoute) return false
  if (itemRoute === `/${props.workspaceId}`) {
    return route.path === itemRoute
  }
  return route.path.startsWith(itemRoute)
}

function signOut(): void {
  router.push('/')
}
</script>

<template>
  <aside
    class="flex h-full w-[300px] flex-col border-r border-zinc-200 bg-zinc-50/50 dark:border-border dark:bg-background"
  >
    <!-- Logo -->
    <div class="flex h-14 items-center justify-between px-3">
      <Popover v-model:open="logoMenuOpen">
        <PopoverTrigger as-child>
          <button
            class="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-muted"
          >
            <img :src="uiStore.themeMode === 'dark' ? '/comfy-logo-yellow.svg' : '/comfy-logo-blue.svg'" alt="ComfyUI" class="h-6" />
            <Icon name="chevron-down" size="xs" class="text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" class="w-60 p-1">
          <!-- File Section -->
          <div class="px-3 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground dark:text-muted-foreground">
            File
          </div>
          <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-foreground dark:hover:bg-muted">
            <Icon name="file" size="sm" class="w-4 text-muted-foreground" />
            <span class="flex-1">New Workflow</span>
            <span class="text-[11px] text-muted-foreground">Ctrl+N</span>
          </button>
          <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-foreground dark:hover:bg-muted">
            <Icon name="folder-open" size="sm" class="w-4 text-muted-foreground" />
            <span class="flex-1">Open...</span>
            <span class="text-[11px] text-muted-foreground">Ctrl+O</span>
          </button>
          <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-foreground dark:hover:bg-muted">
            <Icon name="save" size="sm" class="w-4 text-muted-foreground" />
            <span class="flex-1">Save</span>
            <span class="text-[11px] text-muted-foreground">Ctrl+S</span>
          </button>
          <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-foreground dark:hover:bg-muted">
            <Icon name="download" size="sm" class="w-4 text-muted-foreground" />
            <span>Export...</span>
          </button>

          <div class="mx-2 my-1 h-px bg-zinc-200 dark:bg-zinc-700" />

          <!-- Workspace Section -->
          <div class="px-3 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground dark:text-muted-foreground">
            Workspace
          </div>
          <RouterLink
            :to="`/${workspaceId}`"
            class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-foreground dark:hover:bg-muted"
            @click="logoMenuOpen = false"
          >
            <Icon name="home" size="sm" class="w-4 text-muted-foreground" />
            <span>Home</span>
          </RouterLink>

          <div class="mx-2 my-1 h-px bg-zinc-200 dark:bg-zinc-700" />

          <!-- Account Section -->
          <div class="px-3 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground dark:text-muted-foreground">
            Account
          </div>
          <RouterLink
            :to="`/${workspaceId}/settings`"
            class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-foreground dark:hover:bg-muted"
            @click="logoMenuOpen = false"
          >
            <Icon name="cog" size="sm" class="w-4 text-muted-foreground" />
            <span>Settings</span>
          </RouterLink>
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-foreground dark:hover:bg-muted"
            @click="uiStore.toggleTheme()"
          >
            <Icon :name="uiStore.themeMode === 'dark' ? 'moon' : 'sun'" size="sm" class="w-4 text-muted-foreground" />
            <span class="flex-1">{{ uiStore.themeMode === 'dark' ? 'Dark Mode' : 'Light Mode' }}</span>
            <div
              class="h-5 w-9 rounded-full p-0.5 transition-colors"
              :class="uiStore.themeMode === 'dark' ? 'bg-blue-500' : 'bg-zinc-300 dark:bg-zinc-600'"
            >
              <div
                class="h-4 w-4 rounded-full bg-white transition-transform"
                :class="uiStore.themeMode === 'dark' ? 'translate-x-4' : 'translate-x-0'"
              />
            </div>
          </button>

          <div class="mx-2 my-1 h-px bg-zinc-200 dark:bg-zinc-700" />

          <button
            class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-red-500 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            @click="signOut(); logoMenuOpen = false"
          >
            <Icon name="sign-out" size="sm" class="w-4" />
            <span>Sign out</span>
          </button>
        </PopoverContent>
      </Popover>

      <!-- Settings -->
      <RouterLink
        :to="`/${workspaceId}/settings`"
        :class="[
          'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
          isActive(`/${workspaceId}/settings`)
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'text-muted-foreground hover:bg-zinc-100 hover:text-zinc-700 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground'
        ]"
      >
        <Icon name="cog" size="md" />
      </RouterLink>
    </div>

    <!-- Menu Groups -->
    <nav class="flex-1 overflow-y-auto px-3 py-4">
      <template v-for="(group, groupIndex) in menuGroups" :key="group.label">
        <div v-if="groupIndex > 0" class="my-8" />

        <p class="mb-2 px-2 text-xs font-medium text-muted-foreground dark:text-muted-foreground">
          {{ group.label }}
        </p>

        <ul class="flex flex-col gap-0.5">
          <li v-for="item in group.items" :key="item.label">
            <RouterLink
              :to="item.route ?? '#'"
              :class="[
                'flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors',
                isActive(item.route)
                  ? 'bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground'
              ]"
            >
              <Icon :name="item.icon" size="md" />
              <span class="flex-1">{{ item.label }}</span>
              <span
                v-if="item.badge"
                :class="[
                  'rounded-full px-1.5 py-0.5 text-xs font-medium',
                  isActive(item.route)
                    ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900'
                    : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-foreground'
                ]"
              >
                {{ item.badge }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </template>

      <!-- Projects Section -->
      <div class="mt-8">
        <div class="mb-2 flex items-center justify-between px-2">
          <p class="text-xs font-medium text-muted-foreground dark:text-muted-foreground">
            Projects
          </p>
          <Popover v-model:open="showCreateProject">
            <PopoverTrigger as-child>
              <button
                class="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-foreground"
                title="Create project"
              >
                <Icon name="plus" size="xs" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" class="w-64 p-3">
              <p class="mb-3 text-sm font-medium text-zinc-900 dark:text-foreground">New Project</p>

              <!-- Emoji Picker -->
              <div class="mb-3">
                <p class="mb-1.5 text-xs text-muted-foreground">Icon</p>
                <div class="grid grid-cols-8 gap-1">
                  <button
                    v-for="emoji in projectEmojis"
                    :key="emoji"
                    :class="[
                      'flex h-7 w-7 items-center justify-center rounded text-base transition-colors',
                      newProjectEmoji === emoji
                        ? 'bg-zinc-900 dark:bg-zinc-100'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    ]"
                    @click="newProjectEmoji = emoji"
                  >
                    {{ emoji }}
                  </button>
                </div>
              </div>

              <!-- Project Name -->
              <div class="mb-3">
                <p class="mb-1.5 text-xs text-muted-foreground">Name</p>
                <input
                  v-model="newProjectName"
                  type="text"
                  placeholder="Project name"
                  class="w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-foreground dark:placeholder-zinc-500 dark:focus:border-zinc-600"
                  @keydown.enter="confirmCreateProject"
                />
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-2">
                <button
                  class="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  @click="cancelCreateProject"
                >
                  Cancel
                </button>
                <button
                  class="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  :disabled="!newProjectName.trim()"
                  @click="confirmCreateProject"
                >
                  Create
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <ul class="flex flex-col gap-0.5">
          <li v-for="project in projects" :key="project.id" class="group relative">
            <RouterLink
              :to="`/${workspaceId}/projects/${project.id}`"
              :class="[
                'flex items-center gap-2 rounded-md px-2 py-1.5 pr-8 text-sm transition-colors',
                isActive(`/${workspaceId}/projects/${project.id}`)
                  ? 'bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground'
              ]"
            >
              <span class="text-base">{{ project.emoji }}</span>
              <span class="flex-1 truncate">{{ project.name }}</span>
            </RouterLink>

            <!-- Three-dot menu button -->
            <Popover :open="projectMenuOpen === project.id" @update:open="(open) => !open && closeProjectMenu()">
              <PopoverTrigger as-child>
                <button
                  :class="[
                    'absolute right-1 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded transition-all',
                    projectMenuOpen === project.id
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100',
                    isActive(`/${workspaceId}/projects/${project.id}`)
                      ? 'text-white/70 hover:bg-white/10 hover:text-white dark:text-zinc-900/70 dark:hover:bg-zinc-900/10 dark:hover:text-zinc-900'
                      : 'text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-foreground'
                  ]"
                  @click="openProjectMenu(project.id, $event)"
                >
                  <Icon name="ellipsis-h" size="sm" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" side="right" class="w-44 p-1">
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-foreground dark:hover:bg-muted"
                  @click="handleProjectAction('rename', project.id)"
                >
                  <Icon name="edit" size="sm" class="text-muted-foreground" />
                  Rename
                </button>
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-foreground dark:hover:bg-muted"
                  @click="handleProjectAction('duplicate', project.id)"
                >
                  <Icon name="copy" size="sm" class="text-muted-foreground" />
                  Duplicate
                </button>
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-foreground dark:hover:bg-muted"
                  @click="handleProjectAction('move', project.id)"
                >
                  <Icon name="folder" size="sm" class="text-muted-foreground" />
                  Move to...
                </button>
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-foreground dark:hover:bg-muted"
                  @click="handleProjectAction('share', project.id)"
                >
                  <Icon name="share" size="sm" class="text-muted-foreground" />
                  Share
                </button>
                <div class="my-1 h-px bg-zinc-200 dark:bg-zinc-700" />
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  @click="handleProjectAction('delete', project.id)"
                >
                  <Icon name="trash" size="sm" />
                  Delete
                </button>
              </PopoverContent>
            </Popover>
          </li>
        </ul>

        <!-- Empty state -->
        <div
          v-if="projects.length === 0"
          class="px-2 py-3 text-center text-xs text-muted-foreground"
        >
          No projects yet
        </div>
      </div>
    </nav>

    <!-- Trash -->
    <div class="px-3 pb-2">
      <RouterLink
        :to="trashItem.route ?? '#'"
        :class="[
          'flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors',
          isActive(trashItem.route)
            ? 'bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground'
        ]"
      >
        <Icon :name="trashItem.icon" size="md" />
        <span>{{ trashItem.label }}</span>
      </RouterLink>
    </div>

    <!-- Footer -->
    <div class="border-t border-zinc-200 px-3 py-3 dark:border-border">
      <!-- Account Dropdown -->
      <Popover v-model:open="accountMenuOpen">
        <PopoverTrigger as-child>
          <button
            class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-muted"
          >
            <div class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
              J
            </div>
            <div class="flex-1 overflow-hidden text-left">
              <p class="truncate text-sm font-medium text-zinc-900 dark:text-foreground">
                John Doe
              </p>
              <p class="text-xs text-muted-foreground dark:text-muted-foreground">
                john@example.com
              </p>
            </div>
            <Icon name="chevron-down" size="xs" class="text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" side="top" class="w-64 p-2">
          <!-- Account -->
          <div class="flex items-center gap-2.5 px-2 py-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
              J
            </div>
            <div class="flex-1">
              <p class="font-medium text-zinc-900 dark:text-foreground">John Doe</p>
              <p class="text-xs text-muted-foreground dark:text-muted-foreground">john@example.com</p>
            </div>
          </div>

          <div class="my-2 h-px bg-zinc-200 dark:bg-zinc-700" />

          <RouterLink
            :to="`/${workspaceId}/settings`"
            class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-foreground dark:hover:bg-muted"
            @click="accountMenuOpen = false"
          >
            <Icon name="cog" size="sm" />
            <span>Settings</span>
          </RouterLink>

          <div class="my-2 h-px bg-zinc-200 dark:bg-zinc-700" />

          <button
            class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-500 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            @click="signOut(); accountMenuOpen = false"
          >
            <Icon name="sign-out" size="sm" />
            <span>Sign out</span>
          </button>
        </PopoverContent>
      </Popover>
    </div>
  </aside>
</template>
