<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, Grid3x3, List, Plus, Star } from 'lucide-vue-next'
import { Icon } from '@/components/ui/icon'
import ExtendedViewModal from './ExtendedViewModal.vue'
import {
  MOCK_MODELS,
  MODEL_TYPES,
  BASE_MODEL_TYPES,
  getModelIcon,
  getModelColor,
  getBaseModelColor,
  type Model,
} from '@/data/workspaceMockData'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

// View state
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const filterType = ref('all')
const filterBaseModel = ref('all')
const sortBy = ref('updated')
const showFavoritesOnly = ref(false)

const models = ref<Model[]>([...MOCK_MODELS])

const sortOptions = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'size', label: 'Size' },
  { value: 'type', label: 'Type' },
]

// Reset selection when modal opens
watch(() => props.visible, (visible) => {
  if (visible) {
    filterType.value = 'all'
    filterBaseModel.value = 'all'
    searchQuery.value = ''
    sortBy.value = 'updated'
    showFavoritesOnly.value = false
  }
}, { immediate: true })

const filteredModels = computed(() => {
  let result = models.value

  // Filter by favorites
  if (showFavoritesOnly.value) {
    result = result.filter(m => m.favorite)
  }

  // Filter by type
  if (filterType.value !== 'all') {
    result = result.filter(m => m.type === filterType.value)
  }

  // Filter by base model
  if (filterBaseModel.value !== 'all') {
    result = result.filter(m => m.baseModel === filterBaseModel.value)
  }

  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.triggerWords?.some(tw => tw.toLowerCase().includes(query))
    )
  }

  // Sort
  return [...result].sort((a, b) => {
    switch (sortBy.value) {
      case 'name': return a.name.localeCompare(b.name)
      case 'size': return b.sizeBytes - a.sizeBytes
      case 'type': return a.type.localeCompare(b.type)
      default: return b.updatedTimestamp - a.updatedTimestamp
    }
  })
})

const totalModels = computed(() => models.value.length)

const modelCounts = computed(() => {
  const counts: Record<string, number> = { all: models.value.length }
  MODEL_TYPES.forEach(type => {
    if (type !== 'all') {
      counts[type] = models.value.filter(m => m.type === type).length
    }
  })
  return counts
})

function getTypeLabel(type: string): string {
  if (type === 'all') return 'All Models'
  return type.charAt(0).toUpperCase() + type.slice(1) + 's'
}

function toggleFavorite(modelId: string): void {
  const model = models.value.find(m => m.id === modelId)
  if (model) model.favorite = !model.favorite
}

function handleModelDragStart(e: DragEvent, model: Model): void {
  if (e.dataTransfer) {
    const shortcut = {
      id: `shortcut-model-${model.id}`,
      type: 'model' as const,
      label: model.name,
      icon: getModelIcon(model.type),
      modelId: model.id,
      modelType: model.type,
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
    title="Models"
    @update:visible="emit('update:visible', $event)"
  >
    <!-- Sidebar -->
    <template #sidebar>
      <div class="flex h-full flex-col">
        <!-- Type Filter -->
        <div class="flex-1 p-2">
          <button
            v-for="type in MODEL_TYPES"
            :key="type"
            :class="[
              'flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm transition-colors',
              filterType === type
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
            @click="filterType = type"
          >
            <span class="truncate">{{ getTypeLabel(type) }}</span>
            <span class="ml-auto text-xs opacity-60">{{ modelCounts[type] }}</span>
          </button>
        </div>

        <!-- Footer -->
        <div class="border-t border-border p-2">
          <button class="flex w-full items-center justify-center gap-2 rounded border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Plus class="size-4" />
            Import Model
          </button>
        </div>
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
            placeholder="Search models..."
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

        <!-- Base Model Filter -->
        <div class="relative">
          <select
            v-model="filterBaseModel"
            class="h-8 appearance-none rounded border border-border bg-background py-1.5 pl-3 pr-8 text-sm outline-none transition-colors focus:border-ring"
          >
            <option v-for="baseModel in BASE_MODEL_TYPES" :key="baseModel" :value="baseModel">
              {{ baseModel === 'all' ? 'All Base Models' : baseModel }}
            </option>
          </select>
          <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>

        <!-- Favorites Toggle -->
        <button
          :class="[
            'flex h-8 w-8 items-center justify-center rounded border transition-colors',
            showFavoritesOnly
              ? 'border-amber-500 bg-amber-500/10 text-amber-500'
              : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
          ]"
          @click="showFavoritesOnly = !showFavoritesOnly"
        >
          <Star :class="['size-4', showFavoritesOnly && 'fill-current']" />
        </button>

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
          {{ getTypeLabel(filterType) }}
        </h2>
        <p class="text-xs text-muted-foreground">
          {{ filteredModels.length }} {{ filteredModels.length === 1 ? 'model' : 'models' }}
        </p>
      </div>

      <!-- Items Grid -->
      <div class="flex-1 overflow-y-auto px-4 pb-4">
        <div
          v-if="viewMode === 'grid' && filteredModels.length > 0"
          class="grid gap-3"
          style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));"
        >
          <div
            v-for="model in filteredModels"
            :key="model.id"
            class="group cursor-grab overflow-hidden rounded border border-border bg-card transition-colors hover:border-foreground/20"
            draggable="true"
            @dragstart="handleModelDragStart($event, model)"
          >
            <!-- Thumbnail -->
            <div class="relative aspect-[4/3] w-full bg-muted">
              <img
                v-if="model.thumbnail"
                :src="model.thumbnail"
                :alt="model.name"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full w-full items-center justify-center">
                <Icon :name="getModelIcon(model.type)" size="xl" class="text-muted-foreground/40" />
              </div>
              <!-- Favorite Button -->
              <button
                class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 transition-all hover:text-amber-500 group-hover:opacity-100"
                :class="model.favorite && 'opacity-100 text-amber-500'"
                @click.stop="toggleFavorite(model.id)"
              >
                <Star :class="['size-3.5', model.favorite && 'fill-current']" />
              </button>
              <!-- Base Model Badge -->
              <span :class="['absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-medium', getBaseModelColor(model.baseModel)]">
                {{ model.baseModel }}
              </span>
            </div>
            <!-- Info -->
            <div class="p-2">
              <p class="truncate text-sm text-foreground">{{ model.name }}</p>
              <div class="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span class="capitalize">{{ model.type }}</span>
                <span>{{ model.size }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else-if="viewMode === 'list' && filteredModels.length > 0" class="rounded border border-border">
          <div
            v-for="(model, index) in filteredModels"
            :key="model.id"
            :class="['flex cursor-grab items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted', index !== filteredModels.length - 1 && 'border-b border-border']"
            draggable="true"
            @dragstart="handleModelDragStart($event, model)"
          >
            <!-- Favorite -->
            <button
              class="text-muted-foreground transition-colors hover:text-amber-500"
              :class="model.favorite && 'text-amber-500'"
              @click.stop="toggleFavorite(model.id)"
            >
              <Star :class="['size-4', model.favorite && 'fill-current']" />
            </button>
            <div :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded', getModelColor(model.type)]">
              <Icon :name="getModelIcon(model.type)" size="sm" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm text-foreground">{{ model.name }}</p>
              <p class="text-xs text-muted-foreground">v{{ model.version }}</p>
            </div>
            <span :class="['rounded px-1.5 py-0.5 text-[10px] font-medium', getBaseModelColor(model.baseModel)]">
              {{ model.baseModel }}
            </span>
            <span :class="['rounded px-1.5 py-0.5 text-xs capitalize', getModelColor(model.type)]">
              {{ model.type }}
            </span>
            <span class="w-16 text-right text-xs text-muted-foreground">{{ model.size }}</span>
            <span class="w-20 text-right text-xs text-muted-foreground">{{ model.updatedAt }}</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredModels.length === 0" class="flex flex-col items-center justify-center py-12">
          <p class="text-sm text-muted-foreground">No models found</p>
        </div>
      </div>
    </div>
  </ExtendedViewModal>
</template>
