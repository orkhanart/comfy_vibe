<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useQueueStore } from '@/stores/queueStore'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'import': [modelUrl: string]
}>()

const queueStore = useQueueStore()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const modelUrl = ref('')
const modelName = ref('')
const isImporting = ref(false)

const isValidUrl = computed(() => {
  if (!modelUrl.value) return false

  try {
    const url = new URL(modelUrl.value)
    return url.hostname.includes('civitai.com') || url.hostname.includes('huggingface.co')
  } catch {
    return false
  }
})

// Auto-detect source from URL
const detectedSource = computed(() => {
  if (!modelUrl.value) return null
  try {
    const url = new URL(modelUrl.value)
    if (url.hostname.includes('civitai.com')) return 'civitai'
    if (url.hostname.includes('huggingface.co')) return 'huggingface'
    return 'url'
  } catch {
    return null
  }
})

function handleImport() {
  if (!isValidUrl.value || isImporting.value) return

  isImporting.value = true

  // Parse model info and add to download queue
  const { source, modelName: parsedName } = queueStore.parseModelUrl(modelUrl.value)
  const finalName = modelName.value.trim() || parsedName

  queueStore.addDownloadJob(
    modelUrl.value,
    finalName,
    source,
    'checkpoint' // Default model type
  )

  // Emit for any parent handling
  emit('import', modelUrl.value)

  // Reset and close
  setTimeout(() => {
    isImporting.value = false
    modelUrl.value = ''
    modelName.value = ''
    dialogVisible.value = false
  }, 300)
}

function handleClose() {
  modelUrl.value = ''
  modelName.value = ''
  dialogVisible.value = false
}
</script>

<template>
  <Dialog v-model:open="dialogVisible">
    <DialogContent class="max-w-[560px] gap-0 p-0">
      <DialogHeader class="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <DialogTitle>Import Model</DialogTitle>
        <DialogDescription>Import models from external sources</DialogDescription>
      </DialogHeader>

      <div class="p-5">
        <!-- URL Input -->
        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Model URL
          </label>
          <div class="relative">
            <Icon
              name="link"
              size="sm"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              v-model="modelUrl"
              placeholder="https://civitai.com/models/... or https://huggingface.co/..."
              class="pl-9"
              @keyup.enter="handleImport"
            />
          </div>
          <div class="mt-1.5 flex items-center gap-2">
            <p
              v-if="modelUrl && !isValidUrl"
              class="text-xs text-red-500"
            >
              Please enter a valid CivitAI or HuggingFace URL
            </p>
            <div
              v-else-if="detectedSource"
              class="flex items-center gap-1 text-xs text-emerald-500"
            >
              <Icon name="check" size="xs" />
              <span class="capitalize">{{ detectedSource }} detected</span>
            </div>
          </div>
        </div>

        <!-- Model Name (optional) -->
        <div class="mb-5">
          <label class="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Model Name <span class="text-muted-foreground">(optional)</span>
          </label>
          <Input
            v-model="modelName"
            placeholder="Custom name for this model"
            @keyup.enter="handleImport"
          />
        </div>

        <!-- Import Info -->
        <div
          class="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50"
        >
          <div class="flex gap-3">
            <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-700">
              <Icon name="info-circle" size="md" class="text-zinc-600 dark:text-muted-foreground" />
            </div>
            <div>
              <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Supported sources
              </p>
              <ul class="mt-1.5 space-y-1 text-xs text-muted-foreground">
                <li>• CivitAI (civitai.com/models/...)</li>
                <li>• HuggingFace (huggingface.co/...)</li>
              </ul>
              <p class="mt-2 text-xs text-muted-foreground">
                The download will run in the background. You can continue working while it downloads.
              </p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter class="flex-row items-center justify-end gap-2 border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <button
          class="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          @click="handleClose"
        >
          Cancel
        </button>
        <button
          :class="[
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            isValidUrl && !isImporting
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500'
          ]"
          :disabled="!isValidUrl || isImporting"
          @click="handleImport"
        >
          <Icon
            v-if="isImporting"
            name="spinner"
            size="xs"
            class="animate-spin"
          />
          <Icon v-else name="download" size="xs" />
          {{ isImporting ? 'Importing...' : 'Import Model' }}
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
