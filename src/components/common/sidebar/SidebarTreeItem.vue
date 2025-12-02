<script setup lang="ts">
import { Icon } from '@/components/ui/icon'

interface Props {
  icon?: string
  iconType?: 'dot' | 'icon'
  label: string
  sublabel?: string
  badge?: string | number
  draggable?: boolean
  actionIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconType: 'dot',
  draggable: false,
  actionIcon: 'plus',
})

const emit = defineEmits<{
  click: []
  action: []
}>()
</script>

<template>
  <div
    class="group flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-zinc-800"
    :draggable="props.draggable"
    @click="emit('click')"
  >
    <!-- Dot or Icon -->
    <Icon
      v-if="props.iconType === 'dot'"
      name="circle-fill"
      size="xs"
      class="text-zinc-600 group-hover:text-zinc-400"
    />
    <Icon
      v-else-if="props.icon"
      :name="props.icon"
      size="xs"
      class="text-zinc-600 group-hover:text-zinc-400"
    />

    <!-- Content -->
    <div class="min-w-0 flex-1">
      <div class="truncate text-xs text-zinc-400 group-hover:text-zinc-200">
        {{ props.label }}
      </div>
      <div v-if="props.sublabel" class="truncate text-[10px] text-zinc-600">
        {{ props.sublabel }}
      </div>
    </div>

    <!-- Badge -->
    <span
      v-if="props.badge !== undefined"
      class="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-600"
    >
      {{ props.badge }}
    </span>

    <!-- Action Icon -->
    <Icon
      :name="props.actionIcon"
      size="xs"
      class="text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100"
      @click.stop="emit('action')"
    />
  </div>
</template>
