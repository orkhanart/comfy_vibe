# PRD: Workflow Share Feature

**Document Version:** 1.2
**Created:** December 6, 2025
**Status:** Draft

---

## 1. Overview

### 1.1 Problem Statement
Currently, ComfyUI users create workflows in isolation with no ability to share their work with teammates or the broader community. This limits collaboration, knowledge sharing, and the ability to build upon others' work.

### 1.2 Solution Summary
Implement a workflow sharing system that enables users to:
- Share workflows with specific ComfyUI users or team members via direct invite
- Share workflows via shareable links (requires login to access)
- Allow recipients to view and fork (duplicate with attribution) workflows
- **Control access mode: allow recipients to view in Workflow Mode (node editor), Linear Mode (simplified UI), or both**

### 1.3 Goals
- Enable sharing workflows with other ComfyUI users and team members
- Support both direct invite and link-based sharing
- Provide View + Duplicate permissions (no collaborative editing)
- Allow workflow builders to control which mode(s) recipients can access
- Deliver in-app notifications for share events

### 1.4 Non-Goals (v1)
- Real-time collaborative editing (Google Docs-style)
- Edit permissions for shared workflows (view + duplicate only)
- Version control/history for shared workflows
- Comments/annotations on shared workflows
- Email notifications (in-app only for v1)
- Analytics/tracking on shares

---

## 2. Current State Analysis

### 2.1 Existing Components
| Component | Location | Status |
|-----------|----------|--------|
| ShareDialog.vue | `src/components/common/` | UI Complete |
| WorkflowCard.vue | `src/components/workspace/` | Has share emit |
| WorkflowContextMenu.vue | `src/components/workspace/` | Has share action |
| WorkspaceStore | `src/stores/workspaceStore.ts` | Member management exists |

### 2.2 Existing Data Models
```typescript
// Already defined in src/types/workspace.ts
type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer'

interface WorkspaceMember {
  id: string
  userId: string
  name: string
  email: string
  avatar?: string
  role: WorkspaceRole
  joinedAt: number
}

interface WorkspaceInvite {
  id: string
  workspaceId: string
  email?: string
  code?: string
  role: Exclude<WorkspaceRole, 'owner'>
  createdBy: string
  createdAt: number
  expiresAt?: number
  usedAt?: number
  usedBy?: string
}
```

### 2.3 Gap Analysis
| Need | Current State | Action Required |
|------|---------------|-----------------|
| Workflow-specific sharing types | Not defined | Create new types |
| Share API endpoints | Not implemented | Define & implement |
| Share state management | Not in stores | Add to workspaceStore |
| Permission enforcement | Not implemented | Add middleware/guards |
| Link generation | Not implemented | Add utility functions |
| Email notifications | Not implemented | Add notification service |

---

## 3. User Stories

### 3.1 Workflow Owner
- **US-1:** As a workflow owner, I want to share my workflow with specific users so they can view and fork it.
- **US-2:** As a workflow owner, I want to generate a shareable link so I can quickly share without entering emails.
- **US-3:** As a workflow owner, I want to revoke access from users who no longer need it.
- **US-4:** As a workflow owner, I want to see who has access to my workflow at any time.
- **US-5:** As a workflow owner, I want to control whether recipients can access my workflow in Workflow Mode (node editor), Linear Mode (simplified UI), or both.

### 3.2 Share Recipient
- **US-7:** As a share recipient, I want to receive an in-app notification when someone shares a workflow with me.
- **US-8:** As a share recipient, I want to easily find workflows shared with me in my library.
- **US-9:** As a share recipient, I want to fork (duplicate) a shared workflow to create my own copy with attribution to the original.
- **US-10:** As a share recipient, I want to leave a shared workflow when I no longer need access.
- **US-11:** As a user with a share link, I want to log in and access the shared workflow.
- **US-12:** As a share recipient, I want to open the workflow in the allowed mode(s) - Linear Mode for easy use or Workflow Mode if permitted by the owner.

### 3.3 Workspace Admin
- **US-13:** As a workspace admin, I want to see all shared workflows within my workspace.
- **US-14:** As a workspace admin, I want to manage sharing permissions for team workflows.

---

## 4. Functional Requirements

### 4.1 Share Methods

#### 4.1.1 Direct Share (User Invite)
| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-1.1 | Search users by email or username | P0 |
| FR-1.2 | Add multiple users in single operation | P0 |
| FR-1.3 | Send in-app notification to invitee | P0 |
| FR-1.4 | Support inviting non-registered users (pending invite) | P2 |

#### 4.1.2 Link Sharing
| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-2.1 | Generate unique shareable link | P0 |
| FR-2.2 | Require login to access link (no anonymous access) | P0 |
| FR-2.3 | Copy link to clipboard | P0 |
| FR-2.4 | Disable/revoke link | P0 |
| FR-2.5 | Set link expiration date | P2 |

### 4.2 Permission Levels

| Permission | View | Fork (Duplicate) | Edit | Delete | Manage Access |
|------------|------|------------------|------|--------|---------------|
| Owner      | ✅   | ✅               | ✅   | ✅     | ✅            |
| Recipient  | ✅   | ✅               | ❌   | ❌     | ❌            |

**Note:** All share recipients have the same permission level: View + Fork. No granular permission selection needed for v1.

### 4.3 Access Mode Control

Workflow builders can control which mode(s) recipients are allowed to access:

| Access Mode | Description | Use Case |
|-------------|-------------|----------|
| **Linear Mode Only** | Recipients can only use the simplified step-by-step UI | For end-users who just want to generate outputs without understanding the workflow internals |
| **Workflow Mode Only** | Recipients can only use the full node-graph editor | For developers/builders who want to learn from or modify the workflow |
| **Both Modes** | Recipients can switch between Linear and Workflow modes | Full flexibility for recipients |

#### Functional Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-2.5 | Owner can select allowed access mode(s) when sharing | P0 |
| FR-2.6 | Default access mode is "Linear Mode Only" for simpler UX | P0 |
| FR-2.7 | Access mode setting applies to both direct shares and link shares | P0 |
| FR-2.8 | Recipients see only allowed mode options when opening shared workflow | P0 |
| FR-2.9 | If only one mode is allowed, workflow opens directly in that mode | P0 |
| FR-2.10 | Forked workflows inherit no access restrictions (owner has full access) | P0 |

### 4.4 Fork Behavior (Duplicate with Attribution)

| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-4.1 | Fork creates a private copy owned by the user | P0 |
| FR-4.2 | Forked workflow displays "Forked from [Original Name] by [Author]" | P0 |
| FR-4.3 | Original workflow link/reference stored in forked workflow metadata | P0 |
| FR-4.4 | Forked workflow is fully independent (no sync with original) | P0 |
| FR-4.5 | Forked workflow has no access mode restrictions (owner has full access to both modes) | P0 |

### 4.5 Access Management

| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-5.1 | View list of all users with access | P0 |
| FR-5.2 | Remove user access | P0 |
| FR-5.3 | Workspace admins can manage any workflow in their workspace | P0 |
| FR-5.4 | Transfer ownership | P1 |

### 4.6 Shared Workflows View

| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-6.1 | "Shared with me" section in library | P0 |
| FR-6.2 | Show shared-by user on workflow card | P0 |
| FR-6.3 | Show allowed access mode badge on workflow card (Linear/Workflow/Both) | P0 |
| FR-6.4 | Leave/remove from "Shared with me" | P0 |
| FR-6.5 | Sort by date shared | P1 |

### 4.7 Notifications

| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-8.1 | In-app notification when workflow shared with you | P0 |
| FR-8.2 | Notification links directly to shared workflow | P0 |
| FR-8.3 | Notification center shows all share notifications | P1 |

---

## 5. Technical Design

### 5.1 New Data Types

```typescript
// src/types/workflowShare.ts

// Access mode determines which UI mode(s) recipients can use
export type ShareAccessMode = 'linear' | 'workflow' | 'both'

export interface WorkflowShare {
  id: string
  workflowId: string
  sharedBy: string        // userId of sharer
  sharedWith: string      // userId of recipient
  accessMode: ShareAccessMode  // which mode(s) recipient can access
  createdAt: number
  // No permission field needed - all recipients have view+fork
}

export interface WorkflowShareLink {
  id: string
  workflowId: string
  createdBy: string
  code: string            // unique link code (32+ chars)
  accessMode: ShareAccessMode  // which mode(s) link users can access
  isActive: boolean
  createdAt: number
  expiresAt?: number      // optional expiration (P2)
}

export interface WorkflowShareSettings {
  accessMode: ShareAccessMode  // default: 'linear'
  shareLink?: WorkflowShareLink
}

export interface WorkflowForkMetadata {
  forkedFrom: {
    workflowId: string
    workflowName: string
    authorId: string
    authorName: string
    forkedAt: number
  } | null
}

export interface ShareNotification {
  id: string
  type: 'workflow_shared'
  workflowId: string
  workflowName: string
  accessMode: ShareAccessMode  // so recipient knows what they can access
  sharedBy: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: number
  read: boolean
}
```

### 5.2 API Endpoints

```typescript
// ============================================
// DIRECT SHARING
// ============================================

// Share workflow with users
POST   /api/workflows/:workflowId/shares
Body: {
  userIds: string[],           // or emails for pending invites
  accessMode: ShareAccessMode  // 'linear' | 'workflow' | 'both'
}
Response: { shares: WorkflowShare[] }

// Get all shares for a workflow
GET    /api/workflows/:workflowId/shares
Response: { shares: WorkflowShare[], shareSettings: WorkflowShareSettings }

// Remove user access
DELETE /api/workflows/:workflowId/shares/:shareId

// Update share settings (access mode, etc.)
PATCH  /api/workflows/:workflowId/share-settings
Body: { accessMode?: ShareAccessMode }

// ============================================
// LINK SHARING
// ============================================

// Create/get share link
POST   /api/workflows/:workflowId/share-link
Body: { accessMode: ShareAccessMode }  // inherits from share settings if not provided
Response: { shareLink: WorkflowShareLink }

// Get existing share link
GET    /api/workflows/:workflowId/share-link
Response: { shareLink: WorkflowShareLink | null }

// Update share link
PATCH  /api/workflows/:workflowId/share-link
Body: { isActive?: boolean, accessMode?: ShareAccessMode }

// Delete share link
DELETE /api/workflows/:workflowId/share-link

// Access workflow via share link (requires auth)
GET    /api/shared/:code
Response: {
  workflow: Workflow,
  accessMode: ShareAccessMode,  // what modes the user can access
  canFork: true
}

// ============================================
// FORK
// ============================================

// Fork a shared workflow
POST   /api/workflows/:workflowId/fork
Response: { workflow: Workflow }  // New workflow with fork metadata

// ============================================
// USER'S SHARED WORKFLOWS
// ============================================

// Get workflows shared with me
GET    /api/users/me/shared-workflows
Response: { workflows: SharedWorkflow[] }

// Leave shared workflow
DELETE /api/users/me/shared-workflows/:workflowId

// ============================================
// NOTIFICATIONS
// ============================================

// Get notifications
GET    /api/users/me/notifications
Query: { unreadOnly?: boolean }
Response: { notifications: ShareNotification[] }

// Mark notification as read
PATCH  /api/users/me/notifications/:notificationId
Body: { read: true }

// Mark all as read
POST   /api/users/me/notifications/mark-all-read
```

### 5.3 Store Updates

```typescript
// src/stores/shareStore.ts (new store)

interface ShareState {
  sharedWithMe: SharedWorkflow[]
  notifications: ShareNotification[]
  unreadCount: number
}

actions: {
  // Share operations
  shareWorkflow(workflowId: string, userIds: string[]): Promise<WorkflowShare[]>
  getWorkflowShares(workflowId: string): Promise<WorkflowShare[]>
  removeShare(workflowId: string, shareId: string): Promise<void>

  // Link operations
  createShareLink(workflowId: string): Promise<WorkflowShareLink>
  getShareLink(workflowId: string): Promise<WorkflowShareLink | null>
  toggleShareLink(workflowId: string, isActive: boolean): Promise<void>
  deleteShareLink(workflowId: string): Promise<void>

  // Fork
  forkWorkflow(workflowId: string): Promise<Workflow>

  // Shared with me
  fetchSharedWithMe(): Promise<void>
  leaveSharedWorkflow(workflowId: string): Promise<void>

  // Link access
  accessSharedLink(code: string): Promise<Workflow>

  // Notifications
  fetchNotifications(): Promise<void>
  markAsRead(notificationId: string): Promise<void>
  markAllAsRead(): Promise<void>
}

getters: {
  hasUnreadNotifications: boolean
}
```

### 5.4 Component Updates

#### ShareDialog.vue (Simplify existing)
```vue
<script setup lang="ts">
interface Props {
  workflowId: string
  workflowName: string
  currentShares?: WorkflowShare[]
  shareLink?: WorkflowShareLink | null
}

const emit = defineEmits<{
  share: [userIds: string[]]
  removeAccess: [shareId: string]
  createLink: []
  toggleLink: [isActive: boolean]
  deleteLink: []
  copyLink: []
}>()
</script>
```

#### WorkflowCard.vue (Add fork attribution)
```vue
<script setup lang="ts">
interface Props {
  // ... existing props
  isShared?: boolean           // Show shared badge
  sharedBy?: {                 // For "shared with me" view
    name: string
    avatar?: string
  }
  forkedFrom?: {               // Fork attribution
    workflowName: string
    authorName: string
  }
}
</script>

<template>
  <!-- Shared indicator -->
  <Badge v-if="isShared" variant="outline" class="text-xs">
    Shared
  </Badge>

  <!-- Fork attribution -->
  <div v-if="forkedFrom" class="text-xs text-muted-foreground">
    Forked from {{ forkedFrom.workflowName }} by {{ forkedFrom.authorName }}
  </div>
</template>
```

### 5.5 New Routes

```typescript
// src/router/index.ts

// Shared link access (redirects to login if not authenticated)
{
  path: '/shared/:code',
  name: 'shared-workflow',
  component: () => import('@/views/SharedWorkflowView.vue'),
  meta: { requiresAuth: true }
}
```

### 5.6 Workflow Model Extension

```typescript
// Extend existing Workflow interface
interface Workflow {
  // ... existing fields

  // New sharing fields
  ownerId: string
  shareLink?: WorkflowShareLink
  forkMetadata?: WorkflowForkMetadata
}
```

---

## 6. UI/UX Design

### 6.1 Share Dialog (with Access Mode Control)

```
┌─────────────────────────────────────────────────────────────┐
│  Share "Workflow Name"                              [X]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Access Mode                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ (•) Linear Mode    - Simple step-by-step UI         │   │
│  │ ( ) Workflow Mode  - Full node editor               │   │
│  │ ( ) Both Modes     - Recipient can choose           │   │
│  └─────────────────────────────────────────────────────┘   │
│  ℹ️ Controls how recipients can open this workflow         │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Add people                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔍 Search by email or username...                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  People with access                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 👤 John Doe (you)                           Owner   │   │
│  │ 👤 jane@example.com             [Linear Mode]     ✕ │   │
│  │ 👤 bob@example.com              [Linear Mode]     ✕ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Get shareable link                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔗 https://comfy.app/shared/abc123...    [Copy] [⚙] │   │
│  └─────────────────────────────────────────────────────┘   │
│  ℹ️ Anyone with this link can view/fork in Linear Mode     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                    [Done]   │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Workflow Card States

**My Workflow (with shares):**
```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │    [Thumbnail]       │  │
│  └──────────────────────┘  │
│  📄 Workflow Name     [⋮]  │
│  [👥 3 people]             │
│  Updated 2h ago            │
└────────────────────────────┘
```

**Shared with Me (Linear Mode):**
```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │    [Thumbnail]       │  │
│  └──────────────────────┘  │
│  📄 Workflow Name     [⋮]  │
│  Shared by Jane Doe        │
│  [▶ Run] [Linear]          │
└────────────────────────────┘
```

**Shared with Me (Both Modes):**
```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │    [Thumbnail]       │  │
│  └──────────────────────┘  │
│  📄 Workflow Name     [⋮]  │
│  Shared by Jane Doe        │
│  [▶ Run] [Linear | Editor] │
└────────────────────────────┘
```

**Forked Workflow:**
```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │    [Thumbnail]       │  │
│  └──────────────────────┘  │
│  📄 My Copy           [⋮]  │
│  🍴 Forked from "Original" │
│     by Jane Doe            │
└────────────────────────────┘
```

### 6.3 Workflows View with Tabs

```
┌──────────────────────────────────────────────────────────────────┐
│  Workflows                                                        │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ [All] [My Workflows] [Shared with me]                    │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Shared with me (4)                                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                 │
│  │ Flow 1  │ │ Flow 2  │ │ Flow 3  │ │ Flow 4  │                 │
│  │ by John │ │ by Jane │ │ by Bob  │ │ by Amy  │                 │
│  │ [Fork]  │ │ [Fork]  │ │ [Fork]  │ │ [Fork]  │                 │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                 │
└──────────────────────────────────────────────────────────────────┘
```

### 6.4 Notification Bell

```
┌──────────────────────────────────────┐
│  🔔 Notifications                    │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │ 👤 Jane shared "Portrait Gen"  │  │
│  │    with you                    │  │
│  │    2 minutes ago        [View] │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ 👤 Bob shared "Upscaler v2"    │  │
│  │    with you                    │  │
│  │    1 hour ago           [View] │  │
│  └────────────────────────────────┘  │
│                                      │
│  [Mark all as read]                  │
└──────────────────────────────────────┘
```

### 6.5 Shared Link Access Page

**Linear Mode Only:**
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│                    🔗 Shared Workflow                            │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │              [Workflow Thumbnail Preview]                  │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│                   "Portrait Generator v3"                        │
│                   Shared by Jane Doe                             │
│                   📱 Linear Mode                                 │
│                                                                   │
│                [▶ Open in Linear] [Fork to My Library]           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Both Modes Available:**
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│                    🔗 Shared Workflow                            │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │              [Workflow Thumbnail Preview]                  │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│                   "Portrait Generator v3"                        │
│                   Shared by Jane Doe                             │
│                                                                   │
│                   Open as:                                        │
│                   [▶ Linear Mode] [🔧 Workflow Editor]           │
│                                                                   │
│                   [Fork to My Library]                           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. Security Considerations

### 7.1 Access Control
- All share operations require authentication
- Share links require login to access (no anonymous viewing)
- Workflow owner and workspace admins can manage shares
- Permission checks on every workflow access

### 7.2 Link Security
- Share links use cryptographically secure random codes (32+ chars)
- Links can be disabled/revoked instantly by owner or admin
- Links only grant view + fork access (no edit)

### 7.3 Data Privacy
- Private workflows only accessible via direct share or link
- Fork attribution preserves original author credit

---

## 8. Implementation Phases

### Phase 1: MVP - Direct Sharing + Link Sharing (P0)
- [ ] Define TypeScript types (`WorkflowShare`, `WorkflowShareLink`, `WorkflowForkMetadata`, `ShareAccessMode`)
- [ ] Create `shareStore.ts` with actions
- [ ] Update ShareDialog with access mode selector (Linear/Workflow/Both)
- [ ] Add user search functionality in share dialog
- [ ] Implement link generation and copy-to-clipboard
- [ ] Add "Shared with me" tab in WorkflowsView
- [ ] Create SharedWorkflowView for link access with mode-aware open buttons
- [ ] Implement access mode enforcement (route guards)
- [ ] Implement fork functionality with attribution
- [ ] Add fork attribution display on WorkflowCard
- [ ] Add access mode badge on shared workflow cards
- [ ] Build in-app notification system
- [ ] Add notification bell to header

### Phase 2: Enhanced Features (P2)
- [ ] Link expiration dates
- [ ] Pending invites for non-registered users
- [ ] Transfer ownership functionality
- [ ] Workspace admin oversight dashboard

---

## 9. Decisions Made

| Question | Decision |
|----------|----------|
| Who can access shared links? | Logged-in users only |
| What permissions do recipients get? | View + Fork (no edit) |
| How does forking work? | Creates private copy with "Forked from X by Y" attribution |
| Analytics on shares? | None for v1 |
| Who can manage shares? | Owner + Workspace admins |
| Notification method? | In-app only (no email for v1) |
| **Access mode control?** | **Owner chooses: Linear Mode only, Workflow Mode only, or Both** |
| **Default access mode?** | **Linear Mode only (simplest for end users)** |
| **Forked workflow access?** | **Full access to both modes (no restrictions for owner)** |

---

## 10. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| User authentication | Backend | Exists |
| User search API | Backend | Needs implementation |
| In-app notification system | Frontend | Needs implementation |
| Workflow storage API | Backend | Partially exists |

---

## 11. Success Criteria

| Criteria | Definition |
|----------|------------|
| Feature complete | All P0 items implemented and working |
| Usable | Users can share via direct invite and link |
| Fork works | Forked workflows show attribution correctly |
| Notifications work | Users see share notifications in-app |

---

## 12. Appendix

### A. Existing Components to Modify

| Component | Changes Needed |
|-----------|----------------|
| `ShareDialog.vue` | Add access mode selector (Linear/Workflow/Both), remove permission dropdowns |
| `WorkflowCard.vue` | Add shared badge, sharedBy, forkedFrom, accessMode props |
| `WorkflowsView.vue` | Add "Shared with me" tab |
| `WorkflowContextMenu.vue` | Show only allowed mode options for shared workflows |
| `LinearView.vue` / `LinearViewV2.vue` | Add access check for shared workflows |
| `WorkflowEditorView.vue` | Add access check for shared workflows |

### B. New Components to Create

| Component | Purpose |
|-----------|---------|
| `SharedWorkflowView.vue` | Page for accessing workflow via share link |
| `NotificationBell.vue` | Header notification icon with dropdown |
| `NotificationItem.vue` | Individual notification in dropdown |

### C. New Files to Create

| File | Purpose |
|------|---------|
| `src/types/workflowShare.ts` | Share-related type definitions |
| `src/stores/shareStore.ts` | Share state management |
| `src/stores/notificationStore.ts` | Notification state management |

---

*Last updated: December 6, 2025*
