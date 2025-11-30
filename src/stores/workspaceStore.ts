import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface WorkflowInfo {
  id: string
  name: string
  description?: string
  thumbnail?: string
}

const SAMPLE_WORKFLOWS: WorkflowInfo[] = [
  { id: 'sdxl-simple', name: 'SDXL Text to Image', description: 'Generate high-quality images from text prompts' },
  { id: 'flux-schnell', name: 'Flux Schnell', description: 'Fast image generation with Flux model' },
  { id: 'upscale-4x', name: '4x Upscaler', description: 'Upscale images to 4x resolution' },
  { id: 'controlnet-pose', name: 'ControlNet Pose', description: 'Generate images with pose control' },
  { id: 'inpainting', name: 'Inpainting', description: 'Fill in or modify parts of an image' },
]

const PROJECT_NAMES = [
  'Dreamy Landscapes',
  'Portrait Studio',
  'Concept Art Generator',
  'Product Photography',
  'Anime Characters',
  'Architecture Viz',
  'Fashion Lookbook',
  'Game Assets',
  'Album Covers',
  'Logo Variations',
  'Texture Pack',
  'Character Design',
  'Storyboard Frames',
  'Icon Set',
  'Wallpaper Collection',
]

function getRandomProjectName(): string {
  return PROJECT_NAMES[Math.floor(Math.random() * PROJECT_NAMES.length)]!
}

export const useWorkspaceStore = defineStore('workspace', () => {
  const currentWorkspaceId = ref<string | null>(null)
  const currentProjectId = ref<string | null>(null)
  const currentCanvasId = ref<string | null>(null)
  const currentProjectName = ref<string>(getRandomProjectName())
  const openCanvases = ref<string[]>([])

  // Workflow state - shared between Node and Linear modes
  const availableWorkflows = ref<WorkflowInfo[]>(SAMPLE_WORKFLOWS)
  const currentWorkflow = ref<WorkflowInfo | null>(SAMPLE_WORKFLOWS[0] ?? null)

  function setCurrentIds(workspaceId: string, projectId: string, canvasId: string): void {
    currentWorkspaceId.value = workspaceId
    currentProjectId.value = projectId
    currentCanvasId.value = canvasId
  }

  function setProjectName(name: string): void {
    currentProjectName.value = name
  }

  function setCurrentWorkflow(workflow: WorkflowInfo | null): void {
    currentWorkflow.value = workflow
  }

  function setCurrentWorkflowById(workflowId: string): void {
    const workflow = availableWorkflows.value.find(w => w.id === workflowId)
    if (workflow) {
      currentWorkflow.value = workflow
    }
  }

  function openCanvas(canvasId: string, _name: string, _projectId: string): void {
    if (!openCanvases.value.includes(canvasId)) {
      openCanvases.value.push(canvasId)
    }
  }

  function closeCanvas(canvasId: string): void {
    const index = openCanvases.value.indexOf(canvasId)
    if (index > -1) {
      openCanvases.value.splice(index, 1)
    }
  }

  return {
    currentWorkspaceId,
    currentProjectId,
    currentCanvasId,
    currentProjectName,
    openCanvases,
    availableWorkflows,
    currentWorkflow,
    setCurrentIds,
    setProjectName,
    setCurrentWorkflow,
    setCurrentWorkflowById,
    openCanvas,
    closeCanvas,
  }
})
