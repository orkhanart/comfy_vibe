<script setup lang="ts">
/**
 * Downloads Mockup
 *
 * Replicates the actual ComfyUI download UI:
 * - Downloads appear in Model Library sidebar (ElectronDownloadItems)
 * - Each download shows progress bar with pause/resume/cancel (DownloadItem)
 * - Cancelled/error downloads show removable chip
 * - Based on electronDownloadStore
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@/components/ui/icon'

// Match ElectronDownload interface from electronDownloadStore.ts
type DownloadStatus = 'in_progress' | 'paused' | 'completed' | 'cancelled' | 'error'

interface ElectronDownload {
  url: string
  filename: string
  savePath: string
  progress: number // 0 to 1
  status: DownloadStatus
}

// Mock downloads
const downloads = ref<ElectronDownload[]>([
  {
    url: 'https://huggingface.co/stabilityai/sd-vae-ft-mse/resolve/main/vae-ft-mse-840000-ema-pruned.safetensors',
    filename: 'vae-ft-mse-840000-ema-pruned.safetensors',
    savePath: 'models/vae/vae-ft-mse-840000-ema-pruned.safetensors',
    progress: 0.45,
    status: 'in_progress',
  },
  {
    url: 'https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned.safetensors',
    filename: 'v1-5-pruned.safetensors',
    savePath: 'models/checkpoints/v1-5-pruned.safetensors',
    progress: 0.78,
    status: 'paused',
  },
  {
    url: 'https://huggingface.co/lllyasviel/ControlNet/resolve/main/control_canny.safetensors',
    filename: 'control_canny.safetensors',
    savePath: 'models/controlnet/control_canny.safetensors',
    progress: 0,
    status: 'cancelled',
  },
])

// Computed: in-progress downloads (not completed)
const inProgressDownloads = computed(() =>
  downloads.value.filter(d => d.status !== 'completed')
)

// Get label like "vae/vae-ft-mse-840000-ema-pruned.safetensors"
function getDownloadLabel(savePath: string): string {
  const parts = savePath.split('/')
  const name = parts.pop()
  const dir = parts.pop()
  return `${dir}/${name}`
}

// Actions
function pauseDownload(url: string) {
  const download = downloads.value.find(d => d.url === url)
  if (download && download.status === 'in_progress') {
    download.status = 'paused'
  }
}

function resumeDownload(url: string) {
  const download = downloads.value.find(d => d.url === url)
  if (download && download.status === 'paused') {
    download.status = 'in_progress'
  }
}

function cancelDownload(url: string) {
  const download = downloads.value.find(d => d.url === url)
  if (download) {
    download.status = 'cancelled'
  }
}

function removeDownload(url: string) {
  downloads.value = downloads.value.filter(d => d.url !== url)
}

function addMockDownload() {
  const models = [
    { name: 'sd_xl_base_1.0.safetensors', dir: 'checkpoints' },
    { name: 'clip_l.safetensors', dir: 'clip' },
    { name: 'control_depth.safetensors', dir: 'controlnet' },
    { name: 'lora_character.safetensors', dir: 'loras' },
  ]
  const model = models[Math.floor(Math.random() * models.length)]
  downloads.value.push({
    url: `https://huggingface.co/example/${model.name}`,
    filename: model.name,
    savePath: `models/${model.dir}/${model.name}`,
    progress: 0,
    status: 'in_progress',
  })
}

// Animation: simulate download progress
let animationInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  animationInterval = setInterval(() => {
    downloads.value.forEach(download => {
      if (download.status === 'in_progress') {
        download.progress = Math.min(1, download.progress + Math.random() * 0.02)
        if (download.progress >= 1) {
          download.status = 'completed'
        }
      }
    })
  }, 200)
})

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval)
})

// Mock model folders for tree
const modelFolders = [
  { name: 'checkpoints', count: 12, expanded: false },
  { name: 'clip', count: 4, expanded: false },
  { name: 'controlnet', count: 8, expanded: false },
  { name: 'embeddings', count: 23, expanded: false },
  { name: 'loras', count: 45, expanded: false },
  { name: 'unet', count: 2, expanded: false },
  { name: 'vae', count: 6, expanded: true },
]
</script>

<template>
  <div class="flex min-h-screen bg-charcoal-950">
    <!-- Sidebar: Model Library -->
    <div class="flex w-[320px] flex-col border-r border-charcoal-600 bg-charcoal-900">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-charcoal-600 px-3 py-2">
        <div class="flex items-center gap-2">
          <a href="/showcase/activity" class="text-smoke-800 hover:text-white">
            <Icon name="arrow-left" size="sm" />
          </a>
          <span class="text-sm font-medium text-white">Model Library</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="flex h-7 w-7 items-center justify-center rounded text-smoke-800 hover:bg-charcoal-700 hover:text-white">
            <Icon name="refresh-cw" size="sm" />
          </button>
          <button class="flex h-7 w-7 items-center justify-center rounded text-smoke-800 hover:bg-charcoal-700 hover:text-white">
            <Icon name="cloud-download" size="sm" />
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="border-b border-charcoal-600 p-2">
        <div class="flex items-center gap-2 rounded bg-charcoal-700 px-2 py-1.5">
          <Icon name="search" size="sm" class="text-smoke-800" />
          <input
            type="text"
            placeholder="Search models..."
            class="flex-1 bg-transparent text-xs text-white placeholder-smoke-800 outline-none"
          />
        </div>
      </div>

      <!-- Downloads Section (ElectronDownloadItems) -->
      <div v-if="inProgressDownloads.length > 0" class="border-b border-charcoal-600 px-4 py-3">
        <div class="mb-3 text-sm font-medium text-white">In Progress</div>

        <!-- DownloadItem for each download -->
        <div v-for="download in inProgressDownloads" :key="download.url" class="mb-3">
          <!-- Label -->
          <div class="mb-1 truncate text-xs text-white">
            {{ getDownloadLabel(download.savePath) }}
          </div>

          <!-- Cancelled/Error state: show chip -->
          <div v-if="['cancelled', 'error'].includes(download.status)">
            <div class="mt-1 inline-flex items-center gap-1 rounded bg-red-700 px-2 py-0.5 text-xs text-white">
              <span>Cancelled</span>
              <button class="ml-1 hover:text-red-200" @click="removeDownload(download.url)">
                <Icon name="x" size="xs" />
              </button>
            </div>
          </div>

          <!-- In progress / Paused / Completed: show progress bar -->
          <div
            v-if="['in_progress', 'paused', 'completed'].includes(download.status)"
            class="mt-1 flex items-center gap-2"
          >
            <!-- Progress bar (PrimeVue ProgressBar style) -->
            <div class="relative h-4 flex-1 overflow-hidden rounded bg-charcoal-600">
              <div
                class="absolute inset-y-0 left-0 bg-blue-500 transition-[width]"
                :style="{ width: `${download.progress * 100}%` }"
              />
              <span
                v-if="download.progress > 0.1"
                class="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white"
              >
                {{ (download.progress * 100).toFixed(1) }}%
              </span>
            </div>

            <!-- Pause button (when in_progress) -->
            <button
              v-if="download.status === 'in_progress'"
              class="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-charcoal-600 text-white hover:bg-charcoal-500"
              title="Pause"
              @click="pauseDownload(download.url)"
            >
              <Icon name="pause" size="xs" />
            </button>

            <!-- Resume button (when paused) -->
            <button
              v-if="download.status === 'paused'"
              class="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-charcoal-600 text-white hover:bg-charcoal-500"
              title="Resume"
              @click="resumeDownload(download.url)"
            >
              <Icon name="play" size="xs" />
            </button>

            <!-- Cancel button (when in_progress or paused) -->
            <button
              v-if="['in_progress', 'paused'].includes(download.status)"
              class="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"
              title="Cancel"
              @click="cancelDownload(download.url)"
            >
              <Icon name="x-circle" size="xs" />
            </button>
          </div>
        </div>
      </div>

      <!-- Model Tree (TreeExplorer) -->
      <div class="flex-1 overflow-y-auto p-2">
        <div v-for="folder in modelFolders" :key="folder.name" class="mb-1">
          <button
            class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-charcoal-700"
            @click="folder.expanded = !folder.expanded"
          >
            <Icon
              :name="folder.expanded ? 'chevron-down' : 'chevron-right'"
              size="xs"
              class="text-smoke-800"
            />
            <Icon name="folder" size="sm" class="text-yellow-500" />
            <span class="flex-1 text-white">{{ folder.name }}</span>
            <span class="rounded bg-charcoal-600 px-1.5 py-0.5 text-[10px] text-smoke-800">
              {{ folder.count }}
            </span>
          </button>

          <!-- Expanded folder contents (mock) -->
          <div v-if="folder.expanded" class="ml-6 mt-1 space-y-1">
            <div
              v-for="i in 3"
              :key="i"
              class="flex items-center gap-2 rounded px-2 py-1 text-xs text-smoke-800 hover:bg-charcoal-700 hover:text-white"
            >
              <Icon name="file" size="sm" />
              <span>model_{{ folder.name }}_{{ i }}.safetensors</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content area -->
    <div class="flex-1 p-8">
      <div class="max-w-xl rounded-lg border border-charcoal-600 bg-charcoal-800 p-6">
        <h2 class="mb-2 text-sm font-semibold text-white">Model Downloads (Electron Desktop)</h2>
        <p class="mb-4 text-xs text-smoke-800">
          This mockup shows how downloads appear in the actual ComfyUI desktop app.
          Downloads are displayed in the Model Library sidebar, above the folder tree.
          Each download shows:
        </p>
        <ul class="mb-4 space-y-1 text-xs text-smoke-800">
          <li>• <strong class="text-white">Label:</strong> folder/filename from savePath</li>
          <li>• <strong class="text-white">Progress bar:</strong> with percentage (PrimeVue ProgressBar)</li>
          <li>• <strong class="text-white">Pause/Resume:</strong> toggle download state</li>
          <li>• <strong class="text-white">Cancel:</strong> stops download, shows removable chip</li>
        </ul>

        <div class="flex gap-2">
          <button
            class="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
            @click="addMockDownload"
          >
            <Icon name="plus" size="sm" class="mr-1 inline" />
            Add Download
          </button>
        </div>

        <div class="mt-6 rounded border border-charcoal-600 bg-charcoal-700 p-3">
          <p class="text-xs text-smoke-800">
            <strong class="text-yellow-400">Note:</strong> This download UI only appears in the
            <strong class="text-white">Electron desktop app</strong> (ComfyUI Desktop).
            The web version uses browser-native downloads.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
