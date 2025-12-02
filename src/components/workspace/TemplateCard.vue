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

function formatUses(uses: number): string {
  if (uses >= 1000) {
    return `${(uses / 1000).toFixed(1)}k`
  }
  return uses.toString()
}
</script>

<template>
  <div
    class="group cursor-pointer"
    @click="emit('open', template.id)"
  >
    <!-- Thumbnail with hover overlay -->
    <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
      <img
        :src="template.thumbnail"
        :alt="template.name"
        class="h-full w-full object-cover"
      />
      <!-- Hover overlay -->
      <div class="absolute inset-0 flex flex-col justify-between bg-black/0 p-2 transition-all group-hover:bg-black/40">
        <!-- Top row -->
        <div class="flex items-start justify-between">
          <!-- Tags -->
          <div class="flex flex-wrap gap-1">
            <span
              v-for="tag in template.tags.slice(0, 2)"
              :key="tag"
              class="rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
            >
              {{ tag }}
            </span>
          </div>
          <div />
        </div>
        <!-- Bottom row -->
        <div class="flex items-end justify-between">
          <!-- Uses count -->
          <span class="inline-flex items-center gap-1 rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            <Icon name="users" size="xs" />
            {{ formatUses(template.uses) }}
          </span>
          <!-- Hover actions -->
          <div class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              class="flex h-8 items-center gap-1.5 rounded-lg bg-white/90 px-3 font-medium text-zinc-700 backdrop-blur-sm transition-colors hover:bg-white"
              @click.stop="emit('open', template.id)"
            >
              <Icon name="clone" size="xs" />
              <span class="text-xs">Use</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Name -->
    <div class="mt-2 px-1">
      <h3
        :title="template.name"
        class="line-clamp-2 text-sm font-medium leading-tight text-zinc-900 dark:text-foreground"
      >
        {{ template.name }}
      </h3>
      <p class="mt-0.5 text-xs text-muted-foreground">{{ template.category }}</p>
    </div>
  </div>
</template>
