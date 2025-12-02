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
    class="group cursor-pointer"
    @click="emit('open', asset.id)"
  >
    <!-- Thumbnail with hover overlay -->
    <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
      <img
        :src="asset.thumbnail"
        :alt="asset.name"
        class="h-full w-full object-cover"
      />
      <!-- Hover overlay -->
      <div class="absolute inset-0 flex flex-col justify-between bg-black/0 p-2 transition-all group-hover:bg-black/40">
        <!-- Top row -->
        <div class="flex items-start justify-between">
          <!-- Source badge -->
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
          <!-- Favorite -->
          <FavoriteButton
            :is-favorite="asset.favorite"
            variant="overlay"
            size="md"
            @toggle="emit('toggleFavorite', asset.id)"
          />
        </div>
        <!-- Bottom row -->
        <div class="flex items-end justify-between">
          <!-- Meta badges -->
          <div class="flex items-center gap-1">
            <span class="rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              {{ asset.dimensions }}
            </span>
            <span class="rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              {{ asset.size }}
            </span>
          </div>
          <!-- Hover actions -->
          <div class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-zinc-700 backdrop-blur-sm transition-colors hover:bg-white"
              title="More options"
              @click.stop="emit('menu', asset.id, $event)"
            >
              <Icon name="ellipsis-h" size="sm" />
            </button>
            <button
              class="flex h-8 items-center gap-1.5 rounded-lg bg-white/90 px-3 font-medium text-zinc-700 backdrop-blur-sm transition-colors hover:bg-white"
              @click.stop="emit('open', asset.id)"
            >
              <Icon name="eye" size="xs" />
              <span class="text-xs">View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Name -->
    <div class="mt-2 px-1">
      <h3
        :title="asset.name"
        class="line-clamp-2 text-sm font-medium leading-tight text-zinc-900 dark:text-foreground"
      >
        {{ asset.name }}
      </h3>
      <p class="mt-0.5 text-xs text-muted-foreground">{{ asset.updatedAt }}</p>
    </div>
  </div>
</template>
