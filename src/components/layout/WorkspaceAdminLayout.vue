<script setup lang="ts">
import WorkspaceAdminSidebar from './WorkspaceAdminSidebar.vue'
import WorkspaceTopBar from './WorkspaceTopBar.vue'
</script>

<template>
  <div class="flex h-screen flex-col bg-white dark:bg-background">
    <!-- Top Navigation Bar -->
    <WorkspaceTopBar />

    <!-- Main Content with Sidebar -->
    <div class="flex flex-1 overflow-hidden">
      <WorkspaceAdminSidebar />
      <main class="flex-1 overflow-auto bg-zinc-50/50 dark:bg-card/50">
        <slot />
      </main>
    </div>
  </div>
</template>
