<script setup lang="ts">
export type SidebarTab = 'assets' | 'workflows'

interface Props {
  activeTab: SidebarTab
}

defineProps<Props>()

const emit = defineEmits<{
  'update:activeTab': [tab: SidebarTab]
}>()

const tabs: Array<{ id: SidebarTab; icon: string; label: string }> = [
  { id: 'assets', icon: 'pi-images', label: 'Assets' },
  { id: 'workflows', icon: 'pi-play', label: 'Run Workflow' },
]

function selectTab(tab: SidebarTab): void {
  emit('update:activeTab', tab)
}
</script>

<template>
  <nav class="flex h-full w-12 flex-col items-center border-r border-zinc-800 bg-black py-2">
    <!-- Top Icons -->
    <div class="flex flex-1 flex-col items-center gap-1">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        v-tooltip.right="{ value: tab.label, showDelay: 50 }"
        :class="[
          'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
          activeTab === tab.id
            ? 'bg-zinc-700 text-zinc-100'
            : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
        ]"
        @click="selectTab(tab.id)"
      >
        <i :class="['pi', tab.icon, 'text-sm']" />
      </button>
    </div>

    <!-- Bottom Icons -->
    <div class="flex flex-col items-center gap-1">
      <button
        v-tooltip.right="{ value: 'Help', showDelay: 50 }"
        class="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
      >
        <i class="pi pi-question-circle text-sm" />
      </button>
    </div>
  </nav>
</template>
