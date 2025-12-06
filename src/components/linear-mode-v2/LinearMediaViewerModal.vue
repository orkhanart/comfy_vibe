<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

type MediaType = 'image' | 'video' | '3d' | 'audio'

interface MediaItem {
  id: string
  type: MediaType
  prompt: string
  outputs: string[]
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

const props = defineProps<{
  visible: boolean
  media: MediaItem | null
  initialIndex?: number
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const currentIndex = ref(0)

// Sync initial index when media changes
watch(() => [props.visible, props.media], () => {
  if (props.visible && props.media) {
    currentIndex.value = props.initialIndex ?? 0
  }
}, { immediate: true })

const currentOutput = computed(() => {
  if (!props.media || props.media.outputs.length === 0) return null
  return props.media.outputs[currentIndex.value]
})

const hasMultiple = computed(() => {
  return props.media && props.media.outputs.length > 1
})

const totalOutputs = computed(() => {
  return props.media?.outputs.length ?? 0
})

function close(): void {
  emit('update:visible', false)
}

function next(): void {
  if (!props.media) return
  currentIndex.value = (currentIndex.value + 1) % props.media.outputs.length
}

function prev(): void {
  if (!props.media) return
  currentIndex.value = currentIndex.value === 0
    ? props.media.outputs.length - 1
    : currentIndex.value - 1
}

function goToIndex(index: number): void {
  currentIndex.value = index
}

function handleKeydown(e: KeyboardEvent): void {
  if (!props.visible) return

  switch (e.key) {
    case 'Escape':
      close()
      break
    case 'ArrowLeft':
      prev()
      break
    case 'ArrowRight':
      next()
      break
  }
}

function getFileExtension(type: MediaType): string {
  switch (type) {
    case 'image':
      return 'png'
    case 'video':
      return 'mp4'
    case '3d':
      return 'glb'
    case 'audio':
      return 'wav'
  }
}

function handleDownload(): void {
  if (!props.media || !currentOutput.value) return

  const ext = getFileExtension(props.media.type)
  const link = document.createElement('a')
  link.href = currentOutput.value
  link.download = `generation-${props.media.id}-${currentIndex.value + 1}.${ext}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`
}

function getTypeIcon(type: MediaType): string {
  switch (type) {
    case 'image':
      return 'image'
    case 'video':
      return 'video'
    case '3d':
      return 'cube'
    case 'audio':
      return 'volume-2'
  }
}

function getTypeLabel(type: MediaType): string {
  switch (type) {
    case 'image':
      return 'Image'
    case 'video':
      return 'Video'
    case '3d':
      return '3D Model'
    case 'audio':
      return 'Audio'
  }
}

// Prevent body scroll when modal is open
watch(() => props.visible, (visible) => {
  if (visible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible && media"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/90" @click="close" />

        <!-- Content -->
        <div class="relative flex h-full w-full flex-col">
          <!-- Header -->
          <div class="relative z-10 flex h-14 shrink-0 items-center justify-between px-4">
            <div class="flex items-center gap-3">
              <Icon :name="getTypeIcon(media.type)" size="sm" class="text-muted-foreground" />
              <span class="text-sm font-medium text-white">{{ getTypeLabel(media.type) }}</span>
              <span v-if="hasMultiple" class="text-sm text-muted-foreground">
                {{ currentIndex + 1 }} / {{ totalOutputs }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-tooltip.bottom="'Download'"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
                @click="handleDownload"
              >
                <Icon name="download" size="sm" />
              </button>
              <button
                v-tooltip.bottom="'Close (Esc)'"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
                @click="close"
              >
                <Icon name="x" size="sm" />
              </button>
            </div>
          </div>

          <!-- Main Media Area -->
          <div class="relative flex flex-1 items-center justify-center overflow-hidden px-16">
            <!-- Navigation Arrows -->
            <button
              v-if="hasMultiple"
              class="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              @click="prev"
            >
              <Icon name="chevron-left" size="md" />
            </button>
            <button
              v-if="hasMultiple"
              class="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              @click="next"
            >
              <Icon name="chevron-right" size="md" />
            </button>

            <!-- Image Display -->
            <template v-if="media.type === 'image'">
              <img
                :src="currentOutput ?? ''"
                :alt="media.prompt"
                class="max-h-full max-w-full object-contain"
              />
            </template>

            <!-- Video Display -->
            <template v-else-if="media.type === 'video'">
              <video
                :key="currentOutput"
                :src="currentOutput ?? ''"
                controls
                autoplay
                class="max-h-full max-w-full"
              >
                Your browser does not support the video tag.
              </video>
            </template>

            <!-- 3D Model Display -->
            <template v-else-if="media.type === '3d'">
              <div class="flex flex-col items-center justify-center">
                <img
                  :src="currentOutput ?? ''"
                  :alt="media.prompt"
                  class="max-h-[70vh] max-w-full object-contain"
                />
                <div class="mt-4 flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white backdrop-blur-sm">
                  <Icon name="cube" size="sm" />
                  <span class="text-sm">3D viewer coming soon</span>
                </div>
              </div>
            </template>

            <!-- Audio Display -->
            <template v-else-if="media.type === 'audio'">
              <div class="flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-2xl bg-white/5 p-8 backdrop-blur-sm">
                <div class="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
                  <Icon name="volume-2" size="xl" class="text-primary" />
                </div>
                <audio
                  :key="currentOutput"
                  :src="currentOutput ?? ''"
                  controls
                  class="w-full"
                >
                  Your browser does not support the audio tag.
                </audio>
                <p class="line-clamp-2 text-center text-sm text-muted-foreground">
                  {{ media.prompt }}
                </p>
              </div>
            </template>
          </div>

          <!-- Thumbnail Strip (for multiple outputs) -->
          <div
            v-if="hasMultiple"
            class="relative z-10 flex h-20 shrink-0 items-center justify-center gap-2 bg-black/50 px-4"
          >
            <button
              v-for="(output, idx) in media.outputs"
              :key="idx"
              :class="[
                'relative h-14 w-14 overflow-hidden rounded-lg border-2 transition-all',
                idx === currentIndex
                  ? 'border-primary ring-2 ring-primary/50'
                  : 'border-transparent opacity-60 hover:opacity-100'
              ]"
              @click="goToIndex(idx)"
            >
              <img
                v-if="media.type === 'image' || media.type === 'video' || media.type === '3d'"
                :src="output"
                alt=""
                class="h-full w-full object-cover"
              />
              <div
                v-else-if="media.type === 'audio'"
                class="flex h-full w-full items-center justify-center bg-muted"
              >
                <Icon name="volume-2" size="sm" class="text-muted-foreground" />
              </div>
            </button>
          </div>

          <!-- Footer with metadata -->
          <div class="relative z-10 flex h-16 shrink-0 items-center justify-between border-t border-white/10 bg-black/50 px-4">
            <p class="max-w-2xl truncate text-sm text-muted-foreground">
              {{ media.prompt }}
            </p>
            <div class="flex items-center gap-3">
              <span class="text-xs text-muted-foreground">
                {{ media.parameters.width }}×{{ media.parameters.height }}
              </span>
              <span class="text-xs text-muted-foreground">
                Steps: {{ media.parameters.steps }}
              </span>
              <span class="text-xs text-muted-foreground">
                CFG: {{ media.parameters.cfg }}
              </span>
              <span v-if="media.type === 'video' && media.duration" class="text-xs text-muted-foreground">
                {{ formatDuration(media.duration) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
