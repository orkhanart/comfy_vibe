<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@/components/ui/icon'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface ModelImportInfo {
  url: string
  source: 'civitai' | 'huggingface' | 'url'
  name: string
  type: 'checkpoint' | 'lora' | 'vae' | 'controlnet'
  baseModel: 'SD1.5' | 'SDXL' | 'Flux' | 'Pony' | 'unknown'
  thumbnail?: string
  estimatedSize?: string
}

export type ImportStage = 'confirm' | 'importing' | 'success'

interface Props {
  open: boolean
  modelInfo: ModelImportInfo | null
  stage?: ImportStage
}

const props = withDefaults(defineProps<Props>(), {
  stage: 'confirm'
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': [info: ModelImportInfo]
  'cancel': []
  'finish': []
}>()

// Internal stage for standalone usage
const internalStage = ref<ImportStage>('confirm')

// Use prop stage if provided, otherwise internal
const currentStage = computed(() => props.stage || internalStage.value)

// Editable fields
const selectedType = ref<ModelImportInfo['type']>('lora')

// Reset fields when modal opens with new model
watch(() => props.modelInfo, (info) => {
  if (info) {
    selectedType.value = info.type || 'lora'
    internalStage.value = 'confirm'
  }
}, { immediate: true })

// Reset stage when modal closes
watch(() => props.open, (open) => {
  if (!open) {
    internalStage.value = 'confirm'
  }
})

const sourceLabel = computed(() => {
  switch (props.modelInfo?.source) {
    case 'civitai':
      return 'Civitai'
    case 'huggingface':
      return 'Hugging Face'
    default:
      return 'URL'
  }
})

const typeLabel = computed(() => {
  switch (selectedType.value) {
    case 'checkpoint':
      return 'checkpoints'
    case 'lora':
      return 'loras'
    case 'vae':
      return 'VAEs'
    case 'controlnet':
      return 'controlnets'
    default:
      return 'models'
  }
})

function handleClose() {
  emit('update:open', false)
  emit('cancel')
}

function handleBack() {
  emit('update:open', false)
  emit('cancel')
}

function handleImport() {
  if (!props.modelInfo) return

  emit('confirm', {
    ...props.modelInfo,
    type: selectedType.value,
  })
}

function handleFinish() {
  emit('update:open', false)
  emit('finish')
}

const modelTypes = [
  { value: 'checkpoint', label: 'Checkpoint' },
  { value: 'lora', label: 'LoRA' },
  { value: 'vae', label: 'VAE' },
  { value: 'controlnet', label: 'ControlNet' },
]
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent
      class="w-[560px] max-w-[90vw] gap-0 overflow-hidden rounded-xl border border-charcoal-200 bg-charcoal-800 p-0 shadow-xl"
    >
      <!-- Header -->
      <div class="flex items-center gap-3 border-b border-charcoal-200 px-5 py-4">
        <!-- Civitai Icon -->
        <div class="flex h-6 w-6 items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4B7BF5"/>
            <path d="M2 17L12 22L22 17" stroke="#4B7BF5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#4B7BF5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 class="text-base font-medium text-white">Import a model from {{ sourceLabel }}</h2>
        <span class="rounded-full border border-charcoal-200 px-2 py-0.5 text-[10px] font-medium text-smoke-800">BETA</span>
        <button
          class="ml-auto flex h-6 w-6 items-center justify-center text-smoke-800 transition-colors hover:text-white"
          @click="handleClose"
        >
          <Icon name="x" size="sm" />
        </button>
      </div>

      <!-- Body -->
      <div class="min-h-[280px] px-5 py-6">
        <!-- Confirm Stage -->
        <template v-if="currentStage === 'confirm'">
          <p class="mb-2 text-sm text-smoke-800">The model associated with the link you provided:</p>
          <p class="mb-6 text-base font-medium text-white">{{ modelInfo?.name }}</p>

          <p class="mb-3 text-sm text-smoke-800">What type of model is this?</p>
          <Select v-model="selectedType">
            <SelectTrigger class="h-12 w-full rounded-lg border-0 bg-charcoal-600 px-4 text-base text-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="type in modelTypes"
                :key="type.value"
                :value="type.value"
                class="text-sm"
              >
                {{ type.label }}
              </SelectItem>
            </SelectContent>
          </Select>

          <div class="mt-3 flex items-center gap-2 text-sm text-smoke-800">
            <Icon name="help-circle" size="sm" class="shrink-0" />
            <span>Not sure? Just leave this as is</span>
          </div>
        </template>

        <!-- Importing Stage -->
        <template v-else-if="currentStage === 'importing'">
          <p class="mb-2 text-sm text-smoke-800">The model associated with the link you provided:</p>
          <p class="mb-6 text-base font-medium text-white">{{ modelInfo?.name }}</p>

          <p class="mb-3 text-sm text-smoke-800">What type of model is this?</p>
          <div class="flex h-12 w-full items-center rounded-lg bg-charcoal-600 px-4 text-base text-white">
            {{ modelTypes.find(t => t.value === selectedType)?.label || 'LoRA' }}
          </div>

          <div class="mt-3 flex items-center gap-2 text-sm text-smoke-800">
            <Icon name="help-circle" size="sm" class="shrink-0" />
            <span>Not sure? Just leave this as is</span>
          </div>
        </template>

        <!-- Success Stage -->
        <template v-else-if="currentStage === 'success'">
          <h3 class="mb-2 text-lg font-semibold text-white">Model imported! 🎉</h3>
          <p class="mb-5 text-sm text-smoke-800">Find it in the {{ typeLabel }} section of the models library.</p>

          <div class="rounded-lg border border-charcoal-200 bg-charcoal-600 p-4">
            <p class="text-base font-medium text-white">{{ modelInfo?.name }}</p>
            <p class="mt-1 text-sm text-smoke-800">{{ typeLabel }}</p>
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-5 py-4">
        <!-- Confirm Stage Footer -->
        <template v-if="currentStage === 'confirm'">
          <button
            class="px-4 py-2 text-sm text-smoke-800 transition-colors hover:text-white"
            @click="handleBack"
          >
            Back
          </button>
          <button
            class="flex h-10 items-center gap-2 rounded-lg bg-charcoal-600 px-5 text-sm font-medium text-white transition-colors hover:bg-charcoal-500"
            @click="handleImport"
          >
            Import
          </button>
        </template>

        <!-- Importing Stage Footer -->
        <template v-else-if="currentStage === 'importing'">
          <button
            class="px-4 py-2 text-sm text-smoke-800/50"
            disabled
          >
            Back
          </button>
          <button
            class="flex h-10 items-center gap-2 rounded-lg bg-charcoal-600 px-5 text-sm font-medium text-smoke-800/50"
            disabled
          >
            <Icon name="loader-2" size="sm" class="animate-spin" />
            Import
          </button>
        </template>

        <!-- Success Stage Footer -->
        <template v-else-if="currentStage === 'success'">
          <button
            class="flex h-10 items-center gap-2 rounded-lg bg-charcoal-600 px-5 text-sm font-medium text-white transition-colors hover:bg-charcoal-500"
            @click="handleFinish"
          >
            Finish
          </button>
        </template>
      </div>
    </DialogContent>
  </Dialog>
</template>
