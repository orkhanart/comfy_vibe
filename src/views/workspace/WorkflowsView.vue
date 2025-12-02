<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  WorkflowCard,
  WorkflowContextMenu,
  WorkflowFileInfoSidebar,
} from '@/components/workspace'
import { MOCK_WORKFLOWS, type Workflow } from '@/data/workspaceMockData'

const route = useRoute()
const router = useRouter()
const workspaceId = computed(() => route.params.workspaceId as string)

// View mode
type ViewMode = 'grid' | 'list'
const viewMode = ref<ViewMode>('grid')

// Sort
type SortOption = 'name' | 'updated' | 'nodes'
const sortBy = ref<SortOption>('updated')

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'nodes', label: 'Node count' }
]

// Favorites filter
const showFavoritesOnly = ref(false)

// Workflows data from centralized mock data
const workflows = ref<Workflow[]>([...MOCK_WORKFLOWS])

function toggleFavorite(workflowId: string) {
  const workflow = workflows.value.find(w => w.id === workflowId)
  if (workflow) {
    workflow.favorite = !workflow.favorite
  }
}

// Search and sort
const searchQuery = ref('')
const filteredWorkflows = computed(() => {
  let result = workflows.value

  // Filter by favorites
  if (showFavoritesOnly.value) {
    result = result.filter(w => w.favorite)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (w) =>
        w.name.toLowerCase().includes(query) ||
        w.description.toLowerCase().includes(query)
    )
  }

  // Sort
  result = [...result].sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'nodes':
        return b.nodeCount - a.nodeCount
      case 'updated':
      default:
        return b.updatedTimestamp - a.updatedTimestamp
    }
  })

  return result
})

// Context menu
const openMenuId = ref<string | null>(null)

function handleOpenMenu(workflowId: string, _event: MouseEvent) {
  openMenuId.value = openMenuId.value === workflowId ? null : workflowId
}

function closeMenu() {
  openMenuId.value = null
}

function handleMenuAction(action: string, workflowId: string) {
  console.log(`Action: ${action} on workflow: ${workflowId}`)
  closeMenu()
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
function openWorkflow(workflowId: string) {
  router.push(`/nodemode/${workspaceId.value}/${workflowId}`)
}

function openInMode(workflowId: string, mode: 'node' | 'linear') {
  closeMenu()
  if (mode === 'node') {
    router.push(`/nodemode/${workspaceId.value}/${workflowId}`)
  } else {
    router.push(`/linear/${workspaceId.value}/${workflowId}`)
  }
}
</script>

<template>
  <div class="p-6" @click="closeMenu">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-foreground">
          Workflows
        </h1>
        <p class="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
          {{ workflows.length }} saved workflows
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent"
        >
          <Icon name="upload" size="xs" />
          Import Workflow
        </button>
        <button
          class="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Icon name="plus" size="xs" />
          Create New Workflow
        </button>
      </div>
    </div>

    <!-- Search, Sort & View Toggle -->
    <div class="mb-6 flex items-center gap-3">
      <div class="relative flex-1">
        <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search workflows..."
          class="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
        />
      </div>

      <!-- Sort -->
      <div class="relative">
        <select
          v-model="sortBy"
          class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:hover:border-zinc-600 dark:focus:border-zinc-500"
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

    <!-- Empty State -->
    <div
      v-if="filteredWorkflows.length === 0"
      class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border"
    >
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-muted">
        <Icon name="sitemap" size="xl" class="text-muted-foreground" />
      </div>
      <h3 class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">No workflows found</h3>
      <p class="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
        {{ searchQuery ? 'Try a different search term' : 'Import or save a workflow to get started' }}
      </p>
    </div>

    <!-- Grid View -->
    <div
      v-else-if="viewMode === 'grid'"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      <div v-for="workflow in filteredWorkflows" :key="workflow.id" class="relative">
        <WorkflowCard
          :workflow="workflow"
          @open="openWorkflow"
          @toggle-favorite="toggleFavorite"
          @open-menu="handleOpenMenu"
        />
        <!-- Context Menu -->
        <WorkflowContextMenu
          v-if="openMenuId === workflow.id"
          :workflow-id="workflow.id"
          class="absolute right-0 top-full z-50"
          @open-node-mode="openInMode($event, 'node')"
          @open-linear-mode="openInMode($event, 'linear')"
          @file-info="openFileInfo"
          @duplicate="handleMenuAction('duplicate', $event)"
          @move="handleMenuAction('move', $event)"
          @rename="handleMenuAction('rename', $event)"
          @share="handleMenuAction('share', $event)"
          @export="handleMenuAction('export', $event)"
          @delete="handleMenuAction('delete', $event)"
          @close="closeMenu"
        />
      </div>
    </div>

    <!-- List View -->
    <div v-else class="rounded-xl border border-zinc-200 bg-white dark:border-border dark:bg-card">
      <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
        <div
          v-for="workflow in filteredWorkflows"
          :key="workflow.id"
          class="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
        >
          <!-- Favorite Button -->
          <button
            :class="[
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
              workflow.favorite
                ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                : 'text-zinc-300 hover:bg-zinc-100 hover:text-amber-500 dark:text-zinc-600 dark:hover:bg-zinc-800'
            ]"
            @click.stop="toggleFavorite(workflow.id)"
          >
            <Icon :name="workflow.favorite ? 'star-fill' : 'star'" size="sm" />
          </button>
          <!-- Thumbnail -->
          <div class="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
            <img :src="workflow.thumbnail" :alt="workflow.name" class="h-full w-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-zinc-900 dark:text-foreground">{{ workflow.name }}</p>
            <div class="mt-1 flex flex-wrap items-center gap-1.5">
              <span
                v-for="tag in workflow.tags"
                :key="tag"
                class="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
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
            <span class="text-xs font-medium text-green-600 dark:text-green-400">
              {{ workflow.cost }}
            </span>
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

    <!-- File Info Sidebar -->
    <WorkflowFileInfoSidebar
      v-if="showFileInfo && selectedWorkflow"
      :workflow="selectedWorkflow"
      @close="closeFileInfo"
      @open="openWorkflow"
      @toggle-favorite="toggleFavorite"
    />
  </div>
</template>
