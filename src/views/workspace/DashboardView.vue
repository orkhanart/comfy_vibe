<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TemplateCard, WorkspaceCard, PageBreadcrumb } from '@/components/workspace'
import { useUiStore } from '@/stores/uiStore'
import type { Template } from '@/data/workspaceMockData'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()

type ActiveTab = 'recent' | 'shared-files' | 'shared-projects' | 'favorites'
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

interface SharedProject {
  id: string
  name: string
  owner: string
  memberCount: number
  itemCount: number
  thumbnail: string
}

interface FavoriteItem {
  id: string
  name: string
  type: 'workflow' | 'template' | 'model'
  thumbnail: string
}

const starterTemplates: Template[] = [
  { id: 'txt2img', name: 'Text to Image', description: 'Generate images from text prompts', thumbnail: '/assets/card_images/workflow_01.webp', category: 'image', tags: ['txt2img', 'basic'], uses: 5200, usesFormatted: '5.2k' },
  { id: 'img2img', name: 'Image to Image', description: 'Transform existing images', thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp', category: 'image', tags: ['img2img'], uses: 3800, usesFormatted: '3.8k' },
  { id: 'upscale', name: 'Upscale', description: '4x image upscaling workflow', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', category: 'image', tags: ['upscale'], uses: 2100, usesFormatted: '2.1k' },
  { id: 'inpaint', name: 'Inpainting', description: 'Edit parts of an image', thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', category: 'image', tags: ['inpaint'], uses: 1900, usesFormatted: '1.9k' },
  { id: 'controlnet', name: 'ControlNet', description: 'Guided image generation', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', category: 'controlnet', tags: ['controlnet'], uses: 4200, usesFormatted: '4.2k' },
  { id: 'video', name: 'Video Generation', description: 'Create videos from prompts', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', category: 'video', tags: ['video'], uses: 1500, usesFormatted: '1.5k' },
  { id: 'flux', name: 'Flux', description: 'High quality Flux generation', thumbnail: '/assets/card_images/workflow_01.webp', category: 'image', tags: ['flux', 'advanced'], uses: 6100, usesFormatted: '6.1k' }
]

const recentItems = ref<RecentItem[]>([])

const sharedFiles = ref<SharedFile[]>([
  { id: 'sf1', name: 'Team Logo Workflow', type: 'workflow', icon: 'sitemap', sharedBy: 'Alice', sharedAt: '1 day ago', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp' },
  { id: 'sf2', name: 'Brand Assets Pack', type: 'asset', icon: 'image', sharedBy: 'Bob', sharedAt: '2 days ago', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp' },
  { id: 'sf3', name: 'Custom LoRA Model', type: 'model', icon: 'box', sharedBy: 'Carol', sharedAt: '3 days ago', thumbnail: '/assets/card_images/workflow_01.webp' },
])

const sharedProjects = ref<SharedProject[]>([
  { id: 'sp1', name: 'Marketing Campaign Q4', owner: 'Alice', memberCount: 5, itemCount: 24, thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp' },
  { id: 'sp2', name: 'Product Launch 2024', owner: 'Design Team', memberCount: 8, itemCount: 42, thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp' },
  { id: 'sp3', name: 'Social Media Assets', owner: 'Bob', memberCount: 3, itemCount: 18, thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp' },
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

function removeFavorite(id: string) {
  favorites.value = favorites.value.filter(f => f.id !== id)
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

function openSharedProject(project: SharedProject) {
  router.push(`/workspace/projects/${project.id}`)
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
  <div class="flex h-full flex-col p-4">
    <PageBreadcrumb label="Home" icon="home" />

    <!-- Start from a template -->
    <div v-if="uiStore.showQuickstart" class="mb-8">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-sm font-medium text-zinc-900 dark:text-foreground">Start from a template</h2>
        <button
          class="text-sm text-muted-foreground transition-colors hover:text-zinc-900 dark:hover:text-foreground"
          @click="router.push('/workspace/templates')"
        >
          View all
        </button>
      </div>
      <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
        <TemplateCard
          v-for="template in starterTemplates"
          :key="template.id"
          :template="template"
          @open="router.push('/node')"
        />
      </div>
    </div>

    <!-- Tabs Section -->
    <div class="flex flex-1 flex-col">
      <!-- Tab Headers and Action Bar -->
      <div class="mb-4 flex items-center justify-between gap-4">
        <!-- Tabs -->
        <div class="flex gap-1.5">
          <button
            :class="[
              'rounded-md px-3 py-1 text-xs font-medium transition-all',
              activeTab === 'recent'
                ? 'bg-zinc-900 text-white dark:bg-foreground dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-muted dark:text-muted-foreground dark:hover:bg-zinc-700'
            ]"
            @click="activeTab = 'recent'"
          >
            Recently viewed
          </button>
          <button
            :class="[
              'rounded-md px-3 py-1 text-xs font-medium transition-all',
              activeTab === 'shared-files'
                ? 'bg-zinc-900 text-white dark:bg-foreground dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-muted dark:text-muted-foreground dark:hover:bg-zinc-700'
            ]"
            @click="activeTab = 'shared-files'"
          >
            Shared files
          </button>
          <button
            :class="[
              'rounded-md px-3 py-1 text-xs font-medium transition-all',
              activeTab === 'shared-projects'
                ? 'bg-zinc-900 text-white dark:bg-foreground dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-muted dark:text-muted-foreground dark:hover:bg-zinc-700'
            ]"
            @click="activeTab = 'shared-projects'"
          >
            Shared Projects
          </button>
          <button
            :class="[
              'rounded-md px-3 py-1 text-xs font-medium transition-all',
              activeTab === 'favorites'
                ? 'bg-zinc-900 text-white dark:bg-foreground dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-muted dark:text-muted-foreground dark:hover:bg-zinc-700'
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
          <div class="flex rounded-md border border-zinc-200 dark:border-border">
            <button
              :class="['px-2 py-1.5 text-sm transition-colors', viewMode === 'grid' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground' : 'text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground']"
              @click="viewMode = 'grid'"
            >
              <Icon name="th-large" size="sm" />
            </button>
            <button
              :class="['px-2 py-1.5 text-sm transition-colors', viewMode === 'list' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground' : 'text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground']"
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
          class="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 text-center dark:border-zinc-700"
        >
          <Icon name="clock" size="xl" class="mb-2 text-zinc-300 dark:text-zinc-600" />
          <p class="text-sm text-muted-foreground">No recent files</p>
          <p class="text-xs text-muted-foreground">Files you open will appear here</p>
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

      <!-- Tab Content: Shared Projects -->
      <div v-if="activeTab === 'shared-projects'" class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
        <div
          v-for="project in sharedProjects"
          :key="project.id"
          class="group cursor-pointer overflow-hidden rounded-lg border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-md dark:border-border dark:bg-card dark:hover:border-zinc-600"
          @click="openSharedProject(project)"
        >
          <!-- Thumbnail -->
          <div class="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-muted">
            <img
              :src="project.thumbnail"
              :alt="project.name"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div class="absolute bottom-2 left-2 right-2">
              <p class="truncate text-sm font-medium text-white">{{ project.name }}</p>
            </div>
          </div>
          <!-- Info -->
          <div class="p-3">
            <div class="flex items-center justify-between text-xs text-muted-foreground">
              <span>{{ project.owner }}</span>
              <div class="flex items-center gap-3">
                <span class="flex items-center gap-1">
                  <Icon name="users" size="xs" />
                  {{ project.memberCount }}
                </span>
                <span class="flex items-center gap-1">
                  <Icon name="file" size="xs" />
                  {{ project.itemCount }}
                </span>
              </div>
            </div>
          </div>
        </div>
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
          class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700"
        >
          <Icon name="star" size="xl" class="mb-2 text-zinc-300 dark:text-zinc-600" />
          <p class="text-sm text-muted-foreground">No favorites yet</p>
          <p class="text-xs text-muted-foreground">Star items to add them here</p>
        </div>
      </div>
    </div>
  </div>
</template>
