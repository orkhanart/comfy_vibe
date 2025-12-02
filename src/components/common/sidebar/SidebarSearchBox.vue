<script setup lang="ts">
interface Props {
  placeholder?: string
  actionIcon?: string
  actionTooltip?: string
  showAction?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  actionIcon: 'plus',
  actionTooltip: 'Add',
  showAction: false,
})

const model = defineModel<string>({ default: '' })

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="flex flex-1 items-center rounded bg-muted px-2 py-1.5">
      <Icon name="search" size="xs" class="text-muted-foreground" />
      <input
        v-model="model"
        type="text"
        :placeholder="props.placeholder"
        class="ml-2 w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
    <button
      v-if="props.showAction"
      v-tooltip.top="{ value: props.actionTooltip, showDelay: 50 }"
      class="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      @click="emit('action')"
    >
      <Icon :name="props.actionIcon" size="xs" />
    </button>
  </div>
</template>
