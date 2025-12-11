<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@/components/ui/icon'
import { ImportModelDialog, ModelConfirmationModal, type ModelImportInfo, type ImportStage } from '@/components/common'
import { DownloadJobCard } from '@/components/queue'
import { useModelsStore } from '@/stores/modelsStore'
import { useQueueStore } from '@/stores/queueStore'
import type { DownloadJob } from '@/types/queue'

const modelsStore = useModelsStore()
const queueStore = useQueueStore()

// Dialog states for demo
const showImportDialog = ref(false)

// Three separate modals for each stage
const showConfirmModal = ref(false)
const showImportingModal = ref(false)
const showSuccessModal = ref(false)

// Mock model info for confirmation modal
const mockModelInfo = ref<ModelImportInfo>({
  url: 'https://civitai.com/models/123456/memax6-noob-vpred',
  source: 'civitai',
  name: 'MeMax6-noob-vpred.safetensors',
  type: 'lora',
  baseModel: 'SDXL',
})

// Mock download jobs in different states
const mockDownloadJobs: DownloadJob[] = [
  {
    id: 'demo-pending',
    type: 'download',
    state: 'pending',
    title: 'SDXL Lightning',
    source: 'huggingface',
    sourceUrl: 'https://huggingface.co/ByteDance/SDXL-Lightning',
    modelName: 'SDXL Lightning',
    modelType: 'checkpoint',
    baseModel: 'SDXL',
    createdAt: new Date(),
  },
  {
    id: 'demo-running',
    type: 'download',
    state: 'running',
    title: 'Juggernaut XL',
    source: 'civitai',
    sourceUrl: 'https://civitai.com/models/133005/juggernaut-xl',
    modelName: 'Juggernaut XL',
    modelType: 'checkpoint',
    baseModel: 'SDXL',
    createdAt: new Date(Date.now() - 60000),
    startedAt: new Date(Date.now() - 30000),
    progress: {
      percent: 45,
      downloadedBytes: 2.3 * 1024 * 1024 * 1024,
      totalBytes: 5.1 * 1024 * 1024 * 1024,
      speed: 25 * 1024 * 1024,
      eta: 112,
    },
  },
  {
    id: 'demo-completed',
    type: 'download',
    state: 'completed',
    title: 'Detail Tweaker LoRA',
    source: 'civitai',
    sourceUrl: 'https://civitai.com/models/58390/detail-tweaker-lora',
    modelName: 'Detail Tweaker LoRA',
    modelType: 'lora',
    baseModel: 'SDXL',
    createdAt: new Date(Date.now() - 300000),
    startedAt: new Date(Date.now() - 240000),
    completedAt: new Date(Date.now() - 120000),
    progress: {
      percent: 100,
      downloadedBytes: 186 * 1024 * 1024,
      totalBytes: 186 * 1024 * 1024,
      speed: 0,
      eta: 0,
    },
    result: {
      filePath: 'models/loras/detail_tweaker.safetensors',
      fileSize: 186 * 1024 * 1024,
    },
  },
  {
    id: 'demo-failed',
    type: 'download',
    state: 'failed',
    title: 'Realistic Vision V6',
    source: 'civitai',
    sourceUrl: 'https://civitai.com/models/4201/realistic-vision',
    modelName: 'Realistic Vision V6',
    modelType: 'checkpoint',
    baseModel: 'SD1.5',
    createdAt: new Date(Date.now() - 600000),
    startedAt: new Date(Date.now() - 540000),
    errorMessage: 'Network error: Connection timed out',
    progress: {
      percent: 23,
      downloadedBytes: 0.5 * 1024 * 1024 * 1024,
      totalBytes: 2.1 * 1024 * 1024 * 1024,
      speed: 0,
      eta: 0,
    },
  },
  {
    id: 'demo-cancelled',
    type: 'download',
    state: 'cancelled',
    title: 'DreamShaper XL',
    source: 'civitai',
    sourceUrl: 'https://civitai.com/models/112902/dreamshaper-xl',
    modelName: 'DreamShaper XL',
    modelType: 'checkpoint',
    baseModel: 'SDXL',
    createdAt: new Date(Date.now() - 900000),
    startedAt: new Date(Date.now() - 840000),
    progress: {
      percent: 67,
      downloadedBytes: 3.4 * 1024 * 1024 * 1024,
      totalBytes: 5.1 * 1024 * 1024 * 1024,
      speed: 0,
      eta: 0,
    },
  },
]

// Animated running job for demo
const animatedJob = ref<DownloadJob>({ ...mockDownloadJobs[1] })
let animationInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // Animate the running job progress
  animationInterval = setInterval(() => {
    if (animatedJob.value.progress) {
      const newPercent = (animatedJob.value.progress.percent + 1) % 100
      const totalBytes = animatedJob.value.progress.totalBytes
      const downloadedBytes = (newPercent / 100) * totalBytes
      const speed = (Math.random() * 30 + 15) * 1024 * 1024
      const eta = Math.round((totalBytes - downloadedBytes) / speed)

      animatedJob.value = {
        ...animatedJob.value,
        progress: {
          percent: newPercent,
          downloadedBytes,
          totalBytes,
          speed,
          eta,
        },
      }
    }
  }, 100)
})

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval)
  }
})

// Demo actions
function handleStartDemo() {
  queueStore.addDownloadJob(
    'https://civitai.com/models/123456/demo-model',
    'Demo Model Import',
    'civitai',
    'checkpoint',
    'SDXL'
  )
}

function handleAddMockModel() {
  modelsStore.addModel({
    name: `Imported Model ${Date.now()}`,
    type: 'checkpoint',
    baseModel: 'SDXL',
    size: '2.5 GB',
    sizeBytes: 2.5 * 1024 * 1024 * 1024,
    version: '1.0',
    source: 'imported',
    sourceUrl: 'https://civitai.com/models/demo',
  })
}

function handleClearModels() {
  modelsStore.clearAllModels()
}
</script>

<template>
  <div class="min-h-screen bg-charcoal-950 p-8">
    <div class="mx-auto max-w-6xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="mb-2 text-2xl font-bold text-white">Model Import Feature Showcase</h1>
        <p class="text-smoke-800">All components, variants, and stages of the model import flow</p>
      </div>

      <!-- Quick Actions -->
      <div class="mb-8 flex flex-wrap gap-3">
        <button
          class="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          @click="handleStartDemo"
        >
          <Icon name="play" size="sm" />
          Start Real Download Demo
        </button>
        <button
          class="flex items-center gap-2 rounded-lg bg-charcoal-600 px-4 py-2 text-sm font-medium text-white hover:bg-charcoal-500"
          @click="handleAddMockModel"
        >
          <Icon name="plus" size="sm" />
          Add Mock Model to Store
        </button>
        <button
          class="flex items-center gap-2 rounded-lg bg-charcoal-600 px-4 py-2 text-sm font-medium text-white hover:bg-charcoal-500"
          @click="handleClearModels"
        >
          <Icon name="trash-2" size="sm" />
          Clear Imported Models
        </button>
        <div class="ml-auto flex items-center gap-2 text-sm text-smoke-800">
          <Icon name="database" size="sm" />
          {{ modelsStore.modelCount }} imported models in store
        </div>
      </div>

      <!-- Section: Import Modal Stages (Figma Design) -->
      <section class="mb-12">
        <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Icon name="layout" size="sm" class="text-blue-400" />
          Import Modal Stages (Figma Design)
        </h2>

        <div class="grid gap-4 lg:grid-cols-3">
          <!-- Stage 1: Confirm -->
          <div class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4">
            <div class="mb-3 flex items-center gap-2">
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">1</span>
              <span class="text-sm font-medium text-white">Confirm</span>
            </div>
            <p class="mb-4 text-xs text-smoke-800">User selects model type before importing</p>
            <button
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
              @click="showConfirmModal = true"
            >
              <Icon name="eye" size="sm" />
              View Stage
            </button>
          </div>

          <!-- Stage 2: Importing -->
          <div class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4">
            <div class="mb-3 flex items-center gap-2">
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white">2</span>
              <span class="text-sm font-medium text-white">Importing</span>
            </div>
            <p class="mb-4 text-xs text-smoke-800">Loading state with spinner on Import button</p>
            <button
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-500"
              @click="showImportingModal = true"
            >
              <Icon name="eye" size="sm" />
              View Stage
            </button>
          </div>

          <!-- Stage 3: Success -->
          <div class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4">
            <div class="mb-3 flex items-center gap-2">
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">3</span>
              <span class="text-sm font-medium text-white">Success</span>
            </div>
            <p class="mb-4 text-xs text-smoke-800">Model imported with celebration message</p>
            <button
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              @click="showSuccessModal = true"
            >
              <Icon name="eye" size="sm" />
              View Stage
            </button>
          </div>
        </div>
      </section>

      <!-- Section: URL Input Dialog -->
      <section class="mb-12">
        <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Icon name="link" size="sm" class="text-purple-400" />
          URL Input Dialog
        </h2>

        <div class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-6">
          <p class="mb-4 text-sm text-smoke-800">First step: User pastes a CivitAI or Hugging Face URL</p>
          <button
            class="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
            @click="showImportDialog = true"
          >
            <Icon name="link" size="sm" />
            Open URL Input Dialog
          </button>
        </div>
      </section>

      <!-- Section: Download Job Cards -->
      <section class="mb-12">
        <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Icon name="download" size="sm" class="text-emerald-400" />
          Download Job Cards (All States)
        </h2>

        <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <!-- Pending -->
          <div class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4">
            <div class="mb-3 flex items-center gap-2">
              <span class="rounded bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">Pending</span>
              <span class="text-xs text-smoke-800">Waiting in queue</span>
            </div>
            <DownloadJobCard :job="mockDownloadJobs[0]" />
          </div>

          <!-- Running (Animated) -->
          <div class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4">
            <div class="mb-3 flex items-center gap-2">
              <span class="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">Running</span>
              <span class="text-xs text-smoke-800">Actively downloading (animated)</span>
            </div>
            <DownloadJobCard :job="animatedJob" />
          </div>

          <!-- Completed -->
          <div class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4">
            <div class="mb-3 flex items-center gap-2">
              <span class="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">Completed</span>
              <span class="text-xs text-smoke-800">Successfully imported</span>
            </div>
            <DownloadJobCard :job="mockDownloadJobs[2]" />
          </div>

          <!-- Failed -->
          <div class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4">
            <div class="mb-3 flex items-center gap-2">
              <span class="rounded bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">Failed</span>
              <span class="text-xs text-smoke-800">Download error with retry</span>
            </div>
            <DownloadJobCard :job="mockDownloadJobs[3]" />
          </div>

          <!-- Cancelled -->
          <div class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-4">
            <div class="mb-3 flex items-center gap-2">
              <span class="rounded bg-charcoal-400/50 px-2 py-0.5 text-xs font-medium text-smoke-800">Cancelled</span>
              <span class="text-xs text-smoke-800">User cancelled with retry option</span>
            </div>
            <DownloadJobCard :job="mockDownloadJobs[4]" />
          </div>
        </div>
      </section>

      <!-- Section: Imported Models in Store -->
      <section class="mb-12">
        <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Icon name="database" size="sm" class="text-pink-400" />
          Imported Models Store
        </h2>

        <div class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-6">
          <div v-if="modelsStore.importedModels.length === 0" class="flex flex-col items-center py-8 text-smoke-800">
            <Icon name="inbox" size="xl" class="mb-2 opacity-30" />
            <p class="text-sm">No imported models yet</p>
            <p class="text-xs">Complete a download or click "Add Mock Model" above</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="model in modelsStore.importedModels"
              :key="model.id"
              class="flex items-center gap-4 rounded-lg bg-charcoal-600 p-3"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal-400">
                <Icon
                  :name="model.type === 'lora' ? 'layers' : model.type === 'vae' ? 'cpu' : 'box'"
                  class="text-white"
                />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-white">{{ model.name }}</p>
                <p class="text-xs text-smoke-800">
                  {{ model.type }} · {{ model.baseModel }} · {{ model.size }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <span class="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                  Imported
                </span>
                <button
                  class="rounded p-1 text-smoke-800 hover:bg-charcoal-400 hover:text-white"
                  @click="modelsStore.removeModel(model.id)"
                >
                  <Icon name="trash-2" size="sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Flow Diagram -->
      <section class="mb-12">
        <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Icon name="git-branch" size="sm" class="text-orange-400" />
          Complete Flow
        </h2>

        <div class="rounded-xl border border-charcoal-200 bg-charcoal-800 p-6">
          <div class="flex flex-wrap items-center justify-center gap-4">
            <!-- Step 1 -->
            <div class="flex flex-col items-center">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                <Icon name="link" />
              </div>
              <p class="mt-2 text-xs text-white">Paste URL</p>
            </div>

            <Icon name="arrow-right" class="text-charcoal-400" />

            <!-- Step 2 -->
            <div class="flex flex-col items-center">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <Icon name="settings" />
              </div>
              <p class="mt-2 text-xs text-white">Select Type</p>
            </div>

            <Icon name="arrow-right" class="text-charcoal-400" />

            <!-- Step 3 -->
            <div class="flex flex-col items-center">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400">
                <Icon name="loader-2" />
              </div>
              <p class="mt-2 text-xs text-white">Importing</p>
            </div>

            <Icon name="arrow-right" class="text-charcoal-400" />

            <!-- Step 4 -->
            <div class="flex flex-col items-center">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Icon name="check" />
              </div>
              <p class="mt-2 text-xs text-white">Success</p>
            </div>

            <Icon name="arrow-right" class="text-charcoal-400" />

            <!-- Step 5 -->
            <div class="flex flex-col items-center">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/20 text-pink-400">
                <Icon name="folder" />
              </div>
              <p class="mt-2 text-xs text-white">In Library</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Component Files -->
      <section>
        <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Icon name="file-code" size="sm" class="text-cyan-400" />
          Component Files
        </h2>

        <div class="grid gap-3 text-sm lg:grid-cols-2">
          <div class="rounded-lg bg-charcoal-800 p-4">
            <p class="font-mono text-xs text-emerald-400">src/components/common/ImportModelDialog.vue</p>
            <p class="mt-1 text-xs text-smoke-800">URL input dialog with validation</p>
          </div>
          <div class="rounded-lg bg-charcoal-800 p-4">
            <p class="font-mono text-xs text-emerald-400">src/components/common/ModelConfirmationModal.vue</p>
            <p class="mt-1 text-xs text-smoke-800">3-stage modal: confirm → importing → success</p>
          </div>
          <div class="rounded-lg bg-charcoal-800 p-4">
            <p class="font-mono text-xs text-emerald-400">src/components/queue/DownloadJobCard.vue</p>
            <p class="mt-1 text-xs text-smoke-800">Download progress card with all states</p>
          </div>
          <div class="rounded-lg bg-charcoal-800 p-4">
            <p class="font-mono text-xs text-emerald-400">src/stores/modelsStore.ts</p>
            <p class="mt-1 text-xs text-smoke-800">Imported models state with localStorage</p>
          </div>
          <div class="rounded-lg bg-charcoal-800 p-4">
            <p class="font-mono text-xs text-emerald-400">src/stores/queueStore.ts</p>
            <p class="mt-1 text-xs text-smoke-800">Download queue with simulation & toasts</p>
          </div>
          <div class="rounded-lg bg-charcoal-800 p-4">
            <p class="font-mono text-xs text-emerald-400">src/components/sidebar/SidebarModelsTab.vue</p>
            <p class="mt-1 text-xs text-smoke-800">Models sidebar with Imported tab</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Dialogs -->
    <ImportModelDialog v-model:open="showImportDialog" />

    <!-- Stage 1: Confirm Modal -->
    <ModelConfirmationModal
      v-model:open="showConfirmModal"
      :model-info="mockModelInfo"
      stage="confirm"
      @confirm="showConfirmModal = false"
    />

    <!-- Stage 2: Importing Modal -->
    <ModelConfirmationModal
      v-model:open="showImportingModal"
      :model-info="mockModelInfo"
      stage="importing"
    />

    <!-- Stage 3: Success Modal -->
    <ModelConfirmationModal
      v-model:open="showSuccessModal"
      :model-info="mockModelInfo"
      stage="success"
      @finish="showSuccessModal = false"
    />
  </div>
</template>
