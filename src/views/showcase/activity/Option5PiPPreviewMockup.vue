<script setup lang="ts">
/**
 * Option 5: Enhanced Queue Overlay + PiP Preview
 *
 * Demo implementation showing:
 * - Enhanced queue overlay (same as Option 1)
 * - Floating Picture-in-Picture preview window
 * - Draggable + resizable PiP
 * - Auto-PiP setting
 * - Live preview simulation
 */

import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { Icon } from '@/components/ui/icon'

// Types
type JobState = 'pending' | 'running' | 'completed' | 'failed'

interface Job {
  id: string
  name: string
  state: JobState
  progress: number
  currentNode: string
  currentStep: number
  totalSteps: number
}

// State
const jobs = ref<Job[]>([
  { id: '1', name: 'Portrait Enhancement', state: 'running', progress: 0, currentNode: 'KSampler', currentStep: 0, totalSteps: 20 },
  { id: '2', name: 'Background Removal', state: 'pending', progress: 0, currentNode: '', currentStep: 0, totalSteps: 15 },
  { id: '3', name: 'Style Transfer', state: 'pending', progress: 0, currentNode: '', currentStep: 0, totalSteps: 25 },
])

const completedJobs = ref<Job[]>([])

// UI State
const isOverlayExpanded = ref(false)
const isOverlayHovered = ref(false)

// PiP State
const pipEnabled = ref(true)
const pipPosition = reactive({ x: 0, y: 0 })
const pipSize = reactive({ width: 280, height: 320 })
const pipIsDragging = ref(false)
const pipIsResizing = ref(false)
const pipIsPinned = ref(false)
const autoPiP = ref(true)

// Preview simulation
const previewFrame = ref(0)
const previewImages = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #e94560 100%)',
  'linear-gradient(135deg, #e94560 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #e94560 20%, #f5a623 50%, #0f3460 100%)',
  'linear-gradient(135deg, #f5a623 0%, #e94560 30%, #16213e 100%)',
]

// Computed
const runningJob = computed(() => jobs.value.find(j => j.state === 'running'))
const queuedCount = computed(() => jobs.value.filter(j => j.state === 'pending').length)
const runningCount = computed(() => jobs.value.filter(j => j.state === 'running').length)
const hasActiveJobs = computed(() => runningCount.value > 0 || queuedCount.value > 0)
const showOverlay = computed(() => hasActiveJobs.value || completedJobs.value.length > 0)
const showPiP = computed(() => pipEnabled.value && runningJob.value)

// Simulation
const nodeNames = ['Load Image', 'CLIP Encode', 'KSampler', 'VAE Decode', 'Save Image']
let animationInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // Set initial PiP position
  pipPosition.x = window.innerWidth - pipSize.width - 20
  pipPosition.y = 80

  animationInterval = setInterval(() => {
    const job = runningJob.value
    if (job) {
      job.currentStep += 1
      job.progress = (job.currentStep / job.totalSteps) * 100

      // Update preview frame
      previewFrame.value = (previewFrame.value + 1) % previewImages.length

      if (job.currentStep >= job.totalSteps) {
        job.state = 'completed'
        completedJobs.value.unshift({ ...job })
        jobs.value = jobs.value.filter(j => j.id !== job.id)

        // Start next job
        const next = jobs.value.find(j => j.state === 'pending')
        if (next) {
          next.state = 'running'
          next.currentNode = nodeNames[0]
          next.currentStep = 0
        }
      } else {
        const nodeIndex = Math.floor((job.progress / 100) * nodeNames.length)
        job.currentNode = nodeNames[Math.min(nodeIndex, nodeNames.length - 1)]
      }
    }
  }, 300)
})

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval)
})

// PiP Drag handling
let dragStart = { x: 0, y: 0 }
let dragOffset = { x: 0, y: 0 }

function startDrag(e: MouseEvent) {
  if (pipIsResizing.value) return
  pipIsDragging.value = true
  dragStart = { x: e.clientX, y: e.clientY }
  dragOffset = { x: pipPosition.x, y: pipPosition.y }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  if (!pipIsDragging.value) return
  const dx = e.clientX - dragStart.x
  const dy = e.clientY - dragStart.y
  pipPosition.x = Math.max(0, Math.min(window.innerWidth - pipSize.width, dragOffset.x + dx))
  pipPosition.y = Math.max(0, Math.min(window.innerHeight - pipSize.height, dragOffset.y + dy))
}

function stopDrag() {
  pipIsDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// PiP Resize handling
let resizeStart = { x: 0, y: 0 }
let resizeOffset = { width: 0, height: 0 }

function startResize(e: MouseEvent) {
  e.stopPropagation()
  pipIsResizing.value = true
  resizeStart = { x: e.clientX, y: e.clientY }
  resizeOffset = { width: pipSize.width, height: pipSize.height }
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

function onResize(e: MouseEvent) {
  if (!pipIsResizing.value) return
  const dx = e.clientX - resizeStart.x
  const dy = e.clientY - resizeStart.y
  pipSize.width = Math.max(200, Math.min(500, resizeOffset.width + dx))
  pipSize.height = Math.max(240, Math.min(600, resizeOffset.height + dy))
}

function stopResize() {
  pipIsResizing.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
}

// Actions
function addJob() {
  const id = `job-${Date.now()}`
  const names = ['Upscale 4x', 'Face Restore', 'Inpainting', 'ControlNet']
  const steps = [15, 20, 25, 30]
  jobs.value.push({
    id,
    name: names[Math.floor(Math.random() * names.length)],
    state: runningJob.value ? 'pending' : 'running',
    progress: 0,
    currentNode: runningJob.value ? '' : nodeNames[0],
    currentStep: 0,
    totalSteps: steps[Math.floor(Math.random() * steps.length)],
  })
}

function interruptJob() {
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

function skipToNext() {
  const job = runningJob.value
  if (job) {
    job.currentStep = job.totalSteps - 1
  }
}

function clearQueue() {
  jobs.value = jobs.value.filter(j => j.state === 'running')
}
</script>

<template>
  <div class="flex h-screen flex-col bg-charcoal-950">
    <!-- Top Menu Bar -->
    <div class="relative z-20 flex items-start justify-between border-b border-charcoal-600 bg-charcoal-900 px-4 py-2">
      <!-- Left: Navigation + Title -->
      <div class="flex items-center gap-4 pt-2">
        <a href="/showcase/activity" class="text-smoke-800 hover:text-white">
          <Icon name="arrow-left" size="sm" />
        </a>
        <span class="text-sm font-medium text-white">Option 5: PiP Preview Demo</span>
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

          <!-- History toggle -->
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

          <!-- PiP Toggle (NEW) -->
          <button
            class="flex h-8 w-8 items-center justify-center rounded transition-colors"
            :class="pipEnabled ? 'bg-blue-500/20 text-blue-400' : 'text-smoke-800 hover:bg-charcoal-600 hover:text-white'"
            @click="pipEnabled = !pipEnabled"
            title="Toggle Picture-in-Picture"
          >
            <Icon name="picture-in-picture-2" size="sm" />
            <span v-if="pipEnabled && runningJob" class="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-blue-400" />
          </button>

          <!-- Auto-PiP toggle -->
          <button
            class="flex h-8 items-center gap-1 rounded px-2 text-xs transition-colors"
            :class="autoPiP ? 'bg-emerald-500/20 text-emerald-400' : 'text-smoke-800 hover:text-white'"
            @click="autoPiP = !autoPiP"
            title="Auto-show PiP when generation starts"
          >
            <Icon name="zap" size="xs" />
            Auto
          </button>
        </div>

        <!-- Queue Overlay (simplified for this demo) -->
        <div
          v-if="showOverlay && !pipEnabled"
          class="flex w-[350px] flex-col overflow-hidden rounded-lg border transition-all duration-200"
          :class="isOverlayHovered || isOverlayExpanded
            ? 'border-charcoal-400 bg-charcoal-800 shadow-xl'
            : 'border-transparent bg-charcoal-800/90'"
          @mouseenter="isOverlayHovered = true"
          @mouseleave="isOverlayHovered = false"
        >
          <template v-if="runningJob">
            <div class="p-3">
              <div class="relative h-2 w-full overflow-hidden rounded-full border border-charcoal-500 bg-charcoal-600">
                <div
                  class="absolute inset-0 h-full rounded-full bg-blue-500 transition-[width]"
                  :style="{ width: `${runningJob.progress}%` }"
                />
              </div>
              <div class="mt-1 flex items-center justify-between text-xs">
                <span class="text-white">{{ Math.round(runningJob.progress) }}%</span>
                <span class="text-smoke-800">{{ runningJob.currentNode }} • Step {{ runningJob.currentStep }}/{{ runningJob.totalSteps }}</span>
              </div>
            </div>
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
        <h2 class="mb-2 text-sm font-semibold text-white">Option 5: Enhanced Overlay + PiP Preview</h2>
        <p class="mb-3 text-xs text-smoke-800">
          This demo adds a Picture-in-Picture preview window:
        </p>
        <ul class="space-y-1 text-xs text-smoke-800">
          <li>• <strong class="text-blue-400">PiP toggle</strong> - Enable/disable floating preview</li>
          <li>• <strong class="text-emerald-400">Auto-PiP</strong> - Auto-show when generation starts</li>
          <li>• <strong class="text-yellow-400">Draggable</strong> - Move PiP anywhere on screen</li>
          <li>• <strong class="text-purple-400">Resizable</strong> - Drag corner to resize</li>
          <li>• <strong class="text-white">Pin</strong> - Keep PiP always on top</li>
        </ul>
      </div>

      <!-- PiP Preview Window -->
      <Transition name="pip">
        <div
          v-if="showPiP"
          class="fixed z-30 overflow-hidden rounded-lg border shadow-2xl"
          :class="[
            pipIsDragging || pipIsResizing ? 'cursor-grabbing' : 'cursor-grab',
            pipIsPinned ? 'border-yellow-500/50 bg-charcoal-800' : 'border-charcoal-500 bg-charcoal-800'
          ]"
          :style="{
            left: `${pipPosition.x}px`,
            top: `${pipPosition.y}px`,
            width: `${pipSize.width}px`,
            height: `${pipSize.height}px`,
          }"
          @mousedown="startDrag"
        >
          <!-- PiP Header -->
          <div class="flex items-center justify-between border-b border-charcoal-600 bg-charcoal-900 px-3 py-2">
            <span class="text-xs font-medium text-white">{{ runningJob?.name || 'Preview' }}</span>
            <div class="flex items-center gap-1">
              <!-- Pin button -->
              <button
                class="flex h-5 w-5 items-center justify-center rounded transition-colors"
                :class="pipIsPinned ? 'text-yellow-400' : 'text-smoke-800 hover:text-white'"
                @click.stop="pipIsPinned = !pipIsPinned"
                title="Pin to top"
              >
                <Icon name="pin" size="xs" />
              </button>
              <!-- Expand button -->
              <button
                class="flex h-5 w-5 items-center justify-center rounded text-smoke-800 hover:text-white"
                @click.stop
                title="Expand to gallery"
              >
                <Icon name="maximize-2" size="xs" />
              </button>
              <!-- Close button -->
              <button
                class="flex h-5 w-5 items-center justify-center rounded text-smoke-800 hover:text-red-400"
                @click.stop="pipEnabled = false"
                title="Close PiP"
              >
                <Icon name="x" size="xs" />
              </button>
            </div>
          </div>

          <!-- Preview Area -->
          <div
            class="relative flex items-center justify-center overflow-hidden"
            :style="{ height: `${pipSize.height - 120}px` }"
          >
            <!-- Simulated preview image (gradient animation) -->
            <div
              class="absolute inset-0 transition-all duration-500"
              :style="{ background: previewImages[previewFrame] }"
            />
            <!-- Noise overlay -->
            <div class="absolute inset-0 opacity-30" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');" />
            <!-- Step indicator -->
            <div class="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
              Step {{ runningJob?.currentStep || 0 }}/{{ runningJob?.totalSteps || 0 }}
            </div>
          </div>

          <!-- Progress Section -->
          <div class="border-t border-charcoal-600 p-3">
            <!-- Progress bar -->
            <div class="mb-2">
              <div class="relative h-2 w-full overflow-hidden rounded-full bg-charcoal-600">
                <div
                  class="absolute inset-0 h-full rounded-full bg-blue-500 transition-[width]"
                  :style="{ width: `${runningJob?.progress || 0}%` }"
                />
              </div>
              <div class="mt-1 flex items-center justify-between text-[10px]">
                <span class="text-white font-medium">{{ Math.round(runningJob?.progress || 0) }}%</span>
                <span class="text-smoke-800">{{ runningJob?.currentNode }}</span>
              </div>
            </div>

            <!-- Queue info + actions -->
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-smoke-800">
                {{ queuedCount }} more queued
              </span>
              <div class="flex items-center gap-1">
                <button
                  class="rounded bg-charcoal-600 px-2 py-1 text-[10px] text-white hover:bg-charcoal-500"
                  @click.stop="skipToNext"
                  title="Skip to next"
                >
                  <Icon name="skip-forward" size="xs" />
                </button>
                <button
                  class="rounded bg-red-500/20 px-2 py-1 text-[10px] text-red-400 hover:bg-red-500/30"
                  @click.stop="interruptJob"
                  title="Interrupt"
                >
                  <Icon name="square" size="xs" />
                </button>
              </div>
            </div>
          </div>

          <!-- Resize Handle -->
          <div
            class="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
            @mousedown.stop="startResize"
          >
            <svg class="h-full w-full text-charcoal-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22Z" />
            </svg>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.pip-enter-active {
  transition: all 0.3s ease-out;
}
.pip-leave-active {
  transition: all 0.2s ease-in;
}
.pip-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
.pip-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
</style>
