<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import CollapsibleSection from '@/components/common/CollapsibleSection.vue'
import Select from 'primevue/select'
import Slider from 'primevue/slider'
import Textarea from 'primevue/textarea'

const workspaceStore = useWorkspaceStore()

// Form state
const prompt = ref('')
const negativePrompt = ref('')
const seed = ref(-1)
const steps = ref(20)
const cfgScale = ref(7)
const aspectRatio = ref('1:1')
const batchSize = ref(1)

const aspectOptions = [
  { label: '1:1 Square', value: '1:1' },
  { label: '16:9 Landscape', value: '16:9' },
  { label: '9:16 Portrait', value: '9:16' },
  { label: '4:3 Standard', value: '4:3' },
  { label: '3:4 Portrait', value: '3:4' },
  { label: '21:9 Ultrawide', value: '21:9' },
]

const workflowOptions = computed(() =>
  workspaceStore.availableWorkflows.map(w => ({
    label: w.name,
    value: w.id,
    description: w.description,
  }))
)

const selectedWorkflowId = computed({
  get: () => workspaceStore.currentWorkflow?.id ?? '',
  set: (id: string) => workspaceStore.setCurrentWorkflowById(id)
})

function randomizeSeed(): void {
  seed.value = Math.floor(Math.random() * 2147483647)
}

function handleRun(): void {
  console.log('Run workflow:', {
    workflow: workspaceStore.currentWorkflow?.id,
    prompt: prompt.value,
    negativePrompt: negativePrompt.value,
    seed: seed.value,
    steps: steps.value,
    cfgScale: cfgScale.value,
    aspectRatio: aspectRatio.value,
    batchSize: batchSize.value,
  })
}
</script>

<template>
  <div class="flex h-full w-80 flex-col border-r border-zinc-800 bg-zinc-950">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
      <span class="text-sm font-medium text-zinc-200">Run Workflow</span>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Workflow Section -->
      <CollapsibleSection title="Workflow" icon="pi-sitemap" :default-open="true">
        <Select
          v-model="selectedWorkflowId"
          :options="workflowOptions"
          option-label="label"
          option-value="value"
          placeholder="Select workflow"
          class="w-full"
        >
          <template #option="{ option }">
            <div class="flex flex-col gap-0.5">
              <span class="text-sm">{{ option.label }}</span>
              <span v-if="option.description" class="text-xs text-zinc-500">{{ option.description }}</span>
            </div>
          </template>
        </Select>

        <!-- Workflow info -->
        <div v-if="workspaceStore.currentWorkflow" class="mt-2 rounded-md bg-zinc-900 p-2">
          <p class="text-xs text-zinc-400">{{ workspaceStore.currentWorkflow.description }}</p>
        </div>
      </CollapsibleSection>

      <!-- Inputs Section -->
      <CollapsibleSection title="Inputs" icon="pi-pencil" :default-open="true">
        <div class="space-y-3">
          <!-- Prompt -->
          <div>
            <label class="mb-1 block text-xs text-zinc-400">Prompt</label>
            <Textarea
              v-model="prompt"
              placeholder="Describe what you want to generate..."
              :auto-resize="true"
              rows="3"
              class="w-full"
            />
          </div>

          <!-- Negative Prompt -->
          <div>
            <label class="mb-1 block text-xs text-zinc-400">Negative Prompt</label>
            <Textarea
              v-model="negativePrompt"
              placeholder="What to avoid..."
              :auto-resize="true"
              rows="2"
              class="w-full"
            />
          </div>

          <!-- Aspect Ratio -->
          <div>
            <label class="mb-1 block text-xs text-zinc-400">Aspect Ratio</label>
            <Select
              v-model="aspectRatio"
              :options="aspectOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </div>
        </div>
      </CollapsibleSection>

      <!-- Settings Section -->
      <CollapsibleSection title="Settings" icon="pi-cog" :default-open="false">
        <div class="space-y-4">
          <!-- Seed -->
          <div>
            <div class="mb-1 flex items-center justify-between">
              <label class="text-xs text-zinc-400">Seed</label>
              <button
                class="text-xs text-blue-400 hover:text-blue-300"
                @click="randomizeSeed"
              >
                Randomize
              </button>
            </div>
            <div class="flex gap-2">
              <input
                v-model.number="seed"
                type="number"
                class="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <p class="mt-1 text-[10px] text-zinc-500">-1 for random seed each generation</p>
          </div>

          <!-- Steps -->
          <div>
            <div class="mb-1 flex items-center justify-between">
              <label class="text-xs text-zinc-400">Steps</label>
              <span class="text-xs text-zinc-500">{{ steps }}</span>
            </div>
            <Slider v-model="steps" :min="1" :max="50" class="w-full" />
          </div>

          <!-- CFG Scale -->
          <div>
            <div class="mb-1 flex items-center justify-between">
              <label class="text-xs text-zinc-400">CFG Scale</label>
              <span class="text-xs text-zinc-500">{{ cfgScale }}</span>
            </div>
            <Slider v-model="cfgScale" :min="1" :max="20" :step="0.5" class="w-full" />
          </div>

          <!-- Batch Size -->
          <div>
            <div class="mb-1 flex items-center justify-between">
              <label class="text-xs text-zinc-400">Batch Size</label>
              <span class="text-xs text-zinc-500">{{ batchSize }}</span>
            </div>
            <Slider v-model="batchSize" :min="1" :max="8" class="w-full" />
          </div>
        </div>
      </CollapsibleSection>
    </div>

    <!-- Run Button -->
    <div class="border-t border-zinc-800 p-3">
      <button
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        @click="handleRun"
      >
        <i class="pi pi-play text-xs" />
        Run
      </button>
    </div>
  </div>
</template>
