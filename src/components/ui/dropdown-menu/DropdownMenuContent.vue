<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DropdownMenuContent, type DropdownMenuContentProps, DropdownMenuPortal, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

interface Props extends DropdownMenuContentProps {
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  align: 'center',
  sideOffset: 4,
})

const forwarded = useForwardProps(props)
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      v-bind="forwarded"
      :class="
        cn(
          'z-50 min-w-32 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
          props.class,
        )
      "
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
