<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { useLibraryStore } from '@/stores/libraryStore'
import { storeToRefs } from 'pinia'

const libraryStore = useLibraryStore()
const {
  sections,
  selectedFolderId,
  recentItems,
} = storeToRefs(libraryStore)

function handleFolderClick(folderId: string): void {
  libraryStore.selectFolder(folderId)
}

function handleSectionToggle(sectionId: string): void {
  libraryStore.toggleSection(sectionId)
}

function handleRecentClick(itemId: string): void {
  const item = libraryStore.getItemById(itemId)
  if (item) {
    libraryStore.addToRecent(item)
    // TODO: Open item
    console.log('Open recent item:', item)
  }
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <!-- Recent Section -->
    <div v-if="recentItems.length > 0" class="border-b border-border/50 pb-1">
      <div class="flex items-center gap-1.5 px-2 py-1.5">
        <Icon name="clock" size="xs" class="text-muted-foreground/50" />
        <span class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
          Recent
        </span>
      </div>
      <div class="flex flex-col">
        <button
          v-for="recent in recentItems"
          :key="recent.id"
          class="flex items-center gap-1.5 px-3 py-1 text-left transition-colors hover:bg-accent/50"
          @click="handleRecentClick(recent.itemId)"
        >
          <Icon
            :name="recent.type === 'workflow' ? 'sitemap' : recent.type === 'model' ? 'box' : 'image'"
            size="xs"
            class="text-muted-foreground/40"
          />
          <span class="flex-1 truncate text-[11px] text-muted-foreground hover:text-foreground">
            {{ recent.name }}
          </span>
        </button>
      </div>
    </div>

    <!-- Tree Sections -->
    <div class="flex-1 overflow-y-auto py-1">
      <template v-for="section in sections" :key="section.id">
        <!-- Section Header -->
        <button
          class="flex w-full items-center gap-1 px-2 py-1.5 text-left transition-colors hover:bg-accent/30"
          @click="handleSectionToggle(section.id)"
        >
          <Icon
            :name="libraryStore.isSectionExpanded(section.id) ? 'chevron-down' : 'chevron-right'"
            size="xs"
            class="text-muted-foreground/40"
          />
          <Icon :name="section.icon" size="xs" class="text-muted-foreground/50" />
          <span class="flex-1 text-[11px] font-medium text-muted-foreground">
            {{ section.label }}
          </span>
        </button>

        <!-- Section Folders -->
        <div v-if="libraryStore.isSectionExpanded(section.id)" class="flex flex-col">
          <button
            v-for="folder in section.folders"
            :key="folder.id"
            class="flex w-full items-center gap-1.5 py-1 pl-6 pr-2 text-left transition-colors"
            :class="[
              selectedFolderId === folder.id
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground/70 hover:bg-accent/30 hover:text-foreground'
            ]"
            @click="handleFolderClick(folder.id)"
          >
            <Icon :name="folder.icon || 'folder'" size="xs" class="opacity-60" />
            <span class="flex-1 text-[11px]">
              {{ folder.name }}
            </span>
            <span class="text-[10px] opacity-40">
              {{ libraryStore.getFolderItemCount(folder.id) }}
            </span>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
