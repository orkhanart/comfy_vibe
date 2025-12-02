<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { WorkflowCard, AssetCard, ModelCard } from '@/components/workspace'
import { FavoriteButton } from '@/components/common'
import { MOCK_WORKFLOWS, MOCK_ASSETS, MOCK_MODELS, getAssetIcon, type Workflow, type Asset, type Model } from '@/data/workspaceMockData'

const route = useRoute()
const router = useRouter()
const workspaceId = computed(() => route.params.workspaceId as string)
const projectId = computed(() => route.params.projectId as string)

// Mock project data
const project = computed(() => ({
  id: projectId.value,
  name: projectId.value === 'proj-1' ? 'Marketing Campaign'
      : projectId.value === 'proj-2' ? 'Product Launch'
      : projectId.value === 'proj-3' ? 'Social Media'
      : 'New Project',
  description: 'A collection of workflows and assets for this project.',
  createdAt: 'Nov 15, 2024',
  updatedAt: '2 hours ago',
}))

// =====================
// WORKFLOWS
// =====================
const workflows = ref<Workflow[]>([...MOCK_WORKFLOWS].slice(0, 5))
const workflowSearchQuery = ref('')
const workflowViewMode = ref<'grid' | 'list'>('grid')
const workflowSortBy = ref<'updated' | 'name' | 'nodes'>('updated')
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

  result = [...result].sort((a, b) => {
    switch (workflowSortBy.value) {
      case 'name': return a.name.localeCompare(b.name)
      case 'nodes': return b.nodeCount - a.nodeCount
      case 'updated':
      default: return b.updatedTimestamp - a.updatedTimestamp
    }
  })

  return result
})

function toggleWorkflowFavorite(workflowId: string) {
  const workflow = workflows.value.find(w => w.id === workflowId)
  if (workflow) {
    workflow.favorite = !workflow.favorite
  }
}

function openWorkflow(workflowId: string) {
  router.push(`/nodemode/${workspaceId.value}/${workflowId}`)
}

// =====================
// ASSETS
// =====================
const assets = ref<Asset[]>([...MOCK_ASSETS].slice(0, 6))
const assetSearchQuery = ref('')
const assetViewMode = ref<'grid' | 'list'>('grid')
const assetSortBy = ref<'updated' | 'name' | 'size' | 'type'>('updated')
const assetFilterType = ref<'all' | 'image' | 'video' | 'audio'>('all')
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

  result = [...result].sort((a, b) => {
    switch (assetSortBy.value) {
      case 'name': return a.name.localeCompare(b.name)
      case 'size': return b.sizeBytes - a.sizeBytes
      case 'type': return a.type.localeCompare(b.type)
      case 'updated':
      default: return b.updatedTimestamp - a.updatedTimestamp
    }
  })

  return result
})

function toggleAssetFavorite(assetId: string) {
  const asset = assets.value.find(a => a.id === assetId)
  if (asset) {
    asset.favorite = !asset.favorite
  }
}

function openAsset(assetId: string) {
  console.log('Open asset:', assetId)
}

// =====================
// MODELS
// =====================
const models = ref<Model[]>([...MOCK_MODELS].slice(0, 6))
const modelSearchQuery = ref('')
const modelViewMode = ref<'grid' | 'list'>('grid')
const modelSortBy = ref<'updated' | 'name' | 'size'>('updated')
const modelFilterType = ref<'all' | 'checkpoint' | 'lora' | 'vae' | 'controlnet' | 'upscaler'>('all')
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

  result = [...result].sort((a, b) => {
    switch (modelSortBy.value) {
      case 'name': return a.name.localeCompare(b.name)
      case 'size': return b.sizeBytes - a.sizeBytes
      case 'updated':
      default: return b.updatedTimestamp - a.updatedTimestamp
    }
  })

  return result
})

function toggleModelFavorite(modelId: string) {
  const model = models.value.find(m => m.id === modelId)
  if (model) {
    model.favorite = !model.favorite
  }
}

// Model info sidebar
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
}

// =====================
// VIEW & NAVIGATION
// =====================
type View = 'home' | 'workflows' | 'models' | 'assets'
const activeView = ref<View>('home')

const mainFolders = computed(() => [
  { id: 'workflows', label: 'Workflows', icon: 'sitemap', color: 'bg-purple-100 dark:bg-purple-500/20', iconColor: 'text-purple-600 dark:text-purple-400', count: workflows.value.length },
  { id: 'models', label: 'Models', icon: 'box', color: 'bg-orange-100 dark:bg-orange-500/20', iconColor: 'text-orange-600 dark:text-orange-400', count: models.value.length },
  { id: 'assets', label: 'Assets', icon: 'images', color: 'bg-blue-100 dark:bg-blue-500/20', iconColor: 'text-blue-600 dark:text-blue-400', count: assets.value.length },
])

// User-created folders within project
const userFolders = ref<{ id: string; name: string; icon: string; parentType: string }[]>([])

// Create folder dialog
const showCreateFolder = ref(false)
const newFolderName = ref('')

function createFolder() {
  if (newFolderName.value.trim()) {
    userFolders.value.push({
      id: `folder-${Date.now()}`,
      name: newFolderName.value.trim(),
      icon: 'folder',
      parentType: activeView.value
    })
    newFolderName.value = ''
    showCreateFolder.value = false
  }
}

function deleteFolder(folderId: string) {
  userFolders.value = userFolders.value.filter(f => f.id !== folderId)
}

function openFolder(folderId: string) {
  activeView.value = folderId as View
}

function goBack() {
  activeView.value = 'home'
}

// Settings dialog
const showSettings = ref(false)

// Project actions menu
const projectMenuOpen = ref(false)

function handleProjectAction(action: string) {
  projectMenuOpen.value = false

  switch (action) {
    case 'rename':
      console.log('Rename project:', projectId.value)
      break
    case 'duplicate':
      console.log('Duplicate project:', projectId.value)
      break
    case 'move':
      console.log('Move project:', projectId.value)
      break
    case 'share':
      console.log('Share project:', projectId.value)
      break
    case 'delete':
      console.log('Delete project:', projectId.value)
      break
  }
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Project Header -->
    <div class="border-b border-zinc-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Back button when in a folder -->
          <button
            v-if="activeView !== 'home'"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-foreground"
            @click="goBack"
          >
            <Icon name="arrow-left" size="sm" />
          </button>
          <div>
            <h1 class="flex items-center gap-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-foreground">
              <Icon name="folder" size="lg" class="text-zinc-400" />
              {{ project.name }}
              <span v-if="activeView !== 'home'" class="text-zinc-400"> / {{ activeView.charAt(0).toUpperCase() + activeView.slice(1) }}</span>
            </h1>
          </div>
        </div>
        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Share Button -->
          <button
            class="flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-foreground dark:hover:bg-zinc-700"
            @click="handleProjectAction('share')"
          >
            <Icon name="share" size="sm" />
            Share
          </button>

          <!-- Settings Button -->
          <button
            class="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-foreground"
            title="Project Settings"
            @click="showSettings = !showSettings"
          >
            <Icon name="cog" size="sm" />
          </button>

          <!-- More Actions Menu -->
          <Popover v-model:open="projectMenuOpen">
            <PopoverTrigger as-child>
              <button
                class="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-foreground"
                title="More actions"
              >
                <Icon name="ellipsis-v" size="sm" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" :side-offset="4" class="w-48 p-1">
              <button
                class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                @click="handleProjectAction('rename')"
              >
                <Icon name="pencil" size="sm" class="text-zinc-400" />
                Rename
              </button>
              <button
                class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                @click="handleProjectAction('duplicate')"
              >
                <Icon name="copy" size="sm" class="text-zinc-400" />
                Duplicate
              </button>
              <button
                class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                @click="handleProjectAction('move')"
              >
                <Icon name="folder-tree" size="sm" class="text-zinc-400" />
                Move to...
              </button>
              <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />
              <button
                class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                @click="handleProjectAction('delete')"
              >
                <Icon name="trash" size="sm" />
                Delete
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex h-full">
      <div class="flex-1 overflow-auto p-6">
        <!-- Home View - Folder Cards -->
        <template v-if="activeView === 'home'">
          <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
            <!-- Main Folders (Workflows, Models, Assets) -->
            <div
              v-for="folder in mainFolders"
              :key="folder.id"
              class="group cursor-pointer rounded-xl bg-white transition-all hover:shadow-md dark:bg-card"
              @click="openFolder(folder.id)"
            >
              <!-- Folder Visual -->
              <div class="relative aspect-square overflow-hidden rounded-t-xl bg-zinc-100 dark:bg-zinc-800">
                <div class="flex h-full w-full items-center justify-center">
                  <div :class="['flex h-20 w-20 items-center justify-center rounded-2xl transition-transform group-hover:scale-110', folder.color]">
                    <Icon :name="folder.icon" size="3xl" :class="folder.iconColor" />
                  </div>
                </div>
                <!-- Item count badge -->
                <div class="absolute bottom-2 right-2">
                  <span class="rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    {{ folder.count }} items
                  </span>
                </div>
              </div>
              <!-- Footer -->
              <div class="flex items-center gap-2 px-3 py-2.5">
                <div :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', folder.color]">
                  <Icon :name="folder.icon" size="sm" :class="folder.iconColor" />
                </div>
                <h3 class="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-foreground">{{ folder.label }}</h3>
                <button
                  class="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-xs font-medium text-white opacity-0 transition-all hover:bg-zinc-800 group-hover:opacity-100 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                  @click.stop="openFolder(folder.id)"
                >
                  <Icon name="external-link" size="xs" />
                  Open
                </button>
              </div>
            </div>

            <!-- User-Created Folders -->
            <div
              v-for="folder in userFolders"
              :key="folder.id"
              class="group cursor-pointer rounded-xl bg-white transition-all hover:shadow-md dark:bg-card"
              @click="openFolder(folder.id)"
            >
              <div class="relative aspect-square overflow-hidden rounded-t-xl bg-zinc-100 dark:bg-zinc-800">
                <div class="flex h-full w-full items-center justify-center">
                  <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-200 transition-transform group-hover:scale-110 dark:bg-zinc-700">
                    <Icon name="folder" size="3xl" class="text-zinc-500 dark:text-zinc-400" />
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 px-3 py-2.5">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-700">
                  <Icon name="folder" size="sm" class="text-zinc-500 dark:text-zinc-400" />
                </div>
                <h3 class="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-foreground">{{ folder.name }}</h3>
                <button
                  class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-400 opacity-0 transition-all hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-500/20 dark:hover:text-red-400"
                  title="Delete folder"
                  @click.stop="deleteFolder(folder.id)"
                >
                  <Icon name="trash" size="sm" />
                </button>
              </div>
            </div>

            <!-- Create New Folder Card -->
            <div
              class="group cursor-pointer rounded-xl border-2 border-dashed border-zinc-200 bg-white/50 transition-all hover:border-zinc-300 hover:bg-white hover:shadow-md dark:border-zinc-700 dark:bg-card/50 dark:hover:border-zinc-600 dark:hover:bg-card"
              @click="showCreateFolder = true"
            >
              <div class="relative aspect-square overflow-hidden rounded-t-xl">
                <div class="flex h-full w-full items-center justify-center">
                  <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-100 transition-transform group-hover:scale-110 dark:bg-zinc-800">
                    <Icon name="plus" size="3xl" class="text-zinc-400 dark:text-zinc-500" />
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 px-3 py-2.5">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Icon name="folder-plus" size="sm" class="text-zinc-400 dark:text-zinc-500" />
                </div>
                <h3 class="min-w-0 flex-1 truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">New Folder</h3>
              </div>
            </div>
          </div>

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
                    <button
                      class="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      @click="showCreateFolder = false"
                    >
                      Cancel
                    </button>
                    <button
                      class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                      :disabled="!newFolderName.trim()"
                      @click="createFolder"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </Teleport>
        </template>

        <!-- Workflows View -->
        <template v-else-if="activeView === 'workflows'">
          <!-- Action Bar -->
          <div class="mb-4 flex items-center gap-3">
            <!-- Search -->
            <div class="relative flex-1">
              <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                v-model="workflowSearchQuery"
                type="text"
                placeholder="Search workflows..."
                class="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:placeholder-zinc-500"
              />
            </div>
            <!-- Sort -->
            <div class="relative">
              <select
                v-model="workflowSortBy"
                class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground"
              >
                <option v-for="option in workflowSortOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
            <!-- View Toggle -->
            <div class="flex rounded-lg border border-zinc-200 dark:border-border">
              <button
                :class="['px-3 py-2 text-sm transition-colors', workflowViewMode === 'grid' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground' : 'text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground']"
                @click="workflowViewMode = 'grid'"
              >
                <Icon name="th-large" size="md" />
              </button>
              <button
                :class="['px-3 py-2 text-sm transition-colors', workflowViewMode === 'list' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground' : 'text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground']"
                @click="workflowViewMode = 'list'"
              >
                <Icon name="list" size="md" />
              </button>
            </div>
            <!-- Favorites Filter -->
            <button
              :class="['flex h-9 w-9 items-center justify-center rounded-lg border transition-colors', workflowShowFavoritesOnly ? 'border-amber-500 bg-amber-50 text-amber-500 dark:border-amber-500 dark:bg-amber-500/10' : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300 hover:text-amber-500 dark:border-border dark:bg-muted']"
              @click="workflowShowFavoritesOnly = !workflowShowFavoritesOnly"
            >
              <Icon :name="workflowShowFavoritesOnly ? 'star-fill' : 'star'" size="sm" />
            </button>
            <!-- New Folder -->
            <button
              class="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent"
              @click="showCreateFolder = true"
            >
              <Icon name="folder-plus" size="xs" />
              New Folder
            </button>
            <!-- Create New -->
            <button
              class="flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              <Icon name="plus" size="xs" />
              New Workflow
            </button>
          </div>

          <!-- Grid View -->
          <div
            v-if="workflowViewMode === 'grid'"
            class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));"
          >
            <WorkflowCard
              v-for="workflow in filteredWorkflows"
              :key="workflow.id"
              :workflow="workflow"
              @open="openWorkflow"
              @toggle-favorite="toggleWorkflowFavorite"
            />
          </div>

          <!-- List View -->
          <div v-else class="rounded-xl border border-zinc-200 bg-white dark:border-border dark:bg-card">
            <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
              <div
                v-for="workflow in filteredWorkflows"
                :key="workflow.id"
                class="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
              >
                <button
                  :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors', workflow.favorite ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10' : 'text-zinc-300 hover:bg-zinc-100 hover:text-amber-500 dark:text-zinc-600 dark:hover:bg-zinc-800']"
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
                    <span v-for="tag in workflow.tags" :key="tag" class="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {{ tag }}
                    </span>
                  </div>
                </div>
                <div class="flex shrink-0 items-center gap-3">
                  <span class="flex items-center gap-1 text-xs text-zinc-400">
                    <Icon name="cube" size="xs" />
                    {{ workflow.nodeCount }}
                  </span>
                  <span class="flex items-center gap-1 text-xs text-zinc-400">
                    <Icon name="clock" size="xs" />
                    {{ workflow.runtime }}
                  </span>
                  <span class="text-xs font-medium text-green-600 dark:text-green-400">{{ workflow.cost }}</span>
                </div>
                <span class="w-20 shrink-0 text-right text-xs text-zinc-400">{{ workflow.updatedAt }}</span>
                <button
                  class="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  @click.stop="openWorkflow(workflow.id)"
                >
                  <Icon name="external-link" size="xs" />
                  Open
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="filteredWorkflows.length === 0"
            class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border"
          >
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Icon name="sitemap" size="xl" class="text-zinc-400" />
            </div>
            <p class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">No workflows found</p>
            <p class="mt-1 text-sm text-muted-foreground">{{ workflowSearchQuery ? 'Try a different search term' : 'Add workflows to this project' }}</p>
          </div>
        </template>

        <!-- Models View -->
        <template v-else-if="activeView === 'models'">
          <!-- Action Bar -->
          <div class="mb-4 flex items-center gap-3">
            <!-- Search -->
            <div class="relative flex-1">
              <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                v-model="modelSearchQuery"
                type="text"
                placeholder="Search models..."
                class="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:placeholder-zinc-500"
              />
            </div>
            <!-- Filter Type -->
            <div class="relative">
              <select
                v-model="modelFilterType"
                class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground"
              >
                <option v-for="option in modelFilterOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
            <!-- Sort -->
            <div class="relative">
              <select
                v-model="modelSortBy"
                class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground"
              >
                <option v-for="option in modelSortOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
            <!-- View Toggle -->
            <div class="flex rounded-lg border border-zinc-200 dark:border-border">
              <button
                :class="['px-3 py-2 text-sm transition-colors', modelViewMode === 'grid' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground' : 'text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground']"
                @click="modelViewMode = 'grid'"
              >
                <Icon name="th-large" size="md" />
              </button>
              <button
                :class="['px-3 py-2 text-sm transition-colors', modelViewMode === 'list' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground' : 'text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground']"
                @click="modelViewMode = 'list'"
              >
                <Icon name="list" size="md" />
              </button>
            </div>
            <!-- Favorites Filter -->
            <button
              :class="['flex h-9 w-9 items-center justify-center rounded-lg border transition-colors', modelShowFavoritesOnly ? 'border-amber-500 bg-amber-50 text-amber-500 dark:border-amber-500 dark:bg-amber-500/10' : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300 hover:text-amber-500 dark:border-border dark:bg-muted']"
              @click="modelShowFavoritesOnly = !modelShowFavoritesOnly"
            >
              <Icon :name="modelShowFavoritesOnly ? 'star-fill' : 'star'" size="sm" />
            </button>
            <!-- New Folder -->
            <button
              class="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent"
              @click="showCreateFolder = true"
            >
              <Icon name="folder-plus" size="xs" />
              New Folder
            </button>
            <!-- Import Model -->
            <button
              class="flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              <Icon name="download" size="xs" />
              Import Model
            </button>
          </div>

          <!-- Grid View -->
          <div
            v-if="modelViewMode === 'grid'"
            class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));"
          >
            <ModelCard
              v-for="model in filteredModels"
              :key="model.id"
              :model="model"
              @click="openModelInfo(model.id)"
              @toggle-favorite="toggleModelFavorite"
            />
          </div>

          <!-- List View -->
          <div v-else class="rounded-xl border border-zinc-200 bg-white dark:border-border dark:bg-card">
            <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
              <div
                v-for="model in filteredModels"
                :key="model.id"
                class="flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
                @click="openModelInfo(model.id)"
              >
                <button
                  :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors', model.favorite ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10' : 'text-zinc-300 hover:bg-zinc-100 hover:text-amber-500 dark:text-zinc-600 dark:hover:bg-zinc-800']"
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
                <span class="shrink-0 rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {{ model.baseModel }}
                </span>
                <span class="w-16 shrink-0 text-right text-xs text-zinc-400">{{ model.size }}</span>
                <span class="w-20 shrink-0 text-right text-xs text-zinc-400">{{ model.updatedAt }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="filteredModels.length === 0"
            class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border"
          >
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Icon name="box" size="xl" class="text-zinc-400" />
            </div>
            <p class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">No models found</p>
            <p class="mt-1 text-sm text-muted-foreground">{{ modelSearchQuery ? 'Try a different search term' : 'Add models to this project' }}</p>
          </div>
        </template>

        <!-- Assets View -->
        <template v-else-if="activeView === 'assets'">
          <!-- Action Bar -->
          <div class="mb-4 flex items-center gap-3">
            <!-- Search -->
            <div class="relative flex-1">
              <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                v-model="assetSearchQuery"
                type="text"
                placeholder="Search assets..."
                class="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:placeholder-zinc-500"
              />
            </div>
            <!-- Filter Type -->
            <div class="relative">
              <select
                v-model="assetFilterType"
                class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground"
              >
                <option v-for="option in assetFilterOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
            <!-- Sort -->
            <div class="relative">
              <select
                v-model="assetSortBy"
                class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground"
              >
                <option v-for="option in assetSortOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
            <!-- View Toggle -->
            <div class="flex rounded-lg border border-zinc-200 dark:border-border">
              <button
                :class="['px-3 py-2 text-sm transition-colors', assetViewMode === 'grid' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground' : 'text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground']"
                @click="assetViewMode = 'grid'"
              >
                <Icon name="th-large" size="md" />
              </button>
              <button
                :class="['px-3 py-2 text-sm transition-colors', assetViewMode === 'list' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground' : 'text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground']"
                @click="assetViewMode = 'list'"
              >
                <Icon name="list" size="md" />
              </button>
            </div>
            <!-- Favorites Filter -->
            <button
              :class="['flex h-9 w-9 items-center justify-center rounded-lg border transition-colors', assetShowFavoritesOnly ? 'border-amber-500 bg-amber-50 text-amber-500 dark:border-amber-500 dark:bg-amber-500/10' : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300 hover:text-amber-500 dark:border-border dark:bg-muted']"
              @click="assetShowFavoritesOnly = !assetShowFavoritesOnly"
            >
              <Icon :name="assetShowFavoritesOnly ? 'star-fill' : 'star'" size="sm" />
            </button>
            <!-- New Folder -->
            <button
              class="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent"
              @click="showCreateFolder = true"
            >
              <Icon name="folder-plus" size="xs" />
              New Folder
            </button>
            <!-- Upload -->
            <button
              class="flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              <Icon name="upload" size="xs" />
              Upload
            </button>
          </div>

          <!-- Grid View -->
          <div
            v-if="assetViewMode === 'grid'"
            class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));"
          >
            <AssetCard
              v-for="asset in filteredAssets"
              :key="asset.id"
              :asset="asset"
              @open="openAsset"
              @toggle-favorite="toggleAssetFavorite"
              @menu="(id, event) => console.log('Asset menu:', id, event)"
            />
          </div>

          <!-- List View -->
          <div v-else class="rounded-xl border border-zinc-200 bg-white dark:border-border dark:bg-card">
            <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
              <div
                v-for="asset in filteredAssets"
                :key="asset.id"
                class="flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
                @click="openAsset(asset.id)"
              >
                <button
                  :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors', asset.favorite ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10' : 'text-zinc-300 hover:bg-zinc-100 hover:text-amber-500 dark:text-zinc-600 dark:hover:bg-zinc-800']"
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
                <span v-if="asset.dimensions" class="shrink-0 text-xs text-zinc-400">{{ asset.dimensions }}</span>
                <span class="w-16 shrink-0 text-right text-xs text-zinc-400">{{ asset.size }}</span>
                <span class="w-20 shrink-0 text-right text-xs text-zinc-400">{{ asset.updatedAt }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="filteredAssets.length === 0"
            class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border"
          >
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Icon name="images" size="xl" class="text-zinc-400" />
            </div>
            <p class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">No assets found</p>
            <p class="mt-1 text-sm text-muted-foreground">{{ assetSearchQuery ? 'Try a different search term' : 'Upload assets to this project' }}</p>
          </div>
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
            <!-- Project Info -->
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

            <!-- Danger Zone -->
            <div class="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
              <h3 class="text-xs font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
              <p class="mt-1 text-xs text-red-600/80 dark:text-red-400/80">
                Delete this project permanently.
              </p>
              <button class="mt-3 rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/50 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-500/20">
                Delete Project
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
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

.dialog-enter-from > div,
.dialog-leave-to > div {
  transform: scale(0.95);
}
</style>
