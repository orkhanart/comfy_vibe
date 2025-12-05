<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/uiStore'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const router = useRouter()
const uiStore = useUiStore()
const showWorkflowsDropdown = ref(false)

// Mock workflows data
const workflows = ref([
  { id: 'workflow-1', name: 'Main Workflow' },
  { id: 'workflow-2', name: 'Upscale Pipeline' },
  { id: 'workflow-3', name: 'ControlNet Test' },
  { id: 'workflow-4', name: 'Inpainting Flow' },
])

const selectedWorkflow = ref('workflow-1')

function handleHomeClick(): void {
  router.push({ name: 'workspace-dashboard', params: { workspaceId: 'default' } })
}

function handleWorkflowSelect(workflowId: string): void {
  selectedWorkflow.value = workflowId
  showWorkflowsDropdown.value = false
}

function getSelectedWorkflowName(): string {
  return workflows.value.find(w => w.id === selectedWorkflow.value)?.name || 'Select workflow'
}
</script>

<template>
  <header class="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background px-3 safe-area-top">
    <!-- Logo -->
    <button class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent">
      <img
        :src="uiStore.themeMode === 'dark' ? '/assets/images/comfy-logo-mono.svg' : '/assets/images/comfy-logo-single.svg'"
        alt="Comfy"
        class="h-5 w-5"
      />
    </button>

    <!-- Divider -->
    <div class="h-5 w-px bg-border" />

    <!-- Home Button -->
    <button
      class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent"
      @click="handleHomeClick"
    >
      <Icon name="home" size="sm" />
    </button>

    <!-- Divider -->
    <div class="h-5 w-px bg-border" />

    <!-- Workflow Selector -->
    <Popover v-model:open="showWorkflowsDropdown">
      <PopoverTrigger as-child>
        <button class="flex flex-1 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent">
          <Icon name="sitemap" size="xs" class="shrink-0 opacity-60" />
          <span class="truncate">{{ getSelectedWorkflowName() }}</span>
          <Icon name="chevron-down" size="xs" class="shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" :side-offset="4" class="w-[200px] p-1">
        <div class="flex flex-col">
          <button
            v-for="workflow in workflows"
            :key="workflow.id"
            class="flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
            :class="{ 'bg-accent/50': workflow.id === selectedWorkflow }"
            @click="handleWorkflowSelect(workflow.id)"
          >
            <Icon name="sitemap" size="sm" class="shrink-0 opacity-60" />
            <span class="truncate">{{ workflow.name }}</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  </header>
</template>

<style scoped>
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}
</style>
