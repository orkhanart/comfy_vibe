<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { useLibraryStore, type LibraryItem } from '@/stores/libraryStore'
import { storeToRefs } from 'pinia'
import LibraryCard from './LibraryCard.vue'

const libraryStore = useLibraryStore()
const {
  viewMode,
  selectedFolder,
  filteredItems,
  sections,
} = storeToRefs(libraryStore)

// Get template items for empty state
const templateItems = libraryStore.items.filter(item => item.parentId === 'tpl-official').slice(0, 4)

function handleItemClick(item: LibraryItem): void {
  libraryStore.addToRecent(item)
  console.log('Open item:', item)
  // TODO: Open item in editor
}

function handleContextMenu(event: MouseEvent, item: LibraryItem): void {
  console.log('Context menu:', item, event)
  // TODO: Show context menu
}

function handleTemplateClick(item: LibraryItem): void {
  console.log('Use template:', item)
  // TODO: Duplicate template and open
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-border/50 px-3 py-2">
      <span class="text-xs font-medium text-foreground">
        {{ selectedFolder?.name || 'Select a folder' }}
      </span>
      <!-- View Toggle -->
      <div class="flex items-center gap-0.5 rounded-md bg-muted/50 p-0.5">
        <button
          class="rounded p-1 transition-colors"
          :class="viewMode === 'grid' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          @click="libraryStore.setViewMode('grid')"
        >
          <Icon name="th-large" size="xs" />
        </button>
        <button
          class="rounded p-1 transition-colors"
          :class="viewMode === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          @click="libraryStore.setViewMode('list')"
        >
          <Icon name="list" size="xs" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-2">
      <!-- Items Grid/List -->
      <template v-if="filteredItems.length > 0">
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-2 gap-2">
          <LibraryCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            view-mode="grid"
            @click="handleItemClick"
            @contextmenu="handleContextMenu"
          />
        </div>
        <!-- List View -->
        <div v-else class="flex flex-col gap-0.5">
          <LibraryCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            view-mode="list"
            @click="handleItemClick"
            @contextmenu="handleContextMenu"
          />
        </div>
      </template>

      <!-- Empty State -->
      <div v-else class="flex h-full flex-col items-center justify-center py-8">
        <Icon name="folder-open" size="xl" class="mb-3 text-muted-foreground/20" />
        <p class="mb-1 text-sm font-medium text-muted-foreground">No items yet</p>
        <p class="mb-4 text-xs text-muted-foreground/60">Get started with a template</p>

        <!-- Template suggestions -->
        <div class="w-full space-y-1">
          <button
            v-for="tpl in templateItems"
            :key="tpl.id"
            class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent/50"
            @click="handleTemplateClick(tpl)"
          >
            <Icon name="clone" size="sm" class="text-muted-foreground/50" />
            <div class="flex-1">
              <p class="text-xs text-foreground">{{ tpl.name }}</p>
              <p class="text-[10px] text-muted-foreground/50">{{ tpl.description }}</p>
            </div>
            <Icon name="plus" size="xs" class="text-muted-foreground/30" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
