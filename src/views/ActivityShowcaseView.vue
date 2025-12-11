<script setup lang="ts">
/**
 * Activity Showcase View
 *
 * Displays all activity/task/notification components from ORIGINAL ComfyUI repos
 * with their states and variants - organized in tabs.
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Icon } from '@/components/ui/icon'

// ============================================================================
// TAB 1: Queue Progress Overlay
// ============================================================================

// Mock progress states for Queue overlay
const mockQueueActive = ref({
  totalPercent: 67,
  currentNodePercent: 45,
  currentNodeName: 'KSampler',
  runningCount: 2,
  queuedCount: 5,
})

// Animate the progress
let progressInterval: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  progressInterval = setInterval(() => {
    mockQueueActive.value.totalPercent = (mockQueueActive.value.totalPercent + 1) % 100
    mockQueueActive.value.currentNodePercent = (mockQueueActive.value.currentNodePercent + 3) % 100
  }, 100)
})
onUnmounted(() => {
  if (progressInterval) clearInterval(progressInterval)
})

// ============================================================================
// TAB 2: Job Items
// ============================================================================

type JobState = 'pending' | 'initialization' | 'running' | 'completed' | 'failed'

interface MockJob {
  id: string
  state: JobState
  title: string
  rightText: string
  iconImageUrl?: string
  progressTotalPercent?: number
  progressCurrentPercent?: number
}

const mockJobs: MockJob[] = [
  { id: '1', state: 'pending', title: 'Workflow: Portrait Generator', rightText: 'Queued' },
  { id: '2', state: 'initialization', title: 'Workflow: Landscape v2', rightText: 'Starting...' },
  { id: '3', state: 'running', title: 'Workflow: Character Design', rightText: '45%', progressTotalPercent: 45, progressCurrentPercent: 23 },
  { id: '4', state: 'completed', title: 'Workflow: Logo Creator', rightText: '2m ago', iconImageUrl: 'https://placehold.co/48x48/22c55e/fff?text=OK' },
  { id: '5', state: 'failed', title: 'Workflow: Video Upscale', rightText: 'Error' },
]

function iconForJobState(state: JobState): string {
  switch (state) {
    case 'pending': return 'loader-2'
    case 'initialization': return 'loader-2'
    case 'running': return 'play'
    case 'completed': return 'check'
    case 'failed': return 'x-circle'
    default: return 'circle'
  }
}

function stateColor(state: JobState): string {
  switch (state) {
    case 'pending': return 'text-yellow-400'
    case 'initialization': return 'text-blue-400'
    case 'running': return 'text-blue-500'
    case 'completed': return 'text-emerald-400'
    case 'failed': return 'text-red-400'
    default: return 'text-smoke-800'
  }
}

// ============================================================================
// TAB 3: Completion Summary Banner
// ============================================================================

type CompletionMode = 'allSuccess' | 'mixed' | 'allFailed'

interface CompletionSummary {
  mode: CompletionMode
  completedCount: number
  failedCount: number
  thumbnailUrls: string[]
}

const mockCompletionSummaries: CompletionSummary[] = [
  {
    mode: 'allSuccess',
    completedCount: 5,
    failedCount: 0,
    thumbnailUrls: [
      'https://placehold.co/24x24/22c55e/fff?text=1',
      'https://placehold.co/24x24/3b82f6/fff?text=2',
      'https://placehold.co/24x24/a855f7/fff?text=3',
    ],
  },
  {
    mode: 'mixed',
    completedCount: 3,
    failedCount: 2,
    thumbnailUrls: [
      'https://placehold.co/24x24/22c55e/fff?text=1',
      'https://placehold.co/24x24/3b82f6/fff?text=2',
    ],
  },
  {
    mode: 'allFailed',
    completedCount: 0,
    failedCount: 4,
    thumbnailUrls: [],
  },
]

// ============================================================================
// TAB 4: Toast Notifications
// ============================================================================

interface ToastMessage {
  severity: 'success' | 'info' | 'warn' | 'error'
  summary: string
  detail: string
}

const mockToasts: ToastMessage[] = [
  { severity: 'success', summary: 'Success', detail: 'Workflow completed successfully' },
  { severity: 'info', summary: 'Info', detail: 'New update available v1.2.3' },
  { severity: 'warn', summary: 'Warning', detail: 'Memory usage high (85%)' },
  { severity: 'error', summary: 'Error', detail: 'Failed to connect to server' },
]

function toastIcon(severity: ToastMessage['severity']): string {
  switch (severity) {
    case 'success': return 'check-circle'
    case 'info': return 'info'
    case 'warn': return 'alert-triangle'
    case 'error': return 'x-circle'
  }
}

function toastColors(severity: ToastMessage['severity']): string {
  switch (severity) {
    case 'success': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
    case 'info': return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
    case 'warn': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
    case 'error': return 'bg-red-500/10 border-red-500/30 text-red-400'
  }
}

// ============================================================================
// TAB 5: Download Progress
// ============================================================================

type DownloadState = 'pending' | 'in_progress' | 'paused' | 'completed' | 'cancelled' | 'error'

interface DownloadItem {
  id: string
  state: DownloadState
  label: string
  progress: number
  downloadedBytes: number
  totalBytes: number
  speed: number
  eta: number
}

const mockDownloads: DownloadItem[] = [
  { id: '1', state: 'pending', label: 'checkpoints/sd_xl_base_1.0.safetensors', progress: 0, downloadedBytes: 0, totalBytes: 6.46 * 1024 * 1024 * 1024, speed: 0, eta: 0 },
  { id: '2', state: 'in_progress', label: 'loras/detail_tweaker_xl.safetensors', progress: 45, downloadedBytes: 84 * 1024 * 1024, totalBytes: 186 * 1024 * 1024, speed: 25 * 1024 * 1024, eta: 4 },
  { id: '3', state: 'paused', label: 'vae/sdxl_vae.safetensors', progress: 67, downloadedBytes: 223 * 1024 * 1024, totalBytes: 335 * 1024 * 1024, speed: 0, eta: 0 },
  { id: '4', state: 'completed', label: 'embeddings/bad_hands.pt', progress: 100, downloadedBytes: 12 * 1024 * 1024, totalBytes: 12 * 1024 * 1024, speed: 0, eta: 0 },
  { id: '5', state: 'error', label: 'controlnet/canny_xl.safetensors', progress: 23, downloadedBytes: 0.5 * 1024 * 1024 * 1024, totalBytes: 2.1 * 1024 * 1024 * 1024, speed: 0, eta: 0 },
  { id: '6', state: 'cancelled', label: 'upscale/4x_ultrasharp.pth', progress: 34, downloadedBytes: 22 * 1024 * 1024, totalBytes: 64 * 1024 * 1024, speed: 0, eta: 0 },
]

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return bytes + ' B'
}

function formatSpeed(bytesPerSec: number): string {
  return formatSize(bytesPerSec) + '/s'
}

function formatEta(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

function downloadStateColor(state: DownloadState): string {
  switch (state) {
    case 'pending': return 'text-yellow-400'
    case 'in_progress': return 'text-blue-400'
    case 'paused': return 'text-orange-400'
    case 'completed': return 'text-emerald-400'
    case 'cancelled': return 'text-smoke-600'
    case 'error': return 'text-red-400'
  }
}

// ============================================================================
// TAB 6: Upload Progress
// ============================================================================

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

interface UploadItem {
  state: UploadState
  filename: string
  modelType: string
  error?: string
}

const mockUploads: UploadItem[] = [
  { state: 'idle', filename: 'my_custom_lora.safetensors', modelType: 'lora' },
  { state: 'uploading', filename: 'landscape_checkpoint.safetensors', modelType: 'checkpoint' },
  { state: 'success', filename: 'character_lora_v2.safetensors', modelType: 'lora' },
  { state: 'error', filename: 'broken_model.safetensors', modelType: 'checkpoint', error: 'Network error: Connection timed out' },
]

// ============================================================================
// TAB 7: Manager Progress
// ============================================================================

interface ManagerTask {
  id: string
  taskName: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  logs: string[]
}

const mockManagerTasks: ManagerTask[] = [
  {
    id: '1',
    taskName: 'Installing ComfyUI-Manager',
    status: 'completed',
    logs: [
      'Cloning repository...',
      'Installing dependencies...',
      'Running pip install -r requirements.txt',
      'Installation completed successfully',
    ],
  },
  {
    id: '2',
    taskName: 'Updating ComfyUI-Impact-Pack',
    status: 'running',
    logs: [
      'Fetching latest version...',
      'Downloading update...',
      'Installing dependencies...',
    ],
  },
  {
    id: '3',
    taskName: 'Installing ComfyUI-ControlNet',
    status: 'failed',
    logs: [
      'Cloning repository...',
      'Error: Failed to install torch dependency',
      'Installation failed',
    ],
  },
]

// ============================================================================
// TAB 8: Error Dialog
// ============================================================================

interface ErrorReport {
  nodeType: string
  exceptionType: string
  exceptionMessage: string
  traceback: string[]
}

const mockError: ErrorReport = {
  nodeType: 'KSampler',
  exceptionType: 'RuntimeError',
  exceptionMessage: 'CUDA out of memory. Tried to allocate 2.00 GiB',
  traceback: [
    'File "execution.py", line 152, in execute',
    '  output = getattr(obj, func)(**input_data)',
    'File "nodes.py", line 1423, in sample',
    '  return common_ksampler(model, seed, steps, cfg, sampler_name, scheduler, positive, negative, latent_image, denoise=denoise)',
    'torch.cuda.OutOfMemoryError: CUDA out of memory',
  ],
}

// ============================================================================
// TAB 9: WebSocket Status
// ============================================================================

type WsStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

const mockWsStatuses: { status: WsStatus; label: string }[] = [
  { status: 'connected', label: 'Connected to server' },
  { status: 'connecting', label: 'Connecting...' },
  { status: 'disconnected', label: 'Disconnected' },
  { status: 'error', label: 'Connection error' },
]

function wsStatusIcon(status: WsStatus): string {
  switch (status) {
    case 'connected': return 'wifi'
    case 'connecting': return 'loader-2'
    case 'disconnected': return 'wifi-off'
    case 'error': return 'alert-circle'
  }
}

function wsStatusColor(status: WsStatus): string {
  switch (status) {
    case 'connected': return 'text-emerald-400'
    case 'connecting': return 'text-yellow-400'
    case 'disconnected': return 'text-smoke-600'
    case 'error': return 'text-red-400'
  }
}
</script>

<template>
  <div class="min-h-screen bg-charcoal-950 p-8">
    <div class="mx-auto max-w-6xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="mb-2 text-2xl font-bold text-white">Activity Components Showcase</h1>
        <p class="text-smoke-800">All activity, task, notification, and status patterns from original ComfyUI</p>
      </div>

      <!-- Interactive Mockup Pages -->
      <div class="mb-8 rounded-xl border border-purple-500/30 bg-purple-500/10 p-6">
        <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-purple-400">
          <Icon name="play-circle" size="md" />
          Interactive Mockup Pages
        </h2>
        <p class="mb-4 text-sm text-smoke-800">
          Click to open full-page interactive demos that simulate real-world scenarios.
        </p>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/showcase/activity/queue"
            class="flex items-center gap-3 rounded-lg border border-charcoal-600 bg-charcoal-800 p-3 transition-colors hover:border-purple-500/50 hover:bg-charcoal-700"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
              <Icon name="activity" size="md" class="text-blue-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-white">Queue Progress</p>
              <p class="text-xs text-smoke-800">Workflow execution overlay</p>
            </div>
          </a>
          <a
            href="/showcase/activity/jobs"
            class="flex items-center gap-3 rounded-lg border border-charcoal-600 bg-charcoal-800 p-3 transition-colors hover:border-purple-500/50 hover:bg-charcoal-700"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20">
              <Icon name="list" size="md" class="text-yellow-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-white">Job List</p>
              <p class="text-xs text-smoke-800">Queue sidebar panel</p>
            </div>
          </a>
          <a
            href="/showcase/activity/toasts"
            class="flex items-center gap-3 rounded-lg border border-charcoal-600 bg-charcoal-800 p-3 transition-colors hover:border-purple-500/50 hover:bg-charcoal-700"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
              <Icon name="bell" size="md" class="text-emerald-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-white">Toast Notifications</p>
              <p class="text-xs text-smoke-800">All severity types</p>
            </div>
          </a>
          <a
            href="/showcase/activity/downloads"
            class="flex items-center gap-3 rounded-lg border border-charcoal-600 bg-charcoal-800 p-3 transition-colors hover:border-purple-500/50 hover:bg-charcoal-700"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
              <Icon name="download" size="md" class="text-cyan-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-white">Downloads</p>
              <p class="text-xs text-smoke-800">Model download manager</p>
            </div>
          </a>
          <a
            href="/showcase/activity/manager"
            class="flex items-center gap-3 rounded-lg border border-charcoal-600 bg-charcoal-800 p-3 transition-colors hover:border-purple-500/50 hover:bg-charcoal-700"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
              <Icon name="package" size="md" class="text-orange-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-white">Manager Progress</p>
              <p class="text-xs text-smoke-800">Extension installation</p>
            </div>
          </a>
          <a
            href="/showcase/activity/errors"
            class="flex items-center gap-3 rounded-lg border border-charcoal-600 bg-charcoal-800 p-3 transition-colors hover:border-purple-500/50 hover:bg-charcoal-700"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
              <Icon name="alert-circle" size="md" class="text-red-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-white">Error Dialog</p>
              <p class="text-xs text-smoke-800">Execution error display</p>
            </div>
          </a>
        </div>

        <!-- UX Enhancement Options Demos -->
        <div class="mt-6 border-t border-charcoal-600 pt-6">
          <h3 class="mb-3 text-sm font-medium text-purple-400">UX Enhancement Options</h3>
          <div class="grid gap-3 sm:grid-cols-2">
            <a
              href="/showcase/activity/option1"
              class="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/20"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                <Icon name="layers" size="md" class="text-emerald-400" />
              </div>
              <div>
                <p class="text-sm font-medium text-white">Option 1: Enhanced Overlay</p>
                <p class="text-xs text-smoke-800">Downloads/Manager + Smart Toasts</p>
              </div>
            </a>
            <a
              href="/showcase/activity/option5"
              class="flex items-center gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 transition-colors hover:border-blue-500/50 hover:bg-blue-500/20"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                <Icon name="picture-in-picture-2" size="md" class="text-blue-400" />
              </div>
              <div>
                <p class="text-sm font-medium text-white">Option 5: PiP Preview</p>
                <p class="text-xs text-smoke-800">Draggable live preview window</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <Tabs default-value="queue" class="w-full">
        <TabsList class="mb-6 flex flex-wrap gap-1 h-auto p-2">
          <TabsTrigger value="queue">Queue Progress</TabsTrigger>
          <TabsTrigger value="jobs">Job Items</TabsTrigger>
          <TabsTrigger value="completion">Completion Banner</TabsTrigger>
          <TabsTrigger value="toasts">Toasts</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="uploads">Uploads</TabsTrigger>
          <TabsTrigger value="manager">Manager Progress</TabsTrigger>
          <TabsTrigger value="errors">Error Dialog</TabsTrigger>
          <TabsTrigger value="websocket">WebSocket Status</TabsTrigger>
        </TabsList>

        <!-- TAB 1: Queue Progress Overlay -->
        <TabsContent value="queue" class="space-y-6">
          <h2 class="text-lg font-semibold text-white">Queue Progress Overlay</h2>
          <p class="text-sm text-smoke-800">Shows execution progress with total and per-node progress bars.</p>

          <div class="grid gap-6 lg:grid-cols-2">
            <!-- Active State -->
            <div class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4">
              <div class="mb-3 flex items-center gap-2">
                <span class="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">Active</span>
                <span class="text-xs text-smoke-800">Job is running</span>
              </div>

              <div class="rounded-lg border border-charcoal-200 bg-charcoal-700 p-4">
                <div class="flex flex-col gap-3">
                  <!-- Progress bars -->
                  <div class="flex flex-col gap-1">
                    <div class="relative h-2 w-full overflow-hidden rounded-full border border-charcoal-400 bg-charcoal-600">
                      <div
                        class="absolute inset-0 h-full rounded-full bg-blue-500/30 transition-[width]"
                        :style="{ width: `${mockQueueActive.totalPercent}%` }"
                      />
                      <div
                        class="absolute inset-0 h-full rounded-full bg-blue-500 transition-[width]"
                        :style="{ width: `${mockQueueActive.currentNodePercent}%` }"
                      />
                    </div>
                    <div class="flex items-start justify-end gap-4 text-xs">
                      <div class="flex items-center gap-1 text-white opacity-90">
                        Total: <span class="font-bold">{{ mockQueueActive.totalPercent }}%</span>
                      </div>
                      <div class="flex items-center gap-1 text-smoke-800">
                        <span>Node:</span>
                        <span class="inline-block max-w-[10rem] truncate">{{ mockQueueActive.currentNodeName }}</span>
                        <span>{{ mockQueueActive.currentNodePercent }}%</span>
                      </div>
                    </div>
                  </div>

                  <!-- Bottom row -->
                  <div class="flex items-center justify-between gap-4 text-xs text-white">
                    <div class="flex items-center gap-4">
                      <div class="flex items-center gap-2">
                        <span class="opacity-90">
                          <span class="font-bold">{{ mockQueueActive.runningCount }}</span>
                          <span class="ml-1">Running</span>
                        </span>
                        <button class="flex h-6 w-6 items-center justify-center rounded bg-red-500/20 hover:bg-red-500/30">
                          <Icon name="x" size="sm" class="text-white" />
                        </button>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="opacity-90">
                          <span class="font-bold">{{ mockQueueActive.queuedCount }}</span>
                          <span class="ml-1">Queued</span>
                        </span>
                        <button class="flex h-6 w-6 items-center justify-center rounded bg-charcoal-500 hover:bg-red-500/20">
                          <Icon name="list-x" size="sm" class="text-white" />
                        </button>
                      </div>
                    </div>
                    <button class="h-6 rounded bg-charcoal-500 px-3 text-xs hover:bg-charcoal-400">
                      View All Jobs
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty/Idle State -->
            <div class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4">
              <div class="mb-3 flex items-center gap-2">
                <span class="rounded bg-charcoal-400/50 px-2 py-0.5 text-xs font-medium text-smoke-800">Empty</span>
                <span class="text-xs text-smoke-800">No jobs running</span>
              </div>

              <div class="rounded-lg border border-charcoal-200 bg-charcoal-700 p-4">
                <div class="flex items-center justify-center py-4 text-sm text-smoke-800">
                  <Icon name="inbox" size="lg" class="mr-2 opacity-30" />
                  Queue is empty
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- TAB 2: Job Items -->
        <TabsContent value="jobs" class="space-y-6">
          <h2 class="text-lg font-semibold text-white">Queue Job Items</h2>
          <p class="text-sm text-smoke-800">Individual job items with all possible states.</p>

          <div class="grid gap-4 lg:grid-cols-2">
            <div
              v-for="job in mockJobs"
              :key="job.id"
              class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4"
            >
              <div class="mb-3 flex items-center gap-2">
                <span
                  class="rounded px-2 py-0.5 text-xs font-medium capitalize"
                  :class="{
                    'bg-yellow-500/20 text-yellow-400': job.state === 'pending',
                    'bg-blue-500/20 text-blue-400': job.state === 'initialization',
                    'bg-blue-500/20 text-blue-500': job.state === 'running',
                    'bg-emerald-500/20 text-emerald-400': job.state === 'completed',
                    'bg-red-500/20 text-red-400': job.state === 'failed',
                  }"
                >
                  {{ job.state }}
                </span>
              </div>

              <!-- Job Item Component -->
              <div
                class="relative flex items-center justify-between gap-2 overflow-hidden rounded-lg border border-charcoal-600 bg-charcoal-600 p-2 text-xs text-white transition-colors hover:border-charcoal-500 hover:bg-charcoal-500"
              >
                <!-- Progress background for running jobs -->
                <div v-if="job.state === 'running' && job.progressTotalPercent" class="absolute inset-0">
                  <div
                    class="pointer-events-none absolute inset-y-0 left-0 h-full bg-blue-500/20 transition-[width]"
                    :style="{ width: `${job.progressTotalPercent}%` }"
                  />
                  <div
                    v-if="job.progressCurrentPercent"
                    class="pointer-events-none absolute inset-y-0 left-0 h-full bg-blue-500/40 transition-[width]"
                    :style="{ width: `${job.progressCurrentPercent}%` }"
                  />
                </div>

                <!-- Left: Icon + Title -->
                <div class="relative z-10 flex items-center gap-2">
                  <div class="flex h-6 w-6 items-center justify-center overflow-hidden rounded">
                    <img v-if="job.iconImageUrl" :src="job.iconImageUrl" class="h-full w-full object-cover" />
                    <Icon
                      v-else
                      :name="iconForJobState(job.state)"
                      size="sm"
                      :class="[
                        stateColor(job.state),
                        (job.state === 'pending' || job.state === 'initialization') && 'animate-spin'
                      ]"
                    />
                  </div>
                  <span class="truncate opacity-90">{{ job.title }}</span>
                </div>

                <!-- Right: Actions/Status -->
                <div class="relative z-10 flex items-center gap-2 text-smoke-800">
                  <span v-if="job.state !== 'running'">{{ job.rightText }}</span>
                  <button
                    v-if="job.state === 'running'"
                    class="flex h-6 w-6 items-center justify-center rounded bg-red-500/20 text-white hover:bg-red-500/30"
                  >
                    <Icon name="x" size="sm" />
                  </button>
                  <button
                    v-if="job.state === 'completed'"
                    class="rounded bg-charcoal-400 px-2 py-1 text-white hover:bg-charcoal-300"
                  >
                    View
                  </button>
                  <button
                    v-if="job.state === 'failed'"
                    class="flex h-6 w-6 items-center justify-center rounded bg-red-500/20 text-white hover:bg-red-500/30"
                  >
                    <Icon name="trash-2" size="sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- TAB 3: Completion Summary Banner -->
        <TabsContent value="completion" class="space-y-6">
          <h2 class="text-lg font-semibold text-white">Completion Summary Banner</h2>
          <p class="text-sm text-smoke-800">Shows batch completion status with thumbnails.</p>

          <div class="grid gap-4">
            <div
              v-for="(summary, idx) in mockCompletionSummaries"
              :key="idx"
              class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4"
            >
              <div class="mb-3 flex items-center gap-2">
                <span
                  class="rounded px-2 py-0.5 text-xs font-medium capitalize"
                  :class="{
                    'bg-emerald-500/20 text-emerald-400': summary.mode === 'allSuccess',
                    'bg-yellow-500/20 text-yellow-400': summary.mode === 'mixed',
                    'bg-red-500/20 text-red-400': summary.mode === 'allFailed',
                  }"
                >
                  {{ summary.mode }}
                </span>
              </div>

              <!-- Banner Component -->
              <button
                class="flex w-full items-center justify-between gap-3 rounded-lg border border-charcoal-600 bg-charcoal-600 p-2 text-left hover:bg-charcoal-500"
              >
                <span class="inline-flex items-center gap-2">
                  <!-- Alert icon for failed -->
                  <span v-if="summary.mode === 'allFailed'" class="inline-flex items-center">
                    <Icon name="circle-alert" size="sm" class="ml-1 text-red-500" />
                  </span>

                  <!-- Thumbnails -->
                  <span v-if="summary.mode !== 'allFailed'" class="relative inline-flex h-6 items-center">
                    <span
                      v-for="(url, i) in summary.thumbnailUrls"
                      :key="url"
                      class="inline-block h-6 w-6 overflow-hidden rounded border-0 bg-charcoal-500"
                      :style="{ marginLeft: i === 0 ? '0' : '-12px' }"
                    >
                      <img :src="url" alt="Preview" class="h-full w-full object-cover" />
                    </span>
                  </span>

                  <!-- Text -->
                  <span class="text-sm font-normal text-white">
                    <template v-if="summary.mode === 'allSuccess'">
                      <span class="font-bold">{{ summary.completedCount }}</span> job{{ summary.completedCount !== 1 ? 's' : '' }} completed
                    </template>
                    <template v-else-if="summary.mode === 'mixed'">
                      <span class="font-bold">{{ summary.completedCount }}</span> completed,
                      <span class="font-bold">{{ summary.failedCount }}</span> failed
                    </template>
                    <template v-else>
                      <span class="font-bold">{{ summary.failedCount }}</span> job{{ summary.failedCount !== 1 ? 's' : '' }} failed
                    </template>
                  </span>
                </span>

                <span class="flex items-center justify-center rounded p-1 text-smoke-800">
                  <Icon name="chevron-down" size="sm" />
                </span>
              </button>
            </div>
          </div>
        </TabsContent>

        <!-- TAB 4: Toast Notifications -->
        <TabsContent value="toasts" class="space-y-6">
          <h2 class="text-lg font-semibold text-white">Toast Notifications</h2>
          <p class="text-sm text-smoke-800">PrimeVue Toast component styles for different severities.</p>

          <div class="grid gap-4 lg:grid-cols-2">
            <div
              v-for="toast in mockToasts"
              :key="toast.summary"
              class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4"
            >
              <div class="mb-3 flex items-center gap-2">
                <span
                  class="rounded px-2 py-0.5 text-xs font-medium capitalize"
                  :class="{
                    'bg-emerald-500/20 text-emerald-400': toast.severity === 'success',
                    'bg-blue-500/20 text-blue-400': toast.severity === 'info',
                    'bg-yellow-500/20 text-yellow-400': toast.severity === 'warn',
                    'bg-red-500/20 text-red-400': toast.severity === 'error',
                  }"
                >
                  {{ toast.severity }}
                </span>
              </div>

              <!-- Toast Component -->
              <div
                class="flex items-start gap-3 rounded-lg border p-3"
                :class="toastColors(toast.severity)"
              >
                <Icon :name="toastIcon(toast.severity)" size="md" />
                <div class="flex-1">
                  <p class="text-sm font-semibold text-white">{{ toast.summary }}</p>
                  <p class="text-xs opacity-80">{{ toast.detail }}</p>
                </div>
                <button class="opacity-60 hover:opacity-100">
                  <Icon name="x" size="sm" />
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- TAB 5: Download Progress -->
        <TabsContent value="downloads" class="space-y-6">
          <h2 class="text-lg font-semibold text-white">Download Progress</h2>
          <p class="text-sm text-smoke-800">Electron file download with pause/resume/cancel controls.</p>

          <div class="grid gap-4">
            <div
              v-for="download in mockDownloads"
              :key="download.id"
              class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4"
            >
              <div class="mb-3 flex items-center gap-2">
                <span
                  class="rounded px-2 py-0.5 text-xs font-medium"
                  :class="{
                    'bg-yellow-500/20 text-yellow-400': download.state === 'pending',
                    'bg-blue-500/20 text-blue-400': download.state === 'in_progress',
                    'bg-orange-500/20 text-orange-400': download.state === 'paused',
                    'bg-emerald-500/20 text-emerald-400': download.state === 'completed',
                    'bg-charcoal-400/50 text-smoke-600': download.state === 'cancelled',
                    'bg-red-500/20 text-red-400': download.state === 'error',
                  }"
                >
                  {{ download.state.replace('_', ' ') }}
                </span>
              </div>

              <!-- Download Item Component -->
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Icon
                      v-if="download.state === 'completed'"
                      name="check"
                      size="sm"
                      class="text-emerald-400"
                    />
                    <span class="text-sm text-white">{{ download.label }}</span>
                  </div>
                  <span class="text-xs text-smoke-800">
                    {{ formatSize(download.downloadedBytes) }} / {{ formatSize(download.totalBytes) }}
                  </span>
                </div>

                <!-- Progress bar for active states -->
                <div
                  v-if="['in_progress', 'paused', 'completed'].includes(download.state)"
                  class="flex items-center gap-2"
                >
                  <div class="flex-1">
                    <Progress :model-value="download.progress" class="h-2" />
                  </div>
                  <span class="min-w-[3rem] text-right text-xs text-smoke-800">{{ download.progress }}%</span>

                  <!-- Controls -->
                  <div class="flex items-center gap-1">
                    <button
                      v-if="download.state === 'in_progress'"
                      class="flex h-6 w-6 items-center justify-center rounded bg-charcoal-600 hover:bg-charcoal-500"
                      title="Pause"
                    >
                      <Icon name="pause" size="sm" class="text-white" />
                    </button>
                    <button
                      v-if="download.state === 'paused'"
                      class="flex h-6 w-6 items-center justify-center rounded bg-charcoal-600 hover:bg-charcoal-500"
                      title="Resume"
                    >
                      <Icon name="play" size="sm" class="text-white" />
                    </button>
                    <button
                      v-if="['in_progress', 'paused'].includes(download.state)"
                      class="flex h-6 w-6 items-center justify-center rounded bg-red-500/20 hover:bg-red-500/30"
                      title="Cancel"
                    >
                      <Icon name="x" size="sm" class="text-white" />
                    </button>
                  </div>
                </div>

                <!-- Speed & ETA for in_progress -->
                <div v-if="download.state === 'in_progress'" class="flex items-center gap-4 text-xs text-smoke-800">
                  <span>{{ formatSpeed(download.speed) }}</span>
                  <span>ETA: {{ formatEta(download.eta) }}</span>
                </div>

                <!-- Error/Cancelled state -->
                <div
                  v-if="download.state === 'error' || download.state === 'cancelled'"
                  class="flex items-center gap-2"
                >
                  <span
                    class="rounded px-2 py-1 text-xs"
                    :class="download.state === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-charcoal-600 text-smoke-800'"
                  >
                    {{ download.state === 'error' ? 'Download failed' : 'Cancelled' }}
                  </span>
                  <button class="text-xs text-blue-400 hover:underline">Retry</button>
                </div>

                <!-- Pending state -->
                <div v-if="download.state === 'pending'" class="flex items-center gap-2">
                  <button class="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-500">
                    Download ({{ formatSize(download.totalBytes) }})
                  </button>
                  <button class="text-xs text-smoke-800 hover:text-white">Copy URL</button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- TAB 6: Upload Progress -->
        <TabsContent value="uploads" class="space-y-6">
          <h2 class="text-lg font-semibold text-white">Upload Progress</h2>
          <p class="text-sm text-smoke-800">Model upload states: idle, uploading, success, error.</p>

          <div class="grid gap-4 lg:grid-cols-2">
            <div
              v-for="upload in mockUploads"
              :key="upload.filename"
              class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4"
            >
              <div class="mb-3 flex items-center gap-2">
                <span
                  class="rounded px-2 py-0.5 text-xs font-medium capitalize"
                  :class="{
                    'bg-charcoal-400/50 text-smoke-800': upload.state === 'idle',
                    'bg-blue-500/20 text-blue-400': upload.state === 'uploading',
                    'bg-emerald-500/20 text-emerald-400': upload.state === 'success',
                    'bg-red-500/20 text-red-400': upload.state === 'error',
                  }"
                >
                  {{ upload.state }}
                </span>
              </div>

              <!-- Upload Component -->
              <div class="flex flex-col items-center justify-center gap-2 rounded-lg border border-charcoal-600 bg-charcoal-700 p-6">
                <!-- Uploading -->
                <template v-if="upload.state === 'uploading'">
                  <Icon name="loader-2" size="xl" class="animate-spin text-smoke-800" />
                  <p class="font-bold text-white">Uploading model...</p>
                </template>

                <!-- Success -->
                <template v-else-if="upload.state === 'success'">
                  <Icon name="check-circle" size="xl" class="text-emerald-400" />
                  <p class="font-bold text-white">Model uploaded!</p>
                  <div class="mt-2 flex items-center gap-2 rounded-lg bg-charcoal-600 p-3">
                    <div class="flex flex-col">
                      <span class="text-sm text-white">{{ upload.filename }}</span>
                      <span class="text-xs text-smoke-800">{{ upload.modelType }}</span>
                    </div>
                  </div>
                </template>

                <!-- Error -->
                <template v-else-if="upload.state === 'error'">
                  <Icon name="x-circle" size="xl" class="text-red-400" />
                  <p class="font-bold text-white">Upload failed</p>
                  <p v-if="upload.error" class="text-xs text-smoke-800">{{ upload.error }}</p>
                </template>

                <!-- Idle -->
                <template v-else>
                  <Icon name="upload" size="xl" class="text-smoke-800" />
                  <p class="text-sm text-white">{{ upload.filename }}</p>
                  <p class="text-xs text-smoke-800">{{ upload.modelType }}</p>
                  <button class="mt-2 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500">
                    Upload
                  </button>
                </template>
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- TAB 7: Manager Progress -->
        <TabsContent value="manager" class="space-y-6">
          <h2 class="text-lg font-semibold text-white">Manager Progress Dialog</h2>
          <p class="text-sm text-smoke-800">Extension manager task progress with logs.</p>

          <div class="grid gap-4">
            <div
              v-for="task in mockManagerTasks"
              :key="task.id"
              class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4"
            >
              <div class="mb-3 flex items-center gap-2">
                <span
                  class="rounded px-2 py-0.5 text-xs font-medium capitalize"
                  :class="{
                    'bg-yellow-500/20 text-yellow-400': task.status === 'pending',
                    'bg-blue-500/20 text-blue-400': task.status === 'running',
                    'bg-emerald-500/20 text-emerald-400': task.status === 'completed',
                    'bg-red-500/20 text-red-400': task.status === 'failed',
                  }"
                >
                  {{ task.status }}
                </span>
              </div>

              <!-- Task Panel -->
              <div class="rounded-lg border border-charcoal-600 bg-charcoal-700">
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-charcoal-600 p-3">
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-white">{{ task.taskName }}</span>
                    <span class="text-xs text-smoke-800">
                      {{ task.status === 'running' ? 'In progress' : task.status === 'completed' ? 'Completed ✓' : task.status === 'failed' ? 'Failed ✗' : 'Pending' }}
                    </span>
                  </div>
                  <button class="text-smoke-800 hover:text-white">
                    <Icon name="chevron-down" size="sm" />
                  </button>
                </div>

                <!-- Logs -->
                <div class="max-h-40 overflow-y-auto bg-black p-3">
                  <pre
                    v-for="(log, idx) in task.logs"
                    :key="idx"
                    class="whitespace-pre-wrap break-words text-xs text-smoke-800"
                  >{{ log }}</pre>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- TAB 8: Error Dialog -->
        <TabsContent value="errors" class="space-y-6">
          <h2 class="text-lg font-semibold text-white">Error Dialog</h2>
          <p class="text-sm text-smoke-800">Execution error display with traceback and report options.</p>

          <div class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-6">
            <!-- Error content -->
            <div class="flex flex-col items-center gap-4 text-center">
              <Icon name="alert-circle" size="xl" class="text-red-400" />
              <div>
                <h3 class="text-lg font-bold text-white">{{ mockError.nodeType }}</h3>
                <p class="mt-1 max-w-xl break-words text-sm text-smoke-800">{{ mockError.exceptionMessage }}</p>
              </div>

              <div class="flex gap-2">
                <button class="text-sm text-blue-400 hover:underline">Show Report</button>
                <button class="text-sm text-blue-400 hover:underline">Help Fix</button>
              </div>

              <!-- Traceback -->
              <div class="mt-4 w-full max-w-2xl rounded-lg border border-charcoal-600 bg-black p-4 text-left">
                <pre
                  v-for="(line, idx) in mockError.traceback"
                  :key="idx"
                  class="whitespace-pre-wrap break-words text-xs text-smoke-800"
                >{{ line }}</pre>
              </div>

              <div class="flex gap-2">
                <button class="rounded bg-charcoal-600 px-4 py-2 text-sm text-white hover:bg-charcoal-500">
                  Find Issue
                </button>
                <button class="rounded bg-charcoal-600 px-4 py-2 text-sm text-white hover:bg-charcoal-500">
                  Copy to Clipboard
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- TAB 9: WebSocket Status -->
        <TabsContent value="websocket" class="space-y-6">
          <h2 class="text-lg font-semibold text-white">WebSocket Connection Status</h2>
          <p class="text-sm text-smoke-800">Connection state indicators.</p>

          <div class="grid gap-4 lg:grid-cols-2">
            <div
              v-for="ws in mockWsStatuses"
              :key="ws.status"
              class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4"
            >
              <div class="mb-3 flex items-center gap-2">
                <span
                  class="rounded px-2 py-0.5 text-xs font-medium capitalize"
                  :class="{
                    'bg-emerald-500/20 text-emerald-400': ws.status === 'connected',
                    'bg-yellow-500/20 text-yellow-400': ws.status === 'connecting',
                    'bg-charcoal-400/50 text-smoke-600': ws.status === 'disconnected',
                    'bg-red-500/20 text-red-400': ws.status === 'error',
                  }"
                >
                  {{ ws.status }}
                </span>
              </div>

              <!-- Status indicator -->
              <div class="flex items-center gap-3 rounded-lg border border-charcoal-600 bg-charcoal-700 p-4">
                <Icon
                  :name="wsStatusIcon(ws.status)"
                  size="lg"
                  :class="[
                    wsStatusColor(ws.status),
                    ws.status === 'connecting' && 'animate-spin'
                  ]"
                />
                <span class="text-sm text-white">{{ ws.label }}</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
