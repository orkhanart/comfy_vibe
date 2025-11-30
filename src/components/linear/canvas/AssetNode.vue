<script setup lang="ts">
import { computed } from 'vue'
import type { AssetNodeData } from '@/types/linearCanvas'

interface Props {
  id: string
  data: AssetNodeData
  selected?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  download: [id: string]
  delete: [id: string]
}>()

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

const sizeLabel = computed(() => `${props.data.width}x${props.data.height}`)
</script>

<template>
  <div
    :class="[
      'asset-node group w-[160px] rounded-lg border bg-zinc-900/95 shadow-lg transition-all',
      selected ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-zinc-700 hover:border-zinc-600',
    ]"
  >
    <!-- Image -->
    <div class="relative aspect-square overflow-hidden rounded-t-lg bg-zinc-800">
      <img
        :src="data.imageUrl"
        alt="Asset"
        class="h-full w-full object-cover"
        draggable="false"
      />

      <!-- Hover overlay with actions -->
      <div class="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          v-tooltip.top="'Download'"
          class="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          @click.stop="emit('download', id)"
        >
          <i class="pi pi-download text-xs" />
        </button>
        <button
          v-tooltip.top="'Delete'"
          class="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-red-500/50"
          @click.stop="emit('delete', id)"
        >
          <i class="pi pi-trash text-xs" />
        </button>
      </div>
    </div>

    <!-- Footer info -->
    <div class="px-2 py-1.5">
      <div class="flex items-center justify-between text-[10px] text-zinc-500">
        <span>{{ sizeLabel }}</span>
        <span>{{ formatTime(data.createdAt) }}</span>
      </div>
      <p v-if="data.seed" class="mt-0.5 truncate text-[10px] text-zinc-600">
        Seed: {{ data.seed }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.asset-node {
  background: transparent;
}
</style>
