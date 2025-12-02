<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useUiStore, SIDEBAR_TABS } from '@/stores/uiStore'
import { SidebarSearchBox, SidebarViewToggle } from '@/components/common/sidebar'
import SidebarNodesTab from './SidebarNodesTab.vue'
import SidebarModelsTab from './SidebarModelsTab.vue'
import SidebarWorkflowsTab from './SidebarWorkflowsTab.vue'
import LibrarySidebar from '@/components/canvas/LibrarySidebar.vue'
import AssetsSidebar from '@/components/canvas/AssetsSidebar.vue'
import TemplatesSidebar from '@/components/canvas/TemplatesSidebar.vue'

const uiStore = useUiStore()

const activeSidebarTab = computed(() => uiStore.activeSidebarTab)
const sidebarPanelExpanded = computed(() => uiStore.sidebarPanelExpanded)
const searchQuery = ref('')
const viewMode = ref<'list' | 'grid'>('list')

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
    case 'workflows':
      return [
        { label: 'Name', value: 'name' },
        { label: 'Date Modified', value: 'date' },
        { label: 'Node Count', value: 'nodes' },
      ]
    case 'assets':
      return [
        { label: 'Name', value: 'name' },
        { label: 'Type', value: 'type' },
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
    case 'workflows':
      return ['All', 'Recent', 'Favorites', 'Shared']
    case 'assets':
      return ['All', 'Images', 'Masks', 'Videos']
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
</script>

<template>
  <aside
    class="border-r border-border bg-card/95 transition-all duration-200"
    :class="sidebarPanelExpanded ? 'w-80' : 'w-0 overflow-hidden'"
  >
    <!-- Library Tab - Full custom layout -->
    <LibrarySidebar
      v-if="sidebarPanelExpanded && activeSidebarTab === 'library'"
      @close="uiStore.closeSidebarPanel()"
    />

    <!-- Assets Tab - Full custom layout -->
    <AssetsSidebar
      v-else-if="sidebarPanelExpanded && activeSidebarTab === 'assets'"
      @close="uiStore.closeSidebarPanel()"
    />

    <!-- Templates Tab - Full custom layout -->
    <TemplatesSidebar
      v-else-if="sidebarPanelExpanded && activeSidebarTab === 'templates'"
      @close="uiStore.closeSidebarPanel()"
    />

    <!-- Other Tabs - Standard layout -->
    <div v-else-if="sidebarPanelExpanded" class="flex h-full w-80 flex-col">
      <!-- Panel Header -->
      <div class="flex items-center justify-between border-b border-border px-3 py-2">
        <span class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {{ SIDEBAR_TABS.find(t => t.id === activeSidebarTab)?.label }}
        </span>
        <Button variant="ghost" size="icon" class="h-6 w-6" @click="uiStore.closeSidebarPanel()">
          <X class="size-3" />
        </Button>
      </div>

      <!-- Search & Controls -->
      <div class="border-b border-border p-2">
        <SidebarSearchBox
          v-model="searchQuery"
          :placeholder="`Search ${SIDEBAR_TABS.find(t => t.id === activeSidebarTab)?.label?.toLowerCase()}...`"
          :show-action="activeSidebarTab === 'workflows'"
          action-tooltip="Import Workflow"
        />

        <!-- View Controls -->
        <div class="mt-2 flex items-center justify-between">
          <SidebarViewToggle v-model="viewMode" />

          <!-- Filter & Sort -->
          <div class="flex items-center gap-1">
            <!-- Filter Dropdown -->
            <div class="relative">
              <button
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

            <!-- Sort Dropdown -->
            <div class="relative">
              <button
                class="flex h-6 items-center gap-1 rounded bg-muted px-2 text-[10px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                @click="showSortMenu = !showSortMenu"
              >
                <Icon name="sort-alt" size="xs" />
                <span>{{ sortOptions.find(o => o.value === sortBy)?.label }}</span>
                <Icon name="chevron-down" size="md" class="text-[8px]" />
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
          </div>
        </div>
      </div>

      <!-- Panel Content -->
      <div class="flex-1 overflow-y-auto p-2">
        <SidebarNodesTab v-if="activeSidebarTab === 'nodes'" :view-mode="viewMode" />
        <SidebarModelsTab v-else-if="activeSidebarTab === 'models'" :view-mode="viewMode" />
        <SidebarWorkflowsTab v-else-if="activeSidebarTab === 'workflows'" :view-mode="viewMode" />
      </div>
    </div>
  </aside>
</template>
