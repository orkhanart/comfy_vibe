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
  PageBreadcrumb,
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
import { useFolders } from '@/composables/common/useFolders'

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

// Models data
const models = ref<Model[]>([...MOCK_MODELS])

const filteredModels = computed(() => {
  let result = filterItemsByFolder(models.value)

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
</script>

<template>
  <div class="flex h-full">
    <div class="flex-1 overflow-auto p-4 transition-all duration-300 ease-out" @click="closeModelInfo()">
      <PageBreadcrumb label="Models" icon="box" />

      <!-- Header Actions -->
      <div class="mb-4 flex items-center justify-end">
        <div class="flex items-center gap-2">
          <button
            class="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            @click="showImportDialog = true"
          >
            <Icon name="download" size="xs" />
            Import Model
          </button>
        </div>
      </div>

      <!-- Breadcrumbs -->
      <FolderBreadcrumbs
        v-if="currentFolderId"
        :path="breadcrumbPath"
        root-label="Models"
        class="mb-4"
        @navigate="navigateToFolder"
      />

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

        <!-- Folders Section -->
        <template #folders>
          <div v-if="foldersAtCurrentLevel.length > 0" class="mb-6">
            <h3 class="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">Folders</h3>
            <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
              <div v-for="folder in foldersAtCurrentLevel" :key="folder.id" class="relative">
                <FolderCard
                  :folder="folder"
                  :item-count="getItemCount(folder.id, models)"
                  :subfolder-count="getSubfolderCount(folder.id)"
                  @open="handleFolderOpen"
                  @open-menu="handleOpenFolderMenu"
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
            </div>
          </div>
          <!-- Models Section Header -->
          <h3 v-if="foldersAtCurrentLevel.length > 0 && filteredModels.length > 0" class="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Models
          </h3>
        </template>

        <template #grid>
          <ModelCard
            v-for="model in filteredModels"
            :key="model.id"
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
