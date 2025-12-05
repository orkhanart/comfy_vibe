<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@/components/ui/icon'
import { useUiStore, type AdminTabType, ADMIN_TAB_CONFIG } from '@/stores/uiStore'

interface MenuItem {
  label: string
  icon: string
  route?: string
  badge?: number
  type: AdminTabType
}

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: 'th-large', route: '/workspace/manage', type: 'dashboard' },
  { label: 'People', icon: 'users', route: '/workspace/manage/people', type: 'people' },
  { label: 'Billing', icon: 'receipt', route: '/workspace/manage/billing', type: 'billing' },
  { label: 'Content', icon: 'folder', route: '/workspace/manage/content', type: 'content' },
  { label: 'Settings', icon: 'cog', route: '/workspace/manage/settings', type: 'settings' },
]

function isActive(itemRoute?: string): boolean {
  if (!itemRoute) return false
  if (itemRoute === '/workspace/manage') {
    return route.path === itemRoute
  }
  return route.path.startsWith(itemRoute)
}

function handleItemClick(item: MenuItem): void {
  // Open admin tab for this page
  const tab = uiStore.openAdminTab(item.type)
  router.push(tab.route)
}
</script>

<template>
  <aside
    class="flex h-full w-[220px] flex-col border-r border-zinc-200 bg-zinc-50/50 dark:border-border dark:bg-background"
  >
    <!-- Menu Items -->
    <nav class="flex-1 overflow-y-auto px-2 py-3">
      <ul class="flex flex-col gap-0.5">
        <li v-for="item in menuItems" :key="item.label">
          <button
            :class="[
              'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 transition-colors',
              isActive(item.route)
                ? 'bg-button-active-surface font-medium text-button-active-foreground'
                : 'text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
            ]"
            @click="handleItemClick(item)"
          >
            <Icon :name="item.icon" size="md" />
            <span class="flex-1 text-left text-sm">{{ item.label }}</span>
            <span
              v-if="item.badge"
              :class="[
                'rounded-full px-1.5 py-0.5 text-xs font-medium',
                isActive(item.route)
                  ? 'bg-button-hover-surface text-button-active-foreground'
                  : 'bg-secondary-background text-muted-foreground'
              ]"
            >
              {{ item.badge }}
            </span>
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>
