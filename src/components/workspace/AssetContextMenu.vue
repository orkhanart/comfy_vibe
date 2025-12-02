<script setup lang="ts">
import { Icon } from '@/components/ui/icon'

interface Props {
  assetId: string
}

defineProps<Props>()

const emit = defineEmits<{
  view: [id: string]
  download: [id: string]
  copyPath: [id: string]
  fileInfo: [id: string]
  rename: [id: string]
  move: [id: string]
  duplicate: [id: string]
  delete: [id: string]
  close: []
}>()
</script>

<template>
  <div
    class="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
    @click.stop
  >
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('view', assetId)"
    >
      <Icon name="eye" size="sm" />
      View
    </button>
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('download', assetId)"
    >
      <Icon name="download" size="sm" />
      Download
    </button>
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('copyPath', assetId)"
    >
      <Icon name="link" size="sm" />
      Copy Path
    </button>
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('fileInfo', assetId)"
    >
      <Icon name="info-circle" size="sm" />
      File Info
    </button>
    <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('rename', assetId)"
    >
      <Icon name="edit" size="sm" />
      Rename
    </button>
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('move', assetId)"
    >
      <Icon name="folder" size="sm" />
      Move to...
    </button>
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('duplicate', assetId)"
    >
      <Icon name="copy" size="sm" />
      Duplicate
    </button>
    <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
      @click="emit('delete', assetId)"
    >
      <Icon name="trash" size="sm" />
      Delete
    </button>
  </div>
</template>
