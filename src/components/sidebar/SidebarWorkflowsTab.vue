<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'
import { WORKFLOWS_DATA, createSharedWorkflowsData, TEAM_MEMBERS_DATA } from '@/data/sidebarMockData'

const props = defineProps<{
  viewMode: 'list' | 'grid'
}>()

const activeTab = ref<'shared' | 'private'>('shared')

const sharedWorkflows = createSharedWorkflowsData(TEAM_MEMBERS_DATA)
const privateWorkflows = WORKFLOWS_DATA
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Shared/Private Tabs -->
    <div class="flex items-center gap-1 border-b border-border px-2 py-1.5">
      <button
        class="rounded px-2 py-1 text-[11px] font-medium transition-colors"
        :class="[
          activeTab === 'shared'
            ? 'bg-accent text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        ]"
        @click="activeTab = 'shared'"
      >
        <span class="flex items-center gap-1">
          <Icon name="users" size="xs" />
          Shared
        </span>
      </button>
      <button
        class="rounded px-2 py-1 text-[11px] font-medium transition-colors"
        :class="[
          activeTab === 'private'
            ? 'bg-accent text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        ]"
        @click="activeTab = 'private'"
      >
        <span class="flex items-center gap-1">
          <Icon name="lock" size="xs" />
          Private
        </span>
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-2">
      <!-- Shared Workflows -->
      <template v-if="activeTab === 'shared'">
        <!-- List View -->
        <div v-if="viewMode === 'list'" class="space-y-0.5">
          <div
            v-for="workflow in sharedWorkflows"
            :key="workflow.id"
            class="group flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
          >
            <!-- Icon -->
            <div class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-gradient-to-br from-blue-900/30 to-purple-900/30">
              <Icon name="sitemap" size="xs" class="text-muted-foreground" />
            </div>
            <!-- Info -->
            <div class="min-w-0 flex-1">
              <div class="truncate text-xs font-medium text-foreground">{{ workflow.name }}</div>
              <div class="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span>{{ workflow.author.name }}</span>
                <span>·</span>
                <span>{{ workflow.nodes }} nodes</span>
              </div>
            </div>
            <!-- Actions -->
            <button
              v-tooltip.left="{ value: 'Add to Canvas', showDelay: 50 }"
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-600 text-white opacity-0 transition-all hover:bg-blue-500 group-hover:opacity-100"
            >
              <Icon name="plus" size="xs" />
            </button>
          </div>
        </div>

        <!-- Grid View -->
        <div v-else class="space-y-2">
          <div
            v-for="workflow in sharedWorkflows"
            :key="workflow.id"
            class="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-border hover:bg-muted/50"
          >
            <!-- Thumbnail -->
            <div class="relative aspect-video bg-background">
              <img
                v-if="workflow.thumbnail"
                :src="workflow.thumbnail"
                :alt="workflow.name"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-900/30 to-purple-900/30">
                <Icon name="sitemap" size="2xl" class="text-muted-foreground" />
              </div>
              <button
                v-tooltip.left="{ value: 'Share', showDelay: 50 }"
                class="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded bg-muted/90 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Icon name="share-alt" size="xs" />
              </button>
              <div class="absolute bottom-1.5 left-1.5 rounded bg-card/80 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {{ workflow.nodes }} nodes
              </div>
            </div>
            <!-- Info -->
            <div class="flex items-center justify-between px-2.5 py-2">
              <div class="min-w-0 flex-1">
                <div class="truncate text-xs font-medium text-foreground">{{ workflow.name }}</div>
                <div class="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span>{{ workflow.author.name }}</span>
                  <span>·</span>
                  <span>{{ workflow.updatedAt }}</span>
                </div>
              </div>
              <button
                v-tooltip.left="{ value: 'Add to Canvas', showDelay: 50 }"
                class="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-600 text-white transition-all hover:bg-blue-500"
              >
                <Icon name="plus" size="xs" />
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="sharedWorkflows.length === 0" class="flex h-full flex-col items-center justify-center py-8">
          <Icon name="users" size="xl" class="mb-2 text-muted-foreground/15" />
          <p class="text-xs text-muted-foreground/60">No shared workflows</p>
        </div>
      </template>

      <!-- Private Workflows -->
      <template v-else>
        <!-- List View -->
        <div v-if="viewMode === 'list'" class="space-y-0.5">
          <div
            v-for="workflow in privateWorkflows"
            :key="workflow.name"
            class="group flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
          >
            <!-- Thumbnail -->
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded"
              :class="{
                'bg-gradient-to-br from-blue-900/30 to-purple-900/30': workflow.thumbnail === 'txt2img',
                'bg-gradient-to-br from-green-900/30 to-teal-900/30': workflow.thumbnail === 'img2img',
                'bg-gradient-to-br from-orange-900/30 to-red-900/30': workflow.thumbnail === 'controlnet',
                'bg-gradient-to-br from-violet-900/30 to-pink-900/30': workflow.thumbnail === 'sdxl',
                'bg-gradient-to-br from-cyan-900/30 to-blue-900/30': workflow.thumbnail === 'inpaint',
              }"
            >
              <Icon name="sitemap" size="xs" class="text-muted-foreground" />
            </div>
            <!-- Info -->
            <div class="min-w-0 flex-1">
              <div class="truncate text-xs font-medium text-foreground">{{ workflow.name }}</div>
              <div class="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span>{{ workflow.date }}</span>
                <span>·</span>
                <span>{{ workflow.nodes }} nodes</span>
              </div>
            </div>
            <!-- Actions -->
            <button
              v-tooltip.left="{ value: 'Add to Canvas', showDelay: 50 }"
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-600 text-white opacity-0 transition-all hover:bg-blue-500 group-hover:opacity-100"
            >
              <Icon name="plus" size="xs" />
            </button>
          </div>
        </div>

        <!-- Grid View -->
        <div v-else class="space-y-2">
          <div
            v-for="workflow in privateWorkflows"
            :key="workflow.name"
            class="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-border hover:bg-muted/50"
          >
            <!-- Thumbnail -->
            <div class="relative aspect-video bg-background">
              <div
                class="absolute inset-0 flex items-center justify-center"
                :class="{
                  'bg-gradient-to-br from-blue-900/30 to-purple-900/30': workflow.thumbnail === 'txt2img',
                  'bg-gradient-to-br from-green-900/30 to-teal-900/30': workflow.thumbnail === 'img2img',
                  'bg-gradient-to-br from-orange-900/30 to-red-900/30': workflow.thumbnail === 'controlnet',
                  'bg-gradient-to-br from-violet-900/30 to-pink-900/30': workflow.thumbnail === 'sdxl',
                  'bg-gradient-to-br from-cyan-900/30 to-blue-900/30': workflow.thumbnail === 'inpaint',
                }"
              >
                <Icon name="sitemap" size="2xl" class="text-muted-foreground" />
              </div>
              <button
                v-tooltip.left="{ value: 'Share', showDelay: 50 }"
                class="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded bg-muted/90 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Icon name="share-alt" size="xs" />
              </button>
              <div class="absolute bottom-1.5 left-1.5 rounded bg-card/80 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {{ workflow.nodes }} nodes
              </div>
            </div>
            <!-- Info -->
            <div class="flex items-center justify-between px-2.5 py-2">
              <div class="min-w-0 flex-1">
                <div class="truncate text-xs font-medium text-foreground">{{ workflow.name }}</div>
                <div class="mt-0.5 text-[10px] text-muted-foreground">{{ workflow.date }}</div>
              </div>
              <button
                v-tooltip.left="{ value: 'Add to Canvas', showDelay: 50 }"
                class="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-600 text-white transition-all hover:bg-blue-500"
              >
                <Icon name="plus" size="xs" />
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="privateWorkflows.length === 0" class="flex h-full flex-col items-center justify-center py-8">
          <Icon name="lock" size="xl" class="mb-2 text-muted-foreground/15" />
          <p class="text-xs text-muted-foreground/60">No private workflows</p>
        </div>
      </template>
    </div>
  </div>
</template>
