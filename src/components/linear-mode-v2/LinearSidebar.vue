<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { SidebarSearchBox } from '@/components/common/sidebar'
import SidebarWorkflowsTab from '@/components/sidebar/SidebarWorkflowsTab.vue'
import SidebarAssetsTab from '@/components/sidebar/SidebarAssetsTab.vue'
import SidebarTemplatesTab from '@/components/sidebar/SidebarTemplatesTab.vue'

type LinearSidebarTab = 'run' | 'assets' | 'workflows' | 'templates' | null

interface TabConfig {
  id: Exclude<LinearSidebarTab, null>
  label: string
  icon: string
  tooltip: string
  isPrimary?: boolean
}

const LINEAR_SIDEBAR_TABS: TabConfig[] = [
  { id: 'run', label: 'Run', icon: 'play', tooltip: 'Run Workflow', isPrimary: true },
  { id: 'assets', label: 'Assets', icon: 'images', tooltip: 'Assets' },
  { id: 'workflows', label: 'Workflows', icon: 'workflow', tooltip: 'Workflows' },
  { id: 'templates', label: 'Templates', icon: 'th-large', tooltip: 'Templates' },
]

const activeTab = ref<LinearSidebarTab>('run')
const searchQuery = ref('')
const viewMode = ref<'list' | 'grid'>('list')

const panelExpanded = computed(() => activeTab.value !== null)

// Sidebar resize
const sidebarWidth = ref(350)
const isResizing = ref(false)
const MIN_WIDTH = 350
const MAX_WIDTH = 480

function toggleTab(tabId: Exclude<LinearSidebarTab, null>): void {
  if (activeTab.value === tabId) {
    activeTab.value = null
  } else {
    activeTab.value = tabId
    // Set default view mode per tab
    viewMode.value = tabId === 'templates' ? 'grid' : 'list'
  }
}

function closePanel(): void {
  activeTab.value = null
}

function startResize(e: MouseEvent) {
  isResizing.value = true
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'ew-resize'
  document.body.style.userSelect = 'none'
}

function onResize(e: MouseEvent) {
  if (!isResizing.value) return
  // Account for icon bar width (48px)
  const newWidth = e.clientX - 48
  sidebarWidth.value = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth))
}

function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

// Sort/filter state
const sortBy = ref('name')
const showSortMenu = ref(false)

const sortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Date Added', value: 'date' },
]

function setSort(value: string): void {
  sortBy.value = value
  showSortMenu.value = false
}

// ============ RUN PANEL STATE ============
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

const uploadedImage = ref<string | null>(null)
const prompt = ref('beautiful scenery nature glass bottle landscape, purple galaxy bottle,')
const negativePrompt = ref('blurry, bad quality, worst quality, low resolution')
const steps = ref(20)
const seed = ref(1809000312992)
const randomizeSeed = ref(true)
const cfg = ref(7.0)
const sampler = ref('euler')
const scheduler = ref('normal')
const generations = ref(1)

// Image dimensions
const width = ref(1024)
const height = ref(1024)
const aspectRatioLocked = ref(true)

// Advanced parameters
const denoise = ref(1.0)
const clipSkip = ref(1)
const model = ref('sd_xl_base_1.0.safetensors')
const vae = ref('Automatic')
const hiresEnabled = ref(false)
const hiresDenoise = ref(0.5)
const hiresUpscale = ref(1.5)
const hiresSteps = ref(10)

const advancedOpen = ref(false)
const isRunning = ref(false)
const isDragging = ref(false)

const samplers = ['euler', 'euler_ancestral', 'heun', 'heunpp2', 'dpm_2', 'dpm_2_ancestral', 'lms', 'dpm_fast', 'dpm_adaptive', 'dpmpp_2s_ancestral', 'dpmpp_sde', 'dpmpp_sde_gpu', 'dpmpp_2m', 'dpmpp_2m_sde', 'dpmpp_2m_sde_gpu', 'dpmpp_3m_sde', 'dpmpp_3m_sde_gpu', 'ddpm', 'lcm', 'ddim', 'uni_pc', 'uni_pc_bh2']
const schedulers = ['normal', 'karras', 'exponential', 'sgm_uniform', 'simple', 'ddim_uniform', 'beta']
const models = [
  'sd_xl_base_1.0.safetensors',
  'sd_xl_refiner_1.0.safetensors',
  'v1-5-pruned-emaonly.safetensors',
  'v2-1_768-ema-pruned.safetensors',
  'dreamshaper_8.safetensors',
  'realisticVisionV51.safetensors',
  'juggernautXL_v9.safetensors',
  'flux1-dev.safetensors',
]
const vaes = ['Automatic', 'sdxl_vae.safetensors', 'vae-ft-mse-840000.safetensors', 'kl-f8-anime2.safetensors']
const aspectRatios = [
  { label: '1:1', width: 1024, height: 1024 },
  { label: '16:9', width: 1344, height: 768 },
  { label: '9:16', width: 768, height: 1344 },
  { label: '4:3', width: 1152, height: 896 },
  { label: '3:4', width: 896, height: 1152 },
  { label: '3:2', width: 1216, height: 832 },
  { label: '2:3', width: 832, height: 1216 },
]

function setAspectRatio(ratio: typeof aspectRatios[0]) {
  width.value = ratio.width
  height.value = ratio.height
}

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

  await new Promise(resolve => setTimeout(resolve, 2000))
  isRunning.value = false
}

// Check if current tab needs search controls
const showSearchControls = computed(() => activeTab.value !== 'run' && activeTab.value !== null)
</script>

<template>
  <div class="flex h-full">
    <!-- Icon Bar -->
    <nav class="flex w-12 flex-col items-center border-r border-border bg-background py-2">
      <!-- Run button (primary) -->
      <button
        v-tooltip.right="{ value: 'Run Workflow', showDelay: 50 }"
        class="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
        :class="[
          activeTab === 'run'
            ? 'bg-primary text-primary-foreground'
            : 'text-primary hover:bg-primary/10'
        ]"
        @click="toggleTab('run')"
      >
        <Icon name="play" size="sm" />
      </button>

      <!-- Divider -->
      <div class="my-2 h-px w-6 bg-border" />

      <!-- Other tab buttons -->
      <div class="flex flex-col gap-1">
        <button
          v-for="tab in LINEAR_SIDEBAR_TABS.filter(t => t.id !== 'run')"
          :key="tab.id"
          v-tooltip.right="{ value: tab.tooltip, showDelay: 50 }"
          class="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          :class="[
            activeTab === tab.id
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          ]"
          @click="toggleTab(tab.id)"
        >
          <Icon :name="tab.icon" size="sm" />
        </button>
      </div>
    </nav>

    <!-- Panel -->
    <aside
      class="relative border-r border-border bg-card/95 transition-all duration-200"
      :style="panelExpanded ? { width: `${sidebarWidth}px` } : { width: '0px' }"
      :class="{ 'overflow-hidden': !panelExpanded }"
    >
      <div v-if="panelExpanded" class="flex h-full flex-col" :style="{ width: `${sidebarWidth}px` }">
        <!-- Panel Header -->
        <div class="flex h-10 items-center justify-between border-b border-border px-4">
          <span class="text-sm font-medium text-foreground">
            {{ LINEAR_SIDEBAR_TABS.find(t => t.id === activeTab)?.label }}
          </span>
          <div class="flex items-center gap-0.5">
            <Button
              v-tooltip.bottom="{ value: 'Close panel', showDelay: 50 }"
              variant="ghost"
              size="icon"
              class="h-6 w-6"
              @click="closePanel"
            >
              <X class="size-3" />
            </Button>
          </div>
        </div>

        <!-- Search & Controls (only for non-run tabs) -->
        <div v-if="showSearchControls" class="border-b border-border p-2">
          <div class="flex items-center gap-1.5">
            <SidebarSearchBox
              v-model="searchQuery"
              :placeholder="`Search ${LINEAR_SIDEBAR_TABS.find(t => t.id === activeTab)?.label?.toLowerCase()}...`"
              class="flex-1"
            />

            <!-- Sort Dropdown -->
            <div class="relative">
              <button
                v-tooltip.bottom="{ value: 'Sort items', showDelay: 50 }"
                class="flex h-7 w-7 items-center justify-center rounded bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                @click="showSortMenu = !showSortMenu"
              >
                <Icon name="arrow-up-down" size="sm" />
              </button>
              <div
                v-if="showSortMenu"
                class="absolute right-0 top-full z-50 mt-1 min-w-[120px] rounded-lg border border-border bg-popover py-1 shadow-xl"
              >
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  class="flex w-full items-center px-3 py-1.5 text-left text-xs transition-colors"
                  :class="sortBy === option.value ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'"
                  @click="setSort(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <!-- View Toggle -->
            <button
              v-tooltip.bottom="{ value: viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view', showDelay: 50 }"
              class="flex h-7 w-7 items-center justify-center rounded bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'"
            >
              <Icon :name="viewMode === 'grid' ? 'list' : 'th-large'" size="sm" />
            </button>
          </div>
        </div>

        <!-- Panel Content -->
        <div class="flex-1 overflow-hidden">
          <!-- RUN TAB -->
          <div v-if="activeTab === 'run'" class="flex h-full flex-col">
            <!-- Scrollable Content -->
            <div class="run-panel-scroll flex-1 overflow-y-auto">
              <div class="flex flex-col gap-5 p-3">
                <!-- Image Upload -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Image input</label>
                  <div
                    v-if="!uploadedImage"
                    class="group relative flex h-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed transition-all duration-200"
                    :class="isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground hover:bg-muted/30'"
                    @dragover="handleDragOver"
                    @dragleave="handleDragLeave"
                    @drop="handleDrop"
                    @click="($refs.fileInput as HTMLInputElement)?.click()"
                  >
                    <Icon name="image" size="md" class="text-muted-foreground/50 transition-colors group-hover:text-muted-foreground" />
                    <span class="text-[11px] text-muted-foreground">Drop image or click to browse</span>
                    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
                  </div>
                  <div v-else class="group relative overflow-hidden rounded-lg">
                    <img :src="uploadedImage" alt="Uploaded" class="h-20 w-full object-cover" />
                    <div class="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                      <button
                        class="flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-lg transition-all hover:bg-background group-hover:opacity-100"
                        @click="removeImage"
                      >
                        <Icon name="times" size="sm" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Model Selection -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Model</label>
                  <Select v-model="model">
                    <SelectTrigger class="h-8 border-border bg-muted/30 text-[12px] transition-colors hover:border-muted-foreground focus:border-primary focus:bg-transparent">
                      <SelectValue :placeholder="model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="m in models" :key="m" :value="m" class="text-[12px]">
                        {{ m.replace('.safetensors', '') }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Prompt -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Prompt</label>
                  <Textarea
                    v-model="prompt"
                    placeholder="Describe what you want to create..."
                    class="min-h-[80px] resize-none rounded-lg border-border bg-muted/30 text-[13px] leading-relaxed transition-colors focus:bg-transparent"
                  />
                </div>

                <!-- Negative Prompt -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Negative Prompt</label>
                  <Textarea
                    v-model="negativePrompt"
                    placeholder="What to avoid..."
                    class="min-h-[56px] resize-none rounded-lg border-border bg-muted/30 text-[12px] leading-relaxed text-muted-foreground transition-colors focus:bg-transparent focus:text-foreground"
                  />
                </div>

                <!-- Dimensions -->
                <div class="flex flex-col gap-2">
                  <label class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Dimensions</label>

                  <!-- Aspect Ratio Presets -->
                  <div class="flex flex-wrap gap-1">
                    <button
                      v-for="ratio in aspectRatios"
                      :key="ratio.label"
                      class="rounded px-2 py-1 text-[10px] transition-colors"
                      :class="width === ratio.width && height === ratio.height
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'"
                      @click="setAspectRatio(ratio)"
                    >
                      {{ ratio.label }}
                    </button>
                  </div>

                  <!-- Width & Height -->
                  <div class="grid grid-cols-2 gap-2">
                    <div class="flex flex-col gap-1">
                      <span class="text-[10px] text-muted-foreground">Width</span>
                      <div class="num-input group flex h-8 items-center rounded-md border border-border bg-muted/30 transition-colors hover:border-muted-foreground focus-within:border-primary focus-within:bg-transparent">
                        <button
                          class="flex h-full w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          @click="decrement(width, 64, 64)"
                        >
                          <Icon name="minus" size="xs" />
                        </button>
                        <input
                          v-model.number="width"
                          type="number"
                          step="64"
                          class="h-full w-full min-w-0 flex-1 bg-transparent text-center text-[13px] text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          class="flex h-full w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          @click="increment(width, 64, 2048)"
                        >
                          <Icon name="plus" size="xs" />
                        </button>
                      </div>
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="text-[10px] text-muted-foreground">Height</span>
                      <div class="num-input group flex h-8 items-center rounded-md border border-border bg-muted/30 transition-colors hover:border-muted-foreground focus-within:border-primary focus-within:bg-transparent">
                        <button
                          class="flex h-full w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          @click="decrement(height, 64, 64)"
                        >
                          <Icon name="minus" size="xs" />
                        </button>
                        <input
                          v-model.number="height"
                          type="number"
                          step="64"
                          class="h-full w-full min-w-0 flex-1 bg-transparent text-center text-[13px] text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          class="flex h-full w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          @click="increment(height, 64, 2048)"
                        >
                          <Icon name="plus" size="xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Settings Section -->
                <div class="flex flex-col gap-3">
                  <label class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Sampling</label>

                  <!-- Steps & CFG Row -->
                  <div class="grid grid-cols-2 gap-2">
                    <!-- Steps -->
                    <div class="flex flex-col gap-1">
                      <span class="text-[10px] text-muted-foreground">Steps</span>
                      <div class="num-input group flex h-8 items-center rounded-md border border-border bg-muted/30 transition-colors hover:border-muted-foreground focus-within:border-primary focus-within:bg-transparent">
                        <button
                          class="flex h-full w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          @click="decrement(steps, 1, 1)"
                        >
                          <Icon name="minus" size="xs" />
                        </button>
                        <input
                          v-model.number="steps"
                          type="number"
                          class="h-full w-full min-w-0 flex-1 bg-transparent text-center text-[13px] text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          class="flex h-full w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          @click="increment(steps)"
                        >
                          <Icon name="plus" size="xs" />
                        </button>
                      </div>
                    </div>

                    <!-- CFG -->
                    <div class="flex flex-col gap-1">
                      <span class="text-[10px] text-muted-foreground">CFG</span>
                      <div class="num-input group flex h-8 items-center rounded-md border border-border bg-muted/30 transition-colors hover:border-muted-foreground focus-within:border-primary focus-within:bg-transparent">
                        <button
                          class="flex h-full w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          @click="decrement(cfg, 0.5, 0)"
                        >
                          <Icon name="minus" size="xs" />
                        </button>
                        <input
                          v-model.number="cfg"
                          type="number"
                          step="0.5"
                          class="h-full w-full min-w-0 flex-1 bg-transparent text-center text-[13px] text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          class="flex h-full w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          @click="increment(cfg, 0.5)"
                        >
                          <Icon name="plus" size="xs" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Seed -->
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] text-muted-foreground">Seed</span>
                      <label class="flex cursor-pointer items-center gap-1.5">
                        <span class="text-[10px] text-muted-foreground">Random</span>
                        <Switch v-model:checked="randomizeSeed" class="scale-75" />
                      </label>
                    </div>
                    <div class="num-input group flex h-8 items-center rounded-md border border-border bg-muted/30 transition-colors hover:border-muted-foreground focus-within:border-primary focus-within:bg-transparent" :class="{ 'opacity-50': randomizeSeed }">
                      <input
                        v-model.number="seed"
                        type="number"
                        :disabled="randomizeSeed"
                        class="h-full w-full min-w-0 flex-1 bg-transparent px-3 text-center font-mono text-[12px] text-foreground outline-none disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        v-tooltip.top="'New random seed'"
                        class="flex h-full w-8 items-center justify-center border-l border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed"
                        :disabled="randomizeSeed"
                        @click="generateRandomSeed"
                      >
                        <Icon name="refresh" size="xs" />
                      </button>
                    </div>
                  </div>

                  <!-- Batch Size -->
                  <div class="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2">
                    <span class="text-[11px] text-muted-foreground">Batch size</span>
                    <div class="flex items-center gap-0.5">
                      <button
                        class="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        @click="decrement(generations, 1, 1)"
                      >
                        <Icon name="minus" size="xs" />
                      </button>
                      <span class="w-8 text-center text-[13px] font-medium text-foreground">{{ generations }}</span>
                      <button
                        class="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        @click="increment(generations)"
                      >
                        <Icon name="plus" size="xs" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Advanced Section -->
                <div class="flex flex-col">
                  <button
                    class="-mx-3 flex items-center justify-between border-t border-border px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted/30"
                    @click="advancedOpen = !advancedOpen"
                  >
                    <span>Advanced</span>
                    <Icon :name="advancedOpen ? 'chevron-up' : 'chevron-down'" size="sm" class="transition-transform" :class="{ 'rotate-180': !advancedOpen }" />
                  </button>

                  <div v-show="advancedOpen" class="flex flex-col gap-3 pt-3">
                    <!-- Sampler -->
                    <div class="flex flex-col gap-1">
                      <span class="text-[10px] text-muted-foreground">Sampler</span>
                      <Select v-model="sampler">
                        <SelectTrigger class="h-8 border-border bg-muted/30 text-[12px] transition-colors hover:border-muted-foreground focus:border-primary focus:bg-transparent">
                          <SelectValue :placeholder="sampler" />
                        </SelectTrigger>
                        <SelectContent class="max-h-[280px]">
                          <SelectItem v-for="s in samplers" :key="s" :value="s" class="text-[12px]">
                            {{ s }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <!-- Scheduler -->
                    <div class="flex flex-col gap-1">
                      <span class="text-[10px] text-muted-foreground">Scheduler</span>
                      <Select v-model="scheduler">
                        <SelectTrigger class="h-8 border-border bg-muted/30 text-[12px] transition-colors hover:border-muted-foreground focus:border-primary focus:bg-transparent">
                          <SelectValue :placeholder="scheduler" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-for="s in schedulers" :key="s" :value="s" class="text-[12px]">
                            {{ s }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <!-- Denoise & Clip Skip -->
                    <div class="grid grid-cols-2 gap-2">
                      <!-- Denoise -->
                      <div class="flex flex-col gap-1">
                        <span class="text-[10px] text-muted-foreground">Denoise</span>
                        <div class="num-input group flex h-8 items-center rounded-md border border-border bg-muted/30 transition-colors hover:border-muted-foreground focus-within:border-primary focus-within:bg-transparent">
                          <button
                            class="flex h-full w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            @click="decrement(denoise, 0.05, 0)"
                          >
                            <Icon name="minus" size="xs" />
                          </button>
                          <input
                            v-model.number="denoise"
                            type="number"
                            step="0.05"
                            min="0"
                            max="1"
                            class="h-full w-full min-w-0 flex-1 bg-transparent text-center text-[13px] text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            class="flex h-full w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            @click="increment(denoise, 0.05, 1)"
                          >
                            <Icon name="plus" size="xs" />
                          </button>
                        </div>
                      </div>

                      <!-- Clip Skip -->
                      <div class="flex flex-col gap-1">
                        <span class="text-[10px] text-muted-foreground">Clip Skip</span>
                        <div class="num-input group flex h-8 items-center rounded-md border border-border bg-muted/30 transition-colors hover:border-muted-foreground focus-within:border-primary focus-within:bg-transparent">
                          <button
                            class="flex h-full w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            @click="decrement(clipSkip, 1, 1)"
                          >
                            <Icon name="minus" size="xs" />
                          </button>
                          <input
                            v-model.number="clipSkip"
                            type="number"
                            min="1"
                            max="12"
                            class="h-full w-full min-w-0 flex-1 bg-transparent text-center text-[13px] text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            class="flex h-full w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            @click="increment(clipSkip, 1, 12)"
                          >
                            <Icon name="plus" size="xs" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- VAE -->
                    <div class="flex flex-col gap-1">
                      <span class="text-[10px] text-muted-foreground">VAE</span>
                      <Select v-model="vae">
                        <SelectTrigger class="h-8 border-border bg-muted/30 text-[12px] transition-colors hover:border-muted-foreground focus:border-primary focus:bg-transparent">
                          <SelectValue :placeholder="vae" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-for="v in vaes" :key="v" :value="v" class="text-[12px]">
                            {{ v.replace('.safetensors', '') }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <!-- Hires Fix -->
                    <div class="flex flex-col gap-2 rounded-lg border border-border bg-muted/20 p-2.5">
                      <div class="flex items-center justify-between">
                        <span class="text-[11px] font-medium text-muted-foreground">Hires Fix</span>
                        <Switch v-model:checked="hiresEnabled" class="scale-75" />
                      </div>

                      <div v-if="hiresEnabled" class="flex flex-col gap-2 pt-1">
                        <!-- Upscale & Denoise -->
                        <div class="grid grid-cols-2 gap-2">
                          <div class="flex flex-col gap-1">
                            <span class="text-[10px] text-muted-foreground">Upscale</span>
                            <div class="num-input group flex h-7 items-center rounded border border-border bg-muted/30 transition-colors hover:border-muted-foreground focus-within:border-primary focus-within:bg-transparent">
                              <input
                                v-model.number="hiresUpscale"
                                type="number"
                                step="0.1"
                                min="1"
                                max="4"
                                class="h-full w-full min-w-0 flex-1 bg-transparent text-center text-[12px] text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            </div>
                          </div>
                          <div class="flex flex-col gap-1">
                            <span class="text-[10px] text-muted-foreground">Denoise</span>
                            <div class="num-input group flex h-7 items-center rounded border border-border bg-muted/30 transition-colors hover:border-muted-foreground focus-within:border-primary focus-within:bg-transparent">
                              <input
                                v-model.number="hiresDenoise"
                                type="number"
                                step="0.05"
                                min="0"
                                max="1"
                                class="h-full w-full min-w-0 flex-1 bg-transparent text-center text-[12px] text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            </div>
                          </div>
                        </div>
                        <!-- Hires Steps -->
                        <div class="flex flex-col gap-1">
                          <span class="text-[10px] text-muted-foreground">Steps</span>
                          <div class="num-input group flex h-7 items-center rounded border border-border bg-muted/30 transition-colors hover:border-muted-foreground focus-within:border-primary focus-within:bg-transparent">
                            <button
                              class="flex h-full w-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                              @click="decrement(hiresSteps, 1, 1)"
                            >
                              <Icon name="minus" size="xs" />
                            </button>
                            <input
                              v-model.number="hiresSteps"
                              type="number"
                              min="1"
                              class="h-full w-full min-w-0 flex-1 bg-transparent text-center text-[12px] text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              class="flex h-full w-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                              @click="increment(hiresSteps, 1)"
                            >
                              <Icon name="plus" size="xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Run Button (sticky footer) -->
            <div class="border-t border-border bg-background/80 p-3 backdrop-blur-sm">
              <button
                :disabled="!canRun || isRunning"
                :class="[
                  'flex h-9 w-full items-center justify-center gap-2 rounded-lg text-[13px] font-medium shadow-sm transition-all duration-200',
                  canRun && !isRunning
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md active:scale-[0.98]'
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

          <!-- OTHER TABS -->
          <SidebarAssetsTab v-else-if="activeTab === 'assets'" :view-mode="viewMode" />
          <SidebarWorkflowsTab v-else-if="activeTab === 'workflows'" :view-mode="viewMode" />
          <SidebarTemplatesTab v-else-if="activeTab === 'templates'" :view-mode="viewMode" />
        </div>
      </div>

      <!-- Resize Handle -->
      <div
        v-if="panelExpanded"
        class="absolute right-0 top-0 z-10 h-full w-1 cursor-ew-resize transition-colors hover:bg-primary/50"
        :class="{ 'bg-primary/50': isResizing }"
        @mousedown="startResize"
      />
    </aside>
  </div>
</template>

<style scoped>
.run-panel-scroll {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}

.run-panel-scroll::-webkit-scrollbar {
  width: 4px;
}

.run-panel-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.run-panel-scroll::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 2px;
}

.run-panel-scroll::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.3);
}

/* Number input focus ring */
.num-input:focus-within {
  box-shadow: 0 0 0 2px hsl(var(--primary) / 0.1);
}
</style>
