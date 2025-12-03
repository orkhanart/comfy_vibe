<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, Grid3x3, List, FolderOpen, Plus, Star } from 'lucide-vue-next'
import { Icon } from '@/components/ui/icon'
import ExtendedViewModal from './ExtendedViewModal.vue'
import {
  LIBRARY_SECTIONS_DATA,
  type LibrarySection,
  type LibraryItem,
} from '@/data/sidebarMockData'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

// View state
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const selectedSectionId = ref<string | null>(null)
const selectedFolderId = ref<string | null>(null)
const sortBy = ref('name')
const showFavoritesOnly = ref(false)

const librarySections = ref<LibrarySection[]>(
  LIBRARY_SECTIONS_DATA.map(s => ({ ...s }))
)

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'type', label: 'Type' },
]

// Select first section by default when modal opens
watch(() => props.visible, (visible) => {
  if (visible) {
    if (!selectedSectionId.value && librarySections.value.length > 0) {
      selectedSectionId.value = librarySections.value[0].id
    }
    selectedFolderId.value = null
    searchQuery.value = ''
    sortBy.value = 'name'
    showFavoritesOnly.value = false
  }
}, { immediate: true })

const selectedSection = computed(() =>
  librarySections.value.find(s => s.id === selectedSectionId.value)
)

const selectedFolder = computed(() => {
  if (!selectedSection.value || !selectedFolderId.value) return null
  return selectedSection.value.folders?.find(f => f.id === selectedFolderId.value) || null
})

// Get all items including from folders
const allItems = computed(() => {
  if (!selectedSection.value) return []

  let items: LibraryItem[] = []

  if (selectedSection.value.items) {
    items = [...selectedSection.value.items]
  }

  if (selectedFolderId.value && selectedFolder.value) {
    items = selectedFolder.value.items
  } else if (selectedSection.value.folders) {
    selectedSection.value.folders.forEach(folder => {
      items = [...items, ...folder.items]
    })
  }

  return items
})

const filteredItems = computed(() => {
  let items = allItems.value

  if (showFavoritesOnly.value) {
    items = items.filter(item => item.favorite)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      item.name.toLowerCase().includes(query)
    )
  }

  return [...items].sort((a, b) => {
    switch (sortBy.value) {
      case 'type': return a.type.localeCompare(b.type)
      default: return a.name.localeCompare(b.name)
    }
  })
})

function selectSection(sectionId: string): void {
  selectedSectionId.value = sectionId
  selectedFolderId.value = null
}

function selectFolder(folderId: string | null): void {
  selectedFolderId.value = folderId
}

function getItemIcon(type: string): string {
  const icons: Record<string, string> = {
    workflow: 'git-branch',
    model: 'box',
    asset: 'image',
    folder: 'folder',
    template: 'file-text',
  }
  return icons[type] || 'file'
}

function toggleFavorite(itemId: string): void {
  librarySections.value.forEach(section => {
    section.items?.forEach(item => {
      if (item.id === itemId) item.favorite = !item.favorite
    })
    section.folders?.forEach(folder => {
      folder.items.forEach(item => {
        if (item.id === itemId) item.favorite = !item.favorite
      })
    })
  })
}

function handleItemDragStart(e: DragEvent, item: LibraryItem): void {
  if (e.dataTransfer) {
    const shortcut = {
      id: `shortcut-library-${item.id}`,
      type: item.type as 'workflow' | 'model' | 'asset',
      label: item.name,
      icon: getItemIcon(item.type),
      itemId: item.id,
      thumbnail: item.thumbnail,
    }
    const jsonData = JSON.stringify(shortcut)
    e.dataTransfer.setData('application/x-library-shortcut', jsonData)
    e.dataTransfer.setData('text/plain', jsonData)
    e.dataTransfer.effectAllowed = 'copyMove'
  }
}
</script>

<template>
  <ExtendedViewModal
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
  >
    <!-- Header Tabs -->
    <template #header-left>
      <div class="flex items-center gap-1">
        <button
          v-for="section in librarySections"
          :key="section.id"
          :class="[
            'rounded px-3 py-1.5 text-sm font-medium transition-colors',
            selectedSectionId === section.id
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          ]"
          @click="selectSection(section.id)"
        >
          {{ section.label }}
        </button>
      </div>
    </template>

    <!-- Sidebar - Folders -->
    <template #sidebar>
      <div class="flex h-full flex-col">
        <!-- All Items -->
        <div class="flex-1 p-2">
          <button
            :class="[
              'flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm transition-colors',
              !selectedFolderId
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
            @click="selectFolder(null)"
          >
            <span class="truncate">All Items</span>
            <span class="ml-auto text-xs opacity-60">{{ allItems.length }}</span>
          </button>

          <!-- Folders for selected section -->
          <template v-if="selectedSection?.folders">
            <button
              v-for="folder in selectedSection.folders"
              :key="folder.id"
              :class="[
                'flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm transition-colors',
                selectedFolderId === folder.id
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              ]"
              @click="selectFolder(folder.id)"
            >
              <FolderOpen class="size-3.5 shrink-0" />
              <span class="flex-1 truncate">{{ folder.name }}</span>
              <span class="text-xs opacity-60">{{ folder.items.length }}</span>
            </button>
          </template>
        </div>

        <!-- Footer -->
        <div class="border-t border-border p-2">
          <button class="flex w-full items-center justify-center gap-2 rounded border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Plus class="size-4" />
            New Workflow
          </button>
        </div>
      </div>
    </template>

    <!-- Content -->
    <div class="flex h-full flex-col">
      <!-- Toolbar -->
      <div class="flex items-center gap-2 border-b border-border px-4 py-3">
        <!-- Search -->
        <div class="relative flex-1">
          <Search class="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="h-8 w-full rounded border border-border bg-background pl-8 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        <!-- Sort -->
        <div class="relative">
          <select
            v-model="sortBy"
            class="h-8 appearance-none rounded border border-border bg-background py-1.5 pl-3 pr-8 text-sm outline-none transition-colors focus:border-ring"
          >
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>

        <!-- Favorites Toggle -->
        <button
          :class="[
            'flex h-8 w-8 items-center justify-center rounded border transition-colors',
            showFavoritesOnly
              ? 'border-amber-500 bg-amber-500/10 text-amber-500'
              : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
          ]"
          @click="showFavoritesOnly = !showFavoritesOnly"
        >
          <Star :class="['size-4', showFavoritesOnly && 'fill-current']" />
        </button>

        <!-- View Toggle -->
        <div class="flex items-center rounded border border-border">
          <button
            :class="['px-2 py-1.5 transition-colors', viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground']"
            @click="viewMode = 'grid'"
          >
            <Grid3x3 class="size-4" />
          </button>
          <button
            :class="['px-2 py-1.5 transition-colors', viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground']"
            @click="viewMode = 'list'"
          >
            <List class="size-4" />
          </button>
        </div>
      </div>

      <!-- Content Header -->
      <div class="px-4 py-3">
        <h2 class="text-sm font-medium text-foreground">
          {{ selectedFolder ? selectedFolder.name : 'All Items' }}
        </h2>
        <p class="text-xs text-muted-foreground">
          {{ filteredItems.length }} {{ filteredItems.length === 1 ? 'item' : 'items' }}
        </p>
      </div>

      <!-- Items Grid -->
      <div class="flex-1 overflow-y-auto px-4 pb-4">
        <div
          v-if="viewMode === 'grid' && filteredItems.length > 0"
          class="grid gap-3"
          style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));"
        >
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="group cursor-grab overflow-hidden rounded border border-border bg-card transition-colors hover:border-foreground/20"
            draggable="true"
            @dragstart="handleItemDragStart($event, item)"
          >
            <div class="relative aspect-video w-full bg-muted">
              <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.name" class="h-full w-full object-cover" />
              <div v-else class="flex h-full w-full items-center justify-center">
                <Icon :name="getItemIcon(item.type)" size="lg" class="text-muted-foreground/40" />
              </div>
              <!-- Favorite Button -->
              <button
                class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 transition-all hover:text-amber-500 group-hover:opacity-100"
                :class="item.favorite && 'opacity-100 text-amber-500'"
                @click.stop="toggleFavorite(item.id)"
              >
                <Star :class="['size-3.5', item.favorite && 'fill-current']" />
              </button>
            </div>
            <div class="p-2">
              <p class="truncate text-sm text-foreground">{{ item.name }}</p>
              <p class="text-xs text-muted-foreground">{{ item.type }}</p>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else-if="viewMode === 'list' && filteredItems.length > 0" class="rounded border border-border">
          <div
            v-for="(item, index) in filteredItems"
            :key="item.id"
            :class="['flex cursor-grab items-center gap-3 px-3 py-2 transition-colors hover:bg-muted', index !== filteredItems.length - 1 && 'border-b border-border']"
            draggable="true"
            @dragstart="handleItemDragStart($event, item)"
          >
            <!-- Favorite -->
            <button
              class="text-muted-foreground transition-colors hover:text-amber-500"
              :class="item.favorite && 'text-amber-500'"
              @click.stop="toggleFavorite(item.id)"
            >
              <Star :class="['size-4', item.favorite && 'fill-current']" />
            </button>
            <div v-if="item.thumbnail" class="h-8 w-12 shrink-0 overflow-hidden rounded bg-muted">
              <img :src="item.thumbnail" :alt="item.name" class="h-full w-full object-cover" />
            </div>
            <div v-else class="flex h-8 w-12 shrink-0 items-center justify-center rounded bg-muted">
              <Icon :name="getItemIcon(item.type)" size="sm" class="text-muted-foreground" />
            </div>
            <span class="flex-1 truncate text-sm text-foreground">{{ item.name }}</span>
            <span class="text-xs text-muted-foreground">{{ item.type }}</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredItems.length === 0" class="flex flex-col items-center justify-center py-12">
          <p class="text-sm text-muted-foreground">No items found</p>
        </div>
      </div>
    </div>
  </ExtendedViewModal>
</template>
