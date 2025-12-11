<script setup lang="ts">
/**
 * Queue Progress Mockup
 *
 * Simulates a real workflow execution scenario with:
 * - Active queue progress overlay
 * - Multiple running workflows
 * - Real-time progress animation
 */

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Icon } from '@/components/ui/icon'

// Simulate a workflow execution
interface WorkflowExecution {
  id: string
  name: string
  totalNodes: number
  completedNodes: number
  currentNode: string
  currentNodeProgress: number
  status: 'running' | 'queued' | 'completed'
  startedAt: Date
  preview?: string
}

const workflows = ref<WorkflowExecution[]>([
  {
    id: '1',
    name: 'Portrait Enhancement v2',
    totalNodes: 12,
    completedNodes: 7,
    currentNode: 'KSampler',
    currentNodeProgress: 45,
    status: 'running',
    startedAt: new Date(Date.now() - 45000),
  },
  {
    id: '2',
    name: 'Background Removal',
    totalNodes: 8,
    completedNodes: 0,
    currentNode: '',
    currentNodeProgress: 0,
    status: 'queued',
    startedAt: new Date(),
  },
  {
    id: '3',
    name: 'Style Transfer - Anime',
    totalNodes: 15,
    completedNodes: 0,
    currentNode: '',
    currentNodeProgress: 0,
    status: 'queued',
    startedAt: new Date(),
  },
])

const completedWorkflows = ref<WorkflowExecution[]>([])

// Overlay state
const isExpanded = ref(false)
const isHovered = ref(false)

// Computed values
const runningWorkflow = computed(() => workflows.value.find(w => w.status === 'running'))
const queuedWorkflows = computed(() => workflows.value.filter(w => w.status === 'queued'))
const runningCount = computed(() => workflows.value.filter(w => w.status === 'running').length)
const queuedCount = computed(() => queuedWorkflows.value.length)

const totalPercent = computed(() => {
  const w = runningWorkflow.value
  if (!w) return 0
  const nodeProgress = (w.completedNodes / w.totalNodes) * 100
  const currentContribution = (w.currentNodeProgress / 100) * (100 / w.totalNodes)
  return Math.min(100, nodeProgress + currentContribution)
})

const currentNodePercent = computed(() => runningWorkflow.value?.currentNodeProgress ?? 0)
const currentNodeName = computed(() => runningWorkflow.value?.currentNode ?? '')

const elapsedTime = computed(() => {
  const w = runningWorkflow.value
  if (!w) return '0:00'
  const elapsed = Math.floor((Date.now() - w.startedAt.getTime()) / 1000)
  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

// Animation
let animationInterval: ReturnType<typeof setInterval> | null = null
let timeInterval: ReturnType<typeof setInterval> | null = null

const nodeNames = ['Load Image', 'CLIP Text Encode', 'KSampler', 'VAE Decode', 'Save Image', 'Upscale', 'Face Restore']

onMounted(() => {
  // Animate progress
  animationInterval = setInterval(() => {
    const w = runningWorkflow.value
    if (!w) return

    // Update current node progress
    w.currentNodeProgress += Math.random() * 5 + 2

    if (w.currentNodeProgress >= 100) {
      w.currentNodeProgress = 0
      w.completedNodes++

      // Move to next node
      if (w.completedNodes < w.totalNodes) {
        w.currentNode = nodeNames[w.completedNodes % nodeNames.length]
      } else {
        // Workflow completed
        w.status = 'completed'
        w.preview = 'https://placehold.co/64x64/22c55e/fff?text=Done'
        completedWorkflows.value.push({ ...w })

        // Start next queued workflow
        const nextQueued = workflows.value.find(wf => wf.status === 'queued')
        if (nextQueued) {
          nextQueued.status = 'running'
          nextQueued.currentNode = nodeNames[0]
          nextQueued.startedAt = new Date()
        }

        // Remove completed from active list
        workflows.value = workflows.value.filter(wf => wf.status !== 'completed')
      }
    }
  }, 150)

  // Update time display
  timeInterval = setInterval(() => {
    // Force reactivity update for elapsed time
    workflows.value = [...workflows.value]
  }, 1000)
})

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval)
  if (timeInterval) clearInterval(timeInterval)
})

function interruptCurrent() {
  const w = runningWorkflow.value
  if (w) {
    workflows.value = workflows.value.filter(wf => wf.id !== w.id)
    // Start next
    const next = workflows.value.find(wf => wf.status === 'queued')
    if (next) {
      next.status = 'running'
      next.currentNode = nodeNames[0]
      next.startedAt = new Date()
    }
  }
}

function clearQueue() {
  workflows.value = workflows.value.filter(w => w.status === 'running')
}

function addToQueue() {
  const id = Date.now().toString()
  workflows.value.push({
    id,
    name: `New Workflow ${workflows.value.length + 1}`,
    totalNodes: Math.floor(Math.random() * 10) + 5,
    completedNodes: 0,
    currentNode: '',
    currentNodeProgress: 0,
    status: workflows.value.some(w => w.status === 'running') ? 'queued' : 'running',
    startedAt: new Date(),
  })

  // If this is now running, set current node
  const newWf = workflows.value.find(w => w.id === id)
  if (newWf && newWf.status === 'running') {
    newWf.currentNode = nodeNames[0]
  }
}
</script>

<template>
  <div class="min-h-screen bg-charcoal-950">
    <!-- Fake canvas background -->
    <div class="absolute inset-0 opacity-20">
      <div class="grid h-full w-full grid-cols-12 gap-4 p-8">
        <div v-for="i in 24" :key="i" class="rounded-lg border border-dashed border-charcoal-600 bg-charcoal-800/50" />
      </div>
    </div>

    <!-- Header bar -->
    <div class="relative z-10 flex items-center justify-between border-b border-charcoal-600 bg-charcoal-900/90 px-4 py-2 backdrop-blur">
      <div class="flex items-center gap-4">
        <a href="/showcase/activity" class="text-smoke-800 hover:text-white">
          <Icon name="arrow-left" size="sm" />
        </a>
        <h1 class="text-sm font-medium text-white">Queue Progress Demo</h1>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
          @click="addToQueue"
        >
          <Icon name="plus" size="sm" class="mr-1 inline" />
          Queue Workflow
        </button>
      </div>
    </div>

    <!-- Main content area with overlay -->
    <div class="relative p-8">
      <!-- Instructions -->
      <div class="mb-8 rounded-lg border border-charcoal-600 bg-charcoal-800/80 p-4 backdrop-blur">
        <h2 class="mb-2 text-sm font-semibold text-white">Scenario: Batch Image Processing</h2>
        <p class="text-xs text-smoke-800">
          Watch the queue progress overlay as workflows execute. Hover over the overlay to see controls.
          Click "Queue Workflow" to add more jobs. The overlay shows real-time progress with dual progress bars.
        </p>
      </div>

      <!-- Completed results grid -->
      <div v-if="completedWorkflows.length > 0" class="mb-8">
        <h3 class="mb-3 text-sm font-medium text-white">Completed ({{ completedWorkflows.length }})</h3>
        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="wf in completedWorkflows"
            :key="wf.id"
            class="flex items-center gap-3 rounded-lg border border-charcoal-600 bg-charcoal-800 p-3"
          >
            <div class="h-12 w-12 overflow-hidden rounded bg-emerald-500/20">
              <img v-if="wf.preview" :src="wf.preview" class="h-full w-full object-cover" />
            </div>
            <div class="flex-1">
              <p class="text-sm text-white">{{ wf.name }}</p>
              <p class="text-xs text-emerald-400">Completed</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Queue Progress Overlay (positioned like in real app) -->
      <div class="fixed bottom-4 right-4 z-50 w-[350px]">
        <div
          v-if="runningWorkflow || queuedCount > 0"
          class="flex flex-col overflow-hidden rounded-lg border transition-colors duration-200"
          :class="isHovered || isExpanded
            ? 'border-charcoal-400 bg-charcoal-800 shadow-lg'
            : 'border-transparent bg-charcoal-800/80'"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
        >
          <!-- Expanded view -->
          <template v-if="isExpanded">
            <div class="flex items-center justify-between border-b border-charcoal-600 p-3">
              <span class="text-sm font-medium text-white">
                {{ runningCount + queuedCount }} Active Jobs
              </span>
              <button class="text-smoke-800 hover:text-white" @click="isExpanded = false">
                <Icon name="chevron-down" size="sm" />
              </button>
            </div>

            <div class="max-h-80 overflow-y-auto p-2">
              <!-- Running -->
              <div
                v-if="runningWorkflow"
                class="relative mb-2 overflow-hidden rounded-lg border border-charcoal-500 bg-charcoal-600 p-2"
              >
                <div class="absolute inset-0">
                  <div
                    class="h-full bg-blue-500/20 transition-[width]"
                    :style="{ width: `${totalPercent}%` }"
                  />
                </div>
                <div class="relative z-10 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Icon name="loader-2" size="sm" class="animate-spin text-blue-400" />
                    <span class="text-xs text-white">{{ runningWorkflow.name }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-smoke-800">{{ Math.round(totalPercent) }}%</span>
                    <button
                      class="flex h-5 w-5 items-center justify-center rounded bg-red-500/20 hover:bg-red-500/30"
                      @click="interruptCurrent"
                    >
                      <Icon name="x" size="xs" class="text-white" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Queued -->
              <div
                v-for="wf in queuedWorkflows"
                :key="wf.id"
                class="mb-2 flex items-center justify-between rounded-lg border border-charcoal-600 bg-charcoal-600 p-2"
              >
                <div class="flex items-center gap-2">
                  <Icon name="clock" size="sm" class="text-yellow-400" />
                  <span class="text-xs text-white">{{ wf.name }}</span>
                </div>
                <span class="text-xs text-smoke-800">Queued</span>
              </div>
            </div>
          </template>

          <!-- Collapsed active view -->
          <template v-else-if="runningWorkflow">
            <div class="flex flex-col gap-3 p-3">
              <!-- Progress bars -->
              <div class="flex flex-col gap-1">
                <div class="relative h-2 w-full overflow-hidden rounded-full border border-charcoal-500 bg-charcoal-600">
                  <div
                    class="absolute inset-0 h-full rounded-full bg-blue-500/30 transition-[width]"
                    :style="{ width: `${totalPercent}%` }"
                  />
                  <div
                    class="absolute inset-0 h-full rounded-full bg-blue-500 transition-[width]"
                    :style="{ width: `${currentNodePercent}%` }"
                  />
                </div>
                <div class="flex items-start justify-between text-xs">
                  <div class="flex items-center gap-1 text-white opacity-90">
                    Total: <span class="font-bold">{{ Math.round(totalPercent) }}%</span>
                    <span class="ml-2 text-smoke-800">{{ elapsedTime }}</span>
                  </div>
                  <div class="flex items-center gap-1 text-smoke-800">
                    <span>{{ currentNodeName }}</span>
                    <span>{{ Math.round(currentNodePercent) }}%</span>
                  </div>
                </div>
              </div>

              <!-- Bottom row (visible on hover) -->
              <div
                class="flex items-center justify-between gap-4 text-xs text-white transition-opacity duration-200"
                :class="isHovered ? 'opacity-100' : 'opacity-0'"
              >
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2">
                    <span class="opacity-90">
                      <span class="font-bold">{{ runningCount }}</span>
                      <span class="ml-1">Running</span>
                    </span>
                    <button
                      class="flex h-6 w-6 items-center justify-center rounded bg-red-500/20 hover:bg-red-500/30"
                      @click="interruptCurrent"
                    >
                      <Icon name="x" size="sm" class="text-white" />
                    </button>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="opacity-90">
                      <span class="font-bold">{{ queuedCount }}</span>
                      <span class="ml-1">Queued</span>
                    </span>
                    <button
                      v-if="queuedCount > 0"
                      class="flex h-6 w-6 items-center justify-center rounded bg-charcoal-500 hover:bg-red-500/20"
                      @click="clearQueue"
                    >
                      <Icon name="list-x" size="sm" class="text-white" />
                    </button>
                  </div>
                </div>
                <button
                  class="h-6 rounded bg-charcoal-500 px-3 text-xs hover:bg-charcoal-400"
                  @click="isExpanded = true"
                >
                  View All
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- Empty state / Completion summary -->
        <div
          v-else-if="completedWorkflows.length > 0"
          class="rounded-lg border border-charcoal-400 bg-charcoal-800 p-2"
        >
          <button class="flex w-full items-center justify-between gap-3 text-left">
            <span class="inline-flex items-center gap-2">
              <span class="relative inline-flex h-6 items-center">
                <span
                  v-for="(wf, i) in completedWorkflows.slice(0, 3)"
                  :key="wf.id"
                  class="inline-block h-6 w-6 overflow-hidden rounded bg-emerald-500/20"
                  :style="{ marginLeft: i === 0 ? '0' : '-12px' }"
                >
                  <img v-if="wf.preview" :src="wf.preview" class="h-full w-full object-cover" />
                </span>
              </span>
              <span class="text-sm text-white">
                <span class="font-bold">{{ completedWorkflows.length }}</span> jobs completed
              </span>
            </span>
            <Icon name="chevron-down" size="sm" class="text-smoke-800" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
