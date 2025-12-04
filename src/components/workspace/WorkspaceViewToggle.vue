<script setup lang="ts">
type ViewMode = 'grid' | 'list'

defineProps<{
  modelValue: ViewMode
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ViewMode]
}>()
</script>

<template>
  <div class="flex rounded-md border border-border">
    <button
      :class="[
        'px-3 py-2 text-sm transition-colors',
        modelValue === 'grid'
          ? 'bg-button-active-surface text-button-active-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-button-hover-surface'
      ]"
      @click="emit('update:modelValue', 'grid')"
    >
      <Icon name="th-large" size="md" />
    </button>
    <button
      :class="[
        'px-3 py-2 text-sm transition-colors',
        modelValue === 'list'
          ? 'bg-button-active-surface text-button-active-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-button-hover-surface'
      ]"
      @click="emit('update:modelValue', 'list')"
    >
      <Icon name="list" size="md" />
    </button>
  </div>
</template>
