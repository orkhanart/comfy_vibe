<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'
import { SidebarTreeCategory, SidebarTreeItem, SidebarGridCard } from '@/components/common/sidebar'
import { NODE_CATEGORIES_DATA, type NodeCategory, type NodeItem } from '@/data/sidebarMockData'

defineProps<{
  viewMode: 'list' | 'grid'
}>()

const nodeCategories = ref<NodeCategory[]>(
  NODE_CATEGORIES_DATA.map(c => ({ ...c }))
)

function toggleCategory(categoryId: string): void {
  const category = nodeCategories.value.find(c => c.id === categoryId)
  if (category) {
    category.expanded = !category.expanded
  }
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
  <!-- List View -->
  <div v-if="viewMode === 'list'" class="space-y-0.5">
    <div
      v-for="category in nodeCategories"
      :key="category.id"
      class="select-none"
    >
      <div
        draggable="true"
        class="cursor-grab active:cursor-grabbing"
        @dragstart="handleCategoryDragStart($event, category)"
      >
        <SidebarTreeCategory
          :icon="category.icon"
          :label="category.label"
          :count="category.nodes.length"
          :expanded="category.expanded"
          @toggle="toggleCategory(category.id)"
        />
      </div>

      <div
        v-if="category.expanded"
        class="ml-4 space-y-0.5 border-l border-border pl-2"
      >
        <div
          v-for="node in category.nodes"
          :key="node.name"
          draggable="true"
          class="cursor-grab active:cursor-grabbing"
          @dragstart="handleNodeDragStart($event, node, category)"
        >
          <SidebarTreeItem
            :label="node.display"
            :draggable="false"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Grid View -->
  <div v-else class="grid grid-cols-2 gap-1.5">
    <template v-for="category in nodeCategories" :key="category.id">
      <div
        v-for="node in category.nodes"
        :key="node.name"
        draggable="true"
        class="cursor-grab active:cursor-grabbing"
        @dragstart="handleNodeDragStart($event, node, category)"
      >
        <SidebarGridCard
          :title="node.display"
          :subtitle="category.label"
          :draggable="false"
        >
          <template #header-left>
            <Icon :name="category.icon" size="xs" />
          </template>
          <template #header-right>
            <Icon name="plus" size="xs" class="text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
          </template>
        </SidebarGridCard>
      </div>
    </template>
  </div>
</template>
