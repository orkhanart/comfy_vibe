<script setup lang="ts">
import { computed } from 'vue'
import type { WidgetDefinition } from '@/types/node'

interface Props {
  widget: WidgetDefinition<string | number>
  modelValue: string | number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const choices = computed(() => props.widget.options?.choices ?? [])
const disabled = computed(() => props.widget.options?.disabled ?? false)

function handleChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="widget-select" @pointerdown.stop @mousedown.stop>
    <select
      :value="modelValue"
      :disabled="disabled"
      class="custom-select nodrag"
      @change="handleChange"
    >
      <option
        v-for="choice in choices"
        :key="choice.value"
        :value="choice.value"
      >
        {{ choice.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.widget-select {
  width: 100%;
  position: relative;
}

.custom-select {
  width: 100%;
  height: 24px;
  background-color: var(--node-widget-bg);
  border: 1px solid hsl(var(--border));
  border-radius: 4px;
  color: hsl(var(--foreground));
  padding: 0 24px 0 10px;
  font-size: 11px;
  outline: none;
  cursor: pointer;
  appearance: none;
}

.widget-select::after {
  content: '';
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid hsl(var(--muted-foreground));
  pointer-events: none;
}

.custom-select:hover {
  background-color: hsl(var(--accent));
}

.custom-select:focus {
  background-color: hsl(var(--accent));
}

.custom-select:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.custom-select option {
  background: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
}
</style>
