<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  TemplateCard,
  PageBreadcrumb,
} from '@/components/workspace'
import {
  MOCK_TEMPLATES,
  type Template,
} from '@/data/workspaceMockData'

const router = useRouter()

const searchQuery = ref('')
const activeCategory = ref('all')
const sortBy = ref('popular')

const viewMode = ref<'grid' | 'list'>('grid')

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'name', label: 'Name' },
]

// Filter states
const modelFilter = ref('all')
const useCaseFilter = ref('all')
const runsOnFilter = ref('all')

// Filter options
const modelFilterOptions = [
  { value: 'all', label: 'Model Filter' },
  { value: 'flux', label: 'Flux' },
  { value: 'sdxl', label: 'SDXL' },
  { value: 'sd15', label: 'SD 1.5' },
  { value: 'wan', label: 'Wan' },
  { value: 'hunyuan', label: 'Hunyuan' },
]

const useCaseOptions = [
  { value: 'all', label: 'Use Case' },
  { value: 'text-to-image', label: 'Text to Image' },
  { value: 'image-to-image', label: 'Image to Image' },
  { value: 'text-to-video', label: 'Text to Video' },
  { value: 'image-to-video', label: 'Image to Video' },
  { value: 'upscale', label: 'Upscale' },
  { value: 'inpaint', label: 'Inpaint' },
]

const runsOnOptions = [
  { value: 'all', label: 'Runs on' },
  { value: 'local', label: 'Local' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'api', label: 'API' },
]

// Category tabs
const categoryTabs = [
  { value: 'all', label: 'All Templates' },
  { value: 'getting-started', label: 'Getting Started' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: '3d', label: '3D' },
  { value: 'audio', label: 'Audio' },
]

const templates = ref<Template[]>([...MOCK_TEMPLATES])

function toggleFavorite(templateId: string) {
  const template = templates.value.find(t => t.id === templateId)
  if (template) {
    template.favorite = !template.favorite
  }
}

// Sort templates helper
function sortTemplates(templateList: Template[]): Template[] {
  return [...templateList].sort((a, b) => {
    switch (sortBy.value) {
      case 'popular': return b.uses - a.uses
      case 'newest': return b.id.localeCompare(a.id) // Using id as proxy for date
      case 'name': return a.name.localeCompare(b.name)
      default: return 0
    }
  })
}

// Main displayed templates - filtered by search, category, and other filters
const displayedTemplates = computed(() => {
  let result = [...templates.value]

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    )
  }

  // Filter by category
  if (activeCategory.value !== 'all') {
    result = result.filter(t => t.category === activeCategory.value)
  }

  // TODO: Filter by modelFilter, useCaseFilter, runsOnFilter when data supports it

  return sortTemplates(result)
})

function openTemplate(templateId: string): void {
  router.push('/node')
}
</script>

<template>
  <div class="h-full overflow-y-auto p-4">
    <!-- Header with Breadcrumb -->
    <div class="mb-4 flex min-h-[30px] items-center justify-between">
      <PageBreadcrumb label="Templates" icon="th-large" />
    </div>

    <!-- Search and Filters Row -->
    <div class="mb-4 flex items-center gap-2">
      <!-- Search -->
      <div class="relative flex-1">
        <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:placeholder-zinc-500"
        />
      </div>

      <!-- Model Filter -->
      <div class="relative">
        <select
          v-model="modelFilter"
          class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground"
        >
          <option v-for="option in modelFilterOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>

      <!-- Use Case Filter -->
      <div class="relative">
        <select
          v-model="useCaseFilter"
          class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground"
        >
          <option v-for="option in useCaseOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>

      <!-- Runs On Filter -->
      <div class="relative">
        <select
          v-model="runsOnFilter"
          class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground"
        >
          <option v-for="option in runsOnOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>

      <!-- Sort -->
      <div class="relative">
        <Icon name="sort-amount-down" size="sm" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <select
          v-model="sortBy"
          class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-8 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground"
        >
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="mb-6 flex gap-1.5">
      <button
        v-for="tab in categoryTabs"
        :key="tab.value"
        :class="[
          'rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
          activeCategory === tab.value
            ? 'bg-button-active-surface text-button-active-foreground'
            : 'bg-button-surface text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
        ]"
        @click="activeCategory = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Section Title -->
    <h2 class="mb-4 text-lg font-semibold text-zinc-900 dark:text-foreground">
      {{ categoryTabs.find(t => t.value === activeCategory)?.label || 'All Templates' }}
    </h2>

    <!-- Templates Grid -->
    <div
      v-if="displayedTemplates.length > 0"
      class="grid grid-cols-4 gap-4"
    >
      <TemplateCard
        v-for="template in displayedTemplates"
        :key="template.id"
        :template="template"
        @open="openTemplate"
        @toggle-favorite="toggleFavorite"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="py-12 text-center">
      <Icon name="th-large" size="lg" class="mb-3 text-zinc-300 dark:text-zinc-600" />
      <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">No templates found</p>
      <p class="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
    </div>
  </div>
</template>
