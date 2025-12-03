<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { X, Maximize2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useUiStore, SIDEBAR_TABS } from '@/stores/uiStore'
import { SidebarSearchBox } from '@/components/common/sidebar'
import SidebarNodesTab from './SidebarNodesTab.vue'
import SidebarModelsTab from './SidebarModelsTab.vue'
import SidebarLibraryTab from './SidebarLibraryTab.vue'

const uiStore = useUiStore()

const emit = defineEmits<{
  'extend-library': []
  'extend-nodes': []
  'extend-models': []
}>()

const activeSidebarTab = computed(() => uiStore.activeSidebarTab)
const sidebarPanelExpanded = computed(() => uiStore.sidebarPanelExpanded)
const searchQuery = ref('')
const viewMode = ref<'list' | 'grid'>('list')

// Sidebar resize
const sidebarWidth = ref(320) // default 320px (w-80)
const isResizing = ref(false)
const MIN_WIDTH = 320
const MAX_WIDTH = 480

function startResize(e: MouseEvent) {
  isResizing.value = true
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'ew-resize'
  document.body.style.userSelect = 'none'
}

function onResize(e: MouseEvent) {
  if (!isResizing.value) return
  const newWidth = e.clientX
  sidebarWidth.value = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth))
}

function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

// Sort/filter state
const sortBy = ref('name')
const showFilterMenu = ref(false)
const showSortMenu = ref(false)
const showMoreMenu = ref(false)

// Advanced filters for library
const filterModelType = ref<'all' | 'checkpoint' | 'lora' | 'vae' | 'controlnet'>('all')
const filterBaseModel = ref<'all' | 'SD1.5' | 'SDXL' | 'Flux' | 'Pony'>('all')
const filterAssetType = ref<'all' | 'image' | 'video' | 'audio'>('all')
const showFavoritesOnly = ref(false)

const modelTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'checkpoint', label: 'Checkpoint' },
  { value: 'lora', label: 'LoRA' },
  { value: 'vae', label: 'VAE' },
  { value: 'controlnet', label: 'ControlNet' },
] as const

const baseModelOptions = [
  { value: 'all', label: 'All Base Models' },
  { value: 'SD1.5', label: 'SD 1.5' },
  { value: 'SDXL', label: 'SDXL' },
  { value: 'Flux', label: 'Flux' },
  { value: 'Pony', label: 'Pony' },
] as const

const assetTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'audio', label: 'Audio' },
] as const

// Check if any advanced filter is active (based on current view)
const hasActiveFilters = computed(() => {
  if (showFavoritesOnly.value) return true
  if (activeFilter.value === 'Models' || activeFilter.value === 'All') {
    if (filterModelType.value !== 'all' || filterBaseModel.value !== 'all') return true
  }
  if (activeFilter.value === 'Assets' || activeFilter.value === 'All') {
    if (filterAssetType.value !== 'all') return true
  }
  return false
})

function clearAllFilters(): void {
  filterModelType.value = 'all'
  filterBaseModel.value = 'all'
  filterAssetType.value = 'all'
  showFavoritesOnly.value = false
}

// Library section and filter from store (for shortcuts support)
const librarySection = computed(() => uiStore.activeLibrarySection)
const activeFilter = computed(() => uiStore.activeLibraryFilter)

const librarySectionTabs = [
  { id: 'my-library', label: 'My Library' },
  { id: 'projects', label: 'Projects' },
  { id: 'templates', label: 'Templates' },
] as const

// Track if user is inside a project (null = at projects root)
const currentProjectId = ref<string | null>(null)

// Reset project when switching away from projects section
function handleSectionChange(sectionId: 'my-library' | 'projects' | 'templates') {
  uiStore.setLibrarySection(sectionId)
  if (sectionId !== 'projects') {
    currentProjectId.value = null
  }
}

function handleFilterChange(filterId: 'All' | 'Workflows' | 'Models' | 'Assets') {
  uiStore.setLibraryFilter(filterId)
}

// Should show folder tabs (All, Workflows, Models, Assets)
const showFolderTabs = computed(() => {
  // Always show for my-library and templates
  if (librarySection.value !== 'projects') return true
  // For projects, only show when inside a project
  return currentProjectId.value !== null
})

// Library folder tabs (system folders)
const libraryFolderTabs = [
  { id: 'All', label: 'All' },
  { id: 'Workflows', label: 'Workflows' },
  { id: 'Models', label: 'Models' },
  { id: 'Assets', label: 'Assets' },
] as const

const sortOptions = computed(() => {
  switch (activeSidebarTab.value) {
    case 'nodes':
      return [
        { label: 'Name', value: 'name' },
        { label: 'Category', value: 'category' },
        { label: 'Recently Used', value: 'recent' },
      ]
    case 'models':
      return [
        { label: 'Name', value: 'name' },
        { label: 'Type', value: 'type' },
        { label: 'Size', value: 'size' },
        { label: 'Date Added', value: 'date' },
      ]
    case 'library':
      return [
        { label: 'Name', value: 'name' },
        { label: 'Recent', value: 'recent' },
        { label: 'Date', value: 'date' },
      ]
    default:
      return [{ label: 'Name', value: 'name' }]
  }
})

const filterOptions = computed(() => {
  switch (activeSidebarTab.value) {
    case 'nodes':
      return ['All', 'Core', 'Custom', 'Favorites']
    case 'models':
      return ['All', 'Checkpoints', 'LoRAs', 'VAE', 'ControlNet', 'Embeddings']
    case 'library':
      return ['All', 'Workflows', 'Models', 'Assets']
    default:
      return ['All']
  }
})

function setSort(value: string): void {
  sortBy.value = value
  showSortMenu.value = false
}

function setFilter(value: string): void {
  uiStore.setLibraryFilter(value as 'All' | 'Workflows' | 'Models' | 'Assets')
  showFilterMenu.value = false
}

function handleFolderSelect(folderId: string): void {
  // Map folder id to filter name
  const folderToFilter: Record<string, 'All' | 'Workflows' | 'Models' | 'Assets'> = {
    'workflows': 'Workflows',
    'models': 'Models',
    'assets': 'Assets',
  }
  uiStore.setLibraryFilter(folderToFilter[folderId] || 'All')
}

// Drag handlers for creating shortcuts
function handleSectionDragStart(e: DragEvent, sectionId: 'my-library' | 'projects' | 'templates'): void {
  console.log('[Shortcut] Section drag start:', sectionId)
  const icons: Record<string, string> = {
    'my-library': 'user',
    'projects': 'folder',
    'templates': 'clone',
  }
  const labels: Record<string, string> = {
    'my-library': 'My Library',
    'projects': 'Projects',
    'templates': 'Templates',
  }
  const shortcut = {
    id: `shortcut-section-${sectionId}`,
    type: 'library-section' as const,
    label: labels[sectionId],
    icon: icons[sectionId],
    section: sectionId,
  }
  console.log('[Shortcut] Setting data:', shortcut)
  if (e.dataTransfer) {
    const jsonData = JSON.stringify(shortcut)
    e.dataTransfer.setData('application/x-library-shortcut', jsonData)
    e.dataTransfer.setData('text/plain', jsonData)
    e.dataTransfer.effectAllowed = 'copyMove'
    const target = e.target as HTMLElement
    if (target) {
      e.dataTransfer.setDragImage(target, 0, 0)
    }
    console.log('[Shortcut] Data set successfully')
  } else {
    console.error('[Shortcut] No dataTransfer available!')
  }
}

function handleFolderDragStart(e: DragEvent, folderId: string): void {
  console.log('[Shortcut] Folder drag start:', folderId)
  const icons: Record<string, string> = {
    'Workflows': 'sitemap',
    'Models': 'box',
    'Assets': 'image',
    'All': 'th-large',
  }
  const shortcut = {
    id: `shortcut-folder-${librarySection.value}-${folderId.toLowerCase()}`,
    type: 'library-folder' as const,
    label: `${librarySectionTabs.find(t => t.id === librarySection.value)?.label} > ${folderId}`,
    icon: icons[folderId] || 'folder',
    section: librarySection.value,
    filter: folderId as 'All' | 'Workflows' | 'Models' | 'Assets',
  }
  console.log('[Shortcut] Setting folder data:', shortcut)
  if (e.dataTransfer) {
    const jsonData = JSON.stringify(shortcut)
    e.dataTransfer.setData('application/x-library-shortcut', jsonData)
    e.dataTransfer.setData('text/plain', jsonData)
    e.dataTransfer.effectAllowed = 'copyMove'
    const target = e.target as HTMLElement
    if (target) {
      e.dataTransfer.setDragImage(target, 0, 0)
    }
    console.log('[Shortcut] Folder data set successfully')
  } else {
    console.error('[Shortcut] No dataTransfer available!')
  }
}
</script>

<template>
  <aside
    class="relative border-r border-border bg-card/95 transition-all duration-200"
    :style="sidebarPanelExpanded ? { width: `${sidebarWidth}px` } : { width: '0px' }"
    :class="{ 'overflow-hidden': !sidebarPanelExpanded }"
  >
    <div v-if="sidebarPanelExpanded" class="flex h-full flex-col" :style="{ width: `${sidebarWidth}px` }">
      <!-- Panel Header -->
      <div class="flex items-center justify-between border-b border-border px-3 py-2">
        <!-- Library: Section Tabs -->
        <div v-if="activeSidebarTab === 'library'" class="flex gap-1">
          <button
            v-for="tab in librarySectionTabs"
            :key="tab.id"
            draggable="true"
            class="cursor-grab rounded px-2 py-1 text-[11px] font-medium transition-colors active:cursor-grabbing"
            :class="[
              librarySection === tab.id
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            ]"
            @click="handleSectionChange(tab.id)"
            @dragstart="handleSectionDragStart($event, tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>
        <!-- Other tabs: Title -->
        <span v-else class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {{ SIDEBAR_TABS.find(t => t.id === activeSidebarTab)?.label }}
        </span>
        <div class="flex items-center gap-0.5">
          <Button
            v-tooltip.bottom="{ value: 'Expand to full view', showDelay: 50 }"
            variant="ghost"
            size="icon"
            class="h-6 w-6"
            @click="activeSidebarTab === 'library' ? emit('extend-library') : activeSidebarTab === 'nodes' ? emit('extend-nodes') : emit('extend-models')"
          >
            <Maximize2 class="size-3" />
          </Button>
          <Button
            v-tooltip.bottom="{ value: 'Close panel', showDelay: 50 }"
            variant="ghost"
            size="icon"
            class="h-6 w-6"
            @click="uiStore.closeSidebarPanel()"
          >
            <X class="size-3" />
          </Button>
        </div>
      </div>

      <!-- Search & Controls -->
      <div class="border-b border-border p-2">
        <div class="flex items-center gap-1.5">
          <SidebarSearchBox
            v-model="searchQuery"
            :placeholder="`Search ${SIDEBAR_TABS.find(t => t.id === activeSidebarTab)?.label?.toLowerCase()}...`"
            class="flex-1"
          />

          <!-- Sort Dropdown -->
          <div class="relative">
            <button
              v-tooltip.bottom="{ value: 'Sort items', showDelay: 50 }"
              class="flex h-7 w-7 items-center justify-center rounded bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              @click="showSortMenu = !showSortMenu"
            >
              <Icon name="arrow-up-down" size="sm" />
            </button>
            <div
              v-if="showSortMenu"
              class="absolute right-0 top-full z-50 mt-1 min-w-[120px] rounded-lg border border-border bg-popover py-1 shadow-xl"
            >
              <button
                v-for="option in sortOptions"
                :key="option.value"
                class="flex w-full items-center px-3 py-1.5 text-left text-xs transition-colors"
                :class="sortBy === option.value ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'"
                @click="setSort(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- View Toggle (single button) -->
          <button
            v-tooltip.bottom="{ value: viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view', showDelay: 50 }"
            class="flex h-7 w-7 items-center justify-center rounded bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'"
          >
            <Icon :name="viewMode === 'grid' ? 'list' : 'th-large'" size="sm" />
          </button>

          <!-- More Options Menu (for Library tab) -->
          <div v-if="activeSidebarTab === 'library'" class="relative">
            <button
              v-tooltip.bottom="{ value: 'More filters', showDelay: 50 }"
              class="flex h-7 w-7 items-center justify-center rounded transition-colors"
              :class="[
                hasActiveFilters
                  ? 'bg-primary/20 text-primary hover:bg-primary/30'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
              ]"
              @click="showMoreMenu = !showMoreMenu"
            >
              <Icon name="ellipsis-v" size="sm" />
            </button>
            <!-- Dropdown Menu -->
            <div
              v-if="showMoreMenu"
              class="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-border bg-popover py-1 shadow-xl"
            >
              <!-- Favorites Toggle -->
              <button
                class="flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-accent"
                :class="showFavoritesOnly ? 'text-amber-500' : 'text-muted-foreground hover:text-foreground'"
                @click="showFavoritesOnly = !showFavoritesOnly"
              >
                <span class="flex items-center gap-2">
                  <Icon :name="showFavoritesOnly ? 'star-fill' : 'star'" size="sm" />
                  Favorites Only
                </span>
                <Icon v-if="showFavoritesOnly" name="check" size="xs" class="text-primary" />
              </button>

              <!-- Model Filters (only for Models or All view) -->
              <template v-if="activeFilter === 'Models' || activeFilter === 'All'">
                <div class="my-1 h-px bg-border" />

                <!-- Model Type Filter -->
                <div class="px-3 py-1.5">
                  <span class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">Model Type</span>
                </div>
                <button
                  v-for="option in modelTypeOptions"
                  :key="option.value"
                  class="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs transition-colors hover:bg-accent"
                  :class="filterModelType === option.value ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
                  @click="filterModelType = option.value"
                >
                  {{ option.label }}
                  <Icon v-if="filterModelType === option.value" name="check" size="xs" class="text-primary" />
                </button>

                <div class="my-1 h-px bg-border" />

                <!-- Base Model Filter -->
                <div class="px-3 py-1.5">
                  <span class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">Base Model</span>
                </div>
                <button
                  v-for="option in baseModelOptions"
                  :key="option.value"
                  class="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs transition-colors hover:bg-accent"
                  :class="filterBaseModel === option.value ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
                  @click="filterBaseModel = option.value"
                >
                  {{ option.label }}
                  <Icon v-if="filterBaseModel === option.value" name="check" size="xs" class="text-primary" />
                </button>
              </template>

              <!-- Asset Filters (only for Assets or All view) -->
              <template v-if="activeFilter === 'Assets' || activeFilter === 'All'">
                <div class="my-1 h-px bg-border" />

                <!-- Asset Type Filter -->
                <div class="px-3 py-1.5">
                  <span class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">Asset Type</span>
                </div>
                <button
                  v-for="option in assetTypeOptions"
                  :key="option.value"
                  class="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs transition-colors hover:bg-accent"
                  :class="filterAssetType === option.value ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
                  @click="filterAssetType = option.value"
                >
                  {{ option.label }}
                  <Icon v-if="filterAssetType === option.value" name="check" size="xs" class="text-primary" />
                </button>
              </template>

              <!-- Clear Filters -->
              <template v-if="hasActiveFilters">
                <div class="my-1 h-px bg-border" />
                <button
                  class="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-destructive transition-colors hover:bg-accent"
                  @click="clearAllFilters"
                >
                  <Icon name="times" size="sm" />
                  Clear All Filters
                </button>
              </template>
            </div>
          </div>
        </div>

        <!-- Filter (not for Library - uses folder tabs instead) -->
        <div v-if="activeSidebarTab !== 'library'" class="mt-2">
          <div class="relative inline-block">
            <button
              v-tooltip.bottom="{ value: 'Filter items', showDelay: 50 }"
              class="flex h-6 items-center gap-1 rounded bg-muted px-2 text-[10px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              @click="showFilterMenu = !showFilterMenu"
            >
              <Icon name="filter" size="xs" />
              <span>{{ activeFilter }}</span>
              <Icon name="chevron-down" size="md" class="text-[8px]" />
            </button>
            <div
              v-if="showFilterMenu"
              class="absolute left-0 top-full z-50 mt-1 min-w-[120px] rounded-lg border border-border bg-popover py-1 shadow-xl"
            >
              <button
                v-for="option in filterOptions"
                :key="option"
                class="flex w-full items-center px-3 py-1.5 text-left text-xs transition-colors"
                :class="activeFilter === option ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'"
                @click="setFilter(option)"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Library: System Folder Tabs (hide at projects root) -->
      <div v-if="activeSidebarTab === 'library' && showFolderTabs" class="flex items-center justify-between border-b border-border px-2 py-1.5">
        <div class="flex gap-1">
          <button
            v-for="folder in libraryFolderTabs"
            :key="folder.id"
            draggable="true"
            class="cursor-grab rounded px-2 py-1 text-[11px] font-medium transition-colors active:cursor-grabbing"
            :class="[
              activeFilter === folder.id
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            ]"
            @click="handleFilterChange(folder.id)"
            @dragstart="handleFolderDragStart($event, folder.id)"
          >
            {{ folder.label }}
          </button>
        </div>
        <div class="flex items-center gap-0.5">
          <button
            v-tooltip.bottom="{ value: 'Create new folder', showDelay: 50 }"
            class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Icon name="folder-plus" size="sm" />
          </button>
          <button
            v-tooltip.bottom="{ value: 'Upload', showDelay: 50 }"
            class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Icon name="upload" size="sm" />
          </button>
        </div>
      </div>

      <!-- Panel Content -->
      <div class="flex-1 overflow-hidden">
        <SidebarNodesTab v-if="activeSidebarTab === 'nodes'" :view-mode="viewMode" />
        <SidebarModelsTab v-else-if="activeSidebarTab === 'models'" :view-mode="viewMode" />
        <SidebarLibraryTab
          v-else-if="activeSidebarTab === 'library'"
          :view-mode="viewMode"
          :search-query="searchQuery"
          :active-filter="activeFilter"
          :active-section="librarySection"
          :sidebar-width="sidebarWidth"
          :current-project-id="currentProjectId"
          :filter-model-type="filterModelType"
          :filter-base-model="filterBaseModel"
          :filter-asset-type="filterAssetType"
          :show-favorites-only="showFavoritesOnly"
          @select-folder="handleFolderSelect"
          @select-project="currentProjectId = $event"
          @back-to-projects="currentProjectId = null"
        />
      </div>
    </div>

    <!-- Resize Handle -->
    <div
      v-if="sidebarPanelExpanded"
      class="absolute right-0 top-0 z-10 h-full w-1 cursor-ew-resize transition-colors hover:bg-primary/50"
      :class="{ 'bg-primary/50': isResizing }"
      @mousedown="startResize"
    />
  </aside>
</template>
