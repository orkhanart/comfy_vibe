<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { PageBreadcrumb } from '@/components/workspace'
import { ref } from 'vue'

const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
</script>

<template>
  <div class="p-4">
    <PageBreadcrumb label="Empty States" icon="file" />

    <!-- Workflows Empty State -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">Workflows - Empty State</h2>
      <p class="mb-4 text-sm text-muted-foreground">Initial state when no workflows exist</p>

      <!-- Action Bar -->
      <div class="mb-4 flex items-center gap-3">
        <div class="relative flex-1">
          <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search workflows..."
            class="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-border dark:bg-muted dark:text-foreground dark:placeholder-zinc-500"
          />
        </div>
        <div class="relative">
          <select class="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-700 outline-none transition-colors hover:border-zinc-300 dark:border-border dark:bg-muted dark:text-foreground">
            <option>Last updated</option>
            <option>Name</option>
            <option>Node count</option>
          </select>
          <Icon name="chevron-down" size="xs" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        </div>
        <div class="flex rounded-lg border border-zinc-200 dark:border-border">
          <button
            :class="['px-3 py-2 text-sm transition-colors', viewMode === 'grid' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground' : 'text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground']"
            @click="viewMode = 'grid'"
          >
            <Icon name="th-large" size="md" />
          </button>
          <button
            :class="['px-3 py-2 text-sm transition-colors', viewMode === 'list' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-foreground' : 'text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground']"
            @click="viewMode = 'list'"
          >
            <Icon name="list" size="md" />
          </button>
        </div>
        <button class="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300 hover:text-amber-500 dark:border-border dark:bg-muted">
          <Icon name="star" size="sm" />
        </button>
        <button class="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-accent">
          <Icon name="folder-plus" size="xs" />
          New Folder
        </button>
        <button class="flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
          <Icon name="plus" size="xs" />
          New Workflow
        </button>
      </div>

      <!-- Empty State -->
      <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-muted">
          <Icon name="sitemap" size="xl" class="text-muted-foreground" />
        </div>
        <h3 class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">No workflows found</h3>
        <p class="mt-1 text-sm text-muted-foreground">Import or save a workflow to get started</p>
        <button class="mt-4 flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
          <Icon name="plus" size="xs" />
          Create Workflow
        </button>
      </div>
    </section>

    <!-- Models Empty State -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">Models - Empty State</h2>
      <p class="mb-4 text-sm text-muted-foreground">Initial state when no models exist</p>

      <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-muted">
          <Icon name="box" size="xl" class="text-muted-foreground" />
        </div>
        <h3 class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">No models found</h3>
        <p class="mt-1 text-sm text-muted-foreground">Download models from the registry to get started</p>
        <button class="mt-4 flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
          <Icon name="download" size="xs" />
          Browse Models
        </button>
      </div>
    </section>

    <!-- Assets Empty State -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">Assets - Empty State</h2>
      <p class="mb-4 text-sm text-muted-foreground">Initial state when no assets exist</p>

      <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-muted">
          <Icon name="images" size="xl" class="text-muted-foreground" />
        </div>
        <h3 class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">No assets found</h3>
        <p class="mt-1 text-sm text-muted-foreground">Upload files to get started</p>
        <button class="mt-4 flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
          <Icon name="upload" size="xs" />
          Upload Assets
        </button>
      </div>
    </section>

    <!-- Search Results Empty State -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">Search Results - Empty State</h2>
      <p class="mb-4 text-sm text-muted-foreground">When search returns no results</p>

      <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-muted">
          <Icon name="search" size="xl" class="text-muted-foreground" />
        </div>
        <h3 class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">No results found</h3>
        <p class="mt-1 text-sm text-muted-foreground">Try a different search term or filter</p>
      </div>
    </section>

    <!-- Folder Empty State -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">Folder - Empty State</h2>
      <p class="mb-4 text-sm text-muted-foreground">When a folder has no items</p>

      <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-muted">
          <Icon name="folder-open" size="xl" class="text-muted-foreground" />
        </div>
        <h3 class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">This folder is empty</h3>
        <p class="mt-1 text-sm text-muted-foreground">Add items or create subfolders</p>
        <div class="mt-4 flex gap-2">
          <button class="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground">
            <Icon name="folder-plus" size="xs" />
            New Folder
          </button>
          <button class="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
            <Icon name="plus" size="xs" />
            Add Items
          </button>
        </div>
      </div>
    </section>

    <!-- Trash Empty State -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">Trash - Empty State</h2>
      <p class="mb-4 text-sm text-muted-foreground">When trash is empty</p>

      <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-muted">
          <Icon name="trash" size="xl" class="text-muted-foreground" />
        </div>
        <h3 class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">Trash is empty</h3>
        <p class="mt-1 text-sm text-muted-foreground">Deleted items will appear here</p>
      </div>
    </section>

    <!-- Recents Empty State -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">Recents - Empty State</h2>
      <p class="mb-4 text-sm text-muted-foreground">When no recent activity exists</p>

      <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-muted">
          <Icon name="clock" size="xl" class="text-muted-foreground" />
        </div>
        <h3 class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">No recent activity</h3>
        <p class="mt-1 text-sm text-muted-foreground">Your recently opened items will appear here</p>
      </div>
    </section>

    <!-- Favorites Empty State -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">Favorites - Empty State</h2>
      <p class="mb-4 text-sm text-muted-foreground">When no favorites are saved</p>

      <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-border">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/10">
          <Icon name="star" size="xl" class="text-amber-500" />
        </div>
        <h3 class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">No favorites yet</h3>
        <p class="mt-1 text-sm text-muted-foreground">Star items to add them to your favorites</p>
      </div>
    </section>

    <!-- Project Empty State -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">Project - Empty State</h2>
      <p class="mb-4 text-sm text-muted-foreground">When a new project has no content</p>

      <div class="rounded-xl border border-zinc-200 bg-white p-8 dark:border-border dark:bg-card">
        <div class="flex flex-col items-center justify-center py-8">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-muted">
            <Icon name="folder" size="2xl" class="text-muted-foreground" />
          </div>
          <h3 class="mt-4 text-lg font-medium text-zinc-900 dark:text-foreground">Welcome to your project</h3>
          <p class="mt-2 max-w-md text-center text-sm text-muted-foreground">
            This project is empty. Start by adding workflows, models, or assets to organize your work.
          </p>
          <div class="mt-6 flex gap-3">
            <button class="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-border dark:bg-muted dark:text-foreground">
              <Icon name="file-import" size="xs" />
              Import
            </button>
            <button class="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
              <Icon name="plus" size="xs" />
              Create New
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Templates Empty State -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">Templates - Filtered Empty State</h2>
      <p class="mb-4 text-sm text-muted-foreground">When filter returns no templates</p>

      <div class="py-12 text-center">
        <Icon name="template" size="md" class="mb-4 text-4xl text-muted-foreground" />
        <p class="text-muted-foreground">No templates found in this category</p>
      </div>
    </section>

    <!-- List View Empty State -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">List View - Empty State</h2>
      <p class="mb-4 text-sm text-muted-foreground">Empty list container</p>

      <div class="rounded-xl border border-zinc-200 bg-white dark:border-border dark:bg-card">
        <div class="flex flex-col items-center justify-center py-16">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-muted">
            <Icon name="list" size="xl" class="text-muted-foreground" />
          </div>
          <h3 class="mt-4 text-sm font-medium text-zinc-900 dark:text-foreground">No items to display</h3>
          <p class="mt-1 text-sm text-muted-foreground">Items will appear here when added</p>
        </div>
      </div>
    </section>

    <!-- Minimal Empty State -->
    <section class="mb-12">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-foreground">Minimal Empty State</h2>
      <p class="mb-4 text-sm text-muted-foreground">Simple text-only empty state</p>

      <div class="py-12 text-center">
        <p class="text-muted-foreground">Nothing here yet</p>
      </div>
    </section>
  </div>
</template>
