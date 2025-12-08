<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import WorkspaceAdminLayout from '@/components/layout/WorkspaceAdminLayout.vue'
import { useUiStore, type AdminTabType } from '@/stores/uiStore'

const route = useRoute()
const uiStore = useUiStore()

// Map routes to admin tab types
const routeToTabType: Record<string, AdminTabType> = {
  '/workspace/manage': 'dashboard',
  '/workspace/manage/people': 'people',
  '/workspace/manage/billing': 'billing',
  '/workspace/manage/content': 'content',
  '/workspace/manage/settings': 'settings',
}

function syncTabWithRoute() {
  const tabType = routeToTabType[route.path]
  if (tabType) {
    uiStore.openAdminTab(tabType)
  }
}

// Sync on mount
onMounted(() => {
  syncTabWithRoute()
})

// Sync when route changes
watch(() => route.path, () => {
  syncTabWithRoute()
})
</script>

<template>
  <WorkspaceAdminLayout>
    <RouterView :key="route.fullPath" />
  </WorkspaceAdminLayout>
</template>
