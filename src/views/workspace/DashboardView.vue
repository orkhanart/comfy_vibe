<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { WorkspaceCard } from '@/components/workspace'

const route = useRoute()
const router = useRouter()

const workspaceId = computed(() => route.params.workspaceId as string)
const isTeam = computed(() => workspaceId.value === 'team')

const starterTemplates = [
  { id: 'txt2img', name: 'Text to Image', description: 'Generate images from text prompts', icon: 'image', thumbnail: '/assets/card_images/workflow_01.webp' },
  { id: 'img2img', name: 'Image to Image', description: 'Transform existing images', icon: 'images', thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp' },
  { id: 'upscale', name: 'Upscale', description: '4x image upscaling workflow', icon: 'expand', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp' },
  { id: 'inpaint', name: 'Inpainting', description: 'Edit parts of an image', icon: 'pencil', thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp' },
  { id: 'controlnet', name: 'ControlNet', description: 'Guided image generation', icon: 'sliders-h', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp' },
  { id: 'video', name: 'Video Generation', description: 'Create videos from prompts', icon: 'video', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp' }
]
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-foreground">
        Welcome back, {{ workspaceId }}
      </h1>
      <p class="mt-1 text-sm text-muted-foreground">
        In Comfy sky is the limit. You are the node, bitch!
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="mb-6 flex flex-wrap gap-2">
      <button
        class="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent"
        @click="router.push(`/nodemode/${workspaceId}/untitled`)"
      >
        <Icon name="plus" size="xs" />
        Create New Workflow
      </button>
      <button
        class="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent"
      >
        <Icon name="file-import" size="xs" />
        Import Workflow
      </button>
    </div>

    <!-- Starter Templates -->
    <div class="mb-8">
      <h2 class="mb-3 text-sm font-medium text-zinc-900 dark:text-foreground">Start from a template</h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <WorkspaceCard
          v-for="template in starterTemplates"
          :key="template.id"
          :thumbnail="template.thumbnail"
          :title="template.name"
          :description="template.description"
          :icon="template.icon"
          @open="router.push(`/nodemode/${workspaceId}/${template.id}`)"
        />
      </div>
      <!-- View All Templates CTA -->
      <div class="mt-6 flex items-center gap-4 pt-2">
        <button
          class="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent"
          @click="router.push(`/${workspaceId}/templates`)"
        >
          View Templates
          <Icon name="arrow-right" size="xs" />
        </button>
        <span class="text-sm text-muted-foreground dark:text-muted-foreground">
          <span class="font-semibold text-muted-foreground/50 dark:text-foreground">803+</span> workflows, models, nodes by Comfy & community
        </span>
        <div class="h-px flex-1 bg-zinc-200 dark:bg-muted" />
      </div>
    </div>

  </div>
</template>
