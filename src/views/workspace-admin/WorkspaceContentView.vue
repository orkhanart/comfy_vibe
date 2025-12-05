<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { PageBreadcrumb } from '@/components/workspace'
import { ref, computed } from 'vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'

const workspaceStore = useWorkspaceStore()
const currentWorkspace = computed(() => workspaceStore.currentWorkspace)

const breadcrumbItems = computed(() => [
  { label: '', icon: 'home', to: '/workspace' },
  { label: currentWorkspace.value?.name || 'Workspace', icon: 'users', to: '/workspace/manage' },
  { label: 'Content' }
])

// Tabs
type Tab = 'all' | 'workflows' | 'assets' | 'models'
const activeTab = ref<Tab>('all')

const tabs = [
  { id: 'all' as Tab, label: 'All', icon: 'th-large' },
  { id: 'workflows' as Tab, label: 'Workflows', icon: 'sitemap' },
  { id: 'assets' as Tab, label: 'Assets', icon: 'image' },
  { id: 'models' as Tab, label: 'Models', icon: 'box' },
]

// Search
const searchQuery = ref('')

// Mock recent content
interface ContentItem {
  id: string
  name: string
  type: 'workflow' | 'asset' | 'model'
  owner: string
  size: string
  updatedAt: string
  thumbnail?: string
}

const recentContent = ref<ContentItem[]>([
  { id: '1', name: 'Product Photo Workflow', type: 'workflow', owner: 'John Doe', size: '2.4 MB', updatedAt: '2 hours ago', thumbnail: '/assets/card_images/workflow_01.webp' },
  { id: '2', name: 'Brand Logo Assets', type: 'asset', owner: 'Alice Chen', size: '15.2 MB', updatedAt: '5 hours ago' },
  { id: '3', name: 'Custom LoRA v2', type: 'model', owner: 'Bob Wilson', size: '156 MB', updatedAt: '1 day ago' },
  { id: '4', name: 'Background Remover', type: 'workflow', owner: 'Carol Smith', size: '1.8 MB', updatedAt: '2 days ago', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp' },
  { id: '5', name: 'Product Images Pack', type: 'asset', owner: 'David Lee', size: '89 MB', updatedAt: '3 days ago' },
  { id: '6', name: 'Portrait Enhancement', type: 'workflow', owner: 'Emily Zhang', size: '3.1 MB', updatedAt: '4 days ago' },
  { id: '7', name: 'SDXL Base Model', type: 'model', owner: 'Frank Miller', size: '6.5 GB', updatedAt: '1 week ago' },
])

const filteredContent = computed(() => {
  let items = recentContent.value

  // Filter by tab
  if (activeTab.value !== 'all') {
    const typeMap: Record<string, string> = {
      workflows: 'workflow',
      assets: 'asset',
      models: 'model',
    }
    items = items.filter(c => c.type === typeMap[activeTab.value])
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.owner.toLowerCase().includes(query)
    )
  }

  return items
})

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    workflow: 'sitemap',
    asset: 'image',
    model: 'box',
  }
  return icons[type] || 'file'
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    workflow: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    asset: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    model: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  }
  return colors[type] || 'bg-muted text-muted-foreground'
}

function deleteContent(id: string) {
  if (confirm('Are you sure you want to delete this item?')) {
    recentContent.value = recentContent.value.filter(c => c.id !== id)
  }
}
</script>

<template>
  <div class="h-full overflow-y-auto p-6">
    <!-- Breadcrumb -->
    <PageBreadcrumb :items="breadcrumbItems" class="mb-4" />

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-foreground">Content</h1>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex items-center gap-1 border-b border-border">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors"
        :class="activeTab === tab.id ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
        @click="activeTab = tab.id"
      >
        <Icon :name="tab.icon" size="sm" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Search & Filters -->
    <div class="mb-6 flex items-center gap-3">
      <div class="relative flex-1 max-w-sm">
        <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search content..."
          class="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
        />
      </div>
    </div>

    <!-- Content List -->
    <div>
      <!-- Table Header -->
      <div class="flex items-center gap-4 border-b border-border px-1 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <div class="flex-1">Name</div>
        <div class="w-24">Type</div>
        <div class="w-32">Owner</div>
        <div class="w-20 text-right">Size</div>
        <div class="w-28 text-right">Updated</div>
        <div class="w-20 text-right">Actions</div>
      </div>

      <!-- Content Items -->
      <div class="divide-y divide-border">
        <div
          v-for="item in filteredContent"
          :key="item.id"
          class="flex items-center gap-4 px-1 py-4 transition-colors hover:bg-muted/30"
        >
          <!-- Name -->
          <div class="flex flex-1 items-center gap-3">
            <div v-if="item.thumbnail" class="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
              <img :src="item.thumbnail" :alt="item.name" class="h-full w-full object-cover" />
            </div>
            <div v-else :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', getTypeColor(item.type)]">
              <Icon :name="getTypeIcon(item.type)" size="sm" />
            </div>
            <span class="font-medium text-foreground">{{ item.name }}</span>
          </div>

          <!-- Type -->
          <div class="w-24">
            <span :class="['rounded-md px-2 py-1 text-xs font-medium capitalize', getTypeColor(item.type)]">
              {{ item.type }}
            </span>
          </div>

          <!-- Owner -->
          <div class="w-32 text-sm text-muted-foreground">{{ item.owner }}</div>

          <!-- Size -->
          <div class="w-20 text-right text-sm text-muted-foreground">{{ item.size }}</div>

          <!-- Updated -->
          <div class="w-28 text-right text-sm text-muted-foreground">{{ item.updatedAt }}</div>

          <!-- Actions -->
          <div class="flex w-20 items-center justify-end gap-1">
            <button
              class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="View"
            >
              <Icon name="eye" size="sm" />
            </button>
            <button
              class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              title="Delete"
              @click="deleteContent(item.id)"
            >
              <Icon name="trash" size="sm" />
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredContent.length === 0" class="py-12 text-center">
          <Icon name="folder" size="xl" class="mx-auto text-muted-foreground/50" />
          <p class="mt-4 text-sm text-muted-foreground">No content found</p>
        </div>
      </div>
    </div>
  </div>
</template>
