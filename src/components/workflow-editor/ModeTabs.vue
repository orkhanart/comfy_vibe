<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import type { WorkflowMode } from '@/stores/uiStore'

export interface ModeTab {
  id: string
  name: string
  mode: WorkflowMode
  isActive: boolean
  isDirty?: boolean
}

const props = defineProps<{
  tabs: ModeTab[]
  activeTabId: string
}>()

const emit = defineEmits<{
  select: [tabId: string]
  close: [tabId: string]
  new: []
}>()

function handleClose(tabId: string, event: MouseEvent): void {
  event.stopPropagation()
  emit('close', tabId)
}

function getModeIcon(mode: WorkflowMode): string {
  return mode === 'workflow' ? 'sitemap' : 'sliders-h'
}
</script>

<template>
  <div class="flex flex-1 items-center gap-0.5 overflow-hidden">
    <!-- Tabs Container -->
    <div class="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
      <button
        v-for="tab in props.tabs"
        :key="tab.id"
        class="group flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs transition-colors"
        :class="[
          tab.id === props.activeTabId
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
        ]"
        @click="emit('select', tab.id)"
      >
        <Icon :name="getModeIcon(tab.mode)" size="xs" class="shrink-0 opacity-60" />
        <span class="max-w-[150px] truncate">{{ tab.name }}</span>
        <span v-if="tab.isDirty" class="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
        <span
          class="flex h-4 w-4 items-center justify-center rounded text-muted-foreground opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover:opacity-100"
          @click="handleClose(tab.id, $event)"
        >
          <Icon name="times" size="xs" />
        </span>
      </button>
    </div>

    <!-- New Tab Button -->
    <button
      v-tooltip.bottom="{ value: 'New Workflow', showDelay: 50 }"
      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      @click="emit('new')"
    >
      <Icon name="plus" size="xs" />
    </button>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
