<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FavoriteButton } from '@/components/common'
import { getAssetIcon, type Asset } from '@/data/workspaceMockData'
import { ref } from 'vue'
import { DRAG_MIME_TYPE, type DragItem } from '@/composables/common/useFolders'

interface Props {
  asset: Asset
}

const props = defineProps<Props>()

const emit = defineEmits<{
  open: [id: string]
  toggleFavorite: [id: string]
  download: [id: string]
  useInWorkflow: [id: string]
  rename: [id: string]
  share: [id: string]
  delete: [id: string]
}>()

const menuOpen = ref(false)
const isDragging = ref(false)

function handleAction(action: string, id: string) {
  menuOpen.value = false
  switch (action) {
    case 'open': emit('open', id); break
    case 'download': emit('download', id); break
    case 'useInWorkflow': emit('useInWorkflow', id); break
    case 'rename': emit('rename', id); break
    case 'share': emit('share', id); break
    case 'delete': emit('delete', id); break
  }
}

function handleDragStart(e: DragEvent) {
  if (!e.dataTransfer) return

  const dragItem: DragItem = {
    type: 'asset',
    id: props.asset.id,
    name: props.asset.name,
    folderId: props.asset.folderId ?? null,
  }

  e.dataTransfer.setData(DRAG_MIME_TYPE, JSON.stringify(dragItem))
  e.dataTransfer.setData('text/plain', JSON.stringify(dragItem))
  e.dataTransfer.effectAllowed = 'move'

  isDragging.value = true
}

function handleDragEnd() {
  isDragging.value = false
}
</script>

<template>
  <div
    :class="[
      'group cursor-pointer transition-opacity',
      isDragging && 'opacity-50'
    ]"
    draggable="true"
    @click="emit('open', asset.id)"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
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
            @click="handleAction('open', asset.id)"
          >
            <Icon name="eye" size="sm" class="text-zinc-400" />
            View
          </button>
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            @click="handleAction('download', asset.id)"
          >
            <Icon name="download" size="sm" class="text-zinc-400" />
            Download
          </button>
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            @click="handleAction('useInWorkflow', asset.id)"
          >
            <Icon name="sitemap" size="sm" class="text-zinc-400" />
            Use in Workflow
          </button>
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            @click="handleAction('rename', asset.id)"
          >
            <Icon name="pencil" size="sm" class="text-zinc-400" />
            Rename
          </button>
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            @click="handleAction('share', asset.id)"
          >
            <Icon name="share" size="sm" class="text-zinc-400" />
            Share
          </button>
          <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            @click="handleAction('delete', asset.id)"
          >
            <Icon name="trash" size="sm" />
            Delete
          </button>
        </PopoverContent>
      </Popover>
    </div>
  </div>
</template>
