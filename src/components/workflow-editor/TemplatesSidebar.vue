<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { Maximize2, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { SidebarSearchBox, SidebarViewToggle, LibraryGridCard } from '@/components/common/sidebar'
import { TEMPLATE_CATEGORIES_DATA } from '@/data/sidebarMockData'

interface TemplateItem {
  id: string
  name: string
  description: string
  category: string
  categoryIcon: string
  nodes: number
  thumbnail?: string
  badge?: string
  badgeClass?: string
}

const emit = defineEmits<{
  close: []
}>()

const searchQuery = ref('')
const viewMode = ref<'list' | 'grid'>('grid')
const sortBy = ref('name')
const showFilterMenu = ref(false)
const showSortMenu = ref(false)
const activeFilters = ref<Set<string>>(new Set())

const sortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Node Count', value: 'nodes' },
]

const filterOptions = [
  { label: 'Official', value: 'official', icon: 'verified', color: 'text-blue-400' },
  { label: 'SDXL', value: 'sdxl', icon: 'star', color: 'text-purple-400' },
  { label: 'ControlNet', value: 'controlnet', icon: 'sliders-v', color: 'text-amber-400' },
  { label: 'Video', value: 'video', icon: 'video', color: 'text-green-400' },
  { label: 'Community', value: 'community', icon: 'users', color: 'text-cyan-400' },
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

// Combine all templates into a flat list
const allTemplates = computed<TemplateItem[]>(() => {
  const items: TemplateItem[] = []

  const categoryColors: Record<string, { badge: string; badgeClass: string }> = {
    official: { badge: 'Official', badgeClass: 'bg-blue-500/30 text-blue-300' },
    sdxl: { badge: 'SDXL', badgeClass: 'bg-purple-500/30 text-purple-300' },
    controlnet: { badge: 'ControlNet', badgeClass: 'bg-amber-500/30 text-amber-300' },
    video: { badge: 'Video', badgeClass: 'bg-green-500/30 text-green-300' },
    community: { badge: 'Community', badgeClass: 'bg-cyan-500/30 text-cyan-300' },
  }

  TEMPLATE_CATEGORIES_DATA.forEach(category => {
    category.templates.forEach(template => {
      const colors = categoryColors[category.id] || { badge: category.label, badgeClass: 'bg-muted text-muted-foreground' }
      items.push({
        id: `${category.id}-${template.name}`,
        name: template.display,
        description: template.description,
        category: category.id,
        categoryIcon: category.icon,
        nodes: template.nodes,
        badge: colors.badge,
        badgeClass: colors.badgeClass,
      })
    })
  })

  return items
})

// Filter and search
const filteredTemplates = computed(() => {
  let items = allTemplates.value

  // Apply category filters (multi-select)
  if (activeFilters.value.size > 0) {
    items = items.filter(i => activeFilters.value.has(i.category))
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
        TEMPLATES
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
        placeholder="Search templates..."
        :show-action="true"
        action-tooltip="Browse Templates"
        action-icon="external-link"
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
        v-if="filteredTemplates.length === 0"
        class="flex flex-col items-center justify-center py-8 text-center"
      >
        <Icon name="copy" size="2xl" class="mb-2 text-muted-foreground/50" />
        <p class="text-xs text-muted-foreground">No templates found</p>
      </div>

      <!-- List View -->
      <div v-else-if="viewMode === 'list'" class="select-none space-y-0.5">
        <div
          v-for="template in filteredTemplates"
          :key="template.id"
          class="group flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-muted"
          draggable="true"
        >
          <Icon :name="template.categoryIcon" size="xs" />
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5">
              <span class="truncate text-xs text-foreground group-hover:text-foreground">{{ template.name }}</span>
            </div>
            <div class="flex items-center gap-2 text-[10px] text-muted-foreground/50">
              <span v-if="template.badge" :class="['rounded px-1 py-0.5 text-[9px]', template.badgeClass]">
                {{ template.badge }}
              </span>
              <span>{{ template.nodes }} nodes</span>
            </div>
          </div>
          <Icon name="plus" size="xs" class="text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      <!-- Grid View -->
      <div v-else class="grid grid-cols-1 gap-2">
        <LibraryGridCard
          v-for="template in filteredTemplates"
          :key="template.id"
          :title="template.name"
          :subtitle="`${template.nodes} nodes · ${template.description}`"
          :icon="template.categoryIcon"
          icon-class="text-muted-foreground"
          :badge="template.badge"
          :badge-class="template.badgeClass"
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
