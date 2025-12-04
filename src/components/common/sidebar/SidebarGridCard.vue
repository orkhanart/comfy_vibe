<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  draggable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  draggable: false,
})

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <div
    class="group aspect-square cursor-pointer rounded-lg border border-border bg-card p-2 transition-all hover:border-border/80 hover:bg-accent/50"
    :draggable="props.draggable"
    @click="emit('click')"
  >
    <!-- Header slot for icon/badge row -->
    <div class="mb-1 flex items-center justify-between">
      <slot name="header-left" />
      <slot name="header-right" />
    </div>

    <!-- Title -->
    <div class="line-clamp-2 text-xs text-muted-foreground group-hover:text-foreground">
      {{ props.title }}
    </div>

    <!-- Subtitle -->
    <div v-if="props.subtitle" class="mt-0.5 truncate text-[10px] text-muted-foreground/50">
      {{ props.subtitle }}
    </div>

    <!-- Extra content slot -->
    <slot name="footer" />
  </div>
</template>
