<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@/components/ui/icon'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const urlInput = ref('')

const isValidUrl = computed(() => {
  if (!urlInput.value.trim()) return false
  // Check for civitai.com or huggingface.co URLs
  return urlInput.value.includes('civitai.com') || urlInput.value.includes('huggingface.co')
})

function handleClose() {
  emit('update:open', false)
}

function handlePasteFromClipboard() {
  navigator.clipboard.readText().then(text => {
    urlInput.value = text
  })
}

function handleContinue() {
  if (!isValidUrl.value) return
  // TODO: Implement import logic
  console.log('Importing model from:', urlInput.value)
  handleClose()
}
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent
      class="w-[512px] max-w-[90vw] gap-0 overflow-hidden rounded-2xl border border-charcoal-200 bg-charcoal-800 p-0 shadow-[1px_1px_8px_0px_rgba(0,0,0,0.4)]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-charcoal-200 px-4 py-4">
        <div class="flex items-center gap-2">
          <h2 class="text-sm font-bold text-white">Import a model</h2>
          <span class="rounded-full bg-white px-1.5 py-0 text-[9px] font-semibold uppercase text-charcoal-800">
            BETA
          </span>
        </div>
        <button
          class="flex size-4 items-center justify-center text-smoke-800 transition-colors hover:text-white"
          @click="handleClose"
        >
          <Icon name="x" size="sm" />
        </button>
      </div>

      <!-- Body -->
      <div class="flex flex-col gap-6 px-4 py-4">
        <!-- Description -->
        <div class="flex flex-col gap-2">
          <p class="text-sm leading-5 text-white">
            Paste a model URL to add it to your library.
          </p>
          <p class="text-sm leading-5 text-smoke-800">
            Only links from the following sites are supported:
          </p>
          <!-- Partner links -->
          <div class="flex items-end gap-1">
            <div class="flex items-center gap-1 py-1">
              <img
                src="https://civitai.com/favicon.ico"
                alt="Civitai"
                class="size-4"
              />
              <a
                href="https://civitai.com"
                target="_blank"
                class="text-sm leading-5 text-smoke-800 underline hover:text-white"
              >
                civitai.com
              </a>
            </div>
            <span class="text-sm leading-5 text-smoke-800">,</span>
            <div class="flex items-center gap-1 py-1">
              <img
                src="https://huggingface.co/favicon.ico"
                alt="Hugging Face"
                class="size-4"
              />
              <a
                href="https://huggingface.co"
                target="_blank"
                class="text-sm leading-5 text-smoke-800 underline hover:text-white"
              >
                huggingface.co
              </a>
            </div>
          </div>
        </div>

        <!-- URL Input -->
        <div class="flex gap-2">
          <div class="flex-1">
            <input
              v-model="urlInput"
              type="text"
              placeholder="Paste URL(s) here, separated by commas"
              class="h-10 w-full rounded-lg bg-charcoal-600 px-4 text-sm text-white placeholder:text-smoke-800 focus:outline-none focus:ring-1 focus:ring-charcoal-200"
            />
          </div>
          <button
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-charcoal-600 text-white transition-colors hover:bg-charcoal-200/20"
            title="Paste from clipboard"
            @click="handlePasteFromClipboard"
          >
            <Icon name="clipboard" size="sm" />
          </button>
        </div>

        <!-- Helper text -->
        <div class="flex flex-col gap-2 text-sm text-smoke-800">
          <p>Example: https://civitai.com/models/00000/modelname</p>
          <p>
            Max file size: <span class="font-bold italic">5 GB</span>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between px-4 py-4">
        <!-- Help link -->
        <button class="flex items-center gap-2 text-sm text-smoke-800 hover:text-white">
          <Icon name="circle-help" size="sm" />
          <span class="underline">How do I find this?</span>
        </button>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <button
            class="text-sm text-smoke-800 hover:text-white"
            @click="handleClose"
          >
            Cancel
          </button>
          <button
            class="h-10 rounded-lg bg-charcoal-600 px-4 text-sm text-white transition-colors hover:bg-charcoal-200/20 disabled:opacity-30"
            :disabled="!isValidUrl"
            @click="handleContinue"
          >
            Continue
          </button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
