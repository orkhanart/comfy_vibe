<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@/components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useNotificationStore } from '@/stores/notificationStore'
import NotificationItem from './NotificationItem.vue'
import type { ShareNotification } from '@/types/workflowShare'

const router = useRouter()
const notificationStore = useNotificationStore()

const isOpen = ref(false)

function handleNotificationClick(notification: ShareNotification) {
  // Mark as read
  notificationStore.markAsRead(notification.id)

  // Navigate to the shared workflow
  if (notification.type === 'workflow_shared') {
    // For shared workflows, navigate to workspace shared tab
    router.push({
      name: 'workspace-workflows',
      query: { tab: 'shared-with-me' }
    })
  } else {
    // For fork notifications, just close
  }

  isOpen.value = false
}

function handleMarkAllRead() {
  notificationStore.markAllAsRead()
}
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <button
        class="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
      >
        <Icon name="bell" size="md" />
        <!-- Unread badge -->
        <span
          v-if="notificationStore.hasUnread"
          class="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
        >
          {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
        </span>
      </button>
    </PopoverTrigger>

    <PopoverContent
      align="end"
      :side-offset="8"
      class="w-80 p-0"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-zinc-200 px-3 py-2.5 dark:border-zinc-700">
        <h3 class="text-sm font-semibold text-zinc-900 dark:text-white">
          Notifications
        </h3>
        <button
          v-if="notificationStore.hasUnread"
          class="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          @click="handleMarkAllRead"
        >
          Mark all as read
        </button>
      </div>

      <!-- Notification List -->
      <div class="max-h-80 overflow-y-auto">
        <template v-if="notificationStore.sortedNotifications.length > 0">
          <NotificationItem
            v-for="notification in notificationStore.sortedNotifications"
            :key="notification.id"
            :notification="notification"
            :message="notificationStore.getNotificationMessage(notification)"
            :relative-time="notificationStore.getRelativeTime(notification.createdAt)"
            @click="handleNotificationClick"
          />
        </template>
        <div
          v-else
          class="flex flex-col items-center justify-center py-8 text-center"
        >
          <Icon name="bell-slash" size="xl" class="text-zinc-300 dark:text-zinc-600" />
          <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            No notifications yet
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div
        v-if="notificationStore.sortedNotifications.length > 0"
        class="border-t border-zinc-200 p-2 dark:border-zinc-700"
      >
        <button
          class="w-full rounded-md py-1.5 text-center text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          @click="isOpen = false"
        >
          Close
        </button>
      </div>
    </PopoverContent>
  </Popover>
</template>
