<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, markRaw } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

import { Icon } from '@/components/ui/icon'
import { FlowNode } from '@/components/nodes'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { DEMO_WORKFLOW_NODES, DEMO_WORKFLOW_EDGES } from '@/data/workflowMockData'

// States
const selectedView = ref<'creator' | 'consumer'>('creator')
const isPublished = ref(false)
const hasUnpublishedChanges = ref(false)
const isDialogOpen = ref(true)
const showNsfwWarning = ref(true)
const linkCopied = ref(false)
const includedExpanded = ref(false)

// Mock workflow data
const mockWorkflow = {
  id: 'wf-1',
  name: 'Portrait Generator Pro',
  description: 'High-quality portrait generation with SDXL and face enhancement',
  author: 'Alice Chen',
  authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
  nodeCount: 18,
  publishedUrl: 'https://comfy.org/w/abc123xyz',
  publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  lastEditedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
}

// Mock requirements
const requirements = [
  { name: 'SDXL Base 1.0', type: 'Checkpoint', hasIt: true },
  { name: 'SDXL VAE', type: 'VAE', hasIt: true },
  { name: 'ControlNet Canny', type: 'ControlNet', hasIt: false },
  { name: 'IPAdapter FaceID', type: 'IPAdapter', hasIt: true },
]

// Mock included content
const includedContent = ref({
  models: [
    { name: 'SDXL Base 1.0', size: '6.94 GB', type: 'Checkpoint', included: true },
    { name: 'SDXL VAE', size: '335 MB', type: 'VAE', included: true },
    { name: 'ControlNet Canny', size: '1.45 GB', type: 'ControlNet', included: true },
  ],
  files: [
    { name: 'input_portrait.png', size: '2.4 MB', type: 'Image', included: true },
    { name: 'style_reference.jpg', size: '856 KB', type: 'Image', included: false },
  ],
})

const includedItemsCount = computed(() => {
  return includedContent.value.models.filter(m => m.included).length +
         includedContent.value.files.filter(f => f.included).length
})

const totalItemsCount = computed(() => {
  return includedContent.value.models.length + includedContent.value.files.length
})

const publishedDate = computed(() => {
  return mockWorkflow.publishedAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})

// VueFlow setup
const nodeTypes = { flowNode: markRaw(FlowNode) }
const previewNodes = ref(JSON.parse(JSON.stringify(DEMO_WORKFLOW_NODES)))
const previewEdges = ref(JSON.parse(JSON.stringify(DEMO_WORKFLOW_EDGES)))
const bgNodes = ref(JSON.parse(JSON.stringify(DEMO_WORKFLOW_NODES)))
const bgEdges = ref(JSON.parse(JSON.stringify(DEMO_WORKFLOW_EDGES)))

const { fitView, zoomIn, zoomOut, getViewport } = useVueFlow({ id: 'consumer-preview' })
const zoomLevel = ref(75)
const patternColor = '#27272a'
const bgPatternColor = '#1f1f23'

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

function publish() {
  isPublished.value = true
  hasUnpublishedChanges.value = false
}

function republish() {
  hasUnpublishedChanges.value = false
}

function unpublish() {
  isPublished.value = false
  hasUnpublishedChanges.value = false
}

function simulateEdit() {
  if (isPublished.value) {
    hasUnpublishedChanges.value = true
  }
}

function copyUrl() {
  navigator.clipboard.writeText(mockWorkflow.publishedUrl)
  linkCopied.value = true
  setTimeout(() => {
    linkCopied.value = false
  }, 2000)
}

function dismissNsfwWarning() {
  showNsfwWarning.value = false
}

// Keyboard navigation
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    selectedView.value = selectedView.value === 'creator' ? 'consumer' : 'creator'
    if (selectedView.value === 'consumer') {
      showNsfwWarning.value = true
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="relative flex h-screen w-screen flex-col overflow-hidden bg-zinc-900">
    <!-- Header Controls -->
    <div class="relative z-50 border-b border-zinc-800 bg-zinc-900 px-4 py-3">
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-zinc-400">View as:</span>
        <div class="flex gap-1">
          <button
            class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            :class="selectedView === 'creator'
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'"
            @click="selectedView = 'creator'"
          >
            Creator (User A)
          </button>
          <button
            class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            :class="selectedView === 'consumer'
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'"
            @click="selectedView = 'consumer'; showNsfwWarning = true"
          >
            Consumer (User B)
          </button>
        </div>

        <span class="text-xs text-zinc-600">← → to switch</span>

        <!-- State Controls (Creator only) -->
        <div v-if="selectedView === 'creator'" class="ml-auto flex items-center gap-2">
          <span class="text-xs text-zinc-500">State:</span>
          <button
            class="rounded px-2 py-1 text-xs transition-colors"
            :class="!isPublished ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:bg-zinc-800'"
            @click="isPublished = false; hasUnpublishedChanges = false"
          >
            Draft
          </button>
          <button
            class="rounded px-2 py-1 text-xs transition-colors"
            :class="isPublished && !hasUnpublishedChanges ? 'bg-green-600 text-white' : 'text-zinc-500 hover:bg-zinc-800'"
            @click="isPublished = true; hasUnpublishedChanges = false"
          >
            Published
          </button>
          <button
            class="rounded px-2 py-1 text-xs transition-colors"
            :class="isPublished && hasUnpublishedChanges ? 'bg-amber-600 text-white' : 'text-zinc-500 hover:bg-zinc-800'"
            @click="isPublished = true; hasUnpublishedChanges = true"
          >
            Changed
          </button>
        </div>

        <button
          v-if="!isDialogOpen && selectedView === 'creator'"
          class="ml-auto rounded-md bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700"
          @click="isDialogOpen = true"
        >
          Open Dialog
        </button>
      </div>
    </div>

    <!-- Creator View: Publish Dialog -->
    <Dialog v-if="selectedView === 'creator'" :open="isDialogOpen" @update:open="isDialogOpen = $event">
      <DialogContent class="max-w-[480px] gap-0 p-0">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <div class="flex items-center gap-2">
            <h2 class="text-base font-semibold text-zinc-900 dark:text-foreground">
              Publish Workflow
            </h2>
            <span
              v-if="isPublished"
              class="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
              :class="hasUnpublishedChanges
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-green-500/20 text-green-400'"
            >
              <span class="h-1.5 w-1.5 rounded-full" :class="hasUnpublishedChanges ? 'bg-amber-400' : 'bg-green-400'" />
              {{ hasUnpublishedChanges ? 'Changes pending' : 'Published' }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <!-- Workflow Info -->
          <div class="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div class="flex items-start gap-3 p-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-700">
                <Icon name="workflow" size="lg" class="text-zinc-500" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-medium text-zinc-900 dark:text-foreground">{{ mockWorkflow.name }}</h3>
                <p class="mt-0.5 text-xs text-zinc-500">{{ mockWorkflow.nodeCount }} nodes</p>
              </div>
            </div>

            <!-- What's Included Dropdown -->
            <div class="border-t border-zinc-200 dark:border-zinc-700">
              <button
                class="flex w-full items-center justify-between px-3 py-2.5"
                @click="includedExpanded = !includedExpanded"
              >
                <div class="flex items-center gap-2">
                  <Icon name="archive" size="sm" class="text-zinc-400" />
                  <span class="text-xs font-medium text-zinc-600 dark:text-zinc-400">What's included</span>
                  <span class="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                    {{ includedItemsCount }}/{{ totalItemsCount }} items
                  </span>
                </div>
                <Icon
                  name="chevron-down"
                  size="sm"
                  class="text-zinc-400 transition-transform"
                  :class="{ 'rotate-180': includedExpanded }"
                />
              </button>

              <!-- Expanded Content -->
              <div v-if="includedExpanded" class="border-t border-zinc-200 px-3 py-2 dark:border-zinc-700">
                <!-- Models -->
                <div class="mb-2">
                  <p class="mb-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                    Models ({{ includedContent.models.filter(m => m.included).length }}/{{ includedContent.models.length }})
                  </p>
                  <div class="space-y-0.5">
                    <label
                      v-for="model in includedContent.models"
                      :key="model.name"
                      class="flex cursor-pointer items-center justify-between rounded px-1 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
                    >
                      <div class="flex items-center gap-2">
                        <input
                          v-model="model.included"
                          type="checkbox"
                          class="h-3.5 w-3.5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
                        />
                        <Icon name="box" size="xs" class="text-purple-500" />
                        <span
                          class="text-xs text-zinc-700 dark:text-zinc-300"
                          :class="{ 'text-zinc-400 line-through': !model.included }"
                        >{{ model.name }}</span>
                      </div>
                      <span class="text-[10px] text-zinc-400">{{ model.size }}</span>
                    </label>
                  </div>
                </div>

                <!-- Files -->
                <div>
                  <p class="mb-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                    Imported Files ({{ includedContent.files.filter(f => f.included).length }}/{{ includedContent.files.length }})
                  </p>
                  <div class="space-y-0.5">
                    <label
                      v-for="file in includedContent.files"
                      :key="file.name"
                      class="flex cursor-pointer items-center justify-between rounded px-1 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
                    >
                      <div class="flex items-center gap-2">
                        <input
                          v-model="file.included"
                          type="checkbox"
                          class="h-3.5 w-3.5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
                        />
                        <Icon name="image" size="xs" class="text-green-500" />
                        <span
                          class="text-xs text-zinc-700 dark:text-zinc-300"
                          :class="{ 'text-zinc-400 line-through': !file.included }"
                        >{{ file.name }}</span>
                      </div>
                      <span class="text-[10px] text-zinc-400">{{ file.size }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Not Published State -->
          <template v-if="!isPublished">
            <div class="mb-4 flex items-start gap-3 rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800/80">
              <Icon name="info-circle" size="sm" class="mt-0.5 shrink-0 text-zinc-400" />
              <div>
                <p class="text-sm text-zinc-700 dark:text-zinc-300">
                  This workflow is private
                </p>
                <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                  Publish to create a shareable link. Anyone with the link can view and fork.
                </p>
              </div>
            </div>

            <button
              class="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              @click="publish"
            >
              Publish Workflow
            </button>
          </template>

          <!-- Published State -->
          <template v-else>
            <!-- Published URL -->
            <div class="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
              <div class="flex items-center gap-2">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-200 dark:bg-zinc-700">
                  <Icon name="link" size="sm" class="text-zinc-500" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm text-zinc-600 dark:text-zinc-300">{{ mockWorkflow.publishedUrl }}</p>
                  <p class="text-[10px] text-zinc-400">Published {{ publishedDate }}</p>
                </div>
                <button
                  class="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                  :class="linkCopied
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'"
                  @click="copyUrl"
                >
                  {{ linkCopied ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>

            <!-- Unpublished Changes -->
            <div v-if="hasUnpublishedChanges" class="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
              <div class="flex items-start gap-2">
                <Icon name="exclamation-circle" size="sm" class="mt-0.5 shrink-0 text-amber-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-amber-300">Unpublished changes</p>
                  <p class="mt-0.5 text-xs text-amber-400/80">
                    Your edits aren't visible to others yet.
                  </p>
                </div>
              </div>
              <button
                class="mt-3 w-full rounded-lg bg-amber-600 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500"
                @click="republish"
              >
                Publish Changes
              </button>
            </div>

            <!-- Simulate Edit -->
            <button
              v-if="!hasUnpublishedChanges"
              class="mb-4 w-full rounded-lg border border-dashed border-zinc-600 py-2 text-xs text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-400"
              @click="simulateEdit"
            >
              (Click to simulate editing...)
            </button>

            <!-- Unpublish -->
            <button
              class="flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
              @click="unpublish"
            >
              <Icon name="x" size="sm" />
              Unpublish
            </button>
          </template>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Consumer View: Full Workflow Preview -->
    <template v-if="selectedView === 'consumer'">
      <!-- Background Workflow -->
      <div class="fixed inset-0 z-0 bg-zinc-900">
        <VueFlow
          id="consumer-bg"
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

      <!-- NSFW Warning Modal -->
      <div v-if="showNsfwWarning" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div class="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-800 p-5 shadow-2xl">
          <div class="mb-4 flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/20">
              <Icon name="exclamation-triangle" size="lg" class="text-amber-400" />
            </div>
            <h2 class="text-base font-semibold text-white">Content Warning</h2>
          </div>

          <p class="mb-4 text-sm text-zinc-400">
            This workflow may generate NSFW content. By continuing you confirm:
          </p>

          <ul class="mb-5 space-y-2 text-sm text-zinc-400">
            <li class="flex items-center gap-2">
              <Icon name="check" size="xs" class="text-zinc-500" />
              You are of legal age
            </li>
            <li class="flex items-center gap-2">
              <Icon name="check" size="xs" class="text-zinc-500" />
              You accept responsibility for generated content
            </li>
          </ul>

          <div class="flex gap-2">
            <button class="flex-1 rounded-lg border border-zinc-600 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700">
              Go Back
            </button>
            <button
              class="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              @click="dismissNsfwWarning"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <!-- Workflow Preview Modal -->
      <div v-else class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div class="flex h-full max-h-[80vh] w-full max-w-[1400px] flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl">
          <!-- Header -->
          <div class="flex shrink-0 items-center justify-between border-b border-zinc-700 px-5 py-3">
            <div class="flex items-center gap-3">
              <h1 class="text-base font-semibold text-white">{{ mockWorkflow.name }}</h1>
              <span class="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                View & Fork
              </span>
              <span class="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
                Read-only
              </span>
            </div>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            >
              <Icon name="x" size="sm" />
            </button>
          </div>

          <!-- Canvas -->
          <div class="relative flex-1 overflow-hidden bg-zinc-800/50">
            <VueFlow
              id="consumer-preview"
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
            <div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-lg border border-zinc-700 bg-zinc-800 p-1 shadow-lg">
              <button
                class="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
                @click="handleZoomOut"
              >
                <Icon name="minus" size="xs" />
              </button>
              <div class="flex w-12 items-center justify-center text-xs font-medium text-zinc-300">
                {{ zoomLevel }}%
              </div>
              <button
                class="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
                @click="handleZoomIn"
              >
                <Icon name="plus" size="xs" />
              </button>
              <div class="mx-0.5 h-4 w-px bg-zinc-700" />
              <button
                class="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
                @click="handleFitView"
              >
                <Icon name="expand" size="xs" />
              </button>
            </div>

            <!-- Node Count -->
            <div class="absolute left-4 top-4 flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 shadow-lg">
              <Icon name="cube" size="xs" class="text-zinc-400" />
              <span class="text-xs font-medium text-zinc-300">{{ mockWorkflow.nodeCount }} nodes</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex shrink-0 items-center justify-between border-t border-zinc-700 px-5 py-3">
            <!-- Author Info -->
            <div class="flex items-center gap-2">
              <img
                :src="mockWorkflow.authorAvatar"
                :alt="mockWorkflow.author"
                class="h-6 w-6 rounded-full object-cover"
              />
              <span class="text-sm text-zinc-400">
                Published by <span class="font-medium text-zinc-200">{{ mockWorkflow.author }}</span>
              </span>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <button class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-800 text-zinc-300 transition-colors hover:bg-zinc-700">
                <Icon name="folder-plus" size="sm" />
              </button>
              <button class="flex items-center gap-1.5 rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700">
                <Icon name="edit" size="xs" />
                Open in Editor
              </button>
              <button class="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-500">
                <Icon name="play" size="xs" />
                Run in Linear
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
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
