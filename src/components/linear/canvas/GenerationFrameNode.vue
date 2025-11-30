<script setup lang="ts">
import { computed } from 'vue'
import type { GenerationFrameData } from '@/types/linearCanvas'

interface Props {
  id: string
  data: GenerationFrameData
  selected?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  rerun: [id: string]
  download: [id: string]
  delete: [id: string]
  ungroup: [id: string]
  extractImage: [generationId: string, imageIndex: number, imageUrl: string]
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

const statusColor = computed(() => {
  switch (props.data.status) {
    case 'generating':
      return 'bg-blue-500'
    case 'queued':
      return 'bg-amber-500'
    case 'completed':
      return 'bg-emerald-500'
  }
})

const statusText = computed(() => {
  switch (props.data.status) {
    case 'generating':
      return 'Generating'
    case 'queued':
      return 'Queued'
    case 'completed':
      return 'Completed'
  }
})

const gridCols = computed(() => {
  const count = props.data.images.length || props.data.batchSize
  if (count === 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-2'
  return 'grid-cols-2'
})

const truncatedPrompt = computed(() => {
  const maxLength = 60
  if (props.data.prompt.length <= maxLength) return props.data.prompt
  return props.data.prompt.slice(0, maxLength) + '...'
})

const canUngroup = computed(() => props.data.images.length > 0)

// Drag handling for extracting images
function handleDragStart(event: DragEvent, imageUrl: string, index: number): void {
  if (!event.dataTransfer) return
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('application/json', JSON.stringify({
    type: 'extract-image',
    generationId: props.id,
    imageIndex: index,
    imageUrl,
  }))
}

function handleImageClick(event: MouseEvent, imageUrl: string, index: number): void {
  // Emit extract on double-click
  if (event.detail === 2) {
    emit('extractImage', props.id, index, imageUrl)
  }
}
</script>

<template>
  <div
    :class="[
      'generation-frame w-[320px] rounded-lg border bg-zinc-900/95 shadow-lg transition-all',
      selected ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-zinc-700',
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
      <div class="flex items-center gap-2 min-w-0">
        <span
          :class="[
            'h-2 w-2 shrink-0 rounded-full',
            statusColor,
            data.status === 'generating' && 'animate-pulse',
          ]"
        />
        <span class="text-xs font-medium text-zinc-300">{{ statusText }}</span>
        <span class="text-zinc-600">|</span>
        <span class="text-[11px] text-zinc-500">{{ formatTime(data.createdAt) }}</span>
      </div>
      <div class="flex items-center gap-0.5">
        <button
          v-if="canUngroup"
          v-tooltip.top="'Ungroup images'"
          class="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-amber-400"
          @click.stop="emit('ungroup', id)"
        >
          <i class="pi pi-objects-column text-[10px]" />
        </button>
        <button
          v-tooltip.top="'Rerun'"
          class="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          @click.stop="emit('rerun', id)"
        >
          <i class="pi pi-refresh text-[10px]" />
        </button>
        <button
          v-if="data.images.length > 0"
          v-tooltip.top="'Download'"
          class="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          @click.stop="emit('download', id)"
        >
          <i class="pi pi-download text-[10px]" />
        </button>
        <button
          v-tooltip.top="'Delete'"
          class="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-red-400"
          @click.stop="emit('delete', id)"
        >
          <i class="pi pi-trash text-[10px]" />
        </button>
      </div>
    </div>

    <!-- Images Grid -->
    <div class="p-2">
      <!-- Completed: show images (draggable) -->
      <div v-if="data.images.length > 0" :class="['grid gap-1.5', gridCols]">
        <div
          v-for="(img, idx) in data.images"
          :key="idx"
          class="group/img relative aspect-square cursor-grab overflow-hidden rounded bg-zinc-800 transition-transform active:cursor-grabbing active:scale-95"
          draggable="true"
          @dragstart="handleDragStart($event, img, idx)"
          @click="handleImageClick($event, img, idx)"
        >
          <img
            :src="img"
            alt="Generated image"
            class="pointer-events-none h-full w-full object-cover"
          />
          <!-- Drag hint overlay -->
          <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/img:opacity-100">
            <div class="flex flex-col items-center text-white">
              <i class="pi pi-arrows-alt text-sm" />
              <span class="mt-0.5 text-[9px]">Drag to extract</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Generating: show placeholders with spinner -->
      <div
        v-else-if="data.status === 'generating'"
        :class="['grid gap-1.5', gridCols]"
      >
        <div
          v-for="i in data.batchSize"
          :key="i"
          class="flex aspect-square items-center justify-center rounded bg-zinc-800"
        >
          <div class="flex flex-col items-center">
            <i class="pi pi-spin pi-spinner text-lg text-blue-400" />
            <span class="mt-1 text-[10px] text-zinc-500">{{ data.progress ?? 0 }}%</span>
          </div>
        </div>
      </div>

      <!-- Queued: show placeholders with clock -->
      <div v-else-if="data.status === 'queued'" :class="['grid gap-1.5', gridCols]">
        <div
          v-for="i in data.batchSize"
          :key="i"
          class="flex aspect-square items-center justify-center rounded bg-zinc-800"
        >
          <i class="pi pi-clock text-lg text-zinc-600" />
        </div>
      </div>

      <!-- Progress bar for generating -->
      <div v-if="data.status === 'generating'" class="mt-2">
        <div class="h-1 overflow-hidden rounded-full bg-zinc-800">
          <div
            class="h-full rounded-full bg-blue-600 transition-all duration-300"
            :style="{ width: `${data.progress ?? 0}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Footer: Prompt preview -->
    <div class="border-t border-zinc-800 px-3 py-2">
      <p class="text-xs leading-relaxed text-zinc-400">
        {{ truncatedPrompt }}
      </p>
      <div class="mt-1.5 flex items-center gap-1.5 text-[10px] text-zinc-500">
        <span>{{ data.workflow }}</span>
        <span class="text-zinc-700">|</span>
        <span>{{ data.batchSize }} img</span>
        <span class="text-zinc-700">|</span>
        <span>{{ data.parameters.width }}x{{ data.parameters.height }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.generation-frame {
  /* Prevent VueFlow default node styling */
  background: transparent;
}
</style>
