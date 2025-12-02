<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { FavoriteButton } from '@/components/common'
import { getModelIcon, getModelColor, getBaseModelColor, type Model } from '@/data/workspaceMockData'

interface Props {
  model: Model
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
    @click="emit('open', model.id)"
  >
    <!-- Thumbnail with hover overlay -->
    <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
      <img
        v-if="model.thumbnail"
        :src="model.thumbnail"
        :alt="model.name"
        class="h-full w-full object-cover"
      />
      <div v-else class="flex h-full w-full items-center justify-center">
        <Icon :name="getModelIcon(model.type)" size="2xl" class="text-zinc-400" />
      </div>
      <!-- Hover overlay -->
      <div class="absolute inset-0 flex flex-col justify-between bg-black/0 p-2 transition-all group-hover:bg-black/40">
        <!-- Top row -->
        <div class="flex items-start justify-between">
          <!-- Base model badge -->
          <span
            :class="[
              'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm',
              getBaseModelColor(model.baseModel)
            ]"
          >
            {{ model.baseModel }}
          </span>
          <!-- Favorite -->
          <FavoriteButton
            :is-favorite="model.favorite"
            variant="overlay"
            size="md"
            @toggle="emit('toggleFavorite', model.id)"
          />
        </div>
        <!-- Bottom row -->
        <div class="flex items-end justify-between">
          <!-- Meta badges -->
          <div class="flex items-center gap-1">
            <span class="inline-flex items-center gap-0.5 rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium capitalize text-white backdrop-blur-sm">
              <Icon :name="getModelIcon(model.type)" size="xs" />
              {{ model.type }}
            </span>
            <span class="rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              {{ model.size }}
            </span>
          </div>
          <!-- Hover actions -->
          <div class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-zinc-700 backdrop-blur-sm transition-colors hover:bg-white"
              title="More options"
              @click.stop="emit('menu', model.id, $event)"
            >
              <Icon name="ellipsis-h" size="sm" />
            </button>
            <button
              class="flex h-8 items-center gap-1.5 rounded-lg bg-white/90 px-3 font-medium text-zinc-700 backdrop-blur-sm transition-colors hover:bg-white"
              @click.stop="emit('open', model.id)"
            >
              <Icon name="info-circle" size="xs" />
              <span class="text-xs">Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Name -->
    <div class="mt-2 px-1">
      <h3
        :title="model.name"
        class="line-clamp-2 text-sm font-medium leading-tight text-zinc-900 dark:text-foreground"
      >
        {{ model.name }}
      </h3>
      <p class="mt-0.5 text-xs text-muted-foreground">{{ model.updatedAt }}</p>
    </div>
  </div>
</template>
