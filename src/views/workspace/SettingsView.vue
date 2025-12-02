<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const workspaceId = computed(() => route.params.workspaceId as string)
const isTeam = computed(() => workspaceId.value === 'team')

// Active section
type Section = 'general' | 'appearance' | 'notifications' | 'api'
const activeSection = ref<Section>('general')

// Settings state
const settings = ref({
  workspaceName: workspaceId.value,
  autoSave: true,
  autoSaveInterval: 5,
  theme: 'system' as 'light' | 'dark' | 'system',
  gridSize: 20,
  snapToGrid: true,
  showMinimap: true,
  emailNotifications: true,
  pushNotifications: false
})

const sections = computed(() => {
  const base = [
    { id: 'general' as Section, label: 'General', icon: 'cog' },
    { id: 'appearance' as Section, label: 'Appearance', icon: 'palette' },
    { id: 'notifications' as Section, label: 'Notifications', icon: 'bell' },
    { id: 'api' as Section, label: 'API Keys', icon: 'key' }
  ]
  return base
})
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-foreground">
        Settings
      </h1>
      <p class="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
        Manage your {{ isTeam ? 'team' : 'workspace' }} settings
      </p>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-6 border-b border-zinc-200 dark:border-border">
      <nav class="flex gap-1">
        <button
          v-for="section in sections"
          :key="section.id"
          :class="[
            'flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
            activeSection === section.id
              ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-foreground'
              : 'border-transparent text-muted-foreground hover:border-zinc-300 hover:text-zinc-700 dark:text-muted-foreground dark:hover:border-zinc-600 dark:hover:text-foreground'
          ]"
          @click="activeSection = section.id"
        >
          <Icon :name="section.icon" size="sm" />
          {{ section.label }}
        </button>
      </nav>
    </div>

    <!-- Content -->
    <div class="max-w-2xl">
        <!-- General Settings -->
        <div v-if="activeSection === 'general'" class="space-y-6">
          <div class="rounded-lg border border-zinc-200 bg-white p-6 dark:border-border dark:bg-card">
            <h2 class="text-lg font-medium text-zinc-900 dark:text-foreground">General</h2>
            <p class="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">Basic workspace settings</p>

            <div class="mt-6 space-y-4">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-zinc-700 dark:text-foreground">Workspace Name</label>
                <input
                  v-model="settings.workspaceName"
                  type="text"
                  class="w-full max-w-md rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground"
                />
              </div>

              <div class="flex items-center justify-between py-2">
                <div>
                  <p class="text-sm font-medium text-zinc-700 dark:text-foreground">Auto-save</p>
                  <p class="text-sm text-muted-foreground dark:text-muted-foreground">Automatically save your work</p>
                </div>
                <button
                  :class="[
                    'relative h-6 w-11 rounded-full transition-colors',
                    settings.autoSave ? 'bg-card dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-700'
                  ]"
                  @click="settings.autoSave = !settings.autoSave"
                >
                  <span
                    :class="[
                      'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform dark:bg-card',
                      settings.autoSave ? 'left-[22px]' : 'left-0.5'
                    ]"
                  />
                </button>
              </div>

              <div v-if="settings.autoSave" class="flex flex-col gap-2">
                <label class="text-sm font-medium text-zinc-700 dark:text-foreground">Auto-save interval (minutes)</label>
                <input
                  v-model.number="settings.autoSaveInterval"
                  type="number"
                  min="1"
                  max="30"
                  class="w-24 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Appearance Settings -->
        <div v-if="activeSection === 'appearance'" class="space-y-6">
          <div class="rounded-lg border border-zinc-200 bg-white p-6 dark:border-border dark:bg-card">
            <h2 class="text-lg font-medium text-zinc-900 dark:text-foreground">Appearance</h2>
            <p class="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">Customize how the app looks</p>

            <div class="mt-6 space-y-4">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-zinc-700 dark:text-foreground">Theme</label>
                <div class="flex gap-2">
                  <button
                    v-for="theme in ['light', 'dark', 'system'] as const"
                    :key="theme"
                    :class="[
                      'rounded-md border px-4 py-2 text-sm capitalize transition-colors',
                      settings.theme === theme
                        ? 'border-zinc-900 bg-card text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                        : 'border-zinc-200 text-muted-foreground/50 hover:border-zinc-300 dark:border-border dark:text-muted-foreground dark:hover:border-zinc-600'
                    ]"
                    @click="settings.theme = theme"
                  >
                    {{ theme }}
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between py-2">
                <div>
                  <p class="text-sm font-medium text-zinc-700 dark:text-foreground">Snap to Grid</p>
                  <p class="text-sm text-muted-foreground dark:text-muted-foreground">Align nodes to the grid</p>
                </div>
                <button
                  :class="[
                    'relative h-6 w-11 rounded-full transition-colors',
                    settings.snapToGrid ? 'bg-card dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-700'
                  ]"
                  @click="settings.snapToGrid = !settings.snapToGrid"
                >
                  <span
                    :class="[
                      'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform dark:bg-card',
                      settings.snapToGrid ? 'left-[22px]' : 'left-0.5'
                    ]"
                  />
                </button>
              </div>

              <div class="flex items-center justify-between py-2">
                <div>
                  <p class="text-sm font-medium text-zinc-700 dark:text-foreground">Show Minimap</p>
                  <p class="text-sm text-muted-foreground dark:text-muted-foreground">Display minimap in node editor</p>
                </div>
                <button
                  :class="[
                    'relative h-6 w-11 rounded-full transition-colors',
                    settings.showMinimap ? 'bg-card dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-700'
                  ]"
                  @click="settings.showMinimap = !settings.showMinimap"
                >
                  <span
                    :class="[
                      'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform dark:bg-card',
                      settings.showMinimap ? 'left-[22px]' : 'left-0.5'
                    ]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications Settings -->
        <div v-if="activeSection === 'notifications'" class="space-y-6">
          <div class="rounded-lg border border-zinc-200 bg-white p-6 dark:border-border dark:bg-card">
            <h2 class="text-lg font-medium text-zinc-900 dark:text-foreground">Notifications</h2>
            <p class="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">Manage your notification preferences</p>

            <div class="mt-6 space-y-4">
              <div class="flex items-center justify-between py-2">
                <div>
                  <p class="text-sm font-medium text-zinc-700 dark:text-foreground">Email Notifications</p>
                  <p class="text-sm text-muted-foreground dark:text-muted-foreground">Receive updates via email</p>
                </div>
                <button
                  :class="[
                    'relative h-6 w-11 rounded-full transition-colors',
                    settings.emailNotifications ? 'bg-card dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-700'
                  ]"
                  @click="settings.emailNotifications = !settings.emailNotifications"
                >
                  <span
                    :class="[
                      'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform dark:bg-card',
                      settings.emailNotifications ? 'left-[22px]' : 'left-0.5'
                    ]"
                  />
                </button>
              </div>

              <div class="flex items-center justify-between py-2">
                <div>
                  <p class="text-sm font-medium text-zinc-700 dark:text-foreground">Push Notifications</p>
                  <p class="text-sm text-muted-foreground dark:text-muted-foreground">Receive browser push notifications</p>
                </div>
                <button
                  :class="[
                    'relative h-6 w-11 rounded-full transition-colors',
                    settings.pushNotifications ? 'bg-card dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-700'
                  ]"
                  @click="settings.pushNotifications = !settings.pushNotifications"
                >
                  <span
                    :class="[
                      'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform dark:bg-card',
                      settings.pushNotifications ? 'left-[22px]' : 'left-0.5'
                    ]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- API Keys Settings -->
        <div v-if="activeSection === 'api'" class="space-y-6">
          <div class="rounded-lg border border-zinc-200 bg-white p-6 dark:border-border dark:bg-card">
            <h2 class="text-lg font-medium text-zinc-900 dark:text-foreground">API Keys</h2>
            <p class="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">Manage your API keys for external integrations</p>

            <div class="mt-6">
              <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-12 dark:border-border">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-muted">
                  <Icon name="key" size="xl" class="text-muted-foreground" />
                </div>
                <h3 class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">No API keys yet</h3>
                <p class="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">Create an API key to get started</p>
                <button
                  class="mt-4 inline-flex items-center gap-2 rounded-md bg-card px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-muted dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <Icon name="plus" size="xs" />
                  Create API Key
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
