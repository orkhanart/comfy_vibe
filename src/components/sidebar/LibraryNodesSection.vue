<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import type { NodePack } from '@/data/sidebarMockData'
import { LibraryGridCard } from '@/components/common/sidebar'

defineProps<{
  packs: NodePack[]
  viewMode: 'list' | 'grid'
  expanded: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <!-- List View -->
  <template v-if="viewMode === 'list'">
    <!-- Category Header -->
    <button
      class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-muted"
      @click="emit('toggle')"
    >
      <Icon
        :name="expanded ? 'chevron-down' : 'chevron-right'"
        size="xs"
        class="text-muted-foreground transition-transform"
      />
      <Icon name="code" size="xs" class="text-purple-400" />
      <span class="flex-1 text-xs font-medium text-foreground">Custom Nodes</span>
      <span class="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
        {{ packs.length }}
      </span>
    </button>

    <!-- Items -->
    <div v-if="expanded" class="ml-4 space-y-0.5 border-l border-border pl-2">
      <div
        v-for="pack in packs"
        :key="pack.id"
        class="group flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-muted"
      >
        <Icon name="circle-fill" size="md" class="text-[5px] text-muted-foreground/50 group-hover:text-muted-foreground" />
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="truncate text-xs text-muted-foreground group-hover:text-foreground">{{ pack.name }}</span>
            <span class="rounded bg-muted px-1 py-0.5 text-[9px] text-muted-foreground">
              v{{ pack.version }}
            </span>
          </div>
          <div class="flex items-center gap-2 text-[10px] text-muted-foreground/50">
            <span>{{ pack.nodes }} nodes</span>
            <span>{{ pack.author }}</span>
          </div>
        </div>
        <button
          :class="[
            'flex h-5 items-center gap-1 rounded px-1.5 text-[9px] font-medium transition-all',
            pack.installed
              ? 'bg-green-500/20 text-green-400'
              : 'bg-blue-600 text-white hover:bg-blue-500'
          ]"
        >
          <Icon :name="pack.installed ? 'check' : 'download'" size="xs" />
          {{ pack.installed ? 'Installed' : 'Install' }}
        </button>
      </div>
    </div>
  </template>

  <!-- Grid View -->
  <template v-else>
    <div class="mb-2 flex items-center justify-between px-1">
      <div class="flex items-center gap-2">
        <Icon name="code" size="xs" class="text-purple-400" />
        <span class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Nodepacks</span>
      </div>
      <span class="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
        {{ packs.length }}
      </span>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <LibraryGridCard
        v-for="pack in packs"
        :key="pack.id"
        :title="pack.name"
        :subtitle="`${pack.nodes} nodes · v${pack.version}`"
        :thumbnail="pack.thumbnail"
        icon="code"
        icon-class="text-purple-400"
        :badge="pack.installed ? 'Installed' : 'Available'"
        :badge-class="pack.installed ? 'bg-green-500/30 text-green-300' : 'bg-muted text-muted-foreground'"
      />
    </div>
  </template>
</template>
