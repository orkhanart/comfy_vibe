<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { ModelCard } from '@/components/workspace'
import {
  MOCK_MODELS,
  MODEL_TYPES,
  getModelIcon,
  getModelColor,
  type Model,
} from '@/data/workspaceMockData'

// View mode
type ViewMode = 'grid' | 'list'
const viewMode = ref<ViewMode>('grid')

// Filter type
type ModelType = typeof MODEL_TYPES[number]
const filterType = ref<ModelType>('all')

// Sort
type SortOption = 'name' | 'updated' | 'size' | 'type'
const sortBy = ref<SortOption>('updated')

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'size', label: 'Size' },
  { value: 'type', label: 'Type' }
]

const models = ref<Model[]>([...MOCK_MODELS])

// Search, filter and sort
const searchQuery = ref('')
const filteredModels = computed(() => {
  let result = models.value

  // Filter by type
  if (filterType.value !== 'all') {
    result = result.filter((m) => m.type === filterType.value)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((m) => m.name.toLowerCase().includes(query))
  }

  // Sort
  result = [...result].sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'size':
        return b.sizeBytes - a.sizeBytes
      case 'type':
        return a.type.localeCompare(b.type)
      case 'updated':
      default:
        return b.updatedTimestamp - a.updatedTimestamp
    }
  })

  return result
})

function openModel(modelId: string) {
  console.log('Open model:', modelId)
}

function handleModelMenu(modelId: string, event: MouseEvent) {
  console.log('Model menu:', modelId, event)
}
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-foreground">
          Models
        </h1>
        <p class="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
          {{ models.length }} models installed
        </p>
      </div>
      <button
        class="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        <Icon name="plus" size="xs" />
        Add Model
      </button>
    </div>

    <!-- Search, Filter, Sort & View Toggle -->
    <div class="mb-6 flex items-center gap-3">
      <div class="relative flex-1">
        <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search models..."
          class="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
        />
      </div>

      <!-- Type Filter -->
      <div class="flex rounded-md border border-zinc-200 dark:border-border">
        <button
          v-for="type in MODEL_TYPES"
          :key="type"
          :class="[
            'px-3 py-2 text-sm capitalize transition-colors',
            filterType === type
              ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground'
              : 'text-muted-foreground hover:text-zinc-900 dark:text-muted-foreground dark:hover:text-foreground'
          ]"
          @click="filterType = type"
        >
          {{ type }}
        </button>
      </div>

      <!-- Sort -->
      <div class="relative">
        <select
          v-model="sortBy"
          class="appearance-none rounded-md border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
        >
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>

      <!-- View Toggle -->
      <div class="flex rounded-md border border-zinc-200 dark:border-border">
        <button
          :class="[
            'px-3 py-2 text-sm transition-colors',
            viewMode === 'grid'
              ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground'
              : 'text-muted-foreground hover:text-zinc-900 dark:text-muted-foreground dark:hover:text-foreground'
          ]"
          @click="viewMode = 'grid'"
        >
          <Icon name="th-large" size="md" />
        </button>
        <button
          :class="[
            'px-3 py-2 text-sm transition-colors',
            viewMode === 'list'
              ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground'
              : 'text-muted-foreground hover:text-zinc-900 dark:text-muted-foreground dark:hover:text-foreground'
          ]"
          @click="viewMode = 'list'"
        >
          <Icon name="list" size="md" />
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredModels.length === 0"
      class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border"
    >
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-muted">
        <Icon name="box" size="xl" class="text-muted-foreground" />
      </div>
      <h3 class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">No models found</h3>
      <p class="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
        {{ searchQuery || filterType !== 'all' ? 'Try different filters' : 'Add models to get started' }}
      </p>
    </div>

    <!-- Grid View -->
    <div
      v-else-if="viewMode === 'grid'"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      <ModelCard
        v-for="model in filteredModels"
        :key="model.id"
        :model="model"
        @open="openModel"
        @menu="handleModelMenu"
      />
    </div>

    <!-- List View -->
    <div v-else class="rounded-lg border border-zinc-200 bg-white dark:border-border dark:bg-card">
      <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
        <div
          v-for="model in filteredModels"
          :key="model.id"
          class="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
        >
          <div :class="['flex h-10 w-10 items-center justify-center rounded-md', getModelColor(model.type)]">
            <Icon :name="getModelIcon(model.type)" size="sm" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-zinc-900 dark:text-foreground">{{ model.name }}</p>
            <p class="text-sm text-muted-foreground dark:text-muted-foreground">Version {{ model.version }}</p>
          </div>
          <span :class="['rounded-full px-2 py-0.5 text-xs font-medium capitalize', getModelColor(model.type)]">
            {{ model.type }}
          </span>
          <span class="w-20 text-right text-sm text-muted-foreground dark:text-muted-foreground">{{ model.size }}</span>
          <span class="w-24 text-right text-sm text-muted-foreground dark:text-muted-foreground">{{ model.updatedAt }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
