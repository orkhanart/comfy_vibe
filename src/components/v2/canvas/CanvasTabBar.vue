<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CanvasLogoMenu from './CanvasLogoMenu.vue'
import CanvasShareDialog from './CanvasShareDialog.vue'
import CanvasModeToggle from '@/components/common/CanvasModeToggle.vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'

const router = useRouter()
const workspaceStore = useWorkspaceStore()
const showShareDialog = ref(false)
const showMenu = ref(false)

function handleLogoClick(): void {
  showMenu.value = !showMenu.value
}

function handleHomeClick(): void {
  router.push({ name: 'workspace-dashboard', params: { workspaceId: 'default' } })
}
</script>

<template>
  <div class="flex h-10 items-center gap-1 border-b border-zinc-800 bg-zinc-950 px-2 select-none">
    <!-- Logo Section -->
    <div class="relative">
      <button
        class="flex items-center gap-1 rounded-md px-2 py-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
        @click="handleLogoClick"
      >
        <img src="/assets/images/comfy-logo-mono.svg" alt="Comfy" class="h-5 w-5" />
        <i class="pi pi-chevron-down text-[10px] opacity-70" />
      </button>

      <CanvasLogoMenu :show="showMenu" @close="showMenu = false" />
    </div>

    <!-- Divider -->
    <div class="mx-1 h-5 w-px bg-zinc-800" />

    <!-- Mode Toggle -->
    <CanvasModeToggle />

    <!-- Divider -->
    <div class="mx-1 h-5 w-px bg-zinc-800" />

    <!-- Home Button -->
    <button
      v-tooltip.bottom="{ value: 'Home', showDelay: 50 }"
      class="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
      @click="handleHomeClick"
    >
      <i class="pi pi-home text-base" />
    </button>

    <!-- Divider -->
    <div class="mx-1 h-5 w-px bg-zinc-800" />

    <!-- Project Name -->
    <div class="flex flex-1 items-center">
      <div class="flex items-center gap-1">
        <span class="rounded-md bg-zinc-800 px-3 py-1.5 text-xs text-zinc-100">{{ workspaceStore.currentProjectName }}</span>
        <button class="p-1 text-zinc-500 transition-colors hover:text-zinc-300">
          <i class="pi pi-ellipsis-h text-xs" />
        </button>
      </div>
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-1">
      <button
        v-tooltip.bottom="{ value: 'Share', showDelay: 50 }"
        class="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
        @click="showShareDialog = true"
      >
        <i class="pi pi-share-alt text-sm" />
      </button>
    </div>

    <!-- Share Dialog -->
    <CanvasShareDialog
      v-model:visible="showShareDialog"
      :workflow-name="workspaceStore.currentProjectName"
    />
  </div>
</template>
