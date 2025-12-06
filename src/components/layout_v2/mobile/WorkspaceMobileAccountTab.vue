<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { useUiStore } from '@/stores/uiStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const uiStore = useUiStore()
const workspaceStore = useWorkspaceStore()

const currentWorkspace = computed(() => workspaceStore.currentWorkspace)

interface MenuItem {
  id: string
  label: string
  icon: string
  action?: () => void
  route?: string
  badge?: string
}

const accountMenuItems: MenuItem[] = [
  { id: 'profile', label: 'Profile', icon: 'user' },
  { id: 'notifications', label: 'Notifications', icon: 'bell', badge: '3' },
  { id: 'billing', label: 'Billing', icon: 'credit-card' },
]

const workspaceMenuItems = computed<MenuItem[]>(() => {
  if (currentWorkspace.value?.isPrivate) return []
  return [
    { id: 'members', label: 'Members', icon: 'users' },
    { id: 'settings', label: 'Workspace Settings', icon: 'cog' },
  ]
})

const appMenuItems: MenuItem[] = [
  { id: 'theme', label: 'Appearance', icon: 'palette' },
  { id: 'keyboard', label: 'Keyboard Shortcuts', icon: 'keyboard' },
  { id: 'help', label: 'Help & Support', icon: 'question-circle' },
]

function toggleTheme(): void {
  uiStore.toggleTheme()
}

function handleMenuItemClick(item: MenuItem): void {
  if (item.id === 'theme') {
    toggleTheme()
  } else if (item.route) {
    router.push(item.route)
  }
}
</script>

<template>
  <div class="flex h-full flex-col overflow-y-auto">
    <!-- User Profile Section -->
    <div class="border-b border-border p-4">
      <div class="flex items-center gap-3">
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
          JD
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-base font-medium text-foreground">John Doe</p>
          <p class="text-sm text-muted-foreground">john@example.com</p>
        </div>
        <button class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
          <Icon name="chevron-right" size="sm" />
        </button>
      </div>
    </div>

    <!-- Account Section -->
    <div class="border-b border-border p-4">
      <h2 class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Account</h2>
      <div class="flex flex-col gap-1">
        <button
          v-for="item in accountMenuItems"
          :key="item.id"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent"
          @click="handleMenuItemClick(item)"
        >
          <Icon :name="item.icon" size="sm" class="text-muted-foreground" />
          <span class="flex-1 text-sm text-foreground">{{ item.label }}</span>
          <span v-if="item.badge" class="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-medium text-primary-foreground">
            {{ item.badge }}
          </span>
          <Icon name="chevron-right" size="sm" class="text-muted-foreground" />
        </button>
      </div>
    </div>

    <!-- Workspace Section -->
    <div v-if="workspaceMenuItems.length > 0" class="border-b border-border p-4">
      <h2 class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Workspace</h2>
      <div class="flex flex-col gap-1">
        <button
          v-for="item in workspaceMenuItems"
          :key="item.id"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent"
          @click="handleMenuItemClick(item)"
        >
          <Icon :name="item.icon" size="sm" class="text-muted-foreground" />
          <span class="flex-1 text-sm text-foreground">{{ item.label }}</span>
          <Icon name="chevron-right" size="sm" class="text-muted-foreground" />
        </button>
      </div>
    </div>

    <!-- App Settings Section -->
    <div class="border-b border-border p-4">
      <h2 class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">App</h2>
      <div class="flex flex-col gap-1">
        <button
          v-for="item in appMenuItems"
          :key="item.id"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent"
          @click="handleMenuItemClick(item)"
        >
          <Icon :name="item.icon" size="sm" class="text-muted-foreground" />
          <span class="flex-1 text-sm text-foreground">{{ item.label }}</span>
          <template v-if="item.id === 'theme'">
            <span class="text-xs text-muted-foreground">{{ uiStore.themeMode === 'dark' ? 'Dark' : 'Light' }}</span>
          </template>
          <Icon name="chevron-right" size="sm" class="text-muted-foreground" />
        </button>
      </div>
    </div>

    <!-- Storage Usage -->
    <div class="border-b border-border p-4">
      <h2 class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Storage</h2>
      <div class="rounded-lg bg-accent/50 p-3">
        <div class="mb-2 flex items-center justify-between">
          <span class="text-sm text-foreground">2.4 GB used</span>
          <span class="text-xs text-muted-foreground">of 10 GB</span>
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-accent">
          <div class="h-full w-[24%] rounded-full bg-primary" />
        </div>
        <button class="mt-3 text-xs font-medium text-primary">Upgrade plan</button>
      </div>
    </div>

    <!-- Sign Out -->
    <div class="p-4">
      <button class="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
        <Icon name="sign-out" size="sm" />
        Sign out
      </button>
    </div>
  </div>
</template>
