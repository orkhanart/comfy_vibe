<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@/components/ui/icon'
import type { ShareAccessMode } from '@/types/workflowShare'

interface Props {
  workflowId: string
  /** Access mode restriction for shared workflows */
  accessMode?: ShareAccessMode
  /** Whether this is a shared workflow (received from someone else) */
  isReceivedShare?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accessMode: undefined,
  isReceivedShare: false,
})

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
  leave: [id: string]
  fork: [id: string]
  close: []
}>()

const openSubMenuId = ref<string | null>(null)

// Computed flags for which modes are allowed based on accessMode
const canOpenWorkflowEditor = computed(() => {
  if (!props.accessMode) return true // No restriction
  return props.accessMode === 'workflow' || props.accessMode === 'both'
})

const canOpenLinearMode = computed(() => {
  if (!props.accessMode) return true // No restriction
  return props.accessMode === 'linear' || props.accessMode === 'both'
})

// Show "Open with" submenu only if both options are available
const showOpenWithSubmenu = computed(() => {
  return canOpenWorkflowEditor.value && canOpenLinearMode.value
})
</script>

<template>
  <div
    class="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
    @click.stop
  >
    <!-- Open with submenu (when both modes available) -->
    <div
      v-if="showOpenWithSubmenu"
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

    <!-- Single open option (when only one mode available) -->
    <button
      v-if="!showOpenWithSubmenu && canOpenWorkflowEditor"
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('openNodeMode', workflowId)"
    >
      <Icon name="sitemap" size="sm" />
      Open in Workflow Editor
    </button>
    <button
      v-if="!showOpenWithSubmenu && canOpenLinearMode"
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('openLinearMode', workflowId)"
    >
      <Icon name="list" size="sm" />
      Open in Linear Mode
    </button>

    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('fileInfo', workflowId)"
    >
      <Icon name="info-circle" size="sm" />
      File Info
    </button>
    <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />

    <!-- Fork option for received shares -->
    <button
      v-if="isReceivedShare"
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('fork', workflowId)"
    >
      <Icon name="git-branch" size="sm" />
      Fork to My Library
    </button>

    <!-- Duplicate (for owned workflows only) -->
    <button
      v-if="!isReceivedShare"
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('duplicate', workflowId)"
    >
      <Icon name="copy" size="sm" />
      Duplicate
    </button>

    <!-- Move (for owned workflows only) -->
    <button
      v-if="!isReceivedShare"
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('move', workflowId)"
    >
      <Icon name="folder" size="sm" />
      Move to...
    </button>

    <!-- Rename (for owned workflows only) -->
    <button
      v-if="!isReceivedShare"
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('rename', workflowId)"
    >
      <Icon name="edit" size="sm" />
      Rename
    </button>
    <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />

    <!-- Share (for owned workflows only) -->
    <button
      v-if="!isReceivedShare"
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('share', workflowId)"
    >
      <Icon name="share" size="sm" />
      Share
    </button>

    <!-- Export -->
    <button
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
      @click="emit('export', workflowId)"
    >
      <Icon name="download" size="sm" />
      Export
    </button>
    <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />

    <!-- Delete (for owned workflows only) -->
    <button
      v-if="!isReceivedShare"
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
      @click="emit('delete', workflowId)"
    >
      <Icon name="trash" size="sm" />
      Delete
    </button>

    <!-- Leave (for received shares only) -->
    <button
      v-if="isReceivedShare"
      class="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
      @click="emit('leave', workflowId)"
    >
      <Icon name="log-out" size="sm" />
      Leave
    </button>
  </div>
</template>
