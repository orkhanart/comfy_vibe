<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FolderCard, PageBreadcrumb, ResourceListView } from '@/components/workspace'

const router = useRouter()

// View state
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('updated')
const showFavoritesOnly = ref(false)

const sortOptions = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'items', label: 'Item count' }
]

// Mock projects data
interface Project {
  id: string
  name: string
  description: string
  thumbnail?: string
  workflowCount: number
  assetCount: number
  modelCount: number
  updatedAt: string
  updatedTimestamp: number
  favorite?: boolean
}

const projects = ref<Project[]>([
  {
    id: 'proj-1',
    name: 'Marketing Campaign',
    description: 'Q4 2024 marketing visuals',
    workflowCount: 5,
    assetCount: 24,
    modelCount: 3,
    updatedAt: '2 hours ago',
    updatedTimestamp: Date.now() - 2 * 60 * 60 * 1000,
    favorite: true
  },
  {
    id: 'proj-2',
    name: 'Product Launch',
    description: 'New product imagery',
    workflowCount: 8,
    assetCount: 42,
    modelCount: 5,
    updatedAt: '1 day ago',
    updatedTimestamp: Date.now() - 24 * 60 * 60 * 1000,
    favorite: false
  },
  {
    id: 'proj-3',
    name: 'Social Media',
    description: 'Social content generation',
    workflowCount: 12,
    assetCount: 156,
    modelCount: 4,
    updatedAt: '3 days ago',
    updatedTimestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    favorite: true
  },
  {
    id: 'proj-4',
    name: 'Brand Assets',
    description: 'Company branding materials',
    workflowCount: 3,
    assetCount: 89,
    modelCount: 2,
    updatedAt: '1 week ago',
    updatedTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    favorite: false
  }
])

const filteredProjects = computed(() => {
  let result = projects.value

  if (showFavoritesOnly.value) {
    result = result.filter(p => p.favorite)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }

  return [...result].sort((a, b) => {
    switch (sortBy.value) {
      case 'name': return a.name.localeCompare(b.name)
      case 'items': return (b.workflowCount + b.assetCount + b.modelCount) - (a.workflowCount + a.assetCount + a.modelCount)
      default: return b.updatedTimestamp - a.updatedTimestamp
    }
  })
})

function openProject(projectId: string) {
  router.push(`/workspace/projects/${projectId}`)
}

function toggleFavorite(projectId: string) {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    project.favorite = !project.favorite
  }
}

// Create project dialog
const showCreateProject = ref(false)
const newProjectName = ref('')

function createProject() {
  if (newProjectName.value.trim()) {
    projects.value.unshift({
      id: `proj-${Date.now()}`,
      name: newProjectName.value.trim(),
      description: '',
      workflowCount: 0,
      assetCount: 0,
      modelCount: 0,
      updatedAt: 'Just now',
      updatedTimestamp: Date.now(),
      favorite: false
    })
    newProjectName.value = ''
    showCreateProject.value = false
  }
}
</script>

<template>
  <div class="h-full overflow-y-auto p-4">
    <!-- Header with Breadcrumb -->
    <div class="mb-4 flex min-h-[30px] items-center justify-between">
      <PageBreadcrumb label="Projects" icon="folder" />
    </div>

    <!-- Resource List -->
    <ResourceListView
      v-model:search-query="searchQuery"
      v-model:sort-by="sortBy"
      v-model:view-mode="viewMode"
      v-model:show-favorites-only="showFavoritesOnly"
      :sort-options="sortOptions"
      search-placeholder="Search projects..."
      primary-action-label="New Project"
      primary-action-icon="folder-plus"
      :show-new-folder="false"
      :is-empty="filteredProjects.length === 0"
      empty-icon="folder"
      empty-title="No projects found"
      :empty-description="searchQuery ? 'Try a different search term' : 'Create your first project to get started'"
      @primary-action="showCreateProject = true"
    >
      <template #grid>
        <FolderCard
          v-for="project in filteredProjects"
          :key="project.id"
          :folder="{ id: project.id, name: project.name }"
          :item-count="project.workflowCount + project.assetCount + project.modelCount"
          icon="folder"
          icon-class="text-blue-500 dark:text-blue-400"
          @open="openProject"
        />
      </template>
      <template #list>
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-muted/50"
          @click="openProject(project.id)"
        >
          <button
            :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors', project.favorite ? 'text-amber-500' : 'text-zinc-300 hover:text-amber-500 dark:text-zinc-600']"
            @click.stop="toggleFavorite(project.id)"
          >
            <Icon :name="project.favorite ? 'star-fill' : 'star'" size="sm" />
          </button>
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <Icon name="folder" size="lg" class="text-blue-500 dark:text-blue-400" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-medium text-zinc-900 dark:text-foreground">{{ project.name }}</p>
            <p class="mt-0.5 text-xs text-muted-foreground">{{ project.description || 'No description' }}</p>
          </div>
          <div class="flex items-center gap-3 text-xs text-muted-foreground">
            <span class="flex items-center gap-1">
              <Icon name="sitemap" size="xs" />
              {{ project.workflowCount }}
            </span>
            <span class="flex items-center gap-1">
              <Icon name="images" size="xs" />
              {{ project.assetCount }}
            </span>
            <span class="flex items-center gap-1">
              <Icon name="box" size="xs" />
              {{ project.modelCount }}
            </span>
          </div>
          <span class="text-xs text-zinc-400">{{ project.updatedAt }}</span>
        </div>
      </template>
    </ResourceListView>

    <!-- Create Project Dialog -->
    <Teleport to="body">
      <Transition name="dialog">
        <div
          v-if="showCreateProject"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          @click.self="showCreateProject = false"
        >
          <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-foreground">Create New Project</h3>
            <p class="mt-1 text-sm text-muted-foreground">Enter a name for your new project.</p>
            <input
              v-model="newProjectName"
              type="text"
              placeholder="Project name"
              class="mt-4 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-foreground"
              @keyup.enter="createProject"
            />
            <div class="mt-4 flex justify-end gap-2">
              <button class="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" @click="showCreateProject = false">Cancel</button>
              <button class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100" :disabled="!newProjectName.trim()" @click="createProject">Create</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.dialog-enter-active {
  transition: all 0.2s ease-out;
}

.dialog-leave-active {
  transition: all 0.15s ease-in;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style>
