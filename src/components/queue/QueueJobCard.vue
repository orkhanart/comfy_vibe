<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@/components/ui/icon'
import type { QueueJob } from '@/types/queue'

const props = defineProps<{
  job: QueueJob
  currentNode?: string | null
  currentPercent?: number
  totalPercent?: number
}>()

const emit = defineEmits<{
  cancel: []
  view: []
  menu: []
}>()

const isQueued = computed(() => props.job.state === 'pending')
const isRunning = computed(() => props.job.state === 'running')
const isDone = computed(() => props.job.state === 'completed')
const isFailed = computed(() => props.job.state === 'failed')

const formattedTime = computed(() => {
  const date = props.job.createdAt
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).toLowerCase()
})

const outputFilename = computed(() => {
  if (props.job.outputs && props.job.outputs.length > 0) {
    return props.job.outputs[0].filename
  }
  return 'output.png'
})

// Progress bar widths for running state
const totalProgressWidth = computed(() => `${props.totalPercent || 0}%`)
const fractionalProgressWidth = computed(() => `${(props.totalPercent || 0) + 30}%`) // Slightly wider for fractional
</script>

<template>
  <!-- Queued State -->
  <div
    v-if="isQueued"
    class="group flex h-8 w-full flex-col items-start justify-center overflow-hidden rounded-lg bg-charcoal-600"
  >
    <div class="flex flex-1 items-center gap-2 py-1 pl-1 pr-2">
      <!-- Loader Icon -->
      <div class="flex h-6 w-6 shrink-0 flex-col items-center justify-center rounded p-1">
        <Icon name="loader-circle" class="h-4 w-4 animate-spin text-smoke-800" />
      </div>

      <!-- Info -->
      <div class="flex h-full flex-1 items-center gap-4 pr-1">
        <div class="flex items-center">
          <span class="text-center text-xs font-normal text-white">In queue...</span>
        </div>
        <div class="flex flex-1 items-center justify-end">
          <span class="text-right text-xs font-normal text-smoke-800">{{ formattedTime }}</span>
        </div>
      </div>

      <!-- Actions (show on hover) -->
      <div class="hidden items-center gap-2 group-hover:flex">
        <button
          class="flex h-6 items-center justify-center overflow-hidden rounded bg-charcoal-400 p-1"
          @click="emit('menu')"
        >
          <Icon name="ellipsis" class="h-4 w-4 text-white" />
        </button>
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
    class="relative flex h-8 w-full flex-col items-start justify-center overflow-hidden rounded-lg bg-charcoal-600"
  >
    <!-- Fractional Progress Bar (lighter blue) -->
    <div
      class="absolute left-0 top-0 h-8 bg-[rgba(11,140,233,0.3)]"
      :style="{ width: fractionalProgressWidth }"
    />
    <!-- Total Progress Bar (darker blue) -->
    <div
      class="absolute left-0 top-0 h-8 bg-[#185a8b]"
      :style="{ width: totalProgressWidth }"
    />

    <!-- Content (above progress bars) -->
    <div class="relative z-10 flex flex-1 items-center gap-2 py-1 pl-1 pr-2">
      <!-- Zap Icon -->
      <div class="flex h-6 w-6 shrink-0 flex-col items-center justify-center rounded p-1">
        <Icon name="zap" class="h-4 w-4 text-white" />
      </div>

      <!-- Info -->
      <div class="flex h-full flex-1 items-center gap-4 pr-1">
        <!-- Total Progress -->
        <div class="flex items-center gap-1">
          <span class="text-center text-xs font-normal text-white">Total:</span>
          <div class="flex w-[34px] items-center justify-end">
            <span class="text-right text-xs font-bold text-white">{{ totalPercent || 0 }}</span>
            <span class="text-center text-xs font-bold text-white">%</span>
          </div>
        </div>

        <!-- Current Node -->
        <div class="flex flex-1 items-center gap-1">
          <span class="flex-1 truncate text-right text-xs font-normal text-smoke-800">
            {{ currentNode || 'Processing' }}:
          </span>
          <div class="flex w-[31px] items-center justify-end">
            <span class="text-right text-xs font-normal text-smoke-800">{{ currentPercent || 0 }}</span>
            <span class="text-center text-xs font-normal text-smoke-800">%</span>
          </div>
        </div>
      </div>

      <!-- Cancel Button -->
      <div class="flex items-center gap-2">
        <button
          class="flex h-6 w-6 items-center justify-center rounded bg-[#b33a3a] p-1"
          @click="emit('cancel')"
        >
          <Icon name="x" class="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  </div>

  <!-- Done State -->
  <div
    v-else-if="isDone"
    class="group flex h-8 w-full flex-col items-start justify-center rounded-lg bg-charcoal-600"
  >
    <div class="flex flex-1 items-center gap-2 py-1 pl-1 pr-2">
      <!-- Thumbnail -->
      <div class="relative h-6 w-6 shrink-0 rounded">
        <!-- TODO: Replace with actual thumbnail -->
        <div class="absolute inset-0 rounded bg-charcoal-400" />
        <Icon name="image" class="absolute inset-0 m-auto h-3 w-3 text-smoke-800" />
      </div>

      <!-- Info -->
      <div class="flex h-full flex-1 items-center gap-4 pr-1">
        <div class="flex items-center">
          <span class="truncate text-xs font-normal text-white">{{ outputFilename }}</span>
        </div>
        <div class="flex flex-1 items-center justify-end" />
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <button
          class="flex h-6 items-center justify-center overflow-hidden rounded bg-charcoal-400 px-2 py-1"
          @click="emit('view')"
        >
          <span class="text-xs font-normal text-white">View</span>
        </button>
        <button
          class="flex h-6 items-center justify-center overflow-hidden rounded bg-charcoal-400 p-1"
          @click="emit('menu')"
        >
          <Icon name="ellipsis" class="h-4 w-4 text-white" />
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
      <div class="flex h-6 w-6 shrink-0 flex-col items-center justify-center rounded p-1">
        <Icon name="alert-circle" class="h-4 w-4 text-[#b33a3a]" />
      </div>

      <!-- Info -->
      <div class="flex h-full flex-1 items-center gap-4 pr-1">
        <div class="flex items-center">
          <span class="text-center text-xs font-normal text-[#b33a3a]">Failed</span>
        </div>
        <div class="flex flex-1 items-center justify-end">
          <span class="text-right text-xs font-normal text-smoke-800">{{ formattedTime }}</span>
        </div>
      </div>

      <!-- Actions (show on hover) -->
      <div class="hidden items-center gap-2 group-hover:flex">
        <button
          class="flex h-6 items-center justify-center overflow-hidden rounded bg-charcoal-400 p-1"
          @click="emit('menu')"
        >
          <Icon name="ellipsis" class="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  </div>
</template>
