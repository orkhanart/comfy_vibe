<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { FavoriteButton } from '@/components/common'

export interface Workflow {
  id: string
  name: string
  description: string
  nodeCount: number
  updatedAt: string
  updatedTimestamp: number
  thumbnail: string
  favorite: boolean
  runtime: string
  cost: string
  tags: string[]
}

interface Props {
  workflow: Workflow
}

defineProps<Props>()

const emit = defineEmits<{
  open: [id: string]
  toggleFavorite: [id: string]
  openMenu: [id: string, event: MouseEvent]
}>()
</script>

<template>
  <div
    class="group cursor-pointer"
    @click="emit('open', workflow.id)"
  >
    <!-- Thumbnail with hover overlay -->
    <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 transition-all duration-200 group-hover:scale-[1.01] group-hover:shadow-xl dark:bg-zinc-800">
      <img
        :src="workflow.thumbnail"
        :alt="workflow.name"
        class="h-full w-full object-cover"
      />
      <!-- Hover overlay -->
      <div class="absolute inset-0 flex flex-col justify-between p-2">
        <!-- Top row -->
        <div class="flex items-start justify-between">
          <!-- Tags -->
          <div class="flex flex-wrap gap-1">
            <span
              v-for="tag in workflow.tags.slice(0, 2)"
              :key="tag"
              class="rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
            >
              {{ tag }}
            </span>
          </div>
          <!-- Favorite -->
          <FavoriteButton
            :is-favorite="workflow.favorite"
            variant="overlay"
            size="md"
            @toggle="emit('toggleFavorite', workflow.id)"
          />
        </div>
        <!-- Bottom row -->
        <div class="flex items-end justify-between">
          <!-- Meta badges -->
          <div class="flex items-center gap-1">
            <span class="inline-flex items-center gap-0.5 rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              <Icon name="cube" size="xs" />
              {{ workflow.nodeCount }}
            </span>
            <span class="rounded bg-green-500/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {{ workflow.cost }}
            </span>
          </div>
          <!-- Hover actions -->
          <div class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              class="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900/70 text-white backdrop-blur-sm transition-colors hover:bg-zinc-900/90"
              title="Open"
              @click.stop="emit('open', workflow.id)"
            >
              <Icon name="external-link" size="sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Name & Menu -->
    <div class="mt-2 flex items-center justify-between gap-1 px-1">
      <h3
        :title="workflow.name"
        class="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-foreground"
      >
        {{ workflow.name }}
      </h3>
      <button
        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-foreground"
        title="More options"
        @click.stop="emit('openMenu', workflow.id, $event)"
      >
        <Icon name="ellipsis-h" size="sm" />
      </button>
    </div>
  </div>
</template>
