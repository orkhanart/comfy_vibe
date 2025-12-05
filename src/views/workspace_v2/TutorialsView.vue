<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@/components/ui/icon'
import { PageBreadcrumb } from '@/components/workspace'

interface Tutorial {
  id: string
  name: string
  category: string
  thumbnail: string
}

// View state
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const activeCategory = ref<string>('all')

const categories = [
  { id: 'all', label: 'All' },
  { id: 'basic', label: 'Basic' },
  { id: 'controlnet', label: 'ControlNet' },
  { id: 'flux', label: 'Flux' },
  { id: 'image', label: 'Image' },
  { id: '3d', label: '3D' },
  { id: 'video', label: 'Video' },
  { id: 'audio', label: 'Audio' },
]

const tutorials = ref<Tutorial[]>([
  // Basic
  { id: 'text-to-image', name: 'Text to Image', category: 'basic', thumbnail: '/assets/card_images/workflow_01.webp' },
  { id: 'image-to-image', name: 'Image to Image', category: 'basic', thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp' },
  { id: 'inpaint', name: 'Inpaint', category: 'basic', thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp' },
  { id: 'outpaint', name: 'Outpaint', category: 'basic', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp' },
  { id: 'upscale', name: 'Upscale', category: 'basic', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp' },
  { id: 'lora', name: 'LoRA', category: 'basic', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp' },
  { id: 'multiple-loras', name: 'Multiple LoRAs', category: 'basic', thumbnail: '/assets/card_images/workflow_01.webp' },
  // ControlNet
  { id: 'controlnet', name: 'ControlNet', category: 'controlnet', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp' },
  { id: 'pose-controlnet', name: 'Pose ControlNet', category: 'controlnet', thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp' },
  { id: 'depth-controlnet', name: 'Depth ControlNet', category: 'controlnet', thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp' },
  { id: 'depth-t2i-adapter', name: 'Depth T2I Adapter', category: 'controlnet', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp' },
  { id: 'mixing-controlnet', name: 'Mixing ControlNet', category: 'controlnet', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp' },
  // Flux
  { id: 'flux-dev', name: 'Flux.2 Dev', category: 'flux', thumbnail: '/assets/card_images/workflow_01.webp' },
  { id: 'flux-krea-dev', name: 'Flux.1 Krea Dev', category: 'flux', thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp' },
  { id: 'flux-kontext-dev', name: 'Flux.1 Kontext Dev', category: 'flux', thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp' },
  { id: 'flux-text-to-image', name: 'Flux.1 Text-to-Image', category: 'flux', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp' },
  { id: 'bytedance-uso', name: 'ByteDance USO', category: 'flux', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp' },
  { id: 'flux-fill-dev', name: 'Flux.1 fill dev', category: 'flux', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp' },
  { id: 'flux-controlnet', name: 'Flux.1 ControlNet', category: 'flux', thumbnail: '/assets/card_images/workflow_01.webp' },
  // Image
  { id: 'qwen', name: 'Qwen', category: 'image', thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp' },
  { id: 'hidream', name: 'HiDream', category: 'image', thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp' },
  { id: 'z-image', name: 'Z-Image', category: 'image', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp' },
  { id: 'ovis', name: 'Ovis', category: 'image', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp' },
  { id: 'cosmos-predict2', name: 'Cosmos-Predict2', category: 'image', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp' },
  { id: 'omnigen2', name: 'OmniGen2', category: 'image', thumbnail: '/assets/card_images/workflow_01.webp' },
  // 3D
  { id: 'hunyuan3d-2', name: 'Hunyuan3D-2', category: '3d', thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp' },
  // Video
  { id: 'ltx-video', name: 'LTX-Video', category: 'video', thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp' },
  { id: 'wan-video', name: 'Wan Video', category: 'video', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp' },
  { id: 'hunyuan-video', name: 'Hunyuan', category: 'video', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp' },
  { id: 'cosmos-video', name: 'Cosmos', category: 'video', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp' },
  // Audio
  { id: 'ace-step', name: 'ACE-Step Music Generation', category: 'audio', thumbnail: '/assets/card_images/workflow_01.webp' },
])

const filteredTutorials = computed(() => {
  let items = tutorials.value

  if (activeCategory.value !== 'all') {
    items = items.filter(t => t.category === activeCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(t => t.name.toLowerCase().includes(query))
  }

  return items
})

function getCategoryLabel(category: string): string {
  const cat = categories.find(c => c.id === category)
  return cat?.label || category
}

function openTutorial(tutorial: Tutorial): void {
  window.open(`https://docs.comfy.org/tutorials`, '_blank')
}
</script>

<template>
  <div class="h-full overflow-y-auto p-4">
    <!-- Header with Breadcrumb -->
    <div class="mb-4 flex min-h-[30px] items-center justify-between">
      <PageBreadcrumb label="Tutorials" icon="book" />
    </div>

    <!-- Search Row -->
    <div class="mb-4 flex items-center gap-2">
      <!-- Search -->
      <div class="relative flex-1">
        <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tutorials..."
          class="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:placeholder-zinc-500"
        />
      </div>

      <!-- View Toggle -->
      <div class="flex h-9 rounded-lg border border-border">
        <button
          :class="['flex items-center justify-center w-9 transition-colors rounded-l-lg', viewMode === 'grid' ? 'bg-button-active-surface text-button-active-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-button-hover-surface']"
          @click="viewMode = 'grid'"
        >
          <Icon name="th-large" size="sm" />
        </button>
        <button
          :class="['flex items-center justify-center w-9 transition-colors rounded-r-lg', viewMode === 'list' ? 'bg-button-active-surface text-button-active-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-button-hover-surface']"
          @click="viewMode = 'list'"
        >
          <Icon name="list" size="sm" />
        </button>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="mb-6 flex gap-1.5">
      <button
        v-for="cat in categories"
        :key="cat.id"
        :class="[
          'rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
          activeCategory === cat.id
            ? 'bg-button-active-surface text-button-active-foreground'
            : 'bg-button-surface text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
        ]"
        @click="activeCategory = cat.id"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Tutorials Grid -->
    <div v-if="filteredTutorials.length > 0" class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
      <div
        v-for="tutorial in filteredTutorials"
        :key="tutorial.id"
        class="group cursor-pointer"
        @click="openTutorial(tutorial)"
      >
        <!-- Thumbnail -->
        <div class="relative aspect-video overflow-hidden rounded-lg bg-zinc-100 transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-lg dark:bg-zinc-800">
          <img
            :src="tutorial.thumbnail"
            :alt="tutorial.name"
            class="h-full w-full object-cover"
          />
          <!-- Overlay -->
          <div class="absolute inset-0 flex items-end p-2">
            <span class="rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              {{ getCategoryLabel(tutorial.category) }}
            </span>
          </div>
        </div>
        <!-- Title -->
        <div class="mt-2">
          <h3 class="truncate text-sm font-medium text-zinc-900 dark:text-foreground">{{ tutorial.name }}</h3>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700"
    >
      <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <Icon name="book" size="lg" class="text-zinc-400 dark:text-zinc-500" />
      </div>
      <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">No tutorials found</p>
      <p class="mt-1 text-xs text-muted-foreground">Try a different search or category</p>
    </div>
  </div>
</template>
