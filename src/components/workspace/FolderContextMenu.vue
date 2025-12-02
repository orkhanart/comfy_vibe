<script setup lang="ts">
import { Icon } from '@/components/ui/icon'

interface Props {
  folderId: string
}

defineProps<Props>()

const emit = defineEmits<{
  open: [id: string]
  rename: [id: string]
  delete: [id: string]
  close: []
}>()
</script>

<template>
  <div
    class="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
    @click.stop
  >
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('open', folderId)"
    >
      <Icon name="folder-open" size="sm" />
      Open
    </button>
    <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('rename', folderId)"
    >
      <Icon name="edit" size="sm" />
      Rename
    </button>
    <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
      @click="emit('delete', folderId)"
    >
      <Icon name="trash" size="sm" />
      Delete
    </button>
  </div>
</template>
