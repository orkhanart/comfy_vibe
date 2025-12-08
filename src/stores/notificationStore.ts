import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ShareNotification, ShareAccessMode } from '@/types/workflowShare'

// ============================================
// MOCK DATA
// ============================================

const MOCK_NOTIFICATIONS: ShareNotification[] = [
  {
    id: 'notif-1',
    type: 'workflow_shared',
    workflowId: 'shared-wf-1',
    workflowName: 'Portrait Generator Pro',
    accessMode: 'linear',
    sharedBy: {
      id: 'user-2',
      name: 'Alice Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    },
    createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    read: false,
  },
  {
    id: 'notif-2',
    type: 'workflow_shared',
    workflowId: 'shared-wf-2',
    workflowName: 'SDXL Turbo Pipeline',
    accessMode: 'both',
    sharedBy: {
      id: 'user-3',
      name: 'Bob Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    },
    createdAt: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
    read: false,
  },
  {
    id: 'notif-3',
    type: 'workflow_shared',
    workflowId: 'shared-wf-3',
    workflowName: 'ControlNet Multi-Stack',
    accessMode: 'workflow',
    sharedBy: {
      id: 'user-4',
      name: 'Carol Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
    },
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    read: true,
  },
  {
    id: 'notif-4',
    type: 'workflow_forked',
    workflowId: 'wf-1',
    workflowName: 'SDXL txt2img + Refiner',
    accessMode: 'both',
    sharedBy: {
      id: 'user-5',
      name: 'David Lee',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    },
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    read: true,
  },
]

// ============================================
// STORE
// ============================================

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<ShareNotification[]>([...MOCK_NOTIFICATIONS])
  const isLoading = ref(false)

  // Computed
  const unreadCount = computed(() =>
    notifications.value.filter(n => !n.read).length
  )

  const hasUnread = computed(() => unreadCount.value > 0)

  const sortedNotifications = computed(() =>
    [...notifications.value].sort((a, b) => b.createdAt - a.createdAt)
  )

  const unreadNotifications = computed(() =>
    sortedNotifications.value.filter(n => !n.read)
  )

  // ============================================
  // ACTIONS
  // ============================================

  /**
   * Fetch notifications (mock - already loaded)
   */
  async function fetchNotifications(): Promise<void> {
    isLoading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    isLoading.value = false
  }

  /**
   * Mark a notification as read
   */
  function markAsRead(notificationId: string): void {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  }

  /**
   * Mark all notifications as read
   */
  function markAllAsRead(): void {
    notifications.value.forEach(n => {
      n.read = true
    })
  }

  /**
   * Delete a notification
   */
  function deleteNotification(notificationId: string): void {
    notifications.value = notifications.value.filter(n => n.id !== notificationId)
  }

  /**
   * Clear all notifications
   */
  function clearAll(): void {
    notifications.value = []
  }

  /**
   * Add a new notification (for real-time updates)
   */
  function addNotification(notification: Omit<ShareNotification, 'id' | 'createdAt' | 'read'>): void {
    const newNotification: ShareNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: Date.now(),
      read: false,
    }
    notifications.value.unshift(newNotification)
  }

  /**
   * Create a share notification
   */
  function createShareNotification(
    workflowId: string,
    workflowName: string,
    accessMode: ShareAccessMode,
    sharedBy: { id: string; name: string; avatar?: string }
  ): void {
    addNotification({
      type: 'workflow_shared',
      workflowId,
      workflowName,
      accessMode,
      sharedBy,
    })
  }

  /**
   * Create a fork notification (for workflow owner)
   */
  function createForkNotification(
    workflowId: string,
    workflowName: string,
    forkedBy: { id: string; name: string; avatar?: string }
  ): void {
    addNotification({
      type: 'workflow_forked',
      workflowId,
      workflowName,
      accessMode: 'both', // Not relevant for fork notifications
      sharedBy: forkedBy,
    })
  }

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Get notification message based on type
   */
  function getNotificationMessage(notification: ShareNotification): string {
    switch (notification.type) {
      case 'workflow_shared':
        return `${notification.sharedBy.name} shared "${notification.workflowName}" with you`
      case 'workflow_forked':
        return `${notification.sharedBy.name} forked your workflow "${notification.workflowName}"`
      default:
        return 'You have a new notification'
    }
  }

  /**
   * Get relative time string
   */
  function getRelativeTime(timestamp: number): string {
    const now = Date.now()
    const diff = now - timestamp

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`

    return new Date(timestamp).toLocaleDateString()
  }

  return {
    // State
    notifications,
    isLoading,

    // Computed
    unreadCount,
    hasUnread,
    sortedNotifications,
    unreadNotifications,

    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification,
    createShareNotification,
    createForkNotification,

    // Helpers
    getNotificationMessage,
    getRelativeTime,
  }
})
