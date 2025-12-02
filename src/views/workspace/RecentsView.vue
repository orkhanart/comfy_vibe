<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  WorkspaceViewHeader,
  WorkspaceSearchInput,
  WorkspaceViewToggle,
  WorkspaceSortSelect,
  WorkspaceFilterSelect,
  WorkspaceCard,
} from '@/components/workspace'

const route = useRoute()
const router = useRouter()
const workspaceId = computed(() => route.params.workspaceId as string)

function openItem(item: { id: string; type: string }) {
  if (item.type === 'workflow' || item.type === 'template') {
    router.push(`/nodemode/${workspaceId.value}/${item.id}`)
  }
}

type ViewMode = 'grid' | 'list'

interface RecentItem {
  id: string
  name: string
  type: 'workflow' | 'asset' | 'model' | 'template'
  icon: string
  updatedAt: string
  thumbnail: string
}

const searchQuery = ref('')
const viewMode = ref<ViewMode>('grid')
const sortBy = ref('recent')
const filterBy = ref('all')

const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'name', label: 'Name' },
  { value: 'type', label: 'Type' },
]

const filterOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'workflow', label: 'Workflow' },
  { value: 'asset', label: 'Asset' },
  { value: 'model', label: 'Model' },
  { value: 'template', label: 'Template' },
]

const recentItems = ref<RecentItem[]>([
  { id: '1', name: 'Portrait Generation', type: 'workflow', icon: 'sitemap', updatedAt: '2 minutes ago', thumbnail: '/thumbnails/workflow-1.jpg' },
  { id: '2', name: 'SDXL Workflow', type: 'workflow', icon: 'sitemap', updatedAt: '15 minutes ago', thumbnail: '/thumbnails/workflow-2.jpg' },
  { id: '3', name: 'SDXL Base 1.0', type: 'model', icon: 'box', updatedAt: '1 hour ago', thumbnail: '/thumbnails/model-1.jpg' },
  { id: '4', name: 'reference_image.png', type: 'asset', icon: 'image', updatedAt: '2 hours ago', thumbnail: '/thumbnails/asset-1.jpg' },
  { id: '5', name: 'Text to Image Basic', type: 'template', icon: 'th-large', updatedAt: '3 hours ago', thumbnail: '/thumbnails/template-1.jpg' },
  { id: '6', name: 'ControlNet Pipeline', type: 'workflow', icon: 'sitemap', updatedAt: '5 hours ago', thumbnail: '/thumbnails/workflow-3.jpg' },
  { id: '7', name: 'Detail Tweaker LoRA', type: 'model', icon: 'box', updatedAt: 'Yesterday', thumbnail: '/thumbnails/model-2.jpg' },
  { id: '8', name: 'logo_v2.png', type: 'asset', icon: 'image', updatedAt: 'Yesterday', thumbnail: '/thumbnails/asset-2.jpg' },
])

const filteredItems = computed(() => {
  let items = [...recentItems.value]

  // Filter by type
  if (filterBy.value !== 'all') {
    items = items.filter(item => item.type === filterBy.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item => item.name.toLowerCase().includes(query))
  }

  // Sort items
  if (sortBy.value === 'name') {
    items.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'type') {
    items.sort((a, b) => a.type.localeCompare(b.type))
  }

  return items
})

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    workflow: 'Workflow',
    asset: 'Asset',
    model: 'Model',
    template: 'Template'
  }
  return labels[type] || type
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    workflow: 'bg-purple-500/20 text-purple-400',
    asset: 'bg-green-500/20 text-green-400',
    model: 'bg-blue-500/20 text-blue-400',
    template: 'bg-amber-500/20 text-amber-400'
  }
  return colors[type] || 'bg-muted-foreground/20 text-muted-foreground'
}

</script>

<template>
  <div class="p-6">
    <WorkspaceViewHeader
      title="Recents"
      subtitle="Recently accessed items"
    />

    <!-- Search & Actions Toolbar -->
    <div class="mb-4 flex items-center gap-3">
      <WorkspaceSearchInput
        v-model="searchQuery"
        placeholder="Search recents..."
      />
      <WorkspaceViewToggle v-model="viewMode" />
      <WorkspaceSortSelect v-model="sortBy" :options="sortOptions" />
      <WorkspaceFilterSelect v-model="filterBy" :options="filterOptions" />
    </div>

    <!-- Grid View -->
    <div
      v-if="viewMode === 'grid'"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      <WorkspaceCard
        v-for="item in filteredItems"
        :key="item.id"
        :thumbnail="item.thumbnail"
        :title="item.name"
        :icon="item.icon"
        :badge="getTypeLabel(item.type)"
        :badge-class="getTypeColor(item.type)"
        :updated-at="item.updatedAt"
        @open="openItem(item)"
      />
    </div>

    <!-- List View -->
    <div v-else class="rounded-lg border border-zinc-200 bg-white dark:border-border dark:bg-card">
      <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100 dark:bg-muted">
            <Icon :name="item.icon" size="md" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-zinc-900 dark:text-foreground">{{ item.name }}</p>
            <p class="text-sm text-muted-foreground dark:text-muted-foreground">
              <span :class="['rounded px-1.5 py-0.5 text-[10px] font-medium', getTypeColor(item.type)]">
                {{ getTypeLabel(item.type) }}
              </span>
            </p>
          </div>
          <span class="text-sm text-muted-foreground dark:text-muted-foreground">{{ item.updatedAt }}</span>
          <button
            class="rounded p-1 text-muted-foreground hover:bg-zinc-100 hover:text-muted-foreground/50 dark:hover:bg-accent dark:hover:text-foreground"
            @click.stop
          >
            <Icon name="ellipsis-h" size="sm" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredItems.length === 0" class="py-12 text-center">
      <Icon name="search" size="md" class="mb-4 text-4xl text-foreground dark:text-muted-foreground/50" />
      <p class="text-muted-foreground dark:text-muted-foreground">No items found</p>
    </div>
  </div>
</template>
