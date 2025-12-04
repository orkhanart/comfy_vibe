<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'
import { SidebarTreeCategory } from '@/components/common/sidebar'
import { TEMPLATE_CATEGORIES_DATA, type TemplateCategory } from '@/data/sidebarMockData'

// Placeholder thumbnails for templates
const templateThumbnails: Record<string, string> = {
  'txt2img-basic': '/assets/card_images/workflow_01.webp',
  'img2img-basic': '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp',
  'inpainting': '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp',
  'upscaling': '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp',
  'sdxl-txt2img': '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp',
  'sdxl-refiner': '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp',
  'sdxl-lightning': '/assets/card_images/workflow_01.webp',
  'cn-canny': '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp',
  'cn-depth': '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp',
  'cn-pose': '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp',
}

function getThumbnail(name: string): string {
  return templateThumbnails[name] || '/assets/card_images/workflow_01.webp'
}

defineProps<{
  viewMode: 'list' | 'grid'
}>()

const templateCategories = ref<TemplateCategory[]>(
  TEMPLATE_CATEGORIES_DATA.map(c => ({ ...c }))
)

function toggleCategory(categoryId: string): void {
  const category = templateCategories.value.find(c => c.id === categoryId)
  if (category) {
    category.expanded = !category.expanded
  }
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex-1 overflow-y-auto p-2">
      <!-- List View -->
      <div v-if="viewMode === 'list'" class="space-y-0.5">
        <div
          v-for="category in templateCategories"
          :key="category.id"
          class="select-none"
        >
          <SidebarTreeCategory
            :icon="category.icon"
            :label="category.label"
            :count="category.templates.length"
            :expanded="category.expanded"
            @toggle="toggleCategory(category.id)"
          />

          <div
            v-if="category.expanded"
            class="ml-4 space-y-0.5 border-l border-border pl-2"
          >
            <div
              v-for="template in category.templates"
              :key="template.name"
              class="group flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-muted"
              draggable="true"
            >
              <Icon name="clone" size="xs" class="text-muted-foreground/50 group-hover:text-muted-foreground" />
              <div class="min-w-0 flex-1">
                <div class="truncate text-xs text-muted-foreground group-hover:text-foreground">
                  {{ template.display }}
                </div>
                <div class="truncate text-[10px] text-muted-foreground/50">{{ template.description }}</div>
              </div>
              <span class="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground/50">
                {{ template.nodes }}
              </span>
              <Icon name="plus" size="xs" class="text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else class="space-y-3">
        <div
          v-for="category in templateCategories"
          :key="category.id"
        >
          <!-- Category Header -->
          <div class="mb-1.5 flex items-center gap-1.5 px-1">
            <Icon :name="category.icon" size="xs" class="text-muted-foreground" />
            <span class="text-[10px] font-medium text-muted-foreground">{{ category.label }}</span>
            <span class="text-[10px] text-muted-foreground/50">({{ category.templates.length }})</span>
          </div>
          <!-- Templates Grid -->
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="template in category.templates"
              :key="template.name"
              class="group cursor-pointer"
              draggable="true"
            >
              <!-- Thumbnail -->
              <div class="relative aspect-square overflow-hidden rounded-lg bg-muted transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-lg">
                <img
                  :src="getThumbnail(template.name)"
                  :alt="template.display"
                  class="h-full w-full object-cover"
                />
                <!-- Overlay -->
                <div class="absolute inset-0 flex flex-col justify-between p-1.5">
                  <!-- Top - nodes badge -->
                  <div class="flex justify-end">
                    <span class="rounded bg-zinc-900/70 px-1 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
                      {{ template.nodes }} nodes
                    </span>
                  </div>
                  <!-- Bottom - Add button on hover -->
                  <div class="flex justify-end">
                    <button
                      v-tooltip.left="{ value: 'Use Template', showDelay: 50 }"
                      class="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white opacity-0 transition-all hover:bg-blue-500 group-hover:opacity-100"
                    >
                      <Icon name="plus" size="xs" />
                    </button>
                  </div>
                </div>
              </div>
              <!-- Name & Description -->
              <div class="mt-1.5 px-0.5">
                <h3 class="truncate text-xs font-medium text-foreground">{{ template.display }}</h3>
                <p class="truncate text-[10px] text-muted-foreground">{{ template.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
