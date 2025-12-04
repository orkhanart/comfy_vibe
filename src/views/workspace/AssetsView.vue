<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { FavoriteButton } from '@/components/common'
import {
  AssetCard,
  AssetContextMenu,
  AssetFileInfoSidebar,
  FolderCard,
  FolderBreadcrumbs,
  FolderContextMenu,
  CreateFolderDialog,
  ResourceListView,
} from '@/components/workspace'
import { MOCK_ASSETS, getAssetIcon, type Asset } from '@/data/workspaceMockData'
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
} = useFolders('assets')

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
const filterSource = ref('all')

const sortOptions = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'size', label: 'Size' },
  { value: 'type', label: 'Type' }
]

const filterOptions = [
  { value: 'all', label: 'All types' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'audio', label: 'Audio' }
]

const sourceOptions = [
  { value: 'all', label: 'All sources' },
  { value: 'generated', label: 'Generated' },
  { value: 'imported', label: 'Imported' }
]

// Assets data
const assets = ref<Asset[]>([...MOCK_ASSETS])

const filteredAssets = computed(() => {
  let result = filterItemsByFolder(assets.value)

  if (showFavoritesOnly.value) {
    result = result.filter(a => a.favorite)
  }

  if (filterType.value !== 'all') {
    result = result.filter(a => a.type === filterType.value)
  }

  if (filterSource.value !== 'all') {
    result = result.filter(a => a.source === filterSource.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(a => a.name.toLowerCase().includes(query))
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

function toggleFavorite(assetId: string) {
  const asset = assets.value.find(a => a.id === assetId)
  if (asset) asset.favorite = !asset.favorite
}

// Context menu
const openMenuId = ref<string | null>(null)

function handleOpenMenu(assetId: string) {
  openMenuId.value = openMenuId.value === assetId ? null : assetId
}

function closeMenu() {
  openMenuId.value = null
  openFolderMenuId.value = null
}

// File info sidebar
const showFileInfo = ref(false)
const selectedAsset = ref<Asset | null>(null)

function openFileInfo(assetId: string) {
  const asset = assets.value.find(a => a.id === assetId)
  if (asset) {
    selectedAsset.value = asset
    showFileInfo.value = true
  }
  closeMenu()
}

function closeFileInfo() {
  showFileInfo.value = false
  selectedAsset.value = null
}

function openAsset(assetId: string) {
  console.log('Open asset:', assetId)
}

// Drag and drop
const isDragOverView = ref(false)

function handleFolderDrop(targetFolderId: string, dragItem: DragItem) {
  if (dragItem.type === 'folder') {
    moveFolderToFolder(dragItem.id, targetFolderId)
  } else if (dragItem.type === 'asset') {
    moveItemToFolder(assets.value, dragItem.id, targetFolderId)
  }
}

function handleBreadcrumbDrop(targetFolderId: string | null, dragItem: DragItem) {
  if (dragItem.type === 'folder') {
    moveFolderToFolder(dragItem.id, targetFolderId)
  } else if (dragItem.type === 'asset') {
    moveItemToFolder(assets.value, dragItem.id, targetFolderId)
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
    } else if (dragItem.type === 'asset') {
      moveItemToFolder(assets.value, dragItem.id, currentFolderId.value)
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
      @click="closeMenu(); closeFileInfo()"
      @dragenter="handleViewDragEnter"
      @dragover="handleViewDragOver"
      @dragleave="handleViewDragLeave"
      @drop="handleViewDrop"
    >
      <!-- Header with Breadcrumb and Actions -->
      <div class="mb-4 flex items-center justify-between">
        <FolderBreadcrumbs
          :path="breadcrumbPath"
          root-label="Assets"
          root-icon="images"
          @navigate="navigateToFolder"
          @drop="handleBreadcrumbDrop"
        />
        <div class="flex items-center gap-1.5">
          <button class="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
            <Icon name="upload" size="xs" />
            Upload
          </button>
        </div>
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
        search-placeholder="Search assets..."
        :is-empty="filteredAssets.length === 0 && foldersAtCurrentLevel.length === 0"
        empty-icon="images"
        empty-title="No assets found"
        :empty-description="searchQuery || filterType !== 'all' ? 'Try different filters' : 'Upload files to get started'"
        @create-folder="showCreateFolderDialog = true"
      >
        <!-- Additional Source Filter -->
        <template #filters>
          <div class="relative">
            <select
              v-model="filterSource"
              class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground"
            >
              <option v-for="option in sourceOptions" :key="option.value" :value="option.value">
                {{ option.label }}
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
              :item-count="getItemCount(folder.id, assets)"
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
          <!-- Assets -->
          <div v-for="asset in filteredAssets" :key="'asset-' + asset.id" class="relative">
            <AssetCard :asset="asset" @open="openAsset" @toggle-favorite="toggleFavorite" @menu="handleOpenMenu" />
            <AssetContextMenu
              v-if="openMenuId === asset.id"
              :asset-id="asset.id"
              @file-info="openFileInfo"
              @close="closeMenu"
            />
          </div>
        </template>

        <template #list>
          <div
            v-for="asset in filteredAssets"
            :key="asset.id"
            class="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
          >
            <FavoriteButton :is-favorite="asset.favorite" variant="toolbar" size="sm" @toggle="toggleFavorite(asset.id)" />
            <div class="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100 dark:bg-muted">
              <Icon :name="getAssetIcon(asset.type)" size="md" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-zinc-900 dark:text-foreground">{{ asset.name }}</p>
              <p class="text-xs text-muted-foreground">{{ asset.type }} - {{ asset.dimensions }}</p>
            </div>
            <span
              :class="[
                'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                asset.source === 'generated' ? 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
              ]"
            >
              {{ asset.source }}
            </span>
            <span class="text-sm text-muted-foreground">{{ asset.size }}</span>
            <span class="text-sm text-muted-foreground">{{ asset.updatedAt }}</span>
            <button class="rounded p-1.5 text-muted-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-accent">
              <Icon name="download" size="sm" />
            </button>
          </div>
        </template>
      </ResourceListView>
    </div>

    <!-- File Info Sidebar -->
    <AssetFileInfoSidebar
      v-if="showFileInfo && selectedAsset"
      :asset="selectedAsset"
      @close="closeFileInfo"
      @view="openAsset"
    />

    <!-- Create Folder Dialog -->
    <CreateFolderDialog
      v-model:visible="showCreateFolderDialog"
      @create="handleCreateFolder"
    />
  </div>
</template>
