import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  ShareAccessMode,
  WorkflowShare,
  WorkflowShareWithUser,
  WorkflowShareLink,
  WorkflowShareSettings,
  SharedWorkflow,
  ShareableUser,
  ShareWorkflowPayload,
  WorkflowForkMetadata,
} from '@/types/workflowShare'
import { DEFAULT_SHARE_SETTINGS, getShareUrl } from '@/types/workflowShare'

// ============================================
// MOCK DATA
// ============================================

// Mock users that can be searched and added to shares
const MOCK_USERS: ShareableUser[] = [
  { id: 'user-2', name: 'Alice Chen', email: 'alice@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
  { id: 'user-3', name: 'Bob Wilson', email: 'bob@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob' },
  { id: 'user-4', name: 'Carol Smith', email: 'carol@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol' },
  { id: 'user-5', name: 'David Lee', email: 'david@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david' },
  { id: 'user-6', name: 'Emma Johnson', email: 'emma@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
  { id: 'user-7', name: 'Frank Brown', email: 'frank@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank' },
  { id: 'user-8', name: 'Grace Kim', email: 'grace@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace' },
  { id: 'user-9', name: 'Henry Davis', email: 'henry@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=henry' },
]

// Mock workflows shared with the current user
const MOCK_SHARED_WITH_ME: SharedWorkflow[] = [
  {
    id: 'share-1',
    workflowId: 'shared-wf-1',
    name: 'Portrait Generator Pro',
    description: 'High-quality portrait generation with face enhancement',
    thumbnail: '/assets/card_images/workflow_01.webp',
    nodeCount: 18,
    accessMode: 'linear',
    sharedBy: { id: 'user-2', name: 'Alice Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
    sharedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'share-2',
    workflowId: 'shared-wf-2',
    name: 'SDXL Turbo Pipeline',
    description: 'Fast 4-step generation with SDXL Turbo',
    thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp',
    nodeCount: 12,
    accessMode: 'both',
    sharedBy: { id: 'user-3', name: 'Bob Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob' },
    sharedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'share-3',
    workflowId: 'shared-wf-3',
    name: 'ControlNet Multi-Stack',
    description: 'Advanced multi-ControlNet setup for precise control',
    thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp',
    nodeCount: 24,
    accessMode: 'workflow',
    sharedBy: { id: 'user-4', name: 'Carol Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol' },
    sharedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'share-4',
    workflowId: 'shared-wf-4',
    name: 'Anime Style Transfer',
    description: 'Transform photos into anime style with IPAdapter',
    thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp',
    nodeCount: 16,
    accessMode: 'linear',
    sharedBy: { id: 'user-5', name: 'David Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david' },
    sharedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
]

// Mock share links (keyed by workflowId)
const MOCK_SHARE_LINKS: Record<string, WorkflowShareLink> = {
  'wf-1': {
    id: 'link-1',
    workflowId: 'wf-1',
    createdBy: 'user-1',
    code: 'abc123def456ghi789jkl012mno345pq',
    accessMode: 'both',
    isActive: true,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
}

// Mock shares per workflow (keyed by workflowId)
const MOCK_WORKFLOW_SHARES: Record<string, WorkflowShareWithUser[]> = {
  'wf-1': [
    {
      id: 'ws-1',
      workflowId: 'wf-1',
      sharedBy: 'user-1',
      sharedWith: 'user-2',
      accessMode: 'linear',
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      user: { id: 'user-2', name: 'Alice Chen', email: 'alice@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
    },
    {
      id: 'ws-2',
      workflowId: 'wf-1',
      sharedBy: 'user-1',
      sharedWith: 'user-3',
      accessMode: 'linear',
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      user: { id: 'user-3', name: 'Bob Wilson', email: 'bob@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob' },
    },
  ],
}

// Mock share settings per workflow
const MOCK_SHARE_SETTINGS: Record<string, WorkflowShareSettings> = {
  'wf-1': {
    accessMode: 'linear',
    isPublic: false,
    shareLink: MOCK_SHARE_LINKS['wf-1'],
  },
}

// ============================================
// STORE
// ============================================

export const useShareStore = defineStore('share', () => {
  // State
  const sharedWithMe = ref<SharedWorkflow[]>([...MOCK_SHARED_WITH_ME])
  const workflowShares = ref<Record<string, WorkflowShareWithUser[]>>({ ...MOCK_WORKFLOW_SHARES })
  const shareLinks = ref<Record<string, WorkflowShareLink>>({ ...MOCK_SHARE_LINKS })
  const shareSettings = ref<Record<string, WorkflowShareSettings>>({ ...MOCK_SHARE_SETTINGS })
  const isLoading = ref(false)

  // Computed
  const sharedWithMeCount = computed(() => sharedWithMe.value.length)

  // ============================================
  // USER SEARCH
  // ============================================

  /**
   * Search users by name or email
   */
  function searchUsers(query: string, excludeIds: string[] = []): ShareableUser[] {
    if (!query || query.length < 2) return []

    const lowerQuery = query.toLowerCase()
    return MOCK_USERS.filter(user => {
      if (excludeIds.includes(user.id)) return false
      return (
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
      )
    })
  }

  /**
   * Get user by ID
   */
  function getUserById(userId: string): ShareableUser | undefined {
    return MOCK_USERS.find(u => u.id === userId)
  }

  // ============================================
  // SHARE SETTINGS
  // ============================================

  /**
   * Get share settings for a workflow
   */
  function getShareSettings(workflowId: string): WorkflowShareSettings {
    return shareSettings.value[workflowId] || { ...DEFAULT_SHARE_SETTINGS }
  }

  /**
   * Update share settings for a workflow
   */
  function updateShareSettings(
    workflowId: string,
    updates: Partial<WorkflowShareSettings>
  ): void {
    const current = getShareSettings(workflowId)
    shareSettings.value[workflowId] = { ...current, ...updates }
  }

  // ============================================
  // DIRECT SHARING
  // ============================================

  /**
   * Get all shares for a workflow
   */
  function getWorkflowShares(workflowId: string): WorkflowShareWithUser[] {
    return workflowShares.value[workflowId] || []
  }

  /**
   * Share workflow with users or email addresses
   */
  function shareWorkflow(
    workflowId: string,
    payload: ShareWorkflowPayload
  ): WorkflowShare[] {
    const currentShares = workflowShares.value[workflowId] || []
    const newShares: WorkflowShareWithUser[] = []

    for (const userIdOrEmail of payload.userIds) {
      // Skip if already shared
      if (currentShares.some(s => s.sharedWith === userIdOrEmail)) continue

      let user = getUserById(userIdOrEmail)

      // Handle email invites (userId starts with 'email-' or contains '@')
      if (!user && (userIdOrEmail.startsWith('email-') || userIdOrEmail.includes('@'))) {
        const email = userIdOrEmail.includes('@') ? userIdOrEmail : `invited-${Date.now()}@pending.com`
        user = {
          id: userIdOrEmail,
          name: email.split('@')[0],
          email: email,
        }
      }

      if (!user) continue

      const share: WorkflowShareWithUser = {
        id: `ws-${Date.now()}-${userIdOrEmail}`,
        workflowId,
        sharedBy: 'user-1', // Current user
        sharedWith: userIdOrEmail,
        accessMode: payload.accessMode,
        createdAt: Date.now(),
        user,
      }
      newShares.push(share)
    }

    workflowShares.value[workflowId] = [...currentShares, ...newShares]

    // Update share settings with the access mode
    updateShareSettings(workflowId, { accessMode: payload.accessMode })

    return newShares
  }

  /**
   * Remove a user's access to a workflow
   */
  function removeShare(workflowId: string, shareId: string): void {
    const shares = workflowShares.value[workflowId]
    if (shares) {
      workflowShares.value[workflowId] = shares.filter(s => s.id !== shareId)
    }
  }

  /**
   * Update access mode for all shares of a workflow
   */
  function updateWorkflowAccessMode(
    workflowId: string,
    accessMode: ShareAccessMode
  ): void {
    const shares = workflowShares.value[workflowId]
    if (shares) {
      workflowShares.value[workflowId] = shares.map(s => ({
        ...s,
        accessMode,
      }))
    }

    // Update share link if exists
    const link = shareLinks.value[workflowId]
    if (link) {
      shareLinks.value[workflowId] = { ...link, accessMode }
    }

    // Update settings
    updateShareSettings(workflowId, { accessMode })
  }

  // ============================================
  // LINK SHARING
  // ============================================

  /**
   * Get share link for a workflow
   */
  function getShareLink(workflowId: string): WorkflowShareLink | null {
    return shareLinks.value[workflowId] || null
  }

  /**
   * Create a share link for a workflow
   */
  function createShareLink(
    workflowId: string,
    accessMode: ShareAccessMode
  ): WorkflowShareLink {
    // Generate a random code
    const code = generateLinkCode()

    const link: WorkflowShareLink = {
      id: `link-${Date.now()}`,
      workflowId,
      createdBy: 'user-1', // Current user
      code,
      accessMode,
      isActive: true,
      createdAt: Date.now(),
    }

    shareLinks.value[workflowId] = link
    updateShareSettings(workflowId, { shareLink: link })

    return link
  }

  /**
   * Toggle share link active state
   */
  function toggleShareLink(workflowId: string, isActive: boolean): void {
    const link = shareLinks.value[workflowId]
    if (link) {
      shareLinks.value[workflowId] = { ...link, isActive }
      updateShareSettings(workflowId, {
        shareLink: { ...link, isActive },
      })
    }
  }

  /**
   * Delete share link
   */
  function deleteShareLink(workflowId: string): void {
    delete shareLinks.value[workflowId]
    updateShareSettings(workflowId, { shareLink: undefined })
  }

  /**
   * Copy share link to clipboard
   */
  async function copyShareLink(workflowId: string): Promise<boolean> {
    const link = shareLinks.value[workflowId]
    if (!link) return false

    try {
      await navigator.clipboard.writeText(getShareUrl(link.code))
      return true
    } catch {
      return false
    }
  }

  // ============================================
  // SHARED WITH ME
  // ============================================

  /**
   * Get workflows shared with current user
   */
  function getSharedWithMe(): SharedWorkflow[] {
    return sharedWithMe.value
  }

  /**
   * Leave a shared workflow (remove from "shared with me")
   */
  function leaveSharedWorkflow(shareId: string): void {
    sharedWithMe.value = sharedWithMe.value.filter(s => s.id !== shareId)
  }

  /**
   * Access a shared workflow via link code
   */
  function accessSharedLink(code: string): SharedWorkflow | null {
    // Find the link by code
    const link = Object.values(shareLinks.value).find(l => l.code === code)

    // If link exists and is active, use its data
    if (link && link.isActive) {
      const workflowNames: Record<string, string> = {
        'wf-1': 'SDXL Lightning Portrait',
        'wf-2': 'Anime Style Transfer',
        'wf-3': 'ControlNet Multi-Stack',
      }

      return {
        id: `share-link-${code}`,
        workflowId: link.workflowId,
        name: workflowNames[link.workflowId] || 'Untitled Workflow',
        description: 'Workflow accessed via share link',
        thumbnail: '/assets/card_images/workflow_01.webp',
        nodeCount: 12,
        accessMode: link.accessMode,
        sharedBy: { id: 'user-2', name: 'Alice Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
        sharedAt: Date.now(),
      }
    }

    // For demo: accept any valid-looking share code (32 chars alphanumeric)
    // In production, this would validate against the API
    if (code && code.length >= 16 && /^[a-z0-9]+$/.test(code)) {
      return {
        id: `share-link-${code}`,
        workflowId: 'shared-demo',
        name: 'Shared Workflow',
        description: 'Workflow accessed via share link',
        thumbnail: '/assets/card_images/workflow_01.webp',
        nodeCount: 12,
        accessMode: 'both',
        sharedBy: { id: 'user-2', name: 'Alice Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
        sharedAt: Date.now(),
      }
    }

    return null
  }

  // ============================================
  // FORK
  // ============================================

  /**
   * Fork a shared workflow (creates a copy with attribution)
   */
  function forkWorkflow(
    workflowId: string,
    workflowName: string,
    authorId: string,
    authorName: string
  ): WorkflowForkMetadata {
    const forkMetadata: WorkflowForkMetadata = {
      forkedFrom: {
        workflowId,
        workflowName,
        authorId,
        authorName,
        forkedAt: Date.now(),
      },
    }

    // In real app, this would:
    // 1. Create a copy of the workflow
    // 2. Set the current user as owner
    // 3. Store the fork metadata

    return forkMetadata
  }

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Generate a random link code
   */
  function generateLinkCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let code = ''
    for (let i = 0; i < 32; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  /**
   * Check if current user can manage shares for a workflow
   */
  function canManageShares(_workflowId: string): boolean {
    // In real app, check if user is owner or admin
    return true
  }

  /**
   * Get share count for a workflow
   */
  function getShareCount(workflowId: string): number {
    return (workflowShares.value[workflowId] || []).length
  }

  return {
    // State
    sharedWithMe,
    workflowShares,
    shareLinks,
    shareSettings,
    isLoading,

    // Computed
    sharedWithMeCount,

    // User search
    searchUsers,
    getUserById,

    // Share settings
    getShareSettings,
    updateShareSettings,

    // Direct sharing
    getWorkflowShares,
    shareWorkflow,
    removeShare,
    updateWorkflowAccessMode,

    // Link sharing
    getShareLink,
    createShareLink,
    toggleShareLink,
    deleteShareLink,
    copyShareLink,

    // Shared with me
    getSharedWithMe,
    leaveSharedWorkflow,
    accessSharedLink,

    // Fork
    forkWorkflow,

    // Helpers
    canManageShares,
    getShareCount,
  }
})
