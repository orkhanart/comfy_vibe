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

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'import': [modelUrl: string]
}>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const modelUrl = ref('')
const isImporting = ref(false)

const isValidUrl = computed(() => {
  if (!modelUrl.value) return false

  try {
    const url = new URL(modelUrl.value)
    return url.hostname.includes('civitai.com')
  } catch {
    return false
  }
})

function handleImport() {
  if (!isValidUrl.value || isImporting.value) return

  isImporting.value = true
  emit('import', modelUrl.value)

  // Reset after emit (parent should handle actual import)
  setTimeout(() => {
    isImporting.value = false
    modelUrl.value = ''
    dialogVisible.value = false
  }, 500)
}

function handleClose() {
  modelUrl.value = ''
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
        <div class="mb-5">
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
              placeholder="https://civitai.com/models/..."
              class="pl-9"
              @keyup.enter="handleImport"
            />
          </div>
          <p
            v-if="modelUrl && !isValidUrl"
            class="mt-1.5 text-xs text-red-500"
          >
            Please enter a valid Civitai URL
          </p>
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
                How to import from Civitai
              </p>
              <ul class="mt-1.5 space-y-1 text-xs text-muted-foreground">
                <li>1. Find a model on Civitai.com</li>
                <li>2. Copy the model page URL from your browser</li>
                <li>3. Paste the URL above and click Import</li>
              </ul>
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
