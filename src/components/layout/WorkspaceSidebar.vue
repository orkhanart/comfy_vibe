<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'

interface MenuItem {
  label: string
  icon: string
  route?: string
  badge?: number
}

const route = useRoute()
const isCollapsed = ref(true)

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: 'th-large', route: '/workspace' },
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

function toggleCollapse(): void {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <aside
    :class="[
      'flex h-full flex-col border-r border-zinc-200 bg-zinc-50/50 transition-all duration-200 dark:border-border dark:bg-background',
      isCollapsed ? 'w-12' : 'w-[220px]'
    ]"
  >
    <!-- Menu Items -->
    <nav class="flex-1 overflow-y-auto px-2 py-3">
      <ul class="flex flex-col gap-0.5">
        <li v-for="item in menuItems" :key="item.label">
          <RouterLink
            v-tooltip.right="{ value: isCollapsed ? item.label : '', showDelay: 50 }"
            :to="item.route ?? '#'"
            :class="[
              'flex items-center gap-2.5 rounded-md transition-colors',
              isCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5',
              isActive(item.route)
                ? 'bg-button-active-surface font-medium text-button-active-foreground'
                : 'text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
            ]"
          >
            <Icon :name="item.icon" size="md" />
            <span v-if="!isCollapsed" class="flex-1 text-sm">{{ item.label }}</span>
            <span
              v-if="item.badge && !isCollapsed"
              :class="[
                'rounded-full px-1.5 py-0.5 text-xs font-medium',
                isActive(item.route)
                  ? 'bg-button-hover-surface text-button-active-foreground'
                  : 'bg-secondary-background text-muted-foreground'
              ]"
            >
              {{ item.badge }}
            </span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Bottom Section: Trash + Collapse Toggle -->
    <div class="flex flex-col gap-0.5 px-2 pb-3">
      <!-- Trash -->
      <RouterLink
        v-tooltip.right="{ value: isCollapsed ? trashItem.label : '', showDelay: 50 }"
        :to="trashItem.route ?? '#'"
        :class="[
          'flex items-center gap-2.5 rounded-md transition-colors',
          isCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5',
          isActive(trashItem.route)
            ? 'bg-button-active-surface font-medium text-button-active-foreground'
            : 'text-muted-foreground hover:bg-button-hover-surface hover:text-foreground'
        ]"
      >
        <Icon :name="trashItem.icon" size="md" />
        <span v-if="!isCollapsed" class="text-sm">{{ trashItem.label }}</span>
      </RouterLink>

      <!-- Divider -->
      <div class="my-1.5 h-px bg-zinc-200 dark:bg-border" />

      <!-- Collapse Toggle Button -->
      <button
        v-tooltip.right="{ value: isCollapsed ? 'Expand sidebar' : '', showDelay: 50 }"
        :class="[
          'flex items-center gap-2.5 rounded-md text-muted-foreground transition-colors hover:bg-button-hover-surface hover:text-foreground',
          isCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5'
        ]"
        @click="toggleCollapse"
      >
        <Icon :name="isCollapsed ? 'chevron-right' : 'chevron-left'" size="md" />
        <span v-if="!isCollapsed" class="text-sm">Collapse</span>
      </button>
    </div>
  </aside>
</template>
