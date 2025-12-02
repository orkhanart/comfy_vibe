<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import type { SharedWorkflow } from '@/data/sidebarMockData'
import { LibraryGridCard } from '@/components/common/sidebar'

defineProps<{
  workflows: SharedWorkflow[]
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
      <Icon name="sitemap" size="xs" class="text-blue-400" />
      <span class="flex-1 text-xs font-medium text-foreground">Shared Workflows</span>
      <span class="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
        {{ workflows.length }}
      </span>
    </button>

    <!-- Items -->
    <div v-if="expanded" class="ml-4 space-y-0.5 border-l border-border pl-2">
      <div
        v-for="workflow in workflows"
        :key="workflow.id"
        class="group flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-muted"
        draggable="true"
      >
        <Icon name="circle-fill" size="md" class="text-[5px] text-muted-foreground/50 group-hover:text-muted-foreground" />
        <Icon v-if="workflow.starred" name="star-fill" size="xs" class="text-amber-400" />
        <div class="min-w-0 flex-1">
          <div class="truncate text-xs text-muted-foreground group-hover:text-foreground">
            {{ workflow.name }}
          </div>
          <div class="flex items-center gap-2 text-[10px] text-muted-foreground/50">
            <span>{{ workflow.nodes }} nodes</span>
            <span>{{ workflow.updatedAt }}</span>
          </div>
        </div>
        <Icon name="plus" size="xs" class="text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </div>
  </template>

  <!-- Grid View -->
  <template v-else>
    <div class="mb-2 flex items-center justify-between px-1">
      <div class="flex items-center gap-2">
        <Icon name="sitemap" size="xs" class="text-blue-400" />
        <span class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Workflows</span>
      </div>
      <span class="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
        {{ workflows.length }}
      </span>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <LibraryGridCard
        v-for="workflow in workflows"
        :key="workflow.id"
        :title="workflow.name"
        :subtitle="`${workflow.nodes} nodes · ${workflow.updatedAt}`"
        :thumbnail="workflow.thumbnail"
        icon="sitemap"
        icon-class="text-blue-400"
        :badge="workflow.category"
        badge-class="bg-blue-500/30 text-blue-300"
        :starred="workflow.starred"
      />
    </div>
  </template>
</template>
