<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

const runMenuOpen = ref(false)
const isRunning = ref(false)
const queueCount = ref(0)

function runWorkflow(): void {
  isRunning.value = true
  setTimeout(() => {
    isRunning.value = false
  }, 2000)
}

function runOnChange(): void {
  // Toggle run on change mode
}

function addToQueue(): void {
  queueCount.value++
}

function clearQueue(): void {
  queueCount.value = 0
}
</script>

<template>
  <div class="absolute right-4 top-4 z-10 flex items-center gap-2">
    <!-- Queue indicator -->
    <div
      v-if="queueCount > 0"
      class="flex items-center gap-1.5 rounded-md bg-amber-500/20 px-2.5 py-1.5 text-xs font-medium text-amber-400"
    >
      <Icon name="list" size="xs" />
      <span>{{ queueCount }} in queue</span>
      <button
        class="ml-1 rounded p-0.5 transition-colors hover:bg-amber-500/20"
        @click="clearQueue"
      >
        <Icon name="times" size="xs" />
      </button>
    </div>

    <!-- Add to Queue -->
    <button
      v-tooltip.bottom="{ value: 'Add to Queue', showDelay: 50 }"
      class="flex h-8 items-center gap-1.5 rounded-md bg-muted/80 px-3 text-sm text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent hover:text-foreground"
      @click="addToQueue"
    >
      <Icon name="plus" size="xs" />
      <span>Queue</span>
    </button>

    <!-- Run Button with Dropdown -->
    <div class="relative flex">
      <button
        class="flex h-8 items-center gap-1.5 rounded-l-md bg-blue-600 px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-500"
        :disabled="isRunning"
        @click="runWorkflow"
      >
        <Icon :name="isRunning ? 'spinner' : 'play'" size="xs" :class="isRunning ? 'animate-spin' : ''" />
        <span>{{ isRunning ? 'Running...' : 'Run' }}</span>
      </button>

      <Popover v-model:open="runMenuOpen">
        <PopoverTrigger as-child>
          <button
            class="flex h-8 items-center rounded-r-md border-l border-blue-500 bg-blue-600 px-1.5 text-white shadow-sm transition-colors hover:bg-blue-500"
          >
            <Icon name="chevron-down" size="xs" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" class="w-48 p-0">
          <div class="flex flex-col py-1">
            <button
              class="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              @click="runWorkflow(); runMenuOpen = false"
            >
              <Icon name="play" size="xs" class="text-blue-500" />
              <span>Run Workflow</span>
              <span class="ml-auto text-xs text-muted-foreground">⌘↵</span>
            </button>
            <button
              class="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              @click="runOnChange(); runMenuOpen = false"
            >
              <Icon name="sync" size="xs" class="text-green-500" />
              <span>Run on Change</span>
            </button>
            <div class="my-1 h-px bg-border" />
            <button
              class="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              @click="addToQueue(); runMenuOpen = false"
            >
              <Icon name="plus" size="xs" class="text-amber-500" />
              <span>Add to Queue</span>
              <span class="ml-auto text-xs text-muted-foreground">⌘⇧↵</span>
            </button>
            <button
              class="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              @click="clearQueue(); runMenuOpen = false"
            >
              <Icon name="trash" size="xs" class="text-red-500" />
              <span>Clear Queue</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </div>
</template>
