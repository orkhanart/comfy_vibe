<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { X, Maximize2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { SidebarSearchBox } from '@/components/common/sidebar'
import SidebarWorkflowsTab from '@/components/sidebar/SidebarWorkflowsTab.vue'
import SidebarAssetsTab from '@/components/sidebar/SidebarAssetsTab.vue'
import SidebarTemplatesTab from '@/components/sidebar/SidebarTemplatesTab.vue'

type LinearSidebarTab = 'assets' | 'workflows' | 'templates' | null

interface TabConfig {
  id: Exclude<LinearSidebarTab, null>
  label: string
  icon: string
  tooltip: string
}

const LINEAR_SIDEBAR_TABS: TabConfig[] = [
  { id: 'assets', label: 'Assets', icon: 'images', tooltip: 'Assets' },
  { id: 'workflows', label: 'Workflows', icon: 'workflow', tooltip: 'Workflows' },
  { id: 'templates', label: 'Templates', icon: 'th-large', tooltip: 'Templates' },
]

const activeTab = ref<LinearSidebarTab>(null)
const searchQuery = ref('')
const viewMode = ref<'list' | 'grid'>('list')

const panelExpanded = computed(() => activeTab.value !== null)

// Sidebar resize
const sidebarWidth = ref(320)
const isResizing = ref(false)
const MIN_WIDTH = 320
const MAX_WIDTH = 480

function toggleTab(tabId: Exclude<LinearSidebarTab, null>): void {
  activeTab.value = activeTab.value === tabId ? null : tabId
}

function closePanel(): void {
  activeTab.value = null
}

function startResize(e: MouseEvent) {
  isResizing.value = true
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'ew-resize'
  document.body.style.userSelect = 'none'
}

function onResize(e: MouseEvent) {
  if (!isResizing.value) return
  // Account for icon bar width (48px)
  const newWidth = e.clientX - 48
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
const showSortMenu = ref(false)

const sortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Date Added', value: 'date' },
]

function setSort(value: string): void {
  sortBy.value = value
  showSortMenu.value = false
}
</script>

<template>
  <div class="flex h-full">
    <!-- Icon Bar -->
    <nav class="flex w-12 flex-col items-center border-r border-border bg-zinc-950 py-2">
      <!-- Tab buttons -->
      <div class="flex flex-col gap-1">
        <button
          v-for="tab in LINEAR_SIDEBAR_TABS"
          :key="tab.id"
          v-tooltip.right="{ value: tab.tooltip, showDelay: 50 }"
          class="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          :class="[
            activeTab === tab.id
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          ]"
          @click="toggleTab(tab.id)"
        >
          <Icon :name="tab.icon" size="sm" />
        </button>
      </div>
    </nav>

    <!-- Panel -->
    <aside
      class="relative border-r border-border bg-card/95 transition-all duration-200"
      :style="panelExpanded ? { width: `${sidebarWidth}px` } : { width: '0px' }"
      :class="{ 'overflow-hidden': !panelExpanded }"
    >
      <div v-if="panelExpanded" class="flex h-full flex-col" :style="{ width: `${sidebarWidth}px` }">
        <!-- Panel Header -->
        <div class="flex h-10 items-center justify-between border-b border-border px-4">
          <span class="text-sm font-medium text-foreground">
            {{ LINEAR_SIDEBAR_TABS.find(t => t.id === activeTab)?.label }}
          </span>
          <div class="flex items-center gap-0.5">
            <Button
              v-tooltip.bottom="{ value: 'Close panel', showDelay: 50 }"
              variant="ghost"
              size="icon"
              class="h-6 w-6"
              @click="closePanel"
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
              :placeholder="`Search ${LINEAR_SIDEBAR_TABS.find(t => t.id === activeTab)?.label?.toLowerCase()}...`"
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

            <!-- View Toggle -->
            <button
              v-tooltip.bottom="{ value: viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view', showDelay: 50 }"
              class="flex h-7 w-7 items-center justify-center rounded bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'"
            >
              <Icon :name="viewMode === 'grid' ? 'list' : 'th-large'" size="sm" />
            </button>
          </div>
        </div>

        <!-- Panel Content -->
        <div class="flex-1 overflow-hidden">
          <SidebarAssetsTab v-if="activeTab === 'assets'" :view-mode="viewMode" />
          <SidebarWorkflowsTab v-else-if="activeTab === 'workflows'" :view-mode="viewMode" />
          <SidebarTemplatesTab v-else-if="activeTab === 'templates'" :view-mode="viewMode" />
        </div>
      </div>

      <!-- Resize Handle -->
      <div
        v-if="panelExpanded"
        class="absolute right-0 top-0 z-10 h-full w-1 cursor-ew-resize transition-colors hover:bg-primary/50"
        :class="{ 'bg-primary/50': isResizing }"
        @mousedown="startResize"
      />
    </aside>
  </div>
</template>
