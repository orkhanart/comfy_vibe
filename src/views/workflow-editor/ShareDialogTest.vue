<script setup lang="ts">
import { ref } from 'vue'
import { ShareDialog } from '@/components/common'
import { Button } from '@/components/ui/button'

const isOpen = ref(true)

// Mock workflow data for testing
const mockWorkflow = {
  id: 'wf-test-123',
  name: 'Test Workflow - SDXL Portrait',
  type: 'workflow' as const
}
</script>

<template>
  <div class="min-h-screen bg-background p-8">
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold">Share Dialog Test Page</h1>
        <p class="text-muted-foreground">
          Testing the workflow share dialog component
        </p>
      </div>

      <div class="flex gap-4">
        <Button @click="isOpen = true">
          Open Share Dialog
        </Button>
      </div>

      <div class="p-4 bg-muted rounded-lg">
        <p class="text-sm text-muted-foreground">
          <strong>Test Workflow:</strong> {{ mockWorkflow.name }}<br>
          <strong>ID:</strong> {{ mockWorkflow.id }}
        </p>
      </div>

      <ShareDialog
        :open="isOpen"
        :item-type="mockWorkflow.type"
        :item-name="mockWorkflow.name"
        :item-id="mockWorkflow.id"
        @update:open="isOpen = $event"
      />
    </div>
  </div>
</template>
