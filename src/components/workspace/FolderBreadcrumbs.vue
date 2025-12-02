<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import type { Folder } from '@/data/workspaceMockData'

interface Props {
  path: Folder[]
  rootLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  rootLabel: 'Root'
})

const emit = defineEmits<{
  navigate: [folderId: string | null]
}>()
</script>

<template>
  <nav class="flex items-center gap-1 text-sm">
    <!-- Root -->
    <button
      class="flex items-center gap-1.5 rounded-md px-2 py-1 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
      @click="emit('navigate', null)"
    >
      <Icon name="folder" size="sm" />
      <span>{{ rootLabel }}</span>
    </button>

    <!-- Path segments -->
    <template v-for="(folder, index) in path" :key="folder.id">
      <Icon
        name="chevron-right"
        size="xs"
        class="text-zinc-400 dark:text-zinc-600"
      />
      <button
        :class="[
          'rounded-md px-2 py-1 transition-colors',
          index === path.length - 1
            ? 'font-medium text-zinc-900 dark:text-white'
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
        ]"
        :disabled="index === path.length - 1"
        @click="emit('navigate', folder.id)"
      >
        {{ folder.name }}
      </button>
    </template>
  </nav>
</template>
