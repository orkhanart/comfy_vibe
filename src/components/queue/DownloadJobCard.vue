<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@/components/ui/icon'
import type { DownloadJob } from '@/types/queue'

const props = defineProps<{
  job: DownloadJob
}>()

const emit = defineEmits<{
  cancel: []
  retry: []
  delete: []
}>()

const isPending = computed(() => props.job.state === 'pending')
const isRunning = computed(() => props.job.state === 'running')
const isCompleted = computed(() => props.job.state === 'completed')
const isFailed = computed(() => props.job.state === 'failed')
const isCancelled = computed(() => props.job.state === 'cancelled')

const progress = computed(() => props.job.progress)

// Format bytes to human readable
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

// Format seconds to human readable
function formatEta(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

const progressWidth = computed(() => `${progress.value?.percent || 0}%`)

const formattedProgress = computed(() => {
  if (!progress.value) return null
  return {
    percent: progress.value.percent,
    downloaded: formatBytes(progress.value.downloadedBytes),
    total: formatBytes(progress.value.totalBytes),
    speed: `${formatBytes(progress.value.speed)}/s`,
    eta: formatEta(progress.value.eta)
  }
})

const sourceIcon = computed(() => {
  switch (props.job.source) {
    case 'civitai':
      return 'download'
    case 'huggingface':
      return 'download'
    default:
      return 'download'
  }
})
</script>

<template>
  <!-- Pending State -->
  <div
    v-if="isPending"
    class="group flex h-8 w-full flex-col items-start justify-center overflow-hidden rounded-lg bg-charcoal-600"
  >
    <div class="flex flex-1 items-center gap-2 py-1 pl-1 pr-2">
      <!-- Download Icon -->
      <div class="flex h-6 w-6 shrink-0 flex-col items-center justify-center rounded bg-emerald-500/20 p-1">
        <Icon name="download" class="h-4 w-4 text-emerald-500" />
      </div>

      <!-- Info -->
      <div class="flex h-full flex-1 items-center gap-2 pr-1">
        <span class="flex-1 truncate text-xs font-normal text-white">{{ job.modelName }}</span>
        <span class="text-xs text-smoke-800">Queued</span>
      </div>

      <!-- Actions (show on hover) -->
      <div class="hidden items-center gap-2 group-hover:flex">
        <button
          class="flex h-6 w-6 items-center justify-center rounded bg-[#b33a3a] p-1"
          @click="emit('cancel')"
        >
          <Icon name="x" class="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  </div>

  <!-- Running State -->
  <div
    v-else-if="isRunning"
    class="relative flex w-full flex-col items-start justify-center overflow-hidden rounded-lg bg-charcoal-600"
  >
    <!-- Progress Bar Background -->
    <div
      class="absolute left-0 top-0 h-full bg-emerald-500/20"
      :style="{ width: progressWidth }"
    />

    <!-- Content -->
    <div class="relative z-10 flex w-full flex-col gap-1 p-2">
      <!-- Top row: name, size and cancel -->
      <div class="flex items-center gap-2">
        <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-500/30">
          <Icon name="download" class="h-3 w-3 animate-pulse text-emerald-500" />
        </div>
        <span class="flex-1 truncate text-xs font-medium text-white">{{ job.modelName }}</span>
        <span v-if="formattedProgress" class="text-xs text-smoke-800">{{ formattedProgress.total }}</span>
        <button
          class="flex h-5 w-5 items-center justify-center rounded bg-[#b33a3a] p-0.5"
          @click="emit('cancel')"
        >
          <Icon name="x" class="h-3 w-3 text-white" />
        </button>
      </div>

      <!-- Bottom row: progress bar and info -->
      <div v-if="formattedProgress" class="flex items-center gap-2">
        <!-- Mini progress bar -->
        <div class="h-1 flex-1 overflow-hidden rounded-full bg-charcoal-400">
          <div
            class="h-full bg-emerald-500 transition-all duration-100"
            :style="{ width: progressWidth }"
          />
        </div>
        <span class="text-[10px] font-bold text-emerald-400">{{ formattedProgress.percent }}%</span>
        <span class="text-[10px] text-smoke-800">{{ formattedProgress.speed }}</span>
        <span class="text-[10px] text-smoke-800">~{{ formattedProgress.eta }}</span>
      </div>
    </div>
  </div>

  <!-- Completed State -->
  <div
    v-else-if="isCompleted"
    class="group flex h-8 w-full flex-col items-start justify-center rounded-lg bg-charcoal-600"
  >
    <div class="flex flex-1 items-center gap-2 py-1 pl-1 pr-2">
      <!-- Success Icon -->
      <div class="flex h-6 w-6 shrink-0 flex-col items-center justify-center rounded bg-emerald-500/20 p-1">
        <Icon name="check" class="h-4 w-4 text-emerald-500" />
      </div>

      <!-- Info -->
      <div class="flex h-full flex-1 items-center gap-2 pr-1">
        <span class="flex-1 truncate text-xs font-normal text-white">{{ job.modelName }}</span>
        <span v-if="job.result?.fileSize" class="text-xs text-smoke-800">{{ formatBytes(job.result.fileSize) }}</span>
        <span class="text-xs text-emerald-500">Imported</span>
      </div>

      <!-- Actions (show on hover) -->
      <div class="hidden items-center gap-2 group-hover:flex">
        <button
          class="flex h-6 w-6 items-center justify-center rounded bg-charcoal-400 p-1"
          @click="emit('delete')"
        >
          <Icon name="trash" class="h-4 w-4 text-smoke-800" />
        </button>
      </div>
    </div>
  </div>

  <!-- Failed State -->
  <div
    v-else-if="isFailed"
    class="group flex h-8 w-full flex-col items-start justify-center overflow-hidden rounded-lg bg-charcoal-600"
  >
    <div class="flex flex-1 items-center gap-2 py-1 pl-1 pr-2">
      <!-- Error Icon -->
      <div class="flex h-6 w-6 shrink-0 flex-col items-center justify-center rounded bg-[#b33a3a]/20 p-1">
        <Icon name="alert-circle" class="h-4 w-4 text-[#b33a3a]" />
      </div>

      <!-- Info -->
      <div class="flex h-full flex-1 items-center gap-2 pr-1">
        <span class="flex-1 truncate text-xs font-normal text-white">{{ job.modelName }}</span>
        <span class="text-xs text-[#b33a3a]">Failed</span>
      </div>

      <!-- Actions (show on hover) -->
      <div class="hidden items-center gap-2 group-hover:flex">
        <button
          class="flex h-6 items-center justify-center gap-1 rounded bg-charcoal-400 px-2 py-1"
          @click="emit('retry')"
        >
          <Icon name="refresh-cw" class="h-3 w-3 text-white" />
          <span class="text-xs text-white">Retry</span>
        </button>
        <button
          class="flex h-6 w-6 items-center justify-center rounded bg-charcoal-400 p-1"
          @click="emit('delete')"
        >
          <Icon name="trash" class="h-4 w-4 text-smoke-800" />
        </button>
      </div>
    </div>
  </div>

  <!-- Cancelled State -->
  <div
    v-else-if="isCancelled"
    class="group flex h-8 w-full flex-col items-start justify-center overflow-hidden rounded-lg bg-charcoal-600"
  >
    <div class="flex flex-1 items-center gap-2 py-1 pl-1 pr-2">
      <!-- Cancelled Icon -->
      <div class="flex h-6 w-6 shrink-0 flex-col items-center justify-center rounded bg-smoke-800/20 p-1">
        <Icon name="x" class="h-4 w-4 text-smoke-800" />
      </div>

      <!-- Info -->
      <div class="flex h-full flex-1 items-center gap-2 pr-1">
        <span class="flex-1 truncate text-xs font-normal text-smoke-800">{{ job.modelName }}</span>
        <span class="text-xs text-smoke-800">Cancelled</span>
      </div>

      <!-- Actions (show on hover) -->
      <div class="hidden items-center gap-2 group-hover:flex">
        <button
          class="flex h-6 items-center justify-center gap-1 rounded bg-charcoal-400 px-2 py-1"
          @click="emit('retry')"
        >
          <Icon name="refresh-cw" class="h-3 w-3 text-white" />
          <span class="text-xs text-white">Retry</span>
        </button>
        <button
          class="flex h-6 w-6 items-center justify-center rounded bg-charcoal-400 p-1"
          @click="emit('delete')"
        >
          <Icon name="trash" class="h-4 w-4 text-smoke-800" />
        </button>
      </div>
    </div>
  </div>
</template>
