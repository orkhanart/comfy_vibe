<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { WorkspaceCard } from '@/components/workspace'
import { useUiStore } from '@/stores/uiStore'
import type { Template } from '@/data/workspaceMockData'

const router = useRouter()
const uiStore = useUiStore()

// Quickstart collapsed state
const quickstartCollapsed = ref(false)

type ActiveTab = 'recent' | 'shared-files' | 'favorites'
const activeTab = ref<ActiveTab>('recent')

// View state
const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('updated')
const searchQuery = ref('')

const sortOptions = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'type', label: 'Type' }
]

interface RecentItem {
  id: string
  name: string
  type: 'workflow' | 'asset' | 'model' | 'template'
  icon: string
  updatedAt: string
  thumbnail: string
}

interface SharedFile {
  id: string
  name: string
  type: 'workflow' | 'asset' | 'model'
  icon: string
  sharedBy: string
  sharedAt: string
  thumbnail: string
}

interface FavoriteItem {
  id: string
  name: string
  type: 'workflow' | 'template' | 'model'
  thumbnail: string
}

const starterTemplates: Template[] = [
  { id: 'txt2img', name: 'Text to Image', description: 'Generate images from text prompts', thumbnail: '/assets/card_images/workflow_01.webp', category: 'image', tags: ['txt2img', 'basic'], uses: 5200 },
  { id: 'img2img', name: 'Image to Image', description: 'Transform existing images', thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp', category: 'image', tags: ['img2img'], uses: 3800 },
  { id: 'upscale', name: 'Upscale', description: '4x image upscaling workflow', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', category: 'image', tags: ['upscale'], uses: 2100 },
  { id: 'inpaint', name: 'Inpainting', description: 'Edit parts of an image', thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', category: 'image', tags: ['inpaint'], uses: 1900 },
  { id: 'controlnet', name: 'ControlNet', description: 'Guided image generation', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', category: 'controlnet', tags: ['controlnet'], uses: 4200 },
]

function formatUses(uses: number): string {
  if (uses >= 1000) {
    return `${(uses / 1000).toFixed(1)}k`
  }
  return uses.toString()
}

const recentItems = ref<RecentItem[]>([])

const sharedFiles = ref<SharedFile[]>([
  { id: 'sf1', name: 'Team Logo Workflow', type: 'workflow', icon: 'sitemap', sharedBy: 'Alice', sharedAt: '1 day ago', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp' },
  { id: 'sf2', name: 'Brand Assets Pack', type: 'asset', icon: 'image', sharedBy: 'Bob', sharedAt: '2 days ago', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp' },
  { id: 'sf3', name: 'Custom LoRA Model', type: 'model', icon: 'box', sharedBy: 'Carol', sharedAt: '3 days ago', thumbnail: '/assets/card_images/workflow_01.webp' },
])

const favorites = ref<FavoriteItem[]>([
  { id: 'fav-1', name: 'My Best Workflow', type: 'workflow', thumbnail: '/assets/card_images/workflow_01.webp' },
  { id: 'fav-2', name: 'Portrait Template', type: 'template', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp' },
  { id: 'fav-3', name: 'SDXL Lightning', type: 'model', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp' },
])

function openFavorite(item: FavoriteItem) {
  if (item.type === 'workflow' || item.type === 'template') {
    router.push('/node')
  }
}

function openRecentItem(item: RecentItem) {
  if (item.type === 'workflow' || item.type === 'template') {
    router.push('/node')
  }
}

function openSharedFile(item: SharedFile) {
  if (item.type === 'workflow') {
    router.push('/node')
  }
}

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
    workflow: 'bg-purple-500/80 text-white',
    asset: 'bg-green-500/80 text-white',
    model: 'bg-blue-500/80 text-white',
    template: 'bg-amber-500/80 text-white'
  }
  return colors[type] || 'bg-zinc-900/70 text-white'
}

function getIconClass(type: string): string {
  const classes: Record<string, string> = {
    workflow: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    asset: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400',
    model: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    template: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
  }
  return classes[type] || 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'
}
</script>

<template>
  <div class="flex h-full flex-col overflow-y-auto">
    <!-- Quickstart Section -->
    <div class="border-b border-zinc-200 px-4 py-4 dark:border-border">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Get started</h2>
        <button
          class="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          @click="quickstartCollapsed = !quickstartCollapsed"
        >
          <span>{{ quickstartCollapsed ? 'Show' : 'Hide' }}</span>
          <Icon :name="quickstartCollapsed ? 'chevron-down' : 'chevron-up'" size="xs" />
        </button>
      </div>

      <div v-if="!quickstartCollapsed" class="space-y-6">
        <!-- Quick Actions Grid -->
        <div class="grid grid-cols-4 gap-4">
          <!-- New Workflow Card -->
          <button
            class="group flex items-center gap-4 rounded-xl bg-white p-4 text-left transition-all hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            @click="uiStore.createWorkflowTab('node'); router.push('/node')"
          >
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition-colors group-hover:bg-zinc-200 group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:bg-zinc-700 dark:group-hover:text-zinc-200">
              <Icon name="plus" size="lg" />
            </div>
            <div class="min-w-0">
              <h3 class="text-sm font-medium text-zinc-900 dark:text-foreground">New Workflow</h3>
              <p class="mt-0.5 text-xs text-muted-foreground">Start from scratch</p>
            </div>
          </button>

          <!-- New Project Card -->
          <button
            class="group flex items-center gap-4 rounded-xl bg-white p-4 text-left transition-all hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition-colors group-hover:bg-zinc-200 group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:bg-zinc-700 dark:group-hover:text-zinc-200">
              <Icon name="folder-plus" size="lg" />
            </div>
            <div class="min-w-0">
              <h3 class="text-sm font-medium text-zinc-900 dark:text-foreground">New Project</h3>
              <p class="mt-0.5 text-xs text-muted-foreground">Organize your work</p>
            </div>
          </button>

          <!-- Import Card -->
          <button
            class="group flex items-center gap-4 rounded-xl bg-white p-4 text-left transition-all hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition-colors group-hover:bg-zinc-200 group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:bg-zinc-700 dark:group-hover:text-zinc-200">
              <Icon name="upload" size="lg" />
            </div>
            <div class="min-w-0">
              <h3 class="text-sm font-medium text-zinc-900 dark:text-foreground">Import</h3>
              <p class="mt-0.5 text-xs text-muted-foreground">Upload workflow file</p>
            </div>
          </button>

          <!-- Templates Card -->
          <button
            class="group flex items-center gap-4 rounded-xl bg-white p-4 text-left transition-all hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            @click="router.push('/workspace/templates')"
          >
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition-colors group-hover:bg-zinc-200 group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:bg-zinc-700 dark:group-hover:text-zinc-200">
              <Icon name="th-large" size="lg" />
            </div>
            <div class="min-w-0">
              <h3 class="text-sm font-medium text-zinc-900 dark:text-foreground">Templates</h3>
              <p class="mt-0.5 text-xs text-muted-foreground">Browse ready-to-use</p>
            </div>
          </button>
        </div>

        <!-- Popular Templates -->
        <div>
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Popular templates</h2>
            <button
              class="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              @click="router.push('/workspace/templates')"
            >
              View all
              <Icon name="chevron-right" size="xs" />
            </button>
          </div>
          <div class="grid grid-cols-5 gap-4">
            <div
              v-for="template in starterTemplates"
              :key="template.id"
              class="group cursor-pointer"
              @click="router.push('/node')"
            >
              <!-- Thumbnail -->
              <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-xl dark:bg-zinc-800">
                <img
                  :src="template.thumbnail"
                  :alt="template.name"
                  class="h-full w-full object-cover"
                />
                <!-- Overlay content -->
                <div class="absolute inset-0 flex flex-col justify-between p-2">
                  <!-- Top badges -->
                  <div class="flex items-start justify-between">
                    <span class="rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      {{ template.category }}
                    </span>
                  </div>
                  <!-- Bottom stats -->
                  <div class="flex items-end justify-between">
                    <span class="inline-flex items-center gap-1 rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      <Icon name="users" size="xs" />
                      {{ formatUses(template.uses) }}
                    </span>
                    <!-- Hover action -->
                    <button
                      class="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900/70 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-zinc-900/90 group-hover:opacity-100"
                      title="Use template"
                      @click.stop="router.push('/node')"
                    >
                      <Icon name="play" size="sm" />
                    </button>
                  </div>
                </div>
              </div>
              <!-- Title -->
              <div class="mt-2 px-0.5">
                <h3 class="truncate text-sm font-medium text-zinc-900 dark:text-foreground">{{ template.name }}</h3>
                <p class="truncate text-xs text-muted-foreground">{{ template.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 p-4">
      <!-- Tabs Section -->
      <div class="flex flex-col">
        <!-- Tab Headers and Action Bar -->
        <div class="mb-4 flex items-center justify-between gap-4">
          <!-- Tabs -->
          <div class="flex gap-1.5">
            <button
              :class="[
                'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                activeTab === 'recent'
                  ? 'bg-button-active-surface text-button-active-foreground'
                  : 'bg-button-surface text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
              ]"
              @click="activeTab = 'recent'"
            >
              Recent
            </button>
            <button
              :class="[
                'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                activeTab === 'shared-files'
                  ? 'bg-button-active-surface text-button-active-foreground'
                  : 'bg-button-surface text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
              ]"
              @click="activeTab = 'shared-files'"
            >
              Shared with me
            </button>
            <button
              :class="[
                'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                activeTab === 'favorites'
                  ? 'bg-button-active-surface text-button-active-foreground'
                  : 'bg-button-surface text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
              ]"
              @click="activeTab = 'favorites'"
            >
              Favorites
            </button>
          </div>

          <!-- Action Bar -->
          <div class="flex items-center gap-2">
            <!-- Search -->
            <div class="relative">
              <Icon name="search" size="sm" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search..."
                class="w-48 rounded-md border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:placeholder-zinc-500"
              />
            </div>

            <!-- Sort -->
            <div class="relative">
              <select
                v-model="sortBy"
                class="appearance-none rounded-md border border-zinc-200 bg-white py-1.5 pl-2.5 pr-7 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground"
              >
                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>

            <!-- View Toggle -->
            <div class="flex rounded-md border border-border">
              <button
                :class="['px-2 py-1.5 text-sm transition-colors', viewMode === 'grid' ? 'bg-button-active-surface text-button-active-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-button-hover-surface']"
                @click="viewMode = 'grid'"
              >
                <Icon name="th-large" size="sm" />
              </button>
              <button
                :class="['px-2 py-1.5 text-sm transition-colors', viewMode === 'list' ? 'bg-button-active-surface text-button-active-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-button-hover-surface']"
                @click="viewMode = 'list'"
              >
                <Icon name="list" size="sm" />
              </button>
            </div>
          </div>
        </div>

        <!-- Tab Content: Recently viewed -->
        <div v-if="activeTab === 'recent'" class="flex flex-1 flex-col">
          <div v-if="recentItems.length > 0" class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
            <WorkspaceCard
              v-for="item in recentItems"
              :key="item.id"
              :thumbnail="item.thumbnail"
              :title="item.name"
              :icon="item.icon"
              :icon-class="getIconClass(item.type)"
              :badge="getTypeLabel(item.type)"
              :badge-class="getTypeColor(item.type)"
              :updated-at="item.updatedAt"
              @open="openRecentItem(item)"
            />
          </div>
          <div
            v-else
            class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700"
          >
            <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Icon name="clock" size="lg" class="text-zinc-400 dark:text-zinc-500" />
            </div>
            <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">No recent files</p>
            <p class="mt-1 text-xs text-muted-foreground">Files you open will appear here</p>
            <button
              class="mt-4 rounded-md bg-button-active-surface px-4 py-2 text-sm font-medium text-button-active-foreground transition-colors hover:bg-button-hover-surface"
              @click="uiStore.createWorkflowTab('node'); router.push('/node')"
            >
              Create your first workflow
            </button>
          </div>
        </div>

        <!-- Tab Content: Shared files -->
        <div v-if="activeTab === 'shared-files'" class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
          <WorkspaceCard
            v-for="item in sharedFiles"
            :key="item.id"
            :thumbnail="item.thumbnail"
            :title="item.name"
            :icon="item.icon"
            :icon-class="getIconClass(item.type)"
            :badge="getTypeLabel(item.type)"
            :badge-class="getTypeColor(item.type)"
            :updated-at="`Shared by ${item.sharedBy}`"
            @open="openSharedFile(item)"
          />
        </div>

        <!-- Tab Content: Favorites -->
        <div v-if="activeTab === 'favorites'">
          <div v-if="favorites.length > 0" class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
            <WorkspaceCard
              v-for="item in favorites"
              :key="item.id"
              :thumbnail="item.thumbnail"
              :title="item.name"
              :icon="item.type === 'workflow' ? 'sitemap' : item.type === 'template' ? 'th-large' : 'box'"
              :icon-class="getIconClass(item.type)"
              :badge="getTypeLabel(item.type)"
              :badge-class="getTypeColor(item.type)"
              @open="openFavorite(item)"
            />
          </div>
          <div
            v-else
            class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700"
          >
            <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Icon name="star" size="lg" class="text-zinc-400 dark:text-zinc-500" />
            </div>
            <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">No favorites yet</p>
            <p class="mt-1 text-xs text-muted-foreground">Star items to add them here</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
