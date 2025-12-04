<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@/components/ui/icon'

interface Props {
  workflowId: string
}

defineProps<Props>()

const emit = defineEmits<{
  openNodeMode: [id: string]
  openLinearMode: [id: string]
  fileInfo: [id: string]
  duplicate: [id: string]
  move: [id: string]
  rename: [id: string]
  share: [id: string]
  export: [id: string]
  delete: [id: string]
  close: []
}>()

const openSubMenuId = ref<string | null>(null)
</script>

<template>
  <div
    class="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
    @click.stop
  >
    <!-- Open with submenu -->
    <div
      class="relative"
      @mouseenter="openSubMenuId = 'open-with'"
      @mouseleave="openSubMenuId = null"
    >
      <button
        class="flex w-full items-center justify-between px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      >
        <span class="flex items-center gap-2">
          <Icon name="external-link" size="sm" />
          Open with
        </span>
        <Icon name="chevron-right" size="xs" />
      </button>
      <!-- Submenu -->
      <div
        v-if="openSubMenuId === 'open-with'"
        class="absolute left-full top-0 ml-1 w-40 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
      >
        <button
          class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
          @click="emit('openNodeMode', workflowId)"
        >
          <Icon name="sitemap" size="sm" />
          Workflow Editor
        </button>
        <button
          class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
          @click="emit('openLinearMode', workflowId)"
        >
          <Icon name="list" size="sm" />
          Linear Mode
        </button>
      </div>
    </div>
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('fileInfo', workflowId)"
    >
      <Icon name="info-circle" size="sm" />
      File Info
    </button>
    <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('duplicate', workflowId)"
    >
      <Icon name="copy" size="sm" />
      Duplicate
    </button>
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('move', workflowId)"
    >
      <Icon name="folder" size="sm" />
      Move to...
    </button>
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('rename', workflowId)"
    >
      <Icon name="edit" size="sm" />
      Rename
    </button>
    <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('share', workflowId)"
    >
      <Icon name="share" size="sm" />
      Share
    </button>
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('export', workflowId)"
    >
      <Icon name="download" size="sm" />
      Export
    </button>
    <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
      @click="emit('delete', workflowId)"
    >
      <Icon name="trash" size="sm" />
      Delete
    </button>
  </div>
</template>
