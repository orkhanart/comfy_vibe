<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FavoriteButton } from '@/components/common'
import { ref, computed } from 'vue'
import { DRAG_MIME_TYPE, type DragItem } from '@/composables/common/useFolders'
import type { ShareAccessMode } from '@/types/workflowShare'
import { ACCESS_MODE_LABELS, getAccessModeBadgeColor } from '@/types/workflowShare'

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
  folderId?: string | null
}

interface Props {
  workflow: Workflow
  /** Whether this workflow is shared (has recipients) */
  isShared?: boolean
  /** For received shares: who shared this with the current user */
  sharedBy?: {
    name: string
    avatar?: string
  }
  /** Access mode for this workflow (if shared) */
  accessMode?: ShareAccessMode
  /** Fork attribution info */
  forkedFrom?: {
    workflowName: string
    authorName: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  isShared: false,
  sharedBy: undefined,
  accessMode: undefined,
  forkedFrom: undefined,
})

// Computed for showing sharing badges
const showShareBadge = computed(() => props.isShared || props.sharedBy)
const showAccessModeBadge = computed(() => props.accessMode !== undefined)

const emit = defineEmits<{
  open: [id: string]
  toggleFavorite: [id: string]
  duplicate: [id: string]
  rename: [id: string]
  moveTo: [id: string]
  share: [id: string]
  delete: [id: string]
}>()

const menuOpen = ref(false)
const isDragging = ref(false)

function handleAction(action: string, id: string) {
  menuOpen.value = false
  switch (action) {
    case 'open': emit('open', id); break
    case 'duplicate': emit('duplicate', id); break
    case 'rename': emit('rename', id); break
    case 'moveTo': emit('moveTo', id); break
    case 'share': emit('share', id); break
    case 'delete': emit('delete', id); break
  }
}

function handleDragStart(e: DragEvent) {
  if (!e.dataTransfer) return

  const dragItem: DragItem = {
    type: 'workflow',
    id: props.workflow.id,
    name: props.workflow.name,
    folderId: props.workflow.folderId ?? null,
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
    @click="emit('open', workflow.id)"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
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
          <!-- Tags + Share/Access badges -->
          <div class="flex flex-wrap gap-1">
            <span
              v-for="tag in workflow.tags.slice(0, 2)"
              :key="tag"
              class="rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
            >
              {{ tag }}
            </span>
            <!-- Shared badge -->
            <span
              v-if="showShareBadge"
              class="inline-flex items-center gap-0.5 rounded bg-blue-500/80 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
            >
              <Icon name="users" size="xs" />
              {{ sharedBy ? 'Shared' : 'Sharing' }}
            </span>
            <!-- Access mode badge -->
            <span
              v-if="showAccessModeBadge && accessMode"
              class="rounded px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm"
              :class="getAccessModeBadgeColor(accessMode)"
            >
              {{ ACCESS_MODE_LABELS[accessMode] }}
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
    <!-- Name, Attribution & Menu -->
    <div class="mt-2 px-1">
      <div class="flex items-center justify-between gap-1">
        <h3
          :title="workflow.name"
          class="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-foreground"
        >
          {{ workflow.name }}
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
            @click="handleAction('open', workflow.id)"
          >
            <Icon name="external-link" size="sm" class="text-zinc-400" />
            Open
          </button>
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            @click="handleAction('duplicate', workflow.id)"
          >
            <Icon name="copy" size="sm" class="text-zinc-400" />
            Duplicate
          </button>
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            @click="handleAction('rename', workflow.id)"
          >
            <Icon name="pencil" size="sm" class="text-zinc-400" />
            Rename
          </button>
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            @click="handleAction('moveTo', workflow.id)"
          >
            <Icon name="folder-tree" size="sm" class="text-zinc-400" />
            Move to...
          </button>
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            @click="handleAction('share', workflow.id)"
          >
            <Icon name="share" size="sm" class="text-zinc-400" />
            Share
          </button>
          <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            @click="handleAction('delete', workflow.id)"
          >
            <Icon name="trash" size="sm" />
            Delete
          </button>
        </PopoverContent>
      </Popover>
      </div>
      <!-- Shared by / Fork attribution -->
      <div
        v-if="sharedBy || forkedFrom"
        class="mt-0.5 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400"
      >
        <!-- Shared by info -->
        <template v-if="sharedBy">
          <span>Shared by</span>
          <img
            v-if="sharedBy.avatar"
            :src="sharedBy.avatar"
            :alt="sharedBy.name"
            class="h-4 w-4 rounded-full object-cover"
          />
          <span class="font-medium text-zinc-600 dark:text-zinc-300">{{ sharedBy.name }}</span>
        </template>
        <!-- Fork attribution -->
        <template v-else-if="forkedFrom">
          <Icon name="git-branch" size="xs" />
          <span class="truncate">
            Forked from <span class="font-medium text-zinc-600 dark:text-zinc-300">{{ forkedFrom.workflowName }}</span>
            by <span class="font-medium text-zinc-600 dark:text-zinc-300">{{ forkedFrom.authorName }}</span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
