<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { computed } from 'vue'
import type { LibraryItem } from '@/stores/libraryStore'

interface Props {
  item: LibraryItem
  viewMode?: 'grid' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'grid',
})

const emit = defineEmits<{
  click: [item: LibraryItem]
  contextmenu: [event: MouseEvent, item: LibraryItem]
}>()

const typeIcon = computed(() => {
  switch (props.item.type) {
    case 'workflow':
      return 'sitemap'
    case 'model':
      return 'box'
    case 'asset':
      return 'image'
    case 'template':
      return 'clone'
    default:
      return 'file'
  }
})

const subtitle = computed(() => {
  if (props.item.type === 'workflow' || props.item.type === 'template') {
    return props.item.nodeCount ? `${props.item.nodeCount} nodes` : ''
  }
  if (props.item.type === 'model') {
    return props.item.size || ''
  }
  return props.item.updatedAt
})

function handleClick(): void {
  emit('click', props.item)
}

function handleContextMenu(event: MouseEvent): void {
  event.preventDefault()
  emit('contextmenu', event, props.item)
}
</script>

<template>
  <!-- Grid View Card -->
  <div
    v-if="viewMode === 'grid'"
    class="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-all hover:border-border hover:shadow-md"
    draggable="true"
    @click="handleClick"
    @contextmenu="handleContextMenu"
  >
    <!-- Thumbnail -->
    <div class="relative aspect-video bg-muted/30">
      <img
        v-if="item.thumbnail"
        :src="item.thumbnail"
        :alt="item.name"
        class="h-full w-full object-cover"
      />
      <div v-else class="flex h-full w-full items-center justify-center">
        <Icon :name="typeIcon" size="lg" class="text-muted-foreground/20" />
      </div>
      <!-- Type badge -->
      <div class="absolute bottom-1.5 left-1.5 rounded bg-background/80 px-1.5 py-0.5 text-[9px] font-medium uppercase text-muted-foreground backdrop-blur-sm">
        {{ item.type }}
      </div>
      <!-- Read-only badge for templates -->
      <div
        v-if="item.isReadOnly"
        class="absolute right-1.5 top-1.5 rounded bg-background/80 p-1 backdrop-blur-sm"
      >
        <Icon name="lock" size="xs" class="text-muted-foreground/60" />
      </div>
    </div>
    <!-- Info -->
    <div class="flex flex-col gap-0.5 p-2">
      <span class="truncate text-xs font-medium text-foreground">
        {{ item.name }}
      </span>
      <span class="truncate text-[10px] text-muted-foreground/60">
        {{ subtitle }}
      </span>
    </div>
  </div>

  <!-- List View Row -->
  <div
    v-else
    class="group flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50"
    draggable="true"
    @click="handleClick"
    @contextmenu="handleContextMenu"
  >
    <!-- Icon -->
    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted/50">
      <Icon :name="typeIcon" size="sm" class="text-muted-foreground/60" />
    </div>
    <!-- Info -->
    <div class="flex min-w-0 flex-1 flex-col">
      <span class="truncate text-xs text-foreground">
        {{ item.name }}
      </span>
      <span class="truncate text-[10px] text-muted-foreground/50">
        {{ subtitle }}
      </span>
    </div>
    <!-- Meta -->
    <span class="shrink-0 text-[10px] text-muted-foreground/40">
      {{ item.updatedAt }}
    </span>
    <!-- Lock icon for templates -->
    <Icon
      v-if="item.isReadOnly"
      name="lock"
      size="xs"
      class="shrink-0 text-muted-foreground/30"
    />
  </div>
</template>
