<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, Grid3x3, List, Star } from 'lucide-vue-next'
import { Icon } from '@/components/ui/icon'
import ExtendedViewModal from './ExtendedViewModal.vue'
import { ASSETS_DATA, TEAM_MEMBERS_DATA } from '@/data/sidebarMockData'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

// View state
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const activeTab = ref<'all' | 'private' | 'shared'>('all')
const sourceFilter = ref<'all' | 'generated' | 'imported'>('all')
const sortBy = ref('date')
const showFavoritesOnly = ref(false)

const sortOptions = [
  { value: 'date', label: 'Date' },
  { value: 'name', label: 'Name' },
  { value: 'type', label: 'Type' },
]

// Reset state when modal opens
watch(() => props.visible, (visible) => {
  if (visible) {
    searchQuery.value = ''
    sortBy.value = 'date'
    showFavoritesOnly.value = false
  }
}, { immediate: true })

// Create assets with favorites
const sharedAssets = ref(ASSETS_DATA.map((asset, i) => ({
  ...asset,
  id: `shared-asset-${i}`,
  sharedBy: TEAM_MEMBERS_DATA[i % TEAM_MEMBERS_DATA.length],
  favorite: false,
})))

const privateAssets = ref(ASSETS_DATA.map((asset, i) => ({
  ...asset,
  id: `private-asset-${i}`,
  favorite: false,
})))

// Combine all assets for "All" tab
const allAssets = computed(() => {
  const privateWithType = privateAssets.value.map(a => ({ ...a, assetType: 'private' as const }))
  const sharedWithType = sharedAssets.value.map(a => ({ ...a, assetType: 'shared' as const }))
  return [...privateWithType, ...sharedWithType]
})

const currentAssets = computed(() => {
  switch (activeTab.value) {
    case 'private':
      return privateAssets.value.map(a => ({ ...a, assetType: 'private' as const }))
    case 'shared':
      return sharedAssets.value.map(a => ({ ...a, assetType: 'shared' as const }))
    default:
      return allAssets.value
  }
})

const filteredAssets = computed(() => {
  let items = currentAssets.value

  // Filter by source
  if (sourceFilter.value !== 'all') {
    items = items.filter(asset => asset.source === sourceFilter.value)
  }

  // Filter by favorites
  if (showFavoritesOnly.value) {
    items = items.filter(item => item.favorite)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      item.name.toLowerCase().includes(query)
    )
  }

  // Sort
  return [...items].sort((a, b) => {
    switch (sortBy.value) {
      case 'name': return a.name.localeCompare(b.name)
      case 'type': return a.type.localeCompare(b.type)
      default: return 0 // date - keep original order
    }
  })
})

function getAssetIcon(type: string): string {
  switch (type) {
    case 'image': return 'image'
    case 'video': return 'video'
    case 'audio': return 'volume-up'
    default: return 'file'
  }
}

function toggleFavorite(assetId: string): void {
  const privateAsset = privateAssets.value.find(a => a.id === assetId)
  if (privateAsset) {
    privateAsset.favorite = !privateAsset.favorite
    return
  }
  const sharedAsset = sharedAssets.value.find(a => a.id === assetId)
  if (sharedAsset) {
    sharedAsset.favorite = !sharedAsset.favorite
  }
}
</script>

<template>
  <ExtendedViewModal
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
  >
    <!-- Header Tabs -->
    <template #header-left>
      <div class="flex items-center gap-1">
        <button
          :class="[
            'rounded px-3 py-1.5 text-sm font-medium transition-colors',
            activeTab === 'all'
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          ]"
          @click="activeTab = 'all'"
        >
          All
        </button>
        <button
          :class="[
            'rounded px-3 py-1.5 text-sm font-medium transition-colors',
            activeTab === 'private'
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          ]"
          @click="activeTab = 'private'"
        >
          Private
        </button>
        <button
          :class="[
            'rounded px-3 py-1.5 text-sm font-medium transition-colors',
            activeTab === 'shared'
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          ]"
          @click="activeTab = 'shared'"
        >
          Shared
        </button>
      </div>
    </template>

    <!-- Sidebar - Source Filters -->
    <template #sidebar>
      <div class="flex h-full flex-col">
        <div class="flex-1 p-2">
          <button
            :class="[
              'flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm transition-colors',
              sourceFilter === 'all'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
            @click="sourceFilter = 'all'"
          >
            <Icon name="layers" size="sm" />
            <span class="truncate">All Sources</span>
          </button>
          <button
            :class="[
              'flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm transition-colors',
              sourceFilter === 'generated'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
            @click="sourceFilter = 'generated'"
          >
            <Icon name="sparkles" size="sm" />
            <span class="truncate">Generated</span>
          </button>
          <button
            :class="[
              'flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm transition-colors',
              sourceFilter === 'imported'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
            @click="sourceFilter = 'imported'"
          >
            <Icon name="download" size="sm" />
            <span class="truncate">Imported</span>
          </button>
        </div>
      </div>
    </template>

    <!-- Content -->
    <div class="flex h-full flex-col">
      <!-- Toolbar -->
      <div class="flex items-center gap-2 border-b border-border px-4 py-3">
        <!-- Search -->
        <div class="relative flex-1">
          <Search class="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search assets..."
            class="h-8 w-full rounded border border-border bg-background pl-8 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        <!-- Sort -->
        <div class="relative">
          <select
            v-model="sortBy"
            class="h-8 appearance-none rounded border border-border bg-background py-1.5 pl-3 pr-8 text-sm outline-none transition-colors focus:border-ring"
          >
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>

        <!-- Favorites Toggle -->
        <button
          :class="[
            'flex h-8 w-8 items-center justify-center rounded border transition-colors',
            showFavoritesOnly
              ? 'border-amber-500 bg-amber-500/10 text-amber-500'
              : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
          ]"
          @click="showFavoritesOnly = !showFavoritesOnly"
        >
          <Star :class="['size-4', showFavoritesOnly && 'fill-current']" />
        </button>

        <!-- View Toggle -->
        <div class="flex items-center rounded border border-border">
          <button
            :class="['px-2 py-1.5 transition-colors', viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground']"
            @click="viewMode = 'grid'"
          >
            <Grid3x3 class="size-4" />
          </button>
          <button
            :class="['px-2 py-1.5 transition-colors', viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground']"
            @click="viewMode = 'list'"
          >
            <List class="size-4" />
          </button>
        </div>
      </div>

      <!-- Content Header -->
      <div class="px-4 py-3">
        <h2 class="text-sm font-medium text-foreground">
          {{ activeTab === 'all' ? 'All Assets' : activeTab === 'private' ? 'Private Assets' : 'Shared Assets' }}
        </h2>
        <p class="text-xs text-muted-foreground">
          {{ filteredAssets.length }} {{ filteredAssets.length === 1 ? 'asset' : 'assets' }}
        </p>
      </div>

      <!-- Items Grid -->
      <div class="flex-1 overflow-y-auto px-4 pb-4">
        <div
          v-if="viewMode === 'grid' && filteredAssets.length > 0"
          class="grid gap-3"
          style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));"
        >
          <div
            v-for="asset in filteredAssets"
            :key="asset.id"
            class="group cursor-pointer overflow-hidden rounded border border-border bg-card transition-colors hover:border-foreground/20"
          >
            <div class="relative aspect-video w-full bg-muted">
              <img v-if="asset.thumbnail" :src="asset.thumbnail" :alt="asset.name" class="h-full w-full object-cover" />
              <div v-else class="flex h-full w-full items-center justify-center">
                <Icon :name="getAssetIcon(asset.type)" size="lg" class="text-muted-foreground/40" />
              </div>
              <!-- Favorite Button -->
              <button
                class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 transition-all hover:text-amber-500 group-hover:opacity-100"
                :class="asset.favorite && 'opacity-100 text-amber-500'"
                @click.stop="toggleFavorite(asset.id)"
              >
                <Star :class="['size-3.5', asset.favorite && 'fill-current']" />
              </button>
              <!-- Source Badge -->
              <div
                class="absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-medium"
                :class="[
                  asset.source === 'generated'
                    ? 'bg-purple-500/80 text-white'
                    : 'bg-blue-500/80 text-white'
                ]"
              >
                {{ asset.source === 'generated' ? 'Generated' : 'Imported' }}
              </div>
            </div>
            <div class="p-2">
              <p class="truncate text-sm text-foreground">{{ asset.name }}</p>
              <p class="text-xs text-muted-foreground">
                <template v-if="asset.assetType === 'shared' && asset.sharedBy">
                  {{ asset.sharedBy.name }} ·
                </template>
                {{ asset.createdAt }}
              </p>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else-if="viewMode === 'list' && filteredAssets.length > 0" class="rounded border border-border">
          <div
            v-for="(asset, index) in filteredAssets"
            :key="asset.id"
            :class="['flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-muted', index !== filteredAssets.length - 1 && 'border-b border-border']"
          >
            <!-- Favorite -->
            <button
              class="text-muted-foreground transition-colors hover:text-amber-500"
              :class="asset.favorite && 'text-amber-500'"
              @click.stop="toggleFavorite(asset.id)"
            >
              <Star :class="['size-4', asset.favorite && 'fill-current']" />
            </button>
            <div v-if="asset.thumbnail" class="h-8 w-12 shrink-0 overflow-hidden rounded bg-muted">
              <img :src="asset.thumbnail" :alt="asset.name" class="h-full w-full object-cover" />
            </div>
            <div v-else class="flex h-8 w-12 shrink-0 items-center justify-center rounded bg-muted">
              <Icon :name="getAssetIcon(asset.type)" size="sm" class="text-muted-foreground" />
            </div>
            <span class="flex-1 truncate text-sm text-foreground">{{ asset.name }}</span>
            <span
              class="rounded px-1.5 py-0.5 text-[10px] font-medium"
              :class="[
                asset.source === 'generated'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-blue-500/20 text-blue-400'
              ]"
            >
              {{ asset.source === 'generated' ? 'Gen' : 'Imp' }}
            </span>
            <span class="text-xs text-muted-foreground">{{ asset.createdAt }}</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredAssets.length === 0" class="flex flex-col items-center justify-center py-12">
          <Icon name="image" size="2xl" class="mb-2 text-muted-foreground/30" />
          <p class="text-sm text-muted-foreground">No assets found</p>
        </div>
      </div>
    </div>
  </ExtendedViewModal>
</template>
