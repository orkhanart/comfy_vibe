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
  <nav class="flex h-14 items-center justify-around border-t border-border bg-background px-2 safe-area-bottom">
    <button
      v-for="tab in TABS"
      :key="tab.id"
      class="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1"
      :class="[
        activeTab === tab.id
          ? 'text-primary'
          : 'text-muted-foreground'
      ]"
      @click="selectTab(tab.id)"
    >
      <Icon :name="tab.icon" size="sm" />
      <span class="text-[10px] font-medium">{{ tab.label }}</span>
      <!-- Active indicator -->
      <div
        v-if="activeTab === tab.id"
        class="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary"
      />
    </button>
  </nav>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
}
</style>
