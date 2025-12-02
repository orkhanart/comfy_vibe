<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  WorkspaceViewHeader,
  WorkspaceSearchInput,
  WorkspaceViewToggle,
  WorkspaceSortSelect,
  TemplateCard,
} from '@/components/workspace'
import {
  MOCK_TEMPLATES,
  TEMPLATE_CATEGORIES,
  MODEL_FILTER_OPTIONS,
  USE_CASE_OPTIONS,
  RUNS_ON_OPTIONS,
  type Template,
} from '@/data/workspaceMockData'

const route = useRoute()
const router = useRouter()
const workspaceId = computed(() => route.params.workspaceId as string)

type ViewMode = 'grid' | 'list'

const searchQuery = ref('')
const viewMode = ref<ViewMode>('grid')
const sortBy = ref('newest')
const filterBy = ref('all')
const modelFilter = ref('all')
const useCaseFilter = ref('all')
const runsOnFilter = ref('all')

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'name', label: 'Name' },
]

const templates = ref<Template[]>([...MOCK_TEMPLATES])

const filteredTemplates = computed(() => {
  let result = [...templates.value]

  if (filterBy.value !== 'all') {
    result = result.filter(t => t.category === filterBy.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    )
  }

  if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'popular') {
    result.sort((a, b) => b.uses - a.uses)
  }

  return result
})

function openTemplate(templateId: string): void {
  router.push(`/nodemode/${workspaceId.value}/${templateId}`)
}
</script>

<template>
  <div class="p-6">
    <WorkspaceViewHeader
      title="Templates"
      :subtitle="`${templates.length} templates available`"
    />

    <!-- Search & Filters -->
    <div class="mb-3 flex flex-wrap items-center gap-3">
      <WorkspaceSearchInput
        v-model="searchQuery"
        placeholder="Search..."
      />

      <!-- Model Filter -->
      <div class="relative">
        <select
          v-model="modelFilter"
          class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:hover:border-zinc-600 dark:focus:border-zinc-500"
        >
          <option value="all">Model Filter</option>
          <option v-for="option in MODEL_FILTER_OPTIONS.slice(1)" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>

      <!-- Use Case Filter -->
      <div class="relative">
        <select
          v-model="useCaseFilter"
          class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:hover:border-zinc-600 dark:focus:border-zinc-500"
        >
          <option value="all">Use Case</option>
          <option v-for="option in USE_CASE_OPTIONS.slice(1)" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>

      <!-- Runs On Filter -->
      <div class="relative">
        <select
          v-model="runsOnFilter"
          class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:hover:border-zinc-600 dark:focus:border-zinc-500"
        >
          <option value="all">Runs on</option>
          <option v-for="option in RUNS_ON_OPTIONS.slice(1)" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>

      <div class="ml-auto flex items-center gap-2">
        <WorkspaceViewToggle v-model="viewMode" />
        <WorkspaceSortSelect v-model="sortBy" :options="sortOptions" />
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
      <button
        v-for="option in TEMPLATE_CATEGORIES"
        :key="option.value"
        :class="[
          'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
          filterBy === option.value
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
        ]"
        @click="filterBy = option.value"
      >
        {{ option.label }}
      </button>
    </div>

    <!-- Grid View -->
    <div
      v-if="viewMode === 'grid'"
      class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));"
    >
      <TemplateCard
        v-for="template in filteredTemplates"
        :key="template.id"
        :template="template"
        @open="openTemplate"
      />
    </div>

    <!-- List View -->
    <div v-else class="rounded-xl border border-zinc-200 bg-white dark:border-border dark:bg-card">
      <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
        <div
          v-for="template in filteredTemplates"
          :key="template.id"
          class="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
          @click="openTemplate(template.id)"
        >
          <div class="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
            <img :src="template.thumbnail" :alt="template.name" class="h-full w-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-zinc-900 dark:text-foreground">{{ template.name }}</p>
            <p class="mt-0.5 text-sm text-zinc-500 dark:text-muted-foreground line-clamp-1">{{ template.description }}</p>
          </div>
          <div class="flex shrink-0 items-center gap-1">
            <span
              v-for="tag in template.tags.slice(0, 2)"
              :key="tag"
              class="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {{ tag }}
            </span>
          </div>
          <button
            class="shrink-0 inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            <Icon name="play" size="xs" />
            Use
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredTemplates.length === 0" class="py-12 text-center">
      <Icon name="search" size="md" class="mb-4 text-4xl text-foreground dark:text-muted-foreground/50" />
      <p class="text-muted-foreground dark:text-muted-foreground">No templates found</p>
    </div>
  </div>
</template>
