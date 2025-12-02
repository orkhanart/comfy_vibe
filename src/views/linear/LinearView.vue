<script setup lang="ts">
import { ref } from 'vue'
import LinearTopBar from '@/components/linear/LinearTopBar.vue'
import LinearParametersPanel from '@/components/linear/LinearParametersPanel.vue'
import LinearHistoryPanel from '@/components/linear/LinearHistoryPanel.vue'
import type { WorkflowTemplate } from '@/components/linear/LinearParametersPanel.vue'

// Mock workflow for now - in real app this would come from store/route
const currentWorkflow = ref<WorkflowTemplate>({
  id: 'sdxl-simple',
  name: 'SDXL Text to Image',
  description: 'Generate images from text prompts',
  exposedInputs: [
    { id: 'prompt', nodeId: '3', inputName: 'text', type: 'textarea', label: 'Prompt', placeholder: 'Describe your image...', required: true, group: 'Input' },
    { id: 'negative', nodeId: '4', inputName: 'text', type: 'textarea', label: 'Negative Prompt', placeholder: 'What to avoid...', group: 'Input' },
    { id: 'width', nodeId: '5', inputName: 'width', type: 'number', label: 'Width', default: 1024, min: 512, max: 2048, step: 64, group: 'Size' },
    { id: 'height', nodeId: '5', inputName: 'height', type: 'number', label: 'Height', default: 1024, min: 512, max: 2048, step: 64, group: 'Size' },
    { id: 'seed', nodeId: '7', inputName: 'seed', type: 'seed', label: 'Seed', default: -1, group: 'Settings' },
    { id: 'steps', nodeId: '3', inputName: 'steps', type: 'slider', label: 'Steps', default: 20, min: 1, max: 50, step: 1, group: 'Settings' },
  ],
})

function handleRun(values: Record<string, unknown>, images: Record<string, string>): void {
  console.log('Run workflow:', values, images)
}
</script>

<template>
  <div class="linear-view flex h-screen flex-col bg-background">
    <!-- Top Bar -->
    <LinearTopBar />

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left: History/Output Panel -->
      <LinearHistoryPanel />

      <!-- Right: Parameters Panel -->
      <LinearParametersPanel
        :workflow="currentWorkflow"
        @run="handleRun"
      />
    </div>
  </div>
</template>

<style scoped>
.linear-view {
  font-family: var(--font-sans, system-ui);
}
</style>
