<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import type { Workflow } from './WorkflowCard.vue'

interface Props {
  workflow: Workflow
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  open: [id: string]
  toggleFavorite: [id: string]
}>()

// Mock version history
const versions = [
  { version: 'v3', label: 'Current version', date: 'updatedAt', isLatest: true },
  { version: 'v2', label: 'Added upscale node', date: '3 days ago', isLatest: false },
  { version: 'v1', label: 'Initial version', date: '1 week ago', isLatest: false }
]

// Mock used models
const usedModels = [
  { name: 'SDXL Base 1.0', type: 'Checkpoint', color: 'orange' },
  { name: 'Detail Tweaker LoRA', type: 'LoRA', color: 'pink' }
]
</script>

<template>
  <Teleport to="body">
    <Transition name="sidebar">
      <div class="fixed inset-0 z-50 flex justify-end">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/30" @click="emit('close')" />

        <!-- Sidebar -->
        <div class="relative z-10 flex h-full w-96 flex-col bg-white shadow-2xl dark:bg-zinc-900">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
            <h2 class="text-lg font-semibold text-zinc-900 dark:text-foreground">File Info</h2>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-white"
              @click="emit('close')"
            >
              <Icon name="times" size="md" />
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto">
            <!-- Preview -->
            <div class="aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <img
                :src="workflow.thumbnail"
                :alt="workflow.name"
                class="h-full w-full object-cover"
              />
            </div>

            <!-- Details -->
            <div class="p-5">
              <!-- Title & Favorite -->
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/20">
                  <Icon name="sitemap" size="md" class="text-purple-600 dark:text-purple-400" />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-zinc-900 dark:text-foreground">{{ workflow.name }}</h3>
                  <p class="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{{ workflow.description }}</p>
                </div>
                <button
                  :class="[
                    'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                    workflow.favorite
                      ? 'text-amber-500'
                      : 'text-zinc-300 hover:text-amber-500 dark:text-zinc-600'
                  ]"
                  @click="emit('toggleFavorite', workflow.id)"
                >
                  <Icon :name="workflow.favorite ? 'star-fill' : 'star'" size="md" />
                </button>
              </div>

              <!-- Tags -->
              <div class="mt-4 flex flex-wrap gap-1.5">
                <span
                  v-for="tag in workflow.tags"
                  :key="tag"
                  class="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Info Grid -->
              <div class="mt-6 grid grid-cols-2 gap-4">
                <div class="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">Nodes</p>
                  <p class="mt-1 text-lg font-semibold text-zinc-900 dark:text-foreground">{{ workflow.nodeCount }}</p>
                </div>
                <div class="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">Runtime</p>
                  <p class="mt-1 text-lg font-semibold text-zinc-900 dark:text-foreground">{{ workflow.runtime }}</p>
                </div>
                <div class="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">Cost per run</p>
                  <p class="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">{{ workflow.cost }}</p>
                </div>
                <div class="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">Last updated</p>
                  <p class="mt-1 text-lg font-semibold text-zinc-900 dark:text-foreground">{{ workflow.updatedAt }}</p>
                </div>
              </div>

              <!-- Version History -->
              <div class="mt-6">
                <h4 class="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-foreground">
                  <Icon name="history" size="sm" />
                  Version History
                </h4>
                <div class="mt-3 space-y-2">
                  <div
                    v-for="ver in versions"
                    :key="ver.version"
                    :class="[
                      'flex items-center gap-3 rounded-lg p-3',
                      ver.isLatest ? 'bg-zinc-50 dark:bg-zinc-800/50' : 'transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    ]"
                  >
                    <div
                      :class="[
                        'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                        ver.isLatest
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      ]"
                    >
                      {{ ver.version }}
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-zinc-900 dark:text-foreground">{{ ver.label }}</p>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">
                        {{ ver.date === 'updatedAt' ? workflow.updatedAt : ver.date }}
                      </p>
                    </div>
                    <span
                      v-if="ver.isLatest"
                      class="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                    >
                      Latest
                    </span>
                    <button
                      v-else
                      class="text-xs text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              </div>

              <!-- File Details -->
              <div class="mt-6">
                <h4 class="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-foreground">
                  <Icon name="file" size="sm" />
                  File Details
                </h4>
                <div class="mt-3 space-y-2 text-sm">
                  <div class="flex justify-between py-1.5">
                    <span class="text-zinc-500 dark:text-zinc-400">File ID</span>
                    <span class="font-mono text-zinc-900 dark:text-foreground">{{ workflow.id }}</span>
                  </div>
                  <div class="flex justify-between border-t border-zinc-100 py-1.5 dark:border-zinc-800">
                    <span class="text-zinc-500 dark:text-zinc-400">File size</span>
                    <span class="text-zinc-900 dark:text-foreground">24.5 KB</span>
                  </div>
                  <div class="flex justify-between border-t border-zinc-100 py-1.5 dark:border-zinc-800">
                    <span class="text-zinc-500 dark:text-zinc-400">Created</span>
                    <span class="text-zinc-900 dark:text-foreground">Nov 15, 2024</span>
                  </div>
                  <div class="flex justify-between border-t border-zinc-100 py-1.5 dark:border-zinc-800">
                    <span class="text-zinc-500 dark:text-zinc-400">Modified</span>
                    <span class="text-zinc-900 dark:text-foreground">{{ workflow.updatedAt }}</span>
                  </div>
                  <div class="flex justify-between border-t border-zinc-100 py-1.5 dark:border-zinc-800">
                    <span class="text-zinc-500 dark:text-zinc-400">Location</span>
                    <span class="truncate text-zinc-900 dark:text-foreground">/workflows/</span>
                  </div>
                </div>
              </div>

              <!-- Used Models -->
              <div class="mt-6">
                <h4 class="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-foreground">
                  <Icon name="cube" size="sm" />
                  Used Models
                </h4>
                <div class="mt-3 space-y-2">
                  <div
                    v-for="model in usedModels"
                    :key="model.name"
                    class="flex items-center gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50"
                  >
                    <div
                      :class="[
                        'flex h-8 w-8 items-center justify-center rounded-lg',
                        model.color === 'orange'
                          ? 'bg-orange-100 dark:bg-orange-500/20'
                          : 'bg-pink-100 dark:bg-pink-500/20'
                      ]"
                    >
                      <Icon
                        name="cube"
                        size="sm"
                        :class="model.color === 'orange'
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-pink-600 dark:text-pink-400'"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="truncate text-sm font-medium text-zinc-900 dark:text-foreground">{{ model.name }}</p>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ model.type }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="border-t border-zinc-200 p-4 dark:border-zinc-800">
            <div class="flex gap-2">
              <button
                class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                @click="emit('open', workflow.id); emit('close')"
              >
                <Icon name="external-link" size="sm" />
                Open Workflow
              </button>
              <button
                class="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <Icon name="share" size="sm" />
              </button>
              <button
                class="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <Icon name="download" size="sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.3s ease;
}

.sidebar-enter-active > div:first-child,
.sidebar-leave-active > div:first-child {
  transition: opacity 0.3s ease;
}

.sidebar-enter-active > div:last-child,
.sidebar-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.sidebar-enter-from > div:first-child,
.sidebar-leave-to > div:first-child {
  opacity: 0;
}

.sidebar-enter-from > div:last-child,
.sidebar-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
