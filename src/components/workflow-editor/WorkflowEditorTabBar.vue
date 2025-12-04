<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import WorkflowEditorLogoMenu from './WorkflowEditorLogoMenu.vue'
import WorkflowEditorShareDialog from './WorkflowEditorShareDialog.vue'
import { useUiStore } from '@/stores/uiStore'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const router = useRouter()
const uiStore = useUiStore()
const showShareDialog = ref(false)
const showMenu = ref(false)
const showProjectsDropdown = ref(false)
const showWorkflowsDropdown = ref(false)
const activeContextMenu = ref<string | null>(null)

// Mock data for projects and workflows
const projects = ref([
  { id: 'project-1', name: 'My First Project' },
  { id: 'project-2', name: 'Portrait Generation' },
  { id: 'project-3', name: 'Landscape Art' },
])

const workflows = ref([
  { id: 'workflow-1', name: 'Main Workflow' },
  { id: 'workflow-2', name: 'Upscale Pipeline' },
  { id: 'workflow-3', name: 'ControlNet Test' },
  { id: 'workflow-4', name: 'Inpainting Flow' },
])

const selectedProject = ref('project-1')
const selectedWorkflow = ref('workflow-1')

const selectedProjectName = computed(() => {
  return projects.value.find(p => p.id === selectedProject.value)?.name || 'Select project'
})

const selectedWorkflowName = computed(() => {
  return workflows.value.find(w => w.id === selectedWorkflow.value)?.name || 'Select workflow'
})

function handleLogoClick(): void {
  showMenu.value = !showMenu.value
}

function handleHomeClick(): void {
  router.push({ name: 'workspace-dashboard', params: { workspaceId: 'default' } })
}

function handleProjectSelect(projectId: string): void {
  selectedProject.value = projectId
  showProjectsDropdown.value = false
  console.log('Selected project:', projectId)
}

function handleWorkflowSelect(workflowId: string): void {
  selectedWorkflow.value = workflowId
  showWorkflowsDropdown.value = false
  uiStore.selectWorkflowTab(workflowId)
  console.log('Selected workflow:', workflowId)
}

function toggleContextMenu(itemId: string, event: MouseEvent): void {
  event.stopPropagation()
  activeContextMenu.value = activeContextMenu.value === itemId ? null : itemId
}

function handleContextAction(action: string, itemId: string, itemType: 'project' | 'workflow'): void {
  console.log(`Action: ${action} on ${itemType} ${itemId}`)
  activeContextMenu.value = null

  switch (action) {
    case 'rename':
      // TODO: Implement rename
      break
    case 'duplicate':
      // TODO: Implement duplicate
      break
    case 'delete':
      // TODO: Implement delete
      break
    case 'move':
      // TODO: Implement move
      break
    case 'share':
      showShareDialog.value = true
      break
  }
}
</script>

<template>
  <div class="flex h-10 items-center gap-1 border-b border-border bg-background px-2 select-none">
    <!-- Logo Section -->
    <div class="relative">
      <button
        class="flex items-center gap-1 rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        @click="handleLogoClick"
      >
        <img :src="uiStore.themeMode === 'dark' ? '/assets/images/comfy-logo-mono.svg' : '/assets/images/comfy-logo-single.svg'" alt="Comfy" class="h-5 w-5" />
        <Icon name="chevron-down" size="xs" class="opacity-70" />
      </button>

      <WorkflowEditorLogoMenu :show="showMenu" @close="showMenu = false" />
    </div>

    <!-- Divider -->
    <div class="mx-1 h-5 w-px bg-border" />

    <!-- Home Button -->
    <button
      v-tooltip.bottom="{ value: 'Home', showDelay: 50 }"
      class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      @click="handleHomeClick"
    >
      <Icon name="home" size="md" />
    </button>

    <!-- Divider -->
    <div class="mx-1 h-5 w-px bg-border" />

    <!-- Projects Dropdown -->
    <Popover v-model:open="showProjectsDropdown">
      <PopoverTrigger as-child>
        <button
          class="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors hover:bg-accent"
        >
          <Icon name="folder" size="xs" class="shrink-0 opacity-60" />
          <span class="max-w-[120px] truncate">{{ selectedProjectName }}</span>
          <Icon name="chevron-down" size="xs" class="shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" :side-offset="4" class="w-[220px] p-1">
        <div class="flex flex-col">
          <div
            v-for="project in projects"
            :key="project.id"
            class="group flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent cursor-pointer"
            :class="{ 'bg-accent/50': project.id === selectedProject }"
            @click="handleProjectSelect(project.id)"
          >
            <div class="flex items-center gap-2 min-w-0">
              <Icon name="folder" size="sm" class="shrink-0 opacity-60" />
              <span class="truncate">{{ project.name }}</span>
            </div>
            <Popover>
              <PopoverTrigger as-child>
                <button
                  class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground/50 transition-colors hover:bg-accent-foreground/10 hover:text-foreground"
                  @click.stop
                >
                  <Icon name="ellipsis-v" size="sm" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" side="right" :side-offset="4" class="w-[140px] p-1">
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                  @click="handleContextAction('rename', project.id, 'project')"
                >
                  <Icon name="edit" size="xs" class="opacity-60" />
                  Rename
                </button>
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                  @click="handleContextAction('duplicate', project.id, 'project')"
                >
                  <Icon name="copy" size="xs" class="opacity-60" />
                  Duplicate
                </button>
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                  @click="handleContextAction('move', project.id, 'project')"
                >
                  <Icon name="folder" size="xs" class="opacity-60" />
                  Move
                </button>
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                  @click="handleContextAction('share', project.id, 'project')"
                >
                  <Icon name="share-alt" size="xs" class="opacity-60" />
                  Share
                </button>
                <div class="my-1 h-px bg-border" />
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  @click="handleContextAction('delete', project.id, 'project')"
                >
                  <Icon name="trash" size="xs" class="opacity-60" />
                  Delete
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </PopoverContent>
    </Popover>

    <!-- Separator Slash -->
    <span class="text-muted-foreground/50 text-sm">/</span>

    <!-- Workflows Dropdown -->
    <Popover v-model:open="showWorkflowsDropdown">
      <PopoverTrigger as-child>
        <button
          class="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors hover:bg-accent"
        >
          <Icon name="sitemap" size="xs" class="shrink-0 opacity-60" />
          <span class="max-w-[120px] truncate">{{ selectedWorkflowName }}</span>
          <Icon name="chevron-down" size="xs" class="shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" :side-offset="4" class="w-[220px] p-1">
        <div class="flex flex-col">
          <div
            v-for="workflow in workflows"
            :key="workflow.id"
            class="group flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent cursor-pointer"
            :class="{ 'bg-accent/50': workflow.id === selectedWorkflow }"
            @click="handleWorkflowSelect(workflow.id)"
          >
            <div class="flex items-center gap-2 min-w-0">
              <Icon name="sitemap" size="sm" class="shrink-0 opacity-60" />
              <span class="truncate">{{ workflow.name }}</span>
            </div>
            <Popover>
              <PopoverTrigger as-child>
                <button
                  class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground/50 transition-colors hover:bg-accent-foreground/10 hover:text-foreground"
                  @click.stop
                >
                  <Icon name="ellipsis-v" size="sm" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" side="right" :side-offset="4" class="w-[140px] p-1">
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                  @click="handleContextAction('rename', workflow.id, 'workflow')"
                >
                  <Icon name="edit" size="xs" class="opacity-60" />
                  Rename
                </button>
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                  @click="handleContextAction('duplicate', workflow.id, 'workflow')"
                >
                  <Icon name="copy" size="xs" class="opacity-60" />
                  Duplicate
                </button>
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                  @click="handleContextAction('move', workflow.id, 'workflow')"
                >
                  <Icon name="folder" size="xs" class="opacity-60" />
                  Move
                </button>
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                  @click="handleContextAction('share', workflow.id, 'workflow')"
                >
                  <Icon name="share-alt" size="xs" class="opacity-60" />
                  Share
                </button>
                <div class="my-1 h-px bg-border" />
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  @click="handleContextAction('delete', workflow.id, 'workflow')"
                >
                  <Icon name="trash" size="xs" class="opacity-60" />
                  Delete
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </PopoverContent>
    </Popover>

    <!-- Right Section -->
    <div class="ml-auto flex items-center gap-1">
      <!-- Mode Toggle -->
      <div class="flex h-7 items-center rounded-md bg-muted p-0.5">
        <button
          class="flex h-6 items-center gap-1 rounded px-2 text-xs font-medium bg-background text-foreground shadow-sm"
        >
          <Icon name="sitemap" size="xs" />
          Workflow
        </button>
        <button
          class="flex h-6 items-center gap-1 rounded px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          @click="router.push({ name: 'linear-mode' })"
        >
          <Icon name="sliders-h" size="xs" />
          Linear
        </button>
      </div>

      <!-- Divider -->
      <div class="mx-1 h-5 w-px bg-border" />

      <button
        v-tooltip.bottom="{ value: 'Share', showDelay: 50 }"
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        @click="showShareDialog = true"
      >
        <Icon name="share-alt" size="sm" />
      </button>
    </div>

    <!-- Share Dialog -->
    <WorkflowEditorShareDialog
      v-model:visible="showShareDialog"
      :workflow-name="uiStore.activeWorkflowName"
    />
  </div>
</template>
