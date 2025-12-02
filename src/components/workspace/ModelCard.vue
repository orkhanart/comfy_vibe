<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { getModelIcon, getModelColor, type Model } from '@/data/workspaceMockData'

interface Props {
  model: Model
}

defineProps<Props>()

const emit = defineEmits<{
  open: [id: string]
  menu: [id: string, event: MouseEvent]
}>()
</script>

<template>
  <div
    class="group aspect-square cursor-pointer rounded-lg border border-zinc-200 bg-white p-4 text-left transition-all hover:border-zinc-300 hover:shadow-sm dark:border-border dark:bg-card dark:hover:border-border"
    @click="emit('open', model.id)"
  >
    <div class="flex h-full flex-col">
      <div class="flex items-start justify-between">
        <div :class="['flex h-10 w-10 items-center justify-center rounded-md', getModelColor(model.type)]">
          <Icon :name="getModelIcon(model.type)" size="sm" />
        </div>
        <button
          class="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-zinc-100 hover:text-muted-foreground/50 group-hover:opacity-100 dark:hover:bg-muted dark:hover:text-foreground"
          @click.stop="emit('menu', model.id, $event)"
        >
          <Icon name="ellipsis-h" size="sm" />
        </button>
      </div>
      <div class="mt-auto">
        <h3 class="font-medium text-zinc-900 dark:text-foreground">{{ model.name }}</h3>
        <p class="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
          v{{ model.version }}
        </p>
        <div class="mt-2 flex items-center justify-between text-xs text-muted-foreground dark:text-muted-foreground">
          <span :class="['rounded-full px-2 py-0.5 text-xs font-medium capitalize', getModelColor(model.type)]">
            {{ model.type }}
          </span>
          <span>{{ model.size }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
