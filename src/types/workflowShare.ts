/**
 * Workflow Sharing Types
 *
 * Enables sharing workflows with other users via:
 * - Direct user invites
 * - Shareable links (requires login)
 *
 * Access Modes:
 * - linear: Recipients can only use Linear Mode (simplified UI)
 * - workflow: Recipients can only use Workflow Mode (node editor)
 * - both: Recipients can choose either mode
 */

// ============================================
// ACCESS MODE
// ============================================

/**
 * Controls which UI mode(s) recipients can access
 * - linear: Simple step-by-step interface for end users
 * - workflow: Full node-graph editor for developers
 * - both: Recipient can switch between modes
 */
export type ShareAccessMode = 'linear' | 'workflow' | 'both'

export const ACCESS_MODE_LABELS: Record<ShareAccessMode, string> = {
  linear: 'Linear Mode',
  workflow: 'Workflow Mode',
  both: 'Both Modes',
}

export const ACCESS_MODE_DESCRIPTIONS: Record<ShareAccessMode, string> = {
  linear: 'Simple step-by-step UI for easy generation',
  workflow: 'Full node editor for advanced users',
  both: 'Recipients can choose their preferred mode',
}

export function getAccessModeLabel(mode: ShareAccessMode): string {
  return ACCESS_MODE_LABELS[mode]
}

export function getAccessModeBadgeColor(mode: ShareAccessMode): string {
  const colors: Record<ShareAccessMode, string> = {
    linear: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    workflow: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    both: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  }
  return colors[mode]
}

// ============================================
// WORKFLOW SHARE (Direct User Invite)
// ============================================

/**
 * Represents a workflow shared directly with a specific user
 */
export interface WorkflowShare {
  id: string
  workflowId: string
  sharedBy: string // userId of sharer
  sharedWith: string // userId of recipient
  accessMode: ShareAccessMode
  createdAt: number
  // Note: All recipients have View + Fork permissions (no granular permission levels)
}

/**
 * Extended share info with user details (for display in UI)
 */
export interface WorkflowShareWithUser extends WorkflowShare {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

// ============================================
// SHARE LINK
// ============================================

/**
 * Shareable link for a workflow
 * Anyone with the link can access (but must be logged in)
 */
export interface WorkflowShareLink {
  id: string
  workflowId: string
  createdBy: string
  code: string // Unique link code (32+ chars)
  accessMode: ShareAccessMode
  isActive: boolean
  createdAt: number
  expiresAt?: number // Optional expiration (P2 feature)
}

/**
 * Generate the full share URL from a link code
 */
export function getShareUrl(code: string): string {
  // In production, this would use the actual domain
  return `${window.location.origin}/shared/${code}`
}

// ============================================
// SHARE SETTINGS (Per Workflow)
// ============================================

/**
 * Sharing settings for a workflow
 */
export interface WorkflowShareSettings {
  accessMode: ShareAccessMode // Default access mode for new shares
  isPublic: boolean // Listed in public gallery
  shareLink?: WorkflowShareLink // Active share link (if any)
}

export const DEFAULT_SHARE_SETTINGS: WorkflowShareSettings = {
  accessMode: 'linear',
  isPublic: false,
}

// ============================================
// FORK METADATA
// ============================================

/**
 * Metadata for forked (duplicated) workflows
 * Shows attribution to the original workflow
 */
export interface WorkflowForkMetadata {
  forkedFrom: {
    workflowId: string
    workflowName: string
    authorId: string
    authorName: string
    forkedAt: number
  } | null
}

// ============================================
// SHARED WORKFLOW (For "Shared with me" view)
// ============================================

/**
 * A workflow that has been shared with the current user
 */
export interface SharedWorkflow {
  id: string
  workflowId: string
  name: string
  description: string
  thumbnail: string
  nodeCount: number
  accessMode: ShareAccessMode
  sharedBy: {
    id: string
    name: string
    avatar?: string
  }
  sharedAt: number
}

// ============================================
// NOTIFICATIONS
// ============================================

export type ShareNotificationType = 'workflow_shared' | 'workflow_forked'

/**
 * Notification when a workflow is shared with a user
 */
export interface ShareNotification {
  id: string
  type: ShareNotificationType
  workflowId: string
  workflowName: string
  accessMode: ShareAccessMode
  sharedBy: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: number
  read: boolean
}

// ============================================
// USER SEARCH (For Share Dialog)
// ============================================

/**
 * User result from search (for adding to shares)
 */
export interface ShareableUser {
  id: string
  name: string
  email: string
  avatar?: string
}

// ============================================
// SHARE DIALOG PAYLOAD
// ============================================

/**
 * Payload for sharing a workflow
 */
export interface ShareWorkflowPayload {
  userIds: string[]
  accessMode: ShareAccessMode
}

/**
 * Payload for creating/updating a share link
 */
export interface ShareLinkPayload {
  accessMode: ShareAccessMode
  expiresAt?: number
}
