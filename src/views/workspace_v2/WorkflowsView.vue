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
} from '@/components/workspace'
import { MOCK_WORKFLOWS, type Workflow } from '@/data/workspaceMockData'
import { useFolders, DRAG_MIME_TYPE, type DragItem } from '@/composables/common/useFolders'

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
  moveItemToFolder,
  moveFolderToFolder,
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

// Ownership tabs
const activeTab = ref<'all' | 'private' | 'shared'>('all')

const sortOptions = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'nodes', label: 'Node count' }
]

// Workflows data with ownership info (mock)
const workflows = ref<(Workflow & { ownership: 'private' | 'shared' })[]>(
  MOCK_WORKFLOWS.map((w, i) => ({
    ...w,
    ownership: i % 3 === 0 ? 'shared' as const : 'private' as const
  }))
)

const filteredWorkflows = computed(() => {
  let result = filterItemsByFolder(workflows.value)

  // Filter by ownership tab
  if (activeTab.value !== 'all') {
    result = result.filter(w => w.ownership === activeTab.value)
  }

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
  router.push('/workflow-editor')
}

// Drag and drop
const isDragOverView = ref(false)

function handleFolderDrop(targetFolderId: string, dragItem: DragItem) {
  if (dragItem.type === 'folder') {
    moveFolderToFolder(dragItem.id, targetFolderId)
  } else if (dragItem.type === 'workflow') {
    moveItemToFolder(workflows.value, dragItem.id, targetFolderId)
  }
}

function handleBreadcrumbDrop(targetFolderId: string | null, dragItem: DragItem) {
  if (dragItem.type === 'folder') {
    moveFolderToFolder(dragItem.id, targetFolderId)
  } else if (dragItem.type === 'workflow') {
    moveItemToFolder(workflows.value, dragItem.id, targetFolderId)
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
    } else if (dragItem.type === 'workflow') {
      moveItemToFolder(workflows.value, dragItem.id, currentFolderId.value)
    }
  } catch {
    // Invalid JSON, ignore
  }
}
</script>

<template>
  <div
    class="p-4"
    @click="closeMenu"
    @dragenter="handleViewDragEnter"
    @dragover="handleViewDragOver"
    @dragleave="handleViewDragLeave"
    @drop="handleViewDrop"
  >
    <!-- Header with Breadcrumb and Actions -->
    <div class="mb-4 flex items-center justify-between">
      <FolderBreadcrumbs
        :path="breadcrumbPath"
        root-label="Workflows"
        root-icon="sitemap"
        @navigate="navigateToFolder"
        @drop="handleBreadcrumbDrop"
      />
      <div class="flex items-center gap-1.5">
        <button
          class="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent"
        >
          <Icon name="upload" size="xs" />
          Import
        </button>
        <button
          class="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          @click="openWorkflow"
        >
          <Icon name="plus" size="xs" />
          New Workflow
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
      :sort-options="sortOptions"
      search-placeholder="Search workflows..."
      :is-empty="filteredWorkflows.length === 0 && foldersAtCurrentLevel.length === 0"
      empty-icon="sitemap"
      empty-title="No workflows found"
      :empty-description="searchQuery ? 'Try a different search term' : 'Import or save a workflow to get started'"
      @create-folder="showCreateFolderDialog = true"
    >
      <template #grid>
        <!-- Folders -->
        <div v-for="folder in foldersAtCurrentLevel" :key="'folder-' + folder.id" class="relative">
          <FolderCard
            :folder="folder"
            :item-count="getItemCount(folder.id, workflows)"
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
        <!-- Workflows -->
        <div v-for="workflow in filteredWorkflows" :key="'workflow-' + workflow.id" class="relative">
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
