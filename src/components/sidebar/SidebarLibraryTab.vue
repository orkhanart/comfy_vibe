<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { computed, ref } from 'vue'
import { useLibraryStore, type LibraryItem, type Project } from '@/stores/libraryStore'
import type { ShortcutType } from '@/stores/uiStore'

// Context menu state
const contextMenuItemId = ref<string | null>(null)
const contextMenuPosition = ref<{ x: number; y: number } | null>(null)

const props = defineProps<{
  viewMode: 'list' | 'grid'
  searchQuery: string
  activeFilter: string
  activeSection: 'my-library' | 'projects' | 'templates'
  sidebarWidth: number
  currentProjectId: string | null
  filterModelType: 'all' | 'checkpoint' | 'lora' | 'vae' | 'controlnet'
  filterBaseModel: 'all' | 'SD1.5' | 'SDXL' | 'Flux' | 'Pony'
  filterAssetType: 'all' | 'image' | 'video' | 'audio'
  showFavoritesOnly: boolean
}>()

const libraryStore = useLibraryStore()

// Helper to create shortcut data for drag
function createShortcutData(e: DragEvent, data: {
  id: string
  type: ShortcutType
  label: string
  icon: string
  thumbnail?: string
  itemId?: string
  section?: 'my-library' | 'projects' | 'templates'
  filter?: 'All' | 'Workflows' | 'Models' | 'Assets'
}): void {
  if (e.dataTransfer) {
    const jsonData = JSON.stringify(data)
    e.dataTransfer.setData('application/x-library-shortcut', jsonData)
    e.dataTransfer.setData('text/plain', jsonData)
    e.dataTransfer.effectAllowed = 'copyMove'
    console.log('[Shortcut] Drag started:', data.type, data.label)
  }
}

// Drag handlers for different item types
function handleProjectDragStart(e: DragEvent, project: Project): void {
  createShortcutData(e, {
    id: `shortcut-project-${project.id}`,
    type: 'project',
    label: project.name,
    icon: 'folder',
    thumbnail: project.thumbnail,
    itemId: project.id,
  })
}

function handleItemDragStart(e: DragEvent, item: LibraryItem): void {
  const typeMap: Record<string, ShortcutType> = {
    workflow: 'workflow',
    model: 'model',
    asset: 'asset',
    template: 'workflow', // Templates are workflows
  }
  const iconMap: Record<string, string> = {
    workflow: 'sitemap',
    model: 'box',
    asset: 'image',
    template: 'clone',
  }

  createShortcutData(e, {
    id: `shortcut-item-${item.id}`,
    type: typeMap[item.type] || 'workflow',
    label: item.name,
    icon: iconMap[item.type] || 'file',
    thumbnail: item.thumbnail,
    itemId: item.id,
    section: props.activeSection,
  })
}

function handleFolderDragStart(e: DragEvent, folder: { id: string; name: string; icon: string }): void {
  createShortcutData(e, {
    id: `shortcut-folder-${props.activeSection}-${folder.id}`,
    type: 'library-folder',
    label: `${folder.name}`,
    icon: folder.icon,
    section: props.activeSection,
    filter: folder.name as 'Workflows' | 'Models' | 'Assets',
  })
}

// Check if we're at projects root (showing projects list)
const isProjectsRoot = computed(() => {
  return props.activeSection === 'projects' && props.currentProjectId === null
})

// Get current project name for header
const currentProject = computed(() => {
  if (!props.currentProjectId) return null
  return libraryStore.projects.find(p => p.id === props.currentProjectId)
})

// Responsive grid columns based on sidebar width
const gridCols = computed(() => {
  if (props.sidebarWidth >= 420) return 3
  if (props.sidebarWidth >= 340) return 2
  return 1
})

// System folders to show in "All" view
const systemFolders = computed(() => {
  if (props.activeFilter !== 'All') return []

  return [
    { id: 'workflows', name: 'Workflows', icon: 'sitemap', type: 'folder' },
    { id: 'models', name: 'Models', icon: 'box', type: 'folder' },
    { id: 'assets', name: 'Assets', icon: 'image', type: 'folder' },
  ]
})

// Map filter to type
const activeType = computed(() => {
  const filterMap: Record<string, string> = {
    'All': 'all',
    'Workflows': 'workflows',
    'Models': 'models',
    'Assets': 'assets',
  }
  return filterMap[props.activeFilter] || 'all'
})

// Get current folder ID based on section + type
const currentFolderId = computed(() => {
  const prefix = props.activeSection === 'my-library' ? 'my' :
                 props.activeSection === 'projects' ? 'proj' : 'tpl'

  if (props.activeSection === 'templates') {
    return 'tpl-official'
  }

  // If filter is 'All', we need to show all types
  if (activeType.value === 'all') {
    return `${prefix}-all`
  }

  return `${prefix}-${activeType.value}`
})

// Get items for current folder
const currentItems = computed(() => {
  const prefix = props.activeSection === 'my-library' ? 'my' :
                 props.activeSection === 'projects' ? 'proj' : 'tpl'

  if (props.activeSection === 'templates') {
    return libraryStore.items.filter(item => item.parentId === 'tpl-official')
  }

  // If filter is 'All', show all items from all type folders in this section
  if (activeType.value === 'all') {
    return libraryStore.items.filter(item =>
      item.parentId === `${prefix}-workflows` ||
      item.parentId === `${prefix}-models` ||
      item.parentId === `${prefix}-assets`
    )
  }

  return libraryStore.items.filter(item => item.parentId === `${prefix}-${activeType.value}`)
})

// Filtered items based on search and advanced filters
const filteredItems = computed(() => {
  let result = currentItems.value

  // Apply search filter
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase()
    result = result.filter(item =>
      item.name.toLowerCase().includes(query)
    )
  }

  // Apply favorites filter
  if (props.showFavoritesOnly) {
    result = result.filter(item => item.favorite)
  }

  // Apply model type filter (only for models)
  if (props.filterModelType !== 'all') {
    result = result.filter(item =>
      item.type !== 'model' || item.modelType === props.filterModelType
    )
  }

  // Apply base model filter (only for models)
  if (props.filterBaseModel !== 'all') {
    result = result.filter(item =>
      item.type !== 'model' || item.baseModel === props.filterBaseModel
    )
  }

  // Apply asset type filter (only for assets)
  if (props.filterAssetType !== 'all') {
    result = result.filter(item =>
      item.type !== 'asset' || item.assetType === props.filterAssetType
    )
  }

  return result
})

const emit = defineEmits<{
  'select-folder': [folder: string]
  'select-project': [projectId: string]
  'back-to-projects': []
}>()

function handleItemClick(item: any): void {
  libraryStore.addToRecent(item)
  console.log('Open item:', item)
}

function handleFolderClick(folder: { id: string; name: string }): void {
  emit('select-folder', folder.id)
}

function handleProjectClick(projectId: string): void {
  emit('select-project', projectId)
}

function handleBackToProjects(): void {
  emit('back-to-projects')
}

function getItemSubtext(item: any): string {
  // Workflows: show node count
  if (item.type === 'workflow' && item.nodeCount) {
    return `${item.nodeCount} nodes`
  }
  // Models: show type and size
  if (item.type === 'model') {
    const modelType = item.modelType ? item.modelType.charAt(0).toUpperCase() + item.modelType.slice(1) : ''
    return item.size ? `${modelType} · ${item.size}` : modelType
  }
  // Assets: show dimensions or type
  if (item.type === 'asset') {
    if (item.dimensions) return item.dimensions
    if (item.assetType) return item.assetType.charAt(0).toUpperCase() + item.assetType.slice(1)
  }
  // Templates: show description
  if (item.type === 'template' && item.description) {
    return item.description
  }
  return item.updatedAt || ''
}

function getItemIcon(item: any): string {
  if (item.type === 'workflow') return 'sitemap'
  if (item.type === 'model') {
    const icons: Record<string, string> = {
      checkpoint: 'box',
      lora: 'bolt',
      vae: 'sliders-h',
      controlnet: 'sitemap',
    }
    return icons[item.modelType] || 'box'
  }
  if (item.type === 'asset') {
    const icons: Record<string, string> = {
      image: 'image',
      video: 'video',
      audio: 'volume-up',
    }
    return icons[item.assetType] || 'image'
  }
  if (item.type === 'template') return 'clone'
  return 'file'
}

function handleContextMenu(e: MouseEvent, item: any): void {
  e.stopPropagation()
  e.preventDefault()

  // Toggle context menu for this item
  if (contextMenuItemId.value === item.id) {
    closeContextMenu()
  } else {
    contextMenuItemId.value = item.id
    // Position relative to clicked button
    const button = e.currentTarget as HTMLElement
    const rect = button.getBoundingClientRect()
    contextMenuPosition.value = { x: rect.right, y: rect.top }
  }
}

function closeContextMenu(): void {
  contextMenuItemId.value = null
  contextMenuPosition.value = null
}

function handleMenuAction(action: string, item: any): void {
  console.log(`Action: ${action} for item:`, item)
  closeContextMenu()

  switch (action) {
    case 'open':
      handleItemClick(item)
      break
    case 'favorite':
      // Toggle favorite (would need store action)
      console.log('Toggle favorite:', item.id)
      break
    case 'duplicate':
      console.log('Duplicate:', item.id)
      break
    case 'rename':
      console.log('Rename:', item.id)
      break
    case 'move':
      console.log('Move:', item.id)
      break
    case 'delete':
      console.log('Delete:', item.id)
      break
  }
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Back button when inside a project -->
    <div v-if="currentProject" class="flex items-center gap-2 border-b border-border px-2 py-1.5">
      <button
        v-tooltip.bottom="{ value: 'Back to projects', showDelay: 50 }"
        class="flex items-center gap-1 rounded px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        @click="handleBackToProjects"
      >
        <Icon name="chevron-left" size="sm" />
        <span>Projects</span>
      </button>
      <span class="text-xs font-medium text-foreground">{{ currentProject.name }}</span>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-2">
      <!-- Projects List (when at projects root) -->
      <template v-if="isProjectsRoot">
        <!-- Grid View -->
        <div
          v-if="props.viewMode === 'grid'"
          class="grid gap-3"
          :style="{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }"
        >
          <div
            v-for="project in libraryStore.projects"
            :key="project.id"
            class="group cursor-grab active:cursor-grabbing"
            draggable="true"
            @click="handleProjectClick(project.id)"
            @dragstart="handleProjectDragStart($event, project)"
          >
            <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 transition-all duration-200 group-hover:scale-[1.01] group-hover:shadow-lg dark:bg-zinc-800">
              <img
                v-if="project.thumbnail"
                :src="project.thumbnail"
                :alt="project.name"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full w-full items-center justify-center">
                <Icon name="folder" size="xl" class="text-muted-foreground/20" />
              </div>
              <!-- Context menu button -->
              <div class="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  v-tooltip.top="{ value: 'More options', showDelay: 50 }"
                  class="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900/80 text-white hover:bg-zinc-900"
                  @click="handleContextMenu($event, project)"
                >
                  <Icon name="ellipsis-v" size="xs" />
                </button>
              </div>
            </div>
            <p class="mt-1.5 truncate px-0.5 text-xs font-medium text-foreground">{{ project.name }}</p>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="flex flex-col gap-0.5">
          <div
            v-for="project in libraryStore.projects"
            :key="project.id"
            class="group flex cursor-grab items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50 active:cursor-grabbing"
            draggable="true"
            @click="handleProjectClick(project.id)"
            @dragstart="handleProjectDragStart($event, project)"
          >
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted/50">
              <Icon name="folder" size="sm" class="text-muted-foreground/50" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs text-foreground">{{ project.name }}</p>
            </div>
            <button
              v-tooltip.left="{ value: 'More options', showDelay: 50 }"
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground/50 opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover:opacity-100"
              @click="handleContextMenu($event, project)"
            >
              <Icon name="ellipsis-v" size="xs" />
            </button>
            <Icon name="chevron-right" size="xs" class="text-muted-foreground/30" />
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="libraryStore.projects.length === 0" class="flex h-full flex-col items-center justify-center py-8">
          <Icon name="folder" size="xl" class="mb-2 text-muted-foreground/15" />
          <p class="text-xs text-muted-foreground/60">No projects</p>
        </div>
      </template>

      <!-- Normal content (folders + items) -->
      <template v-else>
        <!-- Grid View -->
        <div
          v-if="props.viewMode === 'grid' && (filteredItems.length > 0 || systemFolders.length > 0)"
          class="grid gap-3"
          :style="{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }"
        >
          <!-- System Folders -->
          <div
            v-for="folder in systemFolders"
            :key="folder.id"
            class="group cursor-grab active:cursor-grabbing"
            draggable="true"
            @click="handleFolderClick(folder)"
            @dragstart="handleFolderDragStart($event, folder)"
          >
            <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-50 transition-all duration-200 group-hover:scale-[1.01] group-hover:shadow-lg dark:bg-zinc-800/50">
              <!-- Folder icon -->
              <div class="absolute left-2 top-2">
                <Icon :name="folder.icon" size="lg" class="text-amber-400 dark:text-amber-500/70" />
              </div>
              <!-- Context menu button -->
              <div class="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  v-tooltip.top="{ value: 'More options', showDelay: 50 }"
                  class="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900/80 text-white hover:bg-zinc-900"
                  @click="handleContextMenu($event, folder)"
                >
                  <Icon name="ellipsis-v" size="xs" />
                </button>
              </div>
            </div>
            <p class="mt-1.5 truncate px-0.5 text-xs font-medium text-foreground">{{ folder.name }}</p>
          </div>

          <!-- Items -->
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="group cursor-grab active:cursor-grabbing"
            draggable="true"
            @click="handleItemClick(item)"
            @dragstart="handleItemDragStart($event, item)"
          >
            <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 transition-all duration-200 group-hover:scale-[1.01] group-hover:shadow-lg dark:bg-zinc-800">
              <!-- Thumbnail or placeholder -->
              <img
                v-if="item.thumbnail"
                :src="item.thumbnail"
                :alt="item.name"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full w-full items-center justify-center">
                <Icon
                  :name="getItemIcon(item)"
                  size="xl"
                  class="text-muted-foreground/20"
                />
              </div>
              <!-- Top badges -->
              <div class="absolute left-2 top-2 flex items-center gap-1">
                <span
                  v-if="item.nodeCount"
                  class="inline-flex items-center gap-0.5 rounded bg-zinc-900/80 px-1 py-0.5 text-[9px] font-medium text-white"
                >
                  <Icon name="sitemap" size="xs" />
                  {{ item.nodeCount }}
                </span>
              </div>
              <!-- Lock badge -->
              <div v-if="item.isReadOnly" v-tooltip.left="{ value: 'Read only', showDelay: 50 }" class="absolute right-2 top-2">
                <span class="rounded bg-zinc-900/80 p-1">
                  <Icon name="lock" size="xs" class="text-white" />
                </span>
              </div>
              <!-- Context menu button -->
              <div v-if="!item.isReadOnly" class="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  v-tooltip.top="{ value: 'More options', showDelay: 50 }"
                  class="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900/80 text-white hover:bg-zinc-900"
                  @click="handleContextMenu($event, item)"
                >
                  <Icon name="ellipsis-v" size="xs" />
                </button>
              </div>
            </div>
            <p class="mt-1.5 truncate px-0.5 text-xs font-medium text-foreground">{{ item.name }}</p>
          </div>
        </div>

        <!-- List View -->
        <div v-else-if="props.viewMode === 'list' && (filteredItems.length > 0 || systemFolders.length > 0)" class="flex flex-col gap-0.5">
          <!-- System Folders -->
          <div
            v-for="folder in systemFolders"
            :key="folder.id"
            class="group flex cursor-grab items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50 active:cursor-grabbing"
            draggable="true"
            @click="handleFolderClick(folder)"
            @dragstart="handleFolderDragStart($event, folder)"
          >
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted/20">
              <Icon :name="folder.icon" size="sm" class="text-amber-400/70 dark:text-amber-500/50" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs text-foreground">{{ folder.name }}</p>
              <p class="truncate text-[10px] text-muted-foreground/50">Folder</p>
            </div>
            <button
              v-tooltip.left="{ value: 'More options', showDelay: 50 }"
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground/50 opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover:opacity-100"
              @click="handleContextMenu($event, folder)"
            >
              <Icon name="ellipsis-v" size="xs" />
            </button>
            <Icon name="chevron-right" size="xs" class="text-muted-foreground/30" />
          </div>

          <!-- Items -->
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="group flex cursor-grab items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50 active:cursor-grabbing"
            draggable="true"
            @click="handleItemClick(item)"
            @dragstart="handleItemDragStart($event, item)"
          >
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted/50">
              <Icon
                :name="getItemIcon(item)"
                size="sm"
                class="text-muted-foreground/50"
              />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs text-foreground">{{ item.name }}</p>
              <p class="truncate text-[10px] text-muted-foreground/50">{{ getItemSubtext(item) }}</p>
            </div>
            <button
              v-if="!item.isReadOnly"
              v-tooltip.left="{ value: 'More options', showDelay: 50 }"
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground/50 opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover:opacity-100"
              @click="handleContextMenu($event, item)"
            >
              <Icon name="ellipsis-v" size="xs" />
            </button>
            <Icon
              v-if="item.isReadOnly"
              v-tooltip.left="{ value: 'Read only', showDelay: 50 }"
              name="lock"
              size="xs"
              class="text-muted-foreground/30"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredItems.length === 0 && systemFolders.length === 0" class="flex h-full flex-col items-center justify-center py-8">
          <Icon name="folder-open" size="xl" class="mb-2 text-muted-foreground/15" />
          <p class="text-xs text-muted-foreground/60">No items</p>
        </div>
      </template>
    </div>

    <!-- Context Menu Overlay -->
    <Teleport to="body">
      <div
        v-if="contextMenuItemId"
        class="fixed inset-0 z-[100]"
        @click="closeContextMenu"
      >
        <!-- Context Menu -->
        <div
          class="fixed z-[101] w-40 rounded-lg border border-border bg-popover py-1 shadow-xl"
          :style="contextMenuPosition ? { left: `${contextMenuPosition.x}px`, top: `${contextMenuPosition.y}px` } : {}"
          @click.stop
        >
          <button
            class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="handleMenuAction('open', { id: contextMenuItemId })"
          >
            <Icon name="external-link" size="xs" />
            Open
          </button>
          <button
            class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="handleMenuAction('favorite', { id: contextMenuItemId })"
          >
            <Icon name="star" size="xs" />
            Add to Favorites
          </button>
          <div class="my-1 h-px bg-border" />
          <button
            class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="handleMenuAction('duplicate', { id: contextMenuItemId })"
          >
            <Icon name="copy" size="xs" />
            Duplicate
          </button>
          <button
            class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="handleMenuAction('rename', { id: contextMenuItemId })"
          >
            <Icon name="edit" size="xs" />
            Rename
          </button>
          <button
            class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="handleMenuAction('move', { id: contextMenuItemId })"
          >
            <Icon name="folder" size="xs" />
            Move to...
          </button>
          <div class="my-1 h-px bg-border" />
          <button
            class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-destructive transition-colors hover:bg-destructive/10"
            @click="handleMenuAction('delete', { id: contextMenuItemId })"
          >
            <Icon name="trash" size="xs" />
            Delete
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
