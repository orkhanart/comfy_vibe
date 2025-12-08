<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { PageBreadcrumb } from '@/components/workspace'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkspaceStore } from '@/stores/workspaceStore'

const route = useRoute()
const workspaceStore = useWorkspaceStore()
const currentWorkspace = computed(() => workspaceStore.currentWorkspace)

const breadcrumbItems = computed(() => [
  { label: '', icon: 'home', to: '/workspace' },
  { label: currentWorkspace.value?.name || 'Workspace', icon: 'users', to: '/workspace/manage' },
  { label: 'Billing' }
])

const tabs = [
  { name: 'Usage', icon: 'chart-bar', route: '/workspace/manage/billing/usage' },
  { name: 'Billing History', icon: 'receipt', route: '/workspace/manage/billing/history' },
  { name: 'Payment Methods', icon: 'credit-card', route: '/workspace/manage/billing/payment-methods' },
  { name: 'Plan Management', icon: 'layers', route: '/workspace/manage/billing/plans' },
]

function isActiveTab(tabRoute: string): boolean {
  return route.path === tabRoute
}
</script>

<template>
  <div class="h-full overflow-y-auto p-6">
    <!-- Breadcrumb -->
    <PageBreadcrumb :items="breadcrumbItems" class="mb-4" />

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-foreground">Billing</h1>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex items-center gap-1 border-b border-border">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.route"
        :to="tab.route"
        class="flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors"
        :class="isActiveTab(tab.route) ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
      >
        <Icon :name="tab.icon" size="sm" />
        {{ tab.name }}
      </RouterLink>
    </div>

    <!-- Tab Content -->
    <RouterView />
  </div>
</template>
