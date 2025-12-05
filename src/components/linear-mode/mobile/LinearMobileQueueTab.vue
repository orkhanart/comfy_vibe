<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import LinearMediaViewerModal from '../LinearMediaViewerModal.vue'
import { ref } from 'vue'

type GenerationType = 'image' | 'video' | '3d'

interface GenerationItem {
  id: string
  type: GenerationType
  prompt: string
  workflow: string
  status: 'completed' | 'generating' | 'queued'
  progress?: number
  createdAt: Date
  outputs: string[]
  batchSize: number
  duration?: number
  parameters: {
    steps: number
    cfg: number
    width: number
    height: number
    seed: number
    frames?: number
    fps?: number
  }
}

// Mock generation data
const generations = ref<GenerationItem[]>([
  {
    id: 'gen-1',
    type: 'image',
    prompt: 'A serene mountain landscape at sunset with golden light',
    workflow: 'Text to Image',
    status: 'generating',
    progress: 65,
    createdAt: new Date(),
    outputs: [],
    batchSize: 4,
    parameters: {
      steps: 30,
      cfg: 7.5,
      width: 1024,
      height: 1024,
      seed: 42891723,
    },
  },
  {
    id: 'gen-2',
    type: 'video',
    prompt: 'A timelapse of clouds moving over mountains',
    workflow: 'Text to Video',
    status: 'completed',
    createdAt: new Date(Date.now() - 180000),
    outputs: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=288&fit=crop',
    ],
    batchSize: 1,
    duration: 4,
    parameters: {
      steps: 50,
      cfg: 7,
      width: 1280,
      height: 720,
      seed: 55512345,
      frames: 120,
      fps: 30,
    },
  },
  {
    id: 'gen-3',
    type: 'image',
    prompt: 'Futuristic cyberpunk city street at night with neon lights',
    workflow: 'Text to Image',
    status: 'completed',
    createdAt: new Date(Date.now() - 300000),
    outputs: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=512&h=512&fit=crop',
    ],
    batchSize: 2,
    parameters: {
      steps: 25,
      cfg: 8,
      width: 1024,
      height: 768,
      seed: 18273645,
    },
  },
])

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function getStatusColor(status: GenerationItem['status']): string {
  switch (status) {
    case 'generating':
      return 'bg-blue-500'
    case 'queued':
      return 'bg-amber-500'
    case 'completed':
      return 'bg-emerald-500'
  }
}

function getTypeIcon(type: GenerationType): string {
  switch (type) {
    case 'image':
      return 'image'
    case 'video':
      return 'video'
    case '3d':
      return 'cube'
  }
}

function getTypeColor(type: GenerationType): string {
  switch (type) {
    case 'image':
      return 'text-purple-400'
    case 'video':
      return 'text-blue-400'
    case '3d':
      return 'text-amber-400'
  }
}

function handleDelete(id: string): void {
  generations.value = generations.value.filter(g => g.id !== id)
}

// Media Viewer Modal
const mediaViewerVisible = ref(false)
const selectedMedia = ref<{ gen: GenerationItem; index: number } | null>(null)

function openMediaViewer(gen: GenerationItem, index: number = 0): void {
  selectedMedia.value = { gen, index }
  mediaViewerVisible.value = true
}
</script>

<template>
  <div class="flex h-full flex-col overflow-y-auto bg-muted/30">
    <!-- Generations List -->
    <div class="flex flex-col divide-y divide-border">
      <div
        v-for="gen in generations"
        :key="gen.id"
        class="bg-background p-3"
      >
        <!-- Top Row: Type, Status, Time -->
        <div class="mb-2 flex items-center gap-1.5 text-[11px]">
          <Icon :name="getTypeIcon(gen.type)" size="xs" :class="getTypeColor(gen.type)" />
          <span
            :class="[
              'h-1.5 w-1.5 rounded-full',
              getStatusColor(gen.status),
              gen.status === 'generating' && 'animate-pulse'
            ]"
          />
          <span class="text-muted-foreground">{{ formatTime(gen.createdAt) }}</span>
          <button
            class="ml-auto flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-destructive"
            @click="handleDelete(gen.id)"
          >
            <Icon name="trash" size="xs" />
          </button>
        </div>

        <!-- Image Grid -->
        <div
          v-if="gen.type === 'image' && gen.outputs.length > 0"
          class="mb-2 grid grid-cols-2 gap-1.5"
        >
          <div
            v-for="(img, idx) in gen.outputs"
            :key="idx"
            class="aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted"
            @click="openMediaViewer(gen, idx)"
          >
            <img
              :src="img"
              alt="Generated image"
              class="h-full w-full object-cover"
            />
          </div>
        </div>

        <!-- Video Preview -->
        <div
          v-else-if="gen.type === 'video' && gen.outputs.length > 0"
          class="relative mb-2 aspect-video cursor-pointer overflow-hidden rounded-lg bg-muted"
          @click="openMediaViewer(gen, 0)"
        >
          <img
            :src="gen.outputs[0]"
            alt="Video thumbnail"
            class="h-full w-full object-cover"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white">
              <Icon name="play" size="sm" />
            </div>
          </div>
        </div>

        <!-- Generating Placeholder -->
        <div
          v-else-if="gen.status === 'generating'"
          class="mb-2 flex aspect-square items-center justify-center rounded-lg bg-muted"
        >
          <div class="flex flex-col items-center">
            <Icon name="spinner" size="lg" class="animate-spin text-primary" />
            <span class="mt-2 text-sm text-muted-foreground">{{ gen.progress }}%</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div v-if="gen.status === 'generating'" class="mb-2">
          <div class="h-1 overflow-hidden rounded-full bg-muted">
            <div
              class="h-full rounded-full bg-primary transition-all duration-300"
              :style="{ width: `${gen.progress}%` }"
            />
          </div>
        </div>

        <!-- Prompt -->
        <p class="line-clamp-2 text-xs text-muted-foreground">
          {{ gen.prompt }}
        </p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="generations.length === 0"
      class="flex flex-1 flex-col items-center justify-center py-12 text-muted-foreground"
    >
      <Icon name="images" size="lg" class="mb-2" />
      <span class="text-sm">No outputs yet</span>
      <p class="mt-1 text-center text-xs">
        Run a workflow to see outputs here
      </p>
    </div>

    <!-- Media Viewer Modal -->
    <LinearMediaViewerModal
      v-model:visible="mediaViewerVisible"
      :media="selectedMedia?.gen ?? null"
      :initial-index="selectedMedia?.index ?? 0"
    />
  </div>
</template>
