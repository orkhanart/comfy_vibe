<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { Maximize2, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { SidebarSearchBox, SidebarViewToggle, LibraryGridCard } from '@/components/common/sidebar'

interface WorkflowItem {
  id: string
  name: string
  description: string
  nodes: number
  thumbnail?: string
  badge?: string
  badgeClass?: string
  updatedAt: string
  isFavorite?: boolean
}

const emit = defineEmits<{
  close: []
}>()

const searchQuery = ref('')
const viewMode = ref<'list' | 'grid'>('grid')
const sortBy = ref('recent')
const showFilterMenu = ref(false)
const showSortMenu = ref(false)
const activeFilters = ref<Set<string>>(new Set())

const sortOptions = [
  { label: 'Recent', value: 'recent' },
  { label: 'Name', value: 'name' },
  { label: 'Nodes', value: 'nodes' },
]

const filterOptions = [
  { label: 'Favorites', value: 'favorites', icon: 'star', color: 'text-amber-400' },
  { label: 'Recent', value: 'recent', icon: 'clock', color: 'text-blue-400' },
  { label: 'Shared', value: 'shared', icon: 'share-alt', color: 'text-green-400' },
]

function setSort(value: string): void {
  sortBy.value = value
  showSortMenu.value = false
}

function toggleFilter(value: string): void {
  const newFilters = new Set(activeFilters.value)
  if (newFilters.has(value)) {
    newFilters.delete(value)
  } else {
    newFilters.add(value)
  }
  activeFilters.value = newFilters
}

function clearFilters(): void {
  activeFilters.value = new Set()
}

const filterLabel = computed(() => {
  if (activeFilters.value.size === 0) return 'All'
  if (activeFilters.value.size === 1) {
    const value = [...activeFilters.value][0]
    return filterOptions.find(o => o.value === value)?.label || 'All'
  }
  return `${activeFilters.value.size} selected`
})

// Mock workflows data
const allWorkflows = computed<WorkflowItem[]>(() => [
  { id: '1', name: 'Text to Image', description: 'Basic text to image generation', nodes: 8, thumbnail: '/assets/card_images/workflow_01.webp', badge: 'SDXL', badgeClass: 'bg-purple-500/30 text-purple-300', updatedAt: '2 hours ago', isFavorite: true },
  { id: '2', name: 'Image to Image', description: 'Transform existing images', nodes: 12, thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp', badge: 'img2img', badgeClass: 'bg-blue-500/30 text-blue-300', updatedAt: '1 day ago', isFavorite: true },
  { id: '3', name: 'Upscale 4x', description: 'High quality upscaling', nodes: 5, thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', badge: 'Upscale', badgeClass: 'bg-green-500/30 text-green-300', updatedAt: '3 days ago' },
  { id: '4', name: 'Inpainting', description: 'Edit parts of an image', nodes: 15, thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', badge: 'Inpaint', badgeClass: 'bg-amber-500/30 text-amber-300', updatedAt: '1 week ago', isFavorite: true },
  { id: '5', name: 'ControlNet Pose', description: 'Pose-guided generation', nodes: 18, thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', badge: 'ControlNet', badgeClass: 'bg-cyan-500/30 text-cyan-300', updatedAt: '2 weeks ago' },
  { id: '6', name: 'Face Swap', description: 'Swap faces between images', nodes: 22, thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', badge: 'Face', badgeClass: 'bg-pink-500/30 text-pink-300', updatedAt: '3 weeks ago' },
])

// Filter and search
const filteredWorkflows = computed(() => {
  let items = allWorkflows.value

  // Apply filters
  if (activeFilters.value.has('favorites')) {
    items = items.filter(i => i.isFavorite)
  }

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(i =>
      i.name.toLowerCase().includes(query) ||
      i.description.toLowerCase().includes(query)
    )
  }

  // Apply sort
  if (sortBy.value === 'name') {
    items = [...items].sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'nodes') {
    items = [...items].sort((a, b) => b.nodes - a.nodes)
  }

  return items
})
</script>

<template>
  <div class="flex h-full w-80 flex-col">
    <!-- Panel Header -->
    <div class="flex items-center justify-between border-b border-border px-3 py-2">
      <span class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        WORKFLOWS
      </span>
      <div class="flex items-center gap-1">
        <Button variant="ghost" size="icon" class="h-6 w-6">
          <Maximize2 class="size-3" />
        </Button>
        <Button variant="ghost" size="icon" class="h-6 w-6" @click="emit('close')">
          <X class="size-3" />
        </Button>
      </div>
    </div>

    <!-- Search & Controls -->
    <div class="border-b border-border p-2">
      <SidebarSearchBox
        v-model="searchQuery"
        placeholder="Search workflows..."
        :show-action="true"
        action-tooltip="Import Workflow"
        action-icon="upload"
      />

      <!-- View Controls -->
      <div class="mt-2 flex items-center justify-between">
        <SidebarViewToggle v-model="viewMode" />

        <!-- Filter & Sort -->
        <div class="flex items-center gap-1">
          <!-- Filter Dropdown -->
          <div class="relative">
            <button
              :class="[
                'flex h-6 items-center gap-1 rounded px-2 text-[10px] transition-colors',
                activeFilters.size > 0
                  ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
              ]"
              @click="showFilterMenu = !showFilterMenu"
            >
              <Icon name="filter" size="xs" />
              <span>{{ filterLabel }}</span>
              <Icon name="chevron-down" size="md" class="text-[8px]" />
            </button>
            <div
              v-if="showFilterMenu"
              class="absolute left-0 top-full z-50 mt-1 w-36 rounded-lg border border-border bg-popover py-1 shadow-xl"
            >
              <!-- Clear all -->
              <button
                v-if="activeFilters.size > 0"
                class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                @click="clearFilters"
              >
                <Icon name="times" size="xs" />
                Clear all
              </button>
              <div v-if="activeFilters.size > 0" class="mx-2 my-1 h-px bg-muted" />
              <!-- Filter options -->
              <button
                v-for="option in filterOptions"
                :key="option.value"
                class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors hover:bg-muted"
                @click="toggleFilter(option.value)"
              >
                <div
                  :class="[
                    'flex h-3.5 w-3.5 items-center justify-center rounded border transition-colors',
                    activeFilters.has(option.value)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-muted-foreground/50 bg-transparent'
                  ]"
                >
                  <Icon v-if="activeFilters.has(option.value)" name="check" size="xs" class="text-white" />
                </div>
                <Icon :name="option.icon" size="xs" :class="option.color" />
                <span :class="activeFilters.has(option.value) ? 'text-foreground' : 'text-muted-foreground'">
                  {{ option.label }}
                </span>
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
              class="absolute right-0 top-full z-50 mt-1 min-w-[100px] rounded-lg border border-border bg-popover py-1 shadow-xl"
            >
              <button
                v-for="option in sortOptions"
                :key="option.value"
                class="flex w-full items-center px-3 py-1.5 text-left text-xs transition-colors"
                :class="sortBy === option.value ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
                @click="setSort(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-2">
      <!-- Empty State -->
      <div
        v-if="filteredWorkflows.length === 0"
        class="flex flex-col items-center justify-center py-8 text-center"
      >
        <Icon name="folder-open" size="2xl" class="mb-2 text-muted-foreground/50" />
        <p class="text-xs text-muted-foreground">No workflows found</p>
      </div>

      <!-- List View -->
      <div v-else-if="viewMode === 'list'" class="select-none space-y-0.5">
        <div
          v-for="workflow in filteredWorkflows"
          :key="workflow.id"
          class="group flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-muted"
          draggable="true"
        >
          <Icon name="sitemap" size="xs" class="text-muted-foreground" />
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5">
              <span class="truncate text-xs text-foreground group-hover:text-foreground">{{ workflow.name }}</span>
              <Icon v-if="workflow.isFavorite" name="star" size="xs" class="text-amber-400" />
            </div>
            <div class="flex items-center gap-2 text-[10px] text-muted-foreground/50">
              <span v-if="workflow.badge" :class="['rounded px-1 py-0.5 text-[9px]', workflow.badgeClass]">
                {{ workflow.badge }}
              </span>
              <span>{{ workflow.nodes }} nodes</span>
              <span>{{ workflow.updatedAt }}</span>
            </div>
          </div>
          <Icon name="chevron-right" size="xs" class="text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      <!-- Grid View -->
      <div v-else class="grid grid-cols-1 gap-2">
        <LibraryGridCard
          v-for="workflow in filteredWorkflows"
          :key="workflow.id"
          :title="workflow.name"
          :subtitle="`${workflow.nodes} nodes · ${workflow.updatedAt}`"
          :thumbnail="workflow.thumbnail"
          icon="sitemap"
          icon-class="text-muted-foreground"
          :badge="workflow.badge"
          :badge-class="workflow.badgeClass"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
div::-webkit-scrollbar {
  width: 4px;
}

div::-webkit-scrollbar-track {
  background: transparent;
}

div::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 2px;
}

div::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>
