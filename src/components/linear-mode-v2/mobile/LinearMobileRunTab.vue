<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ref, computed } from 'vue'

// Workflow state
interface Workflow {
  id: string
  name: string
  description?: string
  thumbnail?: string
}

const workflows = ref<Workflow[]>([
  { id: '1', name: 'Text to Image', description: 'Generate images from text prompts' },
  { id: '2', name: 'Image to Image', description: 'Transform existing images' },
  { id: '3', name: 'Inpainting', description: 'Edit specific parts of images' },
  { id: '4', name: 'Upscale', description: 'Enhance image resolution' },
  { id: '5', name: 'ControlNet Pose', description: 'Control with pose detection' },
])

const selectedWorkflowId = ref('1')
const showWorkflowDropdown = ref(false)
const defaultWorkflow: Workflow = { id: '0', name: 'No Workflow', description: 'Select a workflow' }
const selectedWorkflow = computed((): Workflow => {
  return workflows.value.find(w => w.id === selectedWorkflowId.value) ?? workflows.value[0] ?? defaultWorkflow
})

function selectWorkflow(id: string) {
  selectedWorkflowId.value = id
}

function handleImportWorkflow() {
  // Trigger file input for workflow import
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      // Handle workflow import
      console.log('Importing workflow:', file.name)
    }
  }
  input.click()
}

// Form state
const uploadedImage = ref<string | null>(null)
const prompt = ref('')
const steps = ref(20)
const seed = ref(1809000312992)
const randomizeSeed = ref(true)
const cfg = ref(1.0)
const sampler = ref('euler')
const scheduler = ref('normal')
const generations = ref(1)

const advancedOpen = ref(false)
const isRunning = ref(false)
const isDragging = ref(false)

const samplers = ['euler', 'euler_ancestral', 'heun', 'dpm_2', 'dpm_2_ancestral', 'lms', 'ddim', 'uni_pc']
const schedulers = ['normal', 'karras', 'exponential', 'sgm_uniform', 'simple', 'ddim_uniform']

const canRun = computed(() => prompt.value.trim().length > 0)

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    readImageFile(file)
  }
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    readImageFile(file)
  }
}

function readImageFile(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedImage.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  uploadedImage.value = null
}

async function runWorkflow() {
  if (!canRun.value) return
  isRunning.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  isRunning.value = false
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Workflow Sidebar Section -->
    <div class="border-b border-border bg-muted/30 p-3">
      <div class="flex items-center gap-2">
        <!-- Workflow Dropdown -->
        <Popover v-model:open="showWorkflowDropdown">
          <PopoverTrigger as-child>
            <button
              class="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left transition-colors hover:bg-muted/50"
            >
              <div class="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Icon name="workflow" size="sm" class="text-primary" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <span class="truncate text-sm font-medium">{{ selectedWorkflow.name }}</span>
                  <span
                    v-if="isRunning"
                    class="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-1.5 py-0.5 text-[10px] font-medium text-green-600"
                  >
                    <span class="size-1.5 animate-pulse rounded-full bg-green-500" />
                    Running
                  </span>
                </div>
                <span class="truncate text-xs text-muted-foreground">{{ selectedWorkflow.description }}</span>
              </div>
              <Icon name="chevron-down" size="sm" class="shrink-0 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" :side-offset="4" class="w-[calc(100vw-24px)] max-w-[320px] p-1">
            <div class="px-2 py-1.5 text-xs font-medium text-muted-foreground">Select Workflow</div>
            <button
              v-for="workflow in workflows"
              :key="workflow.id"
              class="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-left transition-colors hover:bg-accent"
              @click="selectWorkflow(workflow.id); showWorkflowDropdown = false"
            >
              <div class="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon name="workflow" size="sm" class="text-muted-foreground" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <span class="truncate text-sm font-medium">{{ workflow.name }}</span>
                  <Icon
                    v-if="workflow.id === selectedWorkflowId"
                    name="check"
                    size="xs"
                    class="text-primary"
                  />
                </div>
                <span class="truncate text-xs text-muted-foreground">{{ workflow.description }}</span>
              </div>
            </button>
            <div class="my-1 h-px bg-border" />
            <button
              class="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-left transition-colors hover:bg-accent"
              @click="handleImportWorkflow(); showWorkflowDropdown = false"
            >
              <div class="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon name="upload" size="sm" class="text-muted-foreground" />
              </div>
              <span class="text-sm">Import Workflow</span>
            </button>
          </PopoverContent>
        </Popover>

        <!-- Import Button -->
        <Button
          variant="outline"
          size="icon"
          class="size-10 shrink-0"
          @click="handleImportWorkflow"
        >
          <Icon name="upload" size="sm" />
        </Button>
      </div>
    </div>

    <div class="flex-1 space-y-3 overflow-y-auto p-3">
      <!-- Image Upload -->
      <div
        v-if="!uploadedImage"
        class="flex h-20 items-center justify-center rounded-lg border border-dashed transition-colors"
        :class="isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
        <label class="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <Icon name="image" size="sm" />
          <span>Add image</span>
          <input type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
        </label>
      </div>
      <div v-else class="relative h-20 overflow-hidden rounded-lg">
        <img :src="uploadedImage" alt="Uploaded" class="h-full w-full object-cover" />
        <button
          class="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/50 text-white"
          @click="removeImage"
        >
          <Icon name="times" size="xs" />
        </button>
      </div>

      <!-- Prompt -->
      <textarea
        v-model="prompt"
        placeholder="Describe what you want to create..."
        class="h-24 w-full resize-none rounded-lg border border-border bg-muted/30 p-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
      />

      <!-- Quick Settings Grid -->
      <div class="grid grid-cols-2 gap-2">
        <!-- Steps -->
        <div class="rounded-lg border border-border bg-muted/30 p-2.5">
          <div class="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">Steps</div>
          <input
            v-model.number="steps"
            type="number"
            class="w-full bg-transparent text-sm font-medium outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <!-- Seed -->
        <div class="rounded-lg border border-border bg-muted/30 p-2.5">
          <div class="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">Seed</div>
          <input
            v-model.number="seed"
            type="number"
            :disabled="randomizeSeed"
            class="w-full bg-transparent text-sm font-medium outline-none disabled:text-muted-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      <!-- Batch Size -->
      <div class="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-2.5">
        <span class="text-sm">Batch size</span>
        <div class="flex items-center gap-3">
          <button
            class="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="generations > 1 && generations--"
          >
            <Icon name="minus" size="sm" />
          </button>
          <span class="w-6 text-center text-sm font-medium">{{ generations }}</span>
          <button
            class="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="generations++"
          >
            <Icon name="plus" size="sm" />
          </button>
        </div>
      </div>

      <!-- Randomize Seed -->
      <div class="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-2.5">
        <span class="text-sm">Randomize seed</span>
        <Switch v-model:checked="randomizeSeed" />
      </div>

      <!-- Advanced Toggle -->
      <button
        class="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 p-2.5"
        @click="advancedOpen = !advancedOpen"
      >
        <span class="text-sm">Advanced settings</span>
        <Icon :name="advancedOpen ? 'chevron-up' : 'chevron-down'" size="sm" class="text-muted-foreground" />
      </button>

      <!-- Advanced Section -->
      <div v-show="advancedOpen" class="space-y-2">
        <!-- CFG -->
        <div class="rounded-lg border border-border bg-muted/30 p-2.5">
          <div class="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">CFG Scale</div>
          <input
            v-model.number="cfg"
            type="number"
            step="0.1"
            class="w-full bg-transparent text-sm font-medium outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <!-- Sampler & Scheduler -->
        <div class="grid grid-cols-2 gap-2">
          <div class="space-y-1">
            <div class="text-[10px] uppercase tracking-wide text-muted-foreground">Sampler</div>
            <Select v-model="sampler">
              <SelectTrigger class="h-9 border-border bg-muted/30">
                <SelectValue :placeholder="sampler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="s in samplers" :key="s" :value="s">{{ s }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-1">
            <div class="text-[10px] uppercase tracking-wide text-muted-foreground">Scheduler</div>
            <Select v-model="scheduler">
              <SelectTrigger class="h-9 border-border bg-muted/30">
                <SelectValue :placeholder="scheduler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="s in schedulers" :key="s" :value="s">{{ s }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>

    <!-- Run Button -->
    <div class="border-t border-border p-3">
      <button
        :disabled="!canRun || isRunning"
        class="flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors"
        :class="canRun && !isRunning ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
        @click="runWorkflow"
      >
        <Icon v-if="isRunning" name="spinner" size="sm" class="animate-spin" />
        <Icon v-else name="play" size="sm" />
        {{ isRunning ? 'Running...' : 'Generate' }}
      </button>
    </div>
  </div>
</template>
