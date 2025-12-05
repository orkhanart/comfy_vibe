<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { WorkflowCard, AssetCard, ModelCard, PageBreadcrumb } from '@/components/workspace'
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

// Breadcrumb
const breadcrumbItems = computed(() => [
  { label: 'Projects', icon: 'folder', to: '/workspace/projects' },
  { label: project.value.name }
])

// =====================
// VIEW & NAVIGATION (Tabs)
// =====================
type Tab = 'all' | 'workflows' | 'assets' | 'models'
const activeTab = ref<Tab>('all')

const totalCount = computed(() => workflows.value.length + assets.value.length + models.value.length)

const tabs = computed(() => [
  { id: 'all' as Tab, label: 'All', icon: 'layers', count: totalCount.value },
  { id: 'workflows' as Tab, label: 'Workflows', icon: 'sitemap', count: workflows.value.length },
  { id: 'assets' as Tab, label: 'Assets', icon: 'images', count: assets.value.length },
  { id: 'models' as Tab, label: 'Models', icon: 'box', count: models.value.length },
])

// =====================
// SHARED VIEW STATE
// =====================
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('updated')
const showFavoritesOnly = ref(false)
const filterType = ref('all')

const sortOptions = computed(() => {
  if (activeTab.value === 'workflows') {
    return [
      { value: 'updated', label: 'Last updated' },
      { value: 'name', label: 'Name' },
      { value: 'nodes', label: 'Node count' }
    ]
  } else if (activeTab.value === 'assets') {
    return [
      { value: 'updated', label: 'Last updated' },
      { value: 'name', label: 'Name' },
      { value: 'size', label: 'Size' },
      { value: 'type', label: 'Type' }
    ]
  } else {
    return [
      { value: 'updated', label: 'Last updated' },
      { value: 'name', label: 'Name' },
      { value: 'size', label: 'Size' }
    ]
  }
})

const filterOptions = computed(() => {
  if (activeTab.value === 'assets') {
    return [
      { value: 'all', label: 'All types' },
      { value: 'image', label: 'Images' },
      { value: 'video', label: 'Videos' },
      { value: 'audio', label: 'Audio' }
    ]
  } else if (activeTab.value === 'models') {
    return [
      { value: 'all', label: 'All types' },
      { value: 'checkpoint', label: 'Checkpoints' },
      { value: 'lora', label: 'LoRAs' },
      { value: 'vae', label: 'VAEs' },
      { value: 'controlnet', label: 'ControlNets' },
      { value: 'upscaler', label: 'Upscalers' }
    ]
  }
  return null
})

const searchPlaceholder = computed(() => {
  if (activeTab.value === 'all') return 'Search all items...'
  if (activeTab.value === 'workflows') return 'Search workflows...'
  if (activeTab.value === 'assets') return 'Search assets...'
  return 'Search models...'
})

// Reset filters when switching tabs
function switchTab(tab: Tab) {
  activeTab.value = tab
  searchQuery.value = ''
  filterType.value = 'all'
  sortBy.value = 'updated'
}

// =====================
// WORKFLOWS
// =====================
const workflows = ref<Workflow[]>([...MOCK_WORKFLOWS].slice(0, 5))

const filteredWorkflows = computed(() => {
  let result = workflows.value

  if (showFavoritesOnly.value) {
    result = result.filter(w => w.favorite)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(w => w.name.toLowerCase().includes(query) || w.description.toLowerCase().includes(query))
  }

  return [...result].sort((a, b) => {
    switch (sortBy.value) {
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

const filteredModels = computed(() => {
  let result = models.value

  if (showFavoritesOnly.value) {
    result = result.filter(m => m.favorite)
  }

  if (filterType.value !== 'all') {
    result = result.filter(m => m.type === filterType.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m => m.name.toLowerCase().includes(query))
  }

  return [...result].sort((a, b) => {
    switch (sortBy.value) {
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

const filteredAssets = computed(() => {
  let result = assets.value

  if (showFavoritesOnly.value) {
    result = result.filter(a => a.favorite)
  }

  if (filterType.value !== 'all') {
    result = result.filter(a => a.type === filterType.value)
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

function toggleAssetFavorite(assetId: string) {
  const asset = assets.value.find(a => a.id === assetId)
  if (asset) asset.favorite = !asset.favorite
}

function openAsset(assetId: string) {
  console.log('Open asset:', assetId)
}

// Computed for empty state
const isEmpty = computed(() => {
  if (activeTab.value === 'all') return filteredWorkflows.value.length === 0 && filteredAssets.value.length === 0 && filteredModels.value.length === 0
  if (activeTab.value === 'workflows') return filteredWorkflows.value.length === 0
  if (activeTab.value === 'assets') return filteredAssets.value.length === 0
  return filteredModels.value.length === 0
})

const emptyTitle = computed(() => {
  if (activeTab.value === 'all') return 'No items found'
  if (activeTab.value === 'workflows') return 'No workflows found'
  if (activeTab.value === 'assets') return 'No assets found'
  return 'No models found'
})

const emptyDescription = computed(() => {
  if (searchQuery.value) return 'Try a different search term'
  if (activeTab.value === 'all') return 'Add items to this project'
  if (activeTab.value === 'workflows') return 'Add workflows to this project'
  if (activeTab.value === 'assets') return 'Upload assets to this project'
  return 'Add models to this project'
})

const emptyIcon = computed(() => {
  if (activeTab.value === 'all') return 'layers'
  if (activeTab.value === 'workflows') return 'sitemap'
  if (activeTab.value === 'assets') return 'images'
  return 'box'
})

// =====================
// DIALOGS & MENUS
// =====================
const showShareDialog = ref(false)
const projectMenuOpen = ref(false)

function handleProjectAction(action: string) {
  projectMenuOpen.value = false
  console.log('Project action:', action, projectId.value)
}

function handlePrimaryAction() {
  if (activeTab.value === 'workflows') {
    openWorkflow()
  }
}
</script>

<template>
  <div class="flex h-full">
    <div class="flex-1 overflow-auto p-4">
      <!-- Header with Breadcrumb -->
      <div class="mb-4 flex min-h-[30px] items-center justify-between">
        <PageBreadcrumb :items="breadcrumbItems" />
        <div class="flex items-center gap-2">
          <button
            class="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent"
            @click="showShareDialog = true"
          >
            <Icon name="share-alt" size="xs" />
            Share
          </button>
          <Popover v-model:open="projectMenuOpen">
            <PopoverTrigger as-child>
              <button class="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white p-1.5 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600 dark:border-border dark:bg-muted dark:hover:bg-accent dark:hover:text-foreground">
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

      <!-- Line Tabs -->
      <div class="mb-4 flex items-center gap-1 border-b border-border">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors"
          :class="activeTab === tab.id ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
          @click="switchTab(tab.id)"
        >
          <Icon :name="tab.icon" size="sm" />
          {{ tab.label }}
          <span class="text-xs text-muted-foreground">({{ tab.count }})</span>
        </button>
      </div>

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

        <!-- Filter Type (for assets/models) -->
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
          :class="['flex h-9 w-9 items-center justify-center rounded-lg border transition-colors', showFavoritesOnly ? 'border-amber-500 bg-amber-50 text-amber-500 dark:border-amber-500 dark:bg-amber-500/10' : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300 hover:text-amber-500 dark:border-border dark:bg-muted']"
          @click="showFavoritesOnly = !showFavoritesOnly"
        >
          <Icon :name="showFavoritesOnly ? 'star-fill' : 'star'" size="sm" />
        </button>

        <!-- Primary Action -->
        <button
          v-if="activeTab === 'all' || activeTab === 'workflows'"
          class="flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          @click="handlePrimaryAction"
        >
          <Icon name="plus" size="xs" />
          New Workflow
        </button>
        <button
          v-else-if="activeTab === 'assets'"
          class="flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          <Icon name="upload" size="xs" />
          Upload
        </button>
        <button
          v-else
          class="flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          <Icon name="download" size="xs" />
          Import Model
        </button>
      </div>

      <!-- Content -->
      <template v-if="!isEmpty">
        <!-- All Tab - Show all items -->
        <template v-if="activeTab === 'all'">
          <div
            v-if="viewMode === 'grid'"
            class="grid gap-4"
            style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));"
          >
            <WorkflowCard
              v-for="workflow in filteredWorkflows"
              :key="'wf-' + workflow.id"
              :workflow="workflow"
              @open="openWorkflow"
              @toggle-favorite="toggleWorkflowFavorite"
            />
            <AssetCard
              v-for="asset in filteredAssets"
              :key="'as-' + asset.id"
              :asset="asset"
              @open="openAsset"
              @toggle-favorite="toggleAssetFavorite"
            />
            <ModelCard
              v-for="model in filteredModels"
              :key="'md-' + model.id"
              :model="model"
              @click="openModelInfo(model.id)"
              @toggle-favorite="toggleModelFavorite"
            />
          </div>
          <div v-else class="rounded-xl border border-zinc-200 bg-white dark:border-border dark:bg-card">
            <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
              <!-- Workflows in list -->
              <div
                v-for="workflow in filteredWorkflows"
                :key="'wf-' + workflow.id"
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
                  <p class="mt-0.5 text-xs text-muted-foreground">Workflow</p>
                </div>
                <span class="text-xs text-zinc-400">{{ workflow.updatedAt }}</span>
                <button class="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900" @click.stop="openWorkflow">Open</button>
              </div>
              <!-- Assets in list -->
              <div
                v-for="asset in filteredAssets"
                :key="'as-' + asset.id"
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
              <!-- Models in list -->
              <div
                v-for="model in filteredModels"
                :key="'md-' + model.id"
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
            </div>
          </div>
        </template>

        <!-- Workflows Grid/List -->
        <template v-else-if="activeTab === 'workflows'">
          <div
            v-if="viewMode === 'grid'"
            class="grid gap-4"
            style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));"
          >
            <WorkflowCard
              v-for="workflow in filteredWorkflows"
              :key="workflow.id"
              :workflow="workflow"
              @open="openWorkflow"
              @toggle-favorite="toggleWorkflowFavorite"
            />
          </div>
          <div v-else class="rounded-xl border border-zinc-200 bg-white dark:border-border dark:bg-card">
            <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
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
            </div>
          </div>
        </template>

        <!-- Assets Grid/List -->
        <template v-else-if="activeTab === 'assets'">
          <div
            v-if="viewMode === 'grid'"
            class="grid gap-4"
            style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));"
          >
            <AssetCard
              v-for="asset in filteredAssets"
              :key="asset.id"
              :asset="asset"
              @open="openAsset"
              @toggle-favorite="toggleAssetFavorite"
            />
          </div>
          <div v-else class="rounded-xl border border-zinc-200 bg-white dark:border-border dark:bg-card">
            <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
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
            </div>
          </div>
        </template>

        <!-- Models Grid/List -->
        <template v-else>
          <div
            v-if="viewMode === 'grid'"
            class="grid gap-4"
            style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));"
          >
            <ModelCard
              v-for="model in filteredModels"
              :key="model.id"
              :model="model"
              @click="openModelInfo(model.id)"
              @toggle-favorite="toggleModelFavorite"
            />
          </div>
          <div v-else class="rounded-xl border border-zinc-200 bg-white dark:border-border dark:bg-card">
            <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
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
            </div>
          </div>
        </template>
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

    <!-- Share Dialog -->
    <ShareDialog
      v-model:open="showShareDialog"
      item-type="project"
      :item-name="project.name"
      :item-id="projectId"
    />
  </div>
</template>
