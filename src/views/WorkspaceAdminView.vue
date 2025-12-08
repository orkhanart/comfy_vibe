<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import WorkspaceAdminLayout from '@/components/layout/WorkspaceAdminLayout.vue'
import { useUiStore, type AdminTabType } from '@/stores/uiStore'

const route = useRoute()
const uiStore = useUiStore()

// Map route prefixes to admin tab types
const routePrefixToTabType: { prefix: string; type: AdminTabType }[] = [
  { prefix: '/workspace/manage/people', type: 'people' },
  { prefix: '/workspace/manage/billing', type: 'billing' },
  { prefix: '/workspace/manage/content', type: 'content' },
  { prefix: '/workspace/manage/settings', type: 'settings' },
  { prefix: '/workspace/manage', type: 'dashboard' }, // Must be last (catch-all)
]

function syncTabWithRoute() {
  const match = routePrefixToTabType.find(r => route.path.startsWith(r.prefix))
  if (match) {
    uiStore.openAdminTab(match.type)
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
