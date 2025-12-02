<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
  actionLabel?: string
  actionIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  actionIcon: 'plus'
})

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border">
    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-muted">
      <Icon :name="props.icon" size="xl" />
    </div>
    <h3 class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">{{ props.title }}</h3>
    <p class="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">{{ props.description }}</p>
    <button
      v-if="props.actionLabel"
      class="mt-4 inline-flex items-center gap-2 rounded-md bg-card px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-muted dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      @click="emit('action')"
    >
      <Icon :name="props.actionIcon" size="xs" />
      {{ props.actionLabel }}
    </button>
  </div>
</template>
