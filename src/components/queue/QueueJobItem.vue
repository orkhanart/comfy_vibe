<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@/components/ui/icon'
import type { JobState } from '@/types/queue'

const props = defineProps<{
  jobId: string
  state: JobState
  title: string
  progressCurrentPercent?: number
  progressTotalPercent?: number
  currentNode?: string
  showClear?: boolean
  showMenu?: boolean
}>()

const emit = defineEmits<{
  cancel: []
  delete: []
  view: []
}>()

const isRunning = computed(() => props.state === 'running')
const isPending = computed(() => props.state === 'pending')
const isCompleted = computed(() => props.state === 'completed')
const isFailed = computed(() => props.state === 'failed')

const stateIcon = computed(() => {
  switch (props.state) {
    case 'running':
      return 'spinner'
    case 'pending':
      return 'clock'
    case 'completed':
      return 'check-circle'
    case 'failed':
      return 'exclamation-circle'
    case 'cancelled':
      return 'times-circle'
    default:
      return 'circle'
  }
})

const stateColor = computed(() => {
  switch (props.state) {
    case 'running':
      return 'text-blue-500'
    case 'pending':
      return 'text-amber-500'
    case 'completed':
      return 'text-emerald-500'
    case 'failed':
      return 'text-red-500'
    case 'cancelled':
      return 'text-muted-foreground'
    default:
      return 'text-muted-foreground'
  }
})

const progressBarStyle = computed(() => ({
  width: `${props.progressTotalPercent || 0}%`
}))

const currentProgressStyle = computed(() => ({
  width: `${props.progressCurrentPercent || 0}%`
}))
</script>

<template>
  <div
    class="group relative flex items-center gap-3 border-b border-border px-3 py-2.5 transition-colors hover:bg-accent/50"
  >
    <!-- State icon -->
    <div :class="['flex h-5 w-5 items-center justify-center', stateColor]">
      <Icon
        :name="stateIcon"
        size="sm"
        :class="isRunning ? 'animate-spin' : ''"
      />
    </div>

    <!-- Content -->
    <div class="min-w-0 flex-1">
      <div class="flex items-center justify-between gap-2">
        <span class="truncate text-sm font-medium text-foreground">
          {{ title }}
        </span>

        <!-- Action buttons - show on hover -->
        <div class="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <!-- View button for completed jobs -->
          <button
            v-if="isCompleted"
            v-tooltip.top="'View outputs'"
            class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click.stop="emit('view')"
          >
            <Icon name="eye" size="xs" />
          </button>

          <!-- Cancel button for running/pending -->
          <button
            v-if="isRunning || isPending"
            v-tooltip.top="'Cancel'"
            class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
            @click.stop="emit('cancel')"
          >
            <Icon name="times" size="xs" />
          </button>

          <!-- Delete button for history -->
          <button
            v-if="isCompleted || isFailed"
            v-tooltip.top="'Delete'"
            class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
            @click.stop="emit('delete')"
          >
            <Icon name="trash" size="xs" />
          </button>
        </div>
      </div>

      <!-- Progress bar for running jobs -->
      <div v-if="isRunning" class="mt-1.5">
        <div class="relative h-1.5 overflow-hidden rounded-full bg-muted">
          <!-- Total progress (background) -->
          <div
            class="absolute inset-y-0 left-0 rounded-full bg-blue-500/30 transition-all duration-300"
            :style="progressBarStyle"
          />
          <!-- Current node progress (foreground) -->
          <div
            class="absolute inset-y-0 left-0 rounded-full bg-blue-500 transition-all duration-150"
            :style="currentProgressStyle"
          />
        </div>
        <div v-if="currentNode" class="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
          <span class="truncate">{{ currentNode }}</span>
          <span>{{ progressCurrentPercent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
