<script setup lang="ts">
import { Icon } from '@/components/ui/icon'

export interface BreadcrumbItem {
  label: string
  icon?: string
  to?: string
}

interface Props {
  label?: string
  icon?: string
  items?: BreadcrumbItem[]
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'home'
})
</script>

<template>
  <nav class="flex items-center gap-1 text-sm font-medium text-muted-foreground">
    <!-- Multi-item breadcrumb -->
    <template v-if="items && items.length > 0">
      <template v-for="(item, index) in items" :key="index">
        <component
          :is="item.to ? 'router-link' : 'span'"
          :to="item.to"
          :class="[
            'flex items-center gap-1.5 rounded px-1.5 py-0.5',
            item.to ? 'hover:bg-zinc-100 hover:text-foreground dark:hover:bg-zinc-800 cursor-pointer transition-colors' : '',
            index === items.length - 1 ? 'text-foreground' : ''
          ]"
        >
          <Icon v-if="item.icon" :name="item.icon" size="sm" />
          <span>{{ item.label }}</span>
        </component>
        <Icon v-if="index < items.length - 1" name="chevron-right" size="xs" class="text-zinc-400" />
      </template>
    </template>
    <!-- Single label (backwards compatible) -->
    <template v-else-if="label">
      <span class="flex items-center gap-1.5 rounded px-1.5 py-0.5">
        <Icon :name="icon" size="sm" />
        <span>{{ label }}</span>
      </span>
    </template>
  </nav>
</template>
