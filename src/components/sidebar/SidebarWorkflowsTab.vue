<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { WORKFLOWS_DATA } from '@/data/sidebarMockData'

defineProps<{
  viewMode: 'list' | 'grid'
}>()

const mockWorkflows = WORKFLOWS_DATA
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="workflow in mockWorkflows"
      :key="workflow.name"
      class="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-border hover:bg-muted/50"
    >
      <!-- Thumbnail (16:9) -->
      <div class="relative aspect-video bg-background">
        <div
          class="absolute inset-0 flex items-center justify-center"
          :class="{
            'bg-gradient-to-br from-blue-900/30 to-purple-900/30': workflow.thumbnail === 'txt2img',
            'bg-gradient-to-br from-green-900/30 to-teal-900/30': workflow.thumbnail === 'img2img',
            'bg-gradient-to-br from-orange-900/30 to-red-900/30': workflow.thumbnail === 'controlnet',
            'bg-gradient-to-br from-violet-900/30 to-pink-900/30': workflow.thumbnail === 'sdxl',
            'bg-gradient-to-br from-cyan-900/30 to-blue-900/30': workflow.thumbnail === 'inpaint',
          }"
        >
          <Icon name="sitemap" size="2xl" class="text-muted-foreground" />
        </div>
        <button
          v-tooltip.left="{ value: 'Share', showDelay: 50 }"
          class="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded bg-muted/90 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Icon name="share-alt" size="xs" />
        </button>
        <div class="absolute bottom-1.5 left-1.5 rounded bg-card/80 px-1.5 py-0.5 text-[10px] text-muted-foreground">
          {{ workflow.nodes }} nodes
        </div>
      </div>
      <!-- Info -->
      <div class="flex items-center justify-between px-2.5 py-2">
        <div class="min-w-0 flex-1">
          <div class="truncate text-xs font-medium text-foreground">{{ workflow.name }}</div>
          <div class="mt-0.5 text-[10px] text-muted-foreground">{{ workflow.date }}</div>
        </div>
        <button
          v-tooltip.left="{ value: 'Add to Canvas', showDelay: 50 }"
          class="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-600 text-white transition-all hover:bg-blue-500"
        >
          <Icon name="plus" size="xs" />
        </button>
      </div>
    </div>
  </div>
</template>
