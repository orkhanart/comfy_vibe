<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  isGenerating: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: []
  stop: []
}>()

function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    if (props.modelValue.trim() && !props.isGenerating) {
      emit('send')
    }
  }
}
</script>

<template>
  <div class="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5">
    <textarea
      :value="modelValue"
      placeholder="Describe what you want to create..."
      class="max-h-48 min-h-[72px] flex-1 resize-none bg-transparent text-xs text-zinc-200 outline-none placeholder:text-zinc-500"
      rows="3"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @keydown="handleKeydown"
    />
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-0.5">
        <button
          v-tooltip.top="'Upload image'"
          class="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
        >
          <Icon name="image" size="xs" />
        </button>
        <button
          v-tooltip.top="'Attach file'"
          class="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
        >
          <Icon name="paperclip" size="xs" />
        </button>
        <button
          v-tooltip.top="'Voice input'"
          class="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
        >
          <Icon name="microphone" size="xs" />
        </button>
      </div>
      <div class="flex items-center gap-1.5">
        <button
          v-if="isGenerating"
          class="flex h-7 items-center gap-1.5 rounded-md bg-zinc-700 px-2.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-600"
          @click="emit('stop')"
        >
          <Icon name="stop" size="xs" />
          <span class="font-medium">Stop</span>
        </button>
        <button
          v-else
          :disabled="!modelValue.trim()"
          :class="[
            'flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors',
            modelValue.trim()
              ? 'bg-zinc-200 text-zinc-900 hover:bg-white'
              : 'bg-zinc-800 text-zinc-500'
          ]"
          @click="emit('send')"
        >
          Generate
          <Icon name="arrow-right" size="xs" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
  width: 4px;
}

textarea::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 2px;
}
</style>
