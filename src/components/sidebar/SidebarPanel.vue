<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { X, Maximize2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useUiStore, SIDEBAR_TABS } from '@/stores/uiStore'
import { SidebarSearchBox } from '@/components/common/sidebar'
import SidebarNodesTab from './SidebarNodesTab.vue'
import SidebarModelsTab from './SidebarModelsTab.vue'
import SidebarWorkflowsTab from './SidebarWorkflowsTab.vue'
import SidebarAssetsTab from './SidebarAssetsTab.vue'
import SidebarTemplatesTab from './SidebarTemplatesTab.vue'

const uiStore = useUiStore()

const emit = defineEmits<{
  'extend-nodes': []
  'extend-models': []
  'extend-workflows': []
  'extend-assets': []
  'extend-templates': []
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

const activeFilter = ref('All')

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
    default:
      return ['All']
  }
})

function setSort(value: string): void {
  sortBy.value = value
  showSortMenu.value = false
}

function setFilter(value: string): void {
  activeFilter.value = value
  showFilterMenu.value = false
}

function handleExtend(): void {
  switch (activeSidebarTab.value) {
    case 'nodes':
      emit('extend-nodes')
      break
    case 'models':
      emit('extend-models')
      break
    case 'workflows':
      emit('extend-workflows')
      break
    case 'assets':
      emit('extend-assets')
      break
    case 'templates':
      emit('extend-templates')
      break
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
        <span class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {{ SIDEBAR_TABS.find(t => t.id === activeSidebarTab)?.label }}
        </span>
        <div class="flex items-center gap-0.5">
          <Button
            v-tooltip.bottom="{ value: 'Expand to full view', showDelay: 50 }"
            variant="ghost"
            size="icon"
            class="h-6 w-6"
            @click="handleExtend"
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

          <!-- Filter Dropdown - inline for nodes tab -->
          <div v-if="filterOptions.length > 1" class="relative">
            <button
              v-tooltip.bottom="{ value: 'Filter items', showDelay: 50 }"
              class="flex h-7 items-center gap-1 rounded bg-muted px-2 text-[10px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              @click="showFilterMenu = !showFilterMenu"
            >
              <Icon name="filter" size="xs" />
              <span>{{ activeFilter }}</span>
              <Icon name="chevron-down" size="xs" />
            </button>
            <div
              v-if="showFilterMenu"
              class="absolute right-0 top-full z-50 mt-1 min-w-[120px] rounded-lg border border-border bg-popover py-1 shadow-xl"
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

          <!-- View Toggle (single button) - hidden for nodes tab -->
          <button
            v-if="activeSidebarTab !== 'nodes'"
            v-tooltip.bottom="{ value: viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view', showDelay: 50 }"
            class="flex h-7 w-7 items-center justify-center rounded bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'"
          >
            <Icon :name="viewMode === 'grid' ? 'list' : 'th-large'" size="sm" />
          </button>

          <!-- Assets Action Buttons -->
          <template v-if="activeSidebarTab === 'assets'">
            <button
              v-tooltip.bottom="{ value: 'Create Folder', showDelay: 50 }"
              class="flex h-7 w-7 items-center justify-center rounded bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Icon name="folder-plus" size="sm" />
            </button>
            <button
              v-tooltip.bottom="{ value: 'Upload Asset', showDelay: 50 }"
              class="flex h-7 w-7 items-center justify-center rounded bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Icon name="upload" size="sm" />
            </button>
          </template>
        </div>
      </div>

      <!-- Panel Content -->
      <div class="flex-1 overflow-hidden">
        <SidebarNodesTab v-if="activeSidebarTab === 'nodes'" :view-mode="viewMode" />
        <SidebarModelsTab v-else-if="activeSidebarTab === 'models'" :view-mode="viewMode" />
        <SidebarWorkflowsTab v-else-if="activeSidebarTab === 'workflows'" :view-mode="viewMode" />
        <SidebarAssetsTab v-else-if="activeSidebarTab === 'assets'" :view-mode="viewMode" />
        <SidebarTemplatesTab v-else-if="activeSidebarTab === 'templates'" :view-mode="viewMode" />
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
