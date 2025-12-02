<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import type { Template } from '@/data/workspaceMockData'

interface Props {
  template: Template
}

defineProps<Props>()

const emit = defineEmits<{
  open: [id: string]
}>()
</script>

<template>
  <div
    class="group cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-md dark:border-border dark:bg-card dark:hover:border-zinc-600"
    @click="emit('open', template.id)"
  >
    <!-- Thumbnail -->
    <div class="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
      <img
        :src="template.thumbnail"
        :alt="template.name"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <!-- Tags at bottom-right -->
      <div class="absolute bottom-2 right-2 flex flex-wrap justify-end gap-1">
        <span
          v-for="tag in template.tags"
          :key="tag"
          class="rounded bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    <!-- Content -->
    <div class="flex items-start justify-between gap-2 p-3">
      <div class="min-w-0 flex-1">
        <h3 class="font-medium text-zinc-900 dark:text-foreground">{{ template.name }}</h3>
        <p class="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-muted-foreground">
          {{ template.description }}
        </p>
      </div>
      <!-- Open button on hover -->
      <button
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 opacity-0 transition-all hover:bg-zinc-100 hover:text-zinc-900 group-hover:opacity-100 dark:hover:bg-zinc-800 dark:hover:text-white"
        @click.stop="emit('open', template.id)"
      >
        <Icon name="external-link" size="sm" />
      </button>
    </div>
  </div>
</template>
