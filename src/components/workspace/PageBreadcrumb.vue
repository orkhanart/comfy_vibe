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
  <nav class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
    <span class="flex items-center gap-1.5 rounded px-1.5 py-0.5">
      <Icon :name="icon" size="sm" />
      <span>{{ label }}</span>
    </span>
  </nav>
</template>
