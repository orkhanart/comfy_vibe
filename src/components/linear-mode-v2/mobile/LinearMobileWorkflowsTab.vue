<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'

interface Workflow {
  id: string
  name: string
  description?: string
  lastRun?: Date
  runCount: number
}

const searchQuery = ref('')

const workflows = ref<Workflow[]>([
  { id: 'workflow-1', name: 'Text to Image', description: 'Generate images from text prompts', lastRun: new Date(Date.now() - 3600000), runCount: 42 },
  { id: 'workflow-2', name: 'Image to Image', description: 'Transform existing images', lastRun: new Date(Date.now() - 86400000), runCount: 28 },
  { id: 'workflow-3', name: 'Upscale', description: 'Enhance image resolution', lastRun: new Date(Date.now() - 172800000), runCount: 15 },
  { id: 'workflow-4', name: 'ControlNet Pose', description: 'Generate with pose control', lastRun: new Date(Date.now() - 259200000), runCount: 8 },
  { id: 'workflow-5', name: 'Inpainting', description: 'Edit parts of images', runCount: 0 },
])

const filteredWorkflows = computed(() => {
  if (!searchQuery.value) return workflows.value
  const q = searchQuery.value.toLowerCase()
  return workflows.value.filter(w => w.name.toLowerCase().includes(q) || w.description?.toLowerCase().includes(q))
})

function formatLastRun(date?: Date): string {
  if (!date) return 'Never'
  const diff = Date.now() - date.getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function handleWorkflowClick(workflow: Workflow): void {
  console.log('Selected workflow:', workflow)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Search -->
    <div class="p-3">
      <div class="relative">
        <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search workflows..."
          class="h-9 w-full rounded-lg border border-border bg-muted/30 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </div>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto px-3 pb-3">
      <div class="space-y-2">
        <button
          v-for="workflow in filteredWorkflows"
          :key="workflow.id"
          class="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary"
          @click="handleWorkflowClick(workflow)"
        >
          <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon name="sitemap" size="sm" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium">{{ workflow.name }}</p>
            <p v-if="workflow.description" class="truncate text-xs text-muted-foreground">{{ workflow.description }}</p>
          </div>
          <div class="shrink-0 text-right text-[10px] text-muted-foreground">
            <p>{{ formatLastRun(workflow.lastRun) }}</p>
            <p class="opacity-60">{{ workflow.runCount }} runs</p>
          </div>
        </button>
      </div>

      <!-- Empty -->
      <div v-if="filteredWorkflows.length === 0" class="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Icon name="workflow" size="xl" class="mb-3 opacity-50" />
        <p class="text-sm">No workflows found</p>
      </div>
    </div>
  </div>
</template>
