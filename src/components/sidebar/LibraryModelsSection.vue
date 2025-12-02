<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import type { TeamModel } from '@/data/sidebarMockData'
import { LibraryGridCard } from '@/components/common/sidebar'

defineProps<{
  models: TeamModel[]
  viewMode: 'list' | 'grid'
  expanded: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

function getModelTypeLabel(type: TeamModel['type']): string {
  switch (type) {
    case 'checkpoint': return 'Checkpoint'
    case 'lora': return 'LoRA'
    case 'embedding': return 'Embedding'
    case 'controlnet': return 'ControlNet'
    default: return type
  }
}

function getModelBadgeClass(type: TeamModel['type']): string {
  switch (type) {
    case 'checkpoint': return 'bg-purple-500/30 text-purple-300'
    case 'lora': return 'bg-green-500/30 text-green-300'
    case 'embedding': return 'bg-amber-500/30 text-amber-300'
    case 'controlnet': return 'bg-cyan-500/30 text-cyan-300'
    default: return 'bg-muted text-muted-foreground'
  }
}
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
      <Icon name="box" size="xs" class="text-green-400" />
      <span class="flex-1 text-xs font-medium text-foreground">Team Models</span>
      <span class="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
        {{ models.length }}
      </span>
    </button>

    <!-- Items -->
    <div v-if="expanded" class="ml-4 space-y-0.5 border-l border-border pl-2">
      <div
        v-for="model in models"
        :key="model.id"
        class="group flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-muted"
        draggable="true"
      >
        <Icon name="file" size="xs" class="text-muted-foreground/50 group-hover:text-muted-foreground" />
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="truncate text-xs text-muted-foreground group-hover:text-foreground">{{ model.name }}</span>
            <span class="rounded bg-muted px-1 py-0.5 text-[9px] text-muted-foreground">
              {{ getModelTypeLabel(model.type) }}
            </span>
          </div>
          <div class="flex items-center gap-2 text-[10px] text-muted-foreground/50">
            <span>{{ model.size }}</span>
            <span>{{ model.downloads }} downloads</span>
          </div>
        </div>
        <Icon name="download" size="xs" class="text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </div>
  </template>

  <!-- Grid View -->
  <template v-else>
    <div class="mb-2 flex items-center justify-between px-1">
      <div class="flex items-center gap-2">
        <Icon name="box" size="xs" class="text-green-400" />
        <span class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Models</span>
      </div>
      <span class="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
        {{ models.length }}
      </span>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <LibraryGridCard
        v-for="model in models"
        :key="model.id"
        :title="model.name"
        :subtitle="`${model.size} · ${model.downloads} downloads`"
        :thumbnail="model.thumbnail"
        icon="box"
        icon-class="text-green-400"
        :badge="getModelTypeLabel(model.type)"
        :badge-class="getModelBadgeClass(model.type)"
      />
    </div>
  </template>
</template>
