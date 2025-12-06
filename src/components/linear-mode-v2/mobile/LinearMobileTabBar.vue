<script setup lang="ts">
import { Icon } from '@/components/ui/icon'

export type MobileTab = 'run' | 'queue' | 'assets' | 'workflows' | 'templates'

interface TabConfig {
  id: MobileTab
  label: string
  icon: string
}

const TABS: TabConfig[] = [
  { id: 'run', label: 'Run', icon: 'play' },
  { id: 'queue', label: 'Queue', icon: 'list' },
  { id: 'assets', label: 'Assets', icon: 'images' },
  { id: 'workflows', label: 'Flows', icon: 'workflow' },
  { id: 'templates', label: 'Temps', icon: 'th-large' },
]

const props = defineProps<{
  activeTab: MobileTab
}>()

const emit = defineEmits<{
  'update:activeTab': [tab: MobileTab]
}>()

function selectTab(tabId: MobileTab): void {
  emit('update:activeTab', tabId)
}
</script>

<template>
  <nav class="flex items-center justify-around border-b border-border bg-background px-2 py-1.5">
    <button
      v-for="tab in TABS"
      :key="tab.id"
      class="flex size-10 items-center justify-center rounded-md transition-colors"
      :class="[
        activeTab === tab.id
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted'
      ]"
      @click="selectTab(tab.id)"
    >
      <Icon :name="tab.icon" size="md" />
    </button>
  </nav>
</template>
