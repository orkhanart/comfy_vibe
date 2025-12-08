<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

import { Icon } from '@/components/ui/icon'
import { FlowNode } from '@/components/nodes'
import { useShareStore } from '@/stores/shareStore'
import { useUiStore } from '@/stores/uiStore'
import type { SharedWorkflow } from '@/types/workflowShare'
import { ACCESS_MODE_LABELS, getAccessModeBadgeColor } from '@/types/workflowShare'
import { DEMO_WORKFLOW_NODES, DEMO_WORKFLOW_EDGES } from '@/data/workflowMockData'

const route = useRoute()
const router = useRouter()
const shareStore = useShareStore()
const uiStore = useUiStore()

// State
const isLoading = ref(true)
const sharedWorkflow = ref<SharedWorkflow | null>(null)
const error = ref<'not-found' | 'inactive' | null>(null)

// Get the share code from the route
const shareCode = computed(() => route.params.code as string)

// Computed flags for which modes are allowed
const canOpenLinear = computed(() => {
  if (!sharedWorkflow.value) return false
  return sharedWorkflow.value.accessMode === 'linear' || sharedWorkflow.value.accessMode === 'both'
})

const canOpenWorkflowEditor = computed(() => {
  if (!sharedWorkflow.value) return false
  return sharedWorkflow.value.accessMode === 'workflow' || sharedWorkflow.value.accessMode === 'both'
})

// Vue Flow setup for preview - use unique ID
const nodeTypes = { flowNode: markRaw(FlowNode) }

// Deep clone nodes/edges for each canvas to avoid shared state
const previewNodes = ref(JSON.parse(JSON.stringify(DEMO_WORKFLOW_NODES)))
const previewEdges = ref(JSON.parse(JSON.stringify(DEMO_WORKFLOW_EDGES)))
const bgNodes = ref(JSON.parse(JSON.stringify(DEMO_WORKFLOW_NODES)))
const bgEdges = ref(JSON.parse(JSON.stringify(DEMO_WORKFLOW_EDGES)))

// Use unique IDs for each VueFlow instance
const { fitView, zoomIn, zoomOut, getViewport } = useVueFlow({ id: 'shared-preview' })

// Current zoom percentage
const zoomLevel = ref(75)

// Pattern color based on theme
const patternColor = computed(() => uiStore.themeMode === 'dark' ? '#27272a' : '#e4e4e7')
const bgPatternColor = computed(() => uiStore.themeMode === 'dark' ? '#1f1f23' : '#f4f4f5')

// Fetch shared workflow on mount
onMounted(async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 300))

  const result = shareStore.accessSharedLink(shareCode.value)
  if (result) {
    sharedWorkflow.value = result
  } else {
    error.value = 'not-found'
  }
  isLoading.value = false
})

// Fit view when canvas is ready
function handleCanvasReady() {
  setTimeout(() => {
    fitView({ padding: 0.15, maxZoom: 0.6 })
    zoomLevel.value = Math.round(getViewport().zoom * 100)
  }, 100)
}

function handleZoomIn() {
  zoomIn()
  setTimeout(() => {
    zoomLevel.value = Math.round(getViewport().zoom * 100)
  }, 50)
}

function handleZoomOut() {
  zoomOut()
  setTimeout(() => {
    zoomLevel.value = Math.round(getViewport().zoom * 100)
  }, 50)
}

function handleFitView() {
  fitView({ padding: 0.15 })
  setTimeout(() => {
    zoomLevel.value = Math.round(getViewport().zoom * 100)
  }, 50)
}

// Actions
function openInLinear() {
  if (!sharedWorkflow.value) return
  router.push({
    name: 'linear-mode-v2',
    params: { workflowId: sharedWorkflow.value.workflowId },
    query: { shared: shareCode.value }
  })
}

function openInWorkflowEditor() {
  if (!sharedWorkflow.value) return
  router.push({
    name: 'workflow-editor',
    params: { workflowId: sharedWorkflow.value.workflowId },
    query: { shared: shareCode.value }
  })
}

function forkToLibrary() {
  if (!sharedWorkflow.value) return
  shareStore.forkWorkflow(
    sharedWorkflow.value.workflowId,
    sharedWorkflow.value.name,
    sharedWorkflow.value.sharedBy.id,
    sharedWorkflow.value.sharedBy.name
  )
  router.push({ name: 'workspace-workflows' })
}

function closeModal() {
  router.push({ name: 'workspace-workflows' })
}
</script>

<template>
  <!-- Background: Workflow Editor Preview -->
  <div class="fixed inset-0 z-40 bg-zinc-100 dark:bg-zinc-900">
    <VueFlow
      id="shared-bg"
      v-model:nodes="bgNodes"
      v-model:edges="bgEdges"
      :node-types="nodeTypes"
      :nodes-draggable="false"
      :nodes-connectable="false"
      :elements-selectable="false"
      :pan-on-scroll="false"
      :zoom-on-scroll="false"
      :pan-on-drag="false"
      :prevent-scrolling="true"
      :default-viewport="{ x: 100, y: 50, zoom: 0.4 }"
      class="bg-canvas pointer-events-none opacity-30"
    >
      <Background :pattern-color="bgPatternColor" :gap="20" :size="1" />
    </VueFlow>
  </div>

  <!-- Modal Backdrop -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <!-- Modal Container -->
    <div class="flex h-full max-h-[75vh] w-full max-w-[1600px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-1 items-center justify-center">
        <div class="flex flex-col items-center gap-3">
          <div class="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-white" />
          <p class="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-1 items-center justify-center">
        <div class="flex max-w-xs flex-col items-center gap-4 text-center">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <Icon name="alert-circle" size="lg" class="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 class="text-base font-semibold text-zinc-900 dark:text-white">Link not found</h1>
            <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              This share link is invalid or has been deactivated.
            </p>
          </div>
          <button
            class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            @click="closeModal"
          >
            Go to Workspace
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <template v-else-if="sharedWorkflow">
        <!-- Header -->
        <div class="flex shrink-0 items-center justify-between border-b border-zinc-200 px-5 py-3 dark:border-zinc-700">
          <div class="flex items-center gap-3">
            <h1 class="text-base font-semibold text-zinc-900 dark:text-white">{{ sharedWorkflow.name }}</h1>
            <span
              class="rounded px-1.5 py-0.5 text-[10px] font-medium"
              :class="getAccessModeBadgeColor(sharedWorkflow.accessMode)"
            >
              {{ ACCESS_MODE_LABELS[sharedWorkflow.accessMode] }}
            </span>
            <span class="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
              Read-only
            </span>
          </div>

          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            @click="closeModal"
          >
            <Icon name="x" size="sm" />
          </button>
        </div>

        <!-- Canvas Area -->
        <div class="relative flex-1 overflow-hidden bg-zinc-50 dark:bg-zinc-800/50">
          <VueFlow
            id="shared-preview"
            v-model:nodes="previewNodes"
            v-model:edges="previewEdges"
            :node-types="nodeTypes"
            :nodes-draggable="false"
            :nodes-connectable="false"
            :elements-selectable="false"
            :pan-on-scroll="true"
            :zoom-on-scroll="true"
            :pan-on-drag="true"
            :prevent-scrolling="true"
            :default-viewport="{ x: 0, y: 0, zoom: 0.6 }"
            :min-zoom="0.1"
            :max-zoom="2"
            class="preview-canvas"
            @vue-flow-ready="handleCanvasReady"
          >
            <Background :pattern-color="patternColor" :gap="20" :size="1" />
          </VueFlow>

          <!-- Zoom Controls -->
          <div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            <button
              class="flex h-7 w-7 items-center justify-center rounded text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
              title="Zoom out"
              @click="handleZoomOut"
            >
              <Icon name="minus" size="xs" />
            </button>
            <div class="flex w-12 items-center justify-center text-xs font-medium text-zinc-600 dark:text-zinc-300">
              {{ zoomLevel }}%
            </div>
            <button
              class="flex h-7 w-7 items-center justify-center rounded text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
              title="Zoom in"
              @click="handleZoomIn"
            >
              <Icon name="plus" size="xs" />
            </button>
            <div class="mx-0.5 h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
            <button
              class="flex h-7 w-7 items-center justify-center rounded text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
              title="Fit to view"
              @click="handleFitView"
            >
              <Icon name="expand" size="xs" />
            </button>
          </div>

          <!-- Node Count -->
          <div class="absolute left-4 top-4 flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            <Icon name="cube" size="xs" class="text-zinc-400" />
            <span class="text-xs font-medium text-zinc-600 dark:text-zinc-300">{{ sharedWorkflow.nodeCount }} nodes</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex shrink-0 items-center justify-between border-t border-zinc-200 px-5 py-3 dark:border-zinc-700">
          <!-- Author Info -->
          <div class="flex items-center gap-2">
            <img
              v-if="sharedWorkflow.sharedBy.avatar"
              :src="sharedWorkflow.sharedBy.avatar"
              :alt="sharedWorkflow.sharedBy.name"
              class="h-6 w-6 rounded-full object-cover"
            />
            <div
              v-else
              class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-[10px] font-medium text-white"
            >
              {{ sharedWorkflow.sharedBy.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }}
            </div>
            <span class="text-sm text-zinc-500 dark:text-zinc-400">
              Shared by <span class="font-medium text-zinc-700 dark:text-zinc-300">{{ sharedWorkflow.sharedBy.name }}</span>
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <div class="group relative">
              <button
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                @click="forkToLibrary"
              >
                <Icon name="folder-plus" size="sm" />
              </button>
              <span class="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-zinc-700">
                Fork to Library
              </span>
            </div>
            <button
              v-if="canOpenWorkflowEditor"
              class="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
              @click="openInWorkflowEditor"
            >
              <Icon name="edit" size="xs" />
              Open in Editor
            </button>
            <button
              v-if="canOpenLinear"
              class="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              @click="openInLinear"
            >
              <Icon name="play" size="xs" />
              Run in Linear
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.preview-canvas {
  width: 100%;
  height: 100%;
}

.preview-canvas .vue-flow__node-flowNode {
  background: transparent;
  border: none;
  padding: 0;
  box-shadow: none;
  pointer-events: none;
}

.preview-canvas .vue-flow__edge-path {
  stroke-width: 2;
}

.preview-canvas .vue-flow__handle {
  opacity: 0 !important;
}

.bg-canvas {
  width: 100%;
  height: 100%;
}

.bg-canvas .vue-flow__node-flowNode {
  background: transparent;
  border: none;
  padding: 0;
  box-shadow: none;
  pointer-events: none;
}

.bg-canvas .vue-flow__edge-path {
  stroke-width: 2;
}

.bg-canvas .vue-flow__handle {
  opacity: 0 !important;
}
</style>
