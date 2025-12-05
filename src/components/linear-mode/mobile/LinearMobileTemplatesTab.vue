<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'

interface Template {
  id: string
  name: string
  description: string
  thumbnail: string
  category: string
}

const searchQuery = ref('')

// Mock templates data
const templates = ref<Template[]>([
  {
    id: 'template-1',
    name: 'Portrait',
    description: 'Professional portrait generation',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    category: 'People',
  },
  {
    id: 'template-2',
    name: 'Landscape',
    description: 'Scenic nature landscapes',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    category: 'Nature',
  },
  {
    id: 'template-3',
    name: 'Anime',
    description: 'Anime style artwork',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop',
    category: 'Art',
  },
  {
    id: 'template-4',
    name: 'Product',
    description: 'Product photography style',
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&h=200&fit=crop',
    category: 'Commercial',
  },
  {
    id: 'template-5',
    name: 'Fantasy',
    description: 'Fantasy art and scenes',
    thumbnail: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=200&h=200&fit=crop',
    category: 'Art',
  },
  {
    id: 'template-6',
    name: 'Architecture',
    description: 'Building and interior design',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&h=200&fit=crop',
    category: 'Design',
  },
])

function handleTemplateClick(template: Template): void {
  console.log('Selected template:', template)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Search Bar -->
    <div class="border-b border-border bg-background p-3">
      <div class="relative">
        <Icon name="search" size="sm" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search templates..."
          class="h-9 w-full rounded-md border border-border bg-transparent pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </div>
    </div>

    <!-- Templates Grid -->
    <div class="flex-1 overflow-y-auto p-3">
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="template in templates"
          :key="template.id"
          class="overflow-hidden rounded-lg border border-border bg-card text-left transition-colors hover:border-primary"
          @click="handleTemplateClick(template)"
        >
          <div class="aspect-[4/3] overflow-hidden bg-muted">
            <img
              :src="template.thumbnail"
              :alt="template.name"
              class="h-full w-full object-cover"
            />
          </div>
          <div class="p-2">
            <p class="truncate text-sm font-medium text-foreground">{{ template.name }}</p>
            <p class="truncate text-xs text-muted-foreground">{{ template.description }}</p>
          </div>
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-if="templates.length === 0"
        class="flex flex-col items-center justify-center py-12 text-muted-foreground"
      >
        <Icon name="th-large" size="lg" class="mb-2" />
        <span class="text-sm">No templates yet</span>
      </div>
    </div>
  </div>
</template>
