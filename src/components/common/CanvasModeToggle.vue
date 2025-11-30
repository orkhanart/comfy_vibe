<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUiStore, type CanvasMode } from '@/stores/uiStore'

const router = useRouter()
const route = useRoute()
const uiStore = useUiStore()

const isNodeMode = computed(() => uiStore.canvasMode === 'node')

function setMode(mode: CanvasMode): void {
  uiStore.setCanvasMode(mode)

  // Navigate to appropriate route
  if (mode === 'linear') {
    // Get workspace ID from current route or use default
    const workspaceId = (route.params.workspaceId as string) || 'default'
    router.push({ name: 'workspace-linear-create', params: { workspaceId } })
  } else {
    // Navigate to canvas/node editor
    const workspaceId = (route.params.workspaceId as string) || 'default'
    const projectId = (route.params.projectId as string) || 'default'
    const canvasId = (route.params.canvasId as string) || 'untitled'
    router.push({
      name: 'canvas',
      params: { workspaceId, projectId, canvasId }
    })
  }
}
</script>

<template>
  <div class="flex items-center rounded-lg bg-zinc-800/50 p-0.5">
    <button
      class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
      :class="isNodeMode
        ? 'bg-zinc-700 text-zinc-100'
        : 'text-zinc-400 hover:text-zinc-200'"
      @click="setMode('node')"
    >
      <i class="pi pi-sitemap text-[10px]" />
      <span>Node</span>
    </button>
    <button
      class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
      :class="!isNodeMode
        ? 'bg-zinc-700 text-zinc-100'
        : 'text-zinc-400 hover:text-zinc-200'"
      @click="setMode('linear')"
    >
      <i class="pi pi-list text-[10px]" />
      <span>Linear</span>
    </button>
  </div>
</template>
