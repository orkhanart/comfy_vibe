<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@/components/ui/icon'
import { SidebarTreeCategory, SidebarGridCard } from '@/components/common/sidebar'
import { ImportModelDialog } from '@/components/common'
import { MODEL_CATEGORIES_DATA, type ModelCategory, type ModelItem } from '@/data/sidebarMockData'
import { useModelsStore } from '@/stores/modelsStore'

defineProps<{
  viewMode: 'list' | 'grid'
}>()

// Import dialog state
const showImportDialog = ref(false)

// Models store for imported models
const modelsStore = useModelsStore()

// Tab state: all, core, imported, shared
const activeTab = ref<'all' | 'core' | 'imported' | 'shared'>('all')

// Model categories with source info (mock: first 3 categories are "core", next 2 are "imported", last is "shared")
const modelCategories = ref<(ModelCategory & { source: 'core' | 'imported' | 'shared' })[]>(
  MODEL_CATEGORIES_DATA.map((c, i) => ({
    ...c,
    source: i < 3 ? 'core' as const : i < 5 ? 'imported' as const : 'shared' as const
  }))
)

// Create imported category from modelsStore
const importedCategory = computed<(ModelCategory & { source: 'imported' })>(() => ({
  id: 'imported-models',
  icon: 'download',
  label: 'Imported',
  expanded: true,
  source: 'imported' as const,
  models: modelsStore.importedModels.map(m => ({
    name: m.id,
    display: m.name,
    size: m.size,
  }))
}))

// Filtered categories based on tab
const filteredCategories = computed(() => {
  // Start with core categories (first 3 from mock data)
  let coreCategories = modelCategories.value.filter(c => c.source === 'core')
  // Get shared categories (from mock data)
  let sharedCategories = modelCategories.value.filter(c => c.source === 'shared')

  // Filter by tab (source)
  if (activeTab.value === 'core') {
    return coreCategories
  } else if (activeTab.value === 'imported') {
    // Show only the real imported models from store
    return importedCategory.value.models.length > 0 ? [importedCategory.value] : []
  } else if (activeTab.value === 'shared') {
    return sharedCategories
  }

  // 'all' tab - combine everything
  const allCategories = [...coreCategories]
  if (importedCategory.value.models.length > 0) {
    allCategories.push(importedCategory.value)
  }
  allCategories.push(...sharedCategories)
  return allCategories
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
    <!-- All/Core/Imported Tabs -->
    <div class="flex items-center gap-1 border-b border-border px-2 py-1.5">
      <button
        class="rounded px-2 py-1 text-[11px] font-medium transition-colors"
        :class="[
          activeTab === 'all'
            ? 'bg-accent text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        ]"
        @click="activeTab = 'all'"
      >
        All
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
        Core
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
        Imported
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
        Shared
      </button>

      <!-- Import Model Button -->
      <button
        class="ml-auto flex shrink-0 items-center gap-1 rounded bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        @click="showImportDialog = true"
      >
        <Icon name="plus" size="xs" />
        Import
      </button>
    </div>

    <!-- Import Model Dialog -->
    <ImportModelDialog v-model:open="showImportDialog" />

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
