<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { WorkflowCard, AssetCard, ModelCard, FolderCard, ResourceListView } from '@/components/workspace'
import { ShareDialog } from '@/components/common'
import { MOCK_WORKFLOWS, MOCK_ASSETS, MOCK_MODELS, type Workflow, type Asset, type Model } from '@/data/workspaceMockData'

const route = useRoute()
const router = useRouter()
const projectId = computed(() => route.params.projectId as string)

// Mock project data
const project = computed(() => ({
  id: projectId.value,
  name: projectId.value === 'proj-1' ? 'Marketing Campaign'
      : projectId.value === 'proj-2' ? 'Product Launch'
      : projectId.value === 'proj-3' ? 'Social Media'
      : 'New Project',
  description: 'A collection of workflows and assets for this project.',
}))

// =====================
// VIEW & NAVIGATION
// =====================
type View = 'home' | 'workflows' | 'models' | 'assets'
const activeView = ref<View>('home')

function openFolder(folderId: string) {
  activeView.value = folderId as View
}

function goBack() {
  activeView.value = 'home'
}

// =====================
// HOME VIEW (Folders)
// =====================
const homeSearchQuery = ref('')
const homeViewMode = ref<'grid' | 'list'>('grid')
const homeSortBy = ref('name')
const homeShowFavoritesOnly = ref(false)

const homeSortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'updated', label: 'Last updated' },
  { value: 'items', label: 'Item count' }
]

const userFolders = ref<{ id: string; name: string; icon: string }[]>([])

const mainFolders = computed(() => [
  { id: 'workflows', name: 'Workflows', icon: 'sitemap', iconClass: 'text-blue-500 dark:text-blue-400', count: workflows.value.length },
  { id: 'models', name: 'Models', icon: 'box', iconClass: 'text-blue-500 dark:text-blue-400', count: models.value.length },
  { id: 'assets', name: 'Assets', icon: 'images', iconClass: 'text-blue-500 dark:text-blue-400', count: assets.value.length },
])

const filteredFolders = computed(() => {
  let allFolders = [
    ...mainFolders.value.map(f => ({ ...f, isNative: true })),
    ...userFolders.value.map(f => ({ ...f, isNative: false, count: 0, iconClass: 'text-amber-500 dark:text-amber-400' }))
  ]

  if (homeSearchQuery.value) {
    const query = homeSearchQuery.value.toLowerCase()
    allFolders = allFolders.filter(f => f.name.toLowerCase().includes(query))
  }

  allFolders.sort((a, b) => {
    switch (homeSortBy.value) {
      case 'name': return a.name.localeCompare(b.name)
      case 'items': return (b.count || 0) - (a.count || 0)
      default: return 0
    }
  })

  return allFolders
})

// Create folder dialog
const showCreateFolder = ref(false)
const newFolderName = ref('')

function createFolder() {
  if (newFolderName.value.trim()) {
    userFolders.value.push({
      id: `folder-${Date.now()}`,
      name: newFolderName.value.trim(),
      icon: 'folder',
    })
    newFolderName.value = ''
    showCreateFolder.value = false
  }
}

function deleteFolder(folderId: string) {
  userFolders.value = userFolders.value.filter(f => f.id !== folderId)
}

// =====================
// WORKFLOWS
// =====================
const workflows = ref<Workflow[]>([...MOCK_WORKFLOWS].slice(0, 5))
const workflowSearchQuery = ref('')
const workflowViewMode = ref<'grid' | 'list'>('grid')
const workflowSortBy = ref('updated')
const workflowShowFavoritesOnly = ref(false)

const workflowSortOptions = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'nodes', label: 'Node count' }
]

const filteredWorkflows = computed(() => {
  let result = workflows.value

  if (workflowShowFavoritesOnly.value) {
    result = result.filter(w => w.favorite)
  }

  if (workflowSearchQuery.value) {
    const query = workflowSearchQuery.value.toLowerCase()
    result = result.filter(w => w.name.toLowerCase().includes(query) || w.description.toLowerCase().includes(query))
  }

  return [...result].sort((a, b) => {
    switch (workflowSortBy.value) {
      case 'name': return a.name.localeCompare(b.name)
      case 'nodes': return b.nodeCount - a.nodeCount
      default: return b.updatedTimestamp - a.updatedTimestamp
    }
  })
})

function toggleWorkflowFavorite(workflowId: string) {
  const workflow = workflows.value.find(w => w.id === workflowId)
  if (workflow) workflow.favorite = !workflow.favorite
}

function openWorkflow() {
  router.push('/workflow-editor')
}

// =====================
// MODELS
// =====================
const models = ref<Model[]>([...MOCK_MODELS].slice(0, 6))
const modelSearchQuery = ref('')
const modelViewMode = ref<'grid' | 'list'>('grid')
const modelSortBy = ref('updated')
const modelFilterType = ref('all')
const modelShowFavoritesOnly = ref(false)

const modelSortOptions = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'size', label: 'Size' }
]

const modelFilterOptions = [
  { value: 'all', label: 'All types' },
  { value: 'checkpoint', label: 'Checkpoints' },
  { value: 'lora', label: 'LoRAs' },
  { value: 'vae', label: 'VAEs' },
  { value: 'controlnet', label: 'ControlNets' },
  { value: 'upscaler', label: 'Upscalers' }
]

const filteredModels = computed(() => {
  let result = models.value

  if (modelShowFavoritesOnly.value) {
    result = result.filter(m => m.favorite)
  }

  if (modelFilterType.value !== 'all') {
    result = result.filter(m => m.type === modelFilterType.value)
  }

  if (modelSearchQuery.value) {
    const query = modelSearchQuery.value.toLowerCase()
    result = result.filter(m => m.name.toLowerCase().includes(query))
  }

  return [...result].sort((a, b) => {
    switch (modelSortBy.value) {
      case 'name': return a.name.localeCompare(b.name)
      case 'size': return b.sizeBytes - a.sizeBytes
      default: return b.updatedTimestamp - a.updatedTimestamp
    }
  })
})

function toggleModelFavorite(modelId: string) {
  const model = models.value.find(m => m.id === modelId)
  if (model) model.favorite = !model.favorite
}

function openModelInfo(modelId: string) {
  console.log('Open model info:', modelId)
}

// =====================
// ASSETS
// =====================
const assets = ref<Asset[]>([...MOCK_ASSETS].slice(0, 6))
const assetSearchQuery = ref('')
const assetViewMode = ref<'grid' | 'list'>('grid')
const assetSortBy = ref('updated')
const assetFilterType = ref('all')
const assetShowFavoritesOnly = ref(false)

const assetSortOptions = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'size', label: 'Size' },
  { value: 'type', label: 'Type' }
]

const assetFilterOptions = [
  { value: 'all', label: 'All types' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'audio', label: 'Audio' }
]

const filteredAssets = computed(() => {
  let result = assets.value

  if (assetShowFavoritesOnly.value) {
    result = result.filter(a => a.favorite)
  }

  if (assetFilterType.value !== 'all') {
    result = result.filter(a => a.type === assetFilterType.value)
  }

  if (assetSearchQuery.value) {
    const query = assetSearchQuery.value.toLowerCase()
    result = result.filter(a => a.name.toLowerCase().includes(query))
  }

  return [...result].sort((a, b) => {
    switch (assetSortBy.value) {
      case 'name': return a.name.localeCompare(b.name)
      case 'size': return b.sizeBytes - a.sizeBytes
      case 'type': return a.type.localeCompare(b.type)
      default: return b.updatedTimestamp - a.updatedTimestamp
    }
  })
})

function toggleAssetFavorite(assetId: string) {
  const asset = assets.value.find(a => a.id === assetId)
  if (asset) asset.favorite = !asset.favorite
}

function openAsset(assetId: string) {
  console.log('Open asset:', assetId)
}

// =====================
// DIALOGS & MENUS
// =====================
const showSettings = ref(false)
const showShareDialog = ref(false)
const projectMenuOpen = ref(false)

function handleProjectAction(action: string) {
  projectMenuOpen.value = false
  console.log('Project action:', action, projectId.value)
}
</script>

<template>
  <div class="flex h-full">
    <div class="flex-1 overflow-auto p-6">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            v-if="activeView !== 'home'"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-foreground"
            @click="goBack"
          >
            <Icon name="arrow-left" size="sm" />
          </button>
          <div>
            <h1 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-foreground">
              {{ project.name }}
              <span v-if="activeView !== 'home'" class="text-zinc-400"> / {{ activeView.charAt(0).toUpperCase() + activeView.slice(1) }}</span>
            </h1>
            <p class="mt-1 text-sm text-muted-foreground">{{ project.description }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent"
            @click="showShareDialog = true"
          >
            <Icon name="share" size="xs" />
            Share
          </button>
          <button
            class="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white p-2 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600 dark:border-border dark:bg-muted dark:hover:bg-accent dark:hover:text-foreground"
            @click="showSettings = !showSettings"
          >
            <Icon name="cog" size="sm" />
          </button>
          <Popover v-model:open="projectMenuOpen">
            <PopoverTrigger as-child>
              <button class="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white p-2 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600 dark:border-border dark:bg-muted dark:hover:bg-accent dark:hover:text-foreground">
                <Icon name="ellipsis-v" size="sm" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" :side-offset="4" class="w-48 p-1">
              <button class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800" @click="handleProjectAction('rename')">
                <Icon name="pencil" size="sm" class="text-zinc-400" />
                Rename
              </button>
              <button class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800" @click="handleProjectAction('duplicate')">
                <Icon name="copy" size="sm" class="text-zinc-400" />
                Duplicate
              </button>
              <button class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800" @click="handleProjectAction('move')">
                <Icon name="folder-tree" size="sm" class="text-zinc-400" />
                Move to...
              </button>
              <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />
              <button class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10" @click="handleProjectAction('delete')">
                <Icon name="trash" size="sm" />
                Delete
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <!-- Home View -->
      <template v-if="activeView === 'home'">
        <ResourceListView
          v-model:search-query="homeSearchQuery"
          v-model:sort-by="homeSortBy"
          v-model:view-mode="homeViewMode"
          v-model:show-favorites-only="homeShowFavoritesOnly"
          :sort-options="homeSortOptions"
          search-placeholder="Search folders..."
          primary-action-label="New Folder"
          primary-action-icon="folder-plus"
          :show-new-folder="false"
          :is-empty="filteredFolders.length === 0 && !!homeSearchQuery"
          empty-icon="search"
          empty-title="No folders found"
          empty-description="Try a different search term"
          @primary-action="showCreateFolder = true"
        >
          <template #grid>
            <FolderCard
              v-for="folder in filteredFolders"
              :key="folder.id"
              :folder="folder"
              :item-count="folder.count || 0"
              :icon="folder.icon"
              :icon-class="folder.iconClass"
              :is-native="folder.isNative"
              @open="openFolder"
              @delete="deleteFolder"
            />
          </template>
          <template #list>
            <div
              v-for="folder in filteredFolders"
              :key="folder.id"
              class="flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
              @click="openFolder(folder.id)"
            >
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <Icon :name="folder.icon" size="lg" :class="folder.iconClass" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium text-zinc-900 dark:text-foreground">{{ folder.name }}</p>
                <p class="mt-0.5 text-xs text-zinc-500">{{ folder.count || 0 }} items</p>
              </div>
            </div>
          </template>
        </ResourceListView>
      </template>

      <!-- Workflows View -->
      <template v-else-if="activeView === 'workflows'">
        <ResourceListView
          v-model:search-query="workflowSearchQuery"
          v-model:sort-by="workflowSortBy"
          v-model:view-mode="workflowViewMode"
          v-model:show-favorites-only="workflowShowFavoritesOnly"
          :sort-options="workflowSortOptions"
          search-placeholder="Search workflows..."
          primary-action-label="New Workflow"
          primary-action-icon="plus"
          :is-empty="filteredWorkflows.length === 0"
          empty-icon="sitemap"
          empty-title="No workflows found"
          :empty-description="workflowSearchQuery ? 'Try a different search term' : 'Add workflows to this project'"
          @create-folder="showCreateFolder = true"
          @primary-action="openWorkflow"
        >
          <template #grid>
            <WorkflowCard
              v-for="workflow in filteredWorkflows"
              :key="workflow.id"
              :workflow="workflow"
              @open="openWorkflow"
              @toggle-favorite="toggleWorkflowFavorite"
            />
          </template>
          <template #list>
            <div
              v-for="workflow in filteredWorkflows"
              :key="workflow.id"
              class="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
            >
              <button
                :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors', workflow.favorite ? 'text-amber-500' : 'text-zinc-300 hover:text-amber-500 dark:text-zinc-600']"
                @click.stop="toggleWorkflowFavorite(workflow.id)"
              >
                <Icon :name="workflow.favorite ? 'star-fill' : 'star'" size="sm" />
              </button>
              <div class="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <img :src="workflow.thumbnail" :alt="workflow.name" class="h-full w-full object-cover" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium text-zinc-900 dark:text-foreground">{{ workflow.name }}</p>
                <div class="mt-1 flex flex-wrap items-center gap-1.5">
                  <span v-for="tag in workflow.tags" :key="tag" class="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{{ tag }}</span>
                </div>
              </div>
              <span class="text-xs text-zinc-400">{{ workflow.updatedAt }}</span>
              <button class="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900" @click.stop="openWorkflow">Open</button>
            </div>
          </template>
        </ResourceListView>
      </template>

      <!-- Models View -->
      <template v-else-if="activeView === 'models'">
        <ResourceListView
          v-model:search-query="modelSearchQuery"
          v-model:sort-by="modelSortBy"
          v-model:view-mode="modelViewMode"
          v-model:show-favorites-only="modelShowFavoritesOnly"
          v-model:filter-type="modelFilterType"
          :sort-options="modelSortOptions"
          :filter-options="modelFilterOptions"
          search-placeholder="Search models..."
          primary-action-label="Import Model"
          primary-action-icon="download"
          :is-empty="filteredModels.length === 0"
          empty-icon="box"
          empty-title="No models found"
          :empty-description="modelSearchQuery ? 'Try a different search term' : 'Add models to this project'"
          @create-folder="showCreateFolder = true"
        >
          <template #grid>
            <ModelCard
              v-for="model in filteredModels"
              :key="model.id"
              :model="model"
              @click="openModelInfo(model.id)"
              @toggle-favorite="toggleModelFavorite"
            />
          </template>
          <template #list>
            <div
              v-for="model in filteredModels"
              :key="model.id"
              class="flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
              @click="openModelInfo(model.id)"
            >
              <button
                :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors', model.favorite ? 'text-amber-500' : 'text-zinc-300 hover:text-amber-500 dark:text-zinc-600']"
                @click.stop="toggleModelFavorite(model.id)"
              >
                <Icon :name="model.favorite ? 'star-fill' : 'star'" size="sm" />
              </button>
              <div class="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <img v-if="model.thumbnail" :src="model.thumbnail" :alt="model.name" class="h-full w-full object-cover" />
                <div v-else class="flex h-full w-full items-center justify-center">
                  <Icon name="box" size="md" class="text-zinc-400" />
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium text-zinc-900 dark:text-foreground">{{ model.name }}</p>
                <p class="mt-0.5 text-xs capitalize text-muted-foreground">{{ model.type }}</p>
              </div>
              <span class="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{{ model.baseModel }}</span>
              <span class="text-xs text-zinc-400">{{ model.size }}</span>
            </div>
          </template>
        </ResourceListView>
      </template>

      <!-- Assets View -->
      <template v-else-if="activeView === 'assets'">
        <ResourceListView
          v-model:search-query="assetSearchQuery"
          v-model:sort-by="assetSortBy"
          v-model:view-mode="assetViewMode"
          v-model:show-favorites-only="assetShowFavoritesOnly"
          v-model:filter-type="assetFilterType"
          :sort-options="assetSortOptions"
          :filter-options="assetFilterOptions"
          search-placeholder="Search assets..."
          primary-action-label="Upload"
          primary-action-icon="upload"
          :is-empty="filteredAssets.length === 0"
          empty-icon="images"
          empty-title="No assets found"
          :empty-description="assetSearchQuery ? 'Try a different search term' : 'Upload assets to this project'"
          @create-folder="showCreateFolder = true"
        >
          <template #grid>
            <AssetCard
              v-for="asset in filteredAssets"
              :key="asset.id"
              :asset="asset"
              @open="openAsset"
              @toggle-favorite="toggleAssetFavorite"
            />
          </template>
          <template #list>
            <div
              v-for="asset in filteredAssets"
              :key="asset.id"
              class="flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
              @click="openAsset(asset.id)"
            >
              <button
                :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors', asset.favorite ? 'text-amber-500' : 'text-zinc-300 hover:text-amber-500 dark:text-zinc-600']"
                @click.stop="toggleAssetFavorite(asset.id)"
              >
                <Icon :name="asset.favorite ? 'star-fill' : 'star'" size="sm" />
              </button>
              <div class="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <img :src="asset.thumbnail" :alt="asset.name" class="h-full w-full object-cover" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium text-zinc-900 dark:text-foreground">{{ asset.name }}</p>
                <p class="mt-0.5 text-xs capitalize text-muted-foreground">{{ asset.type }}</p>
              </div>
              <span v-if="asset.dimensions" class="text-xs text-zinc-400">{{ asset.dimensions }}</span>
              <span class="text-xs text-zinc-400">{{ asset.size }}</span>
            </div>
          </template>
        </ResourceListView>
      </template>
    </div>

    <!-- Settings Sidebar -->
    <Transition name="settings-sidebar">
      <div
        v-if="showSettings"
        class="w-80 shrink-0 border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div class="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h2 class="text-sm font-semibold text-zinc-900 dark:text-foreground">Project Settings</h2>
          <button
            class="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-foreground"
            @click="showSettings = false"
          >
            <Icon name="times" size="sm" />
          </button>
        </div>
        <div class="p-4">
          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-xs font-medium text-muted-foreground">Project Name</label>
              <input
                type="text"
                :value="project.name"
                class="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-foreground"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-muted-foreground">Description</label>
              <textarea
                :value="project.description"
                rows="3"
                class="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-foreground"
              />
            </div>
          </div>
          <div class="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
            <h3 class="text-xs font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
            <p class="mt-1 text-xs text-red-600/80 dark:text-red-400/80">Delete this project permanently.</p>
            <button class="mt-3 rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/50 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-500/20">
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Share Dialog -->
    <ShareDialog
      v-model:open="showShareDialog"
      item-type="project"
      :item-name="project.name"
      :item-id="projectId"
    />

    <!-- Create Folder Dialog -->
    <Teleport to="body">
      <Transition name="dialog">
        <div
          v-if="showCreateFolder"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          @click.self="showCreateFolder = false"
        >
          <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-foreground">Create New Folder</h3>
            <p class="mt-1 text-sm text-muted-foreground">Enter a name for your new folder.</p>
            <input
              v-model="newFolderName"
              type="text"
              placeholder="Folder name"
              class="mt-4 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-foreground"
              @keyup.enter="createFolder"
            />
            <div class="mt-4 flex justify-end gap-2">
              <button class="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" @click="showCreateFolder = false">Cancel</button>
              <button class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100" :disabled="!newFolderName.trim()" @click="createFolder">Create</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.settings-sidebar-enter-active {
  transition: all 0.25s ease-out;
}

.settings-sidebar-leave-active {
  transition: all 0.2s ease-in;
}

.settings-sidebar-enter-from,
.settings-sidebar-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.dialog-enter-active {
  transition: all 0.2s ease-out;
}

.dialog-leave-active {
  transition: all 0.15s ease-in;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style>
