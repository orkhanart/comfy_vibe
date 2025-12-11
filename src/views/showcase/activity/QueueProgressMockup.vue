<script setup lang="ts">
/**
 * Queue Progress Mockup
 *
 * Simulates the real ComfyUI queue layout:
 * - Run button + history toggle in top-right actionbar
 * - QueueProgressOverlay below actionbar with 3 states:
 *   - Active: dual progress bars
 *   - Expanded: full job queue with filters, groups, actions
 *   - Empty: completion summary banner
 */

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Icon } from '@/components/ui/icon'

// Types
type JobState = 'pending' | 'running' | 'completed' | 'failed'
type FilterTab = 'all' | 'active' | 'completed' | 'failed'

interface Job {
  id: string
  workflowId: string
  workflowName: string
  state: JobState
  totalNodes: number
  completedNodes: number
  currentNode: string
  currentNodeProgress: number
  createdAt: Date
  completedAt?: Date
  preview?: string
  error?: string
}

// Mock job data
const jobs = ref<Job[]>([
  {
    id: 'job-1',
    workflowId: 'wf-1',
    workflowName: 'Portrait Enhancement v2',
    state: 'running',
    totalNodes: 12,
    completedNodes: 7,
    currentNode: 'KSampler',
    currentNodeProgress: 45,
    createdAt: new Date(Date.now() - 45000),
  },
  {
    id: 'job-2',
    workflowId: 'wf-1',
    workflowName: 'Portrait Enhancement v2',
    state: 'pending',
    totalNodes: 12,
    completedNodes: 0,
    currentNode: '',
    currentNodeProgress: 0,
    createdAt: new Date(Date.now() - 30000),
  },
  {
    id: 'job-3',
    workflowId: 'wf-2',
    workflowName: 'Background Removal',
    state: 'pending',
    totalNodes: 8,
    completedNodes: 0,
    currentNode: '',
    currentNodeProgress: 0,
    createdAt: new Date(Date.now() - 20000),
  },
])

const completedJobs = ref<Job[]>([
  {
    id: 'job-0',
    workflowId: 'wf-1',
    workflowName: 'Portrait Enhancement v2',
    state: 'completed',
    totalNodes: 12,
    completedNodes: 12,
    currentNode: '',
    currentNodeProgress: 100,
    createdAt: new Date(Date.now() - 120000),
    completedAt: new Date(Date.now() - 60000),
    preview: 'https://placehold.co/48x48/22c55e/fff?text=1',
  },
])

// UI state
const isExpanded = ref(false)
const isHovered = ref(false)
const activeTab = ref<FilterTab>('all')
const workflowFilter = ref<string>('all')
const hoveredJobId = ref<string | null>(null)
const contextMenuJobId = ref<string | null>(null)

// Computed
const runningJob = computed(() => jobs.value.find(j => j.state === 'running'))
const pendingJobs = computed(() => jobs.value.filter(j => j.state === 'pending'))
const runningCount = computed(() => jobs.value.filter(j => j.state === 'running').length)
const queuedCount = computed(() => pendingJobs.value.length)

const allJobs = computed(() => [...jobs.value, ...completedJobs.value])

const totalPercent = computed(() => {
  const job = runningJob.value
  if (!job) return 0
  const nodeProgress = (job.completedNodes / job.totalNodes) * 100
  const currentContribution = (job.currentNodeProgress / 100) * (100 / job.totalNodes)
  return Math.min(100, nodeProgress + currentContribution)
})

const currentNodePercent = computed(() => runningJob.value?.currentNodeProgress ?? 0)
const currentNodeName = computed(() => runningJob.value?.currentNode ?? '')

const uniqueWorkflows = computed(() => {
  const seen = new Set<string>()
  return allJobs.value.filter(j => {
    if (seen.has(j.workflowId)) return false
    seen.add(j.workflowId)
    return true
  }).map(j => ({ id: j.workflowId, name: j.workflowName }))
})

const filteredJobs = computed(() => {
  return allJobs.value.filter(job => {
    if (activeTab.value === 'active' && !['running', 'pending'].includes(job.state)) return false
    if (activeTab.value === 'completed' && job.state !== 'completed') return false
    if (activeTab.value === 'failed' && job.state !== 'failed') return false
    if (workflowFilter.value !== 'all' && job.workflowId !== workflowFilter.value) return false
    return true
  })
})

const groupedJobs = computed(() => {
  const groups: Record<string, Job[]> = {}
  filteredJobs.value.forEach(job => {
    if (!groups[job.workflowId]) {
      groups[job.workflowId] = []
    }
    groups[job.workflowId].push(job)
  })
  return Object.entries(groups).map(([workflowId, jobList]) => ({
    workflowId,
    workflowName: jobList[0].workflowName,
    jobs: jobList,
  }))
})

const hasActiveJobs = computed(() => runningCount.value > 0 || queuedCount.value > 0)
const showOverlay = computed(() => hasActiveJobs.value || completedJobs.value.length > 0)

// Animation
const nodeNames = ['Load Image', 'CLIP Text Encode', 'KSampler', 'VAE Decode', 'Save Image', 'Upscale', 'Face Restore']
let animationInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  animationInterval = setInterval(() => {
    const job = runningJob.value
    if (!job) return

    job.currentNodeProgress += Math.random() * 5 + 2

    if (job.currentNodeProgress >= 100) {
      job.currentNodeProgress = 0
      job.completedNodes++

      if (job.completedNodes < job.totalNodes) {
        job.currentNode = nodeNames[job.completedNodes % nodeNames.length]
      } else {
        // Job completed
        job.state = 'completed'
        job.completedAt = new Date()
        job.preview = `https://placehold.co/48x48/22c55e/fff?text=${completedJobs.value.length + 1}`

        // Move to completed
        completedJobs.value.unshift({ ...job })
        jobs.value = jobs.value.filter(j => j.id !== job.id)

        // Start next pending
        const next = jobs.value.find(j => j.state === 'pending')
        if (next) {
          next.state = 'running'
          next.currentNode = nodeNames[0]
        }
      }
    }
  }, 150)
})

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval)
})

// Actions
function addToQueue() {
  const id = `job-${Date.now()}`
  const isRunning = !runningJob.value
  jobs.value.push({
    id,
    workflowId: 'wf-1',
    workflowName: 'Portrait Enhancement v2',
    state: isRunning ? 'running' : 'pending',
    totalNodes: Math.floor(Math.random() * 8) + 6,
    completedNodes: 0,
    currentNode: isRunning ? nodeNames[0] : '',
    currentNodeProgress: 0,
    createdAt: new Date(),
  })
}

function interruptCurrent() {
  const job = runningJob.value
  if (job) {
    jobs.value = jobs.value.filter(j => j.id !== job.id)
    const next = jobs.value.find(j => j.state === 'pending')
    if (next) {
      next.state = 'running'
      next.currentNode = nodeNames[0]
    }
  }
}

function clearQueue() {
  jobs.value = jobs.value.filter(j => j.state === 'running')
}

function clearHistory() {
  completedJobs.value = []
}

function cancelJob(jobId: string) {
  jobs.value = jobs.value.filter(j => j.id !== jobId)
  contextMenuJobId.value = null
}

function deleteJob(jobId: string) {
  jobs.value = jobs.value.filter(j => j.id !== jobId)
  completedJobs.value = completedJobs.value.filter(j => j.id !== jobId)
  contextMenuJobId.value = null
}

function formatTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function iconForState(state: JobState): string {
  switch (state) {
    case 'pending': return 'clock'
    case 'running': return 'loader-2'
    case 'completed': return 'check'
    case 'failed': return 'x-circle'
  }
}

function colorForState(state: JobState): string {
  switch (state) {
    case 'pending': return 'text-yellow-400'
    case 'running': return 'text-blue-400'
    case 'completed': return 'text-emerald-400'
    case 'failed': return 'text-red-400'
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

    <!-- Header bar with Run section + Queue Overlay (like original ComfyUI TopMenuSection) -->
    <div class="relative z-10 flex items-start justify-between border-b border-charcoal-600 bg-charcoal-900/90 px-4 py-2 backdrop-blur">
      <!-- Left: Back + Title -->
      <div class="flex items-center gap-4 pt-2">
        <a href="/showcase/activity" class="text-smoke-800 hover:text-white">
          <Icon name="arrow-left" size="sm" />
        </a>
        <h1 class="text-sm font-medium text-white">Queue Progress Demo</h1>
      </div>

      <!-- Right: Actionbar + Queue Overlay (matching TopMenuSection.vue layout) -->
      <div class="flex flex-col items-end gap-1">
        <!-- Actionbar container (Run button + history toggle) -->
        <div class="flex h-12 items-center gap-2 rounded-lg border border-charcoal-600 bg-charcoal-800 px-3 shadow-lg">
          <button
            class="flex items-center gap-2 rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            @click="addToQueue"
          >
            <Icon name="play" size="sm" />
            Run
          </button>
          <div class="h-6 w-px bg-charcoal-600" />
          <button
            class="relative flex h-8 w-8 items-center justify-center rounded text-smoke-800 transition-colors hover:bg-charcoal-600 hover:text-white"
            :class="isExpanded ? 'bg-charcoal-500 text-white' : ''"
            @click="isExpanded = !isExpanded"
          >
            <Icon name="history" size="sm" />
            <span
              v-if="queuedCount > 0"
              class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-medium text-white"
            >
              {{ queuedCount }}
            </span>
          </button>
        </div>

        <!-- Queue Progress Overlay (directly below actionbar, w-[350px] like original) -->
        <div
          v-if="showOverlay"
          class="flex max-h-[60vh] w-[350px] flex-col overflow-hidden rounded-lg border transition-colors duration-200"
          :class="isHovered || isExpanded
            ? 'border-charcoal-400 bg-charcoal-800 shadow-lg'
            : 'border-transparent bg-charcoal-800/80'"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
        >
          <!-- EXPANDED: Full Job Queue -->
          <template v-if="isExpanded">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-charcoal-600 px-3 py-2">
              <span class="text-sm font-medium text-white">
                {{ hasActiveJobs ? `${runningCount + queuedCount} Active Jobs` : 'Job Queue' }}
              </span>
              <div class="flex items-center gap-2">
                <button
                  class="text-xs text-smoke-800 hover:text-white"
                  @click="clearHistory"
                >
                  Clear History
                </button>
              </div>
            </div>

            <!-- Show Assets + Queued count row -->
            <div class="flex items-center justify-between border-b border-charcoal-600 px-3 py-2">
              <button class="flex items-center gap-1 rounded bg-charcoal-600 px-2 py-1 text-xs text-white hover:bg-charcoal-500">
                <Icon name="image" size="xs" />
                Show Assets
              </button>
              <div class="flex items-center gap-2 text-xs">
                <span class="text-white">
                  <span class="font-bold">{{ queuedCount }}</span>
                  <span class="ml-1 text-smoke-800">Queued</span>
                </span>
                <button
                  v-if="queuedCount > 0"
                  class="flex h-6 w-6 items-center justify-center rounded bg-charcoal-600 hover:bg-red-500/30"
                  @click="clearQueue"
                >
                  <Icon name="list-x" size="sm" class="text-white" />
                </button>
              </div>
            </div>

            <!-- Filter tabs -->
            <div class="flex border-b border-charcoal-600">
              <button
                v-for="tab in (['all', 'active', 'completed', 'failed'] as FilterTab[])"
                :key="tab"
                class="flex-1 px-2 py-1.5 text-xs font-medium capitalize transition-colors"
                :class="activeTab === tab
                  ? 'border-b-2 border-blue-500 text-white'
                  : 'text-smoke-800 hover:text-white'"
                @click="activeTab = tab"
              >
                {{ tab }}
              </button>
            </div>

            <!-- Workflow filter -->
            <div class="border-b border-charcoal-600 px-2 py-1.5">
              <select
                v-model="workflowFilter"
                class="w-full rounded bg-charcoal-700 px-2 py-1 text-xs text-white"
              >
                <option value="all">All Workflows</option>
                <option v-for="wf in uniqueWorkflows" :key="wf.id" :value="wf.id">
                  {{ wf.name }}
                </option>
              </select>
            </div>

            <!-- Job list -->
            <div class="flex-1 overflow-y-auto p-2">
              <div v-if="groupedJobs.length === 0" class="flex flex-col items-center justify-center py-8 text-smoke-800">
                <Icon name="inbox" size="lg" class="mb-2 opacity-30" />
                <p class="text-xs">No jobs found</p>
              </div>

              <div v-for="group in groupedJobs" :key="group.workflowId" class="mb-3">
                <!-- Group header -->
                <div class="mb-1.5 flex items-center gap-2 px-1">
                  <Icon name="git-branch" size="xs" class="text-smoke-800" />
                  <span class="text-xs font-medium text-smoke-800">{{ group.workflowName }}</span>
                  <span class="rounded bg-charcoal-600 px-1 py-0.5 text-[10px] text-smoke-800">
                    {{ group.jobs.length }}
                  </span>
                </div>

                <!-- Jobs in group -->
                <div class="space-y-1">
                  <div
                    v-for="job in group.jobs"
                    :key="job.id"
                    class="relative"
                    @mouseenter="hoveredJobId = job.id"
                    @mouseleave="hoveredJobId = null"
                    @contextmenu.prevent="contextMenuJobId = job.id"
                  >
                    <div
                      class="relative flex items-center justify-between gap-2 overflow-hidden rounded border p-1.5 text-xs transition-colors"
                      :class="hoveredJobId === job.id
                        ? 'border-charcoal-400 bg-charcoal-600'
                        : 'border-charcoal-600 bg-charcoal-700'"
                    >
                      <!-- Progress background -->
                      <div v-if="job.state === 'running'" class="absolute inset-0">
                        <div
                          class="h-full bg-blue-500/20 transition-[width]"
                          :style="{ width: `${(job.completedNodes / job.totalNodes) * 100}%` }"
                        />
                      </div>

                      <!-- Left: Icon + info -->
                      <div class="relative z-10 flex items-center gap-2">
                        <div class="flex h-5 w-5 items-center justify-center overflow-hidden rounded">
                          <img v-if="job.preview" :src="job.preview" class="h-full w-full object-cover" />
                          <Icon
                            v-else
                            :name="iconForState(job.state)"
                            size="sm"
                            :class="[colorForState(job.state), job.state === 'running' && 'animate-spin', job.state === 'pending' && 'animate-pulse']"
                          />
                        </div>
                        <div class="flex flex-col">
                          <span class="text-white">Job #{{ job.id.slice(-1) }}</span>
                          <span class="text-[10px] text-smoke-800">
                            {{ job.state === 'running' ? job.currentNode : job.state === 'failed' ? job.error : formatTime(job.createdAt) }}
                          </span>
                        </div>
                      </div>

                      <!-- Right: Actions or progress -->
                      <div class="relative z-10 flex items-center gap-1">
                        <template v-if="hoveredJobId === job.id">
                          <button
                            v-if="job.state === 'running' || job.state === 'pending'"
                            class="flex h-5 w-5 items-center justify-center rounded bg-red-500/20 text-white hover:bg-red-500/30"
                            @click="cancelJob(job.id)"
                          >
                            <Icon name="x" size="xs" />
                          </button>
                          <button
                            v-if="job.state === 'completed'"
                            class="rounded bg-charcoal-500 px-1.5 py-0.5 text-[10px] text-white hover:bg-charcoal-400"
                          >
                            View
                          </button>
                          <button
                            class="flex h-5 w-5 items-center justify-center rounded bg-charcoal-500 text-white hover:bg-charcoal-400"
                            @click.stop="contextMenuJobId = job.id"
                          >
                            <Icon name="more-horizontal" size="xs" />
                          </button>
                        </template>
                        <template v-else>
                          <span v-if="job.state === 'running'" class="text-[10px] text-smoke-800">
                            {{ Math.round((job.completedNodes / job.totalNodes) * 100) }}%
                          </span>
                        </template>
                      </div>
                    </div>

                    <!-- Context menu -->
                    <div
                      v-if="contextMenuJobId === job.id"
                      class="absolute right-0 top-full z-50 mt-1 w-32 rounded border border-charcoal-500 bg-charcoal-700 py-1 shadow-lg"
                    >
                      <button
                        v-if="job.state === 'completed'"
                        class="flex w-full items-center gap-2 px-2 py-1 text-xs text-white hover:bg-charcoal-600"
                      >
                        <Icon name="eye" size="xs" />
                        View
                      </button>
                      <button
                        class="flex w-full items-center gap-2 px-2 py-1 text-xs text-red-400 hover:bg-charcoal-600"
                        @click="deleteJob(job.id)"
                      >
                        <Icon name="trash-2" size="xs" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- ACTIVE: Dual progress bars (collapsed) -->
          <template v-else-if="runningJob">
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
                  </div>
                  <div class="flex items-center gap-1 text-smoke-800">
                    <span class="max-w-[10rem] truncate">{{ currentNodeName }}</span>
                    <span>{{ Math.round(currentNodePercent) }}%</span>
                  </div>
                </div>
              </div>

              <!-- Bottom row (visible on hover) -->
              <div
                class="flex items-center justify-between gap-4 text-xs text-white transition-opacity duration-200"
                :class="isHovered ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'"
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
                  class="h-6 min-w-[80px] rounded bg-charcoal-500 px-3 text-xs hover:bg-charcoal-400"
                  @click="isExpanded = true"
                >
                  View All
                </button>
              </div>
            </div>
          </template>

          <!-- EMPTY: Completion summary banner -->
          <template v-else-if="completedJobs.length > 0">
            <button
              class="flex w-full items-center justify-between gap-3 p-2 text-left hover:bg-charcoal-700"
              @click="isExpanded = true"
            >
              <span class="inline-flex items-center gap-2">
                <span class="relative inline-flex h-6 items-center">
                  <span
                    v-for="(job, i) in completedJobs.slice(0, 3)"
                    :key="job.id"
                    class="inline-block h-6 w-6 overflow-hidden rounded bg-emerald-500/20"
                    :style="{ marginLeft: i === 0 ? '0' : '-12px' }"
                  >
                    <img v-if="job.preview" :src="job.preview" class="h-full w-full object-cover" />
                  </span>
                </span>
                <span class="text-sm text-white">
                  <span class="font-bold">{{ completedJobs.length }}</span> jobs completed
                </span>
              </span>
              <Icon name="chevron-down" size="sm" class="text-smoke-800" />
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Main content area -->
    <div class="relative p-8">
      <!-- Instructions -->
      <div class="mb-8 max-w-2xl rounded-lg border border-charcoal-600 bg-charcoal-800/80 p-4 backdrop-blur">
        <h2 class="mb-2 text-sm font-semibold text-white">Queue Progress + Job Queue (Combined)</h2>
        <p class="mb-3 text-xs text-smoke-800">
          This mockup shows the actual ComfyUI layout: Run button + history toggle in the top-right actionbar,
          with the Queue Progress overlay appearing directly below. The overlay has 3 states:
        </p>
        <ul class="space-y-1 text-xs text-smoke-800">
          <li>• <strong class="text-white">Active:</strong> Shows dual progress bars (total + current node) with hover controls</li>
          <li>• <strong class="text-white">Expanded:</strong> Full job queue with filters, workflow groups, and actions (click history icon)</li>
          <li>• <strong class="text-white">Empty:</strong> Completion summary banner with stacked thumbnails</li>
        </ul>
      </div>

      <!-- Completed results grid -->
      <div v-if="completedJobs.length > 0" class="mb-8 max-w-2xl">
        <h3 class="mb-3 text-sm font-medium text-white">Recent Results</h3>
        <div class="grid grid-cols-4 gap-3">
          <div
            v-for="job in completedJobs"
            :key="job.id"
            class="flex items-center gap-2 rounded-lg border border-charcoal-600 bg-charcoal-800 p-2"
          >
            <div class="h-10 w-10 overflow-hidden rounded bg-emerald-500/20">
              <img v-if="job.preview" :src="job.preview" class="h-full w-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="truncate text-xs text-white">{{ job.workflowName }}</p>
              <p class="text-[10px] text-emerald-400">Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Click outside to close context menu -->
    <div
      v-if="contextMenuJobId"
      class="fixed inset-0 z-40"
      @click="contextMenuJobId = null"
    />
  </div>
</template>
