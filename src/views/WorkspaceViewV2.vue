<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import WorkspaceLayoutV2 from '@/components/layout_v2/WorkspaceLayoutV2.vue'

const route = useRoute()
const workspaceId = computed(() => route.params.workspaceId as string)
</script>

<template>
  <WorkspaceLayoutV2>
    <RouterView :key="route.fullPath" />
  </WorkspaceLayoutV2>
</template>
