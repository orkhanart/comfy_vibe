<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed, watch } from 'vue'

export type InputType = 'text' | 'textarea' | 'image' | 'number' | 'slider' | 'select' | 'toggle' | 'color' | 'seed'

export interface ExposedInput {
  id: string
  nodeId: string
  inputName: string
  type: InputType
  label: string
  description?: string
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  min?: number
  max?: number
  step?: number
  default?: string | number | boolean
  required?: boolean
  group?: string
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  exposedInputs: ExposedInput[]
}

const props = defineProps<{
  workflow: WorkflowTemplate | null
}>()

const emit = defineEmits<{
  run: [values: Record<string, unknown>, images: Record<string, string>]
}>()

const formValues = ref<Record<string, string | number | boolean | null>>({})
const uploadedImages = ref<Record<string, string>>({})
const isRunning = ref(false)

// Initialize form values when workflow changes
watch(
  () => props.workflow,
  (workflow) => {
    formValues.value = {}
    uploadedImages.value = {}

    if (!workflow) return

    for (const input of workflow.exposedInputs) {
      if (input.default !== undefined) {
        formValues.value[input.id] = input.default
      } else if (input.type === 'seed') {
        formValues.value[input.id] = -1
      } else {
        formValues.value[input.id] = ''
      }
    }
  },
  { immediate: true }
)

const groupedInputs = computed(() => {
  if (!props.workflow) return {}
  const groups: Record<string, ExposedInput[]> = {}
  for (const input of props.workflow.exposedInputs) {
    const group = input.group ?? 'General'
    if (!groups[group]) groups[group] = []
    groups[group].push(input)
  }
  return groups
})

const canRun = computed(() => {
  if (!props.workflow) return false
  for (const input of props.workflow.exposedInputs) {
    if (input.required) {
      if (input.type === 'image') {
        if (!uploadedImages.value[input.id]) return false
      } else {
        const value = formValues.value[input.id]
        if (value === '' || value === null || value === undefined) return false
      }
    }
  }
  return true
})

function handleImageUpload(inputId: string, event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImages.value[inputId] = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function removeImage(inputId: string): void {
  delete uploadedImages.value[inputId]
}

function randomizeSeed(inputId: string): void {
  formValues.value[inputId] = Math.floor(Math.random() * 2147483647)
}

async function runWorkflow(): Promise<void> {
  isRunning.value = true
  emit('run', { ...formValues.value }, { ...uploadedImages.value })

  // Simulate run
  await new Promise(resolve => setTimeout(resolve, 2000))
  isRunning.value = false
}
</script>

<template>
  <div class="flex h-full w-80 flex-col border-l border-border bg-background">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-border px-3 py-2">
      <span class="text-sm font-medium text-foreground">Parameters</span>
    </div>

    <!-- Empty State -->
    <div v-if="!workflow" class="flex flex-1 flex-col items-center justify-center p-4 text-center">
      <Icon name="sliders-h" size="2xl" class="mb-2 text-muted-foreground/50" />
      <p class="text-sm text-muted-foreground">No workflow loaded</p>
      <p class="mt-1 text-xs text-muted-foreground/70">Load a workflow to see its parameters</p>
    </div>

    <!-- Dynamic Form -->
    <template v-else>
      <div class="flex-1 overflow-y-auto p-3">
        <div v-for="(inputs, groupName) in groupedInputs" :key="groupName" class="mb-4">
          <p class="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{{ groupName }}</p>

          <div class="flex flex-col gap-3">
            <div v-for="input in inputs" :key="input.id">
              <label class="mb-1 flex items-center gap-1 text-xs font-medium text-foreground">
                {{ input.label }}
                <span v-if="input.required" class="text-red-400">*</span>
              </label>
              <p v-if="input.description" class="mb-1 text-[10px] text-muted-foreground">{{ input.description }}</p>

              <!-- Image Upload -->
              <div v-if="input.type === 'image'">
                <div v-if="!uploadedImages[input.id]" class="relative">
                  <input
                    type="file"
                    accept="image/*"
                    class="absolute inset-0 cursor-pointer opacity-0"
                    @change="handleImageUpload(input.id, $event)"
                  />
                  <div class="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-border bg-card text-muted-foreground transition-colors hover:border-accent hover:text-muted-foreground">
                    <div class="flex flex-col items-center">
                      <Icon name="image" size="2xl" />
                      <span class="mt-1 text-[10px]">Click or drop image</span>
                    </div>
                  </div>
                </div>
                <div v-else class="relative">
                  <img :src="uploadedImages[input.id]" class="aspect-video w-full rounded-lg object-cover" />
                  <button
                    class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-popover/60 text-white transition-colors hover:bg-red-600"
                    @click="removeImage(input.id)"
                  >
                    <Icon name="times" size="xs" />
                  </button>
                </div>
              </div>

              <!-- Textarea -->
              <textarea
                v-else-if="input.type === 'textarea'"
                v-model="formValues[input.id]"
                :placeholder="input.placeholder"
                rows="3"
                class="w-full resize-none rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />

              <!-- Text Input -->
              <input
                v-else-if="input.type === 'text'"
                v-model="formValues[input.id]"
                type="text"
                :placeholder="input.placeholder"
                class="w-full rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />

              <!-- Number Input -->
              <input
                v-else-if="input.type === 'number'"
                v-model.number="formValues[input.id]"
                type="number"
                :min="input.min"
                :max="input.max"
                :step="input.step"
                class="w-full rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
              />

              <!-- Seed Input -->
              <div v-else-if="input.type === 'seed'" class="flex gap-2">
                <input
                  v-model.number="formValues[input.id]"
                  type="number"
                  placeholder="-1 for random"
                  class="flex-1 rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                />
                <button
                  v-tooltip.top="'Random'"
                  class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  @click="randomizeSeed(input.id)"
                >
                  <Icon name="refresh" size="xs" />
                </button>
              </div>

              <!-- Select -->
              <select
                v-else-if="input.type === 'select'"
                v-model="formValues[input.id]"
                class="w-full rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
              >
                <option v-for="opt in input.options" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>

              <!-- Slider -->
              <div v-else-if="input.type === 'slider'" class="flex items-center gap-3">
                <input
                  v-model.number="formValues[input.id]"
                  type="range"
                  :min="input.min"
                  :max="input.max"
                  :step="input.step"
                  class="flex-1"
                />
                <span class="w-12 text-right text-xs tabular-nums text-muted-foreground">
                  {{ typeof formValues[input.id] === 'number' ? formValues[input.id].toFixed(2) : formValues[input.id] }}
                </span>
              </div>

              <!-- Toggle -->
              <button
                v-else-if="input.type === 'toggle'"
                :class="[
                  'relative h-6 w-11 rounded-full transition-colors',
                  formValues[input.id] ? 'bg-primary' : 'bg-muted'
                ]"
                @click="formValues[input.id] = !formValues[input.id]"
              >
                <span
                  :class="[
                    'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
                    formValues[input.id] ? 'left-6' : 'left-1'
                  ]"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Run Button -->
      <div class="border-t border-border p-3">
        <button
          :disabled="!canRun || isRunning"
          :class="[
            'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
            canRun && !isRunning
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground'
          ]"
          @click="runWorkflow"
        >
          <Icon v-if="isRunning" name="spinner" size="sm" class="animate-spin" />
          <Icon v-else name="play" size="sm" />
          <span>{{ isRunning ? 'Running...' : 'Run' }}</span>
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
div::-webkit-scrollbar {
  width: 4px;
}

div::-webkit-scrollbar-track {
  background: transparent;
}

div::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 2px;
}

input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 2px;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: hsl(var(--primary));
  border-radius: 50%;
  cursor: pointer;
}
</style>
