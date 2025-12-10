<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { computed } from 'vue'

const props = defineProps<{
  currentNode?: string | null
  currentPercent: number
  totalPercent: number
  runningCount: number
  pendingCount: number
}>()

const emit = defineEmits<{
  interrupt: []
  clearQueue: []
  expand: []
}>()

const currentProgressStyle = computed(() => ({
  width: `${props.currentPercent}%`
}))

const totalProgressStyle = computed(() => ({
  width: `${props.totalPercent}%`
}))
</script>

<template>
  <div class="flex flex-col gap-2 p-3">
    <!-- Progress bars -->
    <div class="flex flex-col gap-1.5">
      <!-- Total progress bar -->
      <div class="relative h-2 overflow-hidden rounded-full bg-muted">
        <div
          class="absolute inset-y-0 left-0 rounded-full bg-blue-500/30 transition-all duration-300"
          :style="totalProgressStyle"
        />
        <div
          class="absolute inset-y-0 left-0 rounded-full bg-blue-500 transition-all duration-150"
          :style="currentProgressStyle"
        />
      </div>

      <!-- Progress info -->
      <div class="flex items-center justify-between text-xs">
        <span v-if="currentNode" class="truncate text-muted-foreground">
          {{ currentNode }}
        </span>
        <span v-else class="text-muted-foreground">Processing...</span>
        <span class="font-medium text-foreground">{{ currentPercent }}%</span>
      </div>
    </div>

    <!-- Action row -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <!-- Running count -->
        <div class="flex items-center gap-1 rounded bg-blue-500/10 px-2 py-1">
          <Icon name="spinner" size="xs" class="animate-spin text-blue-500" />
          <span class="text-xs font-medium text-blue-500">{{ runningCount }} running</span>
        </div>

        <!-- Pending count -->
        <div v-if="pendingCount > 0" class="flex items-center gap-1 rounded bg-amber-500/10 px-2 py-1">
          <Icon name="clock" size="xs" class="text-amber-500" />
          <span class="text-xs font-medium text-amber-500">{{ pendingCount }} queued</span>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <!-- Interrupt button -->
        <button
          v-tooltip.top="'Interrupt all'"
          class="flex h-7 items-center gap-1.5 rounded-md bg-destructive/10 px-2.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
          @click="emit('interrupt')"
        >
          <Icon name="stop" size="xs" />
          <span>Stop</span>
        </button>

        <!-- View all button -->
        <button
          v-tooltip.top="'View all jobs'"
          class="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          @click="emit('expand')"
        >
          <Icon name="chevron-down" size="xs" />
        </button>
      </div>
    </div>
  </div>
</template>
