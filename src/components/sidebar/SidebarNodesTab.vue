<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'
import { NODE_CATEGORIES_DATA, type NodeCategory, type NodeItem } from '@/data/sidebarMockData'

const nodeCategories = NODE_CATEGORIES_DATA

// Hover preview state
const hoveredNode = ref<{ node: NodeItem; category: NodeCategory } | null>(null)
const previewPosition = ref({ top: 0, left: 0 })

function handleNodeHover(event: MouseEvent, node: NodeItem, category: NodeCategory) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()

  // Position preview to the right of the sidebar panel
  previewPosition.value = {
    top: rect.top,
    left: rect.right + 15,
  }
  hoveredNode.value = { node, category }
}

function handleNodeLeave() {
  hoveredNode.value = null
}

// Drag handlers for nodes
function handleNodeDragStart(e: DragEvent, node: NodeItem, category: NodeCategory): void {
  if (e.dataTransfer) {
    const shortcut = {
      id: `shortcut-node-${node.name}`,
      type: 'node' as const,
      label: node.display,
      icon: category.icon,
      nodeCategory: category.id,
      nodeName: node.name,
    }
    const jsonData = JSON.stringify(shortcut)
    e.dataTransfer.setData('application/x-library-shortcut', jsonData)
    e.dataTransfer.setData('text/plain', jsonData)
    e.dataTransfer.effectAllowed = 'copyMove'
    console.log('[Shortcut] Node drag started:', node.display)
  }
}

function handleCategoryDragStart(e: DragEvent, category: NodeCategory): void {
  if (e.dataTransfer) {
    const shortcut = {
      id: `shortcut-node-category-${category.id}`,
      type: 'node-category' as const,
      label: category.label,
      icon: category.icon,
      nodeCategory: category.id,
    }
    const jsonData = JSON.stringify(shortcut)
    e.dataTransfer.setData('application/x-library-shortcut', jsonData)
    e.dataTransfer.setData('text/plain', jsonData)
    e.dataTransfer.effectAllowed = 'copyMove'
    console.log('[Shortcut] Category drag started:', category.label)
  }
}
</script>

<template>
  <div class="relative flex h-full flex-col">
    <div class="flex-1 overflow-y-auto p-2">
      <div class="space-y-2">
        <div
          v-for="category in nodeCategories"
          :key="category.id"
          class="select-none"
        >
          <!-- Category Header -->
          <div
            draggable="true"
            class="mb-1 flex cursor-grab items-center gap-2 rounded bg-zinc-900 px-2 py-1.5 active:cursor-grabbing dark:bg-zinc-950"
            @dragstart="handleCategoryDragStart($event, category)"
          >
            <Icon :name="category.icon" size="xs" class="text-zinc-400" />
            <span class="flex-1 text-xs font-medium text-zinc-100">
              {{ category.label }}
            </span>
            <span class="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
              {{ category.nodes.length }}
            </span>
          </div>

          <!-- Nodes List -->
          <div class="space-y-0.5 pl-1">
            <div
              v-for="node in category.nodes"
              :key="node.name"
              draggable="true"
              class="group flex cursor-grab items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-accent active:cursor-grabbing"
              @dragstart="handleNodeDragStart($event, node, category)"
              @mouseenter="handleNodeHover($event, node, category)"
              @mouseleave="handleNodeLeave"
            >
              <Icon
                name="circle-fill"
                size="xs"
                class="text-muted-foreground/50 group-hover:text-muted-foreground"
              />
              <span class="flex-1 truncate text-xs text-muted-foreground group-hover:text-foreground">
                {{ node.display }}
              </span>
              <Icon
                name="plus"
                size="xs"
                class="text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Node Preview Panel (using Teleport to body for fixed positioning) -->
    <Teleport to="body">
        <div
          v-if="hoveredNode"
          class="pointer-events-none fixed z-[9999] w-64 rounded-lg border border-border bg-popover p-3 shadow-xl"
          :style="{ top: `${previewPosition.top}px`, left: `${previewPosition.left}px` }"
        >
        <!-- Node Title -->
        <div class="mb-2 flex items-center gap-2">
          <div class="flex h-6 w-6 items-center justify-center rounded bg-zinc-900 dark:bg-zinc-800">
            <Icon :name="hoveredNode.category.icon" size="xs" class="text-zinc-400" />
          </div>
          <span class="text-sm font-medium text-foreground">{{ hoveredNode.node.display }}</span>
        </div>

        <!-- Description -->
        <p v-if="hoveredNode.node.description" class="mb-3 text-[11px] text-muted-foreground">
          {{ hoveredNode.node.description }}
        </p>

        <!-- Node Info -->
        <div class="mb-3 space-y-1 rounded bg-muted/50 px-2 py-1.5 text-[10px]">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Category</span>
            <span class="font-medium text-foreground">{{ hoveredNode.category.label }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Type</span>
            <span class="font-mono text-foreground">{{ hoveredNode.node.name }}</span>
          </div>
        </div>

        <!-- Inputs/Outputs Preview -->
        <div class="flex gap-4">
          <!-- Inputs -->
          <div class="flex-1">
            <div class="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Inputs
            </div>
            <div v-if="hoveredNode.node.inputs?.length" class="space-y-1">
              <div
                v-for="input in hoveredNode.node.inputs"
                :key="input.name"
                class="flex items-center gap-1.5"
              >
                <span :class="['h-2 w-2 shrink-0 rounded-full', input.color]"></span>
                <span class="truncate text-[10px] text-foreground">{{ input.name }}</span>
              </div>
            </div>
            <div v-else class="text-[10px] italic text-muted-foreground/60">None</div>
          </div>

          <!-- Outputs -->
          <div class="flex-1">
            <div class="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Outputs
            </div>
            <div v-if="hoveredNode.node.outputs?.length" class="space-y-1">
              <div
                v-for="output in hoveredNode.node.outputs"
                :key="output.name"
                class="flex items-center gap-1.5"
              >
                <span :class="['h-2 w-2 shrink-0 rounded-full', output.color]"></span>
                <span class="truncate text-[10px] text-foreground">{{ output.name }}</span>
              </div>
            </div>
            <div v-else class="text-[10px] italic text-muted-foreground/60">None</div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
