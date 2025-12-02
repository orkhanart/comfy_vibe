<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import type { BrandAsset } from '@/data/sidebarMockData'

defineProps<{
  assets: BrandAsset[]
  viewMode: 'list' | 'grid'
  expanded: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

function getAssetIcon(type: BrandAsset['type']): string {
  switch (type) {
    case 'logo': return 'image'
    case 'color': return 'circle-fill'
    case 'font': return 'type'
    case 'template': return 'clone'
    case 'guideline': return 'book'
    default: return 'file'
  }
}

function getAssetTypeLabel(type: BrandAsset['type']): string {
  switch (type) {
    case 'logo': return 'Logo'
    case 'font': return 'Font'
    case 'template': return 'Template'
    case 'guideline': return 'Guide'
    default: return type
  }
}
</script>

<template>
  <!-- List View -->
  <template v-if="viewMode === 'list'">
    <!-- Category Header -->
    <button
      class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-muted"
      @click="emit('toggle')"
    >
      <Icon
        :name="expanded ? 'chevron-down' : 'chevron-right'"
        size="xs"
        class="text-muted-foreground transition-transform"
      />
      <Icon name="palette" size="xs" class="text-amber-400" />
      <span class="flex-1 text-xs font-medium text-foreground">Brand Kit</span>
      <span class="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
        {{ assets.filter(a => a.type !== 'color').length }}
      </span>
    </button>

    <!-- Items -->
    <div v-if="expanded" class="ml-4 space-y-0.5 border-l border-border pl-2">
      <div
        v-for="asset in assets.filter(a => a.type !== 'color')"
        :key="asset.id"
        class="group flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-muted"
      >
        <Icon name="circle-fill" size="md" class="text-[5px] text-muted-foreground/50 group-hover:text-muted-foreground" />
        <Icon :name="getAssetIcon(asset.type)" size="xs" />
        <span class="flex-1 truncate text-xs text-muted-foreground group-hover:text-foreground">{{ asset.name }}</span>
        <Icon name="download" size="xs" class="text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </div>
  </template>

  <!-- Grid View -->
  <template v-else>
    <div class="mb-2 flex items-center justify-between px-1">
      <div class="flex items-center gap-2">
        <Icon name="palette" size="xs" class="text-amber-400" />
        <span class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Brand Kit</span>
      </div>
      <span class="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
        {{ assets.filter(a => a.type !== 'color').length }}
      </span>
    </div>

    <!-- Assets Grid -->
    <div class="grid grid-cols-2 gap-2">
      <div
        v-for="asset in assets.filter(a => a.type !== 'color')"
        :key="asset.id"
        class="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card/80 transition-all hover:border-accent hover:bg-muted/80"
      >
        <!-- Icon Thumbnail -->
        <div class="relative flex aspect-[4/3] items-center justify-center bg-muted">
          <Icon :name="getAssetIcon(asset.type)" size="md" />
          <!-- Type Badge -->
          <div class="absolute right-1.5 top-1.5">
            <span class="rounded bg-amber-500/30 px-1.5 py-0.5 text-[9px] font-medium text-amber-300 backdrop-blur-sm">
              {{ getAssetTypeLabel(asset.type) }}
            </span>
          </div>
          <!-- Add button -->
          <button
            class="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded bg-white/90 text-foreground opacity-0 transition-all hover:bg-white group-hover:opacity-100"
            @click.stop
          >
            <Icon name="plus" size="xs" />
          </button>
        </div>
        <!-- Content -->
        <div class="p-2">
          <div class="truncate text-xs font-medium text-foreground group-hover:text-white">
            {{ asset.name }}
          </div>
          <div v-if="asset.description" class="mt-0.5 truncate text-[10px] text-muted-foreground">
            {{ asset.description }}
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
