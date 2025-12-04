<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import LinearMediaViewerModal from './LinearMediaViewerModal.vue'
import { ref } from 'vue'

type GenerationType = 'image' | 'video' | '3d' | 'audio'

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
  duration?: number // for videos in seconds
  parameters: {
    steps: number
    cfg: number
    width: number
    height: number
    seed: number
    frames?: number // for videos
    fps?: number // for videos
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
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=512&h=512&fit=crop',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=512&h=512&fit=crop',
    ],
    batchSize: 4,
    parameters: {
      steps: 25,
      cfg: 8,
      width: 1024,
      height: 768,
      seed: 18273645,
    },
  },
  {
    id: 'gen-4',
    type: '3d',
    prompt: 'A detailed 3D model of a medieval castle',
    workflow: 'Text to 3D',
    status: 'completed',
    createdAt: new Date(Date.now() - 450000),
    outputs: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=512&h=512&fit=crop',
    ],
    batchSize: 1,
    parameters: {
      steps: 100,
      cfg: 7.5,
      width: 512,
      height: 512,
      seed: 77234567,
    },
  },
  {
    id: 'gen-5',
    type: 'video',
    prompt: 'Ocean waves crashing on a beach at sunset',
    workflow: 'Image to Video',
    status: 'generating',
    progress: 35,
    createdAt: new Date(Date.now() - 60000),
    outputs: [],
    batchSize: 1,
    duration: 6,
    parameters: {
      steps: 40,
      cfg: 6,
      width: 1920,
      height: 1080,
      seed: 33456789,
      frames: 180,
      fps: 30,
    },
  },
  {
    id: 'gen-6',
    type: 'image',
    prompt: 'Portrait of a woman in Renaissance painting style',
    workflow: 'Image to Image',
    status: 'completed',
    createdAt: new Date(Date.now() - 600000),
    outputs: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=512&h=512&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=512&h=512&fit=crop',
    ],
    batchSize: 2,
    parameters: {
      steps: 40,
      cfg: 6.5,
      width: 768,
      height: 1024,
      seed: 98712345,
    },
  },
  {
    id: 'gen-7',
    type: '3d',
    prompt: 'Stylized low-poly tree for game asset',
    workflow: 'Image to 3D',
    status: 'generating',
    progress: 78,
    createdAt: new Date(Date.now() - 120000),
    outputs: [],
    batchSize: 1,
    parameters: {
      steps: 80,
      cfg: 8,
      width: 512,
      height: 512,
      seed: 44567890,
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

function getStatusText(status: GenerationItem['status']): string {
  switch (status) {
    case 'generating':
      return 'Generating'
    case 'queued':
      return 'Queued'
    case 'completed':
      return 'Completed'
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

function getTypeLabel(type: GenerationType): string {
  switch (type) {
    case 'image':
      return 'Image'
    case 'video':
      return 'Video'
    case '3d':
      return '3D'
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

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`
}

function handleDelete(id: string): void {
  generations.value = generations.value.filter(g => g.id !== id)
}

function getFileExtension(type: GenerationType): string {
  switch (type) {
    case 'image':
      return 'png'
    case 'video':
      return 'mp4'
    case '3d':
      return 'glb'
  }
}

function handleDownload(gen: GenerationItem, outputIndex?: number): void {
  if (gen.outputs.length === 0) return

  const ext = getFileExtension(gen.type)
  if (outputIndex !== undefined) {
    const link = document.createElement('a')
    link.href = gen.outputs[outputIndex]!
    link.download = `generation-${gen.id}-${outputIndex + 1}.${ext}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    gen.outputs.forEach((output, idx) => {
      const link = document.createElement('a')
      link.href = output
      link.download = `generation-${gen.id}-${idx + 1}.${ext}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }
}

function handleRerun(gen: GenerationItem): void {
  console.log('Rerun:', gen)
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
  <main class="flex h-full flex-1 flex-col" style="background-color: var(--color-canvas-bg)">
    <!-- Header -->
    <div class="flex h-10 items-center justify-between border-b border-border bg-black/20 px-4">
      <span class="text-sm font-medium text-foreground">Queue</span>
      <div class="flex items-center gap-2">
        <button
          v-tooltip.bottom="'Clear all'"
          class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Icon name="trash" size="xs" />
        </button>
      </div>
    </div>

    <!-- Generations List -->
    <div class="flex-1 overflow-y-auto">
      <div class="flex flex-col divide-y divide-border">
        <div
          v-for="gen in generations"
          :key="gen.id"
          class="group px-4 py-4"
        >
          <!-- Top Row: Type, Status, Time, Actions -->
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <Icon :name="getTypeIcon(gen.type)" size="xs" :class="getTypeColor(gen.type)" />
              <span :class="['text-[11px] font-medium', getTypeColor(gen.type)]">{{ getTypeLabel(gen.type) }}</span>
              <span class="text-border">•</span>
              <span
                :class="[
                  'h-1.5 w-1.5 rounded-full',
                  getStatusColor(gen.status),
                  gen.status === 'generating' && 'animate-pulse'
                ]"
              />
              <span class="text-[11px] text-muted-foreground">{{ getStatusText(gen.status) }}</span>
              <span class="text-border">•</span>
              <span class="text-[11px] text-muted-foreground">{{ formatTime(gen.createdAt) }}</span>
            </div>
            <div class="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                v-tooltip.top="'Rerun'"
                class="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                @click="handleRerun(gen)"
              >
                <Icon name="refresh" size="md" class="text-[9px]" />
              </button>
              <button
                v-if="gen.outputs.length > 0"
                v-tooltip.top="'Download'"
                class="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                @click="handleDownload(gen)"
              >
                <Icon name="download" size="md" class="text-[9px]" />
              </button>
              <button
                v-tooltip.top="'Delete'"
                class="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
                @click="handleDelete(gen.id)"
              >
                <Icon name="trash" size="md" class="text-[9px]" />
              </button>
            </div>
          </div>

          <!-- IMAGE: Grid -->
          <div
            v-if="gen.type === 'image' && gen.outputs.length > 0"
            class="mb-2 flex flex-wrap gap-1.5"
          >
            <div
              v-for="(img, idx) in gen.outputs"
              :key="idx"
              class="group/img relative aspect-square w-24 cursor-pointer overflow-hidden rounded-lg bg-muted"
              @click="openMediaViewer(gen, idx)"
            >
              <img
                :src="img"
                alt="Generated image"
                class="h-full w-full object-cover transition-transform group-hover/img:scale-105"
              />
              <div class="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover/img:opacity-100">
                <button
                  v-tooltip.top="'View fullscreen'"
                  class="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                  @click.stop="openMediaViewer(gen, idx)"
                >
                  <Icon name="maximize" size="sm" />
                </button>
                <button
                  v-tooltip.top="'Download'"
                  class="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                  @click.stop="handleDownload(gen, idx)"
                >
                  <Icon name="download" size="sm" />
                </button>
              </div>
            </div>
          </div>

          <!-- VIDEO: Single video display -->
          <div
            v-else-if="gen.type === 'video' && gen.outputs.length > 0"
            class="group/vid relative mb-2 aspect-square w-24 cursor-pointer overflow-hidden rounded-lg bg-muted"
            @click="openMediaViewer(gen, 0)"
          >
            <img
              :src="gen.outputs[0]"
              alt="Video thumbnail"
              class="h-full w-full object-cover"
            />
            <!-- Play button overlay -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
                <Icon name="play" size="md" />
              </div>
            </div>
            <!-- Duration badge -->
            <div class="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
              {{ formatDuration(gen.duration || 0) }}
            </div>
            <!-- Hover actions -->
            <div class="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover/vid:opacity-100">
              <button
                v-tooltip.top="'View fullscreen'"
                class="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                @click.stop="openMediaViewer(gen, 0)"
              >
                <Icon name="maximize" size="xs" />
              </button>
              <button
                v-tooltip.top="'Download'"
                class="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                @click.stop="handleDownload(gen, 0)"
              >
                <Icon name="download" size="xs" />
              </button>
            </div>
          </div>

          <!-- 3D: Model preview -->
          <div
            v-else-if="gen.type === '3d' && gen.outputs.length > 0"
            class="group/3d relative mb-2 aspect-square w-24 cursor-pointer overflow-hidden rounded-lg bg-muted"
            @click="openMediaViewer(gen, 0)"
          >
            <img
              :src="gen.outputs[0]"
              alt="3D model preview"
              class="h-full w-full object-cover"
            />
            <!-- 3D indicator -->
            <div class="absolute left-1.5 top-1.5 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
              <Icon name="cube" size="xs" />
              <span>3D</span>
            </div>
            <!-- Hover actions -->
            <div class="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover/3d:opacity-100">
              <button
                v-tooltip.top="'View fullscreen'"
                class="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                @click.stop="openMediaViewer(gen, 0)"
              >
                <Icon name="maximize" size="xs" />
              </button>
              <button
                v-tooltip.top="'Download GLB'"
                class="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                @click.stop="handleDownload(gen, 0)"
              >
                <Icon name="download" size="xs" />
              </button>
            </div>
          </div>

          <!-- IMAGE: Generating placeholder -->
          <div
            v-else-if="gen.type === 'image' && gen.status === 'generating'"
            class="mb-2 flex flex-wrap gap-1.5"
          >
            <div
              v-for="i in gen.batchSize"
              :key="i"
              class="flex aspect-square w-24 items-center justify-center overflow-hidden rounded-lg bg-muted"
            >
              <div class="flex flex-col items-center">
                <Icon name="spinner" size="sm" class="animate-spin text-primary" />
                <span class="mt-1 text-[10px] text-muted-foreground">{{ gen.progress }}%</span>
              </div>
            </div>
          </div>

          <!-- VIDEO: Generating placeholder -->
          <div
            v-else-if="gen.type === 'video' && gen.status === 'generating'"
            class="mb-2 flex aspect-square w-24 items-center justify-center overflow-hidden rounded-lg bg-muted"
          >
            <div class="flex flex-col items-center">
              <Icon name="video" size="md" class="mb-1 text-blue-400" />
              <Icon name="spinner" size="sm" class="animate-spin text-primary" />
              <span class="mt-1 text-[10px] text-muted-foreground">{{ gen.progress }}%</span>
            </div>
          </div>

          <!-- 3D: Generating placeholder -->
          <div
            v-else-if="gen.type === '3d' && gen.status === 'generating'"
            class="mb-2 flex aspect-square w-24 items-center justify-center overflow-hidden rounded-lg bg-muted"
          >
            <div class="flex flex-col items-center">
              <Icon name="cube" size="md" class="mb-1 text-amber-400" />
              <Icon name="spinner" size="sm" class="animate-spin text-primary" />
              <span class="mt-1 text-[10px] text-muted-foreground">{{ gen.progress }}%</span>
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
          <p class="mb-2 line-clamp-2 text-xs leading-relaxed text-foreground">
            {{ gen.prompt }}
          </p>

          <!-- Parameter Badges -->
          <div class="flex flex-wrap gap-1">
            <span class="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px]">
              <span class="text-muted-foreground">Steps</span>
              <span class="ml-1 text-foreground">{{ gen.parameters.steps }}</span>
            </span>
            <span class="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px]">
              <span class="text-muted-foreground">CFG</span>
              <span class="ml-1 text-foreground">{{ gen.parameters.cfg }}</span>
            </span>
            <span class="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px]">
              <span class="text-muted-foreground">Size</span>
              <span class="ml-1 text-foreground">{{ gen.parameters.width }}×{{ gen.parameters.height }}</span>
            </span>
            <!-- Video-specific params -->
            <span v-if="gen.type === 'video' && gen.parameters.frames" class="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px]">
              <span class="text-muted-foreground">Frames</span>
              <span class="ml-1 text-foreground">{{ gen.parameters.frames }}</span>
            </span>
            <span v-if="gen.type === 'video' && gen.parameters.fps" class="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px]">
              <span class="text-muted-foreground">FPS</span>
              <span class="ml-1 text-foreground">{{ gen.parameters.fps }}</span>
            </span>
            <span v-if="gen.type === 'video' && gen.duration" class="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px]">
              <span class="text-muted-foreground">Duration</span>
              <span class="ml-1 text-foreground">{{ formatDuration(gen.duration) }}</span>
            </span>
            <span class="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px]">
              <span class="text-muted-foreground">Seed</span>
              <span class="ml-1 font-mono text-foreground">{{ gen.parameters.seed }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="generations.length === 0"
        class="flex flex-1 flex-col items-center justify-center py-12 text-muted-foreground"
      >
        <Icon name="images" size="md" class="mb-2 text-3xl" />
        <span class="text-sm">No outputs yet</span>
        <p class="mt-1 text-center text-xs text-muted-foreground">
          Run a workflow to see outputs here
        </p>
      </div>
    </div>

    <!-- Media Viewer Modal -->
    <LinearMediaViewerModal
      v-model:visible="mediaViewerVisible"
      :media="selectedMedia?.gen ?? null"
      :initial-index="selectedMedia?.index ?? 0"
    />
  </main>
</template>

<style scoped>
div::-webkit-scrollbar {
  width: 6px;
}

div::-webkit-scrollbar-track {
  background: transparent;
}

div::-webkit-scrollbar-thumb {
  background: var(--border-default);
  border-radius: 3px;
}
</style>
