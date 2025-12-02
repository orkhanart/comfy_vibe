<script setup lang="ts">
import { Icon } from '@/components/ui/icon'

export interface ModelItem {
  id: string
  name: string
  type: 'Image' | 'Video' | 'Video + Audio' | 'Audio' | 'Text' | '3D'
  icon?: string
  provider?: string
}

defineProps<{
  model: ModelItem
}>()

const emit = defineEmits<{
  select: [model: ModelItem]
}>()

const typeIcons: Record<string, string> = {
  'Image': 'image',
  'Video': 'video',
  'Video + Audio': 'video',
  'Audio': 'volume-up',
  'Text': 'type',
  '3D': 'box',
}
</script>

<template>
  <button
    class="flex items-center gap-2 rounded-lg bg-zinc-900/60 px-2 py-1.5 transition-colors hover:bg-zinc-800"
    @click="emit('select', model)"
  >
    <div
      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-zinc-700/50 bg-zinc-800"
    >
      <Icon
        v-if="model.icon"
        :name="model.icon"
        size="xs"
        class="text-zinc-400"
      />
      <Icon
        v-else
        :name="typeIcons[model.type] ?? 'star'"
        size="xs"
        class="text-zinc-400"
      />
    </div>
    <span class="truncate text-[11px] text-zinc-400">{{ model.name }}</span>
  </button>
</template>
