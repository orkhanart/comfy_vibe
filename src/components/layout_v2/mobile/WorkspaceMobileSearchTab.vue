<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'

const searchQuery = ref('')
const activeFilter = ref<'all' | 'workflows' | 'assets' | 'models' | 'templates'>('all')

const filters = [
  { id: 'all', label: 'All' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'assets', label: 'Assets' },
  { id: 'models', label: 'Models' },
  { id: 'templates', label: 'Templates' },
] as const

interface SearchResult {
  id: string
  name: string
  type: 'workflow' | 'asset' | 'model' | 'template'
  thumbnail: string
  description?: string
}

const allResults = ref<SearchResult[]>([
  { id: '1', name: 'Portrait Workflow', type: 'workflow', thumbnail: '/assets/card_images/workflow_01.webp', description: 'High quality portrait generation' },
  { id: '2', name: 'Landscape Pack', type: 'asset', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', description: '50 landscape references' },
  { id: '3', name: 'SDXL Lightning', type: 'model', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', description: 'Fast SDXL model' },
  { id: '4', name: 'Text to Image', type: 'template', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', description: 'Basic txt2img workflow' },
  { id: '5', name: 'Product Photography', type: 'workflow', thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', description: 'E-commerce product shots' },
])

const recentSearches = ref([
  'portrait workflow',
  'upscale',
  'controlnet',
  'inpainting',
])

const filteredResults = computed(() => {
  let results = allResults.value

  if (activeFilter.value !== 'all') {
    const typeMap: Record<string, string> = {
      workflows: 'workflow',
      assets: 'asset',
      models: 'model',
      templates: 'template',
    }
    results = results.filter(r => r.type === typeMap[activeFilter.value])
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    results = results.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.description?.toLowerCase().includes(query)
    )
  }

  return results
})

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    workflow: 'bg-purple-500/80',
    asset: 'bg-green-500/80',
    model: 'bg-blue-500/80',
    template: 'bg-amber-500/80'
  }
  return colors[type] || 'bg-zinc-500/80'
}

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    workflow: 'sitemap',
    asset: 'images',
    model: 'box',
    template: 'th-large'
  }
  return icons[type] || 'file'
}

function clearSearch(): void {
  searchQuery.value = ''
}

function useRecentSearch(term: string): void {
  searchQuery.value = term
}

function clearRecentSearches(): void {
  recentSearches.value = []
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <!-- Search Input -->
    <div class="border-b border-border p-4">
      <div class="relative">
        <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search everything..."
          class="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-10 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary"
        />
        <button
          v-if="searchQuery"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          @click="clearSearch"
        >
          <Icon name="times" size="sm" />
        </button>
      </div>

      <!-- Filter Pills -->
      <div class="mt-3 flex gap-2 overflow-x-auto">
        <button
          v-for="filter in filters"
          :key="filter.id"
          :class="[
            'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
            activeFilter === filter.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-muted-foreground'
          ]"
          @click="activeFilter = filter.id"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Recent Searches (when no query) -->
      <div v-if="!searchQuery && recentSearches.length > 0" class="p-4">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent searches</h2>
          <button class="text-xs text-primary" @click="clearRecentSearches">Clear</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="term in recentSearches"
            :key="term"
            class="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs text-foreground"
            @click="useRecentSearch(term)"
          >
            <Icon name="clock" size="xs" class="text-muted-foreground" />
            {{ term }}
          </button>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchQuery || activeFilter !== 'all'" class="p-4">
        <h2 class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {{ filteredResults.length }} results
        </h2>

        <div v-if="filteredResults.length > 0" class="flex flex-col gap-2">
          <div
            v-for="result in filteredResults"
            :key="result.id"
            class="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <div class="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <img :src="result.thumbnail" :alt="result.name" class="h-full w-full object-cover" />
              <span :class="['absolute bottom-0.5 right-0.5 rounded p-0.5', getTypeColor(result.type)]">
                <Icon :name="getTypeIcon(result.type)" size="xs" class="text-white" />
              </span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-foreground">{{ result.name }}</p>
              <p v-if="result.description" class="truncate text-xs text-muted-foreground">{{ result.description }}</p>
            </div>
            <Icon name="chevron-right" size="sm" class="shrink-0 text-muted-foreground" />
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-12 text-center">
          <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <Icon name="search" size="lg" class="text-muted-foreground" />
          </div>
          <p class="text-sm font-medium text-foreground">No results found</p>
          <p class="mt-1 text-xs text-muted-foreground">Try a different search term</p>
        </div>
      </div>

      <!-- Browse Categories (when no query and no filter) -->
      <div v-if="!searchQuery && activeFilter === 'all'" class="p-4">
        <h2 class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Browse by type</h2>
        <div class="grid grid-cols-2 gap-3">
          <button
            class="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            @click="activeFilter = 'workflows'"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Icon name="sitemap" size="md" class="text-purple-500" />
            </div>
            <div class="text-left">
              <p class="text-sm font-medium text-foreground">Workflows</p>
              <p class="text-xs text-muted-foreground">24 items</p>
            </div>
          </button>
          <button
            class="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            @click="activeFilter = 'assets'"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Icon name="images" size="md" class="text-green-500" />
            </div>
            <div class="text-left">
              <p class="text-sm font-medium text-foreground">Assets</p>
              <p class="text-xs text-muted-foreground">156 items</p>
            </div>
          </button>
          <button
            class="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            @click="activeFilter = 'models'"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Icon name="box" size="md" class="text-blue-500" />
            </div>
            <div class="text-left">
              <p class="text-sm font-medium text-foreground">Models</p>
              <p class="text-xs text-muted-foreground">12 items</p>
            </div>
          </button>
          <button
            class="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            @click="activeFilter = 'templates'"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Icon name="th-large" size="md" class="text-amber-500" />
            </div>
            <div class="text-left">
              <p class="text-sm font-medium text-foreground">Templates</p>
              <p class="text-xs text-muted-foreground">48 items</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
