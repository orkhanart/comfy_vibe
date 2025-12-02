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
} from '@/components/workspace'
import {
  MOCK_ASSETS,
  getAssetIcon,
  type Asset,
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
} = useFolders('assets')

// Create folder dialog
const showCreateFolderDialog = ref(false)

function handleCreateFolder(name: string) {
  createFolder(name)
  showCreateFolderDialog.value = false
}

// Folder context menu
const openFolderMenuId = ref<string | null>(null)

function handleOpenFolderMenu(folderId: string, _event: MouseEvent) {
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

// View mode
type ViewMode = 'grid' | 'list'
const viewMode = ref<ViewMode>('grid')

// Filter type
type AssetType = 'all' | 'image' | 'video' | 'audio'
const filterType = ref<AssetType>('all')

// Filter source
type AssetSource = 'all' | 'generated' | 'imported'
const filterSource = ref<AssetSource>('all')

// Sort
type SortOption = 'name' | 'updated' | 'size' | 'type'
const sortBy = ref<SortOption>('updated')

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'size', label: 'Size' },
  { value: 'type', label: 'Type' }
]

const filterOptions: { value: AssetType; label: string }[] = [
  { value: 'all', label: 'All types' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'audio', label: 'Audio' }
]

const sourceOptions: { value: AssetSource; label: string }[] = [
  { value: 'all', label: 'All sources' },
  { value: 'generated', label: 'Generated' },
  { value: 'imported', label: 'Imported' }
]

// Favorites filter
const showFavoritesOnly = ref(false)

const assets = ref<Asset[]>([...MOCK_ASSETS])

function toggleFavorite(assetId: string) {
  const asset = assets.value.find(a => a.id === assetId)
  if (asset) {
    asset.favorite = !asset.favorite
  }
}

// Search, filter and sort
const searchQuery = ref('')
const filteredAssets = computed(() => {
  // First filter by current folder
  let result = filterItemsByFolder(assets.value)

  // Filter by favorites
  if (showFavoritesOnly.value) {
    result = result.filter((a) => a.favorite)
  }

  // Filter by type
  if (filterType.value !== 'all') {
    result = result.filter((a) => a.type === filterType.value)
  }

  // Filter by source
  if (filterSource.value !== 'all') {
    result = result.filter((a) => a.source === filterSource.value)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((a) => a.name.toLowerCase().includes(query))
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

// Context menu
const openMenuId = ref<string | null>(null)

function openAsset(assetId: string) {
  console.log('Open asset:', assetId)
}

function handleOpenMenu(assetId: string, _event: MouseEvent) {
  openMenuId.value = openMenuId.value === assetId ? null : assetId
}

function closeMenu() {
  openMenuId.value = null
  openFolderMenuId.value = null
}

function handleMenuAction(action: string, assetId: string) {
  console.log(`Action: ${action} on asset: ${assetId}`)
  closeMenu()
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
</script>

<template>
  <div class="flex h-full">
    <!-- Main Content -->
    <div class="flex-1 overflow-auto p-6 transition-all duration-300 ease-out" @click="closeMenu(); closeFileInfo()">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-foreground">
          Assets
        </h1>
        <p class="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
          {{ assets.length }} files
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent"
          @click="showCreateFolderDialog = true"
        >
          <Icon name="folder-plus" size="xs" />
          New Folder
        </button>
        <button
          class="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Icon name="upload" size="xs" />
          Upload
        </button>
      </div>
    </div>

    <!-- Breadcrumbs (when in subfolder) -->
    <FolderBreadcrumbs
      v-if="currentFolderId"
      :path="breadcrumbPath"
      root-label="Assets"
      class="mb-4"
      @navigate="navigateToFolder"
    />

    <!-- Search, Filter, Sort & View Toggle -->
    <div class="mb-6 flex items-center gap-3">
      <div class="relative flex-1">
        <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search assets..."
          class="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
        />
      </div>

      <!-- Type Filter -->
      <div class="relative">
        <select
          v-model="filterType"
          class="appearance-none rounded-md border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
        >
          <option v-for="option in filterOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>

      <!-- Source Filter -->
      <div class="relative">
        <select
          v-model="filterSource"
          class="appearance-none rounded-md border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
        >
          <option v-for="option in sourceOptions" :key="option.value" :value="option.value">
            {{ option.label }}
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

    <!-- Folders Section -->
    <div v-if="foldersAtCurrentLevel.length > 0" class="mb-6">
      <h3 class="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">Folders</h3>
      <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
        <div v-for="folder in foldersAtCurrentLevel" :key="folder.id" class="relative">
          <FolderCard
            :folder="folder"
            :item-count="getItemCount(folder.id, assets)"
            :subfolder-count="getSubfolderCount(folder.id)"
            @open="handleFolderOpen"
            @open-menu="handleOpenFolderMenu"
          />
          <!-- Folder Context Menu -->
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

    <!-- Empty State -->
    <div
      v-if="filteredAssets.length === 0 && foldersAtCurrentLevel.length === 0"
      class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border"
    >
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-muted">
        <Icon name="images" size="xl" class="text-muted-foreground" />
      </div>
      <h3 class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">No assets found</h3>
      <p class="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
        {{ searchQuery || filterType !== 'all' ? 'Try different filters' : 'Upload files to get started' }}
      </p>
    </div>

    <!-- Assets Section Header (when we have both folders and assets) -->
    <h3
      v-if="foldersAtCurrentLevel.length > 0 && filteredAssets.length > 0"
      class="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300"
    >
      Assets
    </h3>

    <!-- Grid View -->
    <div
      v-if="filteredAssets.length > 0 && viewMode === 'grid'"
      class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));"
    >
      <div v-for="asset in filteredAssets" :key="asset.id" class="relative">
        <AssetCard
          :asset="asset"
          @open="openAsset"
          @toggle-favorite="toggleFavorite"
          @menu="handleOpenMenu"
        />
        <!-- Context Menu -->
        <AssetContextMenu
          v-if="openMenuId === asset.id"
          :asset-id="asset.id"
          @view="handleMenuAction('view', $event)"
          @download="handleMenuAction('download', $event)"
          @copy-path="handleMenuAction('copyPath', $event)"
          @file-info="openFileInfo"
          @rename="handleMenuAction('rename', $event)"
          @move="handleMenuAction('move', $event)"
          @duplicate="handleMenuAction('duplicate', $event)"
          @delete="handleMenuAction('delete', $event)"
          @close="closeMenu"
        />
      </div>
    </div>

    <!-- List View -->
    <div v-if="filteredAssets.length > 0 && viewMode === 'list'" class="rounded-lg border border-zinc-200 bg-white dark:border-border dark:bg-card">
      <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
        <div
          v-for="asset in filteredAssets"
          :key="asset.id"
          class="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
        >
          <!-- Favorite Button -->
          <FavoriteButton
            :is-favorite="asset.favorite"
            variant="toolbar"
            size="sm"
            @toggle="toggleFavorite(asset.id)"
          />
          <div class="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100 dark:bg-muted">
            <Icon :name="getAssetIcon(asset.type)" size="md" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-zinc-900 dark:text-foreground">{{ asset.name }}</p>
            <p class="text-xs text-muted-foreground dark:text-muted-foreground">{{ asset.type }} - {{ asset.dimensions }}</p>
          </div>
          <span
            :class="[
              'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
              asset.source === 'generated'
                ? 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400'
                : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
            ]"
          >
            {{ asset.source }}
          </span>
          <span class="text-sm text-muted-foreground dark:text-muted-foreground">{{ asset.size }}</span>
          <span class="text-sm text-muted-foreground dark:text-muted-foreground">{{ asset.updatedAt }}</span>
          <button class="rounded p-1.5 text-muted-foreground transition-colors hover:bg-zinc-100 hover:text-muted-foreground/50 dark:hover:bg-accent dark:hover:text-foreground">
            <Icon name="download" size="sm" />
          </button>
        </div>
      </div>
    </div>

    </div>

    <!-- File Info Sidebar -->
    <AssetFileInfoSidebar
      v-if="showFileInfo && selectedAsset"
      :asset="selectedAsset"
      @close="closeFileInfo"
      @view="openAsset"
      @download="handleMenuAction('download', $event)"
    />

    <!-- Create Folder Dialog -->
    <CreateFolderDialog
      v-model:visible="showCreateFolderDialog"
      @create="handleCreateFolder"
    />
  </div>
</template>
