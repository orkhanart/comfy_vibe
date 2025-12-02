<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'
import { SidebarTreeCategory, SidebarGridCard } from '@/components/common/sidebar'
import { MODEL_CATEGORIES_DATA, type ModelCategory } from '@/data/sidebarMockData'

defineProps<{
  viewMode: 'list' | 'grid'
}>()

const modelCategories = ref<ModelCategory[]>(
  MODEL_CATEGORIES_DATA.map(c => ({ ...c }))
)

function toggleCategory(categoryId: string): void {
  const category = modelCategories.value.find(c => c.id === categoryId)
  if (category) {
    category.expanded = !category.expanded
  }
}
</script>

<template>
  <!-- List View -->
  <div v-if="viewMode === 'list'" class="space-y-0.5">
    <div
      v-for="category in modelCategories"
      :key="category.id"
      class="select-none"
    >
      <SidebarTreeCategory
        :icon="category.icon"
        :label="category.label"
        :count="category.models.length"
        :expanded="category.expanded"
        @toggle="toggleCategory(category.id)"
      />

      <div
        v-if="category.expanded"
        class="ml-4 space-y-0.5 border-l border-border pl-2"
      >
        <div
          v-for="model in category.models"
          :key="model.name"
          class="group flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-muted"
          draggable="true"
        >
          <Icon name="file" size="xs" class="text-muted-foreground/50 group-hover:text-muted-foreground" />
          <div class="min-w-0 flex-1">
            <div class="truncate text-xs text-muted-foreground group-hover:text-foreground">
              {{ model.display }}
            </div>
            <div class="text-[10px] text-muted-foreground/50">{{ model.size }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Grid View -->
  <div v-else class="grid grid-cols-2 gap-1.5">
    <template v-for="category in modelCategories" :key="category.id">
      <SidebarGridCard
        v-for="model in category.models"
        :key="model.name"
        :title="model.display"
        :subtitle="category.label"
        :draggable="true"
      >
        <template #header-left>
          <Icon :name="category.icon" size="xs" />
        </template>
        <template #header-right>
          <span class="rounded bg-muted px-1 py-0.5 text-[9px] text-muted-foreground/50">
            {{ model.size }}
          </span>
        </template>
      </SidebarGridCard>
    </template>
  </div>
</template>
