<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import type { Folder } from '@/data/workspaceMockData'
import { ref } from 'vue'
import { DRAG_MIME_TYPE, type DragItem } from '@/composables/common/useFolders'

interface Props {
  path: Folder[]
  rootLabel?: string
  rootIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  rootLabel: 'Root',
  rootIcon: 'folder'
})

const emit = defineEmits<{
  navigate: [folderId: string | null]
  drop: [folderId: string | null, dragItem: DragItem]
}>()

// Track which breadcrumb segment is being hovered during drag
const dragOverId = ref<string | null | undefined>(undefined) // undefined = nothing, null = root, string = folder id

function handleDragEnter(e: DragEvent, folderId: string | null) {
  e.preventDefault()
  if (e.dataTransfer?.types.includes(DRAG_MIME_TYPE)) {
    dragOverId.value = folderId
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer?.types.includes(DRAG_MIME_TYPE)) {
    e.dataTransfer.dropEffect = 'move'
  }
}

function handleDragLeave(e: DragEvent) {
  const relatedTarget = e.relatedTarget as HTMLElement | null
  const currentTarget = e.currentTarget as HTMLElement
  if (!currentTarget.contains(relatedTarget)) {
    dragOverId.value = undefined
  }
}

function handleDrop(e: DragEvent, folderId: string | null) {
  e.preventDefault()
  e.stopPropagation()
  dragOverId.value = undefined

  if (!e.dataTransfer) return

  const data = e.dataTransfer.getData(DRAG_MIME_TYPE)
  if (!data) return

  try {
    const dragItem: DragItem = JSON.parse(data)
    emit('drop', folderId, dragItem)
  } catch {
    // Invalid JSON, ignore
  }
}
</script>

<template>
  <nav class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
    <!-- Root -->
    <button
      :class="[
        'flex items-center gap-1.5 rounded px-1.5 py-0.5 transition-all',
        dragOverId === null
          ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400'
          : 'hover:text-foreground'
      ]"
      @click="emit('navigate', null)"
      @dragenter="handleDragEnter($event, null)"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop($event, null)"
    >
      <Icon :name="rootIcon" size="sm" />
      <span>{{ rootLabel }}</span>
    </button>

    <!-- Path segments -->
    <template v-for="(folder, index) in path" :key="folder.id">
      <Icon
        name="chevron-right"
        size="xs"
        class="text-muted-foreground"
      />
      <button
        :class="[
          'rounded px-1.5 py-0.5 transition-all',
          dragOverId === folder.id
            ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400'
            : index === path.length - 1
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
        ]"
        :disabled="index === path.length - 1"
        @click="emit('navigate', folder.id)"
        @dragenter="handleDragEnter($event, folder.id)"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop($event, folder.id)"
      >
        {{ folder.name }}
      </button>
    </template>
  </nav>
</template>
