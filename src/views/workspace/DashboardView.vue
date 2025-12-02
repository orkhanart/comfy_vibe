<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TemplateCard } from '@/components/workspace'
import type { Template } from '@/data/workspaceMockData'

const route = useRoute()
const router = useRouter()


const starterTemplates: Template[] = [
  { id: 'txt2img', name: 'Text to Image', description: 'Generate images from text prompts', thumbnail: '/assets/card_images/workflow_01.webp', category: 'image', tags: ['txt2img', 'basic'], uses: 5200, usesFormatted: '5.2k' },
  { id: 'img2img', name: 'Image to Image', description: 'Transform existing images', thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp', category: 'image', tags: ['img2img'], uses: 3800, usesFormatted: '3.8k' },
  { id: 'upscale', name: 'Upscale', description: '4x image upscaling workflow', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', category: 'image', tags: ['upscale'], uses: 2100, usesFormatted: '2.1k' },
  { id: 'inpaint', name: 'Inpainting', description: 'Edit parts of an image', thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', category: 'image', tags: ['inpaint'], uses: 1900, usesFormatted: '1.9k' },
  { id: 'controlnet', name: 'ControlNet', description: 'Guided image generation', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', category: 'controlnet', tags: ['controlnet'], uses: 4200, usesFormatted: '4.2k' },
  { id: 'video', name: 'Video Generation', description: 'Create videos from prompts', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', category: 'video', tags: ['video'], uses: 1500, usesFormatted: '1.5k' }
]
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-foreground">
        Welcome back
      </h1>
      <p class="mt-1 text-sm text-muted-foreground">
        In Comfy sky is the limit. You are the node, bitch!
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="mb-6 flex flex-wrap gap-2">
      <button
        class="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent"
        @click="router.push('/node')"
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
      <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
        <TemplateCard
          v-for="template in starterTemplates"
          :key="template.id"
          :template="template"
          @open="router.push('/node')"
        />
      </div>
      <!-- View All Templates CTA -->
      <div class="mt-6 flex items-center gap-4 pt-2">
        <button
          class="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent"
          @click="router.push('/workspace/templates')"
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
