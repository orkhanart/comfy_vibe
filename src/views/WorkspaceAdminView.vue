<script setup lang="ts">
import { useRoute } from 'vue-router'

import WorkspaceAdminLayout from '@/components/layout/WorkspaceAdminLayout.vue'

const route = useRoute()
</script>

<template>
  <WorkspaceAdminLayout>
    <RouterView :key="route.fullPath" />
  </WorkspaceAdminLayout>
</template>
