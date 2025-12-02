<script setup lang="ts">
import { Icon } from '@/components/ui/icon'

interface Props {
  icon: string
  iconColor?: string
  label: string
  count?: number
  expanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'text-zinc-400',
  expanded: false,
})

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <button
    class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-zinc-800"
    @click="emit('toggle')"
  >
    <Icon
      :name="props.expanded ? 'chevron-down' : 'chevron-right'"
      size="xs"
      class="text-zinc-500 transition-transform"
    />
    <Icon :name="props.icon" size="xs" :class="props.iconColor" />
    <span class="flex-1 text-xs font-medium text-zinc-300">
      {{ props.label }}
    </span>
    <span
      v-if="props.count !== undefined"
      class="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500"
    >
      {{ props.count }}
    </span>
  </button>
</template>
