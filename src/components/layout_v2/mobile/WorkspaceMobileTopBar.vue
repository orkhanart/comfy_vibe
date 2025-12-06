<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { useUiStore } from '@/stores/uiStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const router = useRouter()
const uiStore = useUiStore()
const workspaceStore = useWorkspaceStore()

const currentWorkspace = computed(() => workspaceStore.currentWorkspace)
const showWorkspaceSwitcher = ref(false)

const privateWorkspace = computed(() => workspaceStore.privateWorkspace)
const teamWorkspaces = computed(() => workspaceStore.teamWorkspaces)

function selectWorkspace(workspaceId: string): void {
  workspaceStore.setCurrentWorkspace(workspaceId)
  showWorkspaceSwitcher.value = false
}

function handleLinearModeClick(): void {
  router.push({ name: 'linear-mode' })
}
</script>

<template>
  <header class="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background px-3 safe-area-top">
    <!-- Logo -->
    <button class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent">
      <img
        :src="uiStore.themeMode === 'dark' ? '/assets/images/comfy-logo-mono.svg' : '/assets/images/comfy-logo-single.svg'"
        alt="Comfy"
        class="h-5 w-5"
      />
    </button>

    <!-- Divider -->
    <div class="h-5 w-px bg-border" />

    <!-- Linear Mode Button -->
    <button
      class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent"
      @click="handleLinearModeClick"
    >
      <Icon name="play" size="sm" />
    </button>

    <!-- Divider -->
    <div class="h-5 w-px bg-border" />

    <!-- Workspace Selector -->
    <Popover v-model:open="showWorkspaceSwitcher">
      <PopoverTrigger as-child>
        <button class="flex flex-1 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent">
          <Icon :name="currentWorkspace?.isPrivate ? 'home' : 'users'" size="xs" class="shrink-0 opacity-60" />
          <span class="truncate">{{ currentWorkspace?.name || 'Workspace' }}</span>
          <Icon name="chevron-down" size="xs" class="shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" :side-offset="4" class="w-[220px] p-1">
        <div class="flex flex-col">
          <!-- Private Workspace -->
          <button
            v-if="privateWorkspace"
            class="flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
            :class="{ 'bg-accent/50': currentWorkspace?.id === privateWorkspace.id }"
            @click="selectWorkspace(privateWorkspace.id)"
          >
            <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-zinc-200 dark:bg-zinc-700">
              <Icon name="home" size="xs" class="text-muted-foreground" />
            </div>
            <span class="flex-1 truncate">{{ privateWorkspace.name }}</span>
            <Icon v-if="currentWorkspace?.id === privateWorkspace.id" name="check" size="xs" class="text-primary" />
          </button>

          <!-- Team Workspaces -->
          <button
            v-for="workspace in teamWorkspaces"
            :key="workspace.id"
            class="flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
            :class="{ 'bg-accent/50': currentWorkspace?.id === workspace.id }"
            @click="selectWorkspace(workspace.id)"
          >
            <div class="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-200 dark:bg-zinc-700">
              <img v-if="workspace.avatar" :src="workspace.avatar" :alt="workspace.name" class="h-full w-full object-cover" />
              <Icon v-else name="users" size="xs" class="text-muted-foreground" />
            </div>
            <span class="flex-1 truncate">{{ workspace.name }}</span>
            <Icon v-if="currentWorkspace?.id === workspace.id" name="check" size="xs" class="text-primary" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  </header>
</template>

<style scoped>
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}
</style>
