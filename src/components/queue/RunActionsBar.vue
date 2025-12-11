<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@/components/ui/icon'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { useQueueStore } from '@/stores/queueStore'
import QueuePanel from './QueuePanel.vue'
import { AssetsExtendedModal } from '@/components/common'

const queueStore = useQueueStore()

const showRunMenu = ref(false)
const showAssetsModal = ref(false)

const activeJobsCount = computed(() => {
  return queueStore.runningJobs.length + queueStore.pendingJobs.length
})

function handleRun() {
  queueStore.runDemo()
}

function handleShowHistory() {
  queueStore.showQueuePanel = !queueStore.showQueuePanel
}

function incrementBatch() {
  queueStore.setBatchCount(queueStore.batchCount + 1)
}

function decrementBatch() {
  queueStore.setBatchCount(Math.max(1, queueStore.batchCount - 1))
}
</script>

<template>
  <div class="relative">
    <!-- Run Actions Bar -->
    <div
      class="flex h-12 items-center overflow-hidden rounded-lg border border-charcoal-200 bg-charcoal-800 shadow-[1px_1px_8px_0px_rgba(0,0,0,0.4)]"
    >
      <div class="flex items-center gap-2 px-2">
        <!-- Run Button Group -->
        <div class="flex items-center overflow-hidden rounded-lg bg-charcoal-600">
          <!-- Batch Count -->
          <button
            class="flex h-8 items-center gap-1 bg-charcoal-600 py-2 pl-3 pr-2"
            @click="incrementBatch"
          >
            <span class="text-right text-sm font-normal text-white">
              {{ queueStore.batchCount }}
            </span>
            <Icon name="chevrons-up-down" class="h-4 w-4 text-smoke-800" />
          </button>

          <!-- Run Button -->
          <button
            class="flex h-8 min-h-[32px] items-center justify-center gap-1 rounded-lg bg-azure-600 p-2"
            @click="handleRun"
          >
            <Icon name="play" class="h-4 w-4 text-white" />
            <span class="text-sm font-normal text-white">Run</span>
          </button>

          <!-- Dropdown -->
          <Popover v-model:open="showRunMenu">
            <PopoverTrigger as-child>
              <button class="flex h-full items-center justify-center bg-charcoal-600 p-1">
                <Icon name="chevron-down" class="h-3 w-3 text-smoke-800" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" class="w-48 p-0">
              <div class="flex flex-col py-1">
                <button
                  class="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                  @click="handleRun(); showRunMenu = false"
                >
                  <Icon name="play" class="h-4 w-4 text-azure-600" />
                  <span>Run Workflow</span>
                </button>
                <button
                  class="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                  @click="queueStore.addDemoToQueue(); showRunMenu = false"
                >
                  <Icon name="plus" class="h-4 w-4 text-gold-500" />
                  <span>Add to Queue</span>
                </button>
                <div class="my-1 h-px bg-border" />
                <button
                  class="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                  @click="queueStore.clearQueue(); showRunMenu = false"
                >
                  <Icon name="trash" class="h-4 w-4 text-coral-500" />
                  <span>Clear Queue</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <!-- History Button -->
        <button
          class="flex h-8 min-h-[32px] items-center justify-center rounded-lg bg-charcoal-600 p-2"
          @click="handleShowHistory"
        >
          <Icon name="history" class="h-4 w-4 text-smoke-800" />
        </button>
      </div>
    </div>

    <!-- Queue Panel (positioned below) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-[-8px]"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-[-8px]"
    >
      <div
        v-if="queueStore.showQueuePanel || activeJobsCount > 0"
        class="absolute right-0 top-[52px]"
      >
        <QueuePanel
          v-model="queueStore.showQueuePanel"
          @close="queueStore.showQueuePanel = false"
          @show-assets="showAssetsModal = true"
        />
      </div>
    </Transition>

    <!-- Assets Extended Modal -->
    <AssetsExtendedModal v-model:visible="showAssetsModal" />
  </div>
</template>
