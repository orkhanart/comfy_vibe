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
  <div class="flex items-center justify-between border-b border-border px-3 py-2">
    <span class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {{ props.title }}
    </span>
    <!-- Action Button -->
    <div v-if="props.actionLabel" class="flex items-center gap-0.5">
      <button
        class="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        @click="emit('action')"
      >
        <Icon :name="props.actionIcon" size="sm" />
      </button>
    </div>
  </div>
</template>
