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
  <div class="flex rounded-md border border-zinc-200 dark:border-border">
    <button
      :class="[
        'px-3 py-2 text-sm transition-colors',
        modelValue === 'grid'
          ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground'
          : 'text-muted-foreground hover:text-zinc-900 dark:text-muted-foreground dark:hover:text-foreground'
      ]"
      @click="emit('update:modelValue', 'grid')"
    >
      <Icon name="th-large" size="md" />
    </button>
    <button
      :class="[
        'px-3 py-2 text-sm transition-colors',
        modelValue === 'list'
          ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground'
          : 'text-muted-foreground hover:text-zinc-900 dark:text-muted-foreground dark:hover:text-foreground'
      ]"
      @click="emit('update:modelValue', 'list')"
    >
      <Icon name="list" size="md" />
    </button>
  </div>
</template>
