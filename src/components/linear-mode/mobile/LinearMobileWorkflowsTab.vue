<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'

interface Workflow {
  id: string
  name: string
  description?: string
  lastRun?: Date
  runCount: number
}

const searchQuery = ref('')

// Mock workflows data
const workflows = ref<Workflow[]>([
  {
    id: 'workflow-1',
    name: 'Text to Image',
    description: 'Generate images from text prompts',
    lastRun: new Date(Date.now() - 3600000),
    runCount: 42,
  },
  {
    id: 'workflow-2',
    name: 'Image to Image',
    description: 'Transform existing images',
    lastRun: new Date(Date.now() - 86400000),
    runCount: 28,
  },
  {
    id: 'workflow-3',
    name: 'Upscale',
    description: 'Enhance image resolution',
    lastRun: new Date(Date.now() - 172800000),
    runCount: 15,
  },
  {
    id: 'workflow-4',
    name: 'ControlNet Pose',
    description: 'Generate with pose control',
    lastRun: new Date(Date.now() - 259200000),
    runCount: 8,
  },
  {
    id: 'workflow-5',
    name: 'Inpainting',
    description: 'Edit parts of images',
    runCount: 0,
  },
])

function formatLastRun(date?: Date): string {
  if (!date) return 'Never run'

  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / 3600000)

  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function handleWorkflowClick(workflow: Workflow): void {
  console.log('Selected workflow:', workflow)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Search Bar -->
    <div class="border-b border-border bg-background p-3">
      <div class="relative">
        <Icon name="search" size="sm" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search workflows..."
          class="h-9 w-full rounded-md border border-border bg-transparent pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </div>
    </div>

    <!-- Workflows List -->
    <div class="flex-1 overflow-y-auto">
      <div class="flex flex-col divide-y divide-border">
        <button
          v-for="workflow in workflows"
          :key="workflow.id"
          class="flex items-center gap-3 bg-background p-3 text-left transition-colors hover:bg-accent/50"
          @click="handleWorkflowClick(workflow)"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon name="sitemap" size="sm" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-foreground">{{ workflow.name }}</p>
            <p v-if="workflow.description" class="truncate text-xs text-muted-foreground">
              {{ workflow.description }}
            </p>
          </div>
          <div class="shrink-0 text-right">
            <p class="text-xs text-muted-foreground">{{ formatLastRun(workflow.lastRun) }}</p>
            <p class="text-[10px] text-muted-foreground/60">{{ workflow.runCount }} runs</p>
          </div>
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-if="workflows.length === 0"
        class="flex flex-col items-center justify-center py-12 text-muted-foreground"
      >
        <Icon name="workflow" size="lg" class="mb-2" />
        <span class="text-sm">No workflows yet</span>
      </div>
    </div>
  </div>
</template>
