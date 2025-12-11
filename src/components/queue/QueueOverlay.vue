<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@/components/ui/icon'
import { useQueueStore } from '@/stores/queueStore'
import QueueHeader from './QueueHeader.vue'
import QueueJobItem from './QueueJobItem.vue'
import QueueActiveProgress from './QueueActiveProgress.vue'
import DownloadJobCard from './DownloadJobCard.vue'
import type { QueueJob, DownloadJob } from '@/types/queue'

type TabId = 'all' | 'running' | 'pending' | 'downloads' | 'completed' | 'failed'

const queueStore = useQueueStore()

const isExpanded = ref(false)
const isHovered = ref(false)
const activeTab = ref<TabId>('all')

// Type guards
function isDownloadJob(job: QueueJob | DownloadJob): job is DownloadJob {
  return 'sourceUrl' in job
}

function isWorkflowJob(job: QueueJob | DownloadJob): job is QueueJob {
  return 'promptId' in job
}

// Auto-collapse when no jobs
watch(
  () => queueStore.hasAnyActiveJobs,
  (hasActive) => {
    if (!hasActive && !isHovered.value) {
      isExpanded.value = false
    }
  }
)

const tabs = [
  { id: 'all' as TabId, label: 'All' },
  { id: 'running' as TabId, label: 'Running' },
  { id: 'downloads' as TabId, label: 'Downloads' },
  { id: 'completed' as TabId, label: 'Completed' },
  { id: 'failed' as TabId, label: 'Failed' }
]

const filteredJobs = computed((): (QueueJob | DownloadJob)[] => {
  switch (activeTab.value) {
    case 'running':
      return queueStore.runningJobs
    case 'pending':
      return queueStore.pendingJobs
    case 'downloads':
      return queueStore.downloadJobs
    case 'completed':
      return [
        ...queueStore.historyJobs.filter(j => j.state === 'completed'),
        ...queueStore.downloadJobs.filter(j => j.state === 'completed')
      ]
    case 'failed':
      return [
        ...queueStore.historyJobs.filter(j => j.state === 'failed'),
        ...queueStore.downloadJobs.filter(j => j.state === 'failed')
      ]
    default:
      return [
        ...queueStore.runningJobs,
        ...queueStore.pendingJobs,
        ...queueStore.runningDownloads,
        ...queueStore.pendingDownloads,
        ...queueStore.historyJobs,
        ...queueStore.downloadHistory
      ]
  }
})

const showOverlay = computed(() => {
  return queueStore.hasAnyActiveJobs || isExpanded.value || queueStore.historyJobs.length > 0 || queueStore.downloadJobs.length > 0
})

const showActiveProgress = computed(() => {
  return queueStore.isExecuting && !isExpanded.value
})

function handleInterrupt(): void {
  queueStore.interrupt()
}

function handleClearQueue(): void {
  queueStore.clearQueue()
}

function handleClearHistory(): void {
  queueStore.clearHistory()
  queueStore.clearDownloadHistory()
}

function handleCancelJob(promptId: string): void {
  queueStore.cancelJob(promptId)
}

function handleDeleteJob(promptId: string): void {
  queueStore.deleteJob(promptId)
}

function handleViewJob(promptId: string): void {
  // TODO: Open job details/outputs
  console.log('View job:', promptId)
}

// Download job handlers
function handleCancelDownload(jobId: string): void {
  queueStore.cancelDownload(jobId)
}

function handleRetryDownload(jobId: string): void {
  queueStore.retryDownload(jobId)
}

function handleDeleteDownload(jobId: string): void {
  queueStore.deleteDownload(jobId)
}

function toggleExpanded(): void {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div
    v-if="showOverlay"
    class="fixed bottom-4 right-4 z-50 flex w-80 flex-col overflow-hidden rounded-lg border border-border bg-background shadow-lg"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Header -->
    <div
      class="flex h-9 cursor-pointer items-center justify-between border-b border-border bg-background/80 px-3 backdrop-blur"
      @click="toggleExpanded"
    >
      <!-- Left: Title and counts -->
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-foreground">Queue</span>

        <!-- Running indicator (workflow) -->
        <div
          v-if="queueStore.runningCount > 0"
          class="flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5"
        >
          <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
          <span class="text-[10px] font-medium text-blue-500">{{ queueStore.runningCount }}</span>
        </div>

        <!-- Pending count (workflow) -->
        <div
          v-if="queueStore.pendingCount > 0"
          class="flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5"
        >
          <Icon name="clock" size="xs" class="text-amber-500" />
          <span class="text-[10px] font-medium text-amber-500">{{ queueStore.pendingCount }}</span>
        </div>

        <!-- Download indicator -->
        <div
          v-if="queueStore.downloadCount > 0"
          class="flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5"
        >
          <Icon name="download" size="xs" class="text-emerald-500" />
          <span class="text-[10px] font-medium text-emerald-500">{{ queueStore.downloadCount }}</span>
        </div>
      </div>

      <!-- Right: Expand/Collapse and actions -->
      <div class="flex items-center gap-1">
        <!-- Interrupt button (visible when running) -->
        <button
          v-if="queueStore.runningCount > 0"
          v-tooltip.bottom="'Interrupt'"
          class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          @click.stop="handleInterrupt"
        >
          <Icon name="stop" size="xs" />
        </button>

        <!-- Clear queue button (visible when pending) -->
        <button
          v-if="queueStore.pendingCount > 0"
          v-tooltip.bottom="'Clear queue'"
          class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-amber-500/10 hover:text-amber-500"
          @click.stop="handleClearQueue"
        >
          <Icon name="times" size="xs" />
        </button>

        <!-- Expand/Collapse icon -->
        <Icon
          :name="isExpanded ? 'chevron-down' : 'chevron-up'"
          size="xs"
          class="text-muted-foreground"
        />
      </div>
    </div>

    <!-- Active Progress (collapsed view) -->
    <QueueActiveProgress
      v-if="showActiveProgress"
      :current-node="queueStore.currentNodeName"
      :current-percent="queueStore.currentProgressPercent"
      :total-percent="queueStore.totalProgressPercent"
      :running-count="queueStore.runningCount"
      :pending-count="queueStore.pendingCount"
      @interrupt="handleInterrupt"
      @clear-queue="handleClearQueue"
      @expand="isExpanded = true"
    />

    <!-- Expanded View -->
    <template v-if="isExpanded">
      <!-- Tabs -->
      <div class="flex border-b border-border bg-muted/50">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'flex-1 px-2 py-1.5 text-xs font-medium transition-colors',
            activeTab === tab.id
              ? 'border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Job list -->
      <div class="max-h-64 flex-1 overflow-y-auto p-2">
        <template v-if="filteredJobs.length > 0">
          <div class="flex flex-col gap-2">
            <template v-for="job in filteredJobs" :key="job.id">
              <!-- Download Job Card -->
              <DownloadJobCard
                v-if="isDownloadJob(job)"
                :job="job"
                @cancel="handleCancelDownload(job.id)"
                @retry="handleRetryDownload(job.id)"
                @delete="handleDeleteDownload(job.id)"
              />

              <!-- Workflow Job Item -->
              <QueueJobItem
                v-else-if="isWorkflowJob(job)"
                :job-id="job.id"
                :state="job.state"
                :title="job.title"
                :progress-current-percent="job.state === 'running' ? queueStore.currentProgressPercent : undefined"
                :progress-total-percent="job.state === 'running' ? queueStore.totalProgressPercent : undefined"
                :current-node="job.state === 'running' ? queueStore.currentNodeName || undefined : undefined"
                @cancel="handleCancelJob(job.promptId)"
                @delete="handleDeleteJob(job.promptId)"
                @view="handleViewJob(job.promptId)"
              />
            </template>
          </div>
        </template>

        <!-- Empty state -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-8 text-center text-muted-foreground"
        >
          <Icon name="inbox" size="lg" class="mb-2" />
          <span class="text-sm">No jobs</span>
        </div>
      </div>

      <!-- Footer with clear history -->
      <div v-if="queueStore.historyJobs.length > 0 || queueStore.downloadHistory.length > 0" class="border-t border-border p-2">
        <button
          class="flex w-full items-center justify-center gap-1.5 rounded-md py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          @click="handleClearHistory"
        >
          <Icon name="trash" size="xs" />
          <span>Clear History</span>
        </button>
      </div>
    </template>

    <!-- Completion summary (when nothing running but has history) -->
    <div
      v-if="!queueStore.hasAnyActiveJobs && !isExpanded && (queueStore.historyJobs.length > 0 || queueStore.downloadHistory.length > 0)"
      class="flex items-center justify-between px-3 py-2"
    >
      <div class="flex items-center gap-2">
        <Icon name="check-circle" size="sm" class="text-emerald-500" />
        <span class="text-xs text-muted-foreground">
          {{ queueStore.historyJobs.length + queueStore.downloadHistory.length }} completed
        </span>
      </div>
      <button
        class="text-xs text-primary hover:underline"
        @click="isExpanded = true"
      >
        View all
      </button>
    </div>
  </div>
</template>

<style scoped>
div::-webkit-scrollbar {
  width: 6px;
}

div::-webkit-scrollbar-track {
  background: transparent;
}

div::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}
</style>
