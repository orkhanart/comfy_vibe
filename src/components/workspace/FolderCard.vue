<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { Folder } from '@/data/workspaceMockData'
import { ref } from 'vue'

interface Props {
  folder: Folder
  itemCount?: number
  subfolderCount?: number
  icon?: string
  iconClass?: string
  bgClass?: string
  isNative?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  itemCount: 0,
  subfolderCount: 0,
  icon: 'folder',
  iconClass: 'text-amber-500 dark:text-amber-400',
  bgClass: '',
  isNative: false
})

const emit = defineEmits<{
  open: [id: string]
  rename: [id: string]
  moveTo: [id: string]
  share: [id: string]
  delete: [id: string]
}>()

const menuOpen = ref(false)

function handleAction(action: string, id: string) {
  menuOpen.value = false
  switch (action) {
    case 'open': emit('open', id); break
    case 'rename': emit('rename', id); break
    case 'moveTo': emit('moveTo', id); break
    case 'share': emit('share', id); break
    case 'delete': emit('delete', id); break
  }
}
</script>

<template>
  <div
    class="group cursor-pointer"
    @click="emit('open', folder.id)"
  >
    <!-- Folder icon with hover overlay -->
    <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 transition-all duration-200 group-hover:scale-[1.01] group-hover:shadow-xl dark:bg-zinc-800">
      <!-- Icon in top left -->
      <div class="absolute left-3 top-3">
        <Icon :name="icon" size="xl" :class="iconClass" />
      </div>
      <!-- Hover overlay -->
      <div class="absolute inset-0 flex flex-col justify-between p-2">
        <!-- Top row -->
        <div />
        <!-- Bottom row -->
        <div class="flex items-end justify-between">
          <!-- Item count badges -->
          <div class="flex items-center gap-1">
            <span
              v-if="itemCount > 0"
              class="inline-flex items-center gap-0.5 rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
            >
              <Icon name="file" size="xs" />
              {{ itemCount }}
            </span>
            <span
              v-if="subfolderCount > 0"
              class="inline-flex items-center gap-0.5 rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
            >
              <Icon name="folder" size="xs" />
              {{ subfolderCount }}
            </span>
          </div>
          <!-- Hover actions -->
          <div class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              class="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900/70 text-white backdrop-blur-sm transition-colors hover:bg-zinc-900/90"
              title="Open"
              @click.stop="emit('open', folder.id)"
            >
              <Icon name="arrow-right" size="sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Name & Menu -->
    <div class="mt-2 flex items-center justify-between gap-1 px-1">
      <h3
        :title="folder.name"
        class="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-foreground"
      >
        {{ folder.name }}
      </h3>
      <Popover v-model:open="menuOpen">
        <PopoverTrigger as-child>
          <button
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-foreground"
            title="More options"
            @click.stop
          >
            <Icon name="ellipsis-h" size="sm" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" :side-offset="4" class="w-48 p-1">
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            @click="handleAction('open', folder.id)"
          >
            <Icon name="folder-open" size="sm" class="text-zinc-400" />
            Open
          </button>
          <button
            v-if="!isNative"
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            @click="handleAction('rename', folder.id)"
          >
            <Icon name="pencil" size="sm" class="text-zinc-400" />
            Rename
          </button>
          <button
            v-if="!isNative"
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            @click="handleAction('moveTo', folder.id)"
          >
            <Icon name="folder-tree" size="sm" class="text-zinc-400" />
            Move to...
          </button>
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            @click="handleAction('share', folder.id)"
          >
            <Icon name="share" size="sm" class="text-zinc-400" />
            Share
          </button>
          <template v-if="!isNative">
            <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />
            <button
              class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              @click="handleAction('delete', folder.id)"
            >
              <Icon name="trash" size="sm" />
              Delete
            </button>
          </template>
        </PopoverContent>
      </Popover>
    </div>
  </div>
</template>
