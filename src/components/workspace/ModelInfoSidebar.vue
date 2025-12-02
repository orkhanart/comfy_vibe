<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { getModelIcon, getModelColor, getBaseModelColor, type Model } from '@/data/workspaceMockData'

interface Props {
  model: Model
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  apply: [id: string]
  delete: [id: string]
}>()

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
            <h2 class="text-lg font-semibold text-zinc-900 dark:text-foreground">Model Info</h2>
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
                v-if="model.thumbnail"
                :src="model.thumbnail"
                :alt="model.name"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full w-full items-center justify-center">
                <Icon :name="getModelIcon(model.type)" size="2xl" class="text-zinc-400" />
              </div>
            </div>

            <!-- Details -->
            <div class="p-5">
              <!-- Title & Type -->
              <div class="flex items-start gap-3">
                <div :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', getModelColor(model.type)]">
                  <Icon :name="getModelIcon(model.type)" size="md" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-zinc-900 dark:text-foreground">{{ model.name }}</h3>
                  <p class="mt-0.5 text-sm capitalize text-zinc-500 dark:text-zinc-400">{{ model.type }}</p>
                </div>
              </div>

              <!-- Badges -->
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  :class="[
                    'inline-flex items-center rounded px-2.5 py-1 text-sm font-medium',
                    getBaseModelColor(model.baseModel)
                  ]"
                >
                  {{ model.baseModel }}
                </span>
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium capitalize',
                    getModelColor(model.type)
                  ]"
                >
                  <Icon :name="getModelIcon(model.type)" size="sm" />
                  {{ model.type }}
                </span>
              </div>

              <!-- Info Grid -->
              <div class="mt-6 grid grid-cols-2 gap-4">
                <div class="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">Size</p>
                  <p class="mt-1 text-lg font-semibold text-zinc-900 dark:text-foreground">{{ model.size }}</p>
                </div>
                <div class="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">Version</p>
                  <p class="mt-1 text-lg font-semibold text-zinc-900 dark:text-foreground">v{{ model.version }}</p>
                </div>
                <div class="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">Base Model</p>
                  <p class="mt-1 text-lg font-semibold text-zinc-900 dark:text-foreground">{{ model.baseModel }}</p>
                </div>
                <div class="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">Last updated</p>
                  <p class="mt-1 text-lg font-semibold text-zinc-900 dark:text-foreground">{{ model.updatedAt }}</p>
                </div>
              </div>

              <!-- Model Details -->
              <div class="mt-6">
                <h4 class="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-foreground">
                  <Icon name="file" size="sm" />
                  Model Details
                </h4>
                <div class="mt-3 space-y-2 text-sm">
                  <div class="flex justify-between py-1.5">
                    <span class="text-zinc-500 dark:text-zinc-400">Model ID</span>
                    <span class="font-mono text-zinc-900 dark:text-foreground">{{ model.id }}</span>
                  </div>
                  <div class="flex justify-between border-t border-zinc-100 py-1.5 dark:border-zinc-800">
                    <span class="text-zinc-500 dark:text-zinc-400">Type</span>
                    <span class="capitalize text-zinc-900 dark:text-foreground">{{ model.type }}</span>
                  </div>
                  <div class="flex justify-between border-t border-zinc-100 py-1.5 dark:border-zinc-800">
                    <span class="text-zinc-500 dark:text-zinc-400">Format</span>
                    <span class="uppercase text-zinc-900 dark:text-foreground">SAFETENSORS</span>
                  </div>
                  <div class="flex justify-between border-t border-zinc-100 py-1.5 dark:border-zinc-800">
                    <span class="text-zinc-500 dark:text-zinc-400">Location</span>
                    <span class="truncate text-zinc-900 dark:text-foreground">/models/{{ model.type }}s/</span>
                  </div>
                </div>
              </div>

              <!-- Trigger Words (for LoRAs) -->
              <div v-if="model.triggerWords && model.triggerWords.length > 0" class="mt-6">
                <h4 class="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-foreground">
                  <Icon name="bolt" size="sm" />
                  Trigger Words
                </h4>
                <div class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="word in model.triggerWords"
                    :key="word"
                    class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                  >
                    {{ word }}
                  </span>
                </div>
                <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  Include these words in your prompt for best results
                </p>
              </div>

              <!-- Available Versions -->
              <div v-if="model.versions && model.versions.length > 0" class="mt-6">
                <h4 class="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-foreground">
                  <Icon name="history" size="sm" />
                  Available Versions
                </h4>
                <div class="mt-3 space-y-2">
                  <div
                    v-for="version in model.versions"
                    :key="version.id"
                    :class="[
                      'flex items-center gap-3 rounded-lg p-3 transition-colors',
                      version.isCurrent
                        ? 'bg-blue-50 ring-1 ring-blue-200 dark:bg-blue-500/10 dark:ring-blue-500/30'
                        : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800'
                    ]"
                  >
                    <div :class="[
                      'flex h-8 w-8 items-center justify-center rounded-lg',
                      version.isCurrent
                        ? 'bg-blue-100 dark:bg-blue-500/20'
                        : version.isInstalled
                          ? 'bg-green-100 dark:bg-green-500/20'
                          : 'bg-zinc-200 dark:bg-zinc-700'
                    ]">
                      <Icon
                        :name="version.isInstalled ? 'check' : 'download'"
                        size="sm"
                        :class="version.isCurrent
                          ? 'text-blue-600 dark:text-blue-400'
                          : version.isInstalled
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-zinc-500 dark:text-zinc-400'"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <p class="text-sm font-medium text-zinc-900 dark:text-foreground">v{{ version.version }}</p>
                        <span
                          v-if="version.isCurrent"
                          class="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                        >
                          Current
                        </span>
                        <span
                          v-else-if="version.isInstalled"
                          class="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-600 dark:bg-green-500/20 dark:text-green-400"
                        >
                          Installed
                        </span>
                      </div>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ version.size }} - {{ version.releaseDate }}</p>
                    </div>
                    <button
                      v-if="!version.isInstalled"
                      class="flex h-7 items-center gap-1.5 rounded-md bg-zinc-900 px-2.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                    >
                      <Icon name="download" size="xs" />
                      Get
                    </button>
                    <button
                      v-else-if="!version.isCurrent"
                      class="flex h-7 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      Use
                    </button>
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
                @click="emit('apply', model.id); emit('close')"
              >
                <Icon name="plus" size="sm" />
                Apply to Node
              </button>
              <button
                class="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <Icon name="edit" size="sm" />
              </button>
              <button
                v-if="model.source === 'imported'"
                class="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-red-500 transition-colors hover:bg-red-50 dark:border-zinc-700 dark:hover:bg-red-500/10"
                @click="emit('delete', model.id)"
              >
                <Icon name="trash" size="sm" />
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
