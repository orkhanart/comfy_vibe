<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { FavoriteButton } from '@/components/common'
import {
  ModelCard,
  ImportModelDialog,
  ModelInfoSidebar,
  FolderCard,
  FolderBreadcrumbs,
  FolderContextMenu,
  CreateFolderDialog,
  ResourceListView,
} from '@/components/workspace'
import {
  MOCK_MODELS,
  MODEL_TYPES,
  BASE_MODEL_TYPES,
  getModelIcon,
  getModelColor,
  getBaseModelColor,
  type Model,
} from '@/data/workspaceMockData'
import { useFolders, DRAG_MIME_TYPE, type DragItem } from '@/composables/common/useFolders'

// Folder functionality
const {
  currentFolderId,
  breadcrumbPath,
  foldersAtCurrentLevel,
  navigateToFolder,
  filterItemsByFolder,
  createFolder,
  deleteFolder,
  getItemCount,
  getSubfolderCount,
  moveItemToFolder,
  moveFolderToFolder,
} = useFolders('models')

// Create folder dialog
const showCreateFolderDialog = ref(false)

function handleCreateFolder(name: string) {
  createFolder(name)
  showCreateFolderDialog.value = false
}

// Folder context menu
const openFolderMenuId = ref<string | null>(null)

function handleOpenFolderMenu(folderId: string) {
  openFolderMenuId.value = openFolderMenuId.value === folderId ? null : folderId
}

function closeFolderMenu() {
  openFolderMenuId.value = null
}

function handleFolderOpen(folderId: string) {
  navigateToFolder(folderId)
  closeFolderMenu()
}

function handleFolderDelete(folderId: string) {
  deleteFolder(folderId)
  closeFolderMenu()
}

// View state
const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('updated')
const showFavoritesOnly = ref(false)
const searchQuery = ref('')
const filterType = ref('all')
const filterBaseModel = ref('all')

// Ownership tabs
const activeTab = ref<'all' | 'private' | 'shared' | 'imported'>('all')

const sortOptions = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'size', label: 'Size' },
  { value: 'type', label: 'Type' }
]

const filterOptions = MODEL_TYPES.map(type => ({
  value: type,
  label: type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)
}))

// Models data with ownership info (mock)
const models = ref<(Model & { ownership: 'private' | 'shared' | 'imported' })[]>(
  MOCK_MODELS.map((m, i) => ({
    ...m,
    ownership: i % 4 === 0 ? 'shared' as const : i % 4 === 1 ? 'imported' as const : 'private' as const
  }))
)

const filteredModels = computed(() => {
  let result = filterItemsByFolder(models.value)

  // Filter by ownership tab
  if (activeTab.value !== 'all') {
    result = result.filter(m => m.ownership === activeTab.value)
  }

  if (showFavoritesOnly.value) {
    result = result.filter(m => m.favorite)
  }

  if (filterType.value !== 'all') {
    result = result.filter(m => m.type === filterType.value)
  }

  if (filterBaseModel.value !== 'all') {
    result = result.filter(m => m.baseModel === filterBaseModel.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m => m.name.toLowerCase().includes(query) || m.triggerWords?.some(tw => tw.toLowerCase().includes(query)))
  }

  return [...result].sort((a, b) => {
    switch (sortBy.value) {
      case 'name': return a.name.localeCompare(b.name)
      case 'size': return b.sizeBytes - a.sizeBytes
      case 'type': return a.type.localeCompare(b.type)
      default: return b.updatedTimestamp - a.updatedTimestamp
    }
  })
})

function toggleFavorite(modelId: string) {
  const model = models.value.find(m => m.id === modelId)
  if (model) model.favorite = !model.favorite
}

// Import Model Dialog
const showImportDialog = ref(false)

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
  openFolderMenuId.value = null
}

// Drag and drop
const isDragOverView = ref(false)

function handleFolderDrop(targetFolderId: string, dragItem: DragItem) {
  if (dragItem.type === 'folder') {
    moveFolderToFolder(dragItem.id, targetFolderId)
  } else if (dragItem.type === 'model') {
    moveItemToFolder(models.value, dragItem.id, targetFolderId)
  }
}

function handleBreadcrumbDrop(targetFolderId: string | null, dragItem: DragItem) {
  if (dragItem.type === 'folder') {
    moveFolderToFolder(dragItem.id, targetFolderId)
  } else if (dragItem.type === 'model') {
    moveItemToFolder(models.value, dragItem.id, targetFolderId)
  }
}

function handleViewDragEnter(e: DragEvent) {
  if (e.dataTransfer?.types.includes(DRAG_MIME_TYPE)) {
    isDragOverView.value = true
  }
}

function handleViewDragOver(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer?.types.includes(DRAG_MIME_TYPE)) {
    e.dataTransfer.dropEffect = 'move'
  }
}

function handleViewDragLeave(e: DragEvent) {
  const relatedTarget = e.relatedTarget as HTMLElement | null
  const currentTarget = e.currentTarget as HTMLElement
  if (!currentTarget.contains(relatedTarget)) {
    isDragOverView.value = false
  }
}

function handleViewDrop(e: DragEvent) {
  e.preventDefault()
  isDragOverView.value = false

  if (!e.dataTransfer) return

  const data = e.dataTransfer.getData(DRAG_MIME_TYPE)
  if (!data) return

  try {
    const dragItem: DragItem = JSON.parse(data)

    // Don't do anything if already in this folder
    if (dragItem.folderId === currentFolderId.value) return

    // Move to current folder
    if (dragItem.type === 'folder') {
      moveFolderToFolder(dragItem.id, currentFolderId.value)
    } else if (dragItem.type === 'model') {
      moveItemToFolder(models.value, dragItem.id, currentFolderId.value)
    }
  } catch {
    // Invalid JSON, ignore
  }
}
</script>

<template>
  <div class="flex h-full">
    <div
      class="flex-1 overflow-auto p-4 transition-all duration-300 ease-out"
      @click="closeModelInfo()"
      @dragenter="handleViewDragEnter"
      @dragover="handleViewDragOver"
      @dragleave="handleViewDragLeave"
      @drop="handleViewDrop"
    >
      <!-- Header with Breadcrumb and Actions -->
      <div class="mb-4 flex items-center justify-between">
        <FolderBreadcrumbs
          :path="breadcrumbPath"
          root-label="Models"
          root-icon="box"
          @navigate="navigateToFolder"
          @drop="handleBreadcrumbDrop"
        />
        <div class="flex items-center gap-1.5">
          <button
            class="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            @click="showImportDialog = true"
          >
            <Icon name="download" size="xs" />
            Import
          </button>
        </div>
      </div>

      <!-- Ownership Tabs -->
      <div class="mb-4 flex items-center gap-1 border-b border-border">
        <button
          class="flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors"
          :class="activeTab === 'all' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
          @click="activeTab = 'all'"
        >
          <Icon name="layers" size="sm" />
          All
        </button>
        <button
          class="flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors"
          :class="activeTab === 'private' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
          @click="activeTab = 'private'"
        >
          <Icon name="lock" size="sm" />
          Private
        </button>
        <button
          class="flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors"
          :class="activeTab === 'imported' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
          @click="activeTab = 'imported'"
        >
          <Icon name="download" size="sm" />
          Imported
        </button>
        <button
          class="flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors"
          :class="activeTab === 'shared' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
          @click="activeTab = 'shared'"
        >
          <Icon name="users" size="sm" />
          Shared
        </button>
      </div>

      <!-- Resource List -->
      <ResourceListView
        v-model:search-query="searchQuery"
        v-model:sort-by="sortBy"
        v-model:view-mode="viewMode"
        v-model:show-favorites-only="showFavoritesOnly"
        v-model:filter-type="filterType"
        :sort-options="sortOptions"
        :filter-options="filterOptions"
        search-placeholder="Search models..."
        :is-empty="filteredModels.length === 0 && foldersAtCurrentLevel.length === 0"
        empty-icon="box"
        empty-title="No models found"
        :empty-description="searchQuery || filterType !== 'all' ? 'Try different filters' : 'Add models to get started'"
        @create-folder="showCreateFolderDialog = true"
      >
        <!-- Additional Base Model Filter -->
        <template #filters>
          <div class="relative">
            <select
              v-model="filterBaseModel"
              class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground"
            >
              <option v-for="baseModel in BASE_MODEL_TYPES" :key="baseModel" :value="baseModel">
                {{ baseModel === 'all' ? 'All Base Models' : baseModel }}
              </option>
            </select>
            <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
        </template>

        <template #grid>
          <!-- Folders -->
          <div v-for="folder in foldersAtCurrentLevel" :key="'folder-' + folder.id" class="relative">
            <FolderCard
              :folder="folder"
              :item-count="getItemCount(folder.id, models)"
              :subfolder-count="getSubfolderCount(folder.id)"
              @open="handleFolderOpen"
              @open-menu="handleOpenFolderMenu"
              @drop="handleFolderDrop"
            />
            <FolderContextMenu
              v-if="openFolderMenuId === folder.id"
              :folder-id="folder.id"
              class="absolute right-0 top-full z-50"
              @open="handleFolderOpen"
              @rename="closeFolderMenu"
              @delete="handleFolderDelete"
              @close="closeFolderMenu"
            />
          </div>
          <!-- Models -->
          <ModelCard
            v-for="model in filteredModels"
            :key="'model-' + model.id"
            :model="model"
            @click="openModelInfo(model.id)"
            @toggle-favorite="toggleFavorite"
          />
        </template>

        <template #list>
          <div
            v-for="model in filteredModels"
            :key="model.id"
            class="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
          >
            <FavoriteButton :is-favorite="model.favorite" variant="toolbar" size="sm" @toggle="toggleFavorite(model.id)" />
            <div :class="['flex h-10 w-10 items-center justify-center rounded-md', getModelColor(model.type)]">
              <Icon :name="getModelIcon(model.type)" size="sm" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-medium text-zinc-900 dark:text-foreground">{{ model.name }}</p>
              <p class="text-sm text-muted-foreground">Version {{ model.version }}</p>
            </div>
            <span :class="['rounded px-2 py-0.5 text-xs font-medium', getBaseModelColor(model.baseModel)]">{{ model.baseModel }}</span>
            <span :class="['rounded-full px-2 py-0.5 text-xs font-medium capitalize', getModelColor(model.type)]">{{ model.type }}</span>
            <span class="w-20 text-right text-sm text-muted-foreground">{{ model.size }}</span>
            <span class="w-24 text-right text-sm text-muted-foreground">{{ model.updatedAt }}</span>
          </div>
        </template>
      </ResourceListView>

      <!-- Import Model Dialog -->
      <ImportModelDialog v-model:visible="showImportDialog" />
    </div>

    <!-- Model Info Sidebar -->
    <ModelInfoSidebar
      v-if="showModelInfo && selectedModel"
      :model="selectedModel"
      @close="closeModelInfo"
    />

    <!-- Create Folder Dialog -->
    <CreateFolderDialog
      v-model:visible="showCreateFolderDialog"
      @create="handleCreateFolder"
    />
  </div>
</template>
