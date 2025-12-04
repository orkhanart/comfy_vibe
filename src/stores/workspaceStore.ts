import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorkspaceStore = defineStore('workspace', () => {
  const currentWorkspaceId = ref<string | null>(null)
  const currentProjectId = ref<string | null>(null)
  const currentWorkflowId = ref<string | null>(null)
  const openWorkflows = ref<string[]>([])

  function setCurrentIds(workspaceId: string, projectId: string, workflowId: string): void {
    currentWorkspaceId.value = workspaceId
    currentProjectId.value = projectId
    currentWorkflowId.value = workflowId
  }

  function openWorkflow(workflowId: string, _name: string, _projectId: string): void {
    if (!openWorkflows.value.includes(workflowId)) {
      openWorkflows.value.push(workflowId)
    }
  }

  function closeWorkflow(workflowId: string): void {
    const index = openWorkflows.value.indexOf(workflowId)
    if (index > -1) {
      openWorkflows.value.splice(index, 1)
    }
  }

  return {
    currentWorkspaceId,
    currentProjectId,
    currentWorkflowId,
    openWorkflows,
    setCurrentIds,
    openWorkflow,
    closeWorkflow,
  }
})
