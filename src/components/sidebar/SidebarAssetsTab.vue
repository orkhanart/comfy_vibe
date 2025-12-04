<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { ASSETS_DATA, TEAM_MEMBERS_DATA } from '@/data/sidebarMockData'

defineProps<{
  viewMode: 'list' | 'grid'
}>()

const activeTab = ref<'all' | 'private' | 'shared'>('all')
const sourceFilter = ref<'all' | 'generated' | 'imported'>('all')
const showSourceDropdown = ref(false)

const sourceFilterLabel = computed(() => {
  switch (sourceFilter.value) {
    case 'generated': return 'Generated'
    case 'imported': return 'Imported'
    default: return 'All Sources'
  }
})

const sharedAssets = ASSETS_DATA.map((asset, i) => ({
  ...asset,
  id: `shared-asset-${i}`,
  sharedBy: TEAM_MEMBERS_DATA[i % TEAM_MEMBERS_DATA.length],
}))

const privateAssets = ASSETS_DATA.map((asset, i) => ({
  ...asset,
  id: `private-asset-${i}`,
}))

// Combine all assets for "All" tab
const allAssets = computed(() => {
  const privateWithType = privateAssets.map(a => ({ ...a, assetType: 'private' as const }))
  const sharedWithType = sharedAssets.map(a => ({ ...a, assetType: 'shared' as const }))
  return [...privateWithType, ...sharedWithType]
})

const filteredAllAssets = computed(() => {
  if (sourceFilter.value === 'all') return allAssets.value
  return allAssets.value.filter(asset => asset.source === sourceFilter.value)
})

const filteredSharedAssets = computed(() => {
  if (sourceFilter.value === 'all') return sharedAssets
  return sharedAssets.filter(asset => asset.source === sourceFilter.value)
})

const filteredPrivateAssets = computed(() => {
  if (sourceFilter.value === 'all') return privateAssets
  return privateAssets.filter(asset => asset.source === sourceFilter.value)
})

const getAssetIcon = (type: string) => {
  switch (type) {
    case 'image': return 'image'
    case 'video': return 'video'
    case 'audio': return 'volume-up'
    default: return 'file'
  }
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- All/Private/Shared Tabs + Source Filter Dropdown -->
    <div class="flex items-center justify-between border-b border-border px-2 py-1.5">
      <!-- Tabs -->
      <div class="flex items-center gap-1">
        <button
          class="rounded px-2 py-1 text-[11px] font-medium transition-colors"
          :class="[
            activeTab === 'all'
              ? 'bg-accent text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          ]"
          @click="activeTab = 'all'"
        >
          <span class="flex items-center gap-1">
            <Icon name="layers" size="xs" />
            All
          </span>
        </button>
        <button
          class="rounded px-2 py-1 text-[11px] font-medium transition-colors"
          :class="[
            activeTab === 'private'
              ? 'bg-accent text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          ]"
          @click="activeTab = 'private'"
        >
          <span class="flex items-center gap-1">
            <Icon name="lock" size="xs" />
            Private
          </span>
        </button>
        <button
          class="rounded px-2 py-1 text-[11px] font-medium transition-colors"
          :class="[
            activeTab === 'shared'
              ? 'bg-accent text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          ]"
          @click="activeTab = 'shared'"
        >
          <span class="flex items-center gap-1">
            <Icon name="users" size="xs" />
            Shared
          </span>
        </button>
      </div>

      <!-- Source Filter Dropdown -->
      <div class="relative">
        <button
          class="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          :class="sourceFilter !== 'all' ? 'bg-accent/50 text-foreground' : ''"
          @click="showSourceDropdown = !showSourceDropdown"
        >
          <Icon :name="sourceFilter === 'generated' ? 'sparkles' : sourceFilter === 'imported' ? 'download' : 'filter'" size="xs" />
          {{ sourceFilterLabel }}
          <Icon name="chevron-down" size="xs" />
        </button>
        <!-- Dropdown Menu -->
        <div
          v-if="showSourceDropdown"
          class="absolute right-0 top-full z-50 mt-1 min-w-[120px] overflow-hidden rounded-md border border-border bg-popover shadow-md"
          @mouseleave="showSourceDropdown = false"
        >
          <button
            class="flex w-full items-center gap-2 px-3 py-1.5 text-[11px] transition-colors hover:bg-accent"
            :class="sourceFilter === 'all' ? 'bg-accent text-foreground' : 'text-muted-foreground'"
            @click="sourceFilter = 'all'; showSourceDropdown = false"
          >
            <Icon name="layers" size="xs" />
            All Sources
          </button>
          <button
            class="flex w-full items-center gap-2 px-3 py-1.5 text-[11px] transition-colors hover:bg-accent"
            :class="sourceFilter === 'generated' ? 'bg-accent text-foreground' : 'text-muted-foreground'"
            @click="sourceFilter = 'generated'; showSourceDropdown = false"
          >
            <Icon name="sparkles" size="xs" />
            Generated
          </button>
          <button
            class="flex w-full items-center gap-2 px-3 py-1.5 text-[11px] transition-colors hover:bg-accent"
            :class="sourceFilter === 'imported' ? 'bg-accent text-foreground' : 'text-muted-foreground'"
            @click="sourceFilter = 'imported'; showSourceDropdown = false"
          >
            <Icon name="download" size="xs" />
            Imported
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-2">
      <!-- All Assets -->
      <template v-if="activeTab === 'all'">
        <!-- List View -->
        <div v-if="viewMode === 'list'" class="space-y-0.5">
          <div
            v-for="asset in filteredAllAssets"
            :key="asset.id"
            class="group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50"
          >
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted/50">
              <Icon
                :name="getAssetIcon(asset.type)"
                size="sm"
                class="text-muted-foreground"
              />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-medium text-foreground">{{ asset.name }}</p>
              <p class="truncate text-[10px] text-muted-foreground">
                <template v-if="asset.assetType === 'shared'">
                  {{ asset.sharedBy?.name }} ·
                </template>
                {{ asset.createdAt }}
              </p>
            </div>
            <div
              class="mr-1 rounded px-1 py-0.5 text-[9px] font-medium"
              :class="[
                asset.source === 'generated'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-blue-500/20 text-blue-400'
              ]"
            >
              {{ asset.source === 'generated' ? 'Gen' : 'Imp' }}
            </div>
            <Icon :name="asset.assetType === 'shared' ? 'users' : 'lock'" size="xs" class="mr-1 text-muted-foreground" />
            <button
              v-tooltip.left="{ value: 'Use Asset', showDelay: 50 }"
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-600 text-white opacity-0 transition-all hover:bg-blue-500 group-hover:opacity-100"
            >
              <Icon name="plus" size="xs" />
            </button>
          </div>
        </div>

        <!-- Grid View -->
        <div v-else class="grid grid-cols-2 gap-2">
          <div
            v-for="asset in filteredAllAssets"
            :key="asset.id"
            class="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-border hover:bg-muted/50"
          >
            <!-- Thumbnail -->
            <div class="relative aspect-square bg-background">
              <img
                v-if="asset.thumbnail"
                :src="asset.thumbnail"
                :alt="asset.name"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full w-full items-center justify-center bg-muted/30">
                <Icon :name="getAssetIcon(asset.type)" size="2xl" class="text-muted-foreground/30" />
              </div>
              <!-- Source Badge -->
              <div
                class="absolute left-1.5 top-1.5 rounded px-1 py-0.5 text-[9px] font-medium"
                :class="[
                  asset.source === 'generated'
                    ? 'bg-purple-500/80 text-white'
                    : 'bg-blue-500/80 text-white'
                ]"
              >
                {{ asset.source === 'generated' ? 'Generated' : 'Imported' }}
              </div>
              <!-- Use Button -->
              <button
                v-tooltip.left="{ value: 'Use Asset', showDelay: 50 }"
                class="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white opacity-0 transition-all hover:bg-blue-500 group-hover:opacity-100"
              >
                <Icon name="plus" size="xs" />
              </button>
              <!-- Size Badge -->
              <div v-if="asset.size" class="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded bg-card/80 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                <Icon :name="asset.assetType === 'shared' ? 'users' : 'lock'" size="xs" />
                {{ asset.size }}
              </div>
            </div>
            <!-- Info -->
            <div class="px-2 py-1.5">
              <div class="truncate text-xs font-medium text-foreground">{{ asset.name }}</div>
              <div class="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                <template v-if="asset.assetType === 'shared'">
                  <span>{{ asset.sharedBy?.name }}</span>
                  <span>·</span>
                </template>
                <span>{{ asset.createdAt }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredAllAssets.length === 0" class="flex h-full flex-col items-center justify-center py-8">
          <Icon name="layers" size="xl" class="mb-2 text-muted-foreground/15" />
          <p class="text-xs text-muted-foreground/60">No assets found</p>
        </div>
      </template>

      <!-- Shared Assets -->
      <template v-else-if="activeTab === 'shared'">
        <!-- List View -->
        <div v-if="viewMode === 'list'" class="space-y-0.5">
          <div
            v-for="asset in filteredSharedAssets"
            :key="asset.id"
            class="group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50"
          >
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted/50">
              <Icon
                :name="getAssetIcon(asset.type)"
                size="sm"
                class="text-muted-foreground"
              />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-medium text-foreground">{{ asset.name }}</p>
              <p class="truncate text-[10px] text-muted-foreground">
                {{ asset.sharedBy?.name }} · {{ asset.createdAt }}
              </p>
            </div>
            <div
              class="mr-1 rounded px-1 py-0.5 text-[9px] font-medium"
              :class="[
                asset.source === 'generated'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-blue-500/20 text-blue-400'
              ]"
            >
              {{ asset.source === 'generated' ? 'Gen' : 'Imp' }}
            </div>
            <button
              v-tooltip.left="{ value: 'Use Asset', showDelay: 50 }"
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-600 text-white opacity-0 transition-all hover:bg-blue-500 group-hover:opacity-100"
            >
              <Icon name="plus" size="xs" />
            </button>
          </div>
        </div>

        <!-- Grid View -->
        <div v-else class="grid grid-cols-2 gap-2">
          <div
            v-for="asset in filteredSharedAssets"
            :key="asset.id"
            class="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-border hover:bg-muted/50"
          >
            <!-- Thumbnail -->
            <div class="relative aspect-square bg-background">
              <img
                v-if="asset.thumbnail"
                :src="asset.thumbnail"
                :alt="asset.name"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full w-full items-center justify-center bg-muted/30">
                <Icon :name="getAssetIcon(asset.type)" size="2xl" class="text-muted-foreground/30" />
              </div>
              <!-- Source Badge -->
              <div
                class="absolute left-1.5 top-1.5 rounded px-1 py-0.5 text-[9px] font-medium"
                :class="[
                  asset.source === 'generated'
                    ? 'bg-purple-500/80 text-white'
                    : 'bg-blue-500/80 text-white'
                ]"
              >
                {{ asset.source === 'generated' ? 'Generated' : 'Imported' }}
              </div>
              <!-- Use Button -->
              <button
                v-tooltip.left="{ value: 'Use Asset', showDelay: 50 }"
                class="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white opacity-0 transition-all hover:bg-blue-500 group-hover:opacity-100"
              >
                <Icon name="plus" size="xs" />
              </button>
              <!-- Size Badge -->
              <div v-if="asset.size" class="absolute bottom-1.5 right-1.5 rounded bg-card/80 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {{ asset.size }}
              </div>
            </div>
            <!-- Info -->
            <div class="px-2 py-1.5">
              <div class="truncate text-xs font-medium text-foreground">{{ asset.name }}</div>
              <div class="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                <span>{{ asset.sharedBy?.name }}</span>
                <span>·</span>
                <span>{{ asset.createdAt }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredSharedAssets.length === 0" class="flex h-full flex-col items-center justify-center py-8">
          <Icon name="image" size="xl" class="mb-2 text-muted-foreground/15" />
          <p class="text-xs text-muted-foreground/60">No assets found</p>
        </div>
      </template>

      <!-- Private Assets -->
      <template v-else>
        <!-- List View -->
        <div v-if="viewMode === 'list'" class="space-y-0.5">
          <div
            v-for="asset in filteredPrivateAssets"
            :key="asset.id"
            class="group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50"
          >
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted/50">
              <Icon
                :name="getAssetIcon(asset.type)"
                size="sm"
                class="text-muted-foreground"
              />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-medium text-foreground">{{ asset.name }}</p>
              <p class="truncate text-[10px] text-muted-foreground">{{ asset.type }} · {{ asset.createdAt }}</p>
            </div>
            <div
              class="mr-1 rounded px-1 py-0.5 text-[9px] font-medium"
              :class="[
                asset.source === 'generated'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-blue-500/20 text-blue-400'
              ]"
            >
              {{ asset.source === 'generated' ? 'Gen' : 'Imp' }}
            </div>
            <button
              v-tooltip.left="{ value: 'Use Asset', showDelay: 50 }"
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-600 text-white opacity-0 transition-all hover:bg-blue-500 group-hover:opacity-100"
            >
              <Icon name="plus" size="xs" />
            </button>
          </div>
        </div>

        <!-- Grid View -->
        <div v-else class="grid grid-cols-2 gap-2">
          <div
            v-for="asset in filteredPrivateAssets"
            :key="asset.id"
            class="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-border hover:bg-muted/50"
          >
            <!-- Thumbnail -->
            <div class="relative aspect-square bg-background">
              <img
                v-if="asset.thumbnail"
                :src="asset.thumbnail"
                :alt="asset.name"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full w-full items-center justify-center bg-muted/30">
                <Icon :name="getAssetIcon(asset.type)" size="2xl" class="text-muted-foreground/30" />
              </div>
              <!-- Source Badge -->
              <div
                class="absolute left-1.5 top-1.5 rounded px-1 py-0.5 text-[9px] font-medium"
                :class="[
                  asset.source === 'generated'
                    ? 'bg-purple-500/80 text-white'
                    : 'bg-blue-500/80 text-white'
                ]"
              >
                {{ asset.source === 'generated' ? 'Generated' : 'Imported' }}
              </div>
              <!-- Use Button -->
              <button
                v-tooltip.left="{ value: 'Use Asset', showDelay: 50 }"
                class="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white opacity-0 transition-all hover:bg-blue-500 group-hover:opacity-100"
              >
                <Icon name="plus" size="xs" />
              </button>
              <!-- Size Badge -->
              <div v-if="asset.size" class="absolute bottom-1.5 right-1.5 rounded bg-card/80 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {{ asset.size }}
              </div>
            </div>
            <!-- Info -->
            <div class="px-2 py-1.5">
              <div class="truncate text-xs font-medium text-foreground">{{ asset.name }}</div>
              <div class="mt-0.5 text-[10px] text-muted-foreground">{{ asset.createdAt }}</div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredPrivateAssets.length === 0" class="flex h-full flex-col items-center justify-center py-8">
          <Icon name="lock" size="xl" class="mb-2 text-muted-foreground/15" />
          <p class="text-xs text-muted-foreground/60">No assets found</p>
        </div>
      </template>
    </div>
  </div>
</template>
