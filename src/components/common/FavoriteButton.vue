<script setup lang="ts">
import { Icon } from '@/components/ui/icon'

interface Props {
  isFavorite: boolean
  /**
   * Display variant:
   * - 'overlay': For use on image thumbnails (white/amber, shows on hover)
   * - 'toolbar': For use in toolbars/lists (gray/amber, always visible)
   */
  variant?: 'overlay' | 'toolbar'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'overlay',
  size: 'md'
})

const emit = defineEmits<{
  toggle: []
}>()

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10'
}

const iconSizes = {
  sm: 'sm' as const,
  md: 'md' as const,
  lg: 'lg' as const
}
</script>

<template>
  <button
    :class="[
      'flex items-center justify-center rounded-lg transition-all',
      sizeClasses[props.size],
      props.variant === 'overlay'
        ? [
            props.isFavorite
              ? 'text-amber-400 drop-shadow-md'
              : 'text-white/60 opacity-0 hover:text-amber-400 group-hover:opacity-100'
          ]
        : [
            props.isFavorite
              ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
              : 'text-zinc-300 hover:bg-zinc-100 hover:text-amber-500 dark:text-zinc-600 dark:hover:bg-zinc-800'
          ]
    ]"
    @click.stop="emit('toggle')"
  >
    <Icon :name="props.isFavorite ? 'star-fill' : 'star'" :size="iconSizes[props.size]" />
  </button>
</template>
