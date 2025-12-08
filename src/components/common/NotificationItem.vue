<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import type { ShareNotification } from '@/types/workflowShare'
import { ACCESS_MODE_LABELS, getAccessModeBadgeColor } from '@/types/workflowShare'

interface Props {
  notification: ShareNotification
  message: string
  relativeTime: string
}

defineProps<Props>()

const emit = defineEmits<{
  click: [notification: ShareNotification]
  markRead: [id: string]
}>()

function handleClick() {
  emit('click', emit.arguments?.[0] || {} as ShareNotification)
}
</script>

<template>
  <button
    class="flex w-full gap-3 px-3 py-2.5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
    :class="!notification.read && 'bg-blue-50/50 dark:bg-blue-900/10'"
    @click="$emit('click', notification)"
  >
    <!-- Avatar -->
    <div class="relative shrink-0">
      <div
        v-if="notification.sharedBy.avatar"
        class="h-9 w-9 overflow-hidden rounded-full"
      >
        <img
          :src="notification.sharedBy.avatar"
          :alt="notification.sharedBy.name"
          class="h-full w-full object-cover"
        />
      </div>
      <div
        v-else
        class="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
      >
        {{ notification.sharedBy.name.charAt(0).toUpperCase() }}
      </div>
      <!-- Notification type icon -->
      <div
        class="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full"
        :class="notification.type === 'workflow_shared' ? 'bg-blue-500' : 'bg-green-500'"
      >
        <Icon
          :name="notification.type === 'workflow_shared' ? 'share' : 'git-branch'"
          size="xs"
          class="text-white"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="min-w-0 flex-1">
      <p class="text-sm text-zinc-700 dark:text-zinc-300">
        {{ message }}
      </p>
      <div class="mt-1 flex items-center gap-2">
        <!-- Access mode badge -->
        <span
          class="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
          :class="getAccessModeBadgeColor(notification.accessMode)"
        >
          {{ ACCESS_MODE_LABELS[notification.accessMode] }}
        </span>
        <!-- Time -->
        <span class="text-xs text-zinc-400 dark:text-zinc-500">
          {{ relativeTime }}
        </span>
      </div>
    </div>

    <!-- Unread indicator -->
    <div
      v-if="!notification.read"
      class="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500"
    />
  </button>
</template>
