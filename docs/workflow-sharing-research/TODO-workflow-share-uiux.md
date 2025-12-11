# Workflow Share - UI/UX Implementation Todo

**Last Updated:** December 6, 2025
**Scope:** Frontend UI/UX only (no backend)

---

## Phase 1: Core Sharing (P0)

### 1.1 Types & Store Setup

- [x] Create `src/types/workflowShare.ts` with types:
  - [x] `ShareAccessMode` ('linear' | 'workflow' | 'both')
  - [x] `WorkflowShare`
  - [x] `WorkflowShareLink`
  - [x] `WorkflowShareSettings`
  - [x] `WorkflowForkMetadata`
  - [x] `ShareNotification`
- [x] Create `src/stores/shareStore.ts` with mock data and actions
- [x] Create `src/stores/notificationStore.ts` with mock data
- [x] Add mock shared workflows to `workspaceMockData.ts`
- [x] Add mock users for share search
- [x] Add mock notifications
- [x] Add mock share links

### 1.2 Share Dialog Updates

- [x] Update `ShareDialog.vue`:
  - [x] Add access mode selector (radio group: Linear / Workflow / Both)
  - [x] Set default to "Linear Mode"
  - [x] Remove permission level dropdowns (view+fork only)
  - [x] Add user search input with mock autocomplete
  - [x] Display people with access list
  - [x] Show access mode badge per user
  - [x] Add remove access (X) button per user
- [x] Add share link section:
  - [x] Generate link button / display existing link
  - [x] Copy link button with toast feedback
  - [x] Toggle link active/inactive
  - [x] Show info text based on access mode

### 1.3 Workflow Card Updates

- [x] Update `WorkflowCard.vue` props:
  - [x] `isShared?: boolean`
  - [x] `sharedBy?: { name: string; avatar?: string }`
  - [x] `accessMode?: ShareAccessMode`
  - [x] `forkedFrom?: { workflowName: string; authorName: string }`
- [x] Add shared badge display
- [x] Add access mode badge (Linear / Workflow / Both)
- [x] Add fork attribution text
- [x] Add "shared by" display for received shares

### 1.4 Workflow Context Menu Updates

- [x] Update `WorkflowContextMenu.vue`:
  - [x] Filter "Open in..." options based on `accessMode`
  - [x] Show only Linear if `accessMode === 'linear'`
  - [x] Show only Workflow if `accessMode === 'workflow'`
  - [x] Show both options if `accessMode === 'both'`
  - [x] Add Fork option for received shares
  - [x] Add Leave option for received shares
  - [x] Hide owner-only actions (Duplicate, Move, Rename, Share, Delete) for received shares

### 1.5 Workflows View - Shared Tab

- [x] Update `WorkflowsView.vue`:
  - [x] Add "Shared with me" tab
  - [x] Fetch and display shared workflows from mock store
  - [x] Show sharedBy info on cards
  - [x] Show access mode badges
  - [x] Add "Leave" option in context menu for shared workflows
  - [x] Add "Fork" option in context menu for shared workflows
  - [x] Hide favorites filter and create folder for shared tab

### 1.6 Shared Link Access Page

- [x] Create `src/views/SharedWorkflowView.vue`:
  - [x] Display workflow preview with VueFlow canvas
  - [x] Show workflow name and author
  - [x] Show access mode indicator
  - [x] Conditional open buttons based on access mode:
    - [x] "Run in Linear" button
    - [x] "Open in Editor" button (if allowed)
  - [x] "Fork to Library" button (icon only)
  - [x] Handle not-found / access-denied states
  - [x] Zoom controls (zoom in/out, fit to view)
  - [x] Node count badge
  - [x] Background workflow preview
- [x] Add route `/shared/:code` in router

### 1.7 Fork Functionality

- [x] Implement fork action in shareStore
- [x] Create forked workflow with `forkMetadata`
- [x] Show fork attribution on WorkflowCard
- [x] Forked workflows have no access restrictions (owner access)

### 1.8 Notifications System

- [x] Create `src/components/common/NotificationBell.vue`:
  - [x] Bell icon with unread count badge
  - [x] Dropdown panel on click
  - [x] List of notifications
  - [x] "Mark all as read" button
- [x] Create `src/components/common/NotificationItem.vue`:
  - [x] Avatar, message, timestamp
  - [x] Click to navigate to shared workflow
  - [x] Unread indicator styling
- [x] Add NotificationBell to app header/navbar (added to WorkspaceTopBar.vue)
- [x] Implement mock notifications in store

### 1.9 Access Mode Enforcement

- [x] Access mode checks implemented in `WorkflowContextMenu.vue` (shows appropriate open options)
- [x] Access mode checks implemented in `SharedWorkflowView.vue` (shows appropriate buttons)
- [x] Query params added to track shared workflow context
- [ ] Full route guard enforcement (requires backend integration)
- [ ] Add access checks in `LinearViewV2.vue` (optional - requires reading shared state from URL)
- [ ] Add access checks in `WorkflowEditorView.vue` (optional - requires reading shared state from URL)

---

## Phase 2: Enhanced Features (P1)

### 2.1 Link Expiration

- [ ] Add expiration date picker in ShareDialog
- [ ] Show expiration status on share link
- [ ] Handle expired link access (show message)

### 2.2 Pending Invites

- [ ] Support inviting non-registered emails
- [ ] Show pending invite status in people list
- [ ] Resend invite option

### 2.3 Ownership Transfer

- [ ] Create transfer ownership dialog
- [ ] Select new owner from people with access
- [ ] Confirmation step
- [ ] Update ownership display after transfer

### 2.4 Workspace Admin Management

- [ ] Add "Shared" tab to `/workspace/manage/content` (WorkspaceContentView.vue)
- [ ] List all shared workflows in workspace with share details
- [ ] Show who shared, who has access, access mode
- [ ] Ability to revoke shares
- [ ] Ability to change access modes
- [ ] Ability to deactivate share links

---

## Components Summary

| Component | Status | Phase | Notes |
|-----------|--------|-------|-------|
| `ShareDialog.vue` | Completed | 1.2 | Access mode, user search, share links |
| `WorkflowCard.vue` | Completed | 1.3 | Share/fork display props |
| `WorkflowContextMenu.vue` | Completed | 1.4 | Filter open options by access mode |
| `WorkflowsView.vue` | Completed | 1.5 | "Shared with me" tab |
| `SharedWorkflowView.vue` | Completed | 1.6 | Share link access with VueFlow preview |
| `NotificationBell.vue` | Completed | 1.8 | Header notification component |
| `NotificationItem.vue` | Completed | 1.8 | Notification list item |
| `shareStore.ts` | Completed | 1.1 | Share state management |
| `notificationStore.ts` | Completed | 1.1 | Notification state management |
| `workflowShare.ts` | Completed | 1.1 | Type definitions |

---

## File Structure

```text
src/
├── types/
│   └── workflowShare.ts          # Completed (1.1)
├── stores/
│   ├── shareStore.ts             # Completed (1.1)
│   └── notificationStore.ts      # Completed (1.1)
├── components/
│   ├── common/
│   │   ├── ShareDialog.vue       # Completed (1.2)
│   │   ├── NotificationBell.vue  # Completed (1.8)
│   │   └── NotificationItem.vue  # Completed (1.8)
│   └── workspace/
│       ├── WorkflowCard.vue      # Completed (1.3)
│       └── WorkflowContextMenu.vue # Completed (1.4)
├── views/
│   ├── SharedWorkflowView.vue    # Completed (1.6)
│   └── workspace/
│       └── WorkflowsView.vue     # Completed (1.5)
└── router.ts                     # Updated (1.6)
```

---

## Progress Tracker

| Phase | Sub-Phase | Description | Status |
|-------|-----------|-------------|--------|
| 1 | 1.1 | Types & Store Setup | Completed |
| 1 | 1.2 | Share Dialog Updates | Completed |
| 1 | 1.3 | Workflow Card Updates | Completed |
| 1 | 1.4 | Context Menu Updates | Completed |
| 1 | 1.5 | Workflows View - Shared Tab | Completed |
| 1 | 1.6 | Shared Link Access Page | Completed |
| 1 | 1.7 | Fork Functionality | Completed |
| 1 | 1.8 | Notifications System | Completed |
| 1 | 1.9 | Access Mode Enforcement | Partial (UI only) |
| 2 | 2.1 | Link Expiration | Not Started |
| 2 | 2.2 | Pending Invites | Not Started |
| 2 | 2.3 | Ownership Transfer | Not Started |
| 2 | 2.4 | Admin Management | Not Started |
