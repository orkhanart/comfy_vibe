<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@/components/ui/icon'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { useQueueStore } from '@/stores/queueStore'
import type { AutoQueueMode } from '@/types/queue'

const queueStore = useQueueStore()

const menuOpen = ref(false)
const isShiftPressed = ref(false)

// Track shift key
function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Shift') isShiftPressed.value = true
}

function handleKeyup(e: KeyboardEvent): void {
  if (e.key === 'Shift') isShiftPressed.value = false
}

// Setup keyboard listeners
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('keyup', handleKeyup)
}

const buttonLabel = computed(() => {
  if (queueStore.isExecuting) return 'Running...'
  if (isShiftPressed.value) return 'Queue'
  return 'Run'
})

const buttonIcon = computed(() => {
  if (queueStore.isExecuting) return 'spinner'
  if (isShiftPressed.value) return 'plus'
  return 'play'
})

const modeLabel = computed(() => {
  switch (queueStore.autoQueueMode) {
    case 'instant':
      return 'Auto (Instant)'
    case 'change':
      return 'Auto (On Change)'
    default:
      return ''
  }
})

function runWorkflow(): void {
  // Use demo mode for prototyping
  queueStore.runDemo()
}

function addToQueue(): void {
  queueStore.addDemoToQueue()
}

function setMode(mode: AutoQueueMode): void {
  queueStore.setAutoQueueMode(mode)
  menuOpen.value = false
}

function incrementBatch(): void {
  queueStore.setBatchCount(queueStore.batchCount + 1)
}

function decrementBatch(): void {
  queueStore.setBatchCount(queueStore.batchCount - 1)
}
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Batch count -->
    <div class="flex items-center rounded-md border border-border bg-background">
      <button
        class="flex h-8 w-7 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        :disabled="queueStore.batchCount <= 1"
        @click="decrementBatch"
      >
        <Icon name="minus" size="xs" />
      </button>
      <span class="w-6 text-center text-sm font-medium text-foreground">
        {{ queueStore.batchCount }}
      </span>
      <button
        class="flex h-8 w-7 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        @click="incrementBatch"
      >
        <Icon name="plus" size="xs" />
      </button>
    </div>

    <!-- Queue indicator -->
    <div
      v-if="queueStore.pendingCount > 0"
      class="flex items-center gap-1.5 rounded-md bg-amber-500/20 px-2.5 py-1.5 text-xs font-medium text-amber-400"
    >
      <Icon name="list" size="xs" />
      <span>{{ queueStore.pendingCount }} in queue</span>
      <button
        class="ml-1 rounded p-0.5 transition-colors hover:bg-amber-500/20"
        @click="queueStore.clearQueue"
      >
        <Icon name="times" size="xs" />
      </button>
    </div>

    <!-- Auto-queue mode indicator -->
    <div
      v-if="queueStore.autoQueueMode !== 'disabled'"
      class="rounded-md bg-emerald-500/20 px-2.5 py-1.5 text-xs font-medium text-emerald-400"
    >
      {{ modeLabel }}
    </div>

    <!-- Run Button with Dropdown -->
    <div class="relative flex">
      <button
        class="flex h-8 items-center gap-1.5 rounded-l-md bg-blue-600 px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-500 disabled:opacity-50"
        :disabled="queueStore.isExecuting"
        @click="runWorkflow"
      >
        <Icon
          :name="buttonIcon"
          size="xs"
          :class="queueStore.isExecuting ? 'animate-spin' : ''"
        />
        <span>{{ buttonLabel }}</span>
      </button>

      <Popover v-model:open="menuOpen">
        <PopoverTrigger as-child>
          <button
            class="flex h-8 items-center rounded-r-md border-l border-blue-500 bg-blue-600 px-1.5 text-white shadow-sm transition-colors hover:bg-blue-500"
          >
            <Icon name="chevron-down" size="xs" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" class="w-52 p-0">
          <div class="flex flex-col py-1">
            <!-- Run options -->
            <button
              class="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              @click="runWorkflow(); menuOpen = false"
            >
              <Icon name="play" size="xs" class="text-blue-500" />
              <span>Run Workflow</span>
              <span class="ml-auto text-xs text-muted-foreground">⌘↵</span>
            </button>

            <button
              class="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              @click="addToQueue(); menuOpen = false"
            >
              <Icon name="plus" size="xs" class="text-amber-500" />
              <span>Add to Queue</span>
              <span class="ml-auto text-xs text-muted-foreground">⇧↵</span>
            </button>

            <div class="my-1 h-px bg-border" />

            <!-- Auto-queue modes -->
            <div class="px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Auto Queue
            </div>

            <button
              :class="[
                'flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent',
                queueStore.autoQueueMode === 'disabled' ? 'text-foreground' : 'text-muted-foreground'
              ]"
              @click="setMode('disabled')"
            >
              <Icon name="times" size="xs" />
              <span>Disabled</span>
              <Icon
                v-if="queueStore.autoQueueMode === 'disabled'"
                name="check"
                size="xs"
                class="ml-auto text-primary"
              />
            </button>

            <button
              :class="[
                'flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent',
                queueStore.autoQueueMode === 'change' ? 'text-foreground' : 'text-muted-foreground'
              ]"
              @click="setMode('change')"
            >
              <Icon name="sync" size="xs" class="text-green-500" />
              <span>On Change</span>
              <Icon
                v-if="queueStore.autoQueueMode === 'change'"
                name="check"
                size="xs"
                class="ml-auto text-primary"
              />
            </button>

            <button
              :class="[
                'flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent',
                queueStore.autoQueueMode === 'instant' ? 'text-foreground' : 'text-muted-foreground'
              ]"
              @click="setMode('instant')"
            >
              <Icon name="bolt" size="xs" class="text-amber-500" />
              <span>Instant</span>
              <Icon
                v-if="queueStore.autoQueueMode === 'instant'"
                name="check"
                size="xs"
                class="ml-auto text-primary"
              />
            </button>

            <div class="my-1 h-px bg-border" />

            <!-- Clear actions -->
            <button
              class="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              :disabled="queueStore.pendingCount === 0"
              @click="queueStore.clearQueue(); menuOpen = false"
            >
              <Icon name="trash" size="xs" class="text-red-500" />
              <span>Clear Queue</span>
            </button>

            <button
              v-if="queueStore.isExecuting"
              class="flex items-center gap-2 px-3 py-2 text-sm text-destructive transition-colors hover:bg-accent"
              @click="queueStore.interrupt(); menuOpen = false"
            >
              <Icon name="stop" size="xs" />
              <span>Interrupt</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </div>
</template>
