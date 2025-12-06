<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'

interface Asset {
  id: string
  name: string
  type: 'image' | 'video' | 'model'
  thumbnail: string
  createdAt: Date
}

const searchQuery = ref('')

const assets = ref<Asset[]>([
  { id: 'asset-1', name: 'Portrait reference', type: 'image', thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop', createdAt: new Date(Date.now() - 86400000) },
  { id: 'asset-2', name: 'Landscape bg', type: 'image', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop', createdAt: new Date(Date.now() - 172800000) },
  { id: 'asset-3', name: 'City night', type: 'image', thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop', createdAt: new Date(Date.now() - 259200000) },
  { id: 'asset-4', name: 'Nature scene', type: 'image', thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&h=200&fit=crop', createdAt: new Date(Date.now() - 345600000) },
  { id: 'asset-5', name: 'Abstract art', type: 'image', thumbnail: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=200&h=200&fit=crop', createdAt: new Date(Date.now() - 432000000) },
  { id: 'asset-6', name: 'Texture pack', type: 'image', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&h=200&fit=crop', createdAt: new Date(Date.now() - 518400000) },
])

const filteredAssets = computed(() => {
  if (!searchQuery.value) return assets.value
  const q = searchQuery.value.toLowerCase()
  return assets.value.filter(a => a.name.toLowerCase().includes(q))
})

function handleAssetClick(asset: Asset): void {
  console.log('Selected asset:', asset)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Search -->
    <div class="p-3">
      <div class="relative">
        <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search assets..."
          class="h-9 w-full rounded-lg border border-border bg-muted/30 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </div>
    </div>

    <!-- Grid -->
    <div class="flex-1 overflow-y-auto px-3 pb-3">
      <div class="grid grid-cols-3 gap-1.5">
        <button
          v-for="asset in filteredAssets"
          :key="asset.id"
          class="group relative aspect-square overflow-hidden rounded-lg bg-muted"
          @click="handleAssetClick(asset)"
        >
          <img :src="asset.thumbnail" :alt="asset.name" class="h-full w-full object-cover" />
          <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <p class="truncate text-[10px] text-white">{{ asset.name }}</p>
          </div>
        </button>
      </div>

      <!-- Empty -->
      <div v-if="filteredAssets.length === 0" class="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Icon name="images" size="xl" class="mb-3 opacity-50" />
        <p class="text-sm">No assets found</p>
      </div>
    </div>
  </div>
</template>
