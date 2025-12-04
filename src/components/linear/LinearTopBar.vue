<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/uiStore'
import CanvasTabs from '@/components/canvas/CanvasTabs.vue'

const router = useRouter()
const uiStore = useUiStore()

const showMenu = ref(false)

function handleLogoClick(): void {
  showMenu.value = !showMenu.value
}

function goToWorkspace(): void {
  showMenu.value = false
  router.push({ name: 'workspace-dashboard', params: { workspaceId: 'default' } })
}

function goToProjects(): void {
  showMenu.value = false
  router.push({ name: 'workspace-projects', params: { workspaceId: 'default' } })
}

function goToSettings(): void {
  showMenu.value = false
  router.push({ name: 'workspace-settings', params: { workspaceId: 'default' } })
}

function signOut(): void {
  showMenu.value = false
  router.push('/')
}

function toggleTheme(): void {
  uiStore.toggleTheme()
}

function handleTabSelect(tabId: string): void {
  const mode = uiStore.getWorkflowMode(tabId)
  uiStore.selectWorkflowTab(tabId)
  // Navigate to the correct mode if different from current
  if (mode === 'node') {
    router.push({ name: 'node-editor' })
  }
  // Already in linear mode, no navigation needed
}

function handleNewWorkflow(): void {
  // Create new workflow in current mode (linear)
  uiStore.createWorkflowTab('linear')
}
</script>

<template>
  <header class="flex h-10 shrink-0 items-center gap-1 border-b border-border bg-background px-2 select-none">
    <!-- Logo Section with Dropdown -->
    <div class="relative">
      <button
        class="flex items-center gap-1 rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        @click="handleLogoClick"
      >
        <img :src="uiStore.themeMode === 'dark' ? '/assets/images/comfy-logo-mono.svg' : '/assets/images/comfy-logo-single.svg'" alt="Comfy" class="h-5 w-5" />
        <Icon name="chevron-down" size="xs" class="opacity-70" />
      </button>

      <!-- Dropdown Menu -->
      <div v-if="showMenu" class="absolute left-0 top-full z-[100] mt-1 min-w-[240px] rounded-lg border border-border bg-popover p-1 shadow-xl">
        <!-- File Section -->
        <div class="px-3 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">File</div>
        <button class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-accent">
          <Icon name="file" size="sm" class="w-4 text-muted-foreground" />
          <span class="flex-1">New Session</span>
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
      <div v-if="showMenu" class="fixed inset-0 z-[99]" @click="showMenu = false" />
    </div>

    <!-- Divider -->
    <div class="mx-1 h-5 w-px bg-border" />

    <!-- Home Button -->
    <button
      v-tooltip.bottom="{ value: 'Home', showDelay: 50 }"
      class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      @click="goToWorkspace"
    >
      <Icon name="home" size="md" />
    </button>

    <!-- Divider -->
    <div class="mx-1 h-5 w-px bg-border" />

    <!-- Tabs Section -->
    <CanvasTabs
      :tabs="uiStore.workflowTabs"
      :active-tab-id="uiStore.activeWorkflowTabId"
      @select="handleTabSelect"
      @close="uiStore.closeWorkflowTab"
      @new="handleNewWorkflow"
    />

    <!-- Right Section -->
    <div class="ml-auto flex items-center gap-1">
      <!-- Mode Toggle -->
      <div class="flex h-7 items-center rounded-md bg-muted p-0.5">
        <button
          class="flex h-6 items-center gap-1 rounded px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          @click="router.push({ name: 'node-editor' })"
        >
          <Icon name="sitemap" size="xs" />
          Node
        </button>
        <button
          class="flex h-6 items-center gap-1 rounded px-2 text-xs font-medium bg-background text-foreground shadow-sm"
        >
          <Icon name="sliders-h" size="xs" />
          Linear
        </button>
      </div>

      <!-- Divider -->
      <div class="mx-1 h-5 w-px bg-border" />

      <button
        v-tooltip.bottom="{ value: 'Share', showDelay: 50 }"
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Icon name="share-alt" size="sm" />
      </button>
    </div>
  </header>
</template>
