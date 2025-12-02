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
    class="group cursor-pointer rounded-xl bg-white transition-all hover:shadow-md dark:bg-card"
    @click="emit('open', workflow.id)"
  >
    <!-- Thumbnail -->
    <div class="relative aspect-square overflow-hidden rounded-t-xl bg-zinc-100 dark:bg-zinc-800">
      <img
        :src="workflow.thumbnail"
        :alt="workflow.name"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <!-- Favorite button (top-right) -->
      <div class="absolute right-2 top-2">
        <FavoriteButton
          :is-favorite="workflow.favorite"
          variant="overlay"
          size="md"
          @toggle="emit('toggleFavorite', workflow.id)"
        />
      </div>
      <!-- Tags (bottom-left) -->
      <div class="absolute bottom-2 left-2 flex flex-wrap gap-1">
        <span
          v-for="tag in workflow.tags"
          :key="tag"
          class="rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
        >
          {{ tag }}
        </span>
      </div>
      <!-- Meta: nodes, runtime, cost (bottom-right) -->
      <div class="absolute bottom-2 right-2 flex items-center gap-1.5">
        <span class="inline-flex items-center gap-1 rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          <Icon name="cube" size="xs" />
          {{ workflow.nodeCount }}
        </span>
        <span class="inline-flex items-center gap-1 rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          <Icon name="clock" size="xs" />
          {{ workflow.runtime }}
        </span>
        <span class="rounded bg-green-500/80 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {{ workflow.cost }}
        </span>
      </div>
    </div>
    <!-- Content -->
    <div class="flex items-center gap-2 px-3 py-2.5">
      <!-- Icon -->
      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/20">
        <Icon name="sitemap" size="sm" class="text-purple-600 dark:text-purple-400" />
      </div>
      <!-- Title -->
      <h3 class="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-foreground">{{ workflow.name }}</h3>
      <!-- Right side: Open & Menu buttons -->
      <button
        class="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-xs font-medium text-white opacity-0 transition-all hover:bg-zinc-800 group-hover:opacity-100 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        @click.stop="emit('open', workflow.id)"
      >
        <Icon name="external-link" size="xs" />
        Open
      </button>
      <button
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 opacity-0 transition-all hover:bg-zinc-100 hover:text-zinc-600 group-hover:opacity-100 dark:hover:bg-zinc-800 dark:hover:text-white"
        @click.stop="emit('openMenu', workflow.id, $event)"
      >
        <Icon name="ellipsis-h" size="sm" />
      </button>
    </div>
  </div>
</template>
