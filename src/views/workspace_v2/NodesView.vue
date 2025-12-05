<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { NODE_CATEGORIES_DATA, type NodeCategory } from '@/data/sidebarMockData'

// View state
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const filterCategory = ref('all')

const nodeCategories = ref<NodeCategory[]>(
  NODE_CATEGORIES_DATA.map(c => ({ ...c, expanded: true }))
)

const categoryOptions = computed(() => [
  { value: 'all', label: 'All Categories' },
  ...nodeCategories.value.map(c => ({ value: c.id, label: c.label }))
])

const filteredCategories = computed(() => {
  let result = nodeCategories.value

  if (filterCategory.value !== 'all') {
    result = result.filter(c => c.id === filterCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.map(category => ({
      ...category,
      nodes: category.nodes.filter(node =>
        node.display.toLowerCase().includes(query) ||
        node.name.toLowerCase().includes(query)
      )
    })).filter(category => category.nodes.length > 0)
  }

  return result
})

const totalNodes = computed(() =>
  nodeCategories.value.reduce((sum, cat) => sum + cat.nodes.length, 0)
)

const filteredNodesCount = computed(() =>
  filteredCategories.value.reduce((sum, cat) => sum + cat.nodes.length, 0)
)

function toggleCategory(categoryId: string): void {
  const category = nodeCategories.value.find(c => c.id === categoryId)
  if (category) {
    category.expanded = !category.expanded
  }
}
</script>

<template>
  <div class="flex h-full">
    <div class="flex-1 overflow-auto p-6">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-foreground">Nodes</h1>
          <p class="mt-1 text-sm text-muted-foreground">{{ totalNodes }} nodes available</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Icon name="puzzle-piece" size="xs" />
            Install Nodes
          </button>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="mb-6 flex items-center gap-3">
        <!-- Search -->
        <div class="relative flex-1">
          <Icon name="search" size="xs" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search nodes..."
            class="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-700 outline-none transition-colors placeholder:text-muted-foreground hover:border-zinc-300 focus:border-zinc-400 focus:ring-0 dark:border-border dark:bg-muted dark:text-foreground"
          />
        </div>

        <!-- Category Filter -->
        <div class="relative">
          <select
            v-model="filterCategory"
            class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground"
          >
            <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        </div>

        <!-- View Toggle -->
        <div class="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1 dark:border-border dark:bg-muted">
          <button
            :class="['rounded-md p-1.5 transition-colors', viewMode === 'grid' ? 'bg-zinc-100 text-zinc-900 dark:bg-background dark:text-foreground' : 'text-muted-foreground hover:text-zinc-600']"
            @click="viewMode = 'grid'"
          >
            <Icon name="th-large" size="xs" />
          </button>
          <button
            :class="['rounded-md p-1.5 transition-colors', viewMode === 'list' ? 'bg-zinc-100 text-zinc-900 dark:bg-background dark:text-foreground' : 'text-muted-foreground hover:text-zinc-600']"
            @click="viewMode = 'list'"
          >
            <Icon name="list" size="xs" />
          </button>
        </div>
      </div>

      <!-- Results count -->
      <p v-if="searchQuery || filterCategory !== 'all'" class="mb-4 text-sm text-muted-foreground">
        Showing {{ filteredNodesCount }} of {{ totalNodes }} nodes
      </p>

      <!-- Categories -->
      <div class="space-y-6">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="rounded-xl border border-zinc-200 bg-white dark:border-border dark:bg-card"
        >
          <!-- Category Header -->
          <button
            class="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
            @click="toggleCategory(category.id)"
          >
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-muted">
              <Icon :name="category.icon" size="sm" class="text-zinc-600 dark:text-foreground" />
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-zinc-900 dark:text-foreground">{{ category.label }}</h3>
              <p class="text-xs text-muted-foreground">{{ category.nodes.length }} nodes</p>
            </div>
            <Icon
              :name="category.expanded ? 'chevron-up' : 'chevron-down'"
              size="sm"
              class="text-muted-foreground"
            />
          </button>

          <!-- Nodes Grid/List -->
          <div v-if="category.expanded" class="border-t border-zinc-200 p-4 dark:border-border">
            <!-- Grid View -->
            <div
              v-if="viewMode === 'grid'"
              class="grid gap-3"
              style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));"
            >
              <div
                v-for="node in category.nodes"
                :key="node.name"
                class="group cursor-grab rounded-lg border border-zinc-200 bg-zinc-50 p-3 transition-all hover:border-zinc-300 hover:shadow-sm active:cursor-grabbing dark:border-border dark:bg-muted/50 dark:hover:border-muted-foreground/30"
                draggable="true"
              >
                <div class="flex items-start gap-2">
                  <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-200 dark:bg-muted">
                    <Icon :name="category.icon" size="xs" class="text-zinc-500 dark:text-muted-foreground" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-zinc-900 dark:text-foreground">{{ node.display }}</p>
                    <p class="truncate text-xs text-muted-foreground">{{ node.name }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- List View -->
            <div v-else class="divide-y divide-zinc-200 dark:divide-border">
              <div
                v-for="node in category.nodes"
                :key="node.name"
                class="flex cursor-grab items-center gap-3 py-2 transition-colors hover:bg-zinc-50 active:cursor-grabbing dark:hover:bg-muted/50"
                draggable="true"
              >
                <Icon :name="category.icon" size="xs" class="text-muted-foreground" />
                <span class="text-sm text-zinc-900 dark:text-foreground">{{ node.display }}</span>
                <span class="text-xs text-muted-foreground">{{ node.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredCategories.length === 0"
        class="flex flex-col items-center justify-center py-16"
      >
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-muted">
          <Icon name="puzzle-piece" size="xl" class="text-zinc-400" />
        </div>
        <h3 class="mt-4 text-lg font-medium text-zinc-900 dark:text-foreground">No nodes found</h3>
        <p class="mt-1 text-sm text-muted-foreground">Try different search terms or filters</p>
      </div>
    </div>
  </div>
</template>
