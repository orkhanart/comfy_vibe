<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import {
  WorkflowCard,
  ModelCard,
  AssetCard,
  TemplateCard,
  WorkspaceCard,
  FolderCard,
} from '@/components/workspace'
import {
  MOCK_WORKFLOWS,
  MOCK_MODELS,
  MOCK_ASSETS,
  MOCK_TEMPLATES,
  MOCK_FOLDERS,
} from '@/data/workspaceMockData'

// Sample data for each card type
const sampleWorkflow = MOCK_WORKFLOWS[0]
const sampleModel = MOCK_MODELS[0]
const sampleAsset = MOCK_ASSETS[0]
const sampleTemplate = MOCK_TEMPLATES[0]
const sampleFolder = MOCK_FOLDERS[0]

// Project folder cards data (using FolderCard format)
// Native folders use blue/slate color to indicate they're system folders (can't be deleted)
const projectFolders = [
  { id: 'workflows', name: 'Workflows', icon: 'sitemap', iconClass: 'text-blue-500 dark:text-blue-400', count: 5 },
  { id: 'models', name: 'Models', icon: 'box', iconClass: 'text-blue-500 dark:text-blue-400', count: 12 },
  { id: 'assets', name: 'Assets', icon: 'images', iconClass: 'text-blue-500 dark:text-blue-400', count: 24 },
]

function handleAction(action: string, id?: string) {
  console.log(`Action: ${action}`, id)
}
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-foreground">
        Card Designs
      </h1>
      <p class="mt-1 text-sm text-muted-foreground">
        All card component designs in one place for comparison and adjustment
      </p>
    </div>

    <!-- Workflow Card -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">WorkflowCard</h2>
      <p class="mb-4 text-sm text-muted-foreground">Used in: Workflows page, Project view</p>
      <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
        <WorkflowCard
          :workflow="sampleWorkflow"
          @open="handleAction('open', $event)"
          @toggle-favorite="handleAction('toggleFavorite', $event)"
          @open-menu="handleAction('openMenu', $event)"
        />
        <WorkflowCard
          :workflow="{ ...sampleWorkflow, favorite: false }"
          @open="handleAction('open', $event)"
          @toggle-favorite="handleAction('toggleFavorite', $event)"
          @open-menu="handleAction('openMenu', $event)"
        />
      </div>
    </section>

    <!-- Model Card -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">ModelCard</h2>
      <p class="mb-4 text-sm text-muted-foreground">Used in: Models page, Project view</p>
      <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
        <ModelCard
          v-for="model in MOCK_MODELS.slice(0, 4)"
          :key="model.id"
          :model="model"
          @open="handleAction('open', $event)"
          @toggle-favorite="handleAction('toggleFavorite', $event)"
          @menu="handleAction('menu', $event)"
        />
      </div>
    </section>

    <!-- Asset Card -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">AssetCard</h2>
      <p class="mb-4 text-sm text-muted-foreground">Used in: Assets page, Project view</p>
      <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
        <AssetCard
          v-for="asset in MOCK_ASSETS.slice(0, 4)"
          :key="asset.id"
          :asset="asset"
          @open="handleAction('open', $event)"
          @toggle-favorite="handleAction('toggleFavorite', $event)"
          @menu="handleAction('menu', $event)"
        />
      </div>
    </section>

    <!-- Template Card -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">TemplateCard</h2>
      <p class="mb-4 text-sm text-muted-foreground">Used in: Templates page</p>
      <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
        <TemplateCard
          v-for="template in MOCK_TEMPLATES.slice(0, 4)"
          :key="template.id"
          :template="template"
          @open="handleAction('open', $event)"
          @toggle-favorite="handleAction('toggleFavorite', $event)"
          @menu="handleAction('menu', $event)"
        />
      </div>
    </section>

    <!-- Workspace Card -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">WorkspaceCard</h2>
      <p class="mb-4 text-sm text-muted-foreground">Used in: Dashboard, Recents page (generic card)</p>
      <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
        <WorkspaceCard
          thumbnail="/assets/card_images/workflow_01.webp"
          title="Text to Image"
          icon="image"
          badge="Template"
          badge-class="bg-amber-500/80 text-white"
          updated-at="2 hours ago"
          @open="handleAction('open')"
          @menu="handleAction('menu')"
        />
        <WorkspaceCard
          thumbnail="/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp"
          title="Portrait Generation"
          icon="sitemap"
          badge="Workflow"
          badge-class="bg-purple-500/80 text-white"
          updated-at="1 day ago"
          @open="handleAction('open')"
          @menu="handleAction('menu')"
        />
        <WorkspaceCard
          thumbnail="/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp"
          title="SDXL Base 1.0"
          icon="box"
          badge="Model"
          badge-class="bg-blue-500/80 text-white"
          updated-at="3 days ago"
          @open="handleAction('open')"
          @menu="handleAction('menu')"
        />
      </div>
    </section>

    <!-- Folder Card -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">FolderCard</h2>
      <p class="mb-4 text-sm text-muted-foreground">Used in: Workflows, Assets, Models pages</p>
      <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
        <FolderCard
          :folder="sampleFolder"
          :item-count="5"
          :subfolder-count="2"
          @open="handleAction('open', $event)"
          @open-menu="handleAction('openMenu', $event)"
        />
        <FolderCard
          :folder="{ ...sampleFolder, id: 'folder-2', name: 'Empty Folder' }"
          :item-count="0"
          :subfolder-count="0"
          @open="handleAction('open', $event)"
          @open-menu="handleAction('openMenu', $event)"
        />
        <FolderCard
          :folder="{ ...sampleFolder, id: 'folder-3', name: 'Large Folder' }"
          :item-count="128"
          :subfolder-count="12"
          @open="handleAction('open', $event)"
          @open-menu="handleAction('openMenu', $event)"
        />
      </div>
    </section>

    <!-- FolderCard with colored icons (used in ProjectView) -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">FolderCard (Colored Variants)</h2>
      <p class="mb-4 text-sm text-muted-foreground">Used in: ProjectView home (FolderCard with custom icons and colors)</p>
      <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
        <!-- Main Folders (Workflows, Models, Assets) -->
        <FolderCard
          v-for="folder in projectFolders"
          :key="folder.id"
          :folder="folder"
          :item-count="folder.count"
          :icon="folder.icon"
          :icon-class="folder.iconClass"
          @open="handleAction('openFolder', $event)"
          @open-menu="handleAction('openMenu', $event)"
        />

        <!-- User-Created Folder -->
        <FolderCard
          :folder="{ id: 'user-folder', name: 'My Custom Folder' }"
          :item-count="0"
          icon="folder"
          icon-class="text-amber-500 dark:text-amber-400"
          @open="handleAction('openFolder', $event)"
          @open-menu="handleAction('deleteFolder', $event)"
        />
      </div>
    </section>
  </div>
</template>
