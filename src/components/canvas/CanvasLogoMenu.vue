<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/uiStore'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const uiStore = useUiStore()

function goToWorkspace(): void {
  emit('close')
  router.push({ name: 'workspace-dashboard', params: { workspaceId: 'default' } })
}

function goToProjects(): void {
  emit('close')
  router.push({ name: 'workspace-projects', params: { workspaceId: 'default' } })
}

function goToSettings(): void {
  emit('close')
  router.push({ name: 'workspace-settings', params: { workspaceId: 'default' } })
}

function signOut(): void {
  emit('close')
  router.push('/')
}

function toggleTheme(): void {
  uiStore.toggleTheme()
}
</script>

<template>
  <div v-if="show" class="absolute left-0 top-full z-[100] mt-1 min-w-[240px] rounded-lg border border-border bg-popover p-1 shadow-xl">
    <!-- File Section -->
    <div class="px-3 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">File</div>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent">
      <Icon name="file" size="sm" class="w-4 text-muted-foreground" />
      <span class="flex-1">New Workflow</span>
      <span class="text-[11px] text-muted-foreground">Ctrl+N</span>
    </button>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent">
      <Icon name="folder-open" size="sm" class="w-4 text-muted-foreground" />
      <span class="flex-1">Open...</span>
      <span class="text-[11px] text-muted-foreground">Ctrl+O</span>
    </button>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent">
      <Icon name="save" size="sm" class="w-4 text-muted-foreground" />
      <span class="flex-1">Save</span>
      <span class="text-[11px] text-muted-foreground">Ctrl+S</span>
    </button>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent">
      <Icon name="download" size="sm" class="w-4 text-muted-foreground" />
      <span>Export...</span>
    </button>

    <div class="mx-2 my-1 h-px bg-border" />

    <!-- Workspace Section -->
    <div class="px-3 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Workspace</div>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent" @click="goToWorkspace">
      <Icon name="home" size="sm" class="w-4 text-muted-foreground" />
      <span>Dashboard</span>
    </button>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent" @click="goToProjects">
      <Icon name="folder" size="sm" class="w-4 text-muted-foreground" />
      <span>Projects</span>
    </button>

    <div class="mx-2 my-1 h-px bg-border" />

    <!-- Account Section -->
    <div class="px-3 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Account</div>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent" @click="goToSettings">
      <Icon name="cog" size="sm" class="w-4 text-muted-foreground" />
      <span>Settings</span>
    </button>
    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent" @click="toggleTheme">
      <Icon :name="uiStore.themeMode === 'dark' ? 'moon' : 'sun'" size="sm" class="w-4 text-muted-foreground" />
      <span class="flex-1">{{ uiStore.themeMode === 'dark' ? 'Dark Mode' : 'Light Mode' }}</span>
      <div
        class="h-5 w-9 rounded-full p-0.5 transition-colors"
        :class="uiStore.themeMode === 'dark' ? 'bg-primary' : 'bg-muted'"
      >
        <div
          class="h-4 w-4 rounded-full bg-white shadow-sm transition-transform"
          :class="uiStore.themeMode === 'dark' ? 'translate-x-4' : 'translate-x-0'"
        />
      </div>
    </button>

    <div class="mx-2 my-1 h-px bg-border" />

    <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-destructive transition-colors hover:bg-destructive/10" @click="signOut">
      <Icon name="sign-out" size="sm" class="w-4 text-destructive" />
      <span>Sign out</span>
    </button>
  </div>

  <!-- Backdrop -->
  <div v-if="show" class="fixed inset-0 z-[99]" @click="emit('close')" />
</template>
