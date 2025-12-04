<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  WorkflowCard,
  WorkflowContextMenu,
  WorkflowFileInfoSidebar,
  FolderCard,
  FolderBreadcrumbs,
  FolderContextMenu,
  CreateFolderDialog,
  ResourceListView,
  PageBreadcrumb,
} from '@/components/workspace'
import { MOCK_WORKFLOWS, type Workflow } from '@/data/workspaceMockData'
import { useFolders } from '@/composables/common/useFolders'

const router = useRouter()

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
} = useFolders('workflows')

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

const sortOptions = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'nodes', label: 'Node count' }
]

// Workflows data
const workflows = ref<Workflow[]>([...MOCK_WORKFLOWS])

const filteredWorkflows = computed(() => {
  let result = filterItemsByFolder(workflows.value)

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

function toggleFavorite(workflowId: string) {
  const workflow = workflows.value.find(w => w.id === workflowId)
  if (workflow) workflow.favorite = !workflow.favorite
}

// Context menu
const openMenuId = ref<string | null>(null)

function handleOpenMenu(workflowId: string) {
  openMenuId.value = openMenuId.value === workflowId ? null : workflowId
}

function closeMenu() {
  openMenuId.value = null
  openFolderMenuId.value = null
}

// File info sidebar
const showFileInfo = ref(false)
const selectedWorkflow = ref<Workflow | null>(null)

function openFileInfo(workflowId: string) {
  const workflow = workflows.value.find(w => w.id === workflowId)
  if (workflow) {
    selectedWorkflow.value = workflow
    showFileInfo.value = true
  }
  closeMenu()
}

function closeFileInfo() {
  showFileInfo.value = false
  selectedWorkflow.value = null
}

// Navigation
function openWorkflow() {
  router.push('/node')
}
</script>

<template>
  <div class="p-4" @click="closeMenu">
    <PageBreadcrumb label="Workflows" icon="sitemap" />

    <!-- Header Actions -->
    <div class="mb-4 flex items-center justify-end">
      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent"
        >
          <Icon name="upload" size="xs" />
          Import Workflow
        </button>
        <button
          class="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          @click="openWorkflow"
        >
          <Icon name="plus" size="xs" />
          Create New Workflow
        </button>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <FolderBreadcrumbs
      v-if="currentFolderId"
      :path="breadcrumbPath"
      root-label="Workflows"
      class="mb-4"
      @navigate="navigateToFolder"
    />

    <!-- Resource List -->
    <ResourceListView
      v-model:search-query="searchQuery"
      v-model:sort-by="sortBy"
      v-model:view-mode="viewMode"
      v-model:show-favorites-only="showFavoritesOnly"
      :sort-options="sortOptions"
      search-placeholder="Search workflows..."
      :is-empty="filteredWorkflows.length === 0 && foldersAtCurrentLevel.length === 0"
      empty-icon="sitemap"
      empty-title="No workflows found"
      :empty-description="searchQuery ? 'Try a different search term' : 'Import or save a workflow to get started'"
      @create-folder="showCreateFolderDialog = true"
    >
      <!-- Folders Section -->
      <template #folders>
        <div v-if="foldersAtCurrentLevel.length > 0" class="mb-6">
          <h3 class="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">Folders</h3>
          <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
            <div v-for="folder in foldersAtCurrentLevel" :key="folder.id" class="relative">
              <FolderCard
                :folder="folder"
                :item-count="getItemCount(folder.id, workflows)"
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
        <!-- Workflows Section Header -->
        <h3 v-if="foldersAtCurrentLevel.length > 0 && filteredWorkflows.length > 0" class="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Workflows
        </h3>
      </template>

      <template #grid>
        <div v-for="workflow in filteredWorkflows" :key="workflow.id" class="relative">
          <WorkflowCard
            :workflow="workflow"
            @open="openWorkflow"
            @toggle-favorite="toggleFavorite"
            @open-menu="handleOpenMenu"
          />
          <WorkflowContextMenu
            v-if="openMenuId === workflow.id"
            :workflow-id="workflow.id"
            class="absolute right-0 top-full z-50"
            @open-node-mode="openWorkflow"
            @open-linear-mode="openWorkflow"
            @file-info="openFileInfo"
            @close="closeMenu"
          />
        </div>
      </template>
      <template #list>
        <div
          v-for="workflow in filteredWorkflows"
          :key="workflow.id"
          class="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
        >
          <button
            :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors', workflow.favorite ? 'text-amber-500' : 'text-zinc-300 hover:text-amber-500 dark:text-zinc-600']"
            @click.stop="toggleFavorite(workflow.id)"
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
          <button class="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900" @click.stop="openWorkflow">
            <Icon name="external-link" size="xs" class="mr-1.5 inline" />
            Open
          </button>
        </div>
      </template>
    </ResourceListView>

    <!-- File Info Sidebar -->
    <WorkflowFileInfoSidebar
      v-if="showFileInfo && selectedWorkflow"
      :workflow="selectedWorkflow"
      @close="closeFileInfo"
      @open="openWorkflow"
      @toggle-favorite="toggleFavorite"
    />

    <!-- Create Folder Dialog -->
    <CreateFolderDialog
      v-model:visible="showCreateFolderDialog"
      @create="handleCreateFolder"
    />
  </div>
</template>
