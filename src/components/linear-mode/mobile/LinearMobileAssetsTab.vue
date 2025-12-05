<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'

interface Asset {
  id: string
  name: string
  type: 'image' | 'video' | 'model'
  thumbnail: string
  createdAt: Date
}

const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')

// Mock assets data
const assets = ref<Asset[]>([
  {
    id: 'asset-1',
    name: 'Portrait reference',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'asset-2',
    name: 'Landscape bg',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: 'asset-3',
    name: 'City night',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop',
    createdAt: new Date(Date.now() - 259200000),
  },
  {
    id: 'asset-4',
    name: 'Nature scene',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&h=200&fit=crop',
    createdAt: new Date(Date.now() - 345600000),
  },
  {
    id: 'asset-5',
    name: 'Abstract art',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=200&h=200&fit=crop',
    createdAt: new Date(Date.now() - 432000000),
  },
  {
    id: 'asset-6',
    name: 'Texture pack',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&h=200&fit=crop',
    createdAt: new Date(Date.now() - 518400000),
  },
])

function handleAssetClick(asset: Asset): void {
  console.log('Selected asset:', asset)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Search Bar -->
    <div class="flex items-center gap-2 border-b border-border bg-background p-3">
      <div class="relative flex-1">
        <Icon name="search" size="sm" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search assets..."
          class="h-9 w-full rounded-md border border-border bg-transparent pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </div>
      <button
        class="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-accent"
        @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'"
      >
        <Icon :name="viewMode === 'grid' ? 'list' : 'th-large'" size="sm" />
      </button>
    </div>

    <!-- Assets Grid -->
    <div class="flex-1 overflow-y-auto p-3">
      <div
        :class="[
          'gap-2',
          viewMode === 'grid' ? 'grid grid-cols-3' : 'flex flex-col'
        ]"
      >
        <button
          v-for="asset in assets"
          :key="asset.id"
          :class="[
            'overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary',
            viewMode === 'list' && 'flex items-center gap-3 p-2'
          ]"
          @click="handleAssetClick(asset)"
        >
          <div
            :class="[
              'overflow-hidden bg-muted',
              viewMode === 'grid' ? 'aspect-square' : 'h-12 w-12 shrink-0 rounded'
            ]"
          >
            <img
              :src="asset.thumbnail"
              :alt="asset.name"
              class="h-full w-full object-cover"
            />
          </div>
          <div v-if="viewMode === 'list'" class="min-w-0 flex-1 text-left">
            <p class="truncate text-sm font-medium text-foreground">{{ asset.name }}</p>
            <p class="text-xs text-muted-foreground">{{ asset.type }}</p>
          </div>
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-if="assets.length === 0"
        class="flex flex-col items-center justify-center py-12 text-muted-foreground"
      >
        <Icon name="images" size="lg" class="mb-2" />
        <span class="text-sm">No assets yet</span>
      </div>
    </div>
  </div>
</template>
