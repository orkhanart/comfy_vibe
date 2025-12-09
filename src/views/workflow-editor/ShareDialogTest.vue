<script setup lang="ts">
import { ref } from 'vue'
import { ShareDialog } from '@/components/common'
import WorkflowEditorView from '@/views/WorkflowEditorView.vue'

const isOpen = ref(true)

// Mock workflow data for testing
const mockWorkflow = {
  id: 'wf-test-123',
  name: 'Test Workflow - SDXL Portrait',
  type: 'workflow' as const
}

// Mock route params for the workflow editor
const mockRouteParams = {
  workspaceId: 'ws-1',
  projectId: 'proj-1',
  workflowId: 'wf-1'
}
</script>

<template>
  <div class="relative h-screen w-screen overflow-hidden">
    <!-- Workflow Editor as background -->
    <WorkflowEditorView
      :workspace-id="mockRouteParams.workspaceId"
      :project-id="mockRouteParams.projectId"
      :workflow-id="mockRouteParams.workflowId"
    />

    <!-- Share Dialog overlay -->
    <ShareDialog
      :open="isOpen"
      :item-type="mockWorkflow.type"
      :item-name="mockWorkflow.name"
      :item-id="mockWorkflow.id"
      @update:open="isOpen = $event"
    />
  </div>
</template>
