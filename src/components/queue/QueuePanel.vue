<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@/components/ui/icon'
import { useQueueStore } from '@/stores/queueStore'
import QueueJobCard from './QueueJobCard.vue'

type TabId = 'all' | 'completed' | 'failed'

const queueStore = useQueueStore()

const props = defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const activeTab = ref<TabId>('all')

// Computed
const activeJobsCount = computed(() => {
  return queueStore.runningJobs.length + queueStore.pendingJobs.length
})

const queuedCount = computed(() => queueStore.pendingJobs.length)

const filteredJobs = computed(() => {
  switch (activeTab.value) {
    case 'completed':
      return queueStore.historyJobs.filter(j => j.state === 'completed')
    case 'failed':
      return queueStore.historyJobs.filter(j => j.state === 'failed')
    default:
      return [
        ...queueStore.runningJobs,
        ...queueStore.pendingJobs,
        ...queueStore.historyJobs
      ]
  }
})

// Group jobs by date
const groupedJobs = computed(() => {
  const groups: { label: string; jobs: typeof filteredJobs.value }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayJobs = filteredJobs.value.filter(job => {
    const jobDate = new Date(job.createdAt)
    jobDate.setHours(0, 0, 0, 0)
    return jobDate.getTime() === today.getTime()
  })

  if (todayJobs.length > 0) {
    groups.push({ label: 'Today', jobs: todayJobs })
  }

  // For now, just return today group - can extend for yesterday, older, etc.
  return groups.length > 0 ? groups : [{ label: 'Today', jobs: filteredJobs.value }]
})

function handleClose() {
  emit('update:modelValue', false)
  emit('close')
}

function handleClearQueue() {
  queueStore.clearQueue()
}

function handleShowAssets() {
  // TODO: Implement show assets panel
  console.log('Show assets')
}

function handleCancelJob(promptId: string) {
  queueStore.cancelJob(promptId)
}

function handleViewJob(promptId: string) {
  // TODO: Open job outputs in assets panel
  console.log('View job:', promptId)
}
</script>

<template>
  <div
    class="flex w-[326px] flex-col rounded-lg border border-charcoal-200 bg-charcoal-800 shadow-[1px_1px_8px_0px_rgba(0,0,0,0.4)]"
  >
    <!-- Header -->
    <div
      class="flex items-center border-b border-charcoal-300 px-2 py-2"
    >
      <div class="flex flex-1 items-center gap-2 px-2">
        <span class="text-sm font-normal text-white">
          {{ activeJobsCount }} active jobs
        </span>
      </div>
      <button
        class="flex h-8 min-h-[32px] items-center justify-center rounded-lg p-2"
        @click="handleClose"
      >
        <Icon name="x" class="h-4 w-4 text-smoke-800" />
      </button>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-4 px-3 pb-4 pt-0">
      <!-- Top Actions -->
      <div class="flex items-center gap-4 pt-4">
        <!-- Show Assets Button -->
        <button
          class="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-charcoal-600 p-2"
          @click="handleShowAssets"
        >
          <Icon name="sparkles" class="h-4 w-4 text-white" />
          <span class="text-xs font-normal text-white">Show assets</span>
        </button>

        <!-- Queued count and clear -->
        <div class="flex items-center gap-2">
          <span class="text-right text-sm">
            <span class="font-bold text-white">{{ queuedCount }}</span>
            <span class="text-white"> </span>
            <span class="text-xs text-white">queued</span>
          </span>
          <button
            class="flex h-8 min-h-[32px] items-center justify-center rounded-lg bg-charcoal-600 p-2"
            @click="handleClearQueue"
          >
            <Icon name="list-x" class="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex items-start gap-2">
        <div class="flex flex-1 items-center gap-2">
          <!-- All Tab -->
          <button
            :class="[
              'flex h-6 items-center justify-center overflow-hidden rounded px-3 py-1',
              activeTab === 'all' ? 'bg-charcoal-600' : ''
            ]"
            @click="activeTab = 'all'"
          >
            <span
              :class="[
                'text-xs font-normal',
                activeTab === 'all' ? 'text-white' : 'text-smoke-800'
              ]"
            >
              All
            </span>
          </button>

          <!-- Completed Tab -->
          <button
            :class="[
              'flex h-6 items-center justify-center overflow-hidden rounded px-2 py-1',
              activeTab === 'completed' ? 'bg-charcoal-600' : ''
            ]"
            @click="activeTab = 'completed'"
          >
            <span
              :class="[
                'text-xs font-normal',
                activeTab === 'completed' ? 'text-white' : 'text-smoke-800'
              ]"
            >
              Completed
            </span>
          </button>

          <!-- Failed Tab -->
          <button
            :class="[
              'flex h-6 items-center justify-center overflow-hidden rounded px-2 py-1',
              activeTab === 'failed' ? 'bg-charcoal-600' : ''
            ]"
            @click="activeTab = 'failed'"
          >
            <span
              :class="[
                'text-xs font-normal',
                activeTab === 'failed' ? 'text-white' : 'text-smoke-800'
              ]"
            >
              Failed
            </span>
          </button>
        </div>

        <!-- Filter Button -->
        <button
          class="flex h-6 items-center justify-center overflow-hidden rounded bg-charcoal-600 p-1"
        >
          <Icon name="list-filter" class="h-4 w-4 text-white" />
        </button>

        <!-- Sort Button -->
        <button
          class="flex h-6 items-center justify-center overflow-hidden rounded bg-charcoal-600 p-1"
        >
          <Icon name="arrow-up-down" class="h-4 w-4 text-white" />
        </button>
      </div>

      <!-- Job List -->
      <div class="flex flex-col gap-2">
        <template v-for="group in groupedJobs" :key="group.label">
          <!-- Date Label -->
          <p class="text-xs font-normal text-smoke-800">
            {{ group.label }}
          </p>

          <!-- Job Cards -->
          <QueueJobCard
            v-for="job in group.jobs"
            :key="job.id"
            :job="job"
            :current-node="job.state === 'running' ? queueStore.currentNodeName : undefined"
            :current-percent="job.state === 'running' ? queueStore.currentProgressPercent : undefined"
            :total-percent="job.state === 'running' ? queueStore.totalProgressPercent : undefined"
            @cancel="handleCancelJob(job.promptId)"
            @view="handleViewJob(job.promptId)"
          />
        </template>
      </div>
    </div>
  </div>
</template>
