<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

import GenerationFrameNode from './GenerationFrameNode.vue'
import { calculateGridPosition } from '@/types/linearCanvas'
import type { GenerationItem } from '@/types/linearCanvas'
import type { Node } from '@vue-flow/core'

interface Props {
  generations: GenerationItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  rerun: [id: string]
  download: [id: string]
  delete: [id: string]
}>()

// Custom node types
const nodeTypes = {
  generationFrame: markRaw(GenerationFrameNode),
}

// VueFlow hooks
const { fitView, zoomIn, zoomOut, onNodeClick, onPaneClick } = useVueFlow()

// Selected node tracking
const selectedNodeId = ref<string | null>(null)

// Convert generations to VueFlow nodes
const nodes = computed<Node[]>(() =>
  props.generations.map((gen, index) => ({
    id: gen.id,
    type: 'generationFrame',
    position: calculateGridPosition(index),
    data: gen,
    draggable: true,
    selectable: true,
  }))
)

// No edges for now (MVP)
const edges = ref([])

// Node selection handling
onNodeClick(({ node }) => {
  selectedNodeId.value = node.id
})

onPaneClick(() => {
  selectedNodeId.value = null
})

// Fit view on mount
onMounted(() => {
  setTimeout(() => {
    fitView({ padding: 0.2, maxZoom: 1 })
  }, 100)
})

// Zoom level display
const zoomLevel = ref(80)

function handleZoomIn(): void {
  zoomIn()
  zoomLevel.value = Math.min(200, zoomLevel.value + 10)
}

function handleZoomOut(): void {
  zoomOut()
  zoomLevel.value = Math.max(20, zoomLevel.value - 10)
}

function handleFitView(): void {
  fitView({ padding: 0.2, maxZoom: 1 })
  zoomLevel.value = 80
}

// Event handlers from nodes
function handleRerun(id: string): void {
  emit('rerun', id)
}

function handleDownload(id: string): void {
  emit('download', id)
}

function handleDelete(id: string): void {
  emit('delete', id)
}
</script>

<template>
  <div class="relative h-full w-full bg-zinc-950">
    <!-- VueFlow Canvas -->
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      :default-viewport="{ x: 0, y: 0, zoom: 0.8 }"
      :min-zoom="0.2"
      :max-zoom="2"
      :snap-to-grid="true"
      :snap-grid="[20, 20]"
      class="linear-canvas"
      @node-click="({ node }) => selectedNodeId = node.id"
    >
      <Background pattern-color="#27272a" :gap="20" :size="1" />

      <!-- Custom node events -->
      <template #node-generationFrame="nodeProps">
        <GenerationFrameNode
          :id="nodeProps.id"
          :data="nodeProps.data"
          :selected="selectedNodeId === nodeProps.id"
          @rerun="handleRerun"
          @download="handleDownload"
          @delete="handleDelete"
        />
      </template>
    </VueFlow>

    <!-- Zoom Controls -->
    <div class="absolute bottom-4 right-4 z-10 flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/90 p-1 backdrop-blur">
      <button
        v-tooltip.top="'Zoom out'"
        class="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        @click="handleZoomOut"
      >
        <i class="pi pi-minus text-xs" />
      </button>
      <span class="w-12 text-center text-[11px] text-zinc-500">{{ zoomLevel }}%</span>
      <button
        v-tooltip.top="'Zoom in'"
        class="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        @click="handleZoomIn"
      >
        <i class="pi pi-plus text-xs" />
      </button>
      <div class="mx-1 h-4 w-px bg-zinc-700" />
      <button
        v-tooltip.top="'Fit to view'"
        class="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        @click="handleFitView"
      >
        <i class="pi pi-expand text-xs" />
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-if="generations.length === 0"
      class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-zinc-500"
    >
      <i class="pi pi-th-large mb-2 text-4xl opacity-50" />
      <span class="text-sm">No generations yet</span>
      <p class="mt-1 text-xs text-zinc-600">
        Start generating to see your creations here
      </p>
    </div>
  </div>
</template>

<style>
.linear-canvas {
  width: 100%;
  height: 100%;
  background-color: #09090b;
}

/* Override default node styles */
.linear-canvas .vue-flow__node-generationFrame {
  background: transparent;
  border: none;
  padding: 0;
  box-shadow: none;
}

.linear-canvas .vue-flow__node-generationFrame.selected {
  box-shadow: none;
}

/* Hide default handles */
.linear-canvas .vue-flow__handle {
  opacity: 0 !important;
  pointer-events: none;
}
</style>
