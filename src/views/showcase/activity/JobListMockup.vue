<script setup lang="ts">
/**
 * Job List Mockup
 *
 * Simulates a job history panel with:
 * - Filtering by status
 * - Job groups by workflow
 * - Real-time status updates
 * - Context menus and actions
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@/components/ui/icon'

type JobState = 'pending' | 'running' | 'completed' | 'failed'

interface Job {
  id: string
  workflowId: string
  workflowName: string
  state: JobState
  progress: number
  currentNode: string
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
    workflowName: 'Portrait Enhancement',
    state: 'running',
    progress: 67,
    currentNode: 'KSampler',
    createdAt: new Date(Date.now() - 120000),
  },
  {
    id: 'job-2',
    workflowId: 'wf-1',
    workflowName: 'Portrait Enhancement',
    state: 'pending',
    progress: 0,
    currentNode: '',
    createdAt: new Date(Date.now() - 60000),
  },
  {
    id: 'job-3',
    workflowId: 'wf-2',
    workflowName: 'Background Removal',
    state: 'completed',
    progress: 100,
    currentNode: '',
    createdAt: new Date(Date.now() - 300000),
    completedAt: new Date(Date.now() - 180000),
    preview: 'https://placehold.co/48x48/22c55e/fff?text=1',
  },
  {
    id: 'job-4',
    workflowId: 'wf-2',
    workflowName: 'Background Removal',
    state: 'completed',
    progress: 100,
    currentNode: '',
    createdAt: new Date(Date.now() - 400000),
    completedAt: new Date(Date.now() - 280000),
    preview: 'https://placehold.co/48x48/3b82f6/fff?text=2',
  },
  {
    id: 'job-5',
    workflowId: 'wf-3',
    workflowName: 'Upscale 4x',
    state: 'failed',
    progress: 34,
    currentNode: 'Upscale Model',
    createdAt: new Date(Date.now() - 500000),
    error: 'CUDA out of memory',
  },
  {
    id: 'job-6',
    workflowId: 'wf-3',
    workflowName: 'Upscale 4x',
    state: 'pending',
    progress: 0,
    currentNode: '',
    createdAt: new Date(Date.now() - 30000),
  },
])

// Filters
type FilterTab = 'all' | 'active' | 'completed' | 'failed'
const activeTab = ref<FilterTab>('all')
const workflowFilter = ref<string>('all')
const hoveredJobId = ref<string | null>(null)
const contextMenuJobId = ref<string | null>(null)

// Unique workflows for filter
const uniqueWorkflows = computed(() => {
  const seen = new Set<string>()
  return jobs.value.filter(j => {
    if (seen.has(j.workflowId)) return false
    seen.add(j.workflowId)
    return true
  }).map(j => ({ id: j.workflowId, name: j.workflowName }))
})

// Filtered jobs
const filteredJobs = computed(() => {
  return jobs.value.filter(job => {
    // Tab filter
    if (activeTab.value === 'active' && !['running', 'pending'].includes(job.state)) return false
    if (activeTab.value === 'completed' && job.state !== 'completed') return false
    if (activeTab.value === 'failed' && job.state !== 'failed') return false

    // Workflow filter
    if (workflowFilter.value !== 'all' && job.workflowId !== workflowFilter.value) return false

    return true
  })
})

// Group jobs by workflow
const groupedJobs = computed(() => {
  const groups: Record<string, Job[]> = {}
  filteredJobs.value.forEach(job => {
    if (!groups[job.workflowId]) {
      groups[job.workflowId] = []
    }
    groups[job.workflowId].push(job)
  })
  return Object.entries(groups).map(([workflowId, jobs]) => ({
    workflowId,
    workflowName: jobs[0].workflowName,
    jobs,
  }))
})

// Stats
const stats = computed(() => ({
  running: jobs.value.filter(j => j.state === 'running').length,
  pending: jobs.value.filter(j => j.state === 'pending').length,
  completed: jobs.value.filter(j => j.state === 'completed').length,
  failed: jobs.value.filter(j => j.state === 'failed').length,
}))

// Animation
let animationInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  animationInterval = setInterval(() => {
    jobs.value.forEach(job => {
      if (job.state === 'running') {
        job.progress = Math.min(100, job.progress + Math.random() * 3)
        if (job.progress >= 100) {
          job.state = 'completed'
          job.completedAt = new Date()
          job.preview = `https://placehold.co/48x48/22c55e/fff?text=${job.id.slice(-1)}`

          // Start next pending
          const nextPending = jobs.value.find(j => j.state === 'pending')
          if (nextPending) {
            nextPending.state = 'running'
            nextPending.currentNode = 'Load Image'
          }
        }
      }
    })
  }, 200)
})

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval)
})

// Actions
function cancelJob(jobId: string) {
  jobs.value = jobs.value.filter(j => j.id !== jobId)
  contextMenuJobId.value = null
}

function retryJob(job: Job) {
  job.state = 'pending'
  job.progress = 0
  job.error = undefined
  contextMenuJobId.value = null
}

function deleteJob(jobId: string) {
  jobs.value = jobs.value.filter(j => j.id !== jobId)
  contextMenuJobId.value = null
}

function clearHistory() {
  jobs.value = jobs.value.filter(j => ['running', 'pending'].includes(j.state))
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
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-charcoal-600 bg-charcoal-900 px-4 py-2">
      <div class="flex items-center gap-4">
        <a href="/showcase/activity" class="text-smoke-800 hover:text-white">
          <Icon name="arrow-left" size="sm" />
        </a>
        <h1 class="text-sm font-medium text-white">Job List Demo</h1>
      </div>
      <div class="flex items-center gap-4 text-xs text-smoke-800">
        <span><span class="font-bold text-blue-400">{{ stats.running }}</span> running</span>
        <span><span class="font-bold text-yellow-400">{{ stats.pending }}</span> pending</span>
        <span><span class="font-bold text-emerald-400">{{ stats.completed }}</span> completed</span>
        <span><span class="font-bold text-red-400">{{ stats.failed }}</span> failed</span>
      </div>
    </div>

    <div class="flex h-[calc(100vh-49px)]">
      <!-- Sidebar panel (simulating job queue sidebar) -->
      <div class="flex w-[380px] flex-col border-r border-charcoal-600 bg-charcoal-900">
        <!-- Panel header -->
        <div class="flex items-center justify-between border-b border-charcoal-600 p-3">
          <span class="text-sm font-medium text-white">Job Queue</span>
          <button
            class="text-xs text-smoke-800 hover:text-white"
            @click="clearHistory"
          >
            Clear History
          </button>
        </div>

        <!-- Filter tabs -->
        <div class="flex border-b border-charcoal-600">
          <button
            v-for="tab in (['all', 'active', 'completed', 'failed'] as FilterTab[])"
            :key="tab"
            class="flex-1 px-3 py-2 text-xs font-medium capitalize transition-colors"
            :class="activeTab === tab
              ? 'border-b-2 border-blue-500 text-white'
              : 'text-smoke-800 hover:text-white'"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Workflow filter -->
        <div class="border-b border-charcoal-600 p-2">
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
          <div v-if="groupedJobs.length === 0" class="flex flex-col items-center justify-center py-12 text-smoke-800">
            <Icon name="inbox" size="xl" class="mb-2 opacity-30" />
            <p class="text-sm">No jobs found</p>
          </div>

          <div v-for="group in groupedJobs" :key="group.workflowId" class="mb-4">
            <!-- Group header -->
            <div class="mb-2 flex items-center gap-2 px-1">
              <Icon name="git-branch" size="xs" class="text-smoke-800" />
              <span class="text-xs font-medium text-smoke-800">{{ group.workflowName }}</span>
              <span class="rounded bg-charcoal-600 px-1.5 py-0.5 text-xs text-smoke-800">
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
                <!-- Job item -->
                <div
                  class="relative flex items-center justify-between gap-2 overflow-hidden rounded-lg border p-2 text-xs transition-colors"
                  :class="hoveredJobId === job.id
                    ? 'border-charcoal-400 bg-charcoal-600'
                    : 'border-charcoal-600 bg-charcoal-700'"
                >
                  <!-- Progress background -->
                  <div v-if="job.state === 'running'" class="absolute inset-0">
                    <div
                      class="h-full bg-blue-500/20 transition-[width]"
                      :style="{ width: `${job.progress}%` }"
                    />
                  </div>

                  <!-- Left: Icon + info -->
                  <div class="relative z-10 flex items-center gap-2">
                    <div class="flex h-6 w-6 items-center justify-center overflow-hidden rounded">
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
                      <span class="text-smoke-800">
                        {{ job.state === 'running' ? job.currentNode : job.state === 'failed' ? job.error : formatTime(job.createdAt) }}
                      </span>
                    </div>
                  </div>

                  <!-- Right: Actions -->
                  <div class="relative z-10 flex items-center gap-2">
                    <template v-if="hoveredJobId === job.id">
                      <button
                        v-if="job.state === 'running'"
                        class="flex h-6 w-6 items-center justify-center rounded bg-red-500/20 text-white hover:bg-red-500/30"
                        @click="cancelJob(job.id)"
                      >
                        <Icon name="x" size="sm" />
                      </button>
                      <button
                        v-else-if="job.state === 'completed'"
                        class="rounded bg-charcoal-500 px-2 py-1 text-white hover:bg-charcoal-400"
                      >
                        View
                      </button>
                      <button
                        v-else-if="job.state === 'failed'"
                        class="flex h-6 w-6 items-center justify-center rounded bg-red-500/20 text-white hover:bg-red-500/30"
                        @click="deleteJob(job.id)"
                      >
                        <Icon name="trash-2" size="sm" />
                      </button>
                      <button
                        v-else-if="job.state === 'pending'"
                        class="flex h-6 w-6 items-center justify-center rounded bg-red-500/20 text-white hover:bg-red-500/30"
                        @click="cancelJob(job.id)"
                      >
                        <Icon name="x" size="sm" />
                      </button>
                      <button
                        class="flex h-6 w-6 items-center justify-center rounded bg-charcoal-500 text-white hover:bg-charcoal-400"
                        @click="contextMenuJobId = job.id"
                      >
                        <Icon name="more-horizontal" size="sm" />
                      </button>
                    </template>
                    <template v-else>
                      <span v-if="job.state === 'running'" class="text-smoke-800">{{ Math.round(job.progress) }}%</span>
                      <span v-else-if="job.state !== 'failed'" class="text-smoke-800">{{ formatTime(job.createdAt) }}</span>
                    </template>
                  </div>
                </div>

                <!-- Context menu -->
                <div
                  v-if="contextMenuJobId === job.id"
                  class="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-charcoal-500 bg-charcoal-700 py-1 shadow-lg"
                >
                  <button
                    v-if="job.state === 'failed'"
                    class="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-white hover:bg-charcoal-600"
                    @click="retryJob(job)"
                  >
                    <Icon name="refresh-cw" size="sm" />
                    Retry
                  </button>
                  <button
                    v-if="job.state === 'completed'"
                    class="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-white hover:bg-charcoal-600"
                  >
                    <Icon name="eye" size="sm" />
                    View Output
                  </button>
                  <button
                    v-if="job.state === 'completed'"
                    class="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-white hover:bg-charcoal-600"
                  >
                    <Icon name="download" size="sm" />
                    Download
                  </button>
                  <button
                    class="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-charcoal-600"
                    @click="deleteJob(job.id)"
                  >
                    <Icon name="trash-2" size="sm" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content area -->
      <div class="flex-1 p-8">
        <div class="rounded-lg border border-charcoal-600 bg-charcoal-800 p-6">
          <h2 class="mb-2 text-sm font-semibold text-white">Scenario: Job Queue Management</h2>
          <p class="text-xs text-smoke-800">
            This mockup demonstrates the job list sidebar panel. Jobs are grouped by workflow
            and show real-time progress. Hover over jobs to see action buttons, or right-click
            for context menu. Use the filter tabs and workflow dropdown to narrow down the list.
          </p>
          <ul class="mt-4 space-y-1 text-xs text-smoke-800">
            <li>• Running jobs show animated progress bars</li>
            <li>• Completed jobs show preview thumbnails</li>
            <li>• Failed jobs show error messages and retry option</li>
            <li>• Pending jobs pulse to indicate waiting state</li>
          </ul>
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
