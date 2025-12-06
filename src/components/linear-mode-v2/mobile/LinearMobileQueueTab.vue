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
    parameters: { steps: 30, cfg: 7.5, width: 1024, height: 1024, seed: 42891723 },
  },
  {
    id: 'gen-2',
    type: 'video',
    prompt: 'A timelapse of clouds moving over mountains',
    workflow: 'Text to Video',
    status: 'completed',
    createdAt: new Date(Date.now() - 180000),
    outputs: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=288&fit=crop'],
    batchSize: 1,
    duration: 4,
    parameters: { steps: 50, cfg: 7, width: 1280, height: 720, seed: 55512345, frames: 120, fps: 30 },
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
    parameters: { steps: 25, cfg: 8, width: 1024, height: 768, seed: 18273645 },
  },
])

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'now'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

function getTypeIcon(type: GenerationType): string {
  return type === 'image' ? 'image' : type === 'video' ? 'video' : 'cube'
}

function handleDelete(id: string): void {
  generations.value = generations.value.filter(g => g.id !== id)
}

const mediaViewerVisible = ref(false)
const selectedMedia = ref<{ gen: GenerationItem; index: number } | null>(null)

function openMediaViewer(gen: GenerationItem, index: number = 0): void {
  selectedMedia.value = { gen, index }
  mediaViewerVisible.value = true
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="space-y-2 p-3">
      <!-- Generation Cards -->
      <div
        v-for="gen in generations"
        :key="gen.id"
        class="overflow-hidden rounded-lg border border-border bg-card"
      >
        <!-- Generating State -->
        <template v-if="gen.status === 'generating'">
          <div class="flex aspect-[2/1] items-center justify-center bg-muted/50">
            <div class="text-center">
              <Icon name="spinner" size="lg" class="animate-spin text-primary" />
              <div class="mt-2 text-lg font-medium">{{ gen.progress }}%</div>
            </div>
          </div>
          <div class="h-1 bg-muted">
            <div class="h-full bg-primary transition-all" :style="{ width: `${gen.progress}%` }" />
          </div>
        </template>

        <!-- Image Grid -->
        <div
          v-else-if="gen.type === 'image' && gen.outputs.length > 0"
          class="grid gap-0.5"
          :class="gen.outputs.length > 1 ? 'grid-cols-2' : 'grid-cols-1'"
        >
          <div
            v-for="(img, idx) in gen.outputs"
            :key="idx"
            class="aspect-square cursor-pointer overflow-hidden bg-muted"
            @click="openMediaViewer(gen, idx)"
          >
            <img :src="img" alt="" class="h-full w-full object-cover" />
          </div>
        </div>

        <!-- Video Preview -->
        <div
          v-else-if="gen.type === 'video' && gen.outputs.length > 0"
          class="relative aspect-video cursor-pointer overflow-hidden bg-muted"
          @click="openMediaViewer(gen, 0)"
        >
          <img :src="gen.outputs[0]" alt="" class="h-full w-full object-cover" />
          <div class="absolute inset-0 flex items-center justify-center bg-black/20">
            <div class="flex size-10 items-center justify-center rounded-full bg-white/90 text-black">
              <Icon name="play" size="sm" />
            </div>
          </div>
        </div>

        <!-- Info Footer -->
        <div class="flex items-center gap-2 p-2.5">
          <Icon :name="getTypeIcon(gen.type)" size="xs" class="text-muted-foreground" />
          <p class="flex-1 truncate text-xs text-muted-foreground">{{ gen.prompt }}</p>
          <span class="text-[10px] text-muted-foreground/60">{{ formatTime(gen.createdAt) }}</span>
          <button
            class="flex size-6 items-center justify-center rounded text-muted-foreground hover:text-destructive"
            @click="handleDelete(gen.id)"
          >
            <Icon name="trash" size="xs" />
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="generations.length === 0"
        class="flex flex-col items-center justify-center py-16 text-muted-foreground"
      >
        <Icon name="images" size="xl" class="mb-3 opacity-50" />
        <p class="text-sm">No generations yet</p>
        <p class="text-xs opacity-60">Run a workflow to see results here</p>
      </div>
    </div>

    <LinearMediaViewerModal
      v-model:visible="mediaViewerVisible"
      :media="selectedMedia?.gen ?? null"
      :initial-index="selectedMedia?.index ?? 0"
    />
  </div>
</template>
