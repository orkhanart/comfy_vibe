<script setup lang="ts">
/**
 * Downloads Mockup
 *
 * Simulates model download manager:
 * - Multiple concurrent downloads
 * - Pause/resume/cancel controls
 * - Progress tracking with speed/ETA
 * - Download history
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'

type DownloadState = 'pending' | 'in_progress' | 'paused' | 'completed' | 'cancelled' | 'error'

interface Download {
  id: string
  url: string
  filename: string
  folder: string
  state: DownloadState
  progress: number
  downloadedBytes: number
  totalBytes: number
  speed: number
  startedAt?: Date
  completedAt?: Date
  error?: string
}

const downloads = ref<Download[]>([
  {
    id: 'd1',
    url: 'https://huggingface.co/stabilityai/sdxl/resolve/main/sd_xl_base_1.0.safetensors',
    filename: 'sd_xl_base_1.0.safetensors',
    folder: 'checkpoints',
    state: 'in_progress',
    progress: 34,
    downloadedBytes: 2.2 * 1024 * 1024 * 1024,
    totalBytes: 6.46 * 1024 * 1024 * 1024,
    speed: 45 * 1024 * 1024,
    startedAt: new Date(Date.now() - 120000),
  },
  {
    id: 'd2',
    url: 'https://civitai.com/models/detail-tweaker-xl',
    filename: 'detail_tweaker_xl_v1.2.safetensors',
    folder: 'loras',
    state: 'in_progress',
    progress: 78,
    downloadedBytes: 145 * 1024 * 1024,
    totalBytes: 186 * 1024 * 1024,
    speed: 32 * 1024 * 1024,
    startedAt: new Date(Date.now() - 60000),
  },
  {
    id: 'd3',
    url: 'https://huggingface.co/madebyollin/sdxl-vae-fp16-fix',
    filename: 'sdxl_vae_fp16.safetensors',
    folder: 'vae',
    state: 'paused',
    progress: 45,
    downloadedBytes: 150 * 1024 * 1024,
    totalBytes: 335 * 1024 * 1024,
    speed: 0,
    startedAt: new Date(Date.now() - 180000),
  },
  {
    id: 'd4',
    url: 'https://civitai.com/models/controlnet-canny',
    filename: 'controlnet_canny_xl.safetensors',
    folder: 'controlnet',
    state: 'pending',
    progress: 0,
    downloadedBytes: 0,
    totalBytes: 2.5 * 1024 * 1024 * 1024,
    speed: 0,
  },
])

const completedDownloads = ref<Download[]>([
  {
    id: 'c1',
    url: 'https://civitai.com/models/bad-hands',
    filename: 'bad_hands_5.pt',
    folder: 'embeddings',
    state: 'completed',
    progress: 100,
    downloadedBytes: 12 * 1024 * 1024,
    totalBytes: 12 * 1024 * 1024,
    speed: 0,
    completedAt: new Date(Date.now() - 600000),
  },
  {
    id: 'c2',
    url: 'https://huggingface.co/upscale-4x',
    filename: '4x_ultrasharp.pth',
    folder: 'upscale_models',
    state: 'completed',
    progress: 100,
    downloadedBytes: 64 * 1024 * 1024,
    totalBytes: 64 * 1024 * 1024,
    speed: 0,
    completedAt: new Date(Date.now() - 1200000),
  },
])

const failedDownloads = ref<Download[]>([
  {
    id: 'f1',
    url: 'https://civitai.com/models/realistic-vision',
    filename: 'realistic_vision_v6.safetensors',
    folder: 'checkpoints',
    state: 'error',
    progress: 23,
    downloadedBytes: 0.5 * 1024 * 1024 * 1024,
    totalBytes: 2.1 * 1024 * 1024 * 1024,
    speed: 0,
    error: 'Network error: Connection timed out',
  },
])

// View mode
const viewMode = ref<'active' | 'completed' | 'failed'>('active')

// Stats
const stats = computed(() => ({
  active: downloads.value.filter(d => ['in_progress', 'paused', 'pending'].includes(d.state)).length,
  completed: completedDownloads.value.length,
  failed: failedDownloads.value.length,
  totalSpeed: downloads.value.filter(d => d.state === 'in_progress').reduce((sum, d) => sum + d.speed, 0),
}))

// Animation
let animationInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  animationInterval = setInterval(() => {
    downloads.value.forEach(d => {
      if (d.state === 'in_progress') {
        // Simulate download progress
        const increment = (d.speed / 10) // per 100ms
        d.downloadedBytes = Math.min(d.totalBytes, d.downloadedBytes + increment)
        d.progress = (d.downloadedBytes / d.totalBytes) * 100

        // Vary speed slightly
        d.speed = d.speed * (0.95 + Math.random() * 0.1)

        // Complete download
        if (d.progress >= 100) {
          d.state = 'completed'
          d.completedAt = new Date()
          completedDownloads.value.unshift({ ...d })
          downloads.value = downloads.value.filter(dl => dl.id !== d.id)

          // Start next pending
          const nextPending = downloads.value.find(dl => dl.state === 'pending')
          if (nextPending) {
            nextPending.state = 'in_progress'
            nextPending.startedAt = new Date()
            nextPending.speed = 30 * 1024 * 1024 + Math.random() * 20 * 1024 * 1024
          }
        }
      }
    })
  }, 100)
})

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval)
})

// Actions
function pauseDownload(id: string) {
  const d = downloads.value.find(dl => dl.id === id)
  if (d) {
    d.state = 'paused'
    d.speed = 0
  }
}

function resumeDownload(id: string) {
  const d = downloads.value.find(dl => dl.id === id)
  if (d) {
    d.state = 'in_progress'
    d.speed = 30 * 1024 * 1024 + Math.random() * 20 * 1024 * 1024
  }
}

function cancelDownload(id: string) {
  downloads.value = downloads.value.filter(d => d.id !== id)
}

function retryDownload(id: string) {
  const d = failedDownloads.value.find(dl => dl.id === id)
  if (d) {
    failedDownloads.value = failedDownloads.value.filter(dl => dl.id !== id)
    downloads.value.push({
      ...d,
      state: 'pending',
      progress: 0,
      downloadedBytes: 0,
      error: undefined,
    })
  }
}

function removeFromHistory(id: string) {
  completedDownloads.value = completedDownloads.value.filter(d => d.id !== id)
}

function clearFailed() {
  failedDownloads.value = []
}

function addNewDownload() {
  const id = `d${Date.now()}`
  const models = [
    { filename: 'dreamshaper_xl.safetensors', folder: 'checkpoints', size: 6.5 * 1024 * 1024 * 1024 },
    { filename: 'film_grain_lora.safetensors', folder: 'loras', size: 150 * 1024 * 1024 },
    { filename: 'face_restore_v2.pth', folder: 'facerestore', size: 340 * 1024 * 1024 },
  ]
  const model = models[Math.floor(Math.random() * models.length)]

  const newDownload: Download = {
    id,
    url: `https://example.com/${model.filename}`,
    filename: model.filename,
    folder: model.folder,
    state: downloads.value.some(d => d.state === 'in_progress') ? 'pending' : 'in_progress',
    progress: 0,
    downloadedBytes: 0,
    totalBytes: model.size,
    speed: 0,
  }

  if (newDownload.state === 'in_progress') {
    newDownload.startedAt = new Date()
    newDownload.speed = 30 * 1024 * 1024 + Math.random() * 20 * 1024 * 1024
  }

  downloads.value.push(newDownload)
}

// Formatting
function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return bytes + ' B'
}

function formatSpeed(bytesPerSec: number): string {
  return formatSize(bytesPerSec) + '/s'
}

function formatEta(download: Download): string {
  if (download.speed <= 0) return '--'
  const remaining = download.totalBytes - download.downloadedBytes
  const seconds = Math.round(remaining / download.speed)
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

function formatTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return date.toLocaleDateString()
}

function stateIcon(state: DownloadState): string {
  switch (state) {
    case 'pending': return 'clock'
    case 'in_progress': return 'download'
    case 'paused': return 'pause'
    case 'completed': return 'check-circle'
    case 'cancelled': return 'x-circle'
    case 'error': return 'alert-circle'
  }
}

function stateColor(state: DownloadState): string {
  switch (state) {
    case 'pending': return 'text-yellow-400'
    case 'in_progress': return 'text-blue-400'
    case 'paused': return 'text-orange-400'
    case 'completed': return 'text-emerald-400'
    case 'cancelled': return 'text-smoke-600'
    case 'error': return 'text-red-400'
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
        <h1 class="text-sm font-medium text-white">Download Manager Demo</h1>
      </div>
      <div class="flex items-center gap-4 text-xs">
        <span v-if="stats.totalSpeed > 0" class="text-blue-400">
          <Icon name="download" size="sm" class="mr-1 inline" />
          {{ formatSpeed(stats.totalSpeed) }}
        </span>
        <button
          class="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500"
          @click="addNewDownload"
        >
          <Icon name="plus" size="sm" class="mr-1 inline" />
          Add Download
        </button>
      </div>
    </div>

    <div class="flex h-[calc(100vh-49px)]">
      <!-- Sidebar -->
      <div class="flex w-[400px] flex-col border-r border-charcoal-600 bg-charcoal-900">
        <!-- View tabs -->
        <div class="flex border-b border-charcoal-600">
          <button
            v-for="mode in (['active', 'completed', 'failed'] as const)"
            :key="mode"
            class="flex-1 px-3 py-2 text-xs font-medium capitalize transition-colors"
            :class="viewMode === mode
              ? 'border-b-2 border-blue-500 text-white'
              : 'text-smoke-800 hover:text-white'"
            @click="viewMode = mode"
          >
            {{ mode }}
            <span class="ml-1 rounded bg-charcoal-600 px-1.5 py-0.5 text-xs">
              {{ mode === 'active' ? stats.active : mode === 'completed' ? stats.completed : stats.failed }}
            </span>
          </button>
        </div>

        <!-- Download list -->
        <div class="flex-1 overflow-y-auto p-3">
          <!-- Active downloads -->
          <template v-if="viewMode === 'active'">
            <div v-if="downloads.length === 0" class="flex flex-col items-center justify-center py-12 text-smoke-800">
              <Icon name="inbox" size="xl" class="mb-2 opacity-30" />
              <p class="text-sm">No active downloads</p>
            </div>

            <div v-for="download in downloads" :key="download.id" class="mb-3">
              <div class="rounded-lg border border-charcoal-600 bg-charcoal-800 p-3">
                <!-- Header row -->
                <div class="mb-2 flex items-start justify-between">
                  <div class="flex items-center gap-2">
                    <Icon
                      :name="stateIcon(download.state)"
                      size="sm"
                      :class="[stateColor(download.state), download.state === 'in_progress' && 'animate-pulse']"
                    />
                    <div>
                      <p class="text-sm text-white">{{ download.filename }}</p>
                      <p class="text-xs text-smoke-800">{{ download.folder }}/</p>
                    </div>
                  </div>
                  <span class="text-xs capitalize" :class="stateColor(download.state)">
                    {{ download.state.replace('_', ' ') }}
                  </span>
                </div>

                <!-- Progress -->
                <div v-if="['in_progress', 'paused'].includes(download.state)" class="mb-2">
                  <div class="mb-1 flex items-center gap-2">
                    <Progress :model-value="download.progress" class="h-2 flex-1" />
                    <span class="min-w-[3rem] text-right text-xs text-smoke-800">
                      {{ Math.round(download.progress) }}%
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-xs text-smoke-800">
                    <span>{{ formatSize(download.downloadedBytes) }} / {{ formatSize(download.totalBytes) }}</span>
                    <span v-if="download.state === 'in_progress'">
                      {{ formatSpeed(download.speed) }} • ETA {{ formatEta(download) }}
                    </span>
                  </div>
                </div>

                <!-- Pending info -->
                <div v-else-if="download.state === 'pending'" class="mb-2 text-xs text-smoke-800">
                  {{ formatSize(download.totalBytes) }} • Waiting in queue
                </div>

                <!-- Controls -->
                <div class="flex items-center gap-2">
                  <button
                    v-if="download.state === 'in_progress'"
                    class="flex h-7 w-7 items-center justify-center rounded bg-charcoal-600 hover:bg-charcoal-500"
                    title="Pause"
                    @click="pauseDownload(download.id)"
                  >
                    <Icon name="pause" size="sm" class="text-white" />
                  </button>
                  <button
                    v-if="download.state === 'paused'"
                    class="flex h-7 w-7 items-center justify-center rounded bg-charcoal-600 hover:bg-charcoal-500"
                    title="Resume"
                    @click="resumeDownload(download.id)"
                  >
                    <Icon name="play" size="sm" class="text-white" />
                  </button>
                  <button
                    class="flex h-7 w-7 items-center justify-center rounded bg-red-500/20 hover:bg-red-500/30"
                    title="Cancel"
                    @click="cancelDownload(download.id)"
                  >
                    <Icon name="x" size="sm" class="text-white" />
                  </button>
                  <button
                    class="ml-auto text-xs text-smoke-800 hover:text-white"
                    title="Copy URL"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- Completed downloads -->
          <template v-else-if="viewMode === 'completed'">
            <div v-if="completedDownloads.length === 0" class="flex flex-col items-center justify-center py-12 text-smoke-800">
              <Icon name="inbox" size="xl" class="mb-2 opacity-30" />
              <p class="text-sm">No completed downloads</p>
            </div>

            <div v-for="download in completedDownloads" :key="download.id" class="mb-2">
              <div class="flex items-center justify-between rounded-lg border border-charcoal-600 bg-charcoal-800 p-3">
                <div class="flex items-center gap-2">
                  <Icon name="check-circle" size="sm" class="text-emerald-400" />
                  <div>
                    <p class="text-sm text-white">{{ download.filename }}</p>
                    <p class="text-xs text-smoke-800">
                      {{ download.folder }}/ • {{ formatSize(download.totalBytes) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-smoke-800">
                    {{ download.completedAt ? formatTime(download.completedAt) : '' }}
                  </span>
                  <button
                    class="text-smoke-800 hover:text-red-400"
                    @click="removeFromHistory(download.id)"
                  >
                    <Icon name="x" size="sm" />
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- Failed downloads -->
          <template v-else>
            <div v-if="failedDownloads.length === 0" class="flex flex-col items-center justify-center py-12 text-smoke-800">
              <Icon name="inbox" size="xl" class="mb-2 opacity-30" />
              <p class="text-sm">No failed downloads</p>
            </div>

            <div class="mb-3 flex justify-end">
              <button
                v-if="failedDownloads.length > 0"
                class="text-xs text-smoke-800 hover:text-white"
                @click="clearFailed"
              >
                Clear All
              </button>
            </div>

            <div v-for="download in failedDownloads" :key="download.id" class="mb-2">
              <div class="rounded-lg border border-red-500/30 bg-charcoal-800 p-3">
                <div class="mb-2 flex items-start justify-between">
                  <div class="flex items-center gap-2">
                    <Icon name="alert-circle" size="sm" class="text-red-400" />
                    <div>
                      <p class="text-sm text-white">{{ download.filename }}</p>
                      <p class="text-xs text-red-400">{{ download.error }}</p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    class="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-500"
                    @click="retryDownload(download.id)"
                  >
                    <Icon name="refresh-cw" size="xs" class="mr-1 inline" />
                    Retry
                  </button>
                  <span class="text-xs text-smoke-800">
                    {{ Math.round(download.progress) }}% completed before error
                  </span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Main content -->
      <div class="flex-1 p-8">
        <div class="rounded-lg border border-charcoal-600 bg-charcoal-800 p-6">
          <h2 class="mb-2 text-sm font-semibold text-white">Scenario: Model Download Manager</h2>
          <p class="mb-4 text-xs text-smoke-800">
            This mockup simulates the Electron download manager for models. Downloads run
            concurrently with real-time progress, speed, and ETA tracking.
          </p>
          <ul class="space-y-1 text-xs text-smoke-800">
            <li>• Active downloads show progress bars with speed and ETA</li>
            <li>• Pause/resume individual downloads</li>
            <li>• Cancel downloads at any time</li>
            <li>• Failed downloads can be retried</li>
            <li>• Completed downloads show in history</li>
            <li>• Downloads queue automatically when limit reached</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
