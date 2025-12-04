<script setup lang="ts">
import { FavoriteButton } from '@/components/common'
import type { Template } from '@/data/workspaceMockData'

interface Props {
  template: Template
}

defineProps<Props>()

const emit = defineEmits<{
  open: [id: string]
  toggleFavorite: [id: string]
}>()
</script>

<template>
  <div
    class="group cursor-pointer"
    @click="emit('open', template.id)"
  >
    <!-- Thumbnail with hover overlay -->
    <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 transition-all duration-200 group-hover:scale-[1.01] group-hover:shadow-xl dark:bg-zinc-800">
      <img
        :src="template.thumbnail"
        :alt="template.name"
        class="h-full w-full object-cover"
      />
      <!-- Overlay -->
      <div class="absolute inset-0 flex flex-col justify-between p-2">
        <!-- Top row - Provider badge (if exists) -->
        <div class="flex items-start justify-between">
          <div>
            <!-- Provider badge placeholder - could be added to Template type -->
          </div>
          <!-- Favorite on hover -->
          <FavoriteButton
            :is-favorite="template.favorite"
            variant="overlay"
            size="md"
            class="opacity-0 transition-opacity group-hover:opacity-100"
            @toggle="emit('toggleFavorite', template.id)"
          />
        </div>
        <!-- Bottom row - Tags -->
        <div class="flex items-end justify-between gap-2">
          <!-- Tags at bottom (ComfyUI style) -->
          <div class="flex flex-wrap gap-1">
            <span
              v-for="tag in template.tags?.slice(0, 3)"
              :key="tag"
              class="rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- Name & Description -->
    <div class="mt-2.5 px-0.5">
      <h3
        :title="template.name"
        class="truncate text-sm font-semibold text-zinc-900 dark:text-foreground"
      >
        {{ template.name }}
      </h3>
      <p class="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
        {{ template.description }}
      </p>
    </div>
  </div>
</template>
