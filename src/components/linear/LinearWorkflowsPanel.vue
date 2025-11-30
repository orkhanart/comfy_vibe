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
  <div class="workflow-panel">
    <!-- Header -->
    <div class="panel-header">
      <span class="panel-title">Run Workflow</span>
    </div>

    <!-- Scrollable Content -->
    <div class="panel-content">
      <!-- Workflow Section -->
      <CollapsibleSection title="Workflow" icon="pi-sitemap" :default-open="true">
        <div class="workflow-select-row">
          <Select
            v-model="selectedWorkflowId"
            :options="workflowOptions"
            option-label="label"
            option-value="value"
            placeholder="Select workflow"
            class="flex-1"
          >
            <template #option="{ option }">
              <div class="select-option">
                <span class="select-option-label">{{ option.label }}</span>
                <span v-if="option.description" class="select-option-desc">{{ option.description }}</span>
              </div>
            </template>
          </Select>
          <button
            v-tooltip.top="'Import Workflow'"
            class="import-button"
          >
            <i class="pi pi-download" />
          </button>
        </div>
      </CollapsibleSection>

      <!-- Inputs Section -->
      <CollapsibleSection title="Inputs" icon="pi-pencil" :default-open="true">
        <div class="form-fields">
          <!-- Prompt -->
          <div class="form-field">
            <label class="field-label">Prompt</label>
            <Textarea
              v-model="prompt"
              placeholder="Describe what you want to generate..."
              :auto-resize="true"
              rows="3"
              class="w-full"
            />
          </div>

          <!-- Negative Prompt -->
          <div class="form-field">
            <label class="field-label">Negative Prompt</label>
            <Textarea
              v-model="negativePrompt"
              placeholder="What to avoid..."
              :auto-resize="true"
              rows="2"
              class="w-full"
            />
          </div>

          <!-- Aspect Ratio -->
          <div class="form-field">
            <label class="field-label">Aspect Ratio</label>
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
        <div class="form-fields-lg">
          <!-- Seed -->
          <div class="form-field">
            <div class="field-header">
              <label class="field-label">Seed</label>
              <button class="field-action" @click="randomizeSeed">
                Randomize
              </button>
            </div>
            <input
              v-model.number="seed"
              type="number"
              class="seed-input"
            />
            <p class="field-hint">-1 for random seed each generation</p>
          </div>

          <!-- Steps -->
          <div class="form-field">
            <div class="field-header">
              <label class="field-label">Steps</label>
              <span class="field-value">{{ steps }}</span>
            </div>
            <div class="slider-wrapper">
              <Slider v-model="steps" :min="1" :max="50" class="w-full" />
            </div>
          </div>

          <!-- CFG Scale -->
          <div class="form-field">
            <div class="field-header">
              <label class="field-label">CFG Scale</label>
              <span class="field-value">{{ cfgScale }}</span>
            </div>
            <div class="slider-wrapper">
              <Slider v-model="cfgScale" :min="1" :max="20" :step="0.5" class="w-full" />
            </div>
          </div>

          <!-- Batch Size -->
          <div class="form-field">
            <div class="field-header">
              <label class="field-label">Batch Size</label>
              <span class="field-value">{{ batchSize }}</span>
            </div>
            <div class="slider-wrapper">
              <Slider v-model="batchSize" :min="1" :max="8" class="w-full" />
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>

    <!-- Run Button -->
    <div class="panel-footer">
      <button class="run-button" @click="handleRun">
        <i class="pi pi-play" />
        Run
      </button>
    </div>
  </div>
</template>

<style scoped>
.workflow-panel {
  display: flex;
  flex-direction: column;
  width: 24rem;
  height: 100%;
  border-right: 1px solid #27272a;
  background-color: #09090b;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid #27272a;
}

.panel-title {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #e4e4e7;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
}

.panel-footer {
  padding: 0.75rem;
  border-top: 1px solid #27272a;
}

/* Workflow select row */
.workflow-select-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.import-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: #18181b;
  border: 1px solid #3f3f46;
  border-radius: 0.375rem;
  color: #71717a;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.import-button:hover {
  background-color: #27272a;
  border-color: #52525b;
  color: #a1a1aa;
}

.import-button i {
  font-size: 0.875rem;
}

/* Match Select height */
.workflow-select-row :deep(.p-select) {
  height: 2.5rem;
}

/* Select option styling */
.select-option {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.select-option-label {
  font-size: 0.8125rem;
  color: #fafafa;
}

.select-option-desc {
  font-size: 0.6875rem;
  color: #71717a;
}

/* Form fields */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-fields-lg {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #a1a1aa;
}

.field-value {
  font-size: 0.75rem;
  font-weight: 500;
  color: #71717a;
  font-family: 'JetBrains Mono', monospace;
}

.field-action {
  font-size: 0.6875rem;
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.field-action:hover {
  color: #60a5fa;
}

.field-hint {
  font-size: 0.625rem;
  color: #52525b;
  margin: 0;
}

/* Slider wrapper for proper spacing */
.slider-wrapper {
  padding: 0.5rem 0;
}

.slider-wrapper :deep(.p-slider) {
  height: 6px;
}

.slider-wrapper :deep(.p-slider-handle) {
  width: 16px;
  height: 16px;
  margin-top: -5px;
}

/* Seed input */
.seed-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  font-family: 'JetBrains Mono', monospace;
  color: #fafafa;
  background-color: #18181b;
  border: 1px solid #3f3f46;
  border-radius: 0.375rem;
  outline: none;
  transition: border-color 0.15s ease;
}

.seed-input:hover {
  border-color: #52525b;
}

.seed-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* Run button */
.run-button {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #ffffff;
  background-color: #3b82f6;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.run-button:hover {
  background-color: #2563eb;
}

.run-button i {
  font-size: 0.625rem;
}
</style>
