<script setup lang="ts">
import { Icon } from '@/components/ui/icon'

interface Props {
  title: string
  subtitle?: string
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
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-foreground">
        {{ props.title }}
      </h1>
      <p v-if="props.subtitle" class="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
        {{ props.subtitle }}
      </p>
    </div>
    <!-- Action Button -->
    <button
      v-if="props.actionLabel"
      class="inline-flex items-center gap-2 rounded-md bg-card px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-muted dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      @click="emit('action')"
    >
      <Icon :name="props.actionIcon" size="xs" />
      {{ props.actionLabel }}
    </button>
  </div>
</template>
