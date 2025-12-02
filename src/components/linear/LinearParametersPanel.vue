<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ref, computed } from 'vue'

const emit = defineEmits<{
  run: [params: RunParams]
}>()

export interface RunParams {
  prompt: string
  steps: number
  seed: number
  randomizeSeed: boolean
  cfg: number
  sampler: string
  scheduler: string
  generations: number
  image?: string
}

// Form state
const uploadedImage = ref<string | null>(null)
const prompt = ref('beautiful scenery nature glass bottle landscape, purple galaxy bottle,')
const steps = ref(20)
const seed = ref(1809000312992)
const randomizeSeed = ref(true)
const cfg = ref(1.0)
const sampler = ref('euler')
const scheduler = ref('normal')
const generations = ref(99)

const advancedOpen = ref(true)
const isRunning = ref(false)
const isDragging = ref(false)

const samplers = ['euler', 'euler_ancestral', 'heun', 'dpm_2', 'dpm_2_ancestral', 'lms', 'ddim', 'uni_pc']
const schedulers = ['normal', 'karras', 'exponential', 'sgm_uniform', 'simple', 'ddim_uniform']

const canRun = computed(() => prompt.value.trim().length > 0)

function increment(ref: { value: number }, step = 1, max?: number) {
  if (max === undefined || ref.value + step <= max) {
    ref.value += step
  }
}

function decrement(ref: { value: number }, step = 1, min = 0) {
  if (ref.value - step >= min) {
    ref.value -= step
  }
}

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

function generateRandomSeed() {
  seed.value = Math.floor(Math.random() * 9999999999999)
}

async function runWorkflow() {
  if (!canRun.value) return

  isRunning.value = true

  const params: RunParams = {
    prompt: prompt.value,
    steps: steps.value,
    seed: randomizeSeed.value ? Math.floor(Math.random() * 9999999999999) : seed.value,
    randomizeSeed: randomizeSeed.value,
    cfg: cfg.value,
    sampler: sampler.value,
    scheduler: scheduler.value,
    generations: generations.value,
    image: uploadedImage.value || undefined
  }

  emit('run', params)

  // Simulate running for now
  await new Promise(resolve => setTimeout(resolve, 2000))
  isRunning.value = false
}
</script>

<template>
  <div class="flex h-full w-80 flex-col border-l border-border bg-background">
    <!-- Header -->
    <div class="flex h-10 items-center border-b border-border px-3">
      <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Info</span>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="flex flex-col gap-5 p-4">
        <!-- Image Upload -->
        <div class="flex flex-col gap-2">
          <label class="text-sm text-foreground">Image upload</label>
          <div
            v-if="!uploadedImage"
            class="relative flex h-28 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors"
            :class="isDragging ? 'border-primary bg-primary/5' : 'border-border'"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
          >
            <span class="text-sm text-muted-foreground">Drag an image or</span>
            <label class="cursor-pointer rounded-md bg-accent px-3 py-1.5 text-sm text-foreground hover:bg-accent/80">
              Browse
              <Icon name="image" size="sm" class="ml-1 inline" />
              <input type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
            </label>
          </div>
          <div v-else class="relative">
            <img :src="uploadedImage" alt="Uploaded" class="h-28 w-full rounded-lg object-cover" />
            <button
              class="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-background"
              @click="removeImage"
            >
              <Icon name="times" size="xs" />
            </button>
          </div>
        </div>

        <!-- Prompt -->
        <div class="flex flex-col gap-2">
          <label class="text-sm text-foreground">Prompt</label>
          <Textarea
            v-model="prompt"
            placeholder="Enter your prompt..."
            class="min-h-[100px] resize-none border-border bg-transparent text-sm"
          />
        </div>

        <!-- Steps -->
        <div class="flex flex-col gap-2">
          <label class="text-sm text-foreground">Steps</label>
          <div class="flex h-10 items-center rounded-md border border-border">
            <button
              class="flex h-full w-10 items-center justify-center text-muted-foreground hover:text-foreground"
              @click="decrement(steps, 1, 1)"
            >
              <Icon name="minus" size="sm" />
            </button>
            <input
              v-model.number="steps"
              type="number"
              class="h-full flex-1 bg-transparent text-center text-sm text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              class="flex h-full w-10 items-center justify-center text-muted-foreground hover:text-foreground"
              @click="increment(steps)"
            >
              <Icon name="plus" size="sm" />
            </button>
          </div>
        </div>

        <!-- Seed -->
        <div class="flex flex-col gap-2">
          <label class="text-sm text-foreground">Seed</label>
          <div class="flex h-10 items-center rounded-md border border-border">
            <button
              class="flex h-full w-10 items-center justify-center text-muted-foreground hover:text-foreground"
              @click="decrement(seed)"
            >
              <Icon name="minus" size="sm" />
            </button>
            <input
              v-model.number="seed"
              type="number"
              class="h-full flex-1 bg-transparent text-center text-sm text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              class="flex h-full w-10 items-center justify-center text-muted-foreground hover:text-foreground"
              @click="increment(seed)"
            >
              <Icon name="plus" size="sm" />
            </button>
          </div>
        </div>

        <!-- Randomize Seed Toggle -->
        <div class="flex items-center justify-between">
          <label class="text-sm text-foreground">Randomize seed every generation</label>
          <Switch v-model:checked="randomizeSeed" />
        </div>

        <!-- Advanced Section -->
        <div class="flex flex-col">
          <button
            class="flex items-center justify-between py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
            @click="advancedOpen = !advancedOpen"
          >
            <span>Advanced</span>
            <Icon :name="advancedOpen ? 'chevron-up' : 'chevron-down'" size="sm" />
          </button>

          <div v-show="advancedOpen" class="flex flex-col gap-5 pt-2">
            <!-- CFG -->
            <div class="flex flex-col gap-2">
              <label class="text-sm text-foreground">CFG</label>
              <div class="flex h-10 items-center rounded-md border border-border">
                <button
                  class="flex h-full w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                  @click="decrement(cfg, 0.1, 0)"
                >
                  <Icon name="minus" size="sm" />
                </button>
                <input
                  v-model.number="cfg"
                  type="number"
                  step="0.1"
                  class="h-full flex-1 bg-transparent text-center text-sm text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  class="flex h-full w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                  @click="increment(cfg, 0.1)"
                >
                  <Icon name="plus" size="sm" />
                </button>
              </div>
            </div>

            <!-- Sampler -->
            <div class="flex flex-col gap-2">
              <label class="text-sm text-foreground">Sampler</label>
              <Select v-model="sampler">
                <SelectTrigger class="h-10 border-border bg-transparent">
                  <SelectValue :placeholder="sampler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="s in samplers" :key="s" :value="s">
                    {{ s }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Scheduler -->
            <div class="flex flex-col gap-2">
              <label class="text-sm text-foreground">Scheduler</label>
              <Select v-model="scheduler">
                <SelectTrigger class="h-10 border-border bg-transparent">
                  <SelectValue :placeholder="scheduler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="s in schedulers" :key="s" :value="s">
                    {{ s }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t border-border p-4">
      <!-- Number of Generations -->
      <div class="mb-4 flex items-center justify-between">
        <label class="text-sm text-foreground">Number of generations</label>
        <div class="flex h-8 items-center gap-1">
          <button
            class="flex size-8 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
            @click="decrement(generations, 1, 1)"
          >
            <Icon name="minus" size="sm" />
          </button>
          <span class="w-8 text-center text-sm text-foreground">{{ generations }}</span>
          <button
            class="flex size-8 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
            @click="increment(generations)"
          >
            <Icon name="plus" size="sm" />
          </button>
        </div>
      </div>

      <!-- Run Button -->
      <button
        :disabled="!canRun || isRunning"
        :class="[
          'flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors',
          canRun && !isRunning
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'cursor-not-allowed bg-muted text-muted-foreground'
        ]"
        @click="runWorkflow"
      >
        <Icon v-if="isRunning" name="spinner" size="sm" class="animate-spin" />
        <Icon v-else name="play" size="sm" />
        {{ isRunning ? 'Running...' : 'Run' }}
      </button>
    </div>
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
  background: hsl(var(--border));
  border-radius: 2px;
}
</style>
