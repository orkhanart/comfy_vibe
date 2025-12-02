<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import type { Folder } from '@/data/workspaceMockData'

interface Props {
  folder: Folder
  itemCount?: number
  subfolderCount?: number
}

defineProps<Props>()

const emit = defineEmits<{
  open: [id: string]
  openMenu: [id: string, event: MouseEvent]
}>()
</script>

<template>
  <div
    class="group cursor-pointer"
    @click="emit('open', folder.id)"
  >
    <!-- Folder icon with hover overlay -->
    <div class="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
      <Icon
        name="folder"
        class="h-16 w-16 text-amber-500 dark:text-amber-400"
      />
      <!-- Hover overlay -->
      <div class="absolute inset-0 flex flex-col justify-between bg-black/0 p-2 transition-all group-hover:bg-black/40">
        <!-- Top row -->
        <div />
        <!-- Bottom row -->
        <div class="flex items-end justify-between">
          <!-- Item count badges -->
          <div class="flex items-center gap-1">
            <span
              v-if="itemCount !== undefined && itemCount > 0"
              class="inline-flex items-center gap-0.5 rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
            >
              <Icon name="file" size="xs" />
              {{ itemCount }}
            </span>
            <span
              v-if="subfolderCount !== undefined && subfolderCount > 0"
              class="inline-flex items-center gap-0.5 rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
            >
              <Icon name="folder" size="xs" />
              {{ subfolderCount }}
            </span>
          </div>
          <!-- Hover actions -->
          <div class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-zinc-700 backdrop-blur-sm transition-colors hover:bg-white"
              title="More options"
              @click.stop="emit('openMenu', folder.id, $event)"
            >
              <Icon name="ellipsis-h" size="sm" />
            </button>
            <button
              class="flex h-8 items-center gap-1.5 rounded-lg bg-white/90 px-3 font-medium text-zinc-700 backdrop-blur-sm transition-colors hover:bg-white"
              @click.stop="emit('open', folder.id)"
            >
              <Icon name="arrow-right" size="xs" />
              <span class="text-xs">Open</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Name -->
    <div class="mt-2 px-1">
      <h3
        :title="folder.name"
        class="line-clamp-2 text-sm font-medium leading-tight text-zinc-900 dark:text-foreground"
      >
        {{ folder.name }}
      </h3>
      <p class="mt-0.5 text-xs text-muted-foreground">
        {{ itemCount ?? 0 }} {{ (itemCount ?? 0) === 1 ? 'item' : 'items' }}
      </p>
    </div>
  </div>
</template>
