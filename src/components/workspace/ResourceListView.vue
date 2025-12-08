<script setup lang="ts">
import { Icon } from '@/components/ui/icon'

export interface SortOption {
  value: string
  label: string
}

export interface FilterOption {
  value: string
  label: string
}

const props = withDefaults(defineProps<{
  searchPlaceholder?: string
  sortOptions: SortOption[]
  filterOptions?: FilterOption[]
  emptyIcon?: string
  emptyTitle?: string
  emptyDescription?: string
  primaryActionLabel?: string
  primaryActionIcon?: string
  showNewFolder?: boolean
  isEmpty?: boolean
  hideFavoritesFilter?: boolean
  hideCreateFolder?: boolean
}>(), {
  searchPlaceholder: 'Search...',
  emptyIcon: 'folder',
  emptyTitle: 'No items found',
  emptyDescription: 'Try a different search term',
  showNewFolder: true,
  isEmpty: false,
  hideFavoritesFilter: false,
  hideCreateFolder: false,
})

const searchQuery = defineModel<string>('searchQuery', { default: '' })
const sortBy = defineModel<string>('sortBy', { required: true })
const viewMode = defineModel<'grid' | 'list'>('viewMode', { default: 'grid' })
const showFavoritesOnly = defineModel<boolean>('showFavoritesOnly', { default: false })
const filterType = defineModel<string>('filterType')

const emit = defineEmits<{
  createFolder: []
  primaryAction: []
}>()
</script>

<template>
  <div>
    <!-- Action Bar -->
    <div class="mb-4 flex items-center gap-3">
      <!-- Search -->
      <div class="relative flex-1">
        <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:placeholder-zinc-500"
        />
      </div>

      <!-- Filter Type (optional) -->
      <div v-if="filterOptions" class="relative">
        <select
          v-model="filterType"
          class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground"
        >
          <option v-for="option in filterOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>

      <!-- Additional Filters Slot -->
      <slot name="filters" />

      <!-- Sort -->
      <div class="relative">
        <select
          v-model="sortBy"
          class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground"
        >
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>

      <!-- View Toggle -->
      <div class="flex rounded-lg border border-zinc-200 dark:border-border">
        <button
          :class="['px-3 py-2 text-sm transition-colors', viewMode === 'grid' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground' : 'text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground']"
          @click="viewMode = 'grid'"
        >
          <Icon name="th-large" size="md" />
        </button>
        <button
          :class="['px-3 py-2 text-sm transition-colors', viewMode === 'list' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground' : 'text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground']"
          @click="viewMode = 'list'"
        >
          <Icon name="list" size="md" />
        </button>
      </div>

      <!-- Favorites Filter -->
      <button
        v-if="!hideFavoritesFilter"
        :class="['flex h-9 w-9 items-center justify-center rounded-lg border transition-colors', showFavoritesOnly ? 'border-amber-500 bg-amber-50 text-amber-500 dark:border-amber-500 dark:bg-amber-500/10' : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300 hover:text-amber-500 dark:border-border dark:bg-muted']"
        @click="showFavoritesOnly = !showFavoritesOnly"
      >
        <Icon :name="showFavoritesOnly ? 'star-fill' : 'star'" size="sm" />
      </button>

      <!-- New Folder -->
      <button
        v-if="showNewFolder && !hideCreateFolder"
        class="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent"
        @click="emit('createFolder')"
      >
        <Icon name="folder-plus" size="xs" />
        New Folder
      </button>

      <!-- Primary Action -->
      <button
        v-if="primaryActionLabel"
        class="flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        @click="emit('primaryAction')"
      >
        <Icon v-if="primaryActionIcon" :name="primaryActionIcon" size="xs" />
        {{ primaryActionLabel }}
      </button>
    </div>

    <!-- Content -->
    <template v-if="!isEmpty">
      <!-- Folders Slot (appears before items) -->
      <slot name="folders" />

      <!-- Grid View -->
      <div
        v-if="viewMode === 'grid'"
        class="grid gap-4"
        style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));"
      >
        <slot name="grid" />
      </div>

      <!-- List View -->
      <div
        v-else
        class="rounded-xl border border-zinc-200 bg-white dark:border-border dark:bg-card"
      >
        <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
          <slot name="list" />
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border"
    >
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <Icon :name="emptyIcon" size="xl" class="text-zinc-400" />
      </div>
      <p class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">{{ emptyTitle }}</p>
      <p class="mt-1 text-sm text-muted-foreground">{{ emptyDescription }}</p>
    </div>
  </div>
</template>
