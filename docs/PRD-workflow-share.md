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


### 1.3 Goals (P1)
- Enable sharing workflows with other ComfyUI users and team members
- Support link-based sharing
- Provide workflow info preview


### 1.4 Non-Goals (P2)
- Support Direct invite via Email 
- Real-time collaborative editing (Figma-style)
- Edit permissions for shared workflows (view + duplicate only)
- Version control/history for shared workflows
- Email notifications
- Deliver in-app notifications for share events
- Analytics/tracking on shares
- Allow workflow builders to control which mode(s) recipients can access
- Control access mode: allow recipients to view in Workflow Mode (node editor), Linear Mode (simplified UI), or both**
---

## 2. User Stories

### 2.1 Workflow Owner
- **US-1:** As a workflow owner, I want to share my workflow with specific users so they can view and fork it.
- **US-2:** As a workflow owner, I want to generate a shareable link so I can quickly share without entering emails.
- **US-3:** As a workflow owner, I want to see who has access to my workflow at any time.
- **US-4:** As a workflow owner, I want to control whether recipients can access my workflow in Workflow Mode (node editor), Linear Mode (simplified UI), or both.


### 2.2 Share Recipient
- **US-7:** As a share recipient, I want to receive an in-app notification when someone shares a workflow with me.
- **US-8:** As a share recipient, I want to easily find workflows shared with me in my library.
- **US-9:** As a share recipient, I want to fork (duplicate) a shared workflow to create my own copy with attribution to the original.
- **US-10:** As a share recipient, I want to leave a shared workflow when I no longer need access.
- **US-11:** As a user with a share link, I want to log in and access the shared workflow.
- **US-12:** As a share recipient, I want to open the workflow in the allowed mode(s) - Linear Mode for easy use or Workflow Mode if permitted by the owner.

### 2.3 Workspace Admin
- **US-13:** As a workspace admin, I want to see all shared workflows within my workspace.
- **US-14:** As a workspace admin, I want to manage sharing permissions for team workflows.

---

## 3. Functional Requirements

### 3.1 Share Methods

#### 3.1.1 Direct Share (User Invite)
| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-1.1 | Search users by email or username | P0 |
| FR-1.2 | Add multiple users in single operation | P0 |
| FR-1.3 | Send in-app notification to invitee | P0 |
| FR-1.4 | Support inviting non-registered users (pending invite) | P2 |

#### 3.1.2 Link Sharing
| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-2.1 | Generate unique shareable link | P0 |
| FR-2.2 | Require login to access link (no anonymous access) | P0 |
| FR-2.3 | Copy link to clipboard | P0 |
| FR-2.4 | Disable/revoke link | P0 |
| FR-2.5 | Set link expiration date | P2 |

### 3.2 Permission Levels

| Permission | View | Fork (Duplicate) | Edit | Delete | Manage Access |
|------------|------|------------------|------|--------|---------------|
| Owner      | ✅   | ✅               | ✅   | ✅     | ✅            |
| Recipient  | ✅   | ✅               | ❌   | ❌     | ❌            |

**Note:** All share recipients have the same permission level: View + Fork. No granular permission selection needed for v1.

### 3.3 Access Mode Control

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

### 3.4 Fork Behavior (Duplicate with Attribution)

| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-4.1 | Fork creates a private copy owned by the user | P0 |
| FR-4.2 | Forked workflow displays "Forked from [Original Name] by [Author]" | P0 |
| FR-4.3 | Original workflow link/reference stored in forked workflow metadata | P0 |
| FR-4.4 | Forked workflow is fully independent (no sync with original) | P0 |
| FR-4.5 | Forked workflow has no access mode restrictions (owner has full access to both modes) | P0 |

### 3.5 Access Management

| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-5.1 | View list of all users with access | P0 |
| FR-5.2 | Remove user access | P0 |
| FR-5.3 | Workspace admins can manage any workflow in their workspace | P0 |
| FR-5.4 | Transfer ownership | P1 |

### 3.6 Shared Workflows View

| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-6.1 | "Shared with me" section in library | P0 |
| FR-6.2 | Show shared-by user on workflow card | P0 |
| FR-6.3 | Show allowed access mode badge on workflow card (Linear/Workflow/Both) | P0 |
| FR-6.4 | Leave/remove from "Shared with me" | P0 |
| FR-6.5 | Sort by date shared | P1 |

### 3.7 Notifications

| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-8.1 | In-app notification when workflow shared with you | P0 |
| FR-8.2 | Notification links directly to shared workflow | P0 |
| FR-8.3 | Notification center shows all share notifications | P1 |



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
