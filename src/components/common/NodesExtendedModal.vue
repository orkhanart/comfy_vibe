<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, Grid3x3, List } from 'lucide-vue-next'
import { Icon } from '@/components/ui/icon'
import ExtendedViewModal from './ExtendedViewModal.vue'
import { NODE_CATEGORIES_DATA, type NodeCategory, type NodeItem } from '@/data/sidebarMockData'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

// View state
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const selectedCategoryId = ref<string | null>(null)
const sortBy = ref('name')

const nodeCategories = ref<NodeCategory[]>(
  NODE_CATEGORIES_DATA.map(c => ({ ...c, expanded: true }))
)

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'category', label: 'Category' },
]

// Reset selection when modal opens
watch(() => props.visible, (visible) => {
  if (visible) {
    selectedCategoryId.value = null
    searchQuery.value = ''
    sortBy.value = 'name'
  }
}, { immediate: true })

const selectedCategory = computed(() =>
  nodeCategories.value.find(c => c.id === selectedCategoryId.value)
)

const allNodes = computed(() => {
  const nodes: Array<NodeItem & { category: NodeCategory }> = []
  nodeCategories.value.forEach(category => {
    category.nodes.forEach(node => {
      nodes.push({ ...node, category })
    })
  })
  return nodes
})

const filteredNodes = computed(() => {
  let result = allNodes.value

  if (selectedCategoryId.value) {
    result = result.filter(n => n.category.id === selectedCategoryId.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(node =>
      node.display.toLowerCase().includes(query) ||
      node.name.toLowerCase().includes(query)
    )
  }

  return [...result].sort((a, b) => {
    switch (sortBy.value) {
      case 'category': return a.category.label.localeCompare(b.category.label)
      default: return a.display.localeCompare(b.display)
    }
  })
})

const totalNodes = computed(() => allNodes.value.length)

const categoryCounts = computed(() => {
  const counts: Record<string, number> = {}
  nodeCategories.value.forEach(cat => {
    counts[cat.id] = cat.nodes.length
  })
  return counts
})

function selectCategory(categoryId: string | null): void {
  selectedCategoryId.value = categoryId
}

function handleNodeDragStart(e: DragEvent, node: NodeItem & { category: NodeCategory }): void {
  if (e.dataTransfer) {
    const shortcut = {
      id: `shortcut-node-${node.name}`,
      type: 'node' as const,
      label: node.display,
      icon: node.category.icon,
      nodeCategory: node.category.id,
      nodeName: node.name,
    }
    const jsonData = JSON.stringify(shortcut)
    e.dataTransfer.setData('application/x-library-shortcut', jsonData)
    e.dataTransfer.setData('text/plain', jsonData)
    e.dataTransfer.effectAllowed = 'copyMove'
  }
}
</script>

<template>
  <ExtendedViewModal
    :visible="visible"
    title="Nodes"
    @update:visible="emit('update:visible', $event)"
  >
    <!-- Sidebar -->
    <template #sidebar>
      <div class="flex h-full flex-col p-2">
        <!-- All Nodes -->
        <button
          :class="[
            'flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm transition-colors',
            !selectedCategoryId
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          ]"
          @click="selectCategory(null)"
        >
          <span class="truncate">All Nodes</span>
          <span class="ml-auto text-xs opacity-60">{{ totalNodes }}</span>
        </button>

        <!-- Categories -->
        <button
          v-for="category in nodeCategories"
          :key="category.id"
          :class="[
            'flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm transition-colors',
            selectedCategoryId === category.id
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          ]"
          @click="selectCategory(category.id)"
        >
          <span class="truncate">{{ category.label }}</span>
          <span class="ml-auto text-xs opacity-60">{{ categoryCounts[category.id] }}</span>
        </button>
      </div>
    </template>

    <!-- Content -->
    <div class="flex h-full flex-col">
      <!-- Toolbar -->
      <div class="flex items-center gap-2 border-b border-border px-4 py-3">
        <!-- Search -->
        <div class="relative flex-1">
          <Search class="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search nodes..."
            class="h-8 w-full rounded border border-border bg-background pl-8 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        <!-- Sort -->
        <div class="relative">
          <select
            v-model="sortBy"
            class="h-8 appearance-none rounded border border-border bg-background py-1.5 pl-3 pr-8 text-sm outline-none transition-colors focus:border-ring"
          >
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>

        <!-- View Toggle -->
        <div class="flex items-center rounded border border-border">
          <button
            :class="['px-2 py-1.5 transition-colors', viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground']"
            @click="viewMode = 'grid'"
          >
            <Grid3x3 class="size-4" />
          </button>
          <button
            :class="['px-2 py-1.5 transition-colors', viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground']"
            @click="viewMode = 'list'"
          >
            <List class="size-4" />
          </button>
        </div>
      </div>

      <!-- Content Header -->
      <div class="px-4 py-3">
        <h2 class="text-sm font-medium text-foreground">
          {{ selectedCategory ? selectedCategory.label : 'All Nodes' }}
        </h2>
        <p class="text-xs text-muted-foreground">
          {{ filteredNodes.length }} {{ filteredNodes.length === 1 ? 'node' : 'nodes' }}
        </p>
      </div>

      <!-- Items Grid -->
      <div class="flex-1 overflow-y-auto px-4 pb-4">
        <div
          v-if="viewMode === 'grid' && filteredNodes.length > 0"
          class="grid gap-3"
          style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));"
        >
          <div
            v-for="node in filteredNodes"
            :key="node.name"
            class="cursor-grab rounded border border-border bg-card p-3 transition-colors hover:border-foreground/20"
            draggable="true"
            @dragstart="handleNodeDragStart($event, node)"
          >
            <p class="truncate text-sm text-foreground">{{ node.display }}</p>
            <p class="text-xs text-muted-foreground">{{ node.category.label }}</p>
          </div>
        </div>

        <!-- List View -->
        <div v-else-if="viewMode === 'list' && filteredNodes.length > 0" class="rounded border border-border">
          <div
            v-for="(node, index) in filteredNodes"
            :key="node.name"
            :class="['flex cursor-grab items-center gap-3 px-3 py-2 transition-colors hover:bg-muted', index !== filteredNodes.length - 1 && 'border-b border-border']"
            draggable="true"
            @dragstart="handleNodeDragStart($event, node)"
          >
            <span class="flex-1 truncate text-sm text-foreground">{{ node.display }}</span>
            <span class="text-xs text-muted-foreground">{{ node.category.label }}</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredNodes.length === 0" class="flex flex-col items-center justify-center py-12">
          <p class="text-sm text-muted-foreground">No nodes found</p>
        </div>
      </div>
    </div>
  </ExtendedViewModal>
</template>
