<script setup lang="ts">
import WorkspaceSidebarV2 from './WorkspaceSidebarV2.vue'
import WorkspaceTopBarV2 from './WorkspaceTopBarV2.vue'
</script>

<template>
  <div class="flex h-screen flex-col bg-white dark:bg-background">
    <!-- Top Navigation Bar -->
    <WorkspaceTopBarV2 />

    <!-- Main Content with Sidebar -->
    <div class="flex flex-1 overflow-hidden">
      <WorkspaceSidebarV2 />
      <main class="flex-1 overflow-auto bg-zinc-50/50 dark:bg-card/50">
        <slot />
      </main>
    </div>
  </div>
</template>
