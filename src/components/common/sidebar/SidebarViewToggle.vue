<script setup lang="ts">
type ViewMode = 'list' | 'grid'

const model = defineModel<ViewMode>({ required: true })
</script>

<template>
  <div class="flex items-center rounded bg-muted p-0.5">
    <button
      v-tooltip.bottom="{ value: 'List View', showDelay: 50 }"
      class="flex h-6 w-6 items-center justify-center rounded transition-colors"
      :class="model === 'list' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'"
      @click="model = 'list'"
    >
      <Icon name="list" size="xs" />
    </button>
    <button
      v-tooltip.bottom="{ value: 'Grid View', showDelay: 50 }"
      class="flex h-6 w-6 items-center justify-center rounded transition-colors"
      :class="model === 'grid' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'"
      @click="model = 'grid'"
    >
      <Icon name="th-large" size="xs" />
    </button>
  </div>
</template>
