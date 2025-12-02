<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { PopoverContent, type PopoverContentProps, PopoverPortal, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

interface Props extends PopoverContentProps {
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  align: 'center',
  sideOffset: 4,
})

const forwarded = useForwardProps(props)
</script>

<template>
  <PopoverPortal>
    <PopoverContent
      v-bind="forwarded"
      :class="
        cn(
          'z-50 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
          props.class,
        )
      "
    >
      <slot />
    </PopoverContent>
  </PopoverPortal>
</template>
