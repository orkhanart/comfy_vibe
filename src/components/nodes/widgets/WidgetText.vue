<script setup lang="ts">
import { computed } from 'vue'
import type { WidgetDefinition } from '@/types/node'

interface Props {
  widget: WidgetDefinition<string>
  modelValue: string
  multiline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  multiline: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const placeholder = computed(() => props.widget.options?.placeholder ?? '')
const disabled = computed(() => props.widget.options?.disabled ?? false)

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="widget-text" @pointerdown.stop @mousedown.stop>
    <textarea
      v-if="multiline"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="custom-textarea nodrag"
      rows="3"
      @input="handleInput"
    />
    <input
      v-else
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="custom-input nodrag"
      @input="handleInput"
    />
  </div>
</template>

<style scoped>
.widget-text {
  width: 100%;
}

.custom-input {
  width: 100%;
  height: 24px;
  background: var(--node-widget-bg);
  border: 1px solid hsl(var(--border));
  border-radius: 4px;
  color: hsl(var(--foreground));
  padding: 0 10px;
  font-size: 11px;
  outline: none;
}

.custom-textarea {
  width: 100%;
  background: var(--node-widget-bg);
  border: 1px solid hsl(var(--border));
  border-radius: 4px;
  color: hsl(var(--foreground));
  padding: 6px 10px;
  font-size: 11px;
  outline: none;
  resize: none;
}

.custom-input:hover,
.custom-textarea:hover {
  background: hsl(var(--accent));
}

.custom-input:focus,
.custom-textarea:focus {
  background: hsl(var(--accent));
}

.custom-input:disabled,
.custom-textarea:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.custom-input::placeholder,
.custom-textarea::placeholder {
  color: hsl(var(--muted-foreground));
}
</style>
