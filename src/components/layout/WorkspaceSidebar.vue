<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Icon } from '@/components/ui/icon'

interface MenuItem {
  label: string
  icon: string
  route?: string
  badge?: number
}

const route = useRoute()

const menuItems: MenuItem[] = [
  { label: 'Home', icon: 'clock', route: '/workspace' },
  { label: 'Workflows', icon: 'sitemap', route: '/workspace/workflows' },
  { label: 'Assets', icon: 'images', route: '/workspace/assets' },
  { label: 'Models', icon: 'box', route: '/workspace/models' },
  { label: 'Templates', icon: 'th-large', route: '/workspace/templates' }
]

const trashItem: MenuItem = {
  label: 'Trash',
  icon: 'trash',
  route: '/workspace/trash'
}

function isActive(itemRoute?: string): boolean {
  if (!itemRoute) return false
  if (itemRoute === '/workspace') {
    return route.path === itemRoute
  }
  return route.path.startsWith(itemRoute)
}
</script>

<template>
  <aside
    class="flex h-full w-[300px] flex-col border-r border-zinc-200 bg-zinc-50/50 dark:border-border dark:bg-background"
  >
    <!-- Menu Items -->
    <nav class="flex-1 overflow-y-auto px-3 py-4">
      <ul class="flex flex-col gap-0.5">
        <li v-for="item in menuItems" :key="item.label">
          <RouterLink
            :to="item.route ?? '#'"
            :class="[
              'flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors',
              isActive(item.route)
                ? 'bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground'
            ]"
          >
            <Icon :name="item.icon" size="md" />
            <span class="flex-1">{{ item.label }}</span>
            <span
              v-if="item.badge"
              :class="[
                'rounded-full px-1.5 py-0.5 text-xs font-medium',
                isActive(item.route)
                  ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900'
                  : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-foreground'
              ]"
            >
              {{ item.badge }}
            </span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Trash -->
    <div class="px-3 pb-4">
      <RouterLink
        :to="trashItem.route ?? '#'"
        :class="[
          'flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors',
          isActive(trashItem.route)
            ? 'bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground'
        ]"
      >
        <Icon :name="trashItem.icon" size="md" />
        <span>{{ trashItem.label }}</span>
      </RouterLink>
    </div>
  </aside>
</template>
