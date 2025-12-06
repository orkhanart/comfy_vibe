<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'

const workspaceStore = useWorkspaceStore()
const currentWorkspace = computed(() => workspaceStore.currentWorkspace)

const searchQuery = ref('')

interface Project {
  id: string
  name: string
  itemCount: number
  thumbnail: string
  updatedAt: string
}

const privateProjects = ref<Project[]>([
  { id: 'p1', name: 'My First Project', itemCount: 12, thumbnail: '/assets/card_images/workflow_01.webp', updatedAt: '2 hours ago' },
  { id: 'p2', name: 'Personal Work', itemCount: 8, thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', updatedAt: '1 day ago' },
])

const teamProjects = ref<Project[]>([
  { id: 't1', name: 'Product Shots', itemCount: 24, thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', updatedAt: '3 hours ago' },
  { id: 't2', name: 'Brand Assets', itemCount: 56, thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', updatedAt: '5 hours ago' },
  { id: 't3', name: 'Marketing Campaign', itemCount: 18, thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', updatedAt: '1 day ago' },
])

const filteredPrivateProjects = computed(() => {
  if (!searchQuery.value) return privateProjects.value
  const query = searchQuery.value.toLowerCase()
  return privateProjects.value.filter(p => p.name.toLowerCase().includes(query))
})

const filteredTeamProjects = computed(() => {
  if (!searchQuery.value) return teamProjects.value
  const query = searchQuery.value.toLowerCase()
  return teamProjects.value.filter(p => p.name.toLowerCase().includes(query))
})
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <!-- Search Bar -->
    <div class="border-b border-border p-4">
      <div class="relative">
        <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search projects..."
          class="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary"
        />
      </div>
    </div>

    <!-- Projects List -->
    <div class="flex-1 overflow-y-auto">
      <!-- Private Projects Section -->
      <div class="p-4">
        <h2 class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Private</h2>
        <div class="flex flex-col gap-2">
          <div
            v-for="project in filteredPrivateProjects"
            :key="project.id"
            class="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <div class="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <img :src="project.thumbnail" :alt="project.name" class="h-full w-full object-cover" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-foreground">{{ project.name }}</p>
              <p class="text-xs text-muted-foreground">{{ project.itemCount }} items · {{ project.updatedAt }}</p>
            </div>
            <Icon name="chevron-right" size="sm" class="shrink-0 text-muted-foreground" />
          </div>
        </div>
      </div>

      <!-- Team Projects Section -->
      <div v-if="!currentWorkspace?.isPrivate" class="border-t border-border p-4">
        <h2 class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Workspace</h2>
        <div class="flex flex-col gap-2">
          <div
            v-for="project in filteredTeamProjects"
            :key="project.id"
            class="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <div class="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <img :src="project.thumbnail" :alt="project.name" class="h-full w-full object-cover" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-foreground">{{ project.name }}</p>
              <p class="text-xs text-muted-foreground">{{ project.itemCount }} items · {{ project.updatedAt }}</p>
            </div>
            <Icon name="chevron-right" size="sm" class="shrink-0 text-muted-foreground" />
          </div>
        </div>
      </div>

      <!-- Create New Project Button -->
      <div class="p-4 pt-0">
        <button class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
          <Icon name="plus" size="sm" />
          <span class="text-sm font-medium">New Project</span>
        </button>
      </div>
    </div>
  </div>
</template>
