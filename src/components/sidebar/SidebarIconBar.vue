<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { computed } from 'vue'
import { useUiStore, SIDEBAR_TABS, type SidebarTabId } from '@/stores/uiStore'

const uiStore = useUiStore()
const activeSidebarTab = computed(() => uiStore.activeSidebarTab)

function handleTabClick(tabId: Exclude<SidebarTabId, null>): void {
  uiStore.toggleSidebarTab(tabId)
}
</script>

<template>
  <nav class="flex w-12 flex-col items-center border-r border-border bg-card py-2">
    <!-- Tab buttons -->
    <div class="flex flex-col gap-1">
      <button
        v-for="tab in SIDEBAR_TABS"
        :key="tab.id"
        v-tooltip.right="{ value: tab.tooltip, showDelay: 50 }"
        class="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
        :class="[
          activeSidebarTab === tab.id
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
        ]"
        @click="handleTabClick(tab.id)"
      >
        <Icon :name="tab.icon" size="sm" />
      </button>
    </div>

    <!-- Bottom section -->
    <div class="mt-auto flex flex-col gap-1">
      <button
        v-tooltip.right="{ value: 'Console', showDelay: 50 }"
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
      >
        <Icon name="code" size="sm" />
      </button>
      <button
        v-tooltip.right="{ value: 'Settings', showDelay: 50 }"
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
      >
        <Icon name="cog" size="sm" />
      </button>
      <button
        v-tooltip.right="{ value: 'Help', showDelay: 50 }"
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
      >
        <Icon name="question-circle" size="sm" />
      </button>
    </div>
  </nav>
</template>
