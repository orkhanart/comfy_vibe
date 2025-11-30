<script setup lang="ts">
import { ref, computed, onMounted, watch, markRaw } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

import GenerationFrameNode from './GenerationFrameNode.vue'
import AssetNode from './AssetNode.vue'
import { calculateGridPosition, CANVAS_LAYOUT } from '@/types/linearCanvas'
import type { GenerationItem, AssetNodeData } from '@/types/linearCanvas'
import type { Node } from '@vue-flow/core'

interface Props {
  generations: GenerationItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  rerun: [id: string]
  download: [id: string]
  delete: [id: string]
  reorderImages: [generationId: string, fromIndex: number, toIndex: number]
}>()

// Custom node types
const nodeTypes = {
  generationFrame: markRaw(GenerationFrameNode),
  asset: markRaw(AssetNode),
}

// VueFlow hooks
const { fitView, zoomIn, zoomOut, onNodeClick, onPaneClick, screenToFlowCoordinate } = useVueFlow()

// Selected node tracking
const selectedNodeId = ref<string | null>(null)

// Standalone asset nodes (extracted from frames)
const assetNodes = ref<Node<AssetNodeData>[]>([])

// Track which images have been extracted (generationId:index)
const extractedImages = ref<Set<string>>(new Set())

// Convert generations to VueFlow nodes (filter out extracted images)
const frameNodes = computed<Node[]>(() =>
  props.generations.map((gen, index) => {
    // Filter out extracted images from the generation
    const remainingImages = gen.images.filter((_, imgIdx) =>
      !extractedImages.value.has(`${gen.id}:${imgIdx}`)
    )

    return {
      id: gen.id,
      type: 'generationFrame',
      position: calculateGridPosition(index),
      data: {
        ...gen,
        images: remainingImages,
        batchSize: remainingImages.length || gen.batchSize,
      },
      draggable: true,
      selectable: true,
    }
  }).filter(node => node.data.images.length > 0 || node.data.status !== 'completed')
)

// Combined nodes (frames + assets)
const nodes = computed(() => [...frameNodes.value, ...assetNodes.value])

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
  // Check if it's an asset node
  const assetIndex = assetNodes.value.findIndex(n => n.id === id)
  if (assetIndex !== -1) {
    assetNodes.value.splice(assetIndex, 1)
    return
  }
  emit('delete', id)
}

// Ungroup handler - extract all images from a frame
function handleUngroup(generationId: string): void {
  const gen = props.generations.find(g => g.id === generationId)
  if (!gen || gen.images.length === 0) return

  // Find the frame position
  const frameIndex = props.generations.findIndex(g => g.id === generationId)
  const framePos = calculateGridPosition(frameIndex)

  // Create asset nodes for each image
  gen.images.forEach((imageUrl, index) => {
    const key = `${generationId}:${index}`
    if (extractedImages.value.has(key)) return

    extractedImages.value.add(key)

    const assetId = `asset-${generationId}-${index}-${Date.now()}`
    const col = index % 2
    const row = Math.floor(index / 2)

    assetNodes.value.push({
      id: assetId,
      type: 'asset',
      position: {
        x: framePos.x + CANVAS_LAYOUT.FRAME_WIDTH + CANVAS_LAYOUT.GAP + col * 180,
        y: framePos.y + row * 200,
      },
      data: {
        id: assetId,
        imageUrl,
        sourceGenerationId: generationId,
        sourceIndex: index,
        prompt: gen.prompt,
        seed: gen.parameters.seed,
        width: gen.parameters.width,
        height: gen.parameters.height,
        createdAt: gen.createdAt,
      },
      draggable: true,
      selectable: true,
    })
  })
}

// Extract single image handler
function handleExtractImage(generationId: string, imageIndex: number, imageUrl: string): void {
  const key = `${generationId}:${imageIndex}`
  if (extractedImages.value.has(key)) return

  const gen = props.generations.find(g => g.id === generationId)
  if (!gen) return

  extractedImages.value.add(key)

  // Find position near the frame
  const frameIndex = props.generations.findIndex(g => g.id === generationId)
  const framePos = calculateGridPosition(frameIndex)

  const assetId = `asset-${generationId}-${imageIndex}-${Date.now()}`

  assetNodes.value.push({
    id: assetId,
    type: 'asset',
    position: {
      x: framePos.x + CANVAS_LAYOUT.FRAME_WIDTH + CANVAS_LAYOUT.GAP,
      y: framePos.y + imageIndex * 180,
    },
    data: {
      id: assetId,
      imageUrl,
      sourceGenerationId: generationId,
      sourceIndex: imageIndex,
      prompt: gen.prompt,
      seed: gen.parameters.seed,
      width: gen.parameters.width,
      height: gen.parameters.height,
      createdAt: gen.createdAt,
    },
    draggable: true,
    selectable: true,
  })
}

// Handle drop on canvas (for dragged images)
function handleCanvasDrop(event: DragEvent): void {
  event.preventDefault()
  if (!event.dataTransfer) return

  try {
    const data = JSON.parse(event.dataTransfer.getData('application/json'))
    if (data.type === 'extract-image') {
      // Convert screen coordinates to flow coordinates
      const position = screenToFlowCoordinate({
        x: event.clientX,
        y: event.clientY,
      })

      const key = `${data.generationId}:${data.imageIndex}`
      if (extractedImages.value.has(key)) return

      const gen = props.generations.find(g => g.id === data.generationId)
      if (!gen) return

      extractedImages.value.add(key)

      const assetId = `asset-${data.generationId}-${data.imageIndex}-${Date.now()}`

      assetNodes.value.push({
        id: assetId,
        type: 'asset',
        position,
        data: {
          id: assetId,
          imageUrl: data.imageUrl,
          sourceGenerationId: data.generationId,
          sourceIndex: data.imageIndex,
          prompt: gen.prompt,
          seed: gen.parameters.seed,
          width: gen.parameters.width,
          height: gen.parameters.height,
          createdAt: gen.createdAt,
        },
        draggable: true,
        selectable: true,
      })
    }
  } catch {
    // Invalid JSON, ignore
  }
}

function handleCanvasDragOver(event: DragEvent): void {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

// Asset node handlers
function handleAssetDownload(id: string): void {
  const asset = assetNodes.value.find(n => n.id === id)
  if (!asset) return

  const link = document.createElement('a')
  link.href = asset.data.imageUrl
  link.download = `asset-${id}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Reorder images within a generation
function handleReorderImages(generationId: string, fromIndex: number, toIndex: number): void {
  emit('reorderImages', generationId, fromIndex, toIndex)
}
</script>

<template>
  <div
    class="relative h-full w-full bg-zinc-950"
    @drop="handleCanvasDrop"
    @dragover="handleCanvasDragOver"
  >
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

      <!-- Generation Frame Node -->
      <template #node-generationFrame="nodeProps">
        <GenerationFrameNode
          :id="nodeProps.id"
          :data="nodeProps.data"
          :selected="selectedNodeId === nodeProps.id"
          @rerun="handleRerun"
          @download="handleDownload"
          @delete="handleDelete"
          @ungroup="handleUngroup"
          @extract-image="handleExtractImage"
          @reorder-images="handleReorderImages"
        />
      </template>

      <!-- Asset Node (extracted images) -->
      <template #node-asset="nodeProps">
        <AssetNode
          :id="nodeProps.id"
          :data="nodeProps.data"
          :selected="selectedNodeId === nodeProps.id"
          @download="handleAssetDownload"
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

/* Override default node styles - Generation Frame */
.linear-canvas .vue-flow__node-generationFrame {
  background: transparent;
  border: none;
  padding: 0;
  box-shadow: none;
}

.linear-canvas .vue-flow__node-generationFrame.selected {
  box-shadow: none;
}

/* Override default node styles - Asset Node */
.linear-canvas .vue-flow__node-asset {
  background: transparent;
  border: none;
  padding: 0;
  box-shadow: none;
}

.linear-canvas .vue-flow__node-asset.selected {
  box-shadow: none;
}

/* Hide default handles */
.linear-canvas .vue-flow__handle {
  opacity: 0 !important;
  pointer-events: none;
}
</style>
