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
    <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
      <img
        :src="workflow.thumbnail"
        :alt="workflow.name"
        class="h-full w-full object-cover"
      />
      <!-- Hover overlay -->
      <div class="absolute inset-0 flex flex-col justify-between bg-black/0 p-2 transition-all group-hover:bg-black/40">
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
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-zinc-700 backdrop-blur-sm transition-colors hover:bg-white"
              title="More options"
              @click.stop="emit('openMenu', workflow.id, $event)"
            >
              <Icon name="ellipsis-h" size="sm" />
            </button>
            <button
              class="flex h-8 items-center gap-1.5 rounded-lg bg-white/90 px-3 font-medium text-zinc-700 backdrop-blur-sm transition-colors hover:bg-white"
              @click.stop="emit('open', workflow.id)"
            >
              <Icon name="external-link" size="xs" />
              <span class="text-xs">Open</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Name -->
    <div class="mt-2 px-1">
      <h3
        :title="workflow.name"
        class="line-clamp-2 text-sm font-medium leading-tight text-zinc-900 dark:text-foreground"
      >
        {{ workflow.name }}
      </h3>
      <p class="mt-0.5 text-xs text-muted-foreground">{{ workflow.updatedAt }}</p>
    </div>
  </div>
</template>
