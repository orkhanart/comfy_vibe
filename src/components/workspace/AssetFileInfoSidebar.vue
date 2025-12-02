<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { getAssetIcon, type Asset } from '@/data/workspaceMockData'

interface Props {
  asset: Asset
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  view: [id: string]
  download: [id: string]
}>()

// Mock created by workflow (for generated assets)
const createdByWorkflow = { id: 'wf-3', name: 'AI Image Generator', nodeCount: 15 }

// Mock usage in workflows
const usedInWorkflows = [
  { id: 'wf-1', name: 'Portrait Enhancement', nodeCount: 12 },
  { id: 'wf-2', name: 'Product Photography', nodeCount: 8 }
]
</script>

<template>
  <Transition name="sidebar">
    <!-- Sidebar -->
    <div class="flex h-full w-96 shrink-0 flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
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
            <div class="aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <img
                :src="asset.thumbnail"
                :alt="asset.name"
                class="h-full w-full object-contain"
              />
            </div>

            <!-- Details -->
            <div class="p-5">
              <!-- Title & Type -->
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/20">
                  <Icon :name="getAssetIcon(asset.type)" size="md" class="text-blue-600 dark:text-blue-400" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-zinc-900 dark:text-foreground">{{ asset.name }}</h3>
                  <p class="mt-0.5 text-sm capitalize text-zinc-500 dark:text-zinc-400">{{ asset.type }}</p>
                </div>
              </div>

              <!-- Source Badge -->
              <div class="mt-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium capitalize',
                    asset.source === 'generated'
                      ? 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400'
                      : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                  ]"
                >
                  <Icon :name="asset.source === 'generated' ? 'magic' : 'upload'" size="sm" />
                  {{ asset.source }}
                </span>
              </div>

              <!-- Info Grid -->
              <div class="mt-6 grid grid-cols-2 gap-4">
                <div class="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">Dimensions</p>
                  <p class="mt-1 text-lg font-semibold text-zinc-900 dark:text-foreground">{{ asset.dimensions }}</p>
                </div>
                <div class="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">File Size</p>
                  <p class="mt-1 text-lg font-semibold text-zinc-900 dark:text-foreground">{{ asset.size }}</p>
                </div>
                <div class="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">Type</p>
                  <p class="mt-1 text-lg font-semibold capitalize text-zinc-900 dark:text-foreground">{{ asset.type }}</p>
                </div>
                <div class="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">Last updated</p>
                  <p class="mt-1 text-lg font-semibold text-zinc-900 dark:text-foreground">{{ asset.updatedAt }}</p>
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
                    <span class="font-mono text-zinc-900 dark:text-foreground">{{ asset.id }}</span>
                  </div>
                  <div class="flex justify-between border-t border-zinc-100 py-1.5 dark:border-zinc-800">
                    <span class="text-zinc-500 dark:text-zinc-400">Format</span>
                    <span class="uppercase text-zinc-900 dark:text-foreground">{{ asset.type === 'image' ? 'PNG' : asset.type === 'video' ? 'MP4' : 'WAV' }}</span>
                  </div>
                  <div class="flex justify-between border-t border-zinc-100 py-1.5 dark:border-zinc-800">
                    <span class="text-zinc-500 dark:text-zinc-400">Created</span>
                    <span class="text-zinc-900 dark:text-foreground">Nov 20, 2024</span>
                  </div>
                  <div class="flex justify-between border-t border-zinc-100 py-1.5 dark:border-zinc-800">
                    <span class="text-zinc-500 dark:text-zinc-400">Modified</span>
                    <span class="text-zinc-900 dark:text-foreground">{{ asset.updatedAt }}</span>
                  </div>
                  <div class="flex justify-between border-t border-zinc-100 py-1.5 dark:border-zinc-800">
                    <span class="text-zinc-500 dark:text-zinc-400">Location</span>
                    <span class="truncate text-zinc-900 dark:text-foreground">/assets/{{ asset.type }}s/</span>
                  </div>
                </div>
              </div>

              <!-- Created with Workflow (for generated assets) -->
              <div v-if="asset.source === 'generated'" class="mt-6">
                <h4 class="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-foreground">
                  <Icon name="magic" size="sm" />
                  Created with
                </h4>
                <div class="mt-3">
                  <div
                    class="flex cursor-pointer items-center gap-3 rounded-lg bg-violet-50 p-3 transition-colors hover:bg-violet-100 dark:bg-violet-500/10 dark:hover:bg-violet-500/20"
                  >
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/20">
                      <Icon name="sitemap" size="sm" class="text-violet-600 dark:text-violet-400" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="truncate text-sm font-medium text-zinc-900 dark:text-foreground">{{ createdByWorkflow.name }}</p>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ createdByWorkflow.nodeCount }} nodes</p>
                    </div>
                    <Icon name="chevron-right" size="sm" class="text-violet-400" />
                  </div>
                </div>
              </div>

              <!-- Used in Workflows -->
              <div class="mt-6">
                <h4 class="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-foreground">
                  <Icon name="sitemap" size="sm" />
                  Used in Workflows
                </h4>
                <div class="mt-3 space-y-2">
                  <div
                    v-for="workflow in usedInWorkflows"
                    :key="workflow.id"
                    class="flex items-center gap-3 rounded-lg bg-zinc-50 p-3 transition-colors hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                  >
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/20">
                      <Icon name="sitemap" size="sm" class="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="truncate text-sm font-medium text-zinc-900 dark:text-foreground">{{ workflow.name }}</p>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ workflow.nodeCount }} nodes</p>
                    </div>
                    <Icon name="chevron-right" size="sm" class="text-zinc-400" />
                  </div>
                </div>
                <p v-if="usedInWorkflows.length === 0" class="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                  Not used in any workflows yet
                </p>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="border-t border-zinc-200 p-4 dark:border-zinc-800">
            <div class="flex gap-2">
              <button
                class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                @click="emit('view', asset.id); emit('close')"
              >
                <Icon name="eye" size="sm" />
                View Full Size
              </button>
              <button
                class="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                @click="emit('download', asset.id)"
              >
                <Icon name="download" size="sm" />
              </button>
              <button
                class="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <Icon name="link" size="sm" />
              </button>
            </div>
          </div>
    </div>
  </Transition>
</template>

<style scoped>
.sidebar-enter-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.sidebar-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(100%);
}
</style>
