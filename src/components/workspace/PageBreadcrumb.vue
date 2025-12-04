<script setup lang="ts">
import { Icon } from '@/components/ui/icon'

interface Props {
  label: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'home'
})
</script>

<template>
  <nav class="mb-4 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
    <Icon :name="icon" size="sm" />
    <span>{{ label }}</span>
  </nav>
</template>
