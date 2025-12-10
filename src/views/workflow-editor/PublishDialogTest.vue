<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@/components/ui/icon'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

// States
const selectedView = ref<'creator' | 'consumer'>('creator')
const isPublished = ref(false)
const hasUnpublishedChanges = ref(false)
const isDialogOpen = ref(true)
const showNsfwWarning = ref(true)
const linkCopied = ref(false)
const includedExpanded = ref(false)

// Mock workflow data
const mockWorkflow = {
  id: 'wf-1',
  name: 'Portrait Generator Pro',
  description: 'High-quality portrait generation with SDXL and face enhancement',
  author: 'Alice Chen',
  nodeCount: 18,
  publishedUrl: 'https://comfy.org/w/abc123xyz',
  publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  lastEditedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
}

// Mock requirements
const requirements = [
  { name: 'SDXL Base 1.0', type: 'Checkpoint', hasIt: true },
  { name: 'SDXL VAE', type: 'VAE', hasIt: true },
  { name: 'ControlNet Canny', type: 'ControlNet', hasIt: false },
  { name: 'IPAdapter FaceID', type: 'IPAdapter', hasIt: true },
]

// Mock included content
const includedContent = ref({
  models: [
    { name: 'SDXL Base 1.0', size: '6.94 GB', type: 'Checkpoint', included: true },
    { name: 'SDXL VAE', size: '335 MB', type: 'VAE', included: true },
    { name: 'ControlNet Canny', size: '1.45 GB', type: 'ControlNet', included: true },
  ],
  files: [
    { name: 'input_portrait.png', size: '2.4 MB', type: 'Image', included: true },
    { name: 'style_reference.jpg', size: '856 KB', type: 'Image', included: false },
  ],
})

const includedItemsCount = computed(() => {
  return includedContent.value.models.filter(m => m.included).length +
         includedContent.value.files.filter(f => f.included).length
})

const totalItemsCount = computed(() => {
  return includedContent.value.models.length + includedContent.value.files.length
})

const publishedDate = computed(() => {
  return mockWorkflow.publishedAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})

function publish() {
  isPublished.value = true
  hasUnpublishedChanges.value = false
}

function republish() {
  hasUnpublishedChanges.value = false
}

function unpublish() {
  isPublished.value = false
  hasUnpublishedChanges.value = false
}

function simulateEdit() {
  if (isPublished.value) {
    hasUnpublishedChanges.value = true
  }
}

function copyUrl() {
  navigator.clipboard.writeText(mockWorkflow.publishedUrl)
  linkCopied.value = true
  setTimeout(() => {
    linkCopied.value = false
  }, 2000)
}

function dismissNsfwWarning() {
  showNsfwWarning.value = false
}

// Keyboard navigation
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    selectedView.value = selectedView.value === 'creator' ? 'consumer' : 'creator'
    if (selectedView.value === 'consumer') {
      showNsfwWarning.value = true
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="relative flex h-screen w-screen flex-col overflow-hidden bg-zinc-900">
    <!-- Header Controls -->
    <div class="border-b border-zinc-800 bg-zinc-900 px-4 py-3">
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-zinc-400">View as:</span>
        <div class="flex gap-1">
          <button
            class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            :class="selectedView === 'creator'
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'"
            @click="selectedView = 'creator'"
          >
            Creator (User A)
          </button>
          <button
            class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            :class="selectedView === 'consumer'
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'"
            @click="selectedView = 'consumer'; showNsfwWarning = true"
          >
            Consumer (User B)
          </button>
        </div>

        <span class="text-xs text-zinc-600">← → to switch</span>

        <!-- State Controls (Creator only) -->
        <div v-if="selectedView === 'creator'" class="ml-auto flex items-center gap-2">
          <span class="text-xs text-zinc-500">State:</span>
          <button
            class="rounded px-2 py-1 text-xs transition-colors"
            :class="!isPublished ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:bg-zinc-800'"
            @click="isPublished = false; hasUnpublishedChanges = false"
          >
            Draft
          </button>
          <button
            class="rounded px-2 py-1 text-xs transition-colors"
            :class="isPublished && !hasUnpublishedChanges ? 'bg-green-600 text-white' : 'text-zinc-500 hover:bg-zinc-800'"
            @click="isPublished = true; hasUnpublishedChanges = false"
          >
            Published
          </button>
          <button
            class="rounded px-2 py-1 text-xs transition-colors"
            :class="isPublished && hasUnpublishedChanges ? 'bg-amber-600 text-white' : 'text-zinc-500 hover:bg-zinc-800'"
            @click="isPublished = true; hasUnpublishedChanges = true"
          >
            Changed
          </button>
        </div>

        <button
          v-if="!isDialogOpen && selectedView === 'creator'"
          class="ml-auto rounded-md bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700"
          @click="isDialogOpen = true"
        >
          Open Dialog
        </button>
      </div>
    </div>

    <!-- Creator View: Publish Dialog -->
    <Dialog v-if="selectedView === 'creator'" :open="isDialogOpen" @update:open="isDialogOpen = $event">
      <DialogContent class="max-w-[480px] gap-0 p-0">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <div class="flex items-center gap-2">
            <h2 class="text-base font-semibold text-zinc-900 dark:text-foreground">
              Publish Workflow
            </h2>
            <span
              v-if="isPublished"
              class="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
              :class="hasUnpublishedChanges
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-green-500/20 text-green-400'"
            >
              <span class="h-1.5 w-1.5 rounded-full" :class="hasUnpublishedChanges ? 'bg-amber-400' : 'bg-green-400'" />
              {{ hasUnpublishedChanges ? 'Changes pending' : 'Published' }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <!-- Workflow Info -->
          <div class="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div class="flex items-start gap-3 p-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-700">
                <Icon name="workflow" size="lg" class="text-zinc-500" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-medium text-zinc-900 dark:text-foreground">{{ mockWorkflow.name }}</h3>
                <p class="mt-0.5 text-xs text-zinc-500">{{ mockWorkflow.nodeCount }} nodes</p>
              </div>
            </div>

            <!-- What's Included Dropdown -->
            <div class="border-t border-zinc-200 dark:border-zinc-700">
              <button
                class="flex w-full items-center justify-between px-3 py-2.5"
                @click="includedExpanded = !includedExpanded"
              >
                <div class="flex items-center gap-2">
                  <Icon name="archive" size="sm" class="text-zinc-400" />
                  <span class="text-xs font-medium text-zinc-600 dark:text-zinc-400">What's included</span>
                  <span class="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                    {{ includedItemsCount }}/{{ totalItemsCount }} items
                  </span>
                </div>
                <Icon
                  name="chevron-down"
                  size="sm"
                  class="text-zinc-400 transition-transform"
                  :class="{ 'rotate-180': includedExpanded }"
                />
              </button>

              <!-- Expanded Content -->
              <div v-if="includedExpanded" class="border-t border-zinc-200 px-3 py-2 dark:border-zinc-700">
                <!-- Models -->
                <div class="mb-2">
                  <p class="mb-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                    Models ({{ includedContent.models.filter(m => m.included).length }}/{{ includedContent.models.length }})
                  </p>
                  <div class="space-y-0.5">
                    <label
                      v-for="model in includedContent.models"
                      :key="model.name"
                      class="flex cursor-pointer items-center justify-between rounded px-1 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
                    >
                      <div class="flex items-center gap-2">
                        <input
                          v-model="model.included"
                          type="checkbox"
                          class="h-3.5 w-3.5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
                        />
                        <Icon name="box" size="xs" class="text-purple-500" />
                        <span
                          class="text-xs text-zinc-700 dark:text-zinc-300"
                          :class="{ 'text-zinc-400 line-through': !model.included }"
                        >{{ model.name }}</span>
                      </div>
                      <span class="text-[10px] text-zinc-400">{{ model.size }}</span>
                    </label>
                  </div>
                </div>

                <!-- Files -->
                <div>
                  <p class="mb-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                    Imported Files ({{ includedContent.files.filter(f => f.included).length }}/{{ includedContent.files.length }})
                  </p>
                  <div class="space-y-0.5">
                    <label
                      v-for="file in includedContent.files"
                      :key="file.name"
                      class="flex cursor-pointer items-center justify-between rounded px-1 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
                    >
                      <div class="flex items-center gap-2">
                        <input
                          v-model="file.included"
                          type="checkbox"
                          class="h-3.5 w-3.5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
                        />
                        <Icon name="image" size="xs" class="text-green-500" />
                        <span
                          class="text-xs text-zinc-700 dark:text-zinc-300"
                          :class="{ 'text-zinc-400 line-through': !file.included }"
                        >{{ file.name }}</span>
                      </div>
                      <span class="text-[10px] text-zinc-400">{{ file.size }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Not Published State -->
          <template v-if="!isPublished">
            <div class="mb-4 flex items-start gap-3 rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800/80">
              <Icon name="info-circle" size="sm" class="mt-0.5 shrink-0 text-zinc-400" />
              <div>
                <p class="text-sm text-zinc-700 dark:text-zinc-300">
                  This workflow is private
                </p>
                <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                  Publish to create a shareable link. Anyone with the link can view and fork.
                </p>
              </div>
            </div>

            <button
              class="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              @click="publish"
            >
              Publish Workflow
            </button>
          </template>

          <!-- Published State -->
          <template v-else>
            <!-- Published URL -->
            <div class="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
              <div class="flex items-center gap-2">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-200 dark:bg-zinc-700">
                  <Icon name="link" size="sm" class="text-zinc-500" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm text-zinc-600 dark:text-zinc-300">{{ mockWorkflow.publishedUrl }}</p>
                  <p class="text-[10px] text-zinc-400">Published {{ publishedDate }}</p>
                </div>
                <button
                  class="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                  :class="linkCopied
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'"
                  @click="copyUrl"
                >
                  {{ linkCopied ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>

            <!-- Unpublished Changes -->
            <div v-if="hasUnpublishedChanges" class="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
              <div class="flex items-start gap-2">
                <Icon name="exclamation-circle" size="sm" class="mt-0.5 shrink-0 text-amber-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-amber-300">Unpublished changes</p>
                  <p class="mt-0.5 text-xs text-amber-400/80">
                    Your edits aren't visible to others yet.
                  </p>
                </div>
              </div>
              <button
                class="mt-3 w-full rounded-lg bg-amber-600 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500"
                @click="republish"
              >
                Publish Changes
              </button>
            </div>

            <!-- Simulate Edit -->
            <button
              v-if="!hasUnpublishedChanges"
              class="mb-4 w-full rounded-lg border border-dashed border-zinc-600 py-2 text-xs text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-400"
              @click="simulateEdit"
            >
              (Click to simulate editing...)
            </button>

            <!-- Unpublish -->
            <button
              class="flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
              @click="unpublish"
            >
              <Icon name="x" size="sm" />
              Unpublish
            </button>
          </template>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Consumer View -->
    <div v-if="selectedView === 'consumer'" class="flex flex-1 items-center justify-center p-8">
      <div class="w-full max-w-md">
        <!-- NSFW Warning -->
        <div
          v-if="showNsfwWarning"
          class="rounded-xl border border-zinc-700 bg-zinc-800 p-5 shadow-xl"
        >
          <div class="mb-4 flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/20">
              <Icon name="exclamation-triangle" size="lg" class="text-amber-400" />
            </div>
            <h2 class="text-base font-semibold text-white">Content Warning</h2>
          </div>

          <p class="mb-4 text-sm text-zinc-400">
            This workflow may generate NSFW content. By continuing you confirm:
          </p>

          <ul class="mb-5 space-y-2 text-sm text-zinc-400">
            <li class="flex items-center gap-2">
              <Icon name="check" size="xs" class="text-zinc-500" />
              You are of legal age
            </li>
            <li class="flex items-center gap-2">
              <Icon name="check" size="xs" class="text-zinc-500" />
              You accept responsibility for generated content
            </li>
          </ul>

          <div class="flex gap-2">
            <button class="flex-1 rounded-lg border border-zinc-600 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700">
              Go Back
            </button>
            <button
              class="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              @click="dismissNsfwWarning"
            >
              Continue
            </button>
          </div>
        </div>

        <!-- Workflow Preview -->
        <div
          v-else
          class="rounded-xl border border-zinc-700 bg-zinc-800 p-5 shadow-xl"
        >
          <div class="mb-5 text-center">
            <div class="mx-auto mb-4 h-28 w-full rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
            <h2 class="text-lg font-semibold text-white">{{ mockWorkflow.name }}</h2>
            <p class="mt-1 text-sm text-zinc-500">by {{ mockWorkflow.author }}</p>
            <p class="mt-2 text-xs text-zinc-600">{{ mockWorkflow.nodeCount }} nodes</p>
          </div>

          <div class="mb-5 flex gap-2">
            <button class="flex-1 rounded-lg border border-zinc-600 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700">
              Open in Editor
            </button>
            <button class="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500">
              Fork to Library
            </button>
          </div>

          <div class="border-t border-zinc-700 pt-4">
            <p class="mb-3 text-xs font-medium text-zinc-500">Requirements</p>
            <div class="space-y-2">
              <div
                v-for="req in requirements"
                :key="req.name"
                class="flex items-center justify-between text-sm"
              >
                <div class="flex items-center gap-2">
                  <Icon
                    :name="req.hasIt ? 'check-circle' : 'exclamation-circle'"
                    size="sm"
                    :class="req.hasIt ? 'text-green-500' : 'text-amber-500'"
                  />
                  <span class="text-zinc-300">{{ req.name }}</span>
                </div>
                <span class="text-xs text-zinc-600">{{ req.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
