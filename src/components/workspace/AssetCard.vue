<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { FavoriteButton } from '@/components/common'
import { getAssetIcon, type Asset } from '@/data/workspaceMockData'

interface Props {
  asset: Asset
}

defineProps<Props>()

const emit = defineEmits<{
  open: [id: string]
  toggleFavorite: [id: string]
  menu: [id: string, event: MouseEvent]
}>()
</script>

<template>
  <div
    class="group cursor-pointer rounded-xl bg-white transition-all hover:shadow-md dark:bg-card"
    @click="emit('open', asset.id)"
  >
    <!-- Thumbnail -->
    <div class="relative aspect-square overflow-hidden rounded-t-xl bg-zinc-100 dark:bg-zinc-800">
      <img
        :src="asset.thumbnail"
        :alt="asset.name"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <!-- Source badge (top-left) -->
      <div class="absolute left-2 top-2">
        <span
          :class="[
            'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium capitalize backdrop-blur-sm',
            asset.source === 'generated'
              ? 'bg-violet-500/80 text-white'
              : 'bg-blue-500/80 text-white'
          ]"
        >
          <Icon :name="asset.source === 'generated' ? 'magic' : 'upload'" size="xs" />
          {{ asset.source }}
        </span>
      </div>
      <!-- Favorite button (top-right) -->
      <div class="absolute right-2 top-2">
        <FavoriteButton
          :is-favorite="asset.favorite"
          variant="overlay"
          size="md"
          @toggle="emit('toggleFavorite', asset.id)"
        />
      </div>
      <!-- Type badge (bottom-left) -->
      <div class="absolute bottom-2 left-2 flex items-center gap-1">
        <span class="inline-flex items-center gap-1 rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium capitalize text-white backdrop-blur-sm">
          <Icon :name="getAssetIcon(asset.type)" size="xs" />
          {{ asset.type }}
        </span>
      </div>
      <!-- Size & dimensions (bottom-right) -->
      <div class="absolute bottom-2 right-2 flex items-center gap-1.5">
        <span class="rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {{ asset.dimensions }}
        </span>
        <span class="rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {{ asset.size }}
        </span>
      </div>
    </div>
    <!-- Content -->
    <div class="flex items-center gap-2 px-3 py-2.5">
      <!-- Icon -->
      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/20">
        <Icon :name="getAssetIcon(asset.type)" size="sm" class="text-blue-600 dark:text-blue-400" />
      </div>
      <!-- Title -->
      <h3 class="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-foreground">{{ asset.name }}</h3>
      <!-- Right side: Open & Menu buttons -->
      <button
        class="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-xs font-medium text-white opacity-0 transition-all hover:bg-zinc-800 group-hover:opacity-100 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        @click.stop="emit('open', asset.id)"
      >
        <Icon name="eye" size="xs" />
        View
      </button>
      <button
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 opacity-0 transition-all hover:bg-zinc-100 hover:text-zinc-600 group-hover:opacity-100 dark:hover:bg-zinc-800 dark:hover:text-white"
        @click.stop="emit('menu', asset.id, $event)"
      >
        <Icon name="ellipsis-h" size="sm" />
      </button>
    </div>
  </div>
</template>
