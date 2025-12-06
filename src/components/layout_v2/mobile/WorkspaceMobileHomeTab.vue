<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/uiStore'

const router = useRouter()
const uiStore = useUiStore()

type ContentTab = 'recent' | 'shared' | 'favorites'
const activeContentTab = ref<ContentTab>('recent')

interface QuickAction {
  id: string
  label: string
  icon: string
  action: () => void
}

const quickActions: QuickAction[] = [
  {
    id: 'new-workflow',
    label: 'New Workflow',
    icon: 'plus',
    action: () => {
      uiStore.createWorkflowTab('workflow')
      router.push('/workflow-editor')
    }
  },
  {
    id: 'import',
    label: 'Import',
    icon: 'upload',
    action: () => {}
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: 'th-large',
    action: () => router.push('/workspace_v2/templates')
  },
]

interface Template {
  id: string
  name: string
  thumbnail: string
  category: string
  uses: number
}

const popularTemplates: Template[] = [
  { id: 'txt2img', name: 'Text to Image', thumbnail: '/assets/card_images/workflow_01.webp', category: 'image', uses: 5200 },
  { id: 'img2img', name: 'Image to Image', thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp', category: 'image', uses: 3800 },
  { id: 'upscale', name: 'Upscale', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', category: 'image', uses: 2100 },
  { id: 'inpaint', name: 'Inpainting', thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', category: 'image', uses: 1900 },
]

interface RecentItem {
  id: string
  name: string
  type: 'workflow' | 'asset' | 'model'
  thumbnail: string
  updatedAt: string
}

const recentItems = ref<RecentItem[]>([])

interface SharedItem {
  id: string
  name: string
  type: 'workflow' | 'asset' | 'model'
  thumbnail: string
  sharedBy: string
}

const sharedItems = ref<SharedItem[]>([
  { id: 'sf1', name: 'Team Logo Workflow', type: 'workflow', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', sharedBy: 'Alice' },
  { id: 'sf2', name: 'Brand Assets Pack', type: 'asset', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', sharedBy: 'Bob' },
])

interface FavoriteItem {
  id: string
  name: string
  type: 'workflow' | 'template' | 'model'
  thumbnail: string
}

const favorites = ref<FavoriteItem[]>([
  { id: 'fav-1', name: 'My Best Workflow', type: 'workflow', thumbnail: '/assets/card_images/workflow_01.webp' },
  { id: 'fav-2', name: 'Portrait Template', type: 'template', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp' },
])

function formatUses(uses: number): string {
  if (uses >= 1000) {
    return `${(uses / 1000).toFixed(1)}k`
  }
  return uses.toString()
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    workflow: 'bg-purple-500/80',
    asset: 'bg-green-500/80',
    model: 'bg-blue-500/80',
    template: 'bg-amber-500/80'
  }
  return colors[type] || 'bg-zinc-500/80'
}
</script>

<template>
  <div class="flex h-full flex-col overflow-y-auto">
    <!-- Quick Actions -->
    <div class="border-b border-border p-4">
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="action in quickActions"
          :key="action.id"
          class="flex flex-col items-center gap-2 rounded-xl bg-accent/50 p-4 transition-colors active:bg-accent"
          @click="action.action"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-background">
            <Icon :name="action.icon" size="md" class="text-foreground" />
          </div>
          <span class="text-xs font-medium text-foreground">{{ action.label }}</span>
        </button>
      </div>
    </div>

    <!-- Popular Templates -->
    <div class="border-b border-border p-4">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-sm font-medium text-foreground">Popular templates</h2>
        <button class="text-xs text-primary" @click="router.push('/workspace_v2/templates')">
          View all
        </button>
      </div>
      <div class="flex gap-3 overflow-x-auto pb-2">
        <div
          v-for="template in popularTemplates"
          :key="template.id"
          class="shrink-0 cursor-pointer"
          @click="router.push('/workflow-editor')"
        >
          <div class="relative h-24 w-24 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <img
              :src="template.thumbnail"
              :alt="template.name"
              class="h-full w-full object-cover"
            />
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <span class="text-[10px] text-white">{{ formatUses(template.uses) }} uses</span>
            </div>
          </div>
          <p class="mt-1.5 w-24 truncate text-xs font-medium text-foreground">{{ template.name }}</p>
        </div>
      </div>
    </div>

    <!-- Content Tabs -->
    <div class="flex-1 p-4">
      <!-- Tab Headers -->
      <div class="mb-4 flex gap-2">
        <button
          :class="[
            'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
            activeContentTab === 'recent'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-muted-foreground'
          ]"
          @click="activeContentTab = 'recent'"
        >
          Recent
        </button>
        <button
          :class="[
            'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
            activeContentTab === 'shared'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-muted-foreground'
          ]"
          @click="activeContentTab = 'shared'"
        >
          Shared
        </button>
        <button
          :class="[
            'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
            activeContentTab === 'favorites'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-muted-foreground'
          ]"
          @click="activeContentTab = 'favorites'"
        >
          Favorites
        </button>
      </div>

      <!-- Recent Content -->
      <div v-if="activeContentTab === 'recent'">
        <div v-if="recentItems.length > 0" class="grid grid-cols-2 gap-3">
          <div
            v-for="item in recentItems"
            :key="item.id"
            class="overflow-hidden rounded-xl border border-border bg-card"
          >
            <div class="relative aspect-video">
              <img :src="item.thumbnail" :alt="item.name" class="h-full w-full object-cover" />
              <span :class="['absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-medium text-white', getTypeColor(item.type)]">
                {{ item.type }}
              </span>
            </div>
            <div class="p-2">
              <p class="truncate text-sm font-medium text-foreground">{{ item.name }}</p>
              <p class="text-xs text-muted-foreground">{{ item.updatedAt }}</p>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-12 text-center">
          <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <Icon name="clock" size="lg" class="text-muted-foreground" />
          </div>
          <p class="text-sm font-medium text-foreground">No recent files</p>
          <p class="mt-1 text-xs text-muted-foreground">Files you open will appear here</p>
        </div>
      </div>

      <!-- Shared Content -->
      <div v-if="activeContentTab === 'shared'">
        <div v-if="sharedItems.length > 0" class="grid grid-cols-2 gap-3">
          <div
            v-for="item in sharedItems"
            :key="item.id"
            class="overflow-hidden rounded-xl border border-border bg-card"
          >
            <div class="relative aspect-video">
              <img :src="item.thumbnail" :alt="item.name" class="h-full w-full object-cover" />
              <span :class="['absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-medium text-white', getTypeColor(item.type)]">
                {{ item.type }}
              </span>
            </div>
            <div class="p-2">
              <p class="truncate text-sm font-medium text-foreground">{{ item.name }}</p>
              <p class="text-xs text-muted-foreground">Shared by {{ item.sharedBy }}</p>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-12 text-center">
          <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <Icon name="share" size="lg" class="text-muted-foreground" />
          </div>
          <p class="text-sm font-medium text-foreground">Nothing shared</p>
          <p class="mt-1 text-xs text-muted-foreground">Files shared with you will appear here</p>
        </div>
      </div>

      <!-- Favorites Content -->
      <div v-if="activeContentTab === 'favorites'">
        <div v-if="favorites.length > 0" class="grid grid-cols-2 gap-3">
          <div
            v-for="item in favorites"
            :key="item.id"
            class="overflow-hidden rounded-xl border border-border bg-card"
          >
            <div class="relative aspect-video">
              <img :src="item.thumbnail" :alt="item.name" class="h-full w-full object-cover" />
              <span :class="['absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-medium text-white', getTypeColor(item.type)]">
                {{ item.type }}
              </span>
            </div>
            <div class="p-2">
              <p class="truncate text-sm font-medium text-foreground">{{ item.name }}</p>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-12 text-center">
          <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <Icon name="star" size="lg" class="text-muted-foreground" />
          </div>
          <p class="text-sm font-medium text-foreground">No favorites</p>
          <p class="mt-1 text-xs text-muted-foreground">Star items to add them here</p>
        </div>
      </div>
    </div>
  </div>
</template>
