<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { SidebarTreeCategory, SidebarGridCard } from '@/components/common/sidebar'
import { MODEL_CATEGORIES_DATA, type ModelCategory, type ModelItem } from '@/data/sidebarMockData'

defineProps<{
  viewMode: 'list' | 'grid'
}>()

// Tab state: all, core, imported, shared
const activeTab = ref<'all' | 'core' | 'imported' | 'shared'>('all')

// Type filter dropdown
const typeFilter = ref<'all' | string>('all')
const showTypeDropdown = ref(false)

// Model categories with source info (mock: first 3 categories are "core", next 2 are "imported", last is "shared")
const modelCategories = ref<(ModelCategory & { source: 'core' | 'imported' | 'shared' })[]>(
  MODEL_CATEGORIES_DATA.map((c, i) => ({
    ...c,
    source: i < 3 ? 'core' as const : i < 5 ? 'imported' as const : 'shared' as const
  }))
)

// Type filter options from categories
const typeOptions = computed(() => {
  return [
    { id: 'all', label: 'All Types' },
    ...MODEL_CATEGORIES_DATA.map(c => ({ id: c.id, label: c.label }))
  ]
})

const typeFilterLabel = computed(() => {
  if (typeFilter.value === 'all') return 'All Types'
  const found = typeOptions.value.find(t => t.id === typeFilter.value)
  return found?.label || 'All Types'
})

// Filtered categories based on tab and type filter
const filteredCategories = computed(() => {
  let categories = modelCategories.value

  // Filter by tab (source)
  if (activeTab.value === 'core') {
    categories = categories.filter(c => c.source === 'core')
  } else if (activeTab.value === 'imported') {
    categories = categories.filter(c => c.source === 'imported')
  } else if (activeTab.value === 'shared') {
    categories = categories.filter(c => c.source === 'shared')
  }

  // Filter by type
  if (typeFilter.value !== 'all') {
    categories = categories.filter(c => c.id === typeFilter.value)
  }

  return categories
})

function toggleCategory(categoryId: string): void {
  const category = modelCategories.value.find(c => c.id === categoryId)
  if (category) {
    category.expanded = !category.expanded
  }
}

// Drag handler for models
function handleModelDragStart(e: DragEvent, model: ModelItem, category: ModelCategory): void {
  if (e.dataTransfer) {
    const shortcut = {
      id: `shortcut-model-${model.name}`,
      type: 'model' as const,
      label: model.display,
      icon: category.icon,
      itemId: model.name,
    }
    const jsonData = JSON.stringify(shortcut)
    e.dataTransfer.setData('application/x-library-shortcut', jsonData)
    e.dataTransfer.setData('text/plain', jsonData)
    e.dataTransfer.effectAllowed = 'copyMove'
    console.log('[Shortcut] Model drag started:', model.display)
  }
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- All/Core/Imported Tabs + Type Filter Dropdown -->
    <div class="flex items-center justify-between border-b border-border px-2 py-1.5">
      <!-- Tabs -->
      <div class="flex items-center gap-1">
        <button
          class="rounded px-2 py-1 text-[11px] font-medium transition-colors"
          :class="[
            activeTab === 'all'
              ? 'bg-accent text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          ]"
          @click="activeTab = 'all'"
        >
          <span class="flex items-center gap-1">
            <Icon name="layers" size="xs" />
            All
          </span>
        </button>
        <button
          class="rounded px-2 py-1 text-[11px] font-medium transition-colors"
          :class="[
            activeTab === 'core'
              ? 'bg-accent text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          ]"
          @click="activeTab = 'core'"
        >
          <span class="flex items-center gap-1">
            <Icon name="box" size="xs" />
            Core
          </span>
        </button>
        <button
          class="rounded px-2 py-1 text-[11px] font-medium transition-colors"
          :class="[
            activeTab === 'imported'
              ? 'bg-accent text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          ]"
          @click="activeTab = 'imported'"
        >
          <span class="flex items-center gap-1">
            <Icon name="download" size="xs" />
            Imported
          </span>
        </button>
        <button
          class="rounded px-2 py-1 text-[11px] font-medium transition-colors"
          :class="[
            activeTab === 'shared'
              ? 'bg-accent text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          ]"
          @click="activeTab = 'shared'"
        >
          <span class="flex items-center gap-1">
            <Icon name="users" size="xs" />
            Shared
          </span>
        </button>
      </div>

      <!-- Type Filter Dropdown -->
      <div class="relative">
        <button
          class="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          :class="typeFilter !== 'all' ? 'bg-accent/50 text-foreground' : ''"
          @click="showTypeDropdown = !showTypeDropdown"
        >
          <Icon name="filter" size="xs" />
          {{ typeFilterLabel }}
          <Icon name="chevron-down" size="xs" />
        </button>
        <!-- Dropdown Menu -->
        <div
          v-if="showTypeDropdown"
          class="absolute right-0 top-full z-50 mt-1 min-w-[140px] overflow-hidden rounded-md border border-border bg-popover shadow-md"
          @mouseleave="showTypeDropdown = false"
        >
          <button
            v-for="option in typeOptions"
            :key="option.id"
            class="flex w-full items-center gap-2 px-3 py-1.5 text-[11px] transition-colors hover:bg-accent"
            :class="typeFilter === option.id ? 'bg-accent text-foreground' : 'text-muted-foreground'"
            @click="typeFilter = option.id; showTypeDropdown = false"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-2">
      <!-- List View -->
      <div v-if="viewMode === 'list'" class="space-y-0.5">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="select-none"
        >
          <SidebarTreeCategory
            :icon="category.icon"
            :label="category.label"
            :count="category.models.length"
            :expanded="category.expanded"
            @toggle="toggleCategory(category.id)"
          />

          <div
            v-if="category.expanded"
            class="ml-4 space-y-0.5 border-l border-border pl-2"
          >
            <div
              v-for="model in category.models"
              :key="model.name"
              class="group flex cursor-grab items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-muted active:cursor-grabbing"
              draggable="true"
              @dragstart="handleModelDragStart($event, model, category)"
            >
              <Icon name="file" size="xs" class="text-muted-foreground/50 group-hover:text-muted-foreground" />
              <div class="min-w-0 flex-1">
                <div class="truncate text-xs text-muted-foreground group-hover:text-foreground">
                  {{ model.display }}
                </div>
                <div class="text-[10px] text-muted-foreground/50">{{ model.size }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredCategories.length === 0" class="flex h-full flex-col items-center justify-center py-8">
          <Icon name="box" size="xl" class="mb-2 text-muted-foreground/15" />
          <p class="text-xs text-muted-foreground/60">No models found</p>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else class="grid grid-cols-2 gap-1.5">
        <template v-for="category in filteredCategories" :key="category.id">
          <div
            v-for="model in category.models"
            :key="model.name"
            draggable="true"
            class="cursor-grab active:cursor-grabbing"
            @dragstart="handleModelDragStart($event, model, category)"
          >
            <SidebarGridCard
              :title="model.display"
              :subtitle="category.label"
              :draggable="false"
            >
              <template #header-left>
                <Icon :name="category.icon" size="xs" />
              </template>
              <template #header-right>
                <span class="rounded bg-muted px-1 py-0.5 text-[9px] text-muted-foreground/50">
                  {{ model.size }}
                </span>
              </template>
            </SidebarGridCard>
          </div>
        </template>

        <!-- Empty State for Grid -->
        <div v-if="filteredCategories.length === 0" class="col-span-2 flex h-full flex-col items-center justify-center py-8">
          <Icon name="box" size="xl" class="mb-2 text-muted-foreground/15" />
          <p class="text-xs text-muted-foreground/60">No models found</p>
        </div>
      </div>
    </div>
  </div>
</template>
