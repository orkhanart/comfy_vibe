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
    <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 transition-all duration-200 group-hover:scale-[1.01] group-hover:shadow-xl dark:bg-zinc-800">
      <img
        :src="asset.thumbnail"
        :alt="asset.name"
        class="h-full w-full object-cover"
      />
      <!-- Hover overlay -->
      <div class="absolute inset-0 flex flex-col justify-between p-2">
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
              class="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900/70 text-white backdrop-blur-sm transition-colors hover:bg-zinc-900/90"
              title="View"
              @click.stop="emit('open', asset.id)"
            >
              <Icon name="eye" size="sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Name & Menu -->
    <div class="mt-2 flex items-center justify-between gap-1 px-1">
      <h3
        :title="asset.name"
        class="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-foreground"
      >
        {{ asset.name }}
      </h3>
      <button
        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-foreground"
        title="More options"
        @click.stop="emit('menu', asset.id, $event)"
      >
        <Icon name="ellipsis-h" size="sm" />
      </button>
    </div>
  </div>
</template>
