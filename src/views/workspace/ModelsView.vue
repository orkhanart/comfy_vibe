<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { FavoriteButton } from '@/components/common'
import { ModelCard, ImportModelDialog, ModelInfoSidebar } from '@/components/workspace'
import {
  MOCK_MODELS,
  MODEL_TYPES,
  BASE_MODEL_TYPES,
  getModelIcon,
  getModelColor,
  getBaseModelColor,
  type Model,
} from '@/data/workspaceMockData'

// View mode
type ViewMode = 'grid' | 'list'
const viewMode = ref<ViewMode>('grid')

// Filter type
type ModelType = typeof MODEL_TYPES[number]
const filterType = ref<ModelType>('all')

// Filter base model
type BaseModelType = typeof BASE_MODEL_TYPES[number]
const filterBaseModel = ref<BaseModelType>('all')

// Sort
type SortOption = 'name' | 'updated' | 'size' | 'type'
const sortBy = ref<SortOption>('updated')

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'size', label: 'Size' },
  { value: 'type', label: 'Type' }
]

// Favorites filter
const showFavoritesOnly = ref(false)

const models = ref<Model[]>([...MOCK_MODELS])

function toggleFavorite(modelId: string) {
  const model = models.value.find(m => m.id === modelId)
  if (model) {
    model.favorite = !model.favorite
  }
}

// Search, filter and sort
const searchQuery = ref('')
const filteredModels = computed(() => {
  let result = models.value

  // Filter by favorites
  if (showFavoritesOnly.value) {
    result = result.filter((m) => m.favorite)
  }

  // Filter by type
  if (filterType.value !== 'all') {
    result = result.filter((m) => m.type === filterType.value)
  }

  // Filter by base model
  if (filterBaseModel.value !== 'all') {
    result = result.filter((m) => m.baseModel === filterBaseModel.value)
  }

  // Filter by search (includes trigger words)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((m) =>
      m.name.toLowerCase().includes(query) ||
      m.triggerWords?.some(tw => tw.toLowerCase().includes(query))
    )
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

function handleModelMenu(modelId: string, _event: MouseEvent) {
  openModelInfo(modelId)
}

// Import Model Dialog
const showImportDialog = ref(false)

function handleImportModel(modelUrl: string) {
  console.log('Import model:', modelUrl)
  // TODO: Implement actual import logic
}

// Model Info Sidebar
const showModelInfo = ref(false)
const selectedModel = ref<Model | null>(null)

function openModelInfo(modelId: string) {
  const model = models.value.find(m => m.id === modelId)
  if (model) {
    selectedModel.value = model
    showModelInfo.value = true
  }
}

function closeModelInfo() {
  showModelInfo.value = false
  selectedModel.value = null
}

function handleApplyModel(modelId: string) {
  console.log('Apply model to node:', modelId)
  // TODO: Implement apply to node
}

function handleDeleteModel(modelId: string) {
  console.log('Delete model:', modelId)
  // TODO: Implement delete
  closeModelInfo()
}
</script>

<template>
  <div class="flex h-full">
    <!-- Main Content -->
    <div class="flex-1 overflow-auto p-6 transition-all duration-300 ease-out" @click="closeModelInfo()">
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
        @click="showImportDialog = true"
      >
        <Icon name="download" size="xs" />
        Import Model
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
      <div class="relative">
        <select
          v-model="filterType"
          class="appearance-none rounded-md border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm capitalize text-zinc-700 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
        >
          <option v-for="type in MODEL_TYPES" :key="type" :value="type" class="capitalize">
            {{ type === 'all' ? 'All Types' : type }}
          </option>
        </select>
        <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>

      <!-- Base Model Filter -->
      <div class="relative">
        <select
          v-model="filterBaseModel"
          class="appearance-none rounded-md border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
        >
          <option v-for="baseModel in BASE_MODEL_TYPES" :key="baseModel" :value="baseModel">
            {{ baseModel === 'all' ? 'All Base Models' : baseModel }}
          </option>
        </select>
        <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
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

      <!-- Favorites Filter -->
      <button
        :class="[
          'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
          showFavoritesOnly
            ? 'border-amber-500 bg-amber-50 text-amber-500 dark:border-amber-500 dark:bg-amber-500/10'
            : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300 hover:text-amber-500 dark:border-border dark:bg-muted dark:hover:border-zinc-600'
        ]"
        @click="showFavoritesOnly = !showFavoritesOnly"
      >
        <Icon :name="showFavoritesOnly ? 'star-fill' : 'star'" size="sm" />
      </button>
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
        @toggle-favorite="toggleFavorite"
        @menu="handleModelMenu"
      />
    </div>

    <!-- List View -->
    <div v-else class="rounded-lg border border-zinc-200 bg-white dark:border-border dark:bg-card">
      <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
        <div
          v-for="model in filteredModels"
          :key="model.id"
          class="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
        >
          <!-- Favorite Button -->
          <FavoriteButton
            :is-favorite="model.favorite"
            variant="toolbar"
            size="sm"
            @toggle="toggleFavorite(model.id)"
          />
          <div :class="['flex h-10 w-10 items-center justify-center rounded-md', getModelColor(model.type)]">
            <Icon :name="getModelIcon(model.type)" size="sm" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-zinc-900 dark:text-foreground">{{ model.name }}</p>
            <p class="text-sm text-muted-foreground dark:text-muted-foreground">Version {{ model.version }}</p>
          </div>
          <!-- Base Model Badge -->
          <span :class="['rounded px-2 py-0.5 text-xs font-medium', getBaseModelColor(model.baseModel)]">
            {{ model.baseModel }}
          </span>
          <span :class="['rounded-full px-2 py-0.5 text-xs font-medium capitalize', getModelColor(model.type)]">
            {{ model.type }}
          </span>
          <span class="w-20 text-right text-sm text-muted-foreground dark:text-muted-foreground">{{ model.size }}</span>
          <span class="w-24 text-right text-sm text-muted-foreground dark:text-muted-foreground">{{ model.updatedAt }}</span>
        </div>
      </div>
    </div>

    <!-- Import Model Dialog -->
    <ImportModelDialog
      v-model:visible="showImportDialog"
      @import="handleImportModel"
    />
    </div>

    <!-- Model Info Sidebar -->
    <ModelInfoSidebar
      v-if="showModelInfo && selectedModel"
      :model="selectedModel"
      @close="closeModelInfo"
      @apply="handleApplyModel"
      @delete="handleDeleteModel"
    />
  </div>
</template>
