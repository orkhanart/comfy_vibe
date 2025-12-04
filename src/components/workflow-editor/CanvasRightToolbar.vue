<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'

interface Props {
  orientation?: 'vertical' | 'horizontal'
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'vertical'
})

const emit = defineEmits<{
  fitView: []
  zoomIn: []
  zoomOut: []
}>()

// Tool mode: 'select' or 'pan'
const toolMode = ref<'select' | 'pan'>('select')

// Zoom level (percentage)
const zoomLevel = ref(75)

// Toggle states
const showMinimap = ref(false)
const showLinks = ref(true)

const isVertical = computed(() => props.orientation === 'vertical')
const tooltipPos = computed(() => isVertical.value ? 'left' : 'top')

function setToolMode(mode: 'select' | 'pan'): void {
  toolMode.value = mode
}

function handleFitView(): void {
  emit('fitView')
}

function handleZoomIn(): void {
  zoomLevel.value = Math.min(400, zoomLevel.value + 25)
  emit('zoomIn')
}

function handleZoomOut(): void {
  zoomLevel.value = Math.max(10, zoomLevel.value - 25)
  emit('zoomOut')
}

function toggleMinimap(): void {
  showMinimap.value = !showMinimap.value
}

function toggleLinks(): void {
  showLinks.value = !showLinks.value
}
</script>

<template>
  <div
    class="absolute z-10"
    :class="isVertical ? 'right-4 top-1/2 -translate-y-1/2' : 'bottom-4 right-4'"
  >
    <div
      class="flex items-center gap-1 rounded-lg border border-border bg-card/90 p-1.5 backdrop-blur"
      :class="isVertical ? 'flex-col' : 'flex-row'"
    >
      <!-- Select / Pan Toggle -->
      <button
        v-tooltip:[tooltipPos]="{ value: 'Select', showDelay: 300 }"
        class="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
        :class="toolMode === 'select' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'"
        @click="setToolMode('select')"
      >
        <Icon name="arrow-up-left" size="md" />
      </button>
      <button
        v-tooltip:[tooltipPos]="{ value: 'Pan', showDelay: 300 }"
        class="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
        :class="toolMode === 'pan' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'"
        @click="setToolMode('pan')"
      >
        <Icon name="arrows-alt" size="md" />
      </button>

      <!-- Divider -->
      <div :class="isVertical ? 'my-1 h-px w-5 bg-border' : 'mx-1 h-5 w-px bg-border'" />

      <!-- Fit to Screen -->
      <button
        v-tooltip:[tooltipPos]="{ value: 'Fit to Screen', showDelay: 300 }"
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
        @click="handleFitView"
      >
        <Icon name="expand" size="md" />
      </button>

      <!-- Divider -->
      <div :class="isVertical ? 'my-1 h-px w-5 bg-border' : 'mx-1 h-5 w-px bg-border'" />

      <!-- Zoom Controls -->
      <button
        v-tooltip:[tooltipPos]="{ value: 'Zoom In', showDelay: 300 }"
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
        @click="handleZoomIn"
      >
        <Icon name="plus" size="sm" />
      </button>
      <div
        v-tooltip:[tooltipPos]="{ value: 'Zoom Level', showDelay: 300 }"
        class="flex h-8 w-8 items-center justify-center text-[10px] font-medium text-muted-foreground"
      >
        {{ zoomLevel }}%
      </div>
      <button
        v-tooltip:[tooltipPos]="{ value: 'Zoom Out', showDelay: 300 }"
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
        @click="handleZoomOut"
      >
        <Icon name="minus" size="sm" />
      </button>

      <!-- Divider -->
      <div :class="isVertical ? 'my-1 h-px w-5 bg-border' : 'mx-1 h-5 w-px bg-border'" />

      <!-- Minimap Toggle -->
      <button
        v-tooltip:[tooltipPos]="{ value: showMinimap ? 'Hide Minimap' : 'Show Minimap', showDelay: 300 }"
        class="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
        :class="showMinimap ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'"
        @click="toggleMinimap"
      >
        <Icon name="map" size="md" />
      </button>

      <!-- Links Toggle -->
      <button
        v-tooltip:[tooltipPos]="{ value: showLinks ? 'Hide Links' : 'Show Links', showDelay: 300 }"
        class="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
        :class="showLinks ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'"
        @click="toggleLinks"
      >
        <Icon name="link" size="md" />
      </button>
    </div>
  </div>
</template>
