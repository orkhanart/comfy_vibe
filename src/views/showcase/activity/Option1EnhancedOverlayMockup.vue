<script setup lang="ts">
/**
 * Option 1: Enhanced Queue Overlay + Smart Notifications
 *
 * Demo implementation showing:
 * - Queue progress overlay with downloads/manager indicators
 * - Unified toast notifications (3s info, 5s success, sticky error)
 * - Optional sound notifications
 * - Full workflow editor UI mockup
 */

import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { Icon } from '@/components/ui/icon'

// Types
type JobState = 'pending' | 'running' | 'completed' | 'failed'
type DownloadStatus = 'in_progress' | 'paused' | 'completed' | 'error'
type ManagerStatus = 'idle' | 'installing' | 'completed' | 'failed'
type ToastType = 'info' | 'success' | 'error' | 'warning'

interface Job {
  id: string
  name: string
  state: JobState
  progress: number
  currentNode: string
}

interface Download {
  id: string
  name: string
  status: DownloadStatus
  progress: number
}

interface ManagerTask {
  id: string
  name: string
  status: ManagerStatus
  progress: number
}

interface Toast {
  id: string
  type: ToastType
  message: string
  action?: { label: string; onClick: () => void }
  sticky?: boolean
}

// State
const jobs = ref<Job[]>([
  { id: '1', name: 'Portrait Enhancement', state: 'running', progress: 67, currentNode: 'KSampler' },
  { id: '2', name: 'Background Removal', state: 'pending', progress: 0, currentNode: '' },
])

const downloads = ref<Download[]>([
  { id: 'd1', name: 'sd_xl_base.safetensors', status: 'in_progress', progress: 45 },
])

const managerTasks = ref<ManagerTask[]>([
  { id: 'm1', name: 'ComfyUI-Impact-Pack', status: 'installing', progress: 60 },
  { id: 'm2', name: 'ComfyUI-AnimateDiff', status: 'installing', progress: 30 },
])

const toasts = ref<Toast[]>([])
const completedJobs = ref<Job[]>([])

// UI State
const isOverlayExpanded = ref(false)
const isOverlayHovered = ref(false)
const soundEnabled = ref(true)
const showSettings = ref(false)

// Computed
const runningJob = computed(() => jobs.value.find(j => j.state === 'running'))
const queuedCount = computed(() => jobs.value.filter(j => j.state === 'pending').length)
const runningCount = computed(() => jobs.value.filter(j => j.state === 'running').length)
const activeDownloads = computed(() => downloads.value.filter(d => d.status === 'in_progress' || d.status === 'paused'))
const activeManagerTasks = computed(() => managerTasks.value.filter(m => m.status === 'installing'))
const hasActiveJobs = computed(() => runningCount.value > 0 || queuedCount.value > 0)
const showOverlay = computed(() => hasActiveJobs.value || activeDownloads.value.length > 0 || activeManagerTasks.value.length > 0 || completedJobs.value.length > 0)

// Toast System with unified timing
function addToast(type: ToastType, message: string, options?: { action?: Toast['action']; sticky?: boolean }) {
  const id = `toast-${Date.now()}`
  const toast: Toast = { id, type, message, ...options }
  toasts.value.push(toast)

  // Auto-dismiss based on type (unless sticky)
  if (!options?.sticky) {
    const duration = type === 'info' ? 3000 : type === 'success' ? 5000 : 5000
    setTimeout(() => removeToast(id), duration)
  }

  // Play sound if enabled
  if (soundEnabled.value) {
    playSound(type)
  }
}

function removeToast(id: string) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

function playSound(type: ToastType) {
  // In real implementation, would play actual sounds
  console.log(`🔔 Sound: ${type}`)
}

// Simulation
const nodeNames = ['Load Image', 'CLIP Encode', 'KSampler', 'VAE Decode', 'Save Image']
let animationInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  animationInterval = setInterval(() => {
    // Animate job progress
    const job = runningJob.value
    if (job) {
      job.progress += Math.random() * 3 + 1
      if (job.progress >= 100) {
        job.state = 'completed'
        completedJobs.value.unshift({ ...job })
        jobs.value = jobs.value.filter(j => j.id !== job.id)

        addToast('success', `✓ ${job.name} completed`)

        // Start next job
        const next = jobs.value.find(j => j.state === 'pending')
        if (next) {
          next.state = 'running'
          next.currentNode = nodeNames[0]
        }
      } else {
        job.currentNode = nodeNames[Math.floor((job.progress / 100) * nodeNames.length)]
      }
    }

    // Animate downloads
    downloads.value.forEach(d => {
      if (d.status === 'in_progress') {
        d.progress += Math.random() * 2
        if (d.progress >= 100) {
          d.status = 'completed'
          addToast('success', `↓ ${d.name} downloaded`)
        }
      }
    })

    // Animate manager
    managerTasks.value.forEach(m => {
      if (m.status === 'installing') {
        m.progress += Math.random() * 1.5
        if (m.progress >= 100) {
          m.status = 'completed'
          addToast('success', `⚙ ${m.name} installed`, {
            action: { label: 'Restart', onClick: () => addToast('info', 'Restarting...') },
            sticky: true
          })
        }
      }
    })
  }, 200)
})

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval)
})

// Actions
function addJob() {
  const id = `job-${Date.now()}`
  const names = ['Style Transfer', 'Upscale 4x', 'Face Restore', 'Inpainting']
  jobs.value.push({
    id,
    name: names[Math.floor(Math.random() * names.length)],
    state: runningJob.value ? 'pending' : 'running',
    progress: 0,
    currentNode: runningJob.value ? '' : nodeNames[0],
  })
  addToast('info', 'Job added to queue')
}

function addDownload() {
  const id = `d-${Date.now()}`
  const names = ['vae-ft-mse.safetensors', 'clip_l.safetensors', 'control_depth.pth']
  downloads.value.push({
    id,
    name: names[Math.floor(Math.random() * names.length)],
    status: 'in_progress',
    progress: 0,
  })
  addToast('info', 'Download started')
}

function triggerError() {
  addToast('error', '✕ Job failed: CUDA out of memory', {
    action: { label: 'View Details', onClick: () => addToast('info', 'Opening error details...') },
    sticky: true
  })
}

function interruptJob() {
  const job = runningJob.value
  if (job) {
    jobs.value = jobs.value.filter(j => j.id !== job.id)
    addToast('warning', `Job interrupted: ${job.name}`)
    const next = jobs.value.find(j => j.state === 'pending')
    if (next) {
      next.state = 'running'
      next.currentNode = nodeNames[0]
    }
  }
}

function clearQueue() {
  jobs.value = jobs.value.filter(j => j.state === 'running')
  addToast('info', 'Queue cleared')
}
</script>

<template>
  <div class="flex h-screen flex-col bg-charcoal-950">
    <!-- Top Menu Bar (like ComfyUI TopMenuSection) -->
    <div class="relative z-20 flex items-start justify-between border-b border-charcoal-600 bg-charcoal-900 px-4 py-2">
      <!-- Left: Navigation + Title -->
      <div class="flex items-center gap-4 pt-2">
        <a href="/showcase/activity" class="text-smoke-800 hover:text-white">
          <Icon name="arrow-left" size="sm" />
        </a>
        <span class="text-sm font-medium text-white">Option 1: Enhanced Overlay Demo</span>
      </div>

      <!-- Right: Actionbar + Queue Overlay -->
      <div class="flex flex-col items-end gap-1">
        <!-- Actionbar -->
        <div class="flex h-12 items-center gap-2 rounded-lg border border-charcoal-600 bg-charcoal-800 px-3 shadow-lg">
          <!-- Demo controls -->
          <button
            class="rounded bg-charcoal-600 px-2 py-1 text-xs text-white hover:bg-charcoal-500"
            @click="addJob"
          >
            + Job
          </button>
          <button
            class="rounded bg-charcoal-600 px-2 py-1 text-xs text-white hover:bg-charcoal-500"
            @click="addDownload"
          >
            + Download
          </button>
          <button
            class="rounded bg-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30"
            @click="triggerError"
          >
            Trigger Error
          </button>

          <div class="mx-2 h-6 w-px bg-charcoal-600" />

          <!-- Run button -->
          <button
            class="flex items-center gap-2 rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            @click="addJob"
          >
            <Icon name="play" size="sm" />
            Run
          </button>

          <div class="h-6 w-px bg-charcoal-600" />

          <!-- History toggle with badge -->
          <button
            class="relative flex h-8 w-8 items-center justify-center rounded transition-colors"
            :class="isOverlayExpanded ? 'bg-charcoal-500 text-white' : 'text-smoke-800 hover:bg-charcoal-600 hover:text-white'"
            @click="isOverlayExpanded = !isOverlayExpanded"
          >
            <Icon name="history" size="sm" />
            <span
              v-if="queuedCount > 0"
              class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-medium text-white"
            >
              {{ queuedCount }}
            </span>
          </button>

          <!-- Sound toggle -->
          <button
            class="flex h-8 w-8 items-center justify-center rounded transition-colors"
            :class="soundEnabled ? 'text-emerald-400' : 'text-smoke-800'"
            @click="soundEnabled = !soundEnabled"
            :title="soundEnabled ? 'Sound ON' : 'Sound OFF'"
          >
            <Icon :name="soundEnabled ? 'volume-2' : 'volume-x'" size="sm" />
          </button>
        </div>

        <!-- Enhanced Queue Overlay -->
        <div
          v-if="showOverlay"
          class="flex max-h-[70vh] w-[380px] flex-col overflow-hidden rounded-lg border transition-all duration-200"
          :class="isOverlayHovered || isOverlayExpanded
            ? 'border-charcoal-400 bg-charcoal-800 shadow-xl'
            : 'border-transparent bg-charcoal-800/90'"
          @mouseenter="isOverlayHovered = true"
          @mouseleave="isOverlayHovered = false"
        >
          <!-- EXPANDED VIEW -->
          <template v-if="isOverlayExpanded">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-charcoal-600 px-3 py-2">
              <span class="text-sm font-medium text-white">
                {{ hasActiveJobs ? `${runningCount + queuedCount} Active Jobs` : 'Activity' }}
              </span>
              <button class="text-xs text-smoke-800 hover:text-white" @click="clearQueue">
                Clear Queue
              </button>
            </div>

            <!-- Job List -->
            <div class="flex-1 overflow-y-auto p-2">
              <!-- Running -->
              <div v-if="runningJob" class="mb-2">
                <div class="mb-1 text-[10px] font-medium uppercase text-smoke-800">Running</div>
                <div class="relative overflow-hidden rounded border border-charcoal-500 bg-charcoal-700 p-2">
                  <div class="absolute inset-0 bg-blue-500/20" :style="{ width: `${runningJob.progress}%` }" />
                  <div class="relative flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Icon name="loader-2" size="sm" class="animate-spin text-blue-400" />
                      <span class="text-xs text-white">{{ runningJob.name }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-smoke-800">{{ Math.round(runningJob.progress) }}%</span>
                      <button
                        class="flex h-5 w-5 items-center justify-center rounded bg-red-500/20 hover:bg-red-500/30"
                        @click="interruptJob"
                      >
                        <Icon name="x" size="xs" class="text-white" />
                      </button>
                    </div>
                  </div>
                  <div class="relative mt-1 text-[10px] text-smoke-800">{{ runningJob.currentNode }}</div>
                </div>
              </div>

              <!-- Queued -->
              <div v-if="queuedCount > 0" class="mb-2">
                <div class="mb-1 text-[10px] font-medium uppercase text-smoke-800">Queued ({{ queuedCount }})</div>
                <div
                  v-for="job in jobs.filter(j => j.state === 'pending')"
                  :key="job.id"
                  class="mb-1 flex items-center justify-between rounded border border-charcoal-600 bg-charcoal-700 p-2"
                >
                  <div class="flex items-center gap-2">
                    <Icon name="clock" size="sm" class="text-yellow-400" />
                    <span class="text-xs text-white">{{ job.name }}</span>
                  </div>
                </div>
              </div>

              <!-- Completed -->
              <div v-if="completedJobs.length > 0" class="mb-2">
                <div class="mb-1 text-[10px] font-medium uppercase text-smoke-800">Completed ({{ completedJobs.length }})</div>
                <div
                  v-for="job in completedJobs.slice(0, 3)"
                  :key="job.id"
                  class="mb-1 flex items-center justify-between rounded border border-charcoal-600 bg-charcoal-700 p-2"
                >
                  <div class="flex items-center gap-2">
                    <Icon name="check" size="sm" class="text-emerald-400" />
                    <span class="text-xs text-white">{{ job.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Downloads Section (NEW) -->
            <div v-if="activeDownloads.length > 0" class="border-t border-charcoal-600 p-2">
              <div class="mb-1 flex items-center gap-2">
                <Icon name="download" size="sm" class="text-blue-400" />
                <span class="text-xs font-medium text-white">Downloads ({{ activeDownloads.length }})</span>
              </div>
              <div
                v-for="d in activeDownloads"
                :key="d.id"
                class="mb-1 rounded border border-charcoal-600 bg-charcoal-700 p-2"
              >
                <div class="flex items-center justify-between text-xs">
                  <span class="truncate text-white">{{ d.name }}</span>
                  <span class="text-smoke-800">{{ Math.round(d.progress) }}%</span>
                </div>
                <div class="mt-1 h-1 overflow-hidden rounded-full bg-charcoal-600">
                  <div class="h-full bg-blue-500 transition-[width]" :style="{ width: `${d.progress}%` }" />
                </div>
              </div>
            </div>

            <!-- Manager Section (NEW) -->
            <div v-if="activeManagerTasks.length > 0" class="border-t border-charcoal-600 p-2">
              <div class="mb-1 flex items-center gap-2">
                <Icon name="settings" size="sm" class="animate-spin text-purple-400" />
                <span class="text-xs font-medium text-white">Installing ({{ activeManagerTasks.length }})</span>
              </div>
              <div
                v-for="m in activeManagerTasks"
                :key="m.id"
                class="mb-1 rounded border border-charcoal-600 bg-charcoal-700 p-2"
              >
                <div class="flex items-center justify-between text-xs">
                  <span class="truncate text-white">{{ m.name }}</span>
                  <span class="text-smoke-800">{{ Math.round(m.progress) }}%</span>
                </div>
                <div class="mt-1 h-1 overflow-hidden rounded-full bg-charcoal-600">
                  <div class="h-full bg-purple-500 transition-[width]" :style="{ width: `${m.progress}%` }" />
                </div>
              </div>
            </div>
          </template>

          <!-- COLLAPSED ACTIVE VIEW -->
          <template v-else-if="runningJob">
            <div class="flex flex-col gap-3 p-3">
              <!-- Progress bars -->
              <div class="flex flex-col gap-1">
                <div class="relative h-2 w-full overflow-hidden rounded-full border border-charcoal-500 bg-charcoal-600">
                  <div
                    class="absolute inset-0 h-full rounded-full bg-blue-500 transition-[width]"
                    :style="{ width: `${runningJob.progress}%` }"
                  />
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-white">
                    Total: <span class="font-bold">{{ Math.round(runningJob.progress) }}%</span>
                  </span>
                  <span class="text-smoke-800">{{ runningJob.currentNode }}</span>
                </div>
              </div>

              <!-- Bottom row (hover reveals) -->
              <div
                class="flex items-center justify-between gap-2 text-xs transition-opacity duration-200"
                :class="isOverlayHovered ? 'opacity-100' : 'opacity-0'"
              >
                <div class="flex items-center gap-3">
                  <span class="text-white">
                    <span class="font-bold">{{ runningCount }}</span> Running
                  </span>
                  <span class="text-white">
                    <span class="font-bold">{{ queuedCount }}</span> Queued
                  </span>
                </div>
                <button
                  class="rounded bg-charcoal-500 px-2 py-1 text-white hover:bg-charcoal-400"
                  @click="isOverlayExpanded = true"
                >
                  View All
                </button>
              </div>

              <!-- Activity indicators (NEW - always visible) -->
              <div class="flex items-center gap-3 border-t border-charcoal-600 pt-2 text-xs">
                <button
                  v-if="activeDownloads.length > 0"
                  class="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                  @click="isOverlayExpanded = true"
                >
                  <Icon name="download" size="xs" />
                  <span>{{ activeDownloads.length }} downloading</span>
                </button>
                <button
                  v-if="activeManagerTasks.length > 0"
                  class="flex items-center gap-1 text-purple-400 hover:text-purple-300"
                  @click="isOverlayExpanded = true"
                >
                  <Icon name="settings" size="xs" class="animate-spin" />
                  <span>{{ activeManagerTasks.length }} installing</span>
                </button>
              </div>
            </div>
          </template>

          <!-- COMPLETION SUMMARY -->
          <template v-else-if="completedJobs.length > 0">
            <button
              class="flex w-full items-center justify-between p-3 text-left hover:bg-charcoal-700"
              @click="isOverlayExpanded = true"
            >
              <div class="flex items-center gap-2">
                <div class="flex -space-x-2">
                  <div v-for="i in Math.min(3, completedJobs.length)" :key="i" class="h-6 w-6 rounded bg-emerald-500/30" />
                </div>
                <span class="text-sm text-white">
                  <span class="font-bold">{{ completedJobs.length }}</span> jobs completed
                </span>
              </div>
              <Icon name="chevron-down" size="sm" class="text-smoke-800" />
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Fake Canvas Area -->
    <div class="relative flex-1 overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <div class="grid h-full w-full grid-cols-8 gap-4 p-8">
          <div v-for="i in 32" :key="i" class="rounded-lg border border-dashed border-charcoal-600 bg-charcoal-800/50" />
        </div>
      </div>

      <!-- Info Panel -->
      <div class="absolute left-8 top-8 max-w-md rounded-lg border border-charcoal-600 bg-charcoal-800/95 p-4 backdrop-blur">
        <h2 class="mb-2 text-sm font-semibold text-white">Option 1: Enhanced Queue Overlay + Smart Notifications</h2>
        <p class="mb-3 text-xs text-smoke-800">
          This demo shows the enhanced queue overlay with:
        </p>
        <ul class="space-y-1 text-xs text-smoke-800">
          <li>• <strong class="text-blue-400">Downloads indicator</strong> - Shows active model downloads</li>
          <li>• <strong class="text-purple-400">Manager indicator</strong> - Shows extension installations</li>
          <li>• <strong class="text-emerald-400">Smart toasts</strong> - 3s info, 5s success, sticky errors</li>
          <li>• <strong class="text-yellow-400">Sound toggle</strong> - Optional audio feedback</li>
        </ul>
        <div class="mt-3 flex items-center gap-2 rounded bg-charcoal-700 p-2 text-xs">
          <Icon :name="soundEnabled ? 'volume-2' : 'volume-x'" size="sm" :class="soundEnabled ? 'text-emerald-400' : 'text-smoke-800'" />
          <span class="text-smoke-800">Sound notifications: <strong class="text-white">{{ soundEnabled ? 'ON' : 'OFF' }}</strong></span>
        </div>
      </div>
    </div>

    <!-- Toast Stack (Bottom Right) -->
    <div class="fixed bottom-4 right-4 z-50 flex w-[350px] flex-col gap-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-start gap-3 rounded-lg border p-3 shadow-lg backdrop-blur"
          :class="{
            'border-blue-500/30 bg-blue-500/10': toast.type === 'info',
            'border-emerald-500/30 bg-emerald-500/10': toast.type === 'success',
            'border-red-500/30 bg-red-500/10': toast.type === 'error',
            'border-yellow-500/30 bg-yellow-500/10': toast.type === 'warning',
          }"
        >
          <Icon
            :name="toast.type === 'info' ? 'info' : toast.type === 'success' ? 'check-circle' : toast.type === 'error' ? 'x-circle' : 'alert-triangle'"
            size="sm"
            :class="{
              'text-blue-400': toast.type === 'info',
              'text-emerald-400': toast.type === 'success',
              'text-red-400': toast.type === 'error',
              'text-yellow-400': toast.type === 'warning',
            }"
          />
          <div class="flex-1">
            <p class="text-sm text-white">{{ toast.message }}</p>
            <button
              v-if="toast.action"
              class="mt-1 text-xs text-blue-400 hover:text-blue-300"
              @click="toast.action.onClick"
            >
              {{ toast.action.label }}
            </button>
          </div>
          <button class="text-smoke-800 hover:text-white" @click="removeToast(toast.id)">
            <Icon name="x" size="sm" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
